import type { PartnerLink } from "@/lib/db";
import { categories } from "@/lib/procedure";

function LinkCard({ link }: { link: PartnerLink }) {
  return (
    <li>
      <a
        href={link.url}
        target="_blank"
        rel={link.affiliate ? "noreferrer sponsored" : "noreferrer"}
        className="block rounded-2xl border border-blue bg-sand px-4 py-4"
      >
        <span className="text-lg font-medium">{link.title}</span>
        {link.note ? <span className="mt-1 block text-sm leading-6 text-muted">{link.note}</span> : null}
        {link.affiliate ? <span className="mt-2 block text-xs uppercase tracking-wide text-muted">Affiliation</span> : null}
        <span className="mt-2 inline-block text-sm font-medium text-blue">Ouvrir le site</span>
      </a>
    </li>
  );
}

export function UsefulLinks({ links, showGroups = true }: { links: PartnerLink[]; showGroups?: boolean }) {
  const visible = links.filter((link) => link.category !== "reseau");
  if (visible.length === 0) return null;

  if (!showGroups) {
    return (
      <ul className="mt-3 grid gap-3">
        {visible.map((link) => <LinkCard key={link.id} link={link} />)}
      </ul>
    );
  }

  const groups = categories
    .map((category) => ({
      id: category.id,
      label: category.label,
      items: visible.filter((link) => link.category === category.id),
    }))
    .filter((group) => group.items.length > 0);

  if (groups.length === 0) return null;

  return (
    <div className="grid gap-6">
      {groups.map((group) => (
        <section key={group.id}>
          <h3 className="text-sm font-medium uppercase tracking-[0.14em] text-blue">{group.label}</h3>
          <ul className="mt-3 grid gap-3">
            {group.items.map((link) => <LinkCard key={link.id} link={link} />)}
          </ul>
        </section>
      ))}
    </div>
  );
}
