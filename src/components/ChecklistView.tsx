"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { byId, cities, countries, levels, needs, stepsFor, type Step } from "@/lib/content";
import { Disclaimer } from "@/components/Disclaimer";

export function ChecklistView() {
  const params = useSearchParams();
  const country = byId(countries, params.get("pays") ?? "") ?? countries[0];
  const level = byId(levels, params.get("niveau") ?? "") ?? levels[0];
  const city = byId(cities, params.get("ville") ?? "") ?? cities[0];
  const need = byId(needs, params.get("besoin") ?? "") ?? needs[0];
  const items = stepsFor(need.id).map((step) =>
    step.id === "transport"
      ? {
          ...step,
          summary: `À ${city.name}, regarde ${city.transportName}.`,
          links: [{ label: city.transportName, href: city.transportHref, publisher: city.name }, ...step.links],
        }
      : step,
  );
  const [done, setDone] = useState<string[]>([]);
  const [open, setOpen] = useState<string | null>(items[0]?.id ?? null);

  useEffect(() => {
    const saved = window.localStorage.getItem("parcours-checks");
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as string[];
      if (Array.isArray(parsed)) setDone(parsed);
    } catch {
      setDone([]);
    }
  }, []);

  function toggle(id: string) {
    setDone((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      window.localStorage.setItem("parcours-checks", JSON.stringify(next));
      return next;
    });
  }

  const finished = items.filter((item) => done.includes(item.id)).length;
  return (
    <div className="grid gap-8">
      <div>
        <p className="text-sm uppercase tracking-[0.16em] text-blue">Checklist</p>
        <h1 className="mt-2 font-serif text-4xl">{country.name}, {level.name}, {city.name}</h1>
        <p className="mt-3 text-muted">{need.text}</p>
        <p className="mt-2 text-sm">{country.note}</p>
      </div>
      <Disclaimer />
      <div className="flex items-center justify-between rounded-2xl bg-blue-deep px-5 py-4 text-paper">
        <p>{finished} étape{finished > 1 ? "s" : ""} cochée{finished > 1 ? "s" : ""} sur {items.length}</p>
        <Link href="/commencer" className="text-sm underline">Modifier</Link>
      </div>
      <Phase title="Avant l'arrivée" items={items.filter((item) => item.phase === "avant")} done={done} open={open} onOpen={setOpen} onToggle={toggle} />
      <Phase title="Après l'arrivée" items={items.filter((item) => item.phase === "apres")} done={done} open={open} onOpen={setOpen} onToggle={toggle} />
    </div>
  );
}

function Phase({
  title,
  items,
  done,
  open,
  onOpen,
  onToggle,
}: {
  title: string;
  items: Step[];
  done: string[];
  open: string | null;
  onOpen: (id: string | null) => void;
  onToggle: (id: string) => void;
}) {
  if (items.length === 0) return null;
  return (
    <section>
      <h2 className="font-serif text-2xl">{title}</h2>
      <ul className="mt-4 grid gap-3">
        {items.map((item) => (
          <li key={item.id} className="rounded-2xl border border-line bg-card px-4 py-4">
            <div className="flex gap-3">
              <input id={item.id} type="checkbox" className="mt-1 h-5 w-5 accent-blue" checked={done.includes(item.id)} onChange={() => onToggle(item.id)} />
              <div>
                <label htmlFor={item.id} className="font-medium">{item.title}</label>
                <p className="mt-1 text-sm text-muted">{item.summary}</p>
                <button type="button" className="mt-2 text-sm text-blue" onClick={() => onOpen(open === item.id ? null : item.id)}>
                  {open === item.id ? "Masquer" : "Voir les liens officiels"}
                </button>
              </div>
            </div>
            {open === item.id && (
              <div className="mt-3 border-t border-line pt-3 pl-8 text-sm">
                <ul className="grid gap-1">{item.details.map((detail) => <li key={detail}>{detail}</li>)}</ul>
                {item.caution && <p className="mt-2 rounded-xl bg-amber-soft px-3 py-2">{item.caution}</p>}
                <ul className="mt-3 grid gap-1">
                  {item.links.map((link) => (
                    <li key={link.href}>
                      <a className="font-medium text-blue underline" href={link.href} target="_blank" rel="noreferrer">{link.label}</a>
                      <span className="ml-2 text-xs uppercase text-muted">{link.publisher}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
