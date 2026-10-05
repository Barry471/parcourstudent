import { addLinkAction, deleteLinkAction } from "@/lib/actions";
import { allLinks } from "@/lib/db";
import { categories } from "@/lib/procedure";

export default function LiensPage() {
  const links = allLinks();
  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <h1 className="font-serif text-4xl">Liens utiles</h1>
      <p className="mt-2 text-muted">
        Un lien d&apos;affiliation se publie comme les autres, avec la case cochée. Le contact de candidature et le réseau social ont leur propre rubrique.
      </p>
      <form action={addLinkAction} className="mt-6 grid gap-3 rounded-2xl border border-line bg-card p-4">
        <select name="category" className="rounded-2xl border border-line px-3 py-2">
          {categories.map((category) => <option key={category.id} value={category.id}>{category.label}</option>)}
        </select>
        <input name="title" required placeholder="Leboncoin, banque, agence..." className="rounded-2xl border border-line px-3 py-2" />
        <input name="url" required type="url" placeholder="https://..." className="rounded-2xl border border-line px-3 py-2" />
        <input name="note" maxLength={200} placeholder="Note courte" className="rounded-2xl border border-line px-3 py-2" />
        <label className="flex items-center gap-2 text-sm">
          <input name="affiliate" type="checkbox" value="1" />
          Lien d&apos;affiliation
        </label>
        <button className="rounded-full bg-blue px-4 py-2 text-sm text-paper" type="submit">Publier</button>
      </form>
      <ul className="mt-6 divide-y divide-line rounded-2xl border border-line bg-card">
        {links.map((link) => (
          <li key={link.id} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
            <span>{link.category} · {link.title}{link.affiliate ? " · affiliation" : ""}</span>
            <form action={deleteLinkAction}>
              <input type="hidden" name="id" value={link.id} />
              <button className="text-amber" type="submit">Retirer</button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
