"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";

export function ChatRoom({ children }: { children: ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const fil = document.getElementById("fil");
    if (!fil) return;
    const nearBottom = fil.scrollHeight - fil.scrollTop - fil.clientHeight < 140;
    if (nearBottom || fil.dataset.ready !== "1") {
      fil.scrollTop = fil.scrollHeight;
      fil.dataset.ready = "1";
    }
  });

  useEffect(() => {
    let socket: WebSocket | null = null;
    let stopped = false;
    let retry = 0;

    const connect = () => {
      const protocol = window.location.protocol === "https:" ? "wss" : "ws";
      socket = new WebSocket(`${protocol}://${window.location.host}/ws`);
      socket.onmessage = (event) => {
        if (!event.data.includes("\"chat\"")) return;
        const typing = document.activeElement?.getAttribute("name") === "body";
        if (!typing && document.visibilityState === "visible") router.refresh();
      };
      socket.onclose = () => {
        if (!stopped) retry = window.setTimeout(connect, 1500);
      };
    };

    connect();
    return () => {
      stopped = true;
      window.clearTimeout(retry);
      socket?.close();
    };
  }, [router]);

  return children;
}
