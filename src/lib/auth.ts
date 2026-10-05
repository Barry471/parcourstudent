import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { findUserById, type User } from "@/lib/db";

const cookieName = "parcours_session";

function secret() {
  const value = process.env.SESSION_SECRET;
  if (!value) throw new Error("SESSION_SECRET manquant");
  return value;
}

function sign(value: string) {
  return createHmac("sha256", secret()).update(value).digest("hex");
}

export async function setSession(userId: number) {
  const payload = `${userId}.${Date.now() + 1000 * 60 * 60 * 24 * 14}`;
  const token = `${payload}.${sign(payload)}`;
  const jar = await cookies();
  jar.set(cookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
}

export async function clearSession() {
  const jar = await cookies();
  jar.delete(cookieName);
}

export async function currentUser(): Promise<User | null> {
  const jar = await cookies();
  const token = jar.get(cookieName)?.value;
  if (!token) return null;
  const [id, exp, signature] = token.split(".");
  if (!id || !exp || !signature || !/^\d+$/.test(id) || !/^\d+$/.test(exp)) return null;
  const payload = `${id}.${exp}`;
  const expected = sign(payload);
  const left = Buffer.from(signature);
  const right = Buffer.from(expected);
  if (left.length !== right.length || !timingSafeEqual(left, right)) return null;
  if (Number(exp) < Date.now()) return null;
  const user = findUserById(Number(id));
  if (!user || user.active === 0) return null;
  return user;
}
