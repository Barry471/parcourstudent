export function GroupLinks({
  groups,
}: {
  groups: { id: number; platform: string; label: string; url: string }[];
}) {
  if (groups.length === 0) return null;
  const whatsapp = groups.some((group) => group.platform === "whatsapp");
  return (
    <div className="mt-4 grid gap-2">
      {whatsapp && (
        <p className="rounded-2xl border border-amber/30 bg-amber-soft px-4 py-3 text-sm leading-6">
          Dans un groupe WhatsApp, ton numéro est visible par les autres membres. Tu entres seulement si tu es d&apos;accord. Un message du groupe n&apos;est pas Campus France ni France-Visas.
        </p>
      )}
      <ul className="grid gap-2">
        {groups.map((group) => (
          <li key={group.id}>
            <a className="block rounded-2xl border border-line bg-card px-4 py-3" href={group.url} target="_blank" rel="noreferrer">
              <span className="text-xs uppercase text-muted">{group.platform}</span>
              <span className="mt-1 block font-medium text-blue">{group.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
