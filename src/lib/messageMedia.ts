import fs from "fs";
import path from "path";

const dir = path.join(process.cwd(), "data", "message-media");

function filePath(id: number) {
  if (!Number.isInteger(id) || id <= 0) return "";
  const file = path.join(dir, String(id));
  if (!file.startsWith(dir + path.sep)) return "";
  return file;
}

export function saveMessageMedia(id: number, bytes: Buffer) {
  const file = filePath(id);
  if (!file) return;
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(file, bytes);
}

export function readMessageMedia(id: number) {
  const file = filePath(id);
  if (!file || !fs.existsSync(file)) return null;
  return fs.readFileSync(file);
}

export function removeMessageMedia(id: number) {
  const file = filePath(id);
  if (file && fs.existsSync(file)) fs.unlinkSync(file);
}
