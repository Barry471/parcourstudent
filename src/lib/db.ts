import { DatabaseSync } from "node:sqlite";
import fs from "fs";
import path from "path";
import { accompagnateurName } from "@/lib/accompagnement";
import { hashPassword } from "@/lib/password";

export type User = {
  id: number;
  email: string;
  name: string;
  role: "user" | "admin" | "accompagnateur";
  city: string | null;
  school: string | null;
  titre_expires_on: string | null;
  arrived_on: string | null;
  reminder_sent_on: string | null;
  situation: string | null;
  year_level: string | null;
  country: string | null;
  active: number;
  created_at: string;
  password_help_at?: string | null;
};

export type CityGroup = {
  id: number;
  city: string;
  platform: string;
  label: string;
  url: string;
  audience: string;
};

export type PartnerLink = {
  id: number;
  category: string;
  title: string;
  url: string;
  note: string;
  affiliate: number;
};

export type Visit = {
  id: number;
  path: string;
  email: string | null;
  created_at: string;
};

const dir = path.join(process.cwd(), "data");
fs.mkdirSync(dir, { recursive: true });

const db = new DatabaseSync(path.join(dir, "parcours.db"), { timeout: 10000 });
db.exec("PRAGMA journal_mode = WAL");
db.exec("PRAGMA busy_timeout = 10000");

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user',
    created_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS visits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    path TEXT NOT NULL,
    user_id INTEGER,
    created_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS city_groups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    city TEXT NOT NULL,
    platform TEXT NOT NULL,
    label TEXT NOT NULL,
    url TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS partner_links (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    note TEXT NOT NULL DEFAULT ''
  );
  CREATE TABLE IF NOT EXISTS videos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    kind TEXT NOT NULL,
    target TEXT NOT NULL,
    platform TEXT NOT NULL,
    title TEXT NOT NULL,
    url TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS login_attempts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    created_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS progress (
    user_id INTEGER NOT NULL,
    step_id TEXT NOT NULL,
    PRIMARY KEY (user_id, step_id)
  );
`);

function addColumn(table: string, column: string, definition: string) {
  const columns = db.prepare(`PRAGMA table_info(${table})`).all() as { name: string }[];
  if (columns.some((item) => item.name === column)) return;
  try {
    db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (!message.includes("duplicate column name")) throw error;
  }
}

for (const column of ["city", "school", "titre_expires_on", "arrived_on", "reminder_sent_on", "situation", "year_level", "country", "password_help_at"]) {
  addColumn("users", column, "TEXT");
}
addColumn("users", "active", "INTEGER NOT NULL DEFAULT 1");
addColumn("city_groups", "audience", "TEXT NOT NULL DEFAULT 'ville'");
db.exec(`
  CREATE TABLE IF NOT EXISTS password_resets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    token_hash TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    used INTEGER NOT NULL DEFAULT 0
  );
  CREATE TABLE IF NOT EXISTS alerts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    country TEXT NOT NULL DEFAULT '',
    city TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    body TEXT NOT NULL,
    created_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS infos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    note TEXT NOT NULL DEFAULT '',
    mime TEXT NOT NULL,
    created_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS message_reactions (
    message_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    emoji TEXT NOT NULL,
    PRIMARY KEY (message_id, user_id)
  );
  CREATE TABLE IF NOT EXISTS message_comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    message_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    body TEXT NOT NULL,
    created_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    kind TEXT NOT NULL,
    starts_at TEXT NOT NULL,
    note TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'demande',
    created_at TEXT NOT NULL
  );
  CREATE UNIQUE INDEX IF NOT EXISTS appointments_open_slot ON appointments (starts_at) WHERE status != 'annule';
  CREATE TABLE IF NOT EXISTS accompaniment (
    user_id INTEGER PRIMARY KEY,
    status TEXT NOT NULL,
    needs TEXT NOT NULL,
    phone TEXT NOT NULL DEFAULT '',
    note TEXT NOT NULL DEFAULT '',
    reply TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL,
    decided_at TEXT
  );
  CREATE TABLE IF NOT EXISTS contact_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL DEFAULT '',
    body TEXT NOT NULL,
    created_at TEXT NOT NULL
  );
`);

function seedAdmin() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) return;
  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email) as
    | { id: number }
    | undefined;
  if (existing) return;
  db.prepare(
    "INSERT INTO users (email, name, password_hash, role, created_at) VALUES (?, ?, ?, 'admin', ?)",
  ).run(email, "Administration", hashPassword(password), new Date().toISOString());
}

function seedAccompagnateur() {
  const email = process.env.ACCOMPAGNEMENT_EMAIL?.trim().toLowerCase();
  const password = process.env.ACCOMPAGNEMENT_PASSWORD;
  if (!email || !password) return;
  const existing = db.prepare("SELECT id FROM users WHERE email = ? OR role = 'accompagnateur'").get(email) as
    | { id: number }
    | undefined;
  if (existing) return;
  db.prepare(
    "INSERT INTO users (email, name, password_hash, role, active, created_at) VALUES (?, ?, ?, 'accompagnateur', 1, ?)",
  ).run(email, accompagnateurName, hashPassword(password), new Date().toISOString());
}

seedAdmin();
seedAccompagnateur();

export function recentLoginFailures(email: string, sinceIso: string) {
  const row = db
    .prepare("SELECT COUNT(*) AS count FROM login_attempts WHERE email = ? AND created_at >= ?")
    .get(email, sinceIso) as { count: number };
  return row.count;
}

export function recordLoginFailure(email: string) {
  db.prepare("INSERT INTO login_attempts (email, created_at) VALUES (?, ?)").run(email, new Date().toISOString());
}

export function clearLoginFailures(email: string) {
  db.prepare("DELETE FROM login_attempts WHERE email = ?").run(email);
}

export function findUserByEmail(email: string) {
  return db
    .prepare(
      "SELECT id, email, name, password_hash, role, city, school, titre_expires_on, arrived_on, reminder_sent_on, situation, year_level, country, active, created_at FROM users WHERE email = ?",
    )
    .get(email) as (User & { password_hash: string }) | undefined;
}

export function findAccompagnateur() {
  return db
    .prepare("SELECT id, email, name FROM users WHERE role = 'accompagnateur'")
    .get() as { id: number; email: string; name: string } | undefined;
}

export function saveAccompagnateurAccount(email: string, passwordHash: string | null) {
  const current = findAccompagnateur();
  if (!current) {
    if (!passwordHash) return;
    db.prepare(
      "INSERT INTO users (email, name, password_hash, role, active, created_at) VALUES (?, ?, ?, 'accompagnateur', 1, ?)",
    ).run(email, accompagnateurName, passwordHash, new Date().toISOString());
    return;
  }
  if (passwordHash) {
    db.prepare("UPDATE users SET email = ?, name = ?, password_hash = ? WHERE id = ?").run(email, accompagnateurName, passwordHash, current.id);
    return;
  }
  db.prepare("UPDATE users SET email = ?, name = ? WHERE id = ?").run(email, accompagnateurName, current.id);
}

export function findUserById(id: number) {
  return db
    .prepare("SELECT id, email, name, role, city, school, titre_expires_on, arrived_on, reminder_sent_on, situation, year_level, country, active, created_at FROM users WHERE id = ?")
    .get(id) as User | undefined;
}

export function createUser(
  name: string,
  email: string,
  passwordHash: string,
  city: string,
  school: string,
  country: string,
) {
  const createdAt = new Date().toISOString();
  const result = db
    .prepare(
      "INSERT INTO users (email, name, password_hash, role, city, school, country, active, created_at) VALUES (?, ?, ?, 'user', ?, ?, ?, 1, ?)",
    )
    .run(email, name, passwordHash, city, school, country, createdAt);
  return findUserById(Number(result.lastInsertRowid))!;
}

export function updateProfile(userId: number, city: string, school: string) {
  db.prepare("UPDATE users SET city = ?, school = ? WHERE id = ?").run(city, school, userId);
}

export function saveTitreExpiry(userId: number, date: string) {
  db.prepare("UPDATE users SET titre_expires_on = ?, reminder_sent_on = NULL WHERE id = ?").run(date, userId);
}

export function saveArrival(userId: number, date: string) {
  db.prepare("UPDATE users SET arrived_on = ? WHERE id = ?").run(date, userId);
}

export function studentsToRemind(today: string) {
  return db
    .prepare(
      `SELECT id, email, name, role, city, school, titre_expires_on, arrived_on, reminder_sent_on, situation, year_level, country, active, created_at
       FROM users
       WHERE role = 'user' AND active = 1 AND titre_expires_on IS NOT NULL
         AND titre_expires_on <= date(?, '+120 days')
         AND (reminder_sent_on IS NULL OR reminder_sent_on <= date(?, '-7 days'))`,
    )
    .all(today, today) as User[];
}

export function markReminderSent(userId: number, day: string) {
  db.prepare("UPDATE users SET reminder_sent_on = ? WHERE id = ?").run(day, userId);
}

export function saveYear(userId: number, situation: string, yearLevel: string) {
  db.prepare("UPDATE users SET situation = ?, year_level = ? WHERE id = ?").run(situation, yearLevel, userId);
}

export function groupsForCity(city: string) {
  return db
    .prepare("SELECT id, city, platform, label, url, audience FROM city_groups WHERE city = ? AND audience = 'ville' ORDER BY id DESC")
    .all(city) as CityGroup[];
}

export function groupsForCandidature(city: string | null) {
  return db
    .prepare(
      "SELECT id, city, platform, label, url, audience FROM city_groups WHERE audience = 'candidature' AND (city = '' OR city = 'toutes' OR city = ?) ORDER BY id DESC",
    )
    .all(city ?? "") as CityGroup[];
}

export function allGroups() {
  return db
    .prepare("SELECT id, city, platform, label, url, audience FROM city_groups ORDER BY audience, city, id DESC")
    .all() as CityGroup[];
}

export function addGroup(city: string, platform: string, label: string, url: string, audience: string) {
  db.prepare("INSERT INTO city_groups (city, platform, label, url, audience) VALUES (?, ?, ?, ?, ?)").run(
    city,
    platform,
    label,
    url,
    audience,
  );
}

export function deleteGroup(id: number) {
  db.prepare("DELETE FROM city_groups WHERE id = ?").run(id);
}

addColumn("partner_links", "affiliate", "INTEGER NOT NULL DEFAULT 0");

export function linksForCategory(category: string) {
  return db
    .prepare("SELECT id, category, title, url, note, affiliate FROM partner_links WHERE category = ? ORDER BY id DESC")
    .all(category) as PartnerLink[];
}

export function allLinks() {
  return db
    .prepare("SELECT id, category, title, url, note, affiliate FROM partner_links ORDER BY category, id DESC")
    .all() as PartnerLink[];
}

export function addLink(category: string, title: string, url: string, note: string, affiliate: number) {
  db.prepare("INSERT INTO partner_links (category, title, url, note, affiliate) VALUES (?, ?, ?, ?, ?)").run(
    category,
    title,
    url,
    note,
    affiliate,
  );
}

export function deleteLink(id: number) {
  db.prepare("DELETE FROM partner_links WHERE id = ?").run(id);
}

export type Video = {
  id: number;
  kind: string;
  target: string;
  platform: string;
  title: string;
  url: string;
};

export function videosFor(kind: string, target: string) {
  return db
    .prepare("SELECT id, kind, target, platform, title, url FROM videos WHERE kind = ? AND target = ? ORDER BY id DESC")
    .all(kind, target) as Video[];
}

export function allVideos() {
  return db.prepare("SELECT id, kind, target, platform, title, url FROM videos ORDER BY kind, target, id DESC").all() as Video[];
}

export function addVideo(kind: string, target: string, platform: string, title: string, url: string) {
  db.prepare("INSERT INTO videos (kind, target, platform, title, url) VALUES (?, ?, ?, ?, ?)").run(
    kind,
    target,
    platform,
    title,
    url,
  );
}

export function deleteVideo(id: number) {
  db.prepare("DELETE FROM videos WHERE id = ?").run(id);
}

export function doneSteps(userId: number) {
  return (
    db.prepare("SELECT step_id FROM progress WHERE user_id = ?").all(userId) as { step_id: string }[]
  ).map((row) => row.step_id);
}

export function toggleStep(userId: number, stepId: string) {
  const existing = db
    .prepare("SELECT step_id FROM progress WHERE user_id = ? AND step_id = ?")
    .get(userId, stepId);
  if (existing) {
    db.prepare("DELETE FROM progress WHERE user_id = ? AND step_id = ?").run(userId, stepId);
    return;
  }
  db.prepare("INSERT INTO progress (user_id, step_id) VALUES (?, ?)").run(userId, stepId);
}

export function logVisit(pathname: string, userId: number | null) {
  if (pathname.startsWith("/admin") || pathname.startsWith("/_next")) return;
  db.prepare("INSERT INTO visits (path, user_id, created_at) VALUES (?, ?, ?)").run(
    pathname,
    userId,
    new Date().toISOString(),
  );
}

export function trafficSummary() {
  const total = db.prepare("SELECT COUNT(*) AS count FROM visits").get() as { count: number };
  const today = db
    .prepare("SELECT COUNT(*) AS count FROM visits WHERE created_at >= ?")
    .get(new Date().toISOString().slice(0, 10)) as { count: number };
  const users = db.prepare("SELECT COUNT(*) AS count FROM users").get() as { count: number };
  const recent = db
    .prepare(
      `SELECT visits.id, visits.path, users.email, visits.created_at
       FROM visits
       LEFT JOIN users ON users.id = visits.user_id
       ORDER BY visits.id DESC
       LIMIT 40`,
    )
    .all() as Visit[];
  const accounts = db
    .prepare(
      "SELECT id, email, name, role, city, school, titre_expires_on, arrived_on, reminder_sent_on, situation, year_level, country, active, created_at FROM users ORDER BY id DESC",
    )
    .all() as User[];
  return { total: total.count, today: today.count, users: users.count, recent, accounts };
}

export function studentsByCity() {
  return db
    .prepare(
      "SELECT id, email, name, role, city, school, titre_expires_on, arrived_on, reminder_sent_on, situation, year_level, country, active, created_at, password_help_at FROM users WHERE role = 'user' ORDER BY city, name",
    )
    .all() as User[];
}

export function setUserActive(userId: number, active: number) {
  db.prepare("UPDATE users SET active = ? WHERE id = ? AND role = 'user'").run(active, userId);
}

export function setUserPassword(userId: number, passwordHash: string) {
  db.prepare("UPDATE users SET password_hash = ?, password_help_at = NULL WHERE id = ? AND role = 'user'").run(passwordHash, userId);
}

export function recentResetCount(userId: number, sinceIso: string) {
  const row = db
    .prepare("SELECT COUNT(*) AS count FROM password_resets WHERE user_id = ? AND expires_at >= ?")
    .get(userId, sinceIso) as { count: number };
  return row.count;
}

export function saveResetToken(userId: number, tokenHash: string, expiresAt: string) {
  db.prepare("INSERT INTO password_resets (user_id, token_hash, expires_at, used) VALUES (?, ?, ?, 0)").run(userId, tokenHash, expiresAt);
}

export function takeResetToken(tokenHash: string, nowIso: string) {
  const row = db
    .prepare("SELECT id, user_id FROM password_resets WHERE token_hash = ? AND used = 0 AND expires_at >= ?")
    .get(tokenHash, nowIso) as { id: number; user_id: number } | undefined;
  if (!row) return null;
  db.prepare("UPDATE password_resets SET used = 1 WHERE id = ?").run(row.id);
  return row.user_id;
}

export function updateOwnPassword(userId: number, passwordHash: string) {
  db.prepare("UPDATE users SET password_hash = ?, password_help_at = NULL WHERE id = ?").run(passwordHash, userId);
}

export function askPasswordHelp(userId: number) {
  db.prepare("UPDATE users SET password_help_at = ? WHERE id = ? AND role = 'user'").run(new Date().toISOString(), userId);
}

export function deleteStudent(userId: number) {
  const owned = db.prepare("SELECT id FROM messages WHERE user_id = ?").all(userId) as { id: number }[];
  for (const row of owned) clearMessageExtras(row.id);
  db.prepare("DELETE FROM message_reactions WHERE user_id = ?").run(userId);
  db.prepare("DELETE FROM message_comments WHERE user_id = ?").run(userId);
  db.prepare("DELETE FROM messages WHERE user_id = ?").run(userId);
  db.prepare("DELETE FROM progress WHERE user_id = ?").run(userId);
  db.prepare("DELETE FROM users WHERE id = ? AND role = 'user'").run(userId);
}

function clearMessageExtras(messageId: number) {
  db.prepare("DELETE FROM message_reactions WHERE message_id = ?").run(messageId);
  db.prepare("DELETE FROM message_comments WHERE message_id = ?").run(messageId);
}

export type BoardMessage = {
  id: number;
  user_id: number;
  name: string;
  body: string;
  created_at: string;
};

export function recentMessageCount(userId: number, sinceIso: string) {
  const row = db
    .prepare("SELECT COUNT(*) AS count FROM messages WHERE user_id = ? AND created_at >= ?")
    .get(userId, sinceIso) as { count: number };
  return row.count;
}

export function addMessage(userId: number, body: string) {
  db.prepare("INSERT INTO messages (user_id, body, created_at) VALUES (?, ?, ?)").run(userId, body, new Date().toISOString());
}

export function boardMessages() {
  const rows = db
    .prepare(
      `SELECT messages.id, messages.user_id, users.name, messages.body, messages.created_at
       FROM messages JOIN users ON users.id = messages.user_id
       ORDER BY messages.id DESC LIMIT 80`,
    )
    .all() as BoardMessage[];
  return rows.reverse();
}

export function deleteMessage(id: number) {
  clearMessageExtras(id);
  db.prepare("DELETE FROM messages WHERE id = ?").run(id);
}

export function deleteOwnMessage(id: number, userId: number) {
  const row = db.prepare("SELECT id FROM messages WHERE id = ? AND user_id = ?").get(id, userId) as { id: number } | undefined;
  if (!row) return;
  clearMessageExtras(id);
  db.prepare("DELETE FROM messages WHERE id = ?").run(id);
}

export const reactionEmojis = ["👍", "❤️", "😂", "😮", "🙏"] as const;

export type ReactionRow = { message_id: number; user_id: number; emoji: string };

export type MessageComment = {
  id: number;
  message_id: number;
  user_id: number;
  name: string;
  body: string;
  created_at: string;
};

function messageIdList(ids: number[]) {
  return ids.filter((id) => Number.isInteger(id) && id > 0);
}

export function reactionsFor(ids: number[]) {
  const safe = messageIdList(ids);
  if (safe.length === 0) return [] as ReactionRow[];
  const marks = safe.map(() => "?").join(", ");
  return db
    .prepare(`SELECT message_id, user_id, emoji FROM message_reactions WHERE message_id IN (${marks})`)
    .all(...safe) as ReactionRow[];
}

export function commentsFor(ids: number[]) {
  const safe = messageIdList(ids);
  if (safe.length === 0) return [] as MessageComment[];
  const marks = safe.map(() => "?").join(", ");
  return db
    .prepare(
      `SELECT message_comments.id, message_comments.message_id, message_comments.user_id, users.name, message_comments.body, message_comments.created_at
       FROM message_comments JOIN users ON users.id = message_comments.user_id
       WHERE message_comments.message_id IN (${marks})
       ORDER BY message_comments.id`,
    )
    .all(...safe) as MessageComment[];
}

export function toggleReaction(messageId: number, userId: number, emoji: string) {
  const message = db.prepare("SELECT id FROM messages WHERE id = ?").get(messageId) as { id: number } | undefined;
  if (!message) return;
  const current = db
    .prepare("SELECT emoji FROM message_reactions WHERE message_id = ? AND user_id = ?")
    .get(messageId, userId) as { emoji: string } | undefined;
  if (current?.emoji === emoji) {
    db.prepare("DELETE FROM message_reactions WHERE message_id = ? AND user_id = ?").run(messageId, userId);
    return;
  }
  db.prepare(
    `INSERT INTO message_reactions (message_id, user_id, emoji) VALUES (?, ?, ?)
     ON CONFLICT(message_id, user_id) DO UPDATE SET emoji = excluded.emoji`,
  ).run(messageId, userId, emoji);
}

export function recentCommentCount(userId: number, sinceIso: string) {
  const row = db
    .prepare("SELECT COUNT(*) AS count FROM message_comments WHERE user_id = ? AND created_at >= ?")
    .get(userId, sinceIso) as { count: number };
  return row.count;
}

export function addComment(messageId: number, userId: number, body: string) {
  const message = db.prepare("SELECT id FROM messages WHERE id = ?").get(messageId) as { id: number } | undefined;
  if (!message) return;
  db.prepare("INSERT INTO message_comments (message_id, user_id, body, created_at) VALUES (?, ?, ?, ?)").run(
    messageId,
    userId,
    body,
    new Date().toISOString(),
  );
}

export function deleteOwnComment(id: number, userId: number) {
  db.prepare("DELETE FROM message_comments WHERE id = ? AND user_id = ?").run(id, userId);
}

export function deleteComment(id: number) {
  db.prepare("DELETE FROM message_comments WHERE id = ?").run(id);
}

export type InfoFile = {
  id: number;
  title: string;
  note: string;
  mime: string;
  created_at: string;
};

export function addInfo(title: string, note: string, mime: string) {
  const result = db
    .prepare("INSERT INTO infos (title, note, mime, created_at) VALUES (?, ?, ?, ?)")
    .run(title, note, mime, new Date().toISOString());
  return Number(result.lastInsertRowid);
}

export function allInfos() {
  return db.prepare("SELECT id, title, note, mime, created_at FROM infos ORDER BY id DESC").all() as InfoFile[];
}

export function infoById(id: number) {
  return db.prepare("SELECT id, title, note, mime, created_at FROM infos WHERE id = ?").get(id) as InfoFile | undefined;
}

export function deleteInfo(id: number) {
  db.prepare("DELETE FROM infos WHERE id = ?").run(id);
}

export type Alert = {
  id: number;
  title: string;
  body: string;
  country: string;
  city: string;
  created_at: string;
};

export function addAlert(title: string, body: string, country: string, city: string) {
  db.prepare("INSERT INTO alerts (title, body, country, city, created_at) VALUES (?, ?, ?, ?, ?)").run(
    title,
    body,
    country,
    city,
    new Date().toISOString(),
  );
}

export function deleteAlert(id: number) {
  db.prepare("DELETE FROM alerts WHERE id = ?").run(id);
}

export function allAlerts() {
  return db.prepare("SELECT id, title, body, country, city, created_at FROM alerts ORDER BY id DESC").all() as Alert[];
}

export type Appointment = {
  id: number;
  user_id: number;
  kind: string;
  starts_at: string;
  note: string;
  status: string;
  created_at: string;
};

export type AppointmentRow = Appointment & {
  name: string;
  email: string;
  city: string | null;
};

export function appointmentsForUser(userId: number) {
  return db
    .prepare(
      "SELECT id, user_id, kind, starts_at, note, status, created_at FROM appointments WHERE user_id = ? ORDER BY starts_at",
    )
    .all(userId) as Appointment[];
}

export function openAppointmentCount(userId: number, nowStamp: string) {
  const row = db
    .prepare(
      "SELECT COUNT(*) AS count FROM appointments WHERE user_id = ? AND status IN ('demande', 'confirme') AND starts_at >= ?",
    )
    .get(userId, nowStamp) as { count: number };
  return row.count;
}

export function addAppointment(userId: number, kind: string, startsAt: string, note: string) {
  const taken = db
    .prepare("SELECT id FROM appointments WHERE starts_at = ? AND status != 'annule'")
    .get(startsAt) as { id: number } | undefined;
  if (taken) return "pris" as const;
  try {
    db.prepare(
      "INSERT INTO appointments (user_id, kind, starts_at, note, status, created_at) VALUES (?, ?, ?, ?, 'demande', ?)",
    ).run(userId, kind, startsAt, note, new Date().toISOString());
    return "ok" as const;
  } catch {
    return "pris" as const;
  }
}

export function cancelOwnAppointment(id: number, userId: number) {
  db.prepare(
    "UPDATE appointments SET status = 'annule' WHERE id = ? AND user_id = ? AND status IN ('demande', 'confirme')",
  ).run(id, userId);
}

export function allAppointments() {
  return db
    .prepare(
      `SELECT a.id, a.user_id, a.kind, a.starts_at, a.note, a.status, a.created_at, u.name, u.email, u.city
       FROM appointments a JOIN users u ON u.id = a.user_id
       ORDER BY a.starts_at`,
    )
    .all() as AppointmentRow[];
}

export function setAppointmentStatus(id: number, status: "confirme" | "annule" | "fait") {
  db.prepare("UPDATE appointments SET status = ? WHERE id = ? AND status IN ('demande', 'confirme')").run(status, id);
}

export type Accompaniment = {
  user_id: number;
  status: string;
  needs: string;
  phone: string;
  note: string;
  reply: string;
  created_at: string;
  decided_at: string | null;
};

export type AccompanimentRow = Accompaniment & {
  name: string;
  email: string;
  city: string | null;
};

export function accompanimentFor(userId: number) {
  return db
    .prepare(
      "SELECT user_id, status, needs, phone, note, reply, created_at, decided_at FROM accompaniment WHERE user_id = ?",
    )
    .get(userId) as Accompaniment | undefined;
}

export function saveAccompaniment(userId: number, needs: string, phone: string, note: string) {
  const current = accompanimentFor(userId);
  if (current && current.status !== "refuse") return;
  const now = new Date().toISOString();
  if (!current) {
    db.prepare(
      "INSERT INTO accompaniment (user_id, status, needs, phone, note, reply, created_at, decided_at) VALUES (?, 'demande', ?, ?, ?, '', ?, NULL)",
    ).run(userId, needs, phone, note, now);
    return;
  }
  db.prepare(
    "UPDATE accompaniment SET status = 'demande', needs = ?, phone = ?, note = ?, reply = '', created_at = ?, decided_at = NULL WHERE user_id = ? AND status = 'refuse'",
  ).run(needs, phone, note, now, userId);
}

export function decideAccompaniment(userId: number, status: "accepte" | "refuse", reply: string) {
  db.prepare(
    "UPDATE accompaniment SET status = ?, reply = ?, decided_at = ? WHERE user_id = ? AND status = 'demande'",
  ).run(status, reply, new Date().toISOString(), userId);
}

export function allAccompaniment() {
  return db
    .prepare(
      `SELECT a.user_id, a.status, a.needs, a.phone, a.note, a.reply, a.created_at, a.decided_at,
              u.name, u.email, u.city
       FROM accompaniment a JOIN users u ON u.id = a.user_id
       ORDER BY CASE a.status WHEN 'demande' THEN 0 WHEN 'accepte' THEN 1 ELSE 2 END, a.created_at DESC`,
    )
    .all() as AccompanimentRow[];
}

export type ContactMessage = {
  id: number;
  name: string;
  email: string;
  phone: string;
  body: string;
  created_at: string;
};

export function recentContactCount(email: string, sinceIso: string) {
  const row = db
    .prepare("SELECT COUNT(*) AS count FROM contact_messages WHERE email = ? AND created_at >= ?")
    .get(email, sinceIso) as { count: number };
  return row.count;
}

export function addContactMessage(name: string, email: string, phone: string, body: string) {
  db.prepare("INSERT INTO contact_messages (name, email, phone, body, created_at) VALUES (?, ?, ?, ?, ?)").run(
    name,
    email,
    phone,
    body,
    new Date().toISOString(),
  );
}

export function allContactMessages() {
  return db
    .prepare("SELECT id, name, email, phone, body, created_at FROM contact_messages ORDER BY id DESC")
    .all() as ContactMessage[];
}

export function deleteContactMessage(id: number) {
  db.prepare("DELETE FROM contact_messages WHERE id = ?").run(id);
}

export function alertsFor(country: string | null, city: string | null) {
  return db
    .prepare(
      `SELECT id, title, body, country, city, created_at FROM alerts
       WHERE (country = '' OR country = ?) AND (city = '' OR city = ?)
       ORDER BY id DESC`,
    )
    .all(country ?? "", city ?? "") as Alert[];
}
