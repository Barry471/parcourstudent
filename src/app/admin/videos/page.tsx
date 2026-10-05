import { addVideoAction, deleteVideoAction } from "@/lib/actions";
import { candidatures } from "@/lib/candidatures";
import { demarches } from "@/lib/demarches";
import { allVideos } from "@/lib/db";

const names: Record<string, string> = { youtube: "YouTube", tiktok: "TikTok", facebook: "Facebook", instagram: "Instagram" };

export default function VideosPage() {
  const videos = allVideos();
  const steps = [
    ...candidatures.flatMap((item) => item.steps.map((step) => ({ id: step.id, title: `${item.menu} — ${step.title}` }))),
    ...demarches.flatMap((item) => item.steps.map((step) => ({ id: step.id, title: `${item.menu} — ${step.title}` }))),
  ];
  const label = (kind: string, target: string) => {
    if (kind === "step") return steps.find((step) => step.id === target)?.title ?? target;
    if (kind === "candidature") return candidatures.find((item) => item.id === target)?.menu ?? target;
    return demarches.find((item) => item.id === target)?.menu ?? target;
  };
  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <h1 className="font-serif text-4xl">Vidéos</h1>
      <p className="mt-2 text-muted">
        Choisis la page, ou une étape précise. YouTube, TikTok, Facebook ou Instagram. Une personne volontaire peut enregistrer la vidéo : tu publies seulement le lien.
      </p>
      <form action={addVideoAction} className="mt-6 grid gap-3 rounded-2xl border border-line bg-card p-4">
        <select name="place" required className="rounded-2xl border border-line px-3 py-2" defaultValue="candidature:campus-france">
          <optgroup label="Candidatures">
            {candidatures.map((item) => (
              <option key={item.id} value={`candidature:${item.id}`}>{item.menu}</option>
            ))}
          </optgroup>
          <optgroup label="Chaque étape d'une candidature">
            {candidatures.flatMap((item) => item.steps.map((step) => (
              <option key={step.id} value={`step:${step.id}`}>{item.menu} — {step.title}</option>
            )))}
          </optgroup>
          <optgroup label="Démarches">
            {demarches.map((item) => (
              <option key={item.id} value={`demarche:${item.id}`}>{item.menu}</option>
            ))}
          </optgroup>
          <optgroup label="Chaque étape d'une démarche">
            {demarches.flatMap((item) => item.steps.map((step) => (
              <option key={step.id} value={`step:${step.id}`}>{item.menu} — {step.title}</option>
            )))}
          </optgroup>
        </select>
        <input name="title" required placeholder="Titre de la vidéo" className="rounded-2xl border border-line px-3 py-2" />
        <input name="url" required type="url" placeholder="https://www.youtube.com/..., TikTok ou Facebook" className="rounded-2xl border border-line px-3 py-2" />
        <button className="rounded-full bg-blue px-4 py-2 text-sm text-paper" type="submit">Publier la vidéo</button>
      </form>
      <ul className="mt-6 divide-y divide-line rounded-2xl border border-line bg-card">
        {videos.map((video) => (
          <li key={video.id} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
            <span>{label(video.kind, video.target)} · {names[video.platform]} · {video.title}</span>
            <form action={deleteVideoAction}>
              <input type="hidden" name="id" value={video.id} />
              <button className="text-amber" type="submit">Retirer</button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
