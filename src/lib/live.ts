import fs from "fs";
import path from "path";

const signal = path.join(process.cwd(), "data", "live.signal");

export function broadcastChat() {
  const notify = (globalThis as { __parcoursBroadcast?: () => void }).__parcoursBroadcast;
  if (notify) {
    notify();
    return;
  }
  fs.mkdirSync(path.dirname(signal), { recursive: true });
  fs.writeFileSync(signal, String(Date.now()));
}
