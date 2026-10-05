import Link from "next/link";
import type { ProcedurePhoto } from "@/lib/photos";

export function ProcedureCard({
  href,
  title,
  detail,
  percent,
  photo,
}: {
  href: string;
  title: string;
  detail?: string;
  percent: number;
  photo: ProcedurePhoto;
}) {
  return (
    <Link href={href} className="flex gap-3 rounded-2xl border border-line bg-card p-3 hover:border-blue">
      <img src={photo.src} alt="" className="h-14 w-24 shrink-0 rounded-xl bg-paper object-contain p-1.5" />
      <span className="min-w-0 flex-1 py-0.5">
        <span className="flex items-center justify-between gap-3">
          <span className="font-medium">{title}</span>
          <span className="font-serif text-2xl text-blue">{percent}%</span>
        </span>
        {detail ? <span className="mt-1 block text-sm text-muted">{detail}</span> : null}
        <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-sand">
          <span className="block h-full bg-blue" style={{ width: `${percent}%` }} />
        </span>
      </span>
    </Link>
  );
}

export function ProcedureHero({ photo }: { photo: ProcedurePhoto }) {
  return (
    <div className="mt-4 flex h-24 items-center rounded-3xl border border-line bg-card px-5 sm:h-28">
      <img src={photo.src} alt={photo.alt} className="max-h-16 w-auto max-w-full object-contain" />
    </div>
  );
}
