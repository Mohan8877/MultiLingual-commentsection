"use client"

import { useEffect, useRef, useState } from "react"
import { io, type Socket } from "socket.io-client"
import type { Comment } from "@/lib/models/comment"

interface SocketEvents {
  "comment:new": (comment: Comment) => void
  "comment:updated": (comment: Comment) => void
  "comment:deleted": (commentId: string) => void
}

export function useSocket() {
  const socketRef = useRef<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io({
      path: "/api/socket",
      addTrailingSlash: false,
    })

    const socket = socketRef.current

    socket.on("connect", () => {
      console.log("Connected to Socket.IO server")
      setIsConnected(true)
      socket.emit("join-comments")
    })

    socket.on("disconnect", () => {
      console.log("Disconnected from Socket.IO server")
      setIsConnected(false)
    })

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error)
      setIsConnected(false)
    })

    return () => {
      if (socket) {
        socket.emit("leave-comments")
        socket.disconnect()
      }
    }
  }, [])

  const on = <T extends keyof SocketEvents>(event: T, callback: SocketEvents[T]) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback)
    }
  }

  const off = <T extends keyof SocketEvents>(event: T, callback?: SocketEvents[T]) => {
    if (socketRef.current) {
      socketRef.current.off(event, callback)
    }
  }

  return {
    socket: socketRef.current,
    isConnected,
    on,
    off,
  }
}
