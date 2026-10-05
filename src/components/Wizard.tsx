"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cities, countries, levels, needs, type Intent } from "@/lib/content";

const labels = ["Pays", "Études", "Ville", "Besoin"] as const;

export function Wizard({ initialNeed }: { initialNeed?: string }) {
  const router = useRouter();
  const starting = needs.some((need) => need.id === initialNeed) ? (initialNeed as Intent) : undefined;
  const [index, setIndex] = useState(starting ? 3 : 0);
  const [country, setCountry] = useState("guinee");
  const [level, setLevel] = useState("bachelor");
  const [city, setCity] = useState("paris");
  const [need, setNeed] = useState<Intent>(starting ?? "preparer");

  function next() {
    if (index < 3) {
      setIndex(index + 1);
      return;
    }
    const params = new URLSearchParams({ pays: country, niveau: level, ville: city, besoin: need });
    router.push(`/checklist?${params.toString()}`);
  }

  const choices =
    index === 0 ? countries : index === 1 ? levels : index === 2 ? cities : needs;
  const selected = index === 0 ? country : index === 1 ? level : index === 2 ? city : need;
  const choose = (id: string) => {
    if (index === 0) setCountry(id);
    if (index === 1) setLevel(id);
    if (index === 2) setCity(id);
    if (index === 3) setNeed(id as Intent);
  };

  return (
    <div className="rounded-3xl border border-line bg-card p-5 sm:p-8">
      <p className="text-xs uppercase tracking-[0.16em] text-muted">
        Étape {index + 1} / 4 · {labels[index]}
      </p>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-sand">
        <div className="h-full bg-blue" style={{ width: `${((index + 1) / 4) * 100}%` }} />
      </div>
      {index === 2 ? (
        <label className="mt-6 block">
          <span className="text-sm text-muted">Choisis ta ville</span>
          <select
            className="mt-2 w-full rounded-2xl border border-line bg-paper px-4 py-3"
            value={city}
            onChange={(event) => setCity(event.target.value)}
          >
            {cities.map((item) => (
              <option key={item.id} value={item.id}>{item.name}</option>
            ))}
          </select>
        </label>
      ) : (
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {choices.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => choose(item.id)}
            className={`rounded-2xl border px-4 py-3 text-left ${
              selected === item.id ? "border-blue bg-blue text-paper" : "border-line bg-paper"
            }`}
          >
            <span className="block font-medium">{"name" in item ? item.name : item.title}</span>
            {"text" in item && (
              <span className={`mt-1 block text-sm ${selected === item.id ? "text-paper/80" : "text-muted"}`}>
                {item.text}
              </span>
            )}
          </button>
        ))}
      </div>
      )}
      <div className="mt-8 flex justify-between">
        <button type="button" className="text-sm text-muted" disabled={index === 0} onClick={() => setIndex(index - 1)}>
          Retour
        </button>
        <button type="button" className="rounded-full bg-ink px-5 py-3 text-sm text-paper" onClick={next}>
          {index === 3 ? "Voir ma checklist" : "Continuer"}
        </button>
      </div>
    </div>
  );
}
