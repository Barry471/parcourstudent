import { headers } from "next/headers";
import { currentUser } from "@/lib/auth";
import { logVisit } from "@/lib/db";

export async function trackVisit() {
  const pathname = (await headers()).get("x-pathname");
  if (!pathname || pathname.startsWith("/admin")) return;
  const user = await currentUser();
  logVisit(pathname, user?.id ?? null);
}
