import { deleteMessageAction } from "@/lib/actions";
import { boardMessages } from "@/lib/db";

export default function AdminMessagesPage() {
  const messages = boardMessages();
  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <h1 className="font-serif text-4xl">Messages des étudiants</h1>
      <p className="mt-2 text-muted">Texte seulement. Tu peux retirer un message.</p>
      {messages.length === 0 ? (
        <p className="mt-6 text-sm text-muted">Aucun message pour le moment.</p>
      ) : (
        <ul className="mt-6 grid gap-2">
          {messages.map((message) => (
            <li key={message.id} className="rounded-2xl border border-line bg-card px-4 py-3">
              <p className="text-xs uppercase text-muted">
                {message.name} · {message.created_at.slice(0, 16).replace("T", " ")}
              </p>
              <p className="mt-1 text-sm leading-6">{message.body}</p>
              <form action={deleteMessageAction} className="mt-2">
                <input type="hidden" name="id" value={message.id} />
                <button className="text-sm text-amber" type="submit">Retirer</button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
