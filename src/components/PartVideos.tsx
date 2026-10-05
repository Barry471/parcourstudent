import type { Video } from "@/lib/db";
import { youtubeId } from "@/lib/videos";

const names: Record<string, string> = {
  youtube: "YouTube",
  tiktok: "TikTok",
  facebook: "Facebook",
  instagram: "Instagram",
};

export function PartVideos({ videos }: { videos: Video[] }) {
  if (videos.length === 0) return null;
  return (
    <section className="mt-8">
      <h2 className="font-serif text-2xl">Vidéos de cette partie</h2>
      <ul className="mt-3 grid gap-4">
        {videos.map((video) => {
          const id = video.platform === "youtube" ? youtubeId(video.url) : null;
          return (
            <li key={video.id} className="overflow-hidden rounded-2xl border border-line bg-card">
              {id ? (
                <iframe
                  className="aspect-video w-full"
                  src={`https://www.youtube-nocookie.com/embed/${id}`}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : null}
              <a className="block px-4 py-3 text-sm" href={video.url} target="_blank" rel="noreferrer">
                <span className="text-xs uppercase text-muted">{names[video.platform] ?? video.platform}</span>
                <span className="mt-1 block font-medium text-blue">{video.title}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
