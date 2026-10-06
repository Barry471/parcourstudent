"use client";

import Link from "next/link";
import { useState } from "react";
import { LockIcon } from "@/components/Lock";

export function SideMenu({ items }: { items: { href: string; label: string }[] }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && (
        <button
          type="button"
          className="fixed inset-0 z-20 bg-ink/30 md:bg-ink/20"
          aria-label="Fermer le menu"
          onClick={() => setOpen(false)}
        />
      )}
      <nav
        aria-label="Menu de l'accueil"
        className={`fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-line bg-card px-4 pb-24 pt-6 transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <p className="text-xs uppercase tracking-[0.16em] text-blue">Menu</p>
        <ul className="mt-4 grid">
          {items.map((item) => (
            <li key={item.href}>
              {item.href.startsWith("#") ? (
                <a href={item.href} onClick={() => setOpen(false)} className="block rounded-2xl px-3 py-3 text-base hover:bg-paper">{item.label}</a>
              ) : (
                <Link href={item.href} onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-2xl px-3 py-3 text-base hover:bg-paper">
                  {item.href === "/connexion" && <LockIcon className="h-4 w-4 shrink-0" />}
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className={`fixed top-28 z-30 min-h-11 rounded-r-2xl border border-l-0 border-line bg-blue px-3 text-sm text-paper transition-[left] duration-300 ${open ? "left-64" : "left-0"}`}
      >
        {open ? "Fermer" : "Menu"}
      </button>
    </>
  );
}
