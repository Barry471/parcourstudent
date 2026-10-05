import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";

const links = [
  { href: "/admin", label: "Tableau" },
  { href: "/admin/etudiants", label: "Étudiants" },
  { href: "/admin/alertes", label: "Alertes" },
  { href: "/admin/messages", label: "Messages" },
  { href: "/admin/contact", label: "Contacts" },
  { href: "/admin/infos", label: "Informations" },
  { href: "/admin/groupes", label: "Groupes" },
  { href: "/admin/liens", label: "Liens" },
  { href: "/admin/videos", label: "Vidéos" },
  ...(process.env.NODE_ENV === "production" ? [] : [{ href: "/admin/courrier", label: "Courrier" }]),
];

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await currentUser();
  if (!user || user.role !== "admin") redirect("/");
  return (
    <div>
      <nav className="sticky top-0 z-20 hidden border-b border-line bg-card md:block">
        <div className="mx-auto flex max-w-5xl gap-x-5 overflow-x-auto px-5 py-3 text-sm whitespace-nowrap">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-blue">{link.label}</Link>
          ))}
        </div>
      </nav>
      {children}
    </div>
  );
}
