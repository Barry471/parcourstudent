import Link from "next/link";
import { notFound } from "next/navigation";
import { demarcheById, demarches } from "@/lib/demarches";
import { GuideSteps, ProgressLine } from "@/components/GuideSteps";
import { UsefulLinks } from "@/components/UsefulLinks";
import { PartVideos } from "@/components/PartVideos";
import { ProcedureHero } from "@/components/ProcedureCard";
import { photoFor } from "@/lib/photos";
import { doneSteps, linksForCategory, videosFor } from "@/lib/db";
import { requireUser } from "@/lib/guard";
import { phaseOf } from "@/lib/moments";

export function generateStaticParams() {
  return demarches.map((item) => ({ slug: item.id }));
}

export default async function DemarchePage({ params }: { params: Promise<{ slug: string }> }) {
  const user = await requireUser();
  const { slug } = await params;
  const demarche = demarcheById(slug);
  if (!demarche) notFound();
  const done = new Set(doneSteps(user.id));
  const partners = phaseOf(user.situation) === "france"
    ? [
        ...linksForCategory(demarche.category),
        ...(demarche.id === "quotidien" ? linksForCategory("transport") : []),
      ].filter((link, index, all) => all.findIndex((item) => item.id === link.id) === index)
    : [];
  const finished = demarche.steps.filter((step) => done.has(step.id)).length;

  return (
    <div className="mx-auto max-w-3xl px-5 py-8 md:py-12">
      <Link href="/parcours" className="text-sm text-blue">Toutes les démarches</Link>
      <ProcedureHero photo={photoFor(demarche.id)} />
      <p className="mt-4 text-sm uppercase tracking-[0.16em] text-blue">{demarche.menu}</p>
      <h1 className="mt-2 font-serif text-3xl md:text-4xl">{demarche.title}</h1>
      <p className="mt-3 text-muted">{demarche.intro}</p>
      {partners.length > 0 && (
        <section className="mt-6 rounded-3xl border border-blue bg-card p-5">
          <h2 className="font-serif text-2xl">Liens utiles</h2>
          <UsefulLinks links={partners} showGroups={false} />
        </section>
      )}
      <PartVideos videos={videosFor("demarche", demarche.id)} />
      <ProgressLine finished={finished} total={demarche.steps.length} />
      <GuideSteps steps={demarche.steps} done={done} back={`/demarches/${demarche.id}`} />
    </div>
  );
}
