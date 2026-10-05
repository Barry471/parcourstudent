import fs from "fs";
import path from "path";

export type LocalMail = {
  to: string;
  subject: string;
  text: string;
  createdAt: string;
};

const file = path.join(process.cwd(), "data", "courrier-local.json");

export function localMailEnabled() {
  return process.env.NODE_ENV !== "production";
}

export function saveLocalMail(mail: Omit<LocalMail, "createdAt">) {
  if (!localMailEnabled()) return;
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const current = readLocalMail();
  const next = [{ ...mail, createdAt: new Date().toISOString() }, ...current].slice(0, 20);
  fs.writeFileSync(file, JSON.stringify(next, null, 2));
}

export function readLocalMail() {
  if (!localMailEnabled() || !fs.existsSync(file)) return [];
  try {
    const parsed = JSON.parse(fs.readFileSync(file, "utf8")) as LocalMail[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
