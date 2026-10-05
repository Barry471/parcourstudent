export type CandidatureStep = {
  id: string;
  title: string;
  guide: string[];
  links: { label: string; href: string }[];
};

export type Candidature = {
  id: string;
  menu: string;
  title: string;
  forWhom: string;
  intro: string;
  steps: CandidatureStep[];
};

export const candidatures: Candidature[] = [
  {
    id: "campus-france",
    menu: "Campus France",
    title: "Campus France, jusqu'au visa",
    forWhom: "Bac étranger, pays qui passe par Études en France. C'est le cas le plus fréquent depuis la Guinée pour une formation publique.",
    intro: "De la création du compte jusqu'à l'accord écrit. Le visa est la démarche suivante. La date limite, le nombre de vœux et la liste des pièces sont ceux affichés dans ton espace.",
    steps: [
      {
        id: "cf-compte",
        title: "Créer le compte Études en France",
        guide: [
          "Ouvre la page de connexion Pastel et crée le compte avec une adresse e-mail que tu consultes.",
          "Remplis l'identité comme sur le passeport : nom, prénoms, date et lieu de naissance.",
          "Choisis ton pays de résidence. S'il n'est pas dans la procédure Études en France, France-Visas indique l'autre circuit.",
        ],
        links: [
          { label: "Connexion Études en France", href: "https://pastel.diplomatie.gouv.fr/etudesenfrance/dyn/public/authentification/login.html" },
          { label: "France-Visas", href: "https://france-visas.gouv.fr/" },
        ],
      },
      {
        id: "cf-parcours",
        title: "Décrire ton parcours scolaire",
        guide: [
          "Saisis les diplômes dans l'ordre : lycée, bac, puis études après le bac s'il y en a.",
          "Indique l'année, l'établissement, la série ou la filière, et la mention si tu en as une.",
          "Un trou dans le parcours s'explique dans l'espace. Ne laisse pas une année vide sans texte.",
        ],
        links: [{ label: "Mon dossier", href: "https://pastel.diplomatie.gouv.fr/etudesenfrance/dyn/public/authentification/login.html" }],
      },
      {
        id: "cf-francais",
        title: "Vérifier le français demandé par chaque formation",
        guide: [
          "Ouvre la fiche de la formation. Elle dit si un TCF, un DELF, un DALF, ou un autre test est exigé, et à quel niveau.",
          "Passe le test dans un centre agréé avant la date limite du dossier.",
          "Le français du lycée ne remplace le test que si la fiche de la formation le dit.",
        ],
        links: [
          { label: "France Éducation international", href: "https://www.france-education-international.fr/" },
          { label: "Espace Études en France", href: "https://pastel.diplomatie.gouv.fr/etudesenfrance/dyn/public/authentification/login.html" },
        ],
      },
      {
        id: "cf-choix",
        title: "Choisir les formations et écrire le projet",
        guide: [
          "Ajoute des vœux compatibles avec ton diplôme. Le nombre maximum est celui écrit dans ton espace, pas celui d'un groupe.",
          "Pour chaque vœu, le projet dit pourquoi cette formation, pourquoi la France, et ce que tu feras après.",
          "Mélange un vœu très demandé avec d'autres formations où ton dossier est cohérent.",
        ],
        links: [{ label: "Choisir mes formations", href: "https://pastel.diplomatie.gouv.fr/etudesenfrance/dyn/public/authentification/login.html" }],
      },
      {
        id: "cf-pieces",
        title: "Déposer les pièces listées dans l'espace",
        guide: [
          "L'espace affiche la liste pour ton pays. C'est cette liste qui compte.",
          "En général on y trouve le passeport, les diplômes, les relevés de notes, une photo, et la preuve de français si elle est demandée.",
          "Les fichiers restent sur Pastel. Parcourstudent ne les reçoit pas. Garde aussi une copie chez toi.",
        ],
        links: [{ label: "Déposer les pièces", href: "https://pastel.diplomatie.gouv.fr/etudesenfrance/dyn/public/authentification/login.html" }],
      },
      {
        id: "cf-soumettre",
        title: "Soumettre avant la date de ton pays",
        guide: [
          "Vérifie que chaque vœu est complet, puis soumets. Un dossier brouillon n'est pas examiné.",
          "Note le numéro de dossier et la date de dépôt.",
        ],
        links: [{ label: "Soumettre le dossier", href: "https://pastel.diplomatie.gouv.fr/etudesenfrance/dyn/public/authentification/login.html" }],
      },
      {
        id: "cf-frais",
        title: "Payer les frais de dossier",
        guide: [
          "Ce sont les frais de traitement Campus France. Le montant est celui écrit dans l'espace Études en France, pour ton pays.",
          "Paie par le moyen indiqué dans cet espace, et garde le reçu.",
          "Ces frais ne sont pas ceux du visa. Le visa se paie plus tard, sur France-Visas.",
          "Un montant envoyé sur WhatsApp, ou différent de celui de l'espace, s'arrête là.",
        ],
        links: [{ label: "Payer dans l'espace", href: "https://pastel.diplomatie.gouv.fr/etudesenfrance/dyn/public/authentification/login.html" }],
      },
      {
        id: "cf-entretien",
        title: "Passer l'entretien si l'espace le demande",
        guide: [
          "Le rendez-vous, s'il existe, est indiqué dans l'espace ou par le message de Campus France.",
          "Prépare le projet : formation choisie, budget, et ce que tu fais si une formation te refuse.",
          "L'entretien ne vaut pas une admission. Après, le dossier part vers les établissements.",
        ],
        links: [{ label: "Espace Études en France", href: "https://pastel.diplomatie.gouv.fr/etudesenfrance/dyn/public/authentification/login.html" }],
      },
      {
        id: "cf-reponses",
        title: "Lire les réponses et en accepter une",
        guide: [
          "Chaque établissement répond dans l'espace : accord, refus, ou attente.",
          "Accepte une seule proposition dans le délai affiché. Une acceptation tardive peut être perdue.",
          "Refuse les autres une fois le choix fait, pour libérer la place.",
        ],
        links: [{ label: "Voir les réponses", href: "https://pastel.diplomatie.gouv.fr/etudesenfrance/dyn/public/authentification/login.html" }],
      },
      {
        id: "cf-accord",
        title: "Télécharger l'accord écrit",
        guide: [
          "Télécharge l'accord d'admission ou de préinscription : ton nom, la formation, l'établissement, l'année.",
          "Un message WhatsApp n'est pas cet accord.",
          "Avec ce document, ouvre la demande de visa.",
        ],
        links: [{ label: "Demander le visa", href: "/candidatures/visa" }],
      },
    ],
  },
  {
    id: "parcoursup",
    menu: "Parcoursup",
    title: "Parcoursup, jusqu'au visa",
    forWhom: "Lycéen du système français, ou situation que Parcoursup indique comme ouverte. Un bac passé à l'étranger ne passe en général pas par là.",
    intro: "Si Parcoursup n'est pas ta plateforme, reviens à Campus France. Si c'est la tienne, suis le calendrier officiel jusqu'à l'acceptation, puis le visa si tu en as besoin.",
    steps: [
      {
        id: "ps-verifier",
        title: "Vérifier que Parcoursup te concerne",
        guide: [
          "Ouvre le site et lis qui peut créer un dossier.",
          "Si tu as un bac étranger et que tu vis hors de France, la voie habituelle est Études en France.",
        ],
        links: [
          { label: "Parcoursup", href: "https://www.parcoursup.gouv.fr/" },
          { label: "Plutôt Campus France", href: "/candidatures/campus-france" },
        ],
      },
      {
        id: "ps-voeux",
        title: "Saisir les vœux dans le calendrier",
        guide: [
          "Les dates d'ouverture, de formulation des vœux et de confirmation sont sur Parcoursup.",
          "Confirme les vœux avant la date limite. Un vœu non confirmé n'est pas étudié.",
        ],
        links: [{ label: "Calendrier Parcoursup", href: "https://www.parcoursup.gouv.fr/" }],
      },
      {
        id: "ps-reponses",
        title: "Répondre aux propositions",
        guide: [
          "Accepte, refuse ou mets en attente dans le délai affiché.",
          "Garde la preuve d'acceptation.",
        ],
        links: [{ label: "Mon dossier Parcoursup", href: "https://www.parcoursup.gouv.fr/" }],
      },
      {
        id: "ps-visa",
        title: "Si tu es hors de France, enchaîne avec le visa",
        guide: [
          "L'acceptation Parcoursup ne délivre pas le visa.",
          "Passe à la démarche visa avec l'accord d'inscription.",
        ],
        links: [{ label: "Demander le visa", href: "/candidatures/visa" }],
      },
    ],
  },
  {
    id: "paris-saclay",
    menu: "Paris-Saclay",
    title: "Université Paris-Saclay, jusqu'au visa",
    forWhom: "Candidat à une formation de l'Université Paris-Saclay. La plateforme dépend du niveau : Études en France, Mon Master, ou le site de l'université.",
    intro: "Ne dépose pas le même dossier au hasard sur trois sites. Le site de Paris-Saclay dit quelle porte utiliser pour ta formation.",
    steps: [
      {
        id: "sac-porte",
        title: "Trouver la bonne porte d'entrée",
        guide: [
          "Licence depuis l'étranger : souvent Études en France si ton pays est dans cette procédure.",
          "Master : souvent Mon Master, ou la procédure indiquée par la composante.",
          "Lis la page admission de la formation exacte, pas seulement la page d'accueil.",
        ],
        links: [
          { label: "Université Paris-Saclay", href: "https://www.universite-paris-saclay.fr/" },
          { label: "Mon Master", href: "https://www.monmaster.gouv.fr/" },
        ],
      },
      {
        id: "sac-francais",
        title: "Vérifier la langue demandée",
        guide: [
          "La fiche de la formation dit si elle demande le français, l'anglais, ou les deux, et quel test.",
          "TCF, DELF, DALF ou un test d'anglais : seul celui nommé par l'université compte.",
        ],
        links: [{ label: "France Éducation international", href: "https://www.france-education-international.fr/" }],
      },
      {
        id: "sac-dossier",
        title: "Déposer le dossier de cette formation",
        guide: [
          "Diplômes, relevés, projet et niveau de français ou d'anglais selon la formation.",
          "Une candidature incomplète à la date limite n'est pas examinée.",
        ],
        links: [{ label: "Campus France si ton pays y passe", href: "https://pastel.diplomatie.gouv.fr/etudesenfrance/dyn/public/authentification/login.html" }],
      },
      {
        id: "sac-accord",
        title: "Obtenir l'accord de Paris-Saclay",
        guide: [
          "Attends le message officiel de l'université ou de la plateforme.",
          "Télécharge l'accord. Il servira pour le visa et pour l'inscription.",
        ],
        links: [{ label: "Université Paris-Saclay", href: "https://www.universite-paris-saclay.fr/" }],
      },
      {
        id: "sac-visa",
        title: "Demander le visa avec cet accord",
        guide: ["L'admission ne remplace pas le visa.", "Continue sur la démarche visa."],
        links: [{ label: "Demander le visa", href: "/candidatures/visa" }],
      },
    ],
  },
  {
    id: "ecole-privee",
    menu: "École privée",
    title: "École privée, jusqu'au visa",
    forWhom: "École hors université publique : commerce, ingénieur privé, école de langue ou autre établissement privé.",
    intro: "Chaque école a son propre dossier. Vérifie qu'elle est reconnue, obtiens un accord écrit, puis seulement le visa.",
    steps: [
      {
        id: "pr-verifier",
        title: "Vérifier l'école avant de payer",
        guide: [
          "Regarde si le diplôme est reconnu, par exemple au RNCP ou par le ministère, selon ce que l'école revendique.",
          "Méfie-toi d'une école qui demande tout l'argent avant un contrat et une admission écrite.",
        ],
        links: [
          { label: "France compétences, RNCP", href: "https://www.francecompetences.fr/recherche/rncp/" },
          { label: "Campus France", href: "https://pastel.diplomatie.gouv.fr/etudesenfrance/dyn/public/authentification/login.html" },
        ],
      },
      {
        id: "pr-dossier",
        title: "Candidater auprès de l'école",
        guide: [
          "Suis le formulaire et le calendrier de cette école.",
          "Garde une copie de ce que tu envoies, chez toi.",
        ],
        links: [{ label: "Vérifier aussi Études en France", href: "https://pastel.diplomatie.gouv.fr/etudesenfrance/dyn/public/authentification/login.html" }],
      },
      {
        id: "pr-accord",
        title: "Recevoir l'attestation d'admission",
        guide: [
          "Il te faut un document au nom de l'école : admission ou inscription, dates, formation.",
          "Vérifie sur France-Visas si ton pays exige en plus la procédure Campus France, même pour une école privée.",
        ],
        links: [{ label: "France-Visas", href: "https://france-visas.gouv.fr/" }],
      },
      {
        id: "pr-visa",
        title: "Déposer le visa étudiant",
        guide: ["Une inscription privée ne donne pas le droit d'entrer sans visa.", "Passe à la démarche visa."],
        links: [{ label: "Demander le visa", href: "/candidatures/visa" }],
      },
    ],
  },
  {
    id: "visa",
    menu: "Le visa après l'admission",
    title: "Du oui de l'école jusqu'au visa",
    forWhom: "Tu as déjà une admission, quelle que soit la voie : Campus France, Parcoursup, Paris-Saclay ou école privée.",
    intro: "L'accord d'admission ouvre le dossier. Le visa étudiant est un long séjour, pas un visa touristique. La liste des pièces est celle créée par France-Visas pour ton dossier.",
    steps: [
      {
        id: "vi-accord",
        title: "Partir de l'accord d'admission",
        guide: [
          "Il te faut l'accord ou la préinscription : ton nom, l'établissement, la formation, l'année.",
          "Ouvre France-Visas dès que tu l'as. Le site dit à partir de quand le dépôt est possible.",
          "Un visa court séjour ou touristique ne sert pas à s'inscrire à l'université.",
        ],
        links: [
          { label: "France-Visas", href: "https://france-visas.gouv.fr/" },
          { label: "Séjour étudiant", href: "https://www.service-public.gouv.fr/particuliers/vosdroits/F2231" },
        ],
      },
      {
        id: "vi-compte",
        title: "Créer le dossier France-Visas",
        guide: [
          "Crée le compte, puis une demande au nom du passeport que tu présenteras.",
          "Le motif du séjour est les études. L'établissement et les dates doivent être ceux de l'accord.",
          "Si une case ne correspond pas à ta situation, suis l'aide du formulaire plutôt qu'un modèle copié.",
        ],
        links: [{ label: "France-Visas", href: "https://france-visas.gouv.fr/" }],
      },
      {
        id: "vi-liste",
        title: "Lire la liste générée pour ton dossier",
        guide: [
          "À la fin du formulaire, France-Visas produit la liste des pièces de cette demande. C'est elle qu'il faut suivre.",
          "On y retrouve souvent le passeport, des photos au format indiqué, l'accord d'admission, les diplômes et une preuve de ressources.",
          "Un justificatif de logement n'est à joindre que si ta liste le demande.",
        ],
        links: [{ label: "Ma liste de pièces", href: "https://france-visas.gouv.fr/" }],
      },
      {
        id: "vi-ressources",
        title: "Préparer la preuve de ressources",
        guide: [
          "Le montant exigé est celui indiqué sur France-Visas ou Service-Public le jour du dépôt.",
          "Compte, prise en charge par un proche, ou bourse : joins le type de preuve que ta liste demande.",
          "Une promesse orale ne remplace pas le document.",
        ],
        links: [
          { label: "France-Visas", href: "https://france-visas.gouv.fr/" },
          { label: "Budget", href: "/demarches/budget" },
        ],
      },
      {
        id: "vi-payer",
        title: "Payer le montant affiché et prendre le rendez-vous",
        guide: [
          "Le frais de visa est celui écrit à la fin du dossier. Garde le reçu.",
          "Le centre de dépôt est celui indiqué sur la confirmation, pas un autre choisi dans un groupe.",
          "Prends le rendez-vous tôt : les créneaux partent avant la rentrée.",
        ],
        links: [{ label: "France-Visas", href: "https://france-visas.gouv.fr/" }],
      },
      {
        id: "vi-rdv",
        title: "Aller au rendez-vous avec les originaux",
        guide: [
          "Apporte les originaux et les copies demandées, le récépissé du dossier, et le reçu de paiement.",
          "Les empreintes et la photo se font au centre si la convocation le dit.",
          "Repars avec le récépissé de dépôt. Il sert à suivre le dossier.",
        ],
        links: [{ label: "France-Visas", href: "https://france-visas.gouv.fr/" }],
      },
      {
        id: "vi-suivi",
        title: "Suivre la décision",
        guide: [
          "Le suivi se fait sur France-Visas ou le message du centre. Personne ne peut garantir un oui.",
          "Refuse toute offre qui promet un visa plus rapide contre un paiement.",
          "Si le visa est refusé, le courrier indique le motif et le délai pour réagir. Lis ce courrier, pas un modèle général.",
        ],
        links: [{ label: "Suivre mon dossier", href: "https://france-visas.gouv.fr/" }],
      },
      {
        id: "vi-reponse",
        title: "Vérifier le visa dans le passeport",
        guide: [
          "Contrôle la mention étudiant, les dates, et le nombre d'entrées avant de réserver le voyage.",
          "Note la date de fin dans Mon année. Elle déclenche le rappel de renouvellement.",
          "Après l'arrivée, la première année commence par la validation du visa long séjour.",
        ],
        links: [
          { label: "Enregistrer la date de fin", href: "/annee" },
          { label: "Première année après le visa", href: "/demarches/premiere-annee" },
        ],
      },
    ],
  },
];

export function candidatureById(id: string) {
  return candidatures.find((item) => item.id === id);
}
