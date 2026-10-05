import { alertsFor } from "@/lib/db";
import { requireUser } from "@/lib/guard";

export default async function AlertsPage() {
  const user = await requireUser();
  const alerts = alertsFor(user.country, user.city);
  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <h1 className="font-serif text-4xl">Alertes</h1>
      <p className="mt-2 text-muted">Les informations envoyées par l&apos;administration, pour ton pays et ta ville.</p>
      {alerts.length === 0 ? (
        <p className="mt-6 text-sm text-muted">Aucune alerte pour le moment.</p>
      ) : (
        <ul className="mt-6 grid gap-3">
          {alerts.map((alert) => (
            <li key={alert.id} className="rounded-2xl border border-line bg-card p-5">
              <p className="text-xs uppercase text-muted">{alert.created_at.slice(0, 16).replace("T", " ")}</p>
              <h2 className="mt-1 font-serif text-2xl">{alert.title}</h2>
              <p className="mt-2 text-sm leading-6">{alert.body}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
