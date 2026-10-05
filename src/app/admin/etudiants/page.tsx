import { addStudentAction, deleteStudentAction, resetPasswordAction, setActiveAction } from "@/lib/actions";
import { cities, countries, undecidedCity } from "@/lib/content";
import { studentsByCity, type User } from "@/lib/db";

function fold(value: string) {
  return value.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}

export default async function StudentsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; pays?: string; ville?: string }>;
}) {
  const { q = "", pays = "", ville = "" } = await searchParams;
  const query = q.trim().slice(0, 80);
  const countryId = countries.some((item) => item.id === pays) ? pays : "";
  const cityId = ville === undecidedCity || cities.some((item) => item.id === ville) ? ville : "";
  const needle = fold(query);
  const students = studentsByCity().filter((student) => {
    if (countryId && student.country !== countryId) return false;
    if (cityId && student.city !== cityId) return false;
    if (!needle) return true;
    const country = countries.find((item) => item.id === student.country)?.name ?? "";
    const city = student.city === undecidedCity ? "pas encore decide" : cities.find((item) => item.id === student.city)?.name ?? "";
    return fold(`${student.name} ${student.email} ${student.school ?? ""} ${country} ${city}`).includes(needle);
  });
  const groups = new Map<string, User[]>();
  for (const student of students) {
    const key = student.city ?? "";
    groups.set(key, [...(groups.get(key) ?? []), student]);
  }
  const cityName = (id: string) => id === undecidedCity ? "Pas encore décidé" : cities.find((city) => city.id === id)?.name ?? "Ville non indiquée";
  const countryName = (id: string | null) => countries.find((country) => country.id === id)?.name ?? "Pays non indiqué";
  const filtering = Boolean(query || countryId || cityId);

  return (
    <div className="mx-auto max-w-5xl px-5 py-12">
      <h1 className="font-serif text-4xl">Étudiants</h1>
      <p className="mt-2 text-muted">La liste est rangée par ville. L&apos;admin n&apos;y figure pas.</p>
      <form className="mt-6 grid gap-3 rounded-2xl border border-line bg-card p-4 sm:grid-cols-4">
        <input name="q" defaultValue={query} maxLength={80} placeholder="Nom, e-mail ou école" className="rounded-2xl border border-line px-3 py-2 sm:col-span-2" />
        <select name="pays" defaultValue={countryId} className="rounded-2xl border border-line px-3 py-2">
          <option value="">Tous les pays</option>
          {countries.map((country) => <option key={country.id} value={country.id}>{country.name}</option>)}
        </select>
        <select name="ville" defaultValue={cityId} className="rounded-2xl border border-line px-3 py-2">
          <option value="">Toutes les villes</option>
          <option value={undecidedCity}>Pas encore décidé</option>
          {cities.map((city) => <option key={city.id} value={city.id}>{city.name}</option>)}
        </select>
        <button className="rounded-full bg-blue px-4 py-2 text-sm text-paper" type="submit">Filtrer</button>
        {filtering && <a href="/admin/etudiants" className="self-center text-sm text-blue">Effacer le filtre</a>}
      </form>
      <p className="mt-4 text-sm text-muted">{students.length === 1 ? "1 étudiant" : `${students.length} étudiants`}</p>
      <details className="mt-6 rounded-2xl border border-line bg-card p-4">
        <summary className="cursor-pointer font-medium">Ajouter un étudiant</summary>
      <form action={addStudentAction} className="mt-4 grid gap-3 sm:grid-cols-2">
        <input name="name" required placeholder="Nom" className="rounded-2xl border border-line px-3 py-2" />
        <input name="email" type="email" required placeholder="E-mail" className="rounded-2xl border border-line px-3 py-2" />
        <input name="password" type="text" required minLength={8} placeholder="Mot de passe temporaire" className="rounded-2xl border border-line px-3 py-2" />
        <input name="school" placeholder="École" className="rounded-2xl border border-line px-3 py-2" />
        <select name="country" required className="rounded-2xl border border-line px-3 py-2" defaultValue="guinee">
          {countries.map((country) => <option key={country.id} value={country.id}>{country.name}</option>)}
        </select>
        <select name="city" required className="rounded-2xl border border-line px-3 py-2" defaultValue={undecidedCity}>
          <option value={undecidedCity}>Pas encore décidé</option>
          {cities.map((city) => <option key={city.id} value={city.id}>{city.name}</option>)}
        </select>
        <button className="rounded-full bg-blue px-4 py-2 text-sm text-paper sm:col-span-2" type="submit">Ajouter l&apos;étudiant</button>
      </form>
      </details>
      {students.length === 0 && <p className="mt-8 text-muted">Aucun étudiant ne correspond à ce filtre.</p>}
      {[...groups.entries()].map(([city, people]) => (
        <section key={city || "sans-ville"} className="mt-8">
          <h2 className="font-serif text-2xl">{cityName(city)} · {people.length}</h2>
          <ul className="mt-3 grid gap-3">
            {people.map((person) => (
              <li key={person.id} className="rounded-2xl border border-line bg-card p-4 text-sm">
                <p className="font-medium">{person.name} · {person.email}</p>
                <p className="text-muted">{countryName(person.country)} · {person.school ?? "École non indiquée"} · {person.active === 0 ? "Désactivé" : "Actif"}</p>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <form action={setActiveAction}>
                    <input type="hidden" name="filtre" value={query} />
                    <input type="hidden" name="filtre_pays" value={countryId} />
                    <input type="hidden" name="filtre_ville" value={cityId} />
                    <input type="hidden" name="id" value={person.id} />
                    <input type="hidden" name="active" value={person.active === 0 ? "1" : "0"} />
                    <button className="text-blue" type="submit">{person.active === 0 ? "Activer" : "Désactiver"}</button>
                  </form>
                  <form action={resetPasswordAction} className="flex gap-2">
                    <input type="hidden" name="filtre" value={query} />
                    <input type="hidden" name="filtre_pays" value={countryId} />
                    <input type="hidden" name="filtre_ville" value={cityId} />
                    <input type="hidden" name="id" value={person.id} />
                    <input name="password" required minLength={8} placeholder="Nouveau mot de passe" className="rounded-xl border border-line px-2 py-1" />
                    <button className="text-blue" type="submit">Changer</button>
                  </form>
                  <form action={deleteStudentAction}>
                    <input type="hidden" name="filtre" value={query} />
                    <input type="hidden" name="filtre_pays" value={countryId} />
                    <input type="hidden" name="filtre_ville" value={cityId} />
                    <input type="hidden" name="id" value={person.id} />
                    <button className="text-amber" type="submit">Supprimer</button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
