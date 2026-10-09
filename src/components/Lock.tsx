"use client";

import { useState, type InputHTMLAttributes } from "react";

export function LockIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

function EyeIcon({ hidden, className = "h-4 w-4" }: { hidden: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
      {hidden ? <path d="M4 4l16 16" /> : null}
    </svg>
  );
}

export function LockedPassword({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  const [visible, setVisible] = useState(false);
  return (
    <span className="relative block">
      <LockIcon className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-muted" />
      <input {...props} type={visible ? "text" : "password"} className={`${className} pr-14! pl-11!`} />
      <button
        type="button"
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => setVisible((value) => !value)}
        aria-label={visible ? "Masquer le mot de passe" : "Afficher le mot de passe"}
        aria-pressed={visible}
        className="absolute top-1/2 right-1 flex h-11 w-11 -translate-y-1/2 items-center justify-center text-muted hover:text-blue"
      >
        <EyeIcon hidden={!visible} />
      </button>
    </span>
  );
}
