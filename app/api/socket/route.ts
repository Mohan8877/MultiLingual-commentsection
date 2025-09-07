import { type NextRequest, NextResponse } from "next/server"
import { Server as NetServer } from "http"
import { Server as ServerIO } from "socket.io"

let io: ServerIO | undefined

export async function GET(request: NextRequest) {
  if (!io) {
    // Initialize Socket.IO server
    const httpServer = new NetServer()
    io = new ServerIO(httpServer, {
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
  }

  return NextResponse.json({ success: true, message: "Socket.IO initialized" })
}

export { io }
