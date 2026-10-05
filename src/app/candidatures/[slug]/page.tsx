import Link from "next/link";
import { notFound } from "next/navigation";
import { candidatureById, candidatures } from "@/lib/candidatures";
import { GuideSteps, ProgressLine } from "@/components/GuideSteps";
import { PartVideos } from "@/components/PartVideos";
import { ProcedureHero } from "@/components/ProcedureCard";
import { photoFor } from "@/lib/photos";
import { doneSteps, linksForCategory, videosFor } from "@/lib/db";
import { requireUser } from "@/lib/guard";

export function generateStaticParams() {
  return candidatures.map((item) => ({ slug: item.id }));
}

export default async function CandidaturePage({ params }: { params: Promise<{ slug: string }> }) {
  const user = await requireUser();
  const { slug } = await params;
  const track = candidatureById(slug);
  if (!track) notFound();
  const done = new Set(doneSteps(user.id));
  const finished = track.steps.filter((step) => done.has(step.id)).length;
  const contacts = linksForCategory("contact");

  return (
    <div className="mx-auto max-w-3xl px-5 py-8 md:py-12">
      <Link href="/candidatures" className="text-sm text-blue">Toutes les voies</Link>
      <ProcedureHero photo={photoFor(track.id)} />
      <p className="mt-4 text-sm uppercase tracking-[0.16em] text-blue">{track.menu}</p>
      <h1 className="mt-2 font-serif text-3xl md:text-4xl">{track.title}</h1>
      <p className="mt-3 rounded-2xl bg-sand px-4 py-3 text-sm">{track.forWhom}</p>
      <p className="mt-3 text-muted">{track.intro}</p>
      <section className="mt-4 rounded-2xl border border-line bg-card p-4 text-sm leading-6">
        <p>Parcourstudent t&apos;accompagne et t&apos;ouvre le portail. Il ne dépose pas la demande à ta place. Tu la fais du début à la fin. Bonne chance.</p>
        <p className="mt-2">Qui peut postuler : {track.forWhom}</p>
        <p className="mt-2">À préparer : les documents sont ceux que le portail affiche pour ton dossier. Rassemble-les avant de commencer. Ils restent chez toi.</p>
      </section>
      <PartVideos videos={videosFor("candidature", track.id)} />
      <ProgressLine finished={finished} total={track.steps.length} />
      <GuideSteps steps={track.steps} done={done} back={`/candidatures/${track.id}`} />
      <section className="mt-8 rounded-2xl border border-line bg-card p-5 text-sm leading-6">
        <h2 className="font-serif text-2xl">Si tu n&apos;y arrives pas seul</h2>
        <p className="mt-2">Chacun peut faire sa demande du début à la fin, sur le portail officiel. Un contact ne remplace pas cette démarche.</p>
        {contacts.length === 0 ? (
          <p className="mt-2 text-muted">Aucun contact n&apos;est publié pour le moment.</p>
        ) : (
          <ul className="mt-3 grid gap-2">
            {contacts.map((contact) => (
              <li key={contact.id}>
                <a className="font-medium text-blue underline" href={contact.url} target="_blank" rel={contact.affiliate ? "noreferrer sponsored" : "noreferrer"}>{contact.title}</a>
                {contact.affiliate ? <span className="ml-2 text-xs uppercase text-muted">Affiliation</span> : null}
                {contact.note && <span className="mt-1 block text-muted">{contact.note}</span>}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
