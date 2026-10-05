import type { ReactNode } from "react";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";

const links = [
  { href: "/admin", label: "Tableau" },
  { href: "/admin/etudiants", label: "Étudiants" },
  { href: "/admin/alertes", label: "Alertes" },
  { href: "/messages", label: "Messages" },
  { href: "/admin/contact", label: "Contacts" },
  { href: "/admin/infos", label: "Informations" },
  { href: "/admin/groupes", label: "Groupes" },
  { href: "/admin/liens", label: "Liens" },
  { href: "/admin/videos", label: "Vidéos" },
  ...(process.env.NODE_ENV === "production" ? [] : [{ href: "/admin/courrier", label: "Courrier" }]),
];

const reserved = new Set(["/admin/groupes", "/admin/liens", "/admin/videos", "/admin/courrier"]);

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await currentUser();
  if (!user || (user.role !== "admin" && user.role !== "accompagnateur")) redirect("/");
  const path = (await headers()).get("x-pathname") ?? "";
  if (user.role === "accompagnateur" && reserved.has(path)) redirect("/admin");
  const visible = user.role === "admin" ? links : links.filter((link) => !reserved.has(link.href));
  return (
    <div>
      <nav className="sticky top-0 z-20 hidden border-b border-line bg-card md:block">
        <div className="mx-auto flex max-w-5xl gap-x-5 overflow-x-auto px-5 py-3 text-sm whitespace-nowrap">
          {visible.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-blue">{link.label}</Link>
          ))}
        </div>
      </nav>
      {children}
    </div>
  );
}
