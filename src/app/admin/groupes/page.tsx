import { addGroupAction, deleteGroupAction } from "@/lib/actions";
import { cities } from "@/lib/content";
import { allGroups } from "@/lib/db";

export default function GroupesPage() {
  const groups = allGroups();
  const cityName = (id: string | null) => cities.find((city) => city.id === id)?.name ?? "—";
  const candidature = groups.filter((group) => group.audience === "candidature");
  const ville = groups.filter((group) => group.audience !== "candidature");
  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <h1 className="font-serif text-4xl">WhatsApp et Telegram</h1>
      <p className="mt-2 text-muted">Un lien pour les candidatures, ou un lien pour une ville une fois les étudiants arrivés.</p>
      <form action={addGroupAction} className="mt-6 grid gap-3 rounded-2xl border border-line bg-card p-4">
        <select name="audience" className="rounded-2xl border border-line px-3 py-2">
          <option value="candidature">Visible pendant les candidatures</option>
          <option value="ville">Visible pour une ville, en France</option>
        </select>
        <select name="city" required className="rounded-2xl border border-line px-3 py-2" defaultValue="toutes">
          <option value="toutes">Toutes les candidatures</option>
          {cities.map((city) => <option key={city.id} value={city.id}>{city.name}</option>)}
        </select>
        <select name="platform" className="rounded-2xl border border-line px-3 py-2">
          <option value="whatsapp">WhatsApp</option>
          <option value="telegram">Telegram</option>
        </select>
        <input name="label" required placeholder="Nom du groupe" className="rounded-2xl border border-line px-3 py-2" />
        <input name="url" required type="url" placeholder="https://..." className="rounded-2xl border border-line px-3 py-2" />
        <button className="rounded-full bg-blue px-4 py-2 text-sm text-paper" type="submit">Publier</button>
      </form>
      <GroupList title="Pour venir en France" groups={candidature} cityName={cityName} />
      <GroupList title="Déjà en France" groups={ville} cityName={cityName} />
    </div>
  );
}

function GroupList({
  title,
  groups,
  cityName,
}: {
  title: string;
  groups: { id: number; city: string; platform: string; label: string }[];
  cityName: (id: string) => string;
}) {
  return (
    <section className="mt-8">
      <h2 className="font-serif text-2xl">{title}</h2>
      {groups.length === 0 ? (
        <p className="mt-2 text-sm text-muted">Aucun lien pour l&apos;instant.</p>
      ) : (
        <ul className="mt-3 divide-y divide-line rounded-2xl border border-line bg-card">
          {groups.map((group) => (
            <li key={group.id} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
              <span>{group.city ? cityName(group.city) : "Toutes"} · {group.platform} · {group.label}</span>
              <form action={deleteGroupAction}>
                <input type="hidden" name="id" value={group.id} />
                <button className="text-amber" type="submit">Retirer</button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
