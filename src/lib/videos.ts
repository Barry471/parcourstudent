const hosts: Record<string, string[]> = {
  youtube: ["youtube.com", "www.youtube.com", "m.youtube.com", "youtu.be"],
  tiktok: ["tiktok.com", "www.tiktok.com", "vm.tiktok.com"],
  facebook: ["facebook.com", "www.facebook.com", "m.facebook.com", "fb.watch"],
  instagram: ["instagram.com", "www.instagram.com"],
};

export function videoPlatform(url: string) {
  try {
    const host = new URL(url).hostname;
    return Object.entries(hosts).find(([, list]) => list.includes(host))?.[0] ?? "";
  } catch {
    return "";
  }
}

export function youtubeId(url: string) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname === "youtu.be") return parsed.pathname.slice(1).split("/")[0] || null;
    if (parsed.pathname.startsWith("/shorts/")) return parsed.pathname.split("/")[2] || null;
    if (parsed.pathname.startsWith("/embed/")) return parsed.pathname.split("/")[2] || null;
    return parsed.searchParams.get("v");
  } catch {
    return null;
  }
}
