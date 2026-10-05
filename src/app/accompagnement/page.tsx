import { redirect } from "next/navigation";
import { ContactInbox } from "@/components/ContactInbox";
import { currentUser } from "@/lib/auth";

export default async function AccompagnementPage() {
  const user = await currentUser();
  if (!user || user.role !== "accompagnateur") redirect("/connexion?next=/accompagnement");
  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <p className="text-sm uppercase tracking-[0.16em] text-blue">Accompagnement</p>
      <h1 className="mt-2 font-serif text-4xl">Personnes à accompagner</h1>
      <p className="mt-2 text-muted">Les personnes qui ont écrit. Tu les appelles ou tu leur écris sur WhatsApp. Tu ne vois pas les autres comptes.</p>
      <ContactInbox />
    </div>
  );
}
