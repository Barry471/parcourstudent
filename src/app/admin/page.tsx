import Link from "next/link";
import { redirect } from "next/navigation";
import { saveAccompagnateurAction } from "@/lib/actions";
import { currentUser } from "@/lib/auth";
import { findAccompagnateur, trafficSummary } from "@/lib/db";

const doors = [
  { href: "/admin/etudiants", title: "Étudiants", text: "Classés par ville. Ajouter, activer, mot de passe, supprimer." },
  { href: "/admin/alertes", title: "Alertes", text: "Un message à tout le monde, ou à un pays et une ville." },
  { href: "/admin/messages", title: "Messages", text: "Les textes des étudiants. Tu peux en retirer un." },
  { href: "/admin/contact", title: "Contacts", text: "Les personnes qui ont écrit pour un accompagnement." },
  { href: "/admin/infos", title: "Informations", text: "Une image ou un PDF publié par toi. Les étudiants n'en envoient pas." },
  { href: "/admin/groupes", title: "Groupes", text: "WhatsApp et Telegram, pour les candidatures ou pour une ville." },
  { href: "/admin/liens", title: "Liens", text: "Logement, banques et agences, sur la démarche correspondante." },
  { href: "/admin/videos", title: "Vidéos", text: "YouTube, TikTok ou Facebook, sur une page ou sur une étape." },
];

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ erreur?: string; etat?: string }>;
}) {
  const user = await currentUser();
  if (!user || user.role !== "admin") redirect("/");
  const { erreur, etat } = await searchParams;
  const data = trafficSummary();
  const accompagnateur = findAccompagnateur();
  return (
    <div className="mx-auto max-w-5xl px-5 py-12">
      <p className="text-sm uppercase tracking-[0.16em] text-blue">Administration</p>
      <h1 className="mt-2 font-serif text-4xl">Tableau</h1>
      <p className="mt-2 text-muted">Chaque tâche a sa page. Les étudiants ne déposent aucun document ici.</p>
      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        <Card label="Visites" value={data.total} />
        <Card label="Aujourd'hui" value={data.today} />
        <Card label="Comptes" value={data.users} />
      </div>
      <ul className="mt-8 grid gap-3 sm:grid-cols-2">
        {doors.map((door) => (
          <li key={door.href}>
            <Link href={door.href} className="block rounded-2xl border border-line bg-card px-5 py-4 hover:border-blue">
              <span className="font-serif text-2xl">{door.title}</span>
              <span className="mt-1 block text-sm text-muted">{door.text}</span>
            </Link>
          </li>
        ))}
      </ul>
      <section className="mt-10 rounded-2xl border border-line bg-card px-5 py-5">
        <h2 className="font-serif text-2xl">Compte accompagnement</h2>
        <p className="mt-2 text-sm text-muted">Ibrahim Talibe DIALLO ne voit que les personnes qui ont écrit pour un accompagnement.</p>
        {etat === "accompagnement" && <p className="mt-3 text-sm text-blue">Le compte est enregistré.</p>}
        {erreur === "accompagnement" && <p className="mt-3 text-sm text-amber">L&apos;adresse est déjà prise, ou le mot de passe est trop court.</p>}
        <form action={saveAccompagnateurAction} className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-sm">
            Adresse e-mail
            <input name="email" type="email" required maxLength={160} defaultValue={accompagnateur?.email ?? ""} className="rounded-2xl border border-line bg-paper px-4 py-3" />
          </label>
          <label className="grid gap-1 text-sm">
            Mot de passe {accompagnateur ? "(laisser vide pour le garder)" : ""}
            <input name="password" type="password" autoComplete="new-password" minLength={accompagnateur ? undefined : 8} required={!accompagnateur} className="rounded-2xl border border-line bg-paper px-4 py-3" />
          </label>
          <button className="rounded-full bg-blue px-5 py-3 text-sm text-paper sm:col-span-2 sm:w-fit" type="submit">
            {accompagnateur ? "Mettre à jour le compte" : "Créer le compte"}
          </button>
        </form>
      </section>
      <h2 className="mt-10 font-serif text-2xl">Dernières visites</h2>
      <div className="mt-4 overflow-x-auto rounded-2xl border border-line bg-card">
        <table className="w-full text-left text-sm">
          <thead className="text-muted">
            <tr><th className="px-4 py-3">Page</th><th className="px-4 py-3">Compte</th><th className="px-4 py-3">Moment</th></tr>
          </thead>
          <tbody>
            {data.recent.map((visit) => (
              <tr key={visit.id} className="border-t border-line">
                <td className="px-4 py-3">{visit.path}</td>
                <td className="px-4 py-3">{visit.email ?? "Visiteur"}</td>
                <td className="px-4 py-3">{visit.created_at.slice(0, 16).replace("T", " ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Card({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-blue-deep px-5 py-5 text-paper">
      <p className="text-sm text-paper/70">{label}</p>
      <p className="mt-2 font-serif text-4xl">{value}</p>
    </div>
  );
}
