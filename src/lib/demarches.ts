import type { CategoryId } from "@/lib/procedure";

export const situations = [
  { id: "candidature", label: "Je candidate depuis mon pays" },
  { id: "admission", label: "J'ai l'admission, je demande le visa" },
  { id: "visa", label: "J'ai mon visa, je prépare ma première année" },
  { id: "annee1", label: "Je suis déjà en première année en France" },
  { id: "suivante", label: "Je commence une année suivante" },
  { id: "fin", label: "J'approche de la fin de mes études" },
];

export const yearLevels = [
  { id: "l1", label: "Licence 1" },
  { id: "l2", label: "Licence 2" },
  { id: "l3", label: "Licence 3" },
  { id: "m1", label: "Master 1" },
  { id: "m2", label: "Master 2" },
  { id: "doctorat", label: "Doctorat" },
  { id: "autre", label: "Autre niveau" },
];

export type DemarcheStep = {
  id: string;
  title: string;
  guide: string[];
  links: { label: string; href: string }[];
};

export type Demarche = {
  id: string;
  title: string;
  menu: string;
  category: CategoryId;
  forSituations: string[];
  intro: string;
  steps: DemarcheStep[];
};

export const demarches: Demarche[] = [
  {
    id: "premiere-annee",
    title: "Première année après le visa",
    menu: "Première année",
    category: "arrivee",
    forSituations: ["visa", "annee1"],
    intro: "Tu as le visa. Voici l'ordre de la première année en France, du jour de l'arrivée jusqu'à la fin de cette année scolaire.",
    steps: [
      {
        id: "pa-valider",
        title: "Valider le visa dans les trois mois",
        guide: [
          "Connecte-toi au portail des étrangers avec les informations écrites sur le visa.",
          "Indique la date d'entrée en France et ton adresse.",
          "Paie la taxe affichée sur le portail, puis télécharge la confirmation.",
        ],
        links: [
          { label: "Valider le VLS-TS", href: "https://www.service-public.gouv.fr/particuliers/vosdroits/R52684" },
          { label: "Portail des étrangers", href: "https://administration-etrangers-en-france.interieur.gouv.fr/" },
        ],
      },
      {
        id: "pa-cvec",
        title: "Payer ou faire exonérer la CVEC",
        guide: [
          "Fais-le sur le site officiel avant l'inscription à l'école.",
          "Garde le numéro d'attestation : l'école le demande.",
        ],
        links: [{ label: "CVEC", href: "https://cvec.etudiant.gouv.fr/" }],
      },
      {
        id: "pa-ecole",
        title: "Finir l'inscription et prendre le certificat",
        guide: [
          "L'admission ne suffit pas. Inscris-toi auprès de la scolarité.",
          "Demande le certificat de scolarité de cette première année.",
        ],
        links: [{ label: "Mes services étudiant", href: "https://www.messervices.etudiant.gouv.fr/" }],
      },
      {
        id: "pa-sante",
        title: "Ouvrir l'Assurance Maladie",
        guide: [
          "Inscris-toi sur le site des étudiants étrangers une fois le certificat obtenu.",
          "Une assurance voyage ne remplace pas cette affiliation.",
        ],
        links: [{ label: "Étudiant étranger", href: "https://etudiant-etranger.ameli.fr/" }],
      },
      {
        id: "pa-banque",
        title: "Ouvrir le compte de la première année",
        guide: [
          "Présente le passeport, un justificatif d'adresse et le certificat de scolarité à la banque.",
          "En cas de refus, demande la lettre de refus puis le droit au compte.",
        ],
        links: [
          { label: "Ouvrir un compte", href: "https://www.service-public.gouv.fr/particuliers/vosdroits/F2413" },
          { label: "Droit au compte", href: "https://www.banque-france.fr/fr/a-votre-service/particuliers/droit-au-compte-bancaire" },
        ],
      },
    ],
  },
  {
    id: "annee-suivante",
    title: "Rentrée des années suivantes",
    menu: "Années suivantes",
    category: "ecole",
    forSituations: ["suivante"],
    intro: "À partir de la deuxième année, tu ne refais pas le visa du départ. Tu réinscris l'année, tu renouvelles le séjour à temps, et tu vérifies logement et école.",
    steps: [
      {
        id: "as-situation",
        title: "Dire où tu en es cette rentrée",
        guide: [
          "Indique ton nouveau niveau : licence 2, licence 3, master, doctorat.",
          "Le guide de cette page suit cette année, pas la première.",
        ],
        links: [{ label: "Revenir à mon année", href: "/annee" }],
      },
      {
        id: "as-cvec",
        title: "Refaire la CVEC de la nouvelle année",
        guide: [
          "La CVEC se recommence chaque année universitaire.",
          "Attends d'être sûr de l'école et de la formation avant de payer.",
        ],
        links: [{ label: "CVEC", href: "https://cvec.etudiant.gouv.fr/" }],
      },
      {
        id: "as-inscription",
        title: "Se réinscrire et garder le nouveau certificat",
        guide: [
          "La réinscription se fait à la scolarité, pas sur Parcourstudent.",
          "Le certificat de cette année sert au renouvellement du titre.",
        ],
        links: [{ label: "Mes services étudiant", href: "https://www.messervices.etudiant.gouv.fr/" }],
      },
      {
        id: "as-titre",
        title: "Lancer le renouvellement avant la fin du titre",
        guide: [
          "Regarde la date de fin. Prépare le dossier plusieurs mois avant.",
          "Le détail des pièces est dans la démarche Renouvellement.",
        ],
        links: [
          { label: "Séjour étudiant", href: "https://www.service-public.gouv.fr/particuliers/vosdroits/F2231" },
          { label: "Ouvrir le renouvellement", href: "/demarches/renouvellement" },
        ],
      },
    ],
  },
  {
    id: "logement",
    title: "Logement",
    menu: "Logement",
    category: "logement",
    forSituations: ["admission", "visa", "annee1", "suivante"],
    intro: "Du premier lit jusqu'au bail. Rien ne se paie avant une visite et un contrat.",
    steps: [
      {
        id: "lo-chercher",
        title: "Chercher au CROUS et à l'école d'abord",
        guide: ["Dépose la demande CROUS selon le calendrier de l'année.", "Écris aussi au service logement de ton établissement."],
        links: [
          { label: "Demande CROUS", href: "https://www.service-public.gouv.fr/particuliers/vosdroits/F31912" },
          { label: "Offres CROUS", href: "https://trouverunlogement.lescrous.fr/" },
        ],
      },
      {
        id: "lo-visite",
        title: "Visiter avant de payer",
        guide: [
          "Ne verse rien avant d'avoir vu le logement et lu un contrat à ton nom.",
          "Un propriétaire qui demande Western Union, une caution à un particulier, ou les clés par colis, s'arrête là.",
          "Lis loyer, charges, dépôt de garantie et durée.",
        ],
        links: [
          { label: "Visale", href: "https://www.visale.fr/" },
          { label: "Demande CROUS", href: "https://www.service-public.gouv.fr/particuliers/vosdroits/F31912" },
        ],
      },
      {
        id: "lo-bail",
        title: "Reconnaître un vrai bail",
        guide: [
          "Le bail indique l'adresse, les deux noms, le loyer, les charges et la date d'entrée.",
          "Tu le signes en même temps que l'état des lieux. Tu gardes une copie chez toi.",
          "La demande Visale se fait avant la signature, pas après un refus.",
        ],
        links: [{ label: "Visale", href: "https://www.visale.fr/" }],
      },
      {
        id: "lo-hebergement",
        title: "Si tu es hébergé chez quelqu'un",
        guide: [
          "L'attestation d'hébergement se signe par la personne qui te loge, avec sa pièce d'identité et un justificatif de domicile à son nom.",
          "Ce papier sert pour l'école, la banque ou le titre. Il ne remplace pas un bail si tu paies un loyer.",
        ],
        links: [{ label: "Justificatif de domicile", href: "https://www.service-public.gouv.fr/particuliers/vosdroits/F14807" }],
      },
      {
        id: "lo-assurance",
        title: "Assurer le logement puis entrer",
        guide: ["Le bailleur demande l'attestation d'assurance habitation à ton nom.", "Compare deux assureurs. Parcourstudent n'en vend aucun."],
        links: [{ label: "Assurance habitation", href: "https://www.service-public.gouv.fr/particuliers/vosdroits/F2123" }],
      },
    ],
  },
  {
    id: "sante",
    title: "Santé",
    menu: "Santé",
    category: "sante",
    forSituations: ["visa", "annee1"],
    intro: "L'affiliation se fait une fois, puis tu mets à jour ta situation si elle change.",
    steps: [
      {
        id: "sa-compte",
        title: "Créer le dossier étudiant étranger",
        guide: ["Utilise le site Ameli dédié, avec le certificat de scolarité.", "Conserve le numéro provisoire."],
        links: [{ label: "Inscription", href: "https://etudiant-etranger.ameli.fr/" }],
      },
      {
        id: "sa-carte",
        title: "Attendre l'attestation de droits",
        guide: ["Ajoute les pièces manquantes dans ton espace si le site le demande.", "La mutuelle est un choix à part, après l'affiliation."],
        links: [{ label: "Explications Ameli", href: "https://www.ameli.fr/assure/droits-demarches/europe-international/protection-sociale-france/vous-venez-etudier-en-france" }],
      },
      {
        id: "sa-delai",
        title: "Utiliser l'attestation en attendant la carte Vitale",
        guide: [
          "La carte Vitale arrive après l'affiliation. L'attestation de droits suffit en attendant pour te soigner.",
          "Garde le numéro provisoire et réponds si Ameli demande une pièce.",
        ],
        links: [{ label: "Étudiant étranger", href: "https://etudiant-etranger.ameli.fr/" }],
      },
      {
        id: "sa-soins",
        title: "Médecin, urgences, mutuelle",
        guide: [
          "Tu peux déclarer un médecin traitant une fois affilié. Le 15 est le numéro des urgences médicales.",
          "La sécurité sociale rembourse une partie des soins. Une mutuelle est un contrat privé en plus. Elle ne remplace pas Ameli.",
        ],
        links: [{ label: "Ameli", href: "https://www.ameli.fr/assure/droits-demarches/europe-international/protection-sociale-france/vous-venez-etudier-en-france" }],
      },
    ],
  },
  {
    id: "banque",
    title: "Banque",
    menu: "Banque",
    category: "banque",
    forSituations: ["visa", "annee1"],
    intro: "Un seul compte suffit pour l'année. Les banques publiées par l'admin s'affichent avec les liens officiels.",
    steps: [
      {
        id: "ba-pieces",
        title: "Préparer les pièces sans les envoyer ici",
        guide: ["Passeport, adresse, certificat de scolarité.", "Les originaux se montrent à la banque."],
        links: [{ label: "Compte bancaire", href: "https://www.service-public.gouv.fr/particuliers/vosdroits/F2413" }],
      },
      {
        id: "ba-refus",
        title: "Si la banque refuse",
        guide: ["Demande la lettre de refus.", "Saisis la Banque de France pour le droit au compte."],
        links: [{ label: "Droit au compte", href: "https://www.banque-france.fr/fr/a-votre-service/particuliers/droit-au-compte-bancaire" }],
      },
    ],
  },
  {
    id: "emploi",
    title: "Emploi étudiant",
    menu: "Emploi",
    category: "emploi",
    forSituations: ["annee1", "suivante", "fin"],
    intro: "Possible avec un titre étudiant valide, dans la limite indiquée par Service-Public.",
    steps: [
      {
        id: "em-droit",
        title: "Vérifier le droit avant de signer",
        guide: [
          "Service-Public indique 964 heures par an pour un étudiant non européen.",
          "Certaines nationalités suivent un autre texte. La fiche officielle dit lesquelles.",
          "Au-delà de la limite, l'employeur doit avoir une autorisation.",
        ],
        links: [{ label: "Travail étudiant", href: "https://www.service-public.gouv.fr/particuliers/vosdroits/F2713" }],
      },
      {
        id: "em-chercher",
        title: "Chercher un contrat écrit",
        guide: ["Regarde Jobaviz et le service de ton école.", "Garde des horaires compatibles avec les cours."],
        links: [{ label: "Jobaviz", href: "https://www.jobaviz.fr/" }],
      },
    ],
  },
  {
    id: "renouvellement",
    title: "Renouveler le titre",
    menu: "Renouvellement",
    category: "statut",
    forSituations: ["suivante", "fin", "annee1"],
    intro: "À faire à chaque fin de titre, pas une seule fois pour toutes les études. Le pourcentage de cette page ne compte que ces étapes.",
    steps: [
      {
        id: "re-date",
        title: "Noter la date de fin",
        guide: ["Elle est sur le visa ou la carte.", "L'alerte du site s'appuie sur la date que tu enregistres."],
        links: [{ label: "Enregistrer ma date", href: "/annee" }],
      },
      {
        id: "re-pieces",
        title: "Rassembler les pièces de cette demande",
        guide: [
          "Passeport et titre actuel.",
          "Domicile de moins de 6 mois.",
          "Certificat de scolarité de l'année en cours.",
          "Réussite de l'année passée, si l'école la délivre.",
          "Ressources, selon le montant indiqué sur Service-Public.",
        ],
        links: [{ label: "Fiche étudiant", href: "https://www.service-public.gouv.fr/particuliers/vosdroits/F2231" }],
      },
      {
        id: "re-depot",
        title: "Déposer sur le portail, pas dans un groupe",
        guide: ["La liste définitive est celle affichée au dépôt.", "Si une pièce manque, ajoute-la dans l'espace quand le portail le permet. Ne laisse pas la date passer sans dépôt."],
        links: [{ label: "Portail des étrangers", href: "https://administration-etrangers-en-france.interieur.gouv.fr/" }],
      },
    ],
  },
  {
    id: "fin-etudes",
    title: "Fin des études",
    menu: "Fin des études",
    category: "statut",
    forSituations: ["fin"],
    intro: "Après le diplôme, rester en France est une nouvelle demande. Elle n'est pas la suite automatique du titre étudiant.",
    steps: [
      {
        id: "fi-diplome",
        title: "Récupérer la preuve de fin d'études",
        guide: ["Demande à l'école l'attestation de réussite ou le diplôme.", "Note la date de fin du titre étudiant."],
        links: [{ label: "Séjour étudiant", href: "https://www.service-public.gouv.fr/particuliers/vosdroits/F2231" }],
      },
      {
        id: "fi-statut",
        title: "Choisir la demande qui correspond",
        guide: [
          "Salarié, recherche d'emploi ou création d'entreprise : chacun a ses conditions, souvent liées au diplôme et à la nationalité.",
          "Lis la fiche officielle avant de compter sur un accord. Le dépôt se fait sur le portail des étrangers.",
        ],
        links: [
          { label: "Travailler après les études", href: "https://www.service-public.gouv.fr/particuliers/vosdroits/F2229" },
          { label: "Démarche en ligne", href: "https://administration-etrangers-en-france.interieur.gouv.fr/" },
        ],
      },
      {
        id: "fi-aps",
        title: "Recherche d'emploi ou création d'entreprise",
        guide: [
          "Après un diplôme français, une carte ou une autorisation provisoire peut exister pour chercher un travail lié aux études.",
          "Le diplôme, la nationalité et le délai changent le droit. La fiche Service-Public décrit les cas, y compris l'accord de certains pays.",
          "Dépose dans le délai indiqué sur cette fiche, avant la fin du titre étudiant.",
        ],
        links: [
          { label: "Recherche d'emploi après les études", href: "https://www.service-public.gouv.fr/particuliers/vosdroits/F17319" },
          { label: "Selon le diplôme", href: "https://www.service-public.gouv.fr/particuliers/vosdroits/F2229" },
        ],
      },
      {
        id: "fi-retour",
        title: "Si tu rentres dans ton pays",
        guide: [
          "Le titre étudiant ne se transforme pas tout seul. S'il se termine et que tu pars, garde le diplôme et les relevés.",
          "Un retour plus tard pour travailler suit une nouvelle demande de visa, sur France-Visas.",
        ],
        links: [{ label: "France-Visas", href: "https://france-visas.gouv.fr/" }],
      },
    ],
  },
  {
    id: "budget",
    title: "Budget avant le départ",
    menu: "Budget",
    category: "visa",
    forSituations: ["candidature", "admission", "visa"],
    intro: "Les montants changent. Parcourstudent liste les catégories. Le chiffre qui compte est celui de France-Visas et de Service-Public le jour du dossier.",
    steps: [
      {
        id: "bu-ressources",
        title: "Montrer des ressources pour le visa",
        guide: [
          "France-Visas demande une preuve que tu peux vivre pendant les études. Le montant est sur ce site, pas dans un groupe.",
          "Compte, prise en charge par un proche, ou bourse : seul le type accepté pour ton dossier compte.",
        ],
        links: [
          { label: "France-Visas", href: "https://france-visas.gouv.fr/" },
          { label: "Séjour étudiant", href: "https://www.service-public.gouv.fr/particuliers/vosdroits/F2231" },
        ],
      },
      {
        id: "bu-garant",
        title: "Si un proche te prend en charge",
        guide: [
          "Le garant prépare les pièces que France-Visas liste : identité, lien avec toi, ressources.",
          "Une promesse orale ne remplace pas le document demandé dans le dossier.",
        ],
        links: [{ label: "France-Visas", href: "https://france-visas.gouv.fr/" }],
      },
      {
        id: "bu-mois",
        title: "Prévoir le premier mois en France",
        guide: [
          "Prévois, en plus du loyer : dépôt de garantie, CVEC, assurance habitation, transport et nourriture avant le premier salaire.",
          "Ne compte pas sur l'aide au logement avant la décision de la CAF. Depuis juillet 2026, une partie des étudiants hors Union européenne non boursiers n'y a plus droit.",
        ],
        links: [
          { label: "CVEC", href: "https://cvec.etudiant.gouv.fr/" },
          { label: "Aide au logement", href: "https://www.service-public.gouv.fr/particuliers/actualites/A18981" },
        ],
      },
      {
        id: "bu-piege",
        title: "Ne pas payer un intermédiaire pour le dossier",
        guide: [
          "Les sites officiels sont gratuits à consulter. Les frais de visa sont ceux affichés par France-Visas au dépôt.",
          "Quelqu'un qui promet le visa contre un paiement n'a pas ce pouvoir.",
        ],
        links: [{ label: "France-Visas", href: "https://france-visas.gouv.fr/" }],
      },
    ],
  },
  {
    id: "premiers-jours",
    title: "Les 15 premiers jours",
    menu: "15 premiers jours",
    category: "arrivee",
    forSituations: ["visa"],
    intro: "L'ordre des premiers jours après l'arrivée. Enregistre ta date d'arrivée dans Mon année. Chaque étape a ensuite sa démarche complète.",
    steps: [
      {
        id: "pj-valider",
        title: "Valider le visa long séjour",
        guide: [
          "Un VLS-TS se valide en ligne dans les trois mois après l'arrivée.",
          "Garde la confirmation. Sans elle, la suite des démarches bloque.",
        ],
        links: [
          { label: "Valider le VLS-TS", href: "https://www.service-public.gouv.fr/particuliers/vosdroits/R52684" },
          { label: "Portail des étrangers", href: "https://administration-etrangers-en-france.interieur.gouv.fr/" },
        ],
      },
      {
        id: "pj-telephone",
        title: "Avoir un numéro français",
        guide: [
          "Une carte SIM sert pour la banque, l'école et les rendez-vous.",
          "Compare les offres. Évite un engagement long le premier jour.",
        ],
        links: [{ label: "Comparer les opérateurs", href: "https://www.arcep.fr/" }],
      },
      {
        id: "pj-lit",
        title: "Sécuriser un lit",
        guide: ["CROUS, école, ou un bail après visite.", "Le détail anti-arnaque est dans la démarche Logement."],
        links: [{ label: "Démarche logement", href: "/demarches/logement" }],
      },
      {
        id: "pj-cvec",
        title: "Payer la CVEC",
        guide: ["L'attestation se télécharge sur le site officiel. L'école la demande pour l'inscription."],
        links: [{ label: "CVEC", href: "https://cvec.etudiant.gouv.fr/" }],
      },
      {
        id: "pj-ecole",
        title: "Finaliser l'inscription",
        guide: ["Scolarité : inscription administrative, puis pédagogique, puis carte étudiante.", "Demande le certificat de scolarité, il sert partout."],
        links: [{ label: "Mes services étudiant", href: "https://messervices.etudiant.gouv.fr/" }],
      },
      {
        id: "pj-sante",
        title: "Ouvrir la sécurité sociale",
        guide: ["Le dossier se fait sur le site des étudiants étrangers, avec le certificat de scolarité."],
        links: [{ label: "Démarche santé", href: "/demarches/sante" }],
      },
      {
        id: "pj-banque",
        title: "Ouvrir un compte",
        guide: ["Un RIB français sert pour le loyer et d'éventuelles aides.", "En cas de refus, la démarche Banque explique le droit au compte."],
        links: [{ label: "Démarche banque", href: "/demarches/banque" }],
      },
    ],
  },
  {
    id: "annee-ratee",
    title: "Année ratée ou changement",
    menu: "Année ratée",
    category: "ecole",
    forSituations: ["annee1", "suivante"],
    intro: "Redoubler ou changer de formation ne se cache pas. Le renouvellement du titre regarde si les études sont réelles et sérieuses.",
    steps: [
      {
        id: "ar-ecole",
        title: "Parler à la scolarité tout de suite",
        guide: [
          "Demande par écrit ce qui est possible : redoublement, rattrapage, ou réorientation.",
          "Garde l'attestation de scolarité de l'année en cours, même si les notes ne sont pas encore là.",
        ],
        links: [{ label: "Séjour étudiant", href: "https://www.service-public.gouv.fr/particuliers/vosdroits/F2231" }],
      },
      {
        id: "ar-titre",
        title: "Préparer le renouvellement avec cette réalité",
        guide: [
          "Un échec ne se règle pas en inventant une inscription.",
          "La préfecture peut demander les résultats. La fiche officielle explique les études réelles et sérieuses.",
          "Dépose dans le délai, avec les pièces du portail.",
        ],
        links: [
          { label: "Fiche étudiant", href: "https://www.service-public.gouv.fr/particuliers/vosdroits/F2231" },
          { label: "Renouvellement", href: "/demarches/renouvellement" },
        ],
      },
      {
        id: "ar-changer",
        title: "Changer de formation",
        guide: [
          "Une nouvelle formation passe par une nouvelle admission ou une réorientation acceptée par l'école.",
          "Vérifie que le nouvel établissement peut délivrer un certificat de scolarité avant la fin du titre.",
        ],
        links: [{ label: "Portail des étrangers", href: "https://administration-etrangers-en-france.interieur.gouv.fr/" }],
      },
    ],
  },
  {
    id: "quotidien",
    title: "Vie quotidienne",
    menu: "Vie quotidienne",
    category: "arrivee",
    forSituations: ["visa", "annee1", "suivante"],
    intro: "Le téléphone, le domicile, le passeport et les rendez-vous. Ces papiers bloquent les autres démarches quand ils manquent.",
    steps: [
      {
        id: "qd-sim",
        title: "Téléphone et internet",
        guide: [
          "Un numéro français stable sert pour la banque, Ameli et l'école.",
          "Lis la durée d'engagement avant de signer en boutique.",
        ],
        links: [{ label: "Arcep", href: "https://www.arcep.fr/" }],
      },
      {
        id: "qd-domicile",
        title: "Prouver où tu habites",
        guide: [
          "Quittance, facture à ton nom, ou attestation d'hébergement avec la pièce de la personne qui te loge.",
          "Une capture d'annonce n'est pas un justificatif.",
        ],
        links: [{ label: "Justificatif de domicile", href: "https://www.service-public.gouv.fr/particuliers/vosdroits/F14807" }],
      },
      {
        id: "qd-passeport",
        title: "Si le passeport est perdu ou volé",
        guide: [
          "Déclare le vol auprès de la police, puis contacte le consulat de ton pays en France pour un laissez-passer ou un nouveau passeport.",
          "Préviens aussi l'école. Ne voyage pas sans document.",
        ],
        links: [{ label: "France-Visas", href: "https://france-visas.gouv.fr/" }],
      },
      {
        id: "qd-creneau",
        title: "S'il n'y a pas de rendez-vous en préfecture",
        guide: [
          "Le dépôt étudiant se fait d'abord sur le portail des étrangers, pas en achetant un créneau.",
          "Garde les captures du site si un délai passe et qu'aucun rendez-vous n'est proposé.",
          "Quelqu'un qui vend un rendez-vous n'est pas l'administration.",
        ],
        links: [{ label: "Portail des étrangers", href: "https://administration-etrangers-en-france.interieur.gouv.fr/" }],
      },
    ],
  },
];

export function demarcheById(id: string) {
  return demarches.find((item) => item.id === id);
}

export function percentFor(steps: { id: string }[], done: Set<string>) {
  if (steps.length === 0) return 0;
  const count = steps.filter((step) => done.has(step.id)).length;
  return Math.round((count / steps.length) * 100);
}
