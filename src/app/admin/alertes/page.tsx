import { deleteAlertAction, sendAlertAction } from "@/lib/actions";
import { cities, countries } from "@/lib/content";
import { allAlerts } from "@/lib/db";

export default function AdminAlertsPage() {
  const alerts = allAlerts();
  const countryName = (id: string) => countries.find((country) => country.id === id)?.name ?? "Tous les pays";
  const cityName = (id: string) => cities.find((city) => city.id === id)?.name ?? "Toutes les villes";
  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <h1 className="font-serif text-4xl">Alerte aux étudiants</h1>
      <p className="mt-2 text-muted">Le message apparaît sur l&apos;accueil de l&apos;étudiant, dans la rubrique Alertes. Il ne s&apos;affiche plus en haut de chaque page.</p>
      <form action={sendAlertAction} className="mt-6 grid gap-3">
        <input name="title" required placeholder="Titre" className="rounded-2xl border border-line bg-card px-4 py-3" />
        <textarea name="body" required placeholder="Information nouvelle" className="min-h-32 rounded-2xl border border-line bg-card px-4 py-3" />
        <select name="country" className="rounded-2xl border border-line bg-card px-4 py-3" defaultValue="tous">
          <option value="tous">Tous les pays</option>
          {countries.map((country) => <option key={country.id} value={country.id}>{country.name}</option>)}
        </select>
        <select name="city" className="rounded-2xl border border-line bg-card px-4 py-3" defaultValue="toutes">
          <option value="toutes">Toutes les villes</option>
          {cities.map((city) => <option key={city.id} value={city.id}>{city.name}</option>)}
        </select>
        <button className="rounded-full bg-blue px-5 py-3 text-paper" type="submit">Envoyer l&apos;alerte</button>
      </form>
      <ul className="mt-8 grid gap-3">
        {alerts.map((alert) => (
          <li key={alert.id} className="rounded-2xl border border-line bg-card p-4">
            <p className="font-medium">{alert.title}</p>
            <p className="mt-1 text-sm">{alert.body}</p>
            <p className="mt-2 text-xs uppercase text-muted">{countryName(alert.country)} · {cityName(alert.city)}</p>
            <form action={deleteAlertAction} className="mt-3">
              <input type="hidden" name="id" value={alert.id} />
              <button className="text-sm text-amber" type="submit">Supprimer</button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
