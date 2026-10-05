import { createHash, createHmac, timingSafeEqual } from "crypto";
import { createServer } from "http";
import fs from "fs";
import path from "path";
import next from "next";

const port = Number(process.env.PORT || 3000);
const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "0.0.0.0";

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();
const signal = path.join(process.cwd(), "data", "live.signal");

function sessionOk(cookieHeader) {
  const secret = process.env.SESSION_SECRET;
  if (!secret || !cookieHeader) return false;
  const match = cookieHeader.match(/(?:^|; )parcours_session=([^;]+)/);
  if (!match) return false;
  let token = match[1];
  try {
    token = decodeURIComponent(token);
  } catch {
    return false;
  }
  const [id, exp, signature] = token.split(".");
  if (!id || !exp || !signature || !/^\d+$/.test(id) || !/^\d+$/.test(exp)) return false;
  if (Number(exp) < Date.now()) return false;
  const expected = createHmac("sha256", secret).update(`${id}.${exp}`).digest("hex");
  const left = Buffer.from(signature);
  const right = Buffer.from(expected);
  return left.length === right.length && timingSafeEqual(left, right);
}

await app.prepare();

const server = createServer((req, res) => {
  handle(req, res);
});

const clients = new Set();

function frame(payload, opcode) {
  const length = payload.length;
  const header = length < 126 ? Buffer.from([opcode, length]) : Buffer.alloc(4);
  if (length >= 126) {
    header[0] = opcode;
    header[1] = 126;
    header.writeUInt16BE(length, 2);
  }
  return Buffer.concat([header, payload]);
}

function accept(socket) {
  let buffer = Buffer.alloc(0);
  clients.add(socket);
  socket.on("data", (chunk) => {
    buffer = Buffer.concat([buffer, chunk]);
    while (buffer.length >= 2) {
      const opcode = buffer[0] & 0x0f;
      const masked = (buffer[1] & 0x80) !== 0;
      let length = buffer[1] & 0x7f;
      let offset = 2;
      if (length === 126) {
        if (buffer.length < 4) return;
        length = buffer.readUInt16BE(2);
        offset = 4;
      } else if (length === 127) {
        socket.destroy();
        return;
      }
      const maskLength = masked ? 4 : 0;
      if (buffer.length < offset + maskLength + length) return;
      const payload = Buffer.from(buffer.subarray(offset + maskLength, offset + maskLength + length));
      if (masked) {
        const mask = buffer.subarray(offset, offset + 4);
        for (let index = 0; index < payload.length; index += 1) payload[index] ^= mask[index];
      }
      buffer = buffer.subarray(offset + maskLength + length);
      if (opcode === 8) {
        socket.end(frame(payload, 0x88));
        clients.delete(socket);
        return;
      }
      if (opcode === 9) socket.write(frame(payload, 0x8a));
    }
  });
  socket.on("close", () => clients.delete(socket));
  socket.on("error", () => clients.delete(socket));
}

function push() {
  const payload = frame(Buffer.from(JSON.stringify({ type: "chat" })), 0x81);
  for (const client of clients) {
    if (!client.destroyed) client.write(payload);
  }
}

globalThis.__parcoursBroadcast = push;
fs.mkdirSync(path.dirname(signal), { recursive: true });
if (!fs.existsSync(signal)) fs.writeFileSync(signal, "0");
fs.watch(signal, () => push());

server.on("upgrade", (req, socket) => {
  const pathname = new URL(req.url ?? "/", "http://localhost").pathname;
  if (pathname !== "/ws") return;
  if (!sessionOk(req.headers.cookie)) {
    socket.write("HTTP/1.1 401 Unauthorized\r\nConnection: close\r\n\r\n");
    socket.destroy();
    return;
  }
  const key = req.headers["sec-websocket-key"];
  if (!key) {
    socket.destroy();
    return;
  }
  const digest = createHash("sha1")
    .update(`${key}258EAFA5-E914-47DA-95CA-C5AB0DC85B11`)
    .digest("base64");
  socket.write(
    "HTTP/1.1 101 Switching Protocols\r\n" +
      "Upgrade: websocket\r\n" +
      "Connection: Upgrade\r\n" +
      `Sec-WebSocket-Accept: ${digest}\r\n\r\n`,
  );
  accept(socket);
});

server.listen(port, hostname, () => {
  console.log(`> Parcourstudent sur http://localhost:${port}`);
});
