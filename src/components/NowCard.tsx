import Link from "next/link";
import type { NextStep } from "@/lib/nextStep";

export function NowCard({ step }: { step: NextStep }) {
  return (
    <section className="mt-6 rounded-3xl bg-blue-deep p-5 text-paper">
      <p className="text-xs uppercase tracking-[0.16em] text-paper/70">{step.kicker}</p>
      <h2 className="mt-2 font-serif text-2xl">{step.title}</h2>
      <p className="mt-2 text-sm leading-6 text-paper/80">{step.text}</p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Link href={step.href} className="inline-flex min-h-11 items-center rounded-full bg-paper px-4 py-3 text-sm font-medium text-blue-deep">{step.action}</Link>
        {step.official ? (
          <a href={step.official.href} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center rounded-full border border-paper/40 px-4 py-3 text-sm">
            {step.official.label}
          </a>
        ) : null}
      </div>
    </section>
  );
}
