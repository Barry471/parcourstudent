export type ProcedurePhoto = { src: string; alt: string };

export const procedurePhotos: Record<string, ProcedurePhoto> = {
  "campus-france": { src: "/logos/campus-france.png", alt: "Logo Campus France" },
  parcoursup: { src: "/logos/parcoursup.svg", alt: "Logo Parcoursup" },
  "paris-saclay": { src: "/logos/paris-saclay.svg", alt: "Logo de l'Université Paris-Saclay" },
  "ecole-privee": { src: "/logos/france-competences.png", alt: "Logo France compétences" },
  visa: { src: "/logos/france-visas.png", alt: "Marianne de France-Visas" },
  budget: { src: "/logos/france-visas.png", alt: "Marianne de France-Visas" },
  "premiere-annee": { src: "/logos/messervices.svg", alt: "Logo Mes services étudiant" },
  "annee-suivante": { src: "/logos/cvec.svg", alt: "Logo de la CVEC" },
  logement: { src: "/logos/crous-cvec.png", alt: "Logo des Crous" },
  sante: { src: "/logos/ameli.svg", alt: "Logo de l'Assurance Maladie" },
  banque: { src: "/logos/banque-france.svg", alt: "Logo de la Banque de France" },
  emploi: { src: "/logos/service-public.svg", alt: "Logo Service-Public" },
  renouvellement: { src: "/logos/service-public.svg", alt: "Logo Service-Public" },
  "fin-etudes": { src: "/logos/service-public.svg", alt: "Logo Service-Public" },
  "premiers-jours": { src: "/logos/messervices.svg", alt: "Logo Mes services étudiant" },
  "annee-ratee": { src: "/logos/service-public.svg", alt: "Logo Service-Public" },
  quotidien: { src: "/logos/service-public.svg", alt: "Logo Service-Public" },
};

export function photoFor(id: string) {
  return procedurePhotos[id] ?? { src: "/logos/service-public.svg", alt: "Logo Service-Public" };
}
