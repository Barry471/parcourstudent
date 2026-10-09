import { UsefulLinks } from "@/components/UsefulLinks";
import { allLinks } from "@/lib/db";
import { requireUser } from "@/lib/guard";

export default async function LiensPage() {
  await requireUser();
  const links = allLinks();
  return (
    <div className="mx-auto max-w-3xl px-5 py-8 md:py-12">
      <p className="text-sm uppercase tracking-[0.16em] text-blue">À garder sous la main</p>
      <h1 className="mt-2 font-serif text-4xl">Liens utiles</h1>
      <p className="mt-3 text-muted">
        Transport, logement, banque, santé et les autres sites publiés pour toi. Chaque carte ouvre le site officiel ou le service indiqué.
      </p>
      <div className="mt-8">
        <UsefulLinks links={links} />
      </div>
      {links.filter((link) => link.category !== "reseau").length === 0 && (
        <p className="mt-6 text-sm text-muted">Aucun lien n&apos;est publié pour le moment.</p>
      )}
    </div>
  );
}
