import { changePasswordAction } from "@/lib/actions";
import { requireUser } from "@/lib/guard";

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ erreur?: string; etat?: string }>;
}) {
  const user = await requireUser();
  const { erreur, etat } = await searchParams;
  return (
    <div className="mx-auto max-w-md px-5 py-14">
      <p className="text-sm uppercase tracking-[0.16em] text-blue">Compte</p>
      <h1 className="mt-2 font-serif text-4xl">Changer le mot de passe</h1>
      <p className="mt-3 text-muted">{user.email}</p>
      {etat === "ok" && <p className="mt-4 text-sm text-blue">Le mot de passe est changé.</p>}
      {erreur && <p className="mt-4 text-sm text-amber">Le mot de passe actuel ne correspond pas, ou le nouveau est trop court.</p>}
      <form action={changePasswordAction} className="mt-6 grid gap-3">
        <label className="grid gap-1 text-sm">
          Mot de passe actuel
          <input name="current" type="password" required maxLength={72} autoComplete="current-password" className="rounded-2xl border border-line bg-card px-4 py-3" />
        </label>
        <label className="grid gap-1 text-sm">
          Nouveau mot de passe
          <input name="password" type="password" required minLength={8} maxLength={72} autoComplete="new-password" className="rounded-2xl border border-line bg-card px-4 py-3" />
        </label>
        <button className="rounded-full bg-blue px-5 py-3 text-paper" type="submit">Enregistrer</button>
      </form>
    </div>
  );
}
