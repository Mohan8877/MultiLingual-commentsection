"use client"

import { CommentCard } from "./comment-card"
import { Loader2, MessageSquare } from "lucide-react"
import type { Comment } from "@/lib/models/comment"

interface CommentsListProps {
  comments: Comment[]
  loading: boolean
  onCommentUpdate: (commentId: string, updatedComment: Comment | null) => void
}

export function CommentsList({ comments, loading, onCommentUpdate }: CommentsListProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading comments...
        </div>
      </div>
    )
  }

  if (comments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <MessageSquare className="w-12 h-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">No comments yet</h3>
        <p className="text-muted-foreground">Be the first to share your thoughts!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <CommentCard
          key={comment._id!.toString()}
          comment={comment}
          onCommentUpdate={(updatedComment) => onCommentUpdate(comment._id!.toString(), updatedComment)}
        />
      ))}
    </div>
  )
}
