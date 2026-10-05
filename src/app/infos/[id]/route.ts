import { currentUser } from "@/lib/auth";
import { infoById } from "@/lib/db";
import { readInfoFile } from "@/lib/infoFiles";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await currentUser();
  if (!user || user.active === 0) return new Response("Connexion requise", { status: 401 });
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id <= 0) return new Response("Introuvable", { status: 404 });
  const info = infoById(id);
  const bytes = info ? readInfoFile(id) : null;
  if (!info || !bytes) return new Response("Introuvable", { status: 404 });
  return new Response(bytes, {
    headers: {
      "Content-Type": info.mime,
      "Content-Disposition": "inline",
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
