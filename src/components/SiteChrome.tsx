import { headers } from "next/headers";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { PhoneNav } from "@/components/PhoneNav";
import { accompagnateurPhone, accompagnateurPhoneText, accompagnateurWhatsApp } from "@/lib/accompagnement";
import { currentUser } from "@/lib/auth";
import { candidatures } from "@/lib/candidatures";
import { linksForCategory } from "@/lib/db";
import { demarches } from "@/lib/demarches";
import { adminPlus, guestPlus, studentPlus } from "@/lib/menus";
import { phaseOf } from "@/lib/moments";
import { renewalAlert } from "@/lib/renewal";

export async function Header() {
  const user = await currentUser();
  const inFrance = user?.role === "user" && phaseOf(user.situation) === "france";
  const alert = inFrance ? renewalAlert(user.titre_expires_on) : null;
  const showAlert = alert && alert.level !== "calm" && alert.level !== "missing";
  const chat = (await headers()).get("x-pathname") === "/messages";
  const mail = process.env.NODE_ENV !== "production";
  const plus = user?.role === "admin" ? adminPlus(mail) : user?.role === "user" ? studentPlus(Boolean(inFrance)) : user ? [] : guestPlus;
  const voieItems = candidatures.map((item) => ({ href: `/candidatures/${item.id}`, label: item.menu }));
  const demarcheItems = demarches
    .filter((item) => item.forSituations.includes(user?.situation ?? ""))
    .map((item) => ({ href: `/demarches/${item.id}`, label: item.menu }));
  return (
    <>
    <header className="shrink-0 border-b border-line bg-paper/90 backdrop-blur">
      {showAlert && (
        <Link href="/annee#renouvellement" className="block bg-amber-soft px-5 py-2 text-center text-sm text-ink">
          {alert.title}. Ouvre le rappel de renouvellement.
        </Link>
      )}
      {chat && user && (
        <div className="bg-blue-deep px-4 py-3 text-paper md:hidden">
          <p className="text-[11px] uppercase tracking-[0.16em] text-paper/70">Messages</p>
          <p className="font-medium">Groupe des étudiants</p>
        </div>
      )}
      <div className={`mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 md:px-5 md:py-4 ${chat && user ? "hidden md:flex" : ""}`}>
        <Logo />
        <nav className="hidden flex-wrap items-center justify-end gap-x-4 gap-y-1 text-sm md:flex">
          {user?.role === "user" && (
            <>
              <Link href="/parcours" className="hover:text-blue">Accueil</Link>
              <Link href="/annee" className="hover:text-blue">Année</Link>
              {!inFrance ? (
                <details className="relative">
                  <summary className="cursor-pointer list-none hover:text-blue">Voies</summary>
                  <div className="absolute right-0 z-10 mt-2 w-56 rounded-2xl border border-line bg-card p-2 shadow-sm">
                    <Link href="/candidatures" className="block rounded-xl px-3 py-2 hover:bg-paper">Toutes les voies</Link>
                    {voieItems.map((item) => (
                      <Link key={item.href} href={item.href} className="block rounded-xl px-3 py-2 hover:bg-paper">{item.label}</Link>
                    ))}
                  </div>
                </details>
              ) : (
                <details className="relative">
                  <summary className="cursor-pointer list-none hover:text-blue">Démarches</summary>
                  <div className="absolute right-0 z-10 mt-2 w-56 rounded-2xl border border-line bg-card p-2 shadow-sm">
                    {demarcheItems.map((item) => (
                      <Link key={item.href} href={item.href} className="block rounded-xl px-3 py-2 hover:bg-paper">{item.label}</Link>
                    ))}
                  </div>
                </details>
              )}
              <Link href="/messages" className="hover:text-blue">Messages</Link>
              <details className="relative">
                <summary className="cursor-pointer list-none hover:text-blue">Plus</summary>
                <div className="absolute right-0 z-10 mt-2 w-48 rounded-2xl border border-line bg-card p-2 shadow-sm">
                  {plus.map((item) => (
                    <Link key={item.href} href={item.href} className="block rounded-xl px-3 py-2 hover:bg-paper">{item.label}</Link>
                  ))}
                </div>
              </details>
            </>
          )}
          {user?.role === "admin" && (
            <Link href="/admin" className="hover:text-blue">Administration</Link>
          )}
          {user?.role === "accompagnateur" && (
            <Link href="/accompagnement" className="hover:text-blue">Accompagnement</Link>
          )}
          {user ? (
            <a href="/sortir" className="text-muted hover:text-blue">Sortir</a>
          ) : (
            <>
              <Link href="/connexion" className="hover:text-blue">Connexion</Link>
              <Link href="/inscription" className="rounded-full bg-blue px-3 py-1.5 text-paper">Créer un compte</Link>
              <details className="relative">
                <summary className="cursor-pointer list-none hover:text-blue">Plus</summary>
                <div className="absolute right-0 z-10 mt-2 w-48 rounded-2xl border border-line bg-card p-2 shadow-sm">
                  {plus.map((item) => (
                    <Link key={item.href} href={item.href} className="block rounded-xl px-3 py-2 hover:bg-paper">{item.label}</Link>
                  ))}
                </div>
              </details>
            </>
          )}
        </nav>
      </div>
    </header>
    <PhoneNav
      key={user ? String(user.id) : "invite"}
      mode={user?.role === "admin" ? "admin" : user?.role === "accompagnateur" ? "accompagnateur" : user ? "student" : "guest"}
      inFrance={Boolean(inFrance)}
      voies={voieItems}
      demarches={demarcheItems}
      plus={plus}
    />
    </>
  );
}

export function Footer() {
  const socials = linksForCategory("reseau");
  return (
    <footer className="mt-auto border-t border-line">
      <div className="mx-auto max-w-5xl px-5 py-8 text-sm text-muted">
        <p>Parcourstudent en France explique et oriente. Aucun document n&apos;est déposé ici. Les démarches se font sur les sites officiels.</p>
        <p className="mt-3">
          Accompagnement personnalisé, Ibrahim Talibe DIALLO :{" "}
          <a className="text-blue" href={`tel:${accompagnateurPhone}`}>Appeler {accompagnateurPhoneText}</a>
          {" · "}
          <a className="text-blue" href={accompagnateurWhatsApp} target="_blank" rel="noreferrer">WhatsApp</a>
        </p>
        <p className="mt-3"><Link href="/contact" className="text-blue">Contact</Link></p>
        {socials.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-3">
            {socials.map((item) => (
              <li key={item.id}>
                <a className="text-blue" href={item.url} target="_blank" rel={item.affiliate ? "noreferrer sponsored" : "noreferrer"}>{item.title}</a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </footer>
  );
}
