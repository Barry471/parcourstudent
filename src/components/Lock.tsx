import type { InputHTMLAttributes } from "react";

export function LockIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

export function LockedPassword({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <span className="relative block">
      <LockIcon className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-muted" />
      <input {...props} type="password" className={`${className} pl-11!`} />
    </span>
  );
}
