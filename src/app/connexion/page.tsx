import { LockIcon, LockedPassword } from "@/components/Lock";
import { loginAction } from "@/lib/actions";
import { contactEmail } from "@/lib/site";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ erreur?: string; next?: string }>;
}) {
  const { erreur, next } = await searchParams;
  const nextPath = next && next.startsWith("/") && !next.startsWith("//") ? next : "/parcours";
  return (
    <div className="mx-auto max-w-md px-5 py-14">
      <p className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.16em] text-blue"><LockIcon className="h-4 w-4" />Connexion</p>
      <h1 className="mt-2 font-serif text-4xl">Reprendre ton parcours</h1>
      <p className="mt-3 text-muted">Utilise l&apos;adresse e-mail du compte. Après plusieurs essais ratés, la connexion se bloque un moment.</p>
      {erreur === "desactive" && <p className="mt-4 text-sm text-amber">Ce compte est désactivé. Écris à <a className="underline" href={`mailto:${contactEmail}`}>{contactEmail}</a>.</p>}
      {erreur === "attente" && <p className="mt-4 text-sm text-amber">Trop d&apos;essais. Réessaie dans quinze minutes.</p>}
      {erreur && erreur !== "desactive" && erreur !== "attente" && <p className="mt-4 text-sm text-amber">Adresse ou mot de passe incorrect.</p>}
      <form action={loginAction} className="mt-6 grid gap-3">
        <input type="hidden" name="next" value={nextPath} />
        <label className="grid gap-1 text-sm">
          Adresse e-mail
          <input name="email" type="email" required maxLength={160} autoComplete="email" placeholder="Adresse e-mail" className="rounded-2xl border border-line bg-card px-4 py-3" />
        </label>
        <label className="grid gap-1 text-sm">
          Mot de passe
          <LockedPassword name="password" required maxLength={72} autoComplete="current-password" placeholder="Mot de passe" className="rounded-2xl border border-line bg-card px-4 py-3" />
        </label>
        <button className="inline-flex items-center justify-center gap-2 rounded-full bg-blue px-5 py-3 text-paper" type="submit"><LockIcon className="h-4 w-4" />Se connecter</button>
      </form>
      <a href="/mot-de-passe" className="mt-4 inline-block text-sm text-blue">Mot de passe oublié</a>
    </div>
  );
}
