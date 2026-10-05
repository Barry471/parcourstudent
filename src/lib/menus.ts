export type MenuLink = { href: string; label: string };

export const guestPlus: MenuLink[] = [
  { href: "/contact", label: "Contact" },
  { href: "/confidentialite", label: "Confidentialité" },
];

export function studentPlus(inFrance: boolean): MenuLink[] {
  return [
    { href: "/contact", label: "Contact" },
    { href: "/recherche", label: "Recherche" },
    { href: "/pays", label: "Mon pays" },
    { href: "/alertes", label: "Alertes" },
    ...(inFrance ? [{ href: "/aides", label: "Aides" }] : []),
    { href: "/compte", label: "Mot de passe" },
    { href: "/confidentialite", label: "Confidentialité" },
  ];
}

export function adminPlus(mail: boolean): MenuLink[] {
  return [
    { href: "/admin/contact", label: "Contacts" },
    { href: "/admin/infos", label: "Informations" },
    { href: "/admin/alertes", label: "Alertes" },
    { href: "/admin/groupes", label: "Groupes" },
    { href: "/admin/liens", label: "Liens" },
    { href: "/admin/videos", label: "Vidéos" },
    ...(mail ? [{ href: "/admin/courrier", label: "Courrier" }] : []),
  ];
}
