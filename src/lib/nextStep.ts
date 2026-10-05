import { candidatureById, candidatures } from "@/lib/candidatures";
import { demarcheById } from "@/lib/demarches";
import { chapters, phaseOf } from "@/lib/moments";
import { countryPaths } from "@/lib/pays";

export type NextStep = {
  kicker: string;
  title: string;
  text: string;
  href: string;
  action: string;
  official?: { href: string; label: string };
};

type Track = {
  href: string;
  menu: string;
  steps: { id: string; title: string; guide: string[]; links: { label: string; href: string }[] }[];
};

function fromTrack(track: Track, done: Set<string>, kicker: string): NextStep | null {
  const index = track.steps.findIndex((step) => !done.has(step.id));
  if (index < 0) return null;
  const step = track.steps[index];
  const official = step.links.find((link) => link.href.startsWith("http"));
  return {
    kicker,
    title: step.title,
    text: step.guide[0] ?? "",
    href: `${track.href}#etape-${step.id}`,
    action: "Ouvrir cette étape",
    official: official ? { href: official.href, label: official.label } : undefined,
  };
}

function candidatureTrack(id: string): Track | null {
  const track = candidatureById(id);
  if (!track) return null;
  return { href: `/candidatures/${track.id}`, menu: track.menu, steps: track.steps };
}

function demarcheTrack(id: string): Track | null {
  const track = demarcheById(id);
  if (!track) return null;
  return { href: `/demarches/${track.id}`, menu: track.menu, steps: track.steps };
}

function furthest(tracks: Track[], done: Set<string>) {
  let best: { track: Track; count: number } | null = null;
  for (const track of tracks) {
    const count = track.steps.filter((step) => done.has(step.id)).length;
    if (count === 0 || count === track.steps.length) continue;
    if (!best || count > best.count) best = { track, count };
  }
  return best?.track ?? null;
}

function recommendedCandidature(country: string | null) {
  const path = countryPaths[country ?? ""] ?? countryPaths.autre;
  const id = path.href.match(/^\/candidatures\/([^/]+)$/)?.[1];
  return id ? candidatureTrack(id) : null;
}

function updateSituation(text: string): NextStep {
  return {
    kicker: "Ensuite",
    title: "Mets ta situation à jour",
    text,
    href: "/annee",
    action: "Choisir ma situation",
  };
}

export function nextFor(user: { situation: string | null; country: string | null }, done: Set<string>): NextStep {
  if (!user.situation) {
    return {
      kicker: "Pour commencer",
      title: "Dis où tu en es",
      text: "Le compte n'affiche que les étapes de ta situation. Une réponse suffit.",
      href: "/annee",
      action: "Choisir ma situation",
    };
  }

  if (phaseOf(user.situation) === "avant") {
    const beforeVisa = candidatures.filter((item) => item.id !== "visa").map((item) => candidatureTrack(item.id)).filter((item): item is Track => Boolean(item));
    const started = furthest(beforeVisa, done);
    const recommended = recommendedCandidature(user.country);
    const chosen = user.situation === "admission" ? candidatureTrack("visa") : started ?? recommended ?? candidatureTrack("campus-france");
    if (chosen) {
      const open = fromTrack(chosen, done, chosen.menu);
      if (open) return open;
    }
    if (user.situation === "candidature") {
      const visa = candidatureTrack("visa");
      const open = visa ? fromTrack(visa, done, "Après l'accord") : null;
      if (open) return open;
    }
    return updateSituation("Les étapes de cette période sont cochées. Quand ta situation change, le guide change avec elle.");
  }

  const links = chapters[user.situation]?.links ?? [];
  for (const link of links) {
    const id = link.href.match(/^\/demarches\/([^/]+)$/)?.[1];
    if (!id) continue;
    const track = demarcheTrack(id);
    if (!track) continue;
    const open = fromTrack(track, done, track.menu);
    if (open) return open;
  }
  return updateSituation("Les étapes de cette période sont cochées. Quand l'année change, indique-le ici.");
}
