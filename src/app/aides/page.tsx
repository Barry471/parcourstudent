import { aides } from "@/lib/aides";
import { requireUser } from "@/lib/guard";

export default async function AidsPage() {
  await requireUser();
  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <h1 className="font-serif text-4xl">Aides et avantages</h1>
      <p className="mt-2 text-muted">Ce qu&apos;un étudiant étranger peut demander. Le droit se vérifie sur le site indiqué, pas dans un groupe.</p>
      <ul className="mt-6 grid gap-4">
        {aides.map((aid) => (
          <li key={aid.id} className="rounded-2xl border border-line bg-card p-5">
            <h2 className="font-serif text-2xl">{aid.title}</h2>
            <p className="mt-2 text-sm"><strong>Pour qui. </strong>{aid.who}</p>
            <p className="mt-2 text-sm"><strong>Avantage. </strong>{aid.benefit}</p>
            <p className="mt-2 rounded-xl bg-amber-soft px-3 py-2 text-sm">{aid.caution}</p>
            <a className="mt-3 inline-block text-sm text-blue underline" href={aid.href} target="_blank" rel="noreferrer">{aid.label}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
