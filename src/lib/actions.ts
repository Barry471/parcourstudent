"use server";

import { createHash, randomBytes } from "crypto";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";
import { candidatures } from "@/lib/candidatures";
import { acceptedCity, cities, countries, undecidedSchool } from "@/lib/content";
import { demarches, situations, yearLevels } from "@/lib/demarches";
import { videoPlatform } from "@/lib/videos";
import { categories } from "@/lib/procedure";
import {
  addAlert,
  addContactMessage,
  deleteAlert,
  deleteContactMessage,
  recentContactCount,
  addInfo,
  addComment,
  addMessage,
  deleteComment,
  deleteInfo,
  deleteMessage,
  deleteOwnComment,
  deleteOwnMessage,
  reactionEmojis,
  recentCommentCount,
  recentMessageCount,
  toggleReaction,
  addGroup,
  addLink,
  addVideo,
  deleteVideo,
  clearLoginFailures,
  recentLoginFailures,
  recentLoginTotal,
  recentUserCount,
  recordLoginFailure,
  createUser,
  deleteGroup,
  deleteLink,
  deleteStudent,
  setUserActive,
  setUserPassword,
  findAccompagnateur,
  findUserByEmail,
  findUserById,
  saveAccompagnateurAccount,
  recentResetCount,
  saveResetToken,
  takeResetToken,
  updateOwnPassword,
  saveArrival,
  saveTitreExpiry,
  saveYear,
  toggleStep,
  updateProfile,
} from "@/lib/db";
import { clearSession, setSession } from "@/lib/auth";
import { cleanEmail, cleanText, newPasswordOk, passwordOk, safeNext, validEmail } from "@/lib/input";
import { removeInfoFile, saveInfoFile, sniffInfo } from "@/lib/infoFiles";
import { broadcastChat } from "@/lib/live";
import { canSendMail, sendPasswordLink } from "@/lib/mail";
import { dummyPasswordHash, hashPassword, verifyPassword } from "@/lib/password";

function studentsPath(formData: FormData) {
  const params = new URLSearchParams();
  const q = cleanText(formData.get("filtre"), 80);
  const pays = String(formData.get("filtre_pays") ?? "");
  const ville = String(formData.get("filtre_ville") ?? "");
  if (q) params.set("q", q);
  if (countries.some((item) => item.id === pays)) params.set("pays", pays);
  if (acceptedCity(ville)) params.set("ville", ville);
  const query = params.toString();
  return query ? `/admin/etudiants?${query}` : "/admin/etudiants";
}

function httpsUrl(value: FormDataEntryValue | null) {
  const url = String(value ?? "").trim();
  if (url.length > 400 || !url.startsWith("https://") || /\s/.test(url)) return "";
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") return "";
    return url;
  } catch {
    return "";
  }
}

export async function registerAction(formData: FormData) {
  const name = cleanText(formData.get("name"), 80);
  const email = cleanEmail(formData.get("email"));
  const password = String(formData.get("password") ?? "");
  const city = String(formData.get("city") ?? "");
  const school = cleanText(formData.get("school"), 120) || undecidedSchool;
  const country = String(formData.get("country") ?? "");
  const knownCountry = countries.some((item) => item.id === country);
  if (name.length < 2 || !validEmail(email) || !newPasswordOk(password) || !acceptedCity(city) || !knownCountry) {
    redirect("/inscription?erreur=incomplet");
  }
  const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  if (recentUserCount(since) >= 40) redirect("/inscription?erreur=attente");
  if (findUserByEmail(email)) redirect("/inscription?erreur=existe");
  const user = createUser(name, email, hashPassword(password), city, school, country);
  await setSession(user.id);
  redirect("/parcours");
}

export async function profileAction(formData: FormData) {
  const user = await currentUser();
  if (!user) redirect("/connexion?next=/parcours");
  const city = String(formData.get("city") ?? "");
  const school = cleanText(formData.get("school"), 120) || undecidedSchool;
  if (!acceptedCity(city)) redirect("/parcours?erreur=profil");
  updateProfile(user.id, city, school);
  redirect("/parcours");
}

export async function yearAction(formData: FormData) {
  const user = await currentUser();
  if (!user) redirect("/connexion?next=/annee");
  const situation = String(formData.get("situation") ?? "");
  const yearLevel = String(formData.get("year_level") ?? "");
  if (!situations.some((item) => item.id === situation) || !yearLevels.some((item) => item.id === yearLevel)) {
    redirect("/annee?erreur=1");
  }
  saveYear(user.id, situation, yearLevel);
  redirect("/parcours");
}

export async function titreAction(formData: FormData) {
  const user = await currentUser();
  if (!user) redirect("/connexion?next=/parcours");
  const date = String(formData.get("expires") ?? "");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) redirect("/parcours?erreur=date");
  saveTitreExpiry(user.id, date);
  redirect("/annee");
}

export async function arrivalAction(formData: FormData) {
  const user = await currentUser();
  if (!user) redirect("/connexion?next=/annee");
  const date = String(formData.get("arrived") ?? "");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) redirect("/annee?erreur=arrivee");
  saveArrival(user.id, date);
  redirect("/demarches/premiers-jours");
}

export async function toggleStepAction(formData: FormData) {
  const user = await currentUser();
  if (!user) redirect("/connexion?next=/parcours");
  const stepId = String(formData.get("step") ?? "");
  const allowed = new Set([
    ...candidatures.flatMap((item) => item.steps.map((step) => step.id)),
    ...demarches.flatMap((item) => item.steps.map((step) => step.id)),
  ]);
  if (allowed.has(stepId)) toggleStep(user.id, stepId);
  const back = String(formData.get("back") ?? "/parcours");
  redirect(back.startsWith("/demarches/") || back.startsWith("/candidatures/") ? back : "/parcours");
}

async function requireAdmin() {
  const user = await currentUser();
  if (!user || user.role !== "admin") redirect("/");
}

export async function addGroupAction(formData: FormData) {
  await requireAdmin();
  const audience = String(formData.get("audience") ?? "ville");
  const city = String(formData.get("city") ?? "");
  const platform = String(formData.get("platform") ?? "");
  const label = String(formData.get("label") ?? "").trim();
  const url = httpsUrl(formData.get("url"));
  const cityOk = audience === "candidature" ? city === "toutes" || cities.some((item) => item.id === city) : cities.some((item) => item.id === city);
  if (!["candidature", "ville"].includes(audience) || !cityOk || !["whatsapp", "telegram"].includes(platform) || label.length < 2 || !url) {
    redirect("/admin/groupes?erreur=1");
  }
  addGroup(audience === "candidature" && city === "toutes" ? "" : city, platform, label, url, audience);
  redirect("/admin/groupes");
}

export async function deleteGroupAction(formData: FormData) {
  await requireAdmin();
  deleteGroup(Number(formData.get("id")));
  redirect("/admin/groupes");
}

export async function addLinkAction(formData: FormData) {
  await requireAdmin();
  const category = String(formData.get("category") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const url = httpsUrl(formData.get("url"));
  const note = cleanText(formData.get("note"), 200);
  const affiliate = formData.get("affiliate") === "1" ? 1 : 0;
  if (!categories.some((item) => item.id === category) || title.length < 2 || !url) {
    redirect("/admin/liens?erreur=1");
  }
  addLink(category, title, url, note, affiliate);
  redirect("/admin/liens");
}

export async function deleteLinkAction(formData: FormData) {
  await requireAdmin();
  deleteLink(Number(formData.get("id")));
  redirect("/admin/liens");
}

export async function addVideoAction(formData: FormData) {
  await requireAdmin();
  const place = String(formData.get("place") ?? "");
  const splitAt = place.indexOf(":");
  const kind = place.slice(0, splitAt);
  const target = place.slice(splitAt + 1);
  const title = String(formData.get("title") ?? "").trim();
  const url = httpsUrl(formData.get("url"));
  const platform = videoPlatform(url);
  const stepIds = [
    ...candidatures.flatMap((item) => item.steps.map((step) => step.id)),
    ...demarches.flatMap((item) => item.steps.map((step) => step.id)),
  ];
  const known =
    (kind === "candidature" && candidatures.some((item) => item.id === target)) ||
    (kind === "demarche" && demarches.some((item) => item.id === target)) ||
    (kind === "step" && stepIds.includes(target));
  if (!known || title.length < 2 || !platform) redirect("/admin/videos?erreur=1");
  addVideo(kind, target, platform, title, url);
  redirect("/admin/videos");
}

export async function deleteVideoAction(formData: FormData) {
  await requireAdmin();
  deleteVideo(Number(formData.get("id")));
  redirect("/admin/videos");
}

export async function loginAction(formData: FormData) {
  const email = cleanEmail(formData.get("email"));
  const password = String(formData.get("password") ?? "").slice(0, 72);
  const nextPath = safeNext(formData.get("next"));
  if (!validEmail(email) || !passwordOk(password)) {
    redirect(`/connexion?erreur=identifiants&next=${encodeURIComponent(nextPath)}`);
  }
  const since = new Date(Date.now() - 15 * 60 * 1000).toISOString();
  if (recentLoginFailures(email, since) >= 8 || recentLoginTotal(since) >= 60) {
    redirect(`/connexion?erreur=attente&next=${encodeURIComponent(nextPath)}`);
  }
  const user = findUserByEmail(email);
  const passwordMatches = verifyPassword(password, user?.password_hash ?? dummyPasswordHash);
  if (!user || !passwordMatches) {
    recordLoginFailure(email);
    redirect(`/connexion?erreur=identifiants&next=${encodeURIComponent(nextPath)}`);
  }
  if (user.active === 0) {
    redirect(`/connexion?erreur=desactive&next=${encodeURIComponent(nextPath)}`);
  }
  clearLoginFailures(email);
  await setSession(user.id);
  if (user.role === "accompagnateur") redirect("/accompagnement");
  if (user.role === "admin" && (nextPath === "/parcours" || nextPath === "/commencer")) redirect("/admin");
  redirect(nextPath);
}

export async function addStudentAction(formData: FormData) {
  await requireAdmin();
  const name = cleanText(formData.get("name"), 80);
  const email = cleanEmail(formData.get("email"));
  const password = String(formData.get("password") ?? "");
  const city = String(formData.get("city") ?? "");
  const country = String(formData.get("country") ?? "");
  const school = cleanText(formData.get("school"), 120) || undecidedSchool;
  const back = studentsPath(formData);
  if (name.length < 2 || !validEmail(email) || !newPasswordOk(password) || !acceptedCity(city) || !countries.some((item) => item.id === country)) {
    redirect(`${back}${back.includes("?") ? "&" : "?"}erreur=1`);
  }
  if (findUserByEmail(email)) redirect(`${back}${back.includes("?") ? "&" : "?"}erreur=existe`);
  createUser(name, email, hashPassword(password), city, school, country);
  redirect(back);
}

export async function setActiveAction(formData: FormData) {
  await requireAdmin();
  setUserActive(Number(formData.get("id")), Number(formData.get("active")) === 1 ? 1 : 0);
  redirect(studentsPath(formData));
}

export async function resetPasswordAction(formData: FormData) {
  await requireAdmin();
  const password = String(formData.get("password") ?? "");
  const back = studentsPath(formData);
  if (!newPasswordOk(password)) redirect(`${back}${back.includes("?") ? "&" : "?"}erreur=mdp`);
  setUserPassword(Number(formData.get("id")), hashPassword(password));
  redirect(studentsPath(formData));
}

export async function deleteStudentAction(formData: FormData) {
  await requireAdmin();
  deleteStudent(Number(formData.get("id")));
  redirect(studentsPath(formData));
}

export async function sendAlertAction(formData: FormData) {
  await requireAdmin();
  const title = cleanText(formData.get("title"), 120);
  const body = cleanText(formData.get("body"), 1000);
  const country = String(formData.get("country") ?? "");
  const city = String(formData.get("city") ?? "");
  if (title.length < 3 || body.length < 3) redirect("/admin/alertes?erreur=1");
  addAlert(title, body, country === "tous" ? "" : country, city === "toutes" ? "" : city);
  redirect("/admin/alertes");
}

export async function deleteAlertAction(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  if (Number.isInteger(id) && id > 0) deleteAlert(id);
  redirect("/admin/alertes");
}

export async function postMessageAction(formData: FormData) {
  const user = await currentUser();
  if (!user || user.role !== "user" || user.active === 0) redirect("/connexion");
  const body = cleanText(formData.get("body"), 500);
  if (body.length < 1) redirect("/messages?erreur=vide");
  const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  if (recentMessageCount(user.id, since) >= 12) redirect("/messages?erreur=attente");
  addMessage(user.id, body);
  broadcastChat();
  redirect("/messages");
}

export async function reactMessageAction(formData: FormData) {
  const user = await currentUser();
  if (!user || user.role !== "user" || user.active === 0) redirect("/connexion");
  const id = Number(formData.get("id"));
  const emoji = String(formData.get("emoji") ?? "");
  if (!Number.isInteger(id) || id <= 0 || !reactionEmojis.includes(emoji as (typeof reactionEmojis)[number])) redirect("/messages");
  toggleReaction(id, user.id, emoji);
  broadcastChat();
  redirect("/messages");
}

export async function commentMessageAction(formData: FormData) {
  const user = await currentUser();
  if (!user || user.role !== "user" || user.active === 0) redirect("/connexion");
  const id = Number(formData.get("id"));
  const body = cleanText(formData.get("body"), 300);
  if (!Number.isInteger(id) || id <= 0 || body.length < 1) redirect("/messages");
  const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  if (recentCommentCount(user.id, since) >= 20) redirect("/messages?erreur=attente");
  addComment(id, user.id, body);
  broadcastChat();
  redirect("/messages");
}

export async function deleteCommentAction(formData: FormData) {
  const user = await currentUser();
  if (!user || user.active === 0) redirect("/connexion");
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id) || id <= 0) redirect("/messages");
  if (user.role === "admin") deleteComment(id);
  else deleteOwnComment(id, user.id);
  broadcastChat();
  redirect("/messages");
}

export async function deleteMessageAction(formData: FormData) {
  const user = await currentUser();
  if (!user || user.active === 0) redirect("/connexion");
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id) || id <= 0) redirect(user.role === "admin" ? "/admin/messages" : "/messages");
  if (user.role === "admin") deleteMessage(id);
  else deleteOwnMessage(id, user.id);
  broadcastChat();
  redirect(user.role === "admin" ? "/admin/messages" : "/messages");
}

export async function publishInfoAction(formData: FormData) {
  await requireAdmin();
  const title = cleanText(formData.get("title"), 120);
  const note = cleanText(formData.get("note"), 400);
  const file = formData.get("file");
  if (title.length < 2 || !(file instanceof File) || file.size < 1 || file.size > 4 * 1024 * 1024) {
    redirect("/admin/infos?erreur=1");
  }
  const bytes = Buffer.from(await file.arrayBuffer());
  const mime = sniffInfo(bytes);
  if (!mime) redirect("/admin/infos?erreur=1");
  const id = addInfo(title, note, mime);
  try {
    saveInfoFile(id, bytes);
  } catch {
    deleteInfo(id);
    redirect("/admin/infos?erreur=1");
  }
  broadcastChat();
  redirect("/admin/infos");
}

export async function deleteInfoAction(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  if (Number.isInteger(id) && id > 0) {
    deleteInfo(id);
    removeInfoFile(id);
    broadcastChat();
  }
  redirect("/admin/infos");
}

export async function forgotPasswordAction(formData: FormData) {
  const email = cleanEmail(formData.get("email"));
  if (!canSendMail()) redirect("/mot-de-passe?etat=messagerie");
  const local = !process.env.SMTP_HOST || !process.env.SMTP_FROM;
  if (!validEmail(email)) redirect(`/mot-de-passe?etat=${local ? "local" : "envoye"}`);
  const user = findUserByEmail(email);
  if (user && user.active !== 0 && recentResetCount(user.id, new Date().toISOString()) < 3) {
    const token = randomBytes(32).toString("hex");
    const tokenHash = createHash("sha256").update(token).digest("hex");
    const expires = new Date(Date.now() + 60 * 60 * 1000).toISOString();
    saveResetToken(user.id, tokenHash, expires);
    const headerList = await headers();
    const host = headerList.get("x-forwarded-host") ?? headerList.get("host") ?? "127.0.0.1:3457";
    const proto = headerList.get("x-forwarded-proto") ?? "http";
    await sendPasswordLink(user.email, user.name, `${proto}://${host}/mot-de-passe?jeton=${token}`);
  }
  redirect(`/mot-de-passe?etat=${local ? "local" : "envoye"}`);
}

export async function choosePasswordAction(formData: FormData) {
  const token = String(formData.get("jeton") ?? "");
  const password = String(formData.get("password") ?? "");
  if (!/^[a-f0-9]{64}$/.test(token)) redirect("/mot-de-passe?erreur=lien");
  if (!newPasswordOk(password)) redirect(`/mot-de-passe?erreur=mdp&jeton=${token}`);
  const tokenHash = createHash("sha256").update(token).digest("hex");
  const userId = takeResetToken(tokenHash, new Date().toISOString());
  const user = userId ? findUserById(userId) : null;
  if (!user || user.active === 0) redirect("/mot-de-passe?erreur=lien");
  updateOwnPassword(user.id, hashPassword(password));
  clearLoginFailures(user.email);
  await setSession(user.id);
  if (user.role === "accompagnateur") redirect("/accompagnement");
  redirect(user.role === "admin" ? "/admin" : "/parcours");
}

export async function changePasswordAction(formData: FormData) {
  const user = await currentUser();
  if (!user) redirect("/connexion?next=/compte");
  const current = String(formData.get("current") ?? "").slice(0, 72);
  const password = String(formData.get("password") ?? "");
  const stored = findUserByEmail(user.email);
  if (!stored || !newPasswordOk(password) || !verifyPassword(current, stored.password_hash)) {
    redirect("/compte?erreur=1");
  }
  updateOwnPassword(user.id, hashPassword(password));
  redirect("/compte?etat=ok");
}

function cleanPhone(value: FormDataEntryValue | null) {
  const phone = String(value ?? "").trim().slice(0, 20);
  if (!phone) return "";
  return /^[+0-9][0-9 .()-]{7,19}$/.test(phone) ? phone : null;
}

export async function contactAction(formData: FormData) {
  const name = cleanText(formData.get("name"), 80);
  const email = cleanEmail(formData.get("email"));
  const phone = cleanPhone(formData.get("phone"));
  const body = cleanText(formData.get("message"), 1000);
  if (name.length < 2 || !validEmail(email) || body.length < 10) redirect("/contact?erreur=incomplet");
  if (phone === null) redirect("/contact?erreur=telephone");
  const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  if (recentContactCount(email, since) >= 3) redirect("/contact?erreur=attente");
  addContactMessage(name, email, phone, body);
  redirect("/contact?etat=envoye");
}

export async function deleteContactAction(formData: FormData) {
  const user = await currentUser();
  if (!user || (user.role !== "admin" && user.role !== "accompagnateur")) redirect("/");
  const id = Number(formData.get("id"));
  if (Number.isInteger(id) && id > 0) deleteContactMessage(id);
  redirect(user.role === "accompagnateur" ? "/accompagnement" : "/admin/contact");
}

export async function saveAccompagnateurAction(formData: FormData) {
  await requireAdmin();
  const email = cleanEmail(formData.get("email"));
  const password = String(formData.get("password") ?? "");
  const current = findAccompagnateur();
  const taken = findUserByEmail(email);
  if (!validEmail(email) || (taken && taken.role !== "accompagnateur")) redirect("/admin?erreur=accompagnement");
  if (!current && !newPasswordOk(password)) redirect("/admin?erreur=accompagnement");
  if (password && !newPasswordOk(password)) redirect("/admin?erreur=accompagnement");
  saveAccompagnateurAccount(email, password ? hashPassword(password) : null);
  redirect("/admin?etat=accompagnement");
}

export async function logoutAction() {
  await clearSession();
  redirect("/");
}
