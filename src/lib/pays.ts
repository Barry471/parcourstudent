export const campusFrancePath = {
  href: "/candidatures/campus-france",
  label: "Commencer par Campus France",
  lines: [
    "Depuis un pays de la procédure Études en France, la candidature se fait sur la plateforme officielle.",
    "Les dates, les vœux et les pièces sont ceux affichés sur le site, pas sur un groupe.",
  ],
};

export const countryPaths: Record<string, { href: string; label: string; lines: string[] }> = {
  guinee: {
    href: "/candidatures/campus-france",
    label: "Commencer par Campus France",
    lines: [
      "Depuis la Guinée, une formation publique passe en général par Études en France, puis par France-Visas.",
      "Parcoursup concerne surtout le système français. Ouvre-le seulement si le site dit que ton cas y entre.",
    ],
  },
  senegal: {
    href: "/candidatures/campus-france",
    label: "Voir Campus France",
    lines: [
      "Vérifie sur Campus France si ta formation passe par Études en France.",
      "Après les études, le Sénégal figure parmi les nationalités citées par Service-Public pour certaines demandes de travail. La fiche officielle tranche.",
    ],
  },
  "cote-divoire": {
    href: "/candidatures/campus-france",
    label: "Voir Campus France",
    lines: ["Vérifie sur Campus France et sur France-Visas le circuit de ton établissement avant de créer un autre dossier."],
  },
  cameroun: {
    href: "/candidatures/campus-france",
    label: "Voir Campus France",
    lines: ["Vérifie sur Campus France et sur France-Visas le circuit de ton établissement. Les pièces restent sur ces sites."],
  },
  maroc: campusFrancePath,
  tunisie: {
    href: "/candidatures/campus-france",
    label: "Voir Campus France",
    lines: [
      "Vérifie Études en France pour ta formation.",
      "Après les études, la Tunisie figure parmi les nationalités citées par Service-Public pour certaines demandes. Lis la fiche avant de déposer.",
    ],
  },
  autre: {
    href: "https://france-visas.gouv.fr/",
    label: "Ouvrir France-Visas",
    lines: ["Choisis ton pays sur France-Visas. Les règles de visa et de travail ne sont pas les mêmes pour toutes les nationalités."],
  },
};
