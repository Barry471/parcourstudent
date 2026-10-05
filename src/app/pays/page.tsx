import Link from "next/link";
import { countries } from "@/lib/content";
import { campusFrancePath, countryPaths } from "@/lib/pays";
import { requireUser } from "@/lib/guard";

export default async function PaysPage() {
  const user = await requireUser();
  const country = countries.find((item) => item.id === user.country);
  const guide = countryPaths[user.country ?? "autre"] ?? campusFrancePath;
  const external = guide.href.startsWith("http");
  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <p className="text-sm uppercase tracking-[0.16em] text-blue">Ton pays</p>
      <h1 className="mt-2 font-serif text-4xl">{country ? country.name : "Pays à préciser"}</h1>
      <p className="mt-3 text-muted">{country?.note}</p>
      <ul className="mt-6 grid gap-2 text-sm leading-6">
        {guide.lines.map((line) => <li key={line} className="rounded-2xl border border-line bg-card px-4 py-3">{line}</li>)}
      </ul>
      {external ? (
        <a className="mt-6 inline-block rounded-full bg-blue px-4 py-2 text-sm text-paper" href={guide.href} target="_blank" rel="noreferrer">{guide.label}</a>
      ) : (
        <Link className="mt-6 inline-block rounded-full bg-blue px-4 py-2 text-sm text-paper" href={guide.href}>{guide.label}</Link>
      )}
      <section className="mt-10">
        <h2 className="font-serif text-2xl">Ce qui est commun, et ce qui ne l&apos;est pas</h2>
        <ul className="mt-3 grid gap-3 text-sm leading-6">
          <li className="rounded-2xl border border-line bg-card px-4 py-3">
            Le visa étudiant se lit sur France-Visas pour ta nationalité. Parcourstudent ne recopie pas une liste de pièces.
            {" "}
            <a className="text-blue underline" href="https://france-visas.gouv.fr/" target="_blank" rel="noreferrer">France-Visas</a>
          </li>
          <li className="rounded-2xl border border-line bg-card px-4 py-3">
            Le travail pendant les études est décrit par Service-Public, avec 964 heures par an pour beaucoup d&apos;étudiants non européens. La même fiche dit quand une nationalité suit une autre règle.
            {" "}
            <a className="text-blue underline" href="https://www.service-public.gouv.fr/particuliers/vosdroits/F2713" target="_blank" rel="noreferrer">Travail étudiant</a>
          </li>
          <li className="rounded-2xl border border-line bg-card px-4 py-3">
            Après le diplôme, le droit de rester dépend du diplôme et parfois d&apos;un accord avec ton pays.
            {" "}
            <a className="text-blue underline" href="https://www.service-public.gouv.fr/particuliers/vosdroits/F2229" target="_blank" rel="noreferrer">Travailler après les études</a>
          </li>
        </ul>
      </section>
    </div>
  );
}
