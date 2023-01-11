import { Server as IOServer, Socket as IOSocket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

import { ClientToServerEvents, SocketData } from "../types/socket/server";
import { setupControllerEvents } from "./controller";

import { authMiddleware } from "./middleware";

export type Server = IOServer<
  ClientToServerEvents,
  DefaultEventsMap,
  DefaultEventsMap,
  SocketData
>;

export type Socket = IOSocket<
  ClientToServerEvents,
  DefaultEventsMap,
  DefaultEventsMap,
  SocketData
>;

const initializeSocket = (server: any): Server => {
  const io: Server = new IOServer(server, {
    ...(process.env.NODE_ENV !== "production"
      ? {
          cors: {
            origin: "*",
          },
        }
      : {}),
  });

  io.use((socket, next) => {
    authMiddleware(io, socket)
      .then(() => next())
      .catch((err) => {
        console.error(err);
        next(err);
      });
  });

  io.on("connection", async (socket) => {
    const data = socket.data as SocketData;
    if (!data.playlist) return;
    socket.join(data.type);

    if (data.type === "controller") {
      setupControllerEvents(socket);
    }
  });
  return io;
};

export default initializeSocket;
