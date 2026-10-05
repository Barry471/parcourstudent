import Link from "next/link";
import { notFound } from "next/navigation";
import { Disclaimer } from "@/components/Disclaimer";
import { guides, stepsFor } from "@/lib/content";
import { requireUser } from "@/lib/guard";

export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await requireUser();
  const guide = guides.find((item) => item.slug === slug);
  if (!guide) notFound();
  const items = stepsFor(guide.intent);
  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <h1 className="font-serif text-4xl">{guide.title}</h1>
      <p className="mt-3 text-muted">{guide.intro}</p>
      <div className="mt-6"><Disclaimer /></div>
      <ol className="mt-8 grid gap-4">
        {items.map((item) => (
          <li key={item.id} className="rounded-2xl border border-line bg-card p-5">
            <h2 className="font-serif text-2xl">{item.title}</h2>
            <p className="mt-2 text-muted">{item.summary}</p>
            <ul className="mt-3 text-sm">
              {item.links.map((link) => (
                <li key={link.href}>
                  <a className="text-blue underline" href={link.href} target="_blank" rel="noreferrer">{link.label}</a>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
      <Link href={`/commencer?besoin=${guide.intent}`} className="mt-8 inline-block rounded-full bg-blue px-5 py-3 text-sm text-paper">
        Adapter à ma ville
      </Link>
    </div>
  );
}
