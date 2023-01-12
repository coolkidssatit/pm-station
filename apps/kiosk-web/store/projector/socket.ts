import { AuthParam } from "kiosk-socket/types";
import { io } from "socket.io-client";
import { ClientSocket, projectorStore } from "./store";

export const initializeSocket = (endpoint: string) => {
  const auth: AuthParam = {
    type: "display",
  };
  const socket: ClientSocket = io(endpoint, {
    auth,
  });

  projectorStore.setState({ socket });
  socket.onAny((...args) => console.log("Socket Received:", args));
  socket.on("connect", () => {
    console.log("Connected to socket server.");
  });
  socket.on("play", (track) =>
    projectorStore.setState({ currentTrack: track })
  );
  socket.on("stop", () => projectorStore.setState({ currentTrack: undefined }));
};