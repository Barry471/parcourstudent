export function phaseOf(situation: string | null): "avant" | "france" {
  if (situation === "visa" || situation === "annee1" || situation === "suivante" || situation === "fin") return "france";
  return "avant";
}

export const chapters: Record<string, { title: string; text: string; links: { href: string; label: string }[] }> = {
  candidature: {
    title: "Tu candidates depuis ton pays",
    text: "Une seule voie, le budget, puis ce qui change selon ton pays.",
    links: [
      { href: "/candidatures", label: "Choisir une voie" },
      { href: "/demarches/budget", label: "Budget" },
      { href: "/pays", label: "Mon pays" },
    ],
  },
  admission: {
    title: "Tu as l'admission",
    text: "Le visa vient après l'accord écrit. Prépare les ressources avant le dépôt.",
    links: [
      { href: "/candidatures/visa", label: "Le visa" },
      { href: "/demarches/budget", label: "Budget" },
    ],
  },
  visa: {
    title: "Tu as le visa",
    text: "Les 15 premiers jours dans l'ordre, puis la première année et le logement.",
    links: [
      { href: "/demarches/premiers-jours", label: "15 premiers jours" },
      { href: "/demarches/premiere-annee", label: "Première année" },
      { href: "/demarches/logement", label: "Logement" },
    ],
  },
  annee1: {
    title: "Tu es en première année",
    text: "Santé, renouvellement, et quoi faire si l'année se passe mal.",
    links: [
      { href: "/demarches/sante", label: "Santé" },
      { href: "/demarches/renouvellement", label: "Renouvellement" },
      { href: "/demarches/annee-ratee", label: "Année ratée" },
    ],
  },
  suivante: {
    title: "Une nouvelle année",
    text: "Réinscription, titre de séjour, et l'échec éventuel.",
    links: [
      { href: "/demarches/annee-suivante", label: "Année suivante" },
      { href: "/demarches/renouvellement", label: "Renouvellement" },
      { href: "/demarches/annee-ratee", label: "Année ratée" },
    ],
  },
  fin: {
    title: "La fin des études",
    text: "Rester pour travailler ou rentrer au pays est une nouvelle demande.",
    links: [
      { href: "/demarches/fin-etudes", label: "Fin des études" },
      { href: "/pays", label: "Selon ton pays" },
    ],
  },
};
