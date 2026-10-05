export const appointmentKinds = [
  { id: "compte", label: "Ouvrir mon compte et le bon site" },
  { id: "voie", label: "Choisir ma voie" },
  { id: "formulaire", label: "Remplir une page du formulaire" },
  { id: "pieces", label: "Préparer mes pièces" },
] as const;

export const appointmentHours = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00", "18:00"];

export const appointmentStatuses: Record<string, string> = {
  demande: "Demandé",
  confirme: "Confirmé",
  fait: "Fait",
  annule: "Annulé",
};

const maxOpen = 6;

export function maxOpenAppointments() {
  return maxOpen;
}

export function parisParts(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Paris",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const pick = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
  return { day: `${pick("year")}-${pick("month")}-${pick("day")}`, time: `${pick("hour")}:${pick("minute")}` };
}

export function parisNowStamp(date = new Date()) {
  const parts = parisParts(date);
  return `${parts.day}T${parts.time}`;
}

export function addCalendarDays(day: string, days: number) {
  const [year, month, date] = day.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, date + days)).toISOString().slice(0, 10);
}

export function slotFromForm(day: string, time: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day) || !appointmentHours.includes(time)) return "";
  const today = parisParts().day;
  if (day < today || day > addCalendarDays(today, 120)) return "";
  const startsAt = `${day}T${time}`;
  if (startsAt <= parisNowStamp()) return "";
  return startsAt;
}

export function formatSlot(startsAt: string) {
  const [day, time] = startsAt.split("T");
  const [year, month, date] = day.split("-").map(Number);
  const label = new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date(year, month - 1, date));
  const hour = String(Number(time.slice(0, 2)));
  return `${label} à ${hour} h`;
}

export function kindLabel(id: string) {
  return appointmentKinds.find((item) => item.id === id)?.label ?? id;
}
