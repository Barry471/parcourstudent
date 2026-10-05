import { Wizard } from "@/components/Wizard";
import { requireUser } from "@/lib/guard";

export default async function StartPage({
  searchParams,
}: {
  searchParams: Promise<{ besoin?: string }>;
}) {
  await requireUser();
  const { besoin } = await searchParams;
  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <h1 className="font-serif text-4xl">Quatre questions, une checklist.</h1>
      <div className="mt-8">
        <Wizard initialNeed={besoin} />
      </div>
    </div>
  );
}
