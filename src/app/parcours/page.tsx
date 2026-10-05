import Link from "next/link";
import { cities, undecidedCity, undecidedSchool } from "@/lib/content";
import { profileAction } from "@/lib/actions";
import { candidatures } from "@/lib/candidatures";
import { demarches, percentFor, situations, yearLevels } from "@/lib/demarches";
import { alertsFor, doneSteps, groupsForCandidature, groupsForCity } from "@/lib/db";
import { requireUser } from "@/lib/guard";
import { chapters, phaseOf } from "@/lib/moments";
import { GroupLinks } from "@/components/GroupLinks";
import { NowCard } from "@/components/NowCard";
import { ProcedureCard } from "@/components/ProcedureCard";
import { nextFor } from "@/lib/nextStep";
import { photoFor } from "@/lib/photos";
import { problems } from "@/lib/renewal";

export default async function ParcoursPage() {
  const user = await requireUser();
  const city = cities.find((item) => item.id === user.city);
  const cityLabel = user.city === undecidedCity ? "Ville pas encore choisie" : city?.name ?? "Ville à préciser";
  const needsPlace = !city || user.city === undecidedCity || !user.school || user.school === undecidedSchool;
  const done = new Set(doneSteps(user.id));
  const situation = situations.find((item) => item.id === user.situation);
  const level = yearLevels.find((item) => item.id === user.year_level);
  const groups = city ? groupsForCity(city.id) : [];
  const candidatureGroups = groupsForCandidature(user.city);
  const chapter = user.situation ? chapters[user.situation] : undefined;
  const inFrance = phaseOf(user.situation) === "france";
  const alerts = user.role === "user" ? alertsFor(user.country, user.city) : [];
  const visible = inFrance
    ? demarches.filter((item) => item.forSituations.includes(user.situation ?? ""))
    : demarches.filter((item) => item.id === "budget");

  return (
    <div className="mx-auto max-w-3xl px-5 py-8 md:py-12">
      <p className="text-sm uppercase tracking-[0.16em] text-blue">{inFrance ? "En France" : "Avant le départ"}</p>
      <h1 className="mt-2 font-serif text-3xl md:text-4xl">Bonjour {user.name.split(" ")[0]}</h1>
      <p className="mt-2 text-muted">
        {cityLabel}
        {user.school && user.school !== undecidedSchool ? ` · ${user.school}` : " · École pas encore choisie"}
        {level ? ` · ${level.label}` : ""}
      </p>

      {user.role === "user" && <NowCard step={nextFor(user, done)} />}

      {alerts.length > 0 && (
        <section className="mt-8 rounded-3xl border border-line bg-card p-5">
          <h2 className="font-serif text-2xl">Messages de l&apos;administration</h2>
          <ul className="mt-4 grid gap-3">
            {alerts.map((alert) => (
              <li key={alert.id}>
                <p className="font-medium">{alert.title}</p>
                <p className="mt-1 text-sm leading-6 text-muted">{alert.body}</p>
              </li>
            ))}
          </ul>
          <Link href="/alertes" className="mt-4 inline-block text-sm text-blue">Voir les alertes</Link>
        </section>
      )}

      {needsPlace && (
        <form action={profileAction} className="mt-6 grid gap-3 rounded-3xl border border-line bg-card p-5">
          <p className="font-medium">Quand tu connais ta ville ou ton école, indique-les ici.</p>
          <select name="city" required className="rounded-2xl border border-line px-4 py-3" defaultValue={user.city === undecidedCity ? undecidedCity : user.city ?? ""}>
            <option value={undecidedCity}>Je ne sais pas encore</option>
            {cities.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
          <input name="school" placeholder="Ton école, ou laisse vide" defaultValue={user.school === undecidedSchool ? "" : user.school ?? ""} className="rounded-2xl border border-line px-4 py-3" />
          <button className="rounded-full bg-blue px-5 py-3 text-paper" type="submit">Enregistrer</button>
        </form>
      )}

      <section className="mt-8 rounded-3xl border border-line bg-card p-5">
        <h2 className="font-serif text-2xl">Ton année</h2>
        <p className="mt-2 text-sm text-muted">
          {situation ? situation.label : "Dis si tu candidates encore, ou si tu es déjà en France. Le reste de la page suit cette réponse."}
        </p>
        <Link href="/annee" className="mt-4 inline-block rounded-full bg-blue px-4 py-2 text-sm text-paper">
          {situation ? "Mettre à jour la rentrée" : "Dire ma situation et mon niveau"}
        </Link>
      </section>

      {chapter && (
        <section className="mt-8">
          <h2 className="font-serif text-2xl">{chapter.title}</h2>
          <p className="mt-2 text-sm text-muted">{chapter.text}</p>
        </section>
      )}

      {!inFrance && (
        <section className="mt-8">
          <h2 className="font-serif text-2xl">Candidatures</h2>
          <p className="mt-2 text-sm text-muted">Campus France, Parcoursup, Paris-Saclay ou une école privée, jusqu&apos;à l&apos;admission et au visa. Les démarches d&apos;arrivée s&apos;ouvrent quand tu indiques que tu as le visa.</p>
          <ul className="mt-4 grid gap-3">
            {candidatures.map((item) => {
              const percent = percentFor(item.steps, done);
              return (
                <li key={item.id}>
                  <ProcedureCard href={`/candidatures/${item.id}`} title={item.menu} detail={item.forWhom} percent={percent} photo={photoFor(item.id)} />
                </li>
              );
            })}
          </ul>
          <GroupLinks groups={candidatureGroups} />
        </section>
      )}

      <section className="mt-8">
        <h2 className="font-serif text-2xl">{inFrance ? "Tes démarches" : "À préparer avant le visa"}</h2>
        <ul className="mt-4 grid gap-3">
          {visible.map((item) => {
            const percent = percentFor(item.steps, done);
            return (
                <li key={item.id}>
                  <ProcedureCard href={`/demarches/${item.id}`} title={item.menu} percent={percent} photo={photoFor(item.id)} />
                </li>
            );
          })}
        </ul>
      </section>

      {inFrance && <section id="groupes" className="mt-8">
        <h2 className="font-serif text-2xl">Groupes de ta ville</h2>
        {groups.length === 0 ? (
          <p className="mt-2 text-sm text-muted">Pas encore de groupe publié pour cette ville.</p>
        ) : (
          <GroupLinks groups={groups} />
        )}
      </section>}

      {inFrance && <section className="mt-8">
        <h2 className="font-serif text-2xl">Si quelque chose bloque</h2>
        <ul className="mt-3 grid gap-3">
          {problems.map((item) => (
            <li key={item.problem} className="rounded-2xl border border-line bg-card px-4 py-3 text-sm">
              <p className="font-medium">{item.problem}</p>
              <p className="mt-1 text-muted">{item.solution}</p>
            </li>
          ))}
        </ul>
      </section>}
    </div>
  );
}
