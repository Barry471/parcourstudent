import { redirect } from "next/navigation";
import { readLocalMail } from "@/lib/localMail";

export default function LocalMailPage() {
  if (process.env.NODE_ENV === "production") redirect("/admin");
  const mails = readLocalMail();
  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <h1 className="font-serif text-4xl">Courrier local</h1>
      <p className="mt-2 text-muted">Ces messages restent sur ta machine. Ils remplacent l&apos;e-mail tant que tu es en local.</p>
      {mails.length === 0 && <p className="mt-8 text-muted">Aucun message pour le moment.</p>}
      <ul className="mt-8 grid gap-4">
        {mails.map((mail) => (
          <li key={mail.createdAt + mail.to} className="rounded-2xl border border-line bg-card p-4 text-sm">
            <p className="font-medium">{mail.subject}</p>
            <p className="text-muted">{mail.to} · {mail.createdAt.slice(0, 16).replace("T", " ")}</p>
            <p className="mt-3 whitespace-pre-wrap">{mail.text}</p>
            {mail.text.match(/https?:\/\/\S+/)?.[0] && (
              <a href={mail.text.match(/https?:\/\/\S+/)?.[0]} className="mt-3 inline-block text-blue">Ouvrir le lien</a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
