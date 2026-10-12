import { broadcastMailAction } from "@/lib/actions";
import { mailRecipients } from "@/lib/db";

export default async function EnvoiPage({
  searchParams,
}: {
  searchParams: Promise<{ erreur?: string; envoye?: string; echec?: string }>;
}) {
  const { erreur, envoye, echec } = await searchParams;
  const count = mailRecipients().length;
  const sent = Number(envoye);
  const failed = Number(echec);
  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <h1 className="font-serif text-4xl">E-mail à tous</h1>
      <p className="mt-2 text-muted">
        Chaque étudiant actif reçoit cet e-mail sur son adresse ({count} adresses). Ce n&apos;est pas un message dans la messagerie du site. Un compte désactivé ne le reçoit pas.
      </p>
      {erreur === "1" && <p className="mt-4 text-sm text-amber">Écris un objet, un message, et coche la case avant d&apos;envoyer.</p>}
      {erreur === "vide" && <p className="mt-4 text-sm text-amber">Aucun compte actif à écrire.</p>}
      {envoye !== undefined && (
        <p className="mt-4 text-sm text-blue">
          {sent} e-mail{sent > 1 ? "s" : ""} parti{sent > 1 ? "s" : ""}.
          {failed > 0 ? ` ${failed} n'ont pas abouti.` : ""}
        </p>
      )}
      <form action={broadcastMailAction} className="mt-6 grid gap-3 rounded-2xl border border-line bg-card p-4">
        <input name="subject" required maxLength={120} placeholder="Objet" className="rounded-2xl border border-line px-3 py-2" />
        <textarea name="text" required minLength={10} maxLength={5000} rows={12} placeholder="Ton message" className="rounded-2xl border border-line px-3 py-2" />
        <label className="flex items-center gap-2 text-sm">
          <input name="confirme" type="checkbox" value="1" required />
          J&apos;envoie cet e-mail à tous les comptes étudiants actifs
        </label>
        <button className="rounded-full bg-blue px-4 py-2 text-sm text-paper" type="submit">Envoyer l&apos;e-mail</button>
      </form>
    </div>
  );
}
