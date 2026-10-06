"use client";

import { useFormStatus } from "react-dom";

export function PasswordRequestButton() {
  const { pending } = useFormStatus();
  return (
    <button className="rounded-full bg-blue px-5 py-3 text-paper disabled:opacity-60" type="submit" disabled={pending}>
      {pending ? "Envoi…" : "Demander un nouveau mot de passe"}
    </button>
  );
}
