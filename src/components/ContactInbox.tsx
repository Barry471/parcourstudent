import { deleteContactAction } from "@/lib/actions";
import { allContactMessages } from "@/lib/db";

const when = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "long",
  timeStyle: "short",
  timeZone: "Europe/Paris",
});

export function ContactInbox() {
  const items = allContactMessages();
  if (items.length === 0) return <p className="mt-6 text-sm text-muted">Aucune personne pour l&apos;instant.</p>;
  return (
    <ul className="mt-6 grid gap-3">
      {items.map((item) => (
        <li key={item.id} className="rounded-2xl border border-line bg-card px-4 py-4">
          <p className="font-medium">{item.name}</p>
          <p className="mt-1 text-sm">{item.email}{item.phone ? ` · ${item.phone}` : ""}</p>
          <p className="mt-1 text-sm text-muted">{when.format(new Date(item.created_at))}</p>
          <p className="mt-3 text-sm leading-6">{item.body}</p>
          <form action={deleteContactAction} className="mt-3">
            <input type="hidden" name="id" value={item.id} />
            <button className="text-sm text-amber" type="submit">Retirer</button>
          </form>
        </li>
      ))}
    </ul>
  );
}
