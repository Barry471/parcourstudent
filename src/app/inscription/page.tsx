import Link from "next/link";
import { registerAction } from "@/lib/actions";
import { cities, countries, undecidedCity } from "@/lib/content";

const messages: Record<string, string> = {
  incomplet: "Vérifie chaque champ : le mot de passe fait au moins 12 caractères, avec une lettre et un chiffre, et l'e-mail est complet.",
  attente: "Trop de comptes viennent d'être créés. Réessaie dans un moment.",
  existe: "Cette adresse e-mail a déjà un compte. Connecte-toi.",
};

const field = "rounded-2xl border border-line bg-card px-4 py-3";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ erreur?: string }>;
}) {
  const { erreur } = await searchParams;
  return (
    <div className="mx-auto max-w-lg px-5 py-14">
      <p className="text-sm uppercase tracking-[0.16em] text-blue">Créer un compte</p>
      <h1 className="mt-2 font-serif text-4xl">Trois informations, puis tu entres.</h1>
      <p className="mt-3 text-muted">
        Le compte sert à suivre ta candidature ou tes démarches. Aucun document n&apos;est demandé, et rien n&apos;est envoyé à l&apos;administration.
      </p>
      {erreur && <p className="mt-4 text-sm text-amber">{messages[erreur] ?? "Inscription impossible."}</p>}
      <form action={registerAction} className="mt-8 grid gap-8">
        <fieldset className="grid gap-3">
          <legend className="font-serif text-2xl">1. Qui tu es</legend>
          <p className="text-sm text-muted">Le nom apparaît sur ton accueil. L&apos;e-mail sert uniquement à te connecter.</p>
          <label className="grid gap-1 text-sm">
            Prénom et nom
            <input name="name" required maxLength={80} autoComplete="name" placeholder="Awa Diallo" className={field} />
          </label>
          <label className="grid gap-1 text-sm">
            Adresse e-mail
            <input name="email" type="email" required maxLength={160} autoComplete="email" placeholder="awa@exemple.fr" className={field} />
          </label>
          <label className="grid gap-1 text-sm">
            Mot de passe
            <input name="password" type="password" required minLength={12} maxLength={72} autoComplete="new-password" placeholder="12 caractères, avec un chiffre" className={field} />
          </label>
        </fieldset>
        <fieldset className="grid gap-3">
          <legend className="font-serif text-2xl">2. D&apos;où tu viens</legend>
          <p className="text-sm text-muted">La liste reprend les 73 pays de la procédure Études en France. Si le tien n&apos;y est pas, choisis « Autre pays ».</p>
          <label className="grid gap-1 text-sm">
            Pays d&apos;origine
            <select name="country" required className={field} defaultValue="">
              <option value="" disabled>Choisis ton pays</option>
              {countries.map((country) => (
                <option key={country.id} value={country.id}>{country.name}</option>
              ))}
            </select>
          </label>
        </fieldset>
        <fieldset className="grid gap-3">
          <legend className="font-serif text-2xl">3. Où tu vas en France</legend>
          <p className="text-sm text-muted">
            Si tu candidates encore, choisis « Je ne sais pas encore ». Tu pourras indiquer la ville et l&apos;école après l&apos;admission.
          </p>
          <label className="grid gap-1 text-sm">
            Ville visée
            <select name="city" required className={field} defaultValue={undecidedCity}>
              <option value={undecidedCity}>Je ne sais pas encore</option>
              {cities.map((city) => (
                <option key={city.id} value={city.id}>{city.name}</option>
              ))}
            </select>
          </label>
          <label className="grid gap-1 text-sm">
            École ou formation visée
            <input name="school" maxLength={120} placeholder="Laisse vide si tu ne sais pas encore" className={field} />
          </label>
        </fieldset>
        <p className="text-sm text-muted">
          Ces informations servent uniquement à ton guide. Le détail est dans la{" "}
          <Link href="/confidentialite" className="text-blue underline">politique de confidentialité</Link>.
        </p>
        <button className="rounded-full bg-blue px-5 py-3 text-paper" type="submit">Créer mon compte</button>
      </form>
    </div>
  );
}
