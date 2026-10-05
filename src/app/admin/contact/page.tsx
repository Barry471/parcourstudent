import { ContactInbox } from "@/components/ContactInbox";

export default function AdminContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <h1 className="font-serif text-4xl">Contacts</h1>
      <p className="mt-2 text-muted">Les personnes qui ont écrit pour un accompagnement. Ibrahima Talibé DIALLO voit la même liste.</p>
      <ContactInbox />
    </div>
  );
}
