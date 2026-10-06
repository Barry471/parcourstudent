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

function smtpAttempts() {
  const configuredPort = Number(process.env.SMTP_PORT ?? 465);
  const configuredSecure = process.env.SMTP_SECURE === "1" || configuredPort === 465;
  const attempts = [
    { port: 587, secure: false },
    { port: configuredPort, secure: configuredSecure },
    { port: 465, secure: true },
  ];
  const seen = new Set<string>();
  return attempts.filter((attempt) => {
    if (!Number.isInteger(attempt.port) || attempt.port <= 0) return false;
    const key = `${attempt.port}:${attempt.secure}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

const ZIMBRA_SOAP = "https://zimbra1.mail.ovh.net/service/soap";

function zimbraText(value: unknown): string {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return zimbraText(value[0]);
  if (value && typeof value === "object" && "_content" in value) {
    const content = (value as { _content?: unknown })._content;
    return typeof content === "string" ? content : "";
  }
  return "";
}

async function zimbraCall(payload: Record<string, unknown>) {
  const response = await fetch(ZIMBRA_SOAP, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(12000),
  });
  return (await response.json()) as {
    Body?: {
      AuthResponse?: { authToken?: unknown; csrfToken?: unknown };
      SendMsgResponse?: unknown;
      Fault?: { Detail?: { Error?: { Code?: string } } };
    };
  };
}

async function deliverViaWebmail(message: { to: string; subject: string; text: string }) {
  const user = process.env.SMTP_USER ?? "";
  const pass = process.env.SMTP_PASS ?? "";
  if (!user.includes("@") || !pass) {
    throw Object.assign(new Error("EAUTH"), { code: "EAUTH" });
  }
  const auth = await zimbraCall({
    Header: { context: { _jsns: "urn:zimbra" } },
    Body: {
      AuthRequest: {
        _jsns: "urn:zimbraAccount",
        account: { _content: user, by: "name" },
        password: pass,
      },
    },
  });
  const authFault = auth.Body?.Fault?.Detail?.Error?.Code;
  const token = zimbraText(auth.Body?.AuthResponse?.authToken);
  if (authFault || !token) {
    throw Object.assign(new Error(authFault || "EAUTH"), { code: authFault || "EAUTH" });
  }
  const csrf = zimbraText(auth.Body?.AuthResponse?.csrfToken);
  const sent = await zimbraCall({
    Header: {
      context: {
        _jsns: "urn:zimbra",
        authToken: token,
        ...(csrf ? { csrfToken: csrf } : {}),
      },
    },
    Body: {
      SendMsgRequest: {
        _jsns: "urn:zimbraMail",
        m: {
          e: [
            { t: "t", a: message.to },
            { t: "f", a: user },
          ],
          su: message.subject,
          mp: { ct: "text/plain", content: message.text },
        },
      },
    },
  });
  const sendFault = sent.Body?.Fault?.Detail?.Error?.Code;
  if (sendFault || !sent.Body?.SendMsgResponse) {
    throw Object.assign(new Error(sendFault || "WEBMAIL_SEND"), { code: sendFault || "WEBMAIL_SEND" });
  }
}

async function deliver(message: { from: string; to: string; subject: string; text: string }) {
  const auth = process.env.SMTP_USER
    ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    : undefined;
  let lastError: unknown;
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      await deliverViaWebmail(message);
      return;
    } catch (error) {
      lastError = error;
    }
  }
  for (const attempt of smtpAttempts()) {
    const transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: attempt.port,
      secure: attempt.secure,
      auth,
      connectionTimeout: 8000,
      greetingTimeout: 8000,
      socketTimeout: 12000,
    });
    try {
      await transport.sendMail(message);
      return;
    } catch (error) {
      lastError = error;
    } finally {
      transport.close();
    }
  }
  throw lastError;
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
  await deliver({
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
  let sent = 0;
  for (const student of students) {
    const alert = renewalAlert(student.titre_expires_on, now);
    if (alert.level === "calm" || alert.level === "missing") continue;
    await deliver({
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
