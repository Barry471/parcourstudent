import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";

export async function requireUser() {
  const user = await currentUser();
  if (!user) {
    const path = (await headers()).get("x-pathname") ?? "/commencer";
    redirect(`/connexion?next=${encodeURIComponent(path)}`);
  }
  return user;
}
