"use client"

import { useState, useEffect } from "react"
import { CommentForm } from "./comment-form"
import { CommentsList } from "./comments-list"
import { apiClient } from "@/lib/api-client"
import { useSocket } from "@/hooks/use-socket"
import type { Comment } from "@/lib/models/comment"
import { Wifi, WifiOff } from "lucide-react"

export function CommentSystem() {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const { isConnected, on, off } = useSocket()

  useEffect(() => {
    loadComments()
  }, [])

  useEffect(() => {
    const handleNewComment = (newComment: Comment) => {
      setComments((prev) => [newComment, ...prev])
    }

    const handleCommentUpdated = (updatedComment: Comment) => {
      setComments((prev) =>
        prev.map((comment) => (comment._id!.toString() === updatedComment._id!.toString() ? updatedComment : comment)),
      )
    }

    const handleCommentDeleted = (commentId: string) => {
      setComments((prev) => prev.filter((comment) => comment._id!.toString() !== commentId))
    }

    on("comment:new", handleNewComment)
    on("comment:updated", handleCommentUpdated)
    on("comment:deleted", handleCommentDeleted)

    return () => {
      off("comment:new", handleNewComment)
      off("comment:updated", handleCommentUpdated)
      off("comment:deleted", handleCommentDeleted)
    }
  }, [on, off])

  const loadComments = async () => {
    try {
      setLoading(true)
      const fetchedComments = await apiClient.getComments()
      setComments(fetchedComments)
    } catch (err: any) {
      setError("Failed to load comments")
      console.error("Error loading comments:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleCommentAdded = (newComment: Comment) => {
    // Real-time updates will handle this via Socket.IO
    // This is kept as fallback for when socket is disconnected
    if (!isConnected) {
      setComments((prev) => [newComment, ...prev])
    }
  }

  const handleCommentUpdate = (commentId: string, updatedComment: Comment | null) => {
    // Real-time updates will handle this via Socket.IO
    // This is kept as fallback for when socket is disconnected
    if (!isConnected) {
      if (updatedComment === null) {
        setComments((prev) => prev.filter((comment) => comment._id!.toString() !== commentId))
      } else {
        setComments((prev) => prev.map((comment) => (comment._id!.toString() === commentId ? updatedComment : comment)))
      }
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <h1 className="text-3xl font-bold text-foreground">Global Comments</h1>
          <div className="flex items-center gap-1">
            {isConnected ? (
              <Wifi className="w-5 h-5 text-green-500" title="Connected - Real-time updates active" />
            ) : (
              <WifiOff className="w-5 h-5 text-red-500" title="Disconnected - Manual refresh needed" />
            )}
          </div>
        </div>
        <p className="text-muted-foreground">
          Share your thoughts with the world in any language
          {isConnected && <span className="text-green-600"> • Live updates enabled</span>}
        </p>
      </div>

      <CommentForm onCommentAdded={handleCommentAdded} />

      {error && (
        <div className="text-destructive text-sm bg-destructive/10 p-3 rounded-md border border-destructive/20 text-center">
          {error}
        </div>
      )}

      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Recent Comments ({comments.length})</h2>
        <CommentsList comments={comments} loading={loading} onCommentUpdate={handleCommentUpdate} />
      </div>
    </div>
  )
}
