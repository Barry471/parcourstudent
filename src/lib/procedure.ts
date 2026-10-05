export const categories = [
  { id: "visa", label: "Visa et départ" },
  { id: "logement", label: "Logement" },
  { id: "arrivee", label: "Arrivée" },
  { id: "ecole", label: "École" },
  { id: "sante", label: "Santé" },
  { id: "banque", label: "Banque" },
  { id: "transport", label: "Transport" },
  { id: "emploi", label: "Emploi" },
  { id: "statut", label: "Changement de statut" },
  { id: "contact", label: "Contact pour la candidature" },
  { id: "reseau", label: "Réseau social" },
] as const;

export type CategoryId = (typeof categories)[number]["id"];

export type ProcedureStep = {
  id: string;
  title: string;
  category: CategoryId;
  summary: string;
  savoir: string[];
  interdit: string;
  avantage: string;
  links: { label: string; href: string }[];
};

export const procedure: ProcedureStep[] = [
  {
    id: "visa",
    title: "Préparer le visa depuis la Guinée",
    category: "visa",
    summary: "Le départ se prépare avant l'avion : admission, pièces, et la procédure indiquée par France-Visas.",
    savoir: [
      "Beaucoup de dossiers guinéens passent par Campus France / Études en France, puis par France-Visas. Le site officiel dit si c'est ton cas.",
      "Garde passeport, admission et justificatifs chez toi. Parcourstudent ne reçoit aucun document.",
      "Un visa court séjour ne remplace pas un visa étudiant.",
    ],
    interdit: "Ne suis pas une liste de pièces copiée dans un groupe. La liste qui compte est celle de France-Visas pour ton dossier.",
    avantage: "Un visa long séjour mention étudiant ouvre le droit d'entrer pour les études, puis de le faire valider à l'arrivée.",
    links: [
      { label: "France-Visas", href: "https://france-visas.gouv.fr/" },
      { label: "Campus France", href: "https://pastel.diplomatie.gouv.fr/etudesenfrance/dyn/public/authentification/login.html" },
      { label: "Titre de séjour étudiant", href: "https://www.service-public.gouv.fr/particuliers/vosdroits/F2231" },
    ],
  },
  {
    id: "logement",
    title: "Trouver un logement",
    category: "logement",
    summary: "Commence par le CROUS et ton école. Les annonces de partenaires sont ajoutées par l'admin, en plus des sites officiels.",
    savoir: [
      "La demande CROUS a des dates qui changent chaque année.",
      "Visale peut servir de garant si tu remplis les conditions affichées sur leur site.",
      "Lis le bail : loyer, charges, dépôt, durée.",
    ],
    interdit: "N'envoie pas d'argent avant une visite, et ne signe pas sur une simple capture d'écran.",
    avantage: "Une résidence étudiante ou un bail écrit te donne une adresse pour la banque, la santé et la validation du visa.",
    links: [
      { label: "Logement CROUS", href: "https://www.service-public.gouv.fr/particuliers/vosdroits/F31912" },
      { label: "Offres CROUS", href: "https://trouverunlogement.lescrous.fr/" },
      { label: "Visale", href: "https://www.visale.fr/" },
    ],
  },
  {
    id: "validation",
    title: "Valider le visa en arrivant",
    category: "arrivee",
    summary: "Si tu as un visa long séjour valant titre de séjour, l'administration demande de le valider en ligne dans les trois mois.",
    savoir: [
      "La démarche se fait sur le portail des étrangers, avec les informations du visa, la date d'entrée et une adresse en France.",
      "Une taxe est demandée. Le montant affiché sur le portail fait foi.",
      "Télécharge la confirmation et garde-la. Ne l'envoie pas ici.",
    ],
    interdit: "Ne laisse pas passer le délai. Sans validation, le séjour peut devenir irrégulier.",
    avantage: "La confirmation sert ensuite pour le logement, la banque et les aides éventuelles.",
    links: [
      { label: "Valider le VLS-TS", href: "https://www.service-public.gouv.fr/particuliers/vosdroits/R52684" },
      { label: "Portail des étrangers", href: "https://administration-etrangers-en-france.interieur.gouv.fr/" },
    ],
  },
  {
    id: "ecole",
    title: "S'inscrire dans l'école",
    category: "ecole",
    summary: "L'admission n'est pas toujours l'inscription. L'école demande en général l'attestation CVEC et des originaux, sur place ou sur son propre site.",
    savoir: [
      "La CVEC se paie ou s'exonère sur le site officiel, pas via un intermédiaire.",
      "Demande le certificat de scolarité : il sert partout ensuite.",
    ],
    interdit: "Ne paie pas l'inscription sur un lien reçu par un inconnu. Utilise le site de ton établissement.",
    avantage: "Le certificat de scolarité débloque la santé, la banque, le transport étudiant et, plus tard, le renouvellement.",
    links: [
      { label: "CVEC", href: "https://cvec.etudiant.gouv.fr/" },
      { label: "Mes services étudiant", href: "https://www.messervices.etudiant.gouv.fr/" },
    ],
  },
  {
    id: "sante",
    title: "S'affilier à l'Assurance Maladie",
    category: "sante",
    summary: "L'affiliation est gratuite et se demande sur le site des étudiants étrangers, une fois l'inscription obtenue.",
    savoir: [
      "Une assurance voyage peut couvrir les premiers jours. Elle ne remplace pas l'Assurance Maladie.",
      "Une mutuelle est un contrat séparé, facultatif.",
    ],
    interdit: "N'envoie pas ta carte d'identité ou ton visa sur Parcourstudent, ni à un groupe, pour « t'inscrire à la sécu ».",
    avantage: "Une fois affilié, une partie de tes soins peut être remboursée. Les conditions sont sur Ameli.",
    links: [
      { label: "Étudiant étranger", href: "https://etudiant-etranger.ameli.fr/" },
      { label: "Explications Ameli", href: "https://www.ameli.fr/assure/droits-demarches/europe-international/protection-sociale-france/vous-venez-etudier-en-france" },
    ],
  },
  {
    id: "banque",
    title: "Ouvrir un compte",
    category: "banque",
    summary: "Les banques partenaires sont publiées par l'admin. Le droit d'ouvrir un compte, lui, est expliqué par Service-Public.",
    savoir: [
      "Une pièce d'identité, un justificatif d'adresse et le certificat de scolarité sont souvent demandés.",
      "Une banque peut refuser. Elle doit alors t'indiquer le droit au compte à la Banque de France.",
    ],
    interdit: "Ne communique jamais ton code secret, ni dans un groupe WhatsApp, ni à quelqu'un qui se dit de ta banque.",
    avantage: "Un compte français sert à payer le loyer, recevoir un salaire étudiant et, si tu y as droit, une aide.",
    links: [
      { label: "Ouvrir un compte", href: "https://www.service-public.gouv.fr/particuliers/vosdroits/F2413" },
      { label: "Droit au compte", href: "https://www.banque-france.fr/fr/a-votre-service/particuliers/droit-au-compte-bancaire" },
    ],
  },
  {
    id: "transport",
    title: "Téléphone et transports",
    category: "transport",
    summary: "Une ligne française reçoit les codes de la banque et des démarches. L'abonnement dépend de ta ville.",
    savoir: [
      "Compare les forfaits, puis vérifie la couverture.",
      "Le tarif étudiant est sur le site du réseau de ta ville, pas sur une vieille capture.",
    ],
    interdit: "N'achète pas un forfait très long le premier jour, et ne prête pas ta ligne pour le compte d'un inconnu.",
    avantage: "Le tarif étudiant, quand il existe dans ta ville, réduit le coût des trajets vers l'école.",
    links: [{ label: "SNCF Connect", href: "https://www.sncf-connect.com/" }],
  },
  {
    id: "emploi",
    title: "Travailler pendant les études",
    category: "emploi",
    summary: "Le travail étudiant est possible, dans une limite. Service-Public indique 964 heures par an pour un étudiant non européen.",
    savoir: [
      "Il faut un visa ou une carte étudiant en cours de validité.",
      "Au-delà de la limite, l'employeur doit obtenir une autorisation avant de te faire travailler.",
      "Demande un contrat écrit.",
    ],
    interdit: "Ne travaille pas sans titre valable, ni au-delà de la limite sans autorisation. Cela peut avoir des conséquences sur le séjour.",
    avantage: "Dans la limite légale, un job aide à payer le quotidien et peut compter pour certaines aides. Vérifie ta situation avant de compter dessus.",
    links: [
      { label: "Travail étudiant", href: "https://www.service-public.gouv.fr/particuliers/vosdroits/F2713" },
      { label: "Jobaviz", href: "https://www.jobaviz.fr/" },
    ],
  },
  {
    id: "statut",
    title: "Renouveler, puis changer de statut",
    category: "statut",
    summary: "Le visa a une fin. Le renouvellement étudiant, puis un éventuel changement de statut, se préparent des mois avant l'expiration.",
    savoir: [
      "Note la date de fin dès l'arrivée.",
      "Le renouvellement étudiant se fait en ligne, avec scolarité, domicile et ressources. La liste exacte est sur le portail.",
      "Après le diplôme, un autre statut (salarié, recherche d'emploi) est une nouvelle demande. Elle n'est pas automatique.",
    ],
    interdit: "Ne reste pas en France avec un titre expiré en attendant « que le groupe confirme ». La préfecture et le portail officiel décident.",
    avantage: "Anticiper le renouvellement évite une rupture de séjour. Un changement de statut, s'il est accordé, permet de rester pour travailler. Les conditions sont sur Service-Public.",
    links: [
      { label: "Séjour étudiant", href: "https://www.service-public.gouv.fr/particuliers/vosdroits/F2231" },
      { label: "Démarche en ligne", href: "https://administration-etrangers-en-france.interieur.gouv.fr/" },
    ],
  },
];
