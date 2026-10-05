import Link from "next/link";

export function Logo({ large = false }: { large?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-3">
      <svg
        viewBox="0 0 48 48"
        aria-hidden="true"
        className={large ? "h-14 w-14 shrink-0" : "h-10 w-10 shrink-0"}
      >
        <rect width="48" height="48" rx="14" fill="#0e2a4a" />
        <path
          d="M14 32c6-2 8-10 10-16 2 6 4 14 10 16"
          fill="none"
          stroke="#f4f7fb"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <circle cx="24" cy="16" r="3" fill="#d9e3f0" />
        <circle cx="14" cy="32" r="2.2" fill="#1b4f8a" stroke="#f4f7fb" strokeWidth="1.4" />
        <circle cx="34" cy="32" r="2.2" fill="#1b4f8a" stroke="#f4f7fb" strokeWidth="1.4" />
      </svg>
      <span>
        <span className={`block font-serif leading-none ${large ? "text-3xl" : "text-xl"}`}>Parcourstudent</span>
        <span className={`block tracking-wide text-muted ${large ? "mt-1 text-sm" : "text-xs"}`}>en France</span>
      </span>
    </Link>
  );
}
