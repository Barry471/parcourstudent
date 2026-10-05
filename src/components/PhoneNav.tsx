"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type LinkItem = { href: string; label: string };

export function PhoneNav({
  mode,
  inFrance,
  voies,
  demarches,
  plus,
}: {
  mode: "guest" | "student" | "admin" | "accompagnateur";
  inFrance: boolean;
  voies: LinkItem[];
  demarches: LinkItem[];
  plus: LinkItem[];
}) {
  const pathname = usePathname();
  const [sheet, setSheet] = useState<"plus" | "voies" | "demarches" | null>(null);

  useEffect(() => {
    setSheet(null);
  }, [pathname]);

  const voieActive = pathname.startsWith("/candidatures");
  const demarcheActive = pathname.startsWith("/demarches");
  const plusActive = plus.some((item) => pathname === item.href || pathname.startsWith(`${item.href}/`));

  return (
    <>
      {sheet && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-ink/30 md:hidden"
          aria-label="Fermer le menu"
          onClick={() => setSheet(null)}
        />
      )}
      {sheet && (
        <div className="fixed inset-x-3 bottom-[calc(4.25rem+env(safe-area-inset-bottom))] z-40 max-h-[60dvh] overflow-y-auto rounded-3xl border border-line bg-card p-2 shadow-sm md:hidden">
          {sheet === "voies" && <SheetLinks items={[{ href: "/candidatures", label: "Toutes les voies" }, ...voies]} />}
          {sheet === "demarches" && (
            demarches.length > 0 ? <SheetLinks items={demarches} /> : (
              <Link href="/annee" className="block rounded-2xl px-4 py-3">Indique d&apos;abord ta situation</Link>
            )
          )}
          {sheet === "plus" && (
            <div className="grid">
              <SheetLinks items={plus} />
              {mode !== "guest" && (
                <a href="/sortir" className="block rounded-2xl px-4 py-3 text-muted">Sortir</a>
              )}
            </div>
          )}
        </div>
      )}
      <nav aria-label="Navigation" className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-card pb-[env(safe-area-inset-bottom)] md:hidden">
        {mode === "guest" && (
          <div className="grid grid-cols-4">
            <Tab href="/" label="Accueil" active={pathname === "/"} icon="home" />
            <Tab href="/connexion" label="Connexion" active={pathname.startsWith("/connexion")} icon="key" />
            <Tab href="/inscription" label="Compte" active={pathname.startsWith("/inscription")} icon="user" />
            <MenuTab label="Plus" active={plusActive || sheet === "plus"} open={sheet === "plus"} onClick={() => setSheet(sheet === "plus" ? null : "plus")} icon="more" />
          </div>
        )}
        {mode === "student" && (
          <div className="grid grid-cols-5">
            <Tab href="/parcours" label="Accueil" active={pathname === "/parcours"} icon="home" />
            <Tab href="/annee" label="Année" active={pathname.startsWith("/annee")} icon="calendar" />
            {inFrance ? (
              <MenuTab label="Démarches" active={demarcheActive || sheet === "demarches"} open={sheet === "demarches"} onClick={() => setSheet(sheet === "demarches" ? null : "demarches")} icon="list" />
            ) : (
              <MenuTab label="Voies" active={voieActive || sheet === "voies"} open={sheet === "voies"} onClick={() => setSheet(sheet === "voies" ? null : "voies")} icon="list" />
            )}
            <Tab href="/messages" label="Messages" active={pathname.startsWith("/messages")} icon="chat" />
            <MenuTab label="Plus" active={plusActive || sheet === "plus"} open={sheet === "plus"} onClick={() => setSheet(sheet === "plus" ? null : "plus")} icon="more" />
          </div>
        )}
        {mode === "accompagnateur" && (
          <div className="grid grid-cols-2">
            <Tab href="/accompagnement" label="Contacts" active={pathname.startsWith("/accompagnement")} icon="chat" />
            <a href="/sortir" className="flex min-h-16 flex-col items-center justify-center gap-1 text-[11px] text-muted">
              <Icon name="key" />
              Sortir
            </a>
          </div>
        )}
        {mode === "admin" && (
          <div className="grid grid-cols-4">
            <Tab href="/admin" label="Tableau" active={pathname === "/admin"} icon="home" />
            <Tab href="/admin/etudiants" label="Étudiants" active={pathname.startsWith("/admin/etudiants")} icon="user" />
            <Tab href="/messages" label="Messages" active={pathname === "/messages"} icon="chat" />
            <MenuTab label="Plus" active={plusActive || sheet === "plus"} open={sheet === "plus"} onClick={() => setSheet(sheet === "plus" ? null : "plus")} icon="more" />
          </div>
        )}
      </nav>
    </>
  );
}

function SheetLinks({ items }: { items: LinkItem[] }) {
  return (
    <>
      {items.map((item) => (
        <Link key={item.href} href={item.href} className="block rounded-2xl px-4 py-3 hover:bg-paper">{item.label}</Link>
      ))}
    </>
  );
}

function Tab({ href, label, active, icon }: { href: string; label: string; active: boolean; icon: IconName }) {
  return (
    <Link href={href} className={`flex min-h-16 flex-col items-center justify-center gap-1 text-[11px] ${active ? "text-blue" : "text-muted"}`}>
      <Icon name={icon} />
      {label}
    </Link>
  );
}

function MenuTab({ label, active, open, onClick, icon }: { label: string; active: boolean; open: boolean; onClick: () => void; icon: IconName }) {
  return (
    <button type="button" aria-expanded={open} onClick={onClick} className={`flex min-h-16 flex-col items-center justify-center gap-1 text-[11px] ${active ? "text-blue" : "text-muted"}`}>
      <Icon name={icon} />
      {label}
    </button>
  );
}

type IconName = "home" | "calendar" | "list" | "chat" | "more" | "key" | "user";

function Icon({ name }: { name: IconName }) {
  const common = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true, className: "h-5 w-5" };
  if (name === "home") return <svg {...common}><path d="M4 11.5 12 5l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-8.5Z" /></svg>;
  if (name === "calendar") return <svg {...common}><rect x="4" y="5" width="16" height="15" rx="2" /><path d="M8 3.5V7M16 3.5V7M4 10h16" /></svg>;
  if (name === "list") return <svg {...common}><path d="M8 7h12M8 12h12M8 17h12M4 7h.01M4 12h.01M4 17h.01" /></svg>;
  if (name === "chat") return <svg {...common}><path d="M6 17.5 4 20V6.5A1.5 1.5 0 0 1 5.5 5h13A1.5 1.5 0 0 1 20 6.5v9A1.5 1.5 0 0 1 18.5 17H6Z" /></svg>;
  if (name === "key") return <svg {...common}><circle cx="8" cy="12" r="3.2" /><path d="M11 12h9l-2 2 2 2" /></svg>;
  if (name === "user") return <svg {...common}><circle cx="12" cy="8" r="3" /><path d="M5.5 19.5a6.5 6.5 0 0 1 13 0" /></svg>;
  return <svg {...common}><circle cx="6" cy="12" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="18" cy="12" r="1" /></svg>;
}
