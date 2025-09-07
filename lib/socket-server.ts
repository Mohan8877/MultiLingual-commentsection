import type { Server as NetServer } from "http"
import type { NextApiResponse } from "next"
import { Server as ServerIO } from "socket.io"
import type { Comment } from "./models/comment"

export type NextApiResponseServerIO = NextApiResponse & {
  socket: {
    server: NetServer & {
      io: ServerIO
    }
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}

export function initializeSocket(server: NetServer): ServerIO {
  const io = new ServerIO(server, {
    path: "/api/socket",
    addTrailingSlash: false,
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  })

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id)

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id)
    })

    socket.on("join-comments", () => {
      socket.join("comments-room")
      console.log("Client joined comments room:", socket.id)
    })

    socket.on("leave-comments", () => {
      socket.leave("comments-room")
      console.log("Client left comments room:", socket.id)
    })
  })

  return io
}

// Socket event types
export interface SocketEvents {
  "comment:new": (comment: Comment) => void
  "comment:updated": (comment: Comment) => void
  "comment:deleted": (commentId: string) => void
  "comment:liked": (comment: Comment) => void
  "comment:disliked": (comment: Comment) => void
}

export function emitCommentEvent(io: ServerIO, event: keyof SocketEvents, data: any) {
  io.to("comments-room").emit(event, data)
}
