export type RenewalAlert = {
  level: "missing" | "calm" | "prepare" | "urgent" | "expired";
  title: string;
  text: string;
};

const day = 1000 * 60 * 60 * 24;

export function renewalAlert(isoDate: string | null, now = new Date()): RenewalAlert {
  if (!isoDate) {
    return {
      level: "missing",
      title: "Indique la fin de ton visa ou de ta carte",
      text: "La date est écrite sur le visa ou le titre. Parcourstudent s'en sert seulement pour t'alerter. Elle n'est pas envoyée à l'administration.",
    };
  }
  const end = new Date(`${isoDate}T12:00:00`);
  const days = Math.ceil((end.getTime() - now.getTime()) / day);
  if (Number.isNaN(end.getTime())) {
    return renewalAlert(null, now);
  }
  if (days < 0) {
    return {
      level: "expired",
      title: "Ton titre est dépassé",
      text: "Ne reste pas sans démarche. Connecte-toi tout de suite au portail des étrangers et regarde si une demande est encore possible. Un groupe WhatsApp ne prolonge pas un titre.",
    };
  }
  if (days <= 60) {
    return {
      level: "urgent",
      title: `Plus que ${days} jour${days > 1 ? "s" : ""}`,
      text: "Dépose la demande de renouvellement maintenant si ce n'est pas fait. Prépare les pièces ci-dessous et suis uniquement la liste du portail.",
    };
  }
  if (days <= 120) {
    return {
      level: "prepare",
      title: `Renouvellement dans ${days} jours`,
      text: "C'est le moment de rassembler les pièces. Service-Public demande d'anticiper de plusieurs mois, sans attendre les dernières semaines.",
    };
  }
  return {
    level: "calm",
    title: `Titre valable encore ${days} jours`,
    text: "Une alerte s'affichera à partir de 4 mois avant la date de fin. Note déjà où se trouvent ton certificat de scolarité et ton justificatif de domicile.",
  };
}

export const renewalDocuments = [
  "Passeport en cours de validité, et le visa ou le titre actuel.",
  "Justificatif de domicile de moins de 6 mois : quittance, facture, ou attestation d'hébergement avec la pièce du logeur.",
  "Certificat de scolarité ou de réinscription. Une préinscription peut être demandée en attendant l'inscription définitive.",
  "Preuve de la réussite de l'année précédente, quand l'établissement la délivre.",
  "Justificatifs de ressources. Le montant exigé est celui indiqué sur Service-Public, pas celui d'un groupe.",
  "Photo et timbre fiscal si le portail les demande au moment du dépôt.",
];

export const problems: { problem: string; solution: string }[] = [
  {
    problem: "La banque refuse d'ouvrir le compte.",
    solution: "Demande la lettre de refus, puis le droit au compte à la Banque de France. Le lien est sur l'étape Banque.",
  },
  {
    problem: "Le logement demande un virement avant la visite.",
    solution: "Refuse. Passe par le CROUS, ton école ou une annonce que tu peux visiter, avec un bail écrit.",
  },
  {
    problem: "Le visa long séjour n'est pas validé.",
    solution: "Fais-le en ligne dans les trois mois après l'arrivée, sur le portail des étrangers. Garde la confirmation.",
  },
  {
    problem: "L'école n'a pas encore le certificat de scolarité.",
    solution: "Écris à la scolarité. En attendant, une attestation de préinscription peut servir pour certaines démarches. Vérifie sur le site concerné.",
  },
  {
    problem: "Tu as travaillé, ou on te propose de travailler, au-delà de la limite.",
    solution: "Arrête et fais vérifier l'autorisation de travail par l'employeur. La limite indiquée par Service-Public est de 964 heures par an.",
  },
  {
    problem: "La CAF ne verse pas l'aide prévue.",
    solution: "Ne construis pas ton budget dessus. Depuis 2026, une partie des étudiants hors Union européenne n'y a plus droit. Lis la fiche Service-Public avant de signer un loyer trop haut.",
  },
  {
    problem: "Le titre approche de la fin et il manque une pièce.",
    solution: "Dépose quand même dans le délai si le portail le permet, puis ajoute la pièce demandée dans l'espace. Ne laisse pas la date passer sans dépôt.",
  },
  {
    problem: "Un inconnu propose de « faire le dossier » contre de l'argent.",
    solution: "Refuse. La demande se fait toi-même sur administration-etrangers-en-france.interieur.gouv.fr. Parcourstudent n'accepte aucun document.",
  },
];
