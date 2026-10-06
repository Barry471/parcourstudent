import Link from "next/link";
import { LockIcon } from "@/components/Lock";
import { SideMenu } from "@/components/SideMenu";
import { currentUser } from "@/lib/auth";
import { guides } from "@/lib/content";

const entries = [
  ["preparer", "candidature", "Tu prépares ta candidature", "Campus France, Parcoursup, Paris-Saclay ou une école privée : chaque voie a ses étapes, jusqu'à l'accord écrit.", "/photos/candidature.jpg", "Étudiants qui travaillent ensemble sur un dossier."],
  ["arrive", "visa", "Tu demandes le visa", "L'admission ne suffit pas. Le guide suit France-Visas, de la liste des pièces jusqu'au visa dans le passeport.", "/photos/visa.jpg", "Hublot d'avion au-dessus des nuages, au moment du départ."],
  ["logement", "arrivee", "Tu viens d'arriver", "Les quinze premiers jours sont dans l'ordre : valider le visa, te loger, t'inscrire, ouvrir la santé et un compte.", "/photos/arrivee.jpg", "Paris, avec la Seine et la tour Eiffel."],
  ["emploi", "france", "Tu es déjà en France", "Chaque année a ses démarches : réinscription, titre de séjour, logement, santé et travail.", "/photos/france.jpg", "Étudiants qui traversent un campus."],
  ["demarches", "guide", "Tu ne déposes rien ici", "Parcourstudent en France explique et donne le lien officiel. Tes documents restent chez toi, sur Pastel ou France-Visas.", "/photos/demarches.jpg", "Bureau avec un ordinateur, pour suivre les sites officiels."],
] as const;

const guidePhotos: Record<string, string> = {
  "avant-arrivee": "/photos/avant.jpg",
  "apres-arrivee": "/photos/premiers-jours.jpg",
  logement: "/photos/logement.jpg",
  emploi: "/photos/emploi.jpg",
  demarches: "/photos/demarches.jpg",
};

export default async function HomePage() {
  const user = await currentUser();
  const menu = [
    { href: "#candidature", label: "Candidature" },
    { href: "#visa", label: "Visa" },
    { href: "#arrivee", label: "Arrivée" },
    { href: "#france", label: "En France" },
    { href: "#guide", label: "Le guide" },
    { href: "/contact", label: "Contact" },
    user
      ? { href: user.role === "admin" || user.role === "accompagnateur" ? "/admin" : "/parcours", label: user.role === "accompagnateur" || user.role === "admin" ? "Administration" : "Mon parcours" }
      : { href: "/connexion", label: "Connexion" },
    ...(user ? [] : [{ href: "/inscription", label: "Compte" }]),
  ];
  return (
    <div className="mx-auto max-w-5xl px-5 py-8 md:py-14">
      <SideMenu items={menu} />
      <img src="/photos/accueil.jpg" alt="Grande salle d'une université, avec des étudiants." className="h-52 w-full rounded-3xl object-cover sm:h-72" />
      <p className="mt-8 text-sm uppercase tracking-[0.18em] text-blue">Pour les étudiants qui viennent en France</p>
      <h1 className="mt-4 max-w-2xl font-serif text-4xl leading-[1.05] sm:text-5xl">
        Toute la route, de la candidature jusqu&apos;à la vie en France.
      </h1>
      <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">
        Tu crées un compte, tu indiques où tu en es, et tu ne vois que ce qui te concerne.
        Parcourstudent t&apos;accompagne et t&apos;ouvre le portail officiel. La demande, tu la fais toi-même. Bonne chance.
        Tant que tu prépares ta candidature, les démarches d&apos;arrivée restent fermées. Elles s&apos;ouvrent quand tu as le visa.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        {user ? (
          <Link href={user.role === "admin" || user.role === "accompagnateur" ? "/admin" : "/parcours"} className="rounded-full bg-blue px-5 py-3 text-sm font-medium text-paper">
            {user.role === "admin" || user.role === "accompagnateur" ? "Ouvrir l'administration" : "Ouvrir mon parcours"}
          </Link>
        ) : (
          <>
            <Link href="/inscription" className="rounded-full bg-blue px-5 py-3 text-sm font-medium text-paper">
              Créer mon compte
            </Link>
            <Link href="/connexion" className="inline-flex items-center gap-2 rounded-full border border-line bg-card px-5 py-3 text-sm">
              <LockIcon className="h-4 w-4" />
              J&apos;ai déjà un compte
            </Link>
          </>
        )}
      </div>
      <p className="mt-4 text-sm">
        <Link href="/contact" className="text-blue underline">Écrire pour un accompagnement personnalisé</Link>
      </p>
      <div className="mt-12 grid gap-3 sm:grid-cols-2">
        {entries.map(([id, anchor, title, text, photo, alt]) => (
          <Link key={id} id={anchor} href="/parcours" className="scroll-mt-20 overflow-hidden rounded-2xl border border-line bg-card hover:border-blue">
            <img src={photo} alt={alt} className="h-44 w-full object-cover" />
            <span className="block px-5 pt-4 font-medium">{title}</span>
            <span className="mt-1 block px-5 pb-5 text-sm text-muted">{text}</span>
          </Link>
        ))}
      </div>
      <div className="mt-12 grid gap-3 md:grid-cols-3">
        {guides.map((guide) => (
          <Link key={guide.slug} href={`/guides/${guide.slug}`} className="overflow-hidden rounded-2xl bg-blue-deep text-paper">
            <img src={guidePhotos[guide.slug]} alt="" className="h-36 w-full object-cover" />
            <span className="block px-4 pt-4 font-medium">{guide.title}</span>
            <span className="mt-2 block px-4 pb-4 text-sm text-paper/80">{guide.intro}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
