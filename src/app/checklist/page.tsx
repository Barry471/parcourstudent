import { Suspense } from "react";
import { ChecklistView } from "@/components/ChecklistView";
import { requireUser } from "@/lib/guard";

export default async function ChecklistPage() {
  await requireUser();
  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <Suspense fallback={<p>Préparation…</p>}>
        <ChecklistView />
      </Suspense>
    </div>
  );
}
