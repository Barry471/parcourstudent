import fs from "fs";
import path from "path";

const dir = path.join(process.cwd(), "data", "infos");
const maxBytes = 4 * 1024 * 1024;

export function sniffInfo(bytes: Buffer) {
  if (bytes.length < 12 || bytes.length > maxBytes) return "";
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "image/jpeg";
  if (bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "image/png";
  if (bytes.subarray(0, 4).toString("ascii") === "RIFF" && bytes.subarray(8, 12).toString("ascii") === "WEBP") return "image/webp";
  if (bytes.subarray(0, 5).toString("ascii") === "%PDF-") return "application/pdf";
  return "";
}

export function saveInfoFile(id: number, bytes: Buffer) {
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, String(id)), bytes);
}

export function readInfoFile(id: number) {
  if (!Number.isInteger(id) || id <= 0) return null;
  const file = path.join(dir, String(id));
  if (!file.startsWith(dir + path.sep) || !fs.existsSync(file)) return null;
  return fs.readFileSync(file);
}

export function removeInfoFile(id: number) {
  if (!Number.isInteger(id) || id <= 0) return;
  const file = path.join(dir, String(id));
  if (file.startsWith(dir + path.sep) && fs.existsSync(file)) fs.unlinkSync(file);
}
