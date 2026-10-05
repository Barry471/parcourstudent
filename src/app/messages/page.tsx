import { ChatRoom } from "@/components/ChatRoom";
import { commentMessageAction, deleteCommentAction, deleteMessageAction, postMessageAction, reactMessageAction } from "@/lib/actions";
import { allInfos, boardMessages, commentsFor, reactionEmojis, reactionsFor, type BoardMessage, type InfoFile, type MessageComment, type ReactionRow } from "@/lib/db";
import { requireUser } from "@/lib/guard";

const errors: Record<string, string> = {
  vide: "Écris un message, ou joins une image ou un PDF.",
  attente: "Tu as déjà envoyé plusieurs messages. Réessaie dans un moment.",
  fichier: "Fichier refusé. Utilise une image JPG, PNG, WebP ou un PDF, de moins de 4 Mo.",
};

const clock = new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Paris" });
const dayFormat = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", timeZone: "Europe/Paris" });

function dayKey(iso: string) {
  return dayFormat.format(new Date(iso));
}

function dayLabel(iso: string) {
  const day = dayKey(iso);
  return day === dayKey(new Date().toISOString()) ? "Aujourd'hui" : day;
}

function nameTone(name: string) {
  const tones = ["text-blue", "text-amber", "text-blue-deep"] as const;
  let sum = 0;
  for (const char of name) sum += char.charCodeAt(0);
  return tones[sum % tones.length];
}

type Row =
  | { kind: "message"; at: string; message: BoardMessage }
  | { kind: "info"; at: string; info: InfoFile };

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ erreur?: string }>;
}) {
  const user = await requireUser();
  const { erreur } = await searchParams;
  const staff = user.role === "admin" || user.role === "accompagnateur";
  const canWrite = user.role === "user" || staff;
  const messages = boardMessages();
  const messageIds = messages.map((message) => message.id);
  const reactions = reactionsFor(messageIds);
  const comments = commentsFor(messageIds);
  const rows: Row[] = [
    ...messages.map((message) => ({ kind: "message" as const, at: message.created_at, message })),
    ...allInfos().map((info) => ({ kind: "info" as const, at: info.created_at, info })),
  ].sort((a, b) => a.at.localeCompare(b.at));
  let previousDay = "";

  return (
    <ChatRoom>
      <div className="mx-auto flex min-h-0 w-full max-w-lg flex-1 flex-col">
        <div id="fil" className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-[#e7eef8] bg-[radial-gradient(circle,#c5d4e8_0.7px,transparent_0.8px)] bg-[length:18px_18px] px-3 py-4 pb-28">
          <p className="mx-auto max-w-xs rounded-2xl bg-card/90 px-3 py-2 text-center text-xs leading-5 text-muted shadow-sm">
            Tout le monde lit les mêmes messages. Seuls Thierno BARRY et Ibrahima Talibé DIALLO peuvent joindre une image ou un PDF.
          </p>
          {rows.length === 0 && (
            <p className="py-8 text-center text-sm text-muted">Aucun message pour le moment. Écris le premier.</p>
          )}
          {rows.map((row) => {
            const showDay = dayKey(row.at) !== previousDay;
            previousDay = dayKey(row.at);
            const mine = row.kind === "message" && row.message.user_id === user.id;
            return (
              <div key={row.kind === "message" ? `m${row.message.id}` : `i${row.info.id}`}>
                {showDay && (
                  <p className="mx-auto my-3 w-fit rounded-full bg-blue-deep/90 px-3 py-1 text-[11px] text-paper shadow-sm">{dayLabel(row.at)}</p>
                )}
                {row.kind === "info" ? (
                  <article className="mr-8 max-w-[85%] rounded-2xl rounded-bl-md bg-amber-soft px-3 py-2 shadow-sm">
                    <p className="text-xs font-medium text-blue">Parcourstudent</p>
                    <p className="mt-1 text-sm font-medium">{row.info.title}</p>
                    {row.info.note && <p className="mt-1 text-sm leading-5">{row.info.note}</p>}
                    {row.info.mime.startsWith("image/") ? (
                      <img src={`/infos/${row.info.id}`} alt={row.info.title} className="mt-2 max-h-64 w-full rounded-xl object-cover" />
                    ) : (
                      <a className="mt-2 inline-block text-sm text-blue underline" href={`/infos/${row.info.id}`}>Ouvrir le PDF</a>
                    )}
                    <p className="mt-1 text-right text-[11px] text-muted">{clock.format(new Date(row.at))}</p>
                  </article>
                ) : (
                  <MessageBubble
                    message={row.message}
                    mine={mine}
                    time={clock.format(new Date(row.at))}
                    reactions={reactions.filter((item) => item.message_id === row.message.id)}
                    comments={comments.filter((item) => item.message_id === row.message.id)}
                    userId={user.id}
                    canWrite={canWrite}
                    canModerate={staff}
                  />
                )}
              </div>
            );
          })}
        </div>
        <div className="fixed inset-x-0 bottom-[calc(4.25rem+env(safe-area-inset-bottom))] z-30 md:bottom-0">
          {erreur && <p className="bg-amber-soft px-4 py-2 text-center text-sm text-amber">{errors[erreur] ?? "Envoi impossible."}</p>}
          {canWrite ? (
            <form action={postMessageAction} className="mx-auto grid max-w-lg gap-2 border-t border-line bg-card/95 px-3 py-2 shadow-[0_-8px_24px_rgba(20,35,59,0.08)] backdrop-blur">
              {staff && (
                <label className="text-xs text-muted">
                  Image ou PDF, facultatif
                  <input name="file" type="file" accept="image/jpeg,image/png,image/webp,application/pdf" className="mt-1 block w-full text-sm" />
                </label>
              )}
              <div className="flex items-end gap-2">
                <label className="min-w-0 flex-1">
                  <span className="sr-only">Ton message</span>
                  <textarea
                    name="body"
                    required={!staff}
                    maxLength={500}
                    rows={1}
                    placeholder={staff ? "Écris, ou envoie seulement l'image" : "Écris ton message"}
                    className="max-h-28 w-full resize-none rounded-3xl border border-line bg-paper px-4 py-3 text-base leading-5"
                  />
                </label>
                <button className="h-12 shrink-0 rounded-full bg-blue px-4 text-sm font-medium text-paper" type="submit">Envoyer</button>
              </div>
            </form>
          ) : (
            <p className="border-t border-line bg-card px-4 py-3 text-center text-sm text-muted">Tu lis le groupe. Les étudiants écrivent ici.</p>
          )}
        </div>
      </div>
    </ChatRoom>
  );
}

function MessageBubble({
  message,
  mine,
  time,
  reactions,
  comments,
  userId,
  canWrite,
  canModerate,
}: {
  message: BoardMessage;
  mine: boolean;
  time: string;
  reactions: ReactionRow[];
  comments: MessageComment[];
  userId: number;
  canWrite: boolean;
  canModerate: boolean;
}) {
  const counts = reactionEmojis
    .map((emoji) => ({
      emoji,
      count: reactions.filter((item) => item.emoji === emoji).length,
      mine: reactions.some((item) => item.emoji === emoji && item.user_id === userId),
    }))
    .filter((item) => item.count > 0);

  return (
    <article className={mine ? "ml-auto w-fit max-w-[85%]" : "mr-auto w-fit max-w-[85%]"}>
      <div className={mine ? "rounded-2xl rounded-br-md bg-blue px-3.5 py-2.5 text-paper shadow-sm" : "rounded-2xl rounded-bl-md bg-card px-3.5 py-2.5 shadow-sm"}>
        {!mine && <p className={`text-xs font-medium ${nameTone(message.name)}`}>{message.name}</p>}
        {message.body && <p className="mt-0.5 whitespace-pre-wrap text-base leading-5">{message.body}</p>}
        {message.media_mime.startsWith("image/") && (
          <img src={`/messages/media/${message.id}`} alt="Image du message" className="mt-2 max-h-64 w-full rounded-xl bg-paper object-contain" />
        )}
        {message.media_mime === "application/pdf" && (
          <a href={`/messages/media/${message.id}`} className={mine ? "mt-2 inline-block text-sm text-paper underline" : "mt-2 inline-block text-sm text-blue underline"}>Ouvrir le PDF</a>
        )}
        <p className={mine ? "mt-1 text-right text-[11px] text-paper/70" : "mt-1 text-right text-[11px] text-muted"}>{time}</p>
      </div>
      {counts.length > 0 && (
        <div className={mine ? "-mt-2 mr-2 flex justify-end gap-1" : "-mt-2 ml-2 flex gap-1"}>
          {counts.map((item) => (
            <ReactionButton key={item.emoji} messageId={message.id} emoji={item.emoji} count={item.count} active={item.mine} canWrite={canWrite} />
          ))}
        </div>
      )}
      {comments.length > 0 && (
        <ul className="mt-1 grid gap-1">
          {comments.map((comment) => (
            <li key={comment.id} className="rounded-xl border border-line bg-card/90 px-2.5 py-1.5">
              <p className={`text-[11px] font-medium ${nameTone(comment.name)}`}>{comment.name}</p>
              <p className="text-sm leading-5">{comment.body}</p>
              {(comment.user_id === userId || canModerate) && (
                <form action={deleteCommentAction}>
                  <input type="hidden" name="id" value={comment.id} />
                  <button className="text-[11px] text-amber" type="submit">Retirer</button>
                </form>
              )}
            </li>
          ))}
        </ul>
      )}
      {canWrite && (
        <div className={mine ? "mt-1 flex flex-wrap justify-end gap-3" : "mt-1 flex flex-wrap gap-3"}>
          <details>
            <summary className="cursor-pointer text-xs text-muted">Réagir</summary>
            <div className="mt-1 flex gap-1">
              {reactionEmojis.map((emoji) => (
                <ReactionButton key={emoji} messageId={message.id} emoji={emoji} canWrite />
              ))}
            </div>
          </details>
          <details>
            <summary className="cursor-pointer text-xs text-muted">Répondre</summary>
            <form action={commentMessageAction} className="mt-1 flex items-center gap-1">
              <input type="hidden" name="id" value={message.id} />
              <input name="body" required maxLength={300} placeholder="Ta réponse" className="w-36 rounded-full border border-line bg-card px-3 py-2 text-base" />
              <button className="rounded-full bg-blue px-3 py-2 text-xs text-paper" type="submit">OK</button>
            </form>
          </details>
          {(mine || canModerate) && (
            <form action={deleteMessageAction}>
              <input type="hidden" name="id" value={message.id} />
              <button className="text-xs text-amber" type="submit">Retirer</button>
            </form>
          )}
        </div>
      )}
    </article>
  );
}

function ReactionButton({
  messageId,
  emoji,
  count,
  active = false,
  canWrite,
}: {
  messageId: number;
  emoji: string;
  count?: number;
  active?: boolean;
  canWrite: boolean;
}) {
  const face = (
    <span className={`inline-flex h-8 min-w-8 items-center justify-center gap-1 rounded-full border px-2 text-sm ${active ? "border-blue bg-card" : "border-line bg-card"}`}>
      <span aria-hidden="true">{emoji}</span>
      {count ? <span className="text-xs text-ink">{count}</span> : null}
    </span>
  );
  if (!canWrite) return face;
  return (
    <form action={reactMessageAction}>
      <input type="hidden" name="id" value={messageId} />
      <input type="hidden" name="emoji" value={emoji} />
      <button type="submit" aria-label={count ? `${emoji} ${count}` : emoji} className="block">{face}</button>
    </form>
  );
}
