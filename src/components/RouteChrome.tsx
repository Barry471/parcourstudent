"use client";

import { usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";

function onMessages(path: string) {
  return path === "/messages";
}

export function ChatBanner() {
  const chat = onMessages(usePathname());
  if (!chat) return null;
  return (
    <div className="bg-blue-deep px-4 py-3 text-paper md:hidden">
      <p className="text-[11px] uppercase tracking-[0.16em] text-paper/70">Messages</p>
      <p className="font-medium">Groupe des étudiants</p>
    </div>
  );
}

export function ChatRow({ children }: { children: ReactNode }) {
  const chat = onMessages(usePathname());
  return (
    <div className={`mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 md:px-5 md:py-4 ${chat ? "hidden md:flex" : ""}`}>
      {children}
    </div>
  );
}

export function UnlessChat({ children }: { children: ReactNode }) {
  if (onMessages(usePathname())) return null;
  return children;
}

export function ChatBody() {
  const chat = onMessages(usePathname());
  useEffect(() => {
    document.body.classList.toggle("h-dvh", chat);
    document.body.classList.toggle("overflow-hidden", chat);
    document.body.classList.toggle("min-h-full", !chat);
    const main = document.getElementById("contenu");
    if (!main) return;
    main.classList.toggle("flex", chat);
    main.classList.toggle("min-h-0", chat);
    main.classList.toggle("flex-col", chat);
  }, [chat]);
  return null;
}
