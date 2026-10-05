import Link from "next/link";
import { toggleStepAction } from "@/lib/actions";
import { PartVideos } from "@/components/PartVideos";
import { videosFor } from "@/lib/db";

type GuideStep = {
  id: string;
  title: string;
  guide: string[];
  links: { label: string; href: string }[];
};

export function ProgressLine({ finished, total }: { finished: number; total: number }) {
  const percent = total === 0 ? 0 : Math.round((finished / total) * 100);
  return (
    <div className="mt-4">
      <p className="text-sm text-muted">{finished} étape{finished > 1 ? "s" : ""} faite{finished > 1 ? "s" : ""} sur {total}</p>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-sand">
        <div className="h-full bg-blue" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

export function GuideSteps({ steps, done, back }: { steps: GuideStep[]; done: Set<string>; back: string }) {
  const current = steps.find((step) => !done.has(step.id));
  return (
    <>
      <nav aria-label="Étapes" className="sticky top-0 z-20 -mx-5 mt-6 border-b border-line bg-paper/95 px-5 py-2 backdrop-blur">
        <ul className="flex gap-2 overflow-x-auto">
          {steps.map((step, index) => (
            <li key={step.id} className="shrink-0">
              <a href={`#etape-${step.id}`} className={`inline-flex max-w-44 items-center gap-2 rounded-full border px-3 py-2 text-sm ${step.id === current?.id ? "border-blue bg-blue text-paper" : "border-line bg-card"}`}>
                <span className="font-medium">{done.has(step.id) ? "✓" : index + 1}</span>
                <span className="truncate">{step.title}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <ol className="mt-6 grid gap-4">
        {steps.map((step, index) => {
          const finished = done.has(step.id);
          const here = step.id === current?.id;
          return (
            <li id={`etape-${step.id}`} key={step.id} className={`scroll-mt-24 rounded-2xl border bg-card p-5 ${here ? "border-blue" : "border-line"} ${finished ? "opacity-70" : ""}`}>
              <p className="text-xs uppercase tracking-[0.16em] text-muted">
                {here ? "Ton étape" : finished ? "Fait" : `Étape ${index + 1}`}
              </p>
              <h2 className="mt-1 font-serif text-2xl">{step.title}</h2>
              <PartVideos videos={videosFor("step", step.id)} />
              <ul className="mt-3 grid gap-2 text-sm leading-6">
                {step.guide.map((line) => <li key={line}>{line}</li>)}
              </ul>
              <div className="mt-4 flex flex-wrap gap-2">
                {step.links.map((link) => (
                  link.href.startsWith("/") ? (
                    <Link key={link.href + link.label} href={link.href} className="inline-flex min-h-11 items-center rounded-full border border-line px-4 py-3 text-sm text-blue">{link.label}</Link>
                  ) : (
                    <a key={link.href + link.label} href={link.href} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center rounded-full bg-blue px-4 py-3 text-sm text-paper">{link.label}</a>
                  )
                ))}
              </div>
              <form action={toggleStepAction} className="mt-4">
                <input type="hidden" name="step" value={step.id} />
                <input type="hidden" name="back" value={back} />
                <button className="min-h-11 rounded-full border border-blue px-4 py-3 text-sm text-blue" type="submit">
                  {finished ? "Remettre à faire" : "J'ai fini cette étape"}
                </button>
              </form>
            </li>
          );
        })}
      </ol>
    </>
  );
}
