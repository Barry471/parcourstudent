import { choosePasswordAction, forgotPasswordAction } from "@/lib/actions";

export default async function PasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ etat?: string; erreur?: string; jeton?: string }>;
}) {
  const { etat, erreur, jeton } = await searchParams;
  const token = jeton && /^[a-f0-9]{64}$/.test(jeton) ? jeton : "";
  return (
    <div className="mx-auto max-w-md px-5 py-14">
      <p className="text-sm uppercase tracking-[0.16em] text-blue">Mot de passe</p>
      <h1 className="mt-2 font-serif text-4xl">{token ? "Choisis un nouveau mot de passe" : "Mot de passe oublié"}</h1>
      {token ? (
        <form action={choosePasswordAction} className="mt-6 grid gap-3">
          <input type="hidden" name="jeton" value={token} />
          <p className="text-sm text-muted">Le lien ne sert qu&apos;une fois. Ensuite tu es connecté.</p>
          {erreur && <p className="text-sm text-amber">Ce lien n&apos;est plus valable. Demande-en un autre.</p>}
          <label className="grid gap-1 text-sm">
            Nouveau mot de passe
            <input name="password" type="password" required minLength={8} maxLength={72} autoComplete="new-password" className="rounded-2xl border border-line bg-card px-4 py-3" />
          </label>
          <button className="rounded-full bg-blue px-5 py-3 text-paper" type="submit">Enregistrer</button>
        </form>
      ) : (
        <form action={forgotPasswordAction} className="mt-6 grid gap-3">
          <p className="text-sm text-muted">
            L&apos;ancien mot de passe ne peut pas être relu. Indique ton e-mail : tu reçois un lien, valable une heure, pour en choisir un nouveau.
          </p>
          {etat === "envoye" && <p className="text-sm text-amber">Si un compte existe avec cette adresse, un lien vient d&apos;être envoyé. Il expire dans une heure.</p>}
          {etat === "local" && <p className="text-sm text-amber">En local, le lien n&apos;est pas envoyé sur internet. S&apos;il y a un compte, il est dans Administration, rubrique Courrier. Il expire dans une heure.</p>}
          {etat === "messagerie" && <p className="text-sm text-amber">Le lien par e-mail n&apos;est pas encore branché. Il partira dès que la messagerie est configurée.</p>}
          {erreur && <p className="text-sm text-amber">Ce lien n&apos;est plus valable. Demande-en un autre.</p>}
          <label className="grid gap-1 text-sm">
            Adresse e-mail
            <input name="email" type="email" required maxLength={160} autoComplete="email" className="rounded-2xl border border-line bg-card px-4 py-3" />
          </label>
          <button className="rounded-full bg-blue px-5 py-3 text-paper" type="submit">Demander un nouveau mot de passe</button>
        </form>
      )}
    </div>
  );
}
