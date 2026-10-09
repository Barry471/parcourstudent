export const contactEmail = "parcourstudent@gmail.com";
export const contactName = "Thierno BARRY";
export const contactPhone = "+33745593028";
export const contactPhoneText = "+33 7 45 59 30 28";
export const contactWhatsApp = "https://wa.me/33745593028";

export function publicOrigin(hostHeader: string | null) {
  const host = (hostHeader ?? "").split(",")[0].trim().replace(/:\d+$/, "");
  if (host === "www.parcourstudent.com" || host === "parcourstudent.com") return `https://${host}`;
  return "https://www.parcourstudent.com";
}
