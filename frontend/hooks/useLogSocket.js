"use client";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

// status: "connecting" | "connected" | "disconnected"
export default function useLogSocket({ enabled = true, onNewLogs }) {
  const [status, setStatus] = useState("disconnected");
  const socketRef = useRef(null);

  useEffect(() => {
    if (!enabled) {
      socketRef.current?.disconnect();
      setStatus("disconnected");
      return;
    }

    const token = document.cookie
      .split(";")
      .find((c) => c.trim().startsWith("accessToken="))
      ?.split("=")[1];

    const BACKEND_URL =
      process.env.NEXT_PUBLIC_BACKEND_URL || "http://192.168.1.100:3021";

    setStatus("connecting");
    const socket = io(BACKEND_URL, {
      auth: { token },
      withCredentials: true,
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 2000,
      reconnectionAttempts: 10,
    });

    socket.on("connect", () => setStatus("connected"));
    socket.on("disconnect", () => setStatus("disconnected"));
    socket.on("connect_error", (err) => {
      console.error("[Socket] Connect error:", err.message);
      setStatus("disconnected");
    });

    socket.on("new-log", (entries) => {
      if (onNewLogs) onNewLogs(Array.isArray(entries) ? entries : [entries]);
    });

    socketRef.current = socket;
    return () => {
      socket.disconnect();
      setStatus("disconnected");
    };
  }, [enabled]);

  return { status };
}
