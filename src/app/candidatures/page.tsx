import { GroupLinks } from "@/components/GroupLinks";
import { ProcedureCard } from "@/components/ProcedureCard";
import { photoFor } from "@/lib/photos";
import { candidatures } from "@/lib/candidatures";
import { percentFor } from "@/lib/demarches";
import { doneSteps, groupsForCandidature } from "@/lib/db";
import { requireUser } from "@/lib/guard";

export default async function CandidaturesPage() {
  const user = await requireUser();
  const done = new Set(doneSteps(user.id));
  const groups = groupsForCandidature(user.city);
  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <p className="text-sm uppercase tracking-[0.16em] text-blue">Avant le départ</p>
      <h1 className="mt-2 font-serif text-4xl">Candidater, puis obtenir le visa</h1>
      <p className="mt-3 text-muted">
        Choisis une seule voie. Chaque voie a son pourcentage, de la candidature jusqu&apos;à l&apos;admission.
        Le visa est la dernière étape commune.
      </p>
      <GroupLinks groups={groups} />
      <ul className="mt-8 grid gap-3">
        {candidatures.map((item) => {
          const percent = percentFor(item.steps, done);
          return (
            <li key={item.id}>
              <ProcedureCard href={`/candidatures/${item.id}`} title={item.menu} detail={item.forWhom} percent={percent} photo={photoFor(item.id)} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
