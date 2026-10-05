import { aides } from "@/lib/aides";
import { candidatures } from "@/lib/candidatures";
import { demarches } from "@/lib/demarches";
import { problems } from "@/lib/renewal";

export type SearchHit = { href: string; title: string; text: string };

export function searchContent(query: string): SearchHit[] {
  const needle = query.trim().toLowerCase();
  if (needle.length < 2) return [];
  const hits: SearchHit[] = [];
  for (const item of demarches) {
    const blob = `${item.title} ${item.intro} ${item.steps.map((step) => `${step.title} ${step.guide.join(" ")}`).join(" ")}`.toLowerCase();
    if (blob.includes(needle)) hits.push({ href: `/demarches/${item.id}`, title: item.menu, text: item.intro });
  }
  for (const item of candidatures) {
    const blob = `${item.title} ${item.forWhom} ${item.intro} ${item.steps.map((step) => `${step.title} ${step.guide.join(" ")}`).join(" ")}`.toLowerCase();
    if (blob.includes(needle)) hits.push({ href: `/candidatures/${item.id}`, title: item.menu, text: item.forWhom });
  }
  for (const item of aides) {
    const blob = `${item.title} ${item.who} ${item.benefit} ${item.caution}`.toLowerCase();
    if (blob.includes(needle)) hits.push({ href: "/aides", title: item.title, text: item.benefit });
  }
  for (const item of problems) {
    if (`${item.problem} ${item.solution}`.toLowerCase().includes(needle)) {
      hits.push({ href: "/parcours", title: item.problem, text: item.solution });
    }
  }
  return hits;
}
