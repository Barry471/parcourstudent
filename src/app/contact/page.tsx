import { contactAction } from "@/lib/actions";
import { currentUser } from "@/lib/auth";
import Link from "next/link";

const errors: Record<string, string> = {
  incomplet: "Écris ton nom, une adresse e-mail valide, et un message d'au moins quelques mots.",
  telephone: "Le numéro ne convient pas. Exemple : 06 12 34 56 78. Tu peux aussi le laisser vide.",
  attente: "Ce message est déjà parti. Réessaie dans un moment si tu dois en envoyer un autre.",
};

const field = "rounded-2xl border border-line bg-card px-4 py-3";

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ erreur?: string; etat?: string }>;
}) {
  const user = await currentUser();
  const { erreur, etat } = await searchParams;
  const sent = etat === "envoye";
  return (
    <div className="mx-auto max-w-lg px-5 py-8 md:py-14">
      <p className="text-sm uppercase tracking-[0.16em] text-blue">Contact</p>
      <h1 className="mt-2 font-serif text-4xl">Accompagnement personnalisé</h1>
      <p className="mt-3 text-muted">
        Tu écris ici si tu veux qu&apos;on t&apos;appelle pour avancer sur un formulaire. C&apos;est toi qui appuies. S&apos;il y a un prix, il est dit avant le premier appel. Le paiement ne passe pas par ce site.
      </p>
      {sent && <p className="mt-4 text-sm text-blue">C&apos;est envoyé. La réponse arrive sur l&apos;adresse que tu as écrite.</p>}
      {erreur && errors[erreur] && <p className="mt-4 text-sm text-amber">{errors[erreur]}</p>}
      {!sent && (
        <form action={contactAction} className="mt-6 grid gap-3">
          <label className="grid gap-1 text-sm">
            Prénom et nom
            <input name="name" required maxLength={80} autoComplete="name" defaultValue={user?.name ?? ""} className={field} />
          </label>
          <label className="grid gap-1 text-sm">
            Adresse e-mail
            <input name="email" type="email" required maxLength={160} autoComplete="email" defaultValue={user?.role === "user" ? user.email : ""} className={field} />
          </label>
          <label className="grid gap-1 text-sm">
            Téléphone, si on doit t&apos;appeler
            <input name="phone" inputMode="tel" autoComplete="tel" maxLength={20} placeholder="06 12 34 56 78" className={field} />
          </label>
          <label className="grid gap-1 text-sm">
            Ce qui bloque
            <textarea name="message" required minLength={10} maxLength={1000} rows={5} placeholder="Par exemple : je n'arrive pas à ouvrir Études en France" className={field} />
          </label>
          <p className="text-sm text-muted">
            Ton message est lu par Thierno BARRY et Ibrahim Talibe DIALLO. Le détail est dans la{" "}
            <Link href="/confidentialite" className="text-blue underline">politique de confidentialité</Link>.
          </p>
          <button className="rounded-full bg-blue px-5 py-3 text-paper" type="submit">Envoyer</button>
        </form>
      )}
    </div>
  );
}
