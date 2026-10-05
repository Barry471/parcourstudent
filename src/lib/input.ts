const emailPattern = /^[^\s@]{1,64}@[^\s@]{1,120}\.[^\s@]{2,24}$/;

export function cleanEmail(value: FormDataEntryValue | null) {
  return String(value ?? "").trim().toLowerCase().slice(0, 160);
}

export function validEmail(email: string) {
  return emailPattern.test(email);
}

export function cleanText(value: FormDataEntryValue | null, max: number) {
  return String(value ?? "")
    .replace(/[<>\u0000]/g, "")
    .trim()
    .slice(0, max);
}

export function safeNext(value: FormDataEntryValue | null) {
  const next = String(value ?? "");
  if (next.length > 200 || !next.startsWith("/") || next.startsWith("//") || next.includes("\\") || next.includes("://")) {
    return "/parcours";
  }
  return next;
}

export function passwordOk(password: string) {
  return password.length >= 8 && password.length <= 72;
}

export function newPasswordOk(password: string) {
  return password.length >= 12 && password.length <= 72 && /[A-Za-z]/.test(password) && /\d/.test(password);
}
