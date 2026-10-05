import { currentUser } from "@/lib/auth";
import { messageMediaMime } from "@/lib/db";
import { readMessageMedia } from "@/lib/messageMedia";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await currentUser();
  if (!user || user.active === 0) return new Response("Connexion requise", { status: 401 });
  const id = Number((await params).id);
  const mime = Number.isInteger(id) ? messageMediaMime(id) : "";
  const bytes = mime ? readMessageMedia(id) : null;
  if (!mime || !bytes) return new Response("Introuvable", { status: 404 });
  return new Response(bytes, {
    headers: {
      "Content-Type": mime,
      "Content-Disposition": "inline",
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
