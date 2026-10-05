import { arrivalAction, titreAction, yearAction } from "@/lib/actions";
import { mailConfigured } from "@/lib/mail";
import { situations, yearLevels } from "@/lib/demarches";
import { requireUser } from "@/lib/guard";
import { phaseOf } from "@/lib/moments";
import { renewalAlert, renewalDocuments } from "@/lib/renewal";

export default async function YearPage() {
  const user = await requireUser();
  const inFrance = phaseOf(user.situation) === "france";
  const alert = renewalAlert(user.titre_expires_on);
  return (
    <div className="mx-auto max-w-xl px-5 py-12">
      <p className="text-sm uppercase tracking-[0.16em] text-blue">Rentrée</p>
      <h1 className="mt-2 font-serif text-4xl">Ta situation cette année</h1>
      <p className="mt-3 text-muted">
        {inFrance
          ? "Tu es déjà en France. Le niveau et la situation affichent les démarches de cette année."
          : "Tant que tu n'as pas le visa, cette page ne montre que la candidature. L'arrivée en France s'ouvre quand tu changes la situation."}
      </p>
      <form action={yearAction} className="mt-6 grid gap-3">
        <select name="situation" required className="rounded-2xl border border-line bg-card px-4 py-3" defaultValue={user.situation ?? ""}>
          <option value="" disabled>Ta situation</option>
          {situations.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
        </select>
        <select name="year_level" required className="rounded-2xl border border-line bg-card px-4 py-3" defaultValue={user.year_level ?? ""}>
          <option value="" disabled>Ton niveau</option>
          {yearLevels.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
        </select>
        <button className="rounded-full bg-blue px-5 py-3 text-paper" type="submit">Enregistrer cette rentrée</button>
      </form>

      {inFrance && <section id="renouvellement" className="mt-10 rounded-3xl border border-amber/40 bg-amber-soft p-5">
        <h2 className="font-serif text-2xl">{alert.title}</h2>
        <p className="mt-2 text-sm leading-6">{alert.text}</p>
        <form action={titreAction} className="mt-4 grid gap-3">
          <label className="text-sm" htmlFor="expires">Date de fin du visa ou de la carte</label>
          <input id="expires" name="expires" type="date" required defaultValue={user.titre_expires_on ?? ""} className="rounded-2xl border border-line bg-card px-3 py-2" />
          <button className="rounded-full bg-ink px-4 py-2 text-sm text-paper" type="submit">Enregistrer la date</button>
        </form>
        <p className="mt-3 text-sm">
          {mailConfigured()
            ? "Le même rappel part aussi par e-mail sur l'adresse du compte, au plus une fois par semaine, même si tu n'ouvres pas le site ce jour-là."
            : "Le rappel s'affiche sur le site. L'e-mail partira sur l'adresse du compte quand l'envoi sera branché."}
        </p>
        <ul className="mt-4 grid gap-1 text-sm leading-6">
          {renewalDocuments.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </section>}

      {inFrance && <section className="mt-8 rounded-3xl border border-line bg-card p-5">
        <h2 className="font-serif text-2xl">Date d&apos;arrivée en France</h2>
        <p className="mt-2 text-sm">Elle sert à suivre les 15 premiers jours. Le visa long séjour se valide dans les trois mois.</p>
        <form action={arrivalAction} className="mt-4 grid gap-3">
          <input name="arrived" type="date" required defaultValue={user.arrived_on ?? ""} className="rounded-2xl border border-line px-3 py-2" />
          <button className="rounded-full bg-blue px-4 py-2 text-sm text-paper" type="submit">Enregistrer et ouvrir les 15 jours</button>
        </form>
      </section>}
    </div>
  );
}
