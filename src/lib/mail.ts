import nodemailer from "nodemailer";
import { markReminderSent, studentsToRemind } from "@/lib/db";
import { localMailEnabled, saveLocalMail } from "@/lib/localMail";
import { renewalAlert } from "@/lib/renewal";

export function canSendMail() {
  return mailConfigured() || localMailEnabled();
}

function mailFrom() {
  const configured = process.env.SMTP_FROM ?? "";
  if (configured.includes("@")) return configured;
  const user = process.env.SMTP_USER ?? "";
  if (!user.includes("@")) return configured;
  return `Parcourstudent en France <${user}>`;
}

export async function sendPasswordLink(to: string, name: string, link: string) {
  if (!mailConfigured()) {
    if (!localMailEnabled()) return false;
    saveLocalMail({
      to,
      subject: "Parcourstudent en France — nouveau mot de passe",
      text: `${name},\n\nChoisis un nouveau mot de passe avec ce lien. Il expire dans une heure.\n\n${link}\n`,
    });
    return true;
  }
  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === "1",
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      : undefined,
  });
  await transport.sendMail({
    from: mailFrom(),
    to,
    subject: "Parcourstudent en France — nouveau mot de passe",
    text: `${name},\n\nChoisis un nouveau mot de passe avec ce lien. Il expire dans une heure.\n\n${link}\n\nSi tu n'as rien demandé, ignore ce message.\n`,
  });
  return true;
}

export function mailConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_FROM);
}

export async function sendDueReminders(now = new Date()) {
  if (!mailConfigured()) return { configured: false, sent: 0 };
  const today = now.toISOString().slice(0, 10);
  const students = studentsToRemind(today);
  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === "1",
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      : undefined,
  });
  let sent = 0;
  for (const student of students) {
    const alert = renewalAlert(student.titre_expires_on, now);
    if (alert.level === "calm" || alert.level === "missing") continue;
    await transport.sendMail({
      from: mailFrom(),
      to: student.email,
      subject: `Parcourstudent en France — ${alert.title}`,
      text: `${student.name},\n\n${alert.text}\n\nOuvre Mon année dans Parcourstudent en France pour la liste des pièces, puis dépose sur le portail des étrangers.\n`,
    });
    markReminderSent(student.id, today);
    sent += 1;
  }
  return { configured: true, sent };
}
