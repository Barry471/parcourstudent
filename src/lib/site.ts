export const contactEmail = "contact@parcourstudent.com";

export function publicOrigin(hostHeader: string | null) {
  const host = (hostHeader ?? "").split(",")[0].trim().replace(/:\d+$/, "");
  if (host === "www.parcourstudent.com" || host === "parcourstudent.com") return `https://${host}`;
  return "https://www.parcourstudent.com";
}
