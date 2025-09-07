"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { apiClient } from "@/lib/api-client"
import { Loader2, MessageSquare } from "lucide-react"
import type { Comment } from "@/lib/models/comment"

interface CommentFormProps {
  onCommentAdded: (comment: Comment) => void
}

export function CommentForm({ onCommentAdded }: CommentFormProps) {
  const [username, setUsername] = useState("")
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!username.trim() || !content.trim()) {
      setError("Please fill in all fields")
      return
    }

    setIsSubmitting(true)

    try {
      const newComment = await apiClient.createComment(username.trim(), content.trim())
      onCommentAdded(newComment)
      setContent("")
      setUsername("")
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to post comment")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="bg-card border-border shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-card-foreground">
          <MessageSquare className="w-5 h-5 text-primary" />
          Share Your Thoughts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              placeholder="Your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-input border-border text-foreground placeholder:text-muted-foreground"
              maxLength={50}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <Textarea
              placeholder="Write your comment here... (letters, numbers, spaces, and basic punctuation only)"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="bg-input border-border text-foreground placeholder:text-muted-foreground min-h-[100px] resize-none"
              maxLength={500}
              disabled={isSubmitting}
            />
            <div className="text-xs text-muted-foreground mt-1 text-right">{content.length}/500</div>
          </div>

          {error && (
            <div className="text-destructive text-sm bg-destructive/10 p-3 rounded-md border border-destructive/20">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={isSubmitting || !username.trim() || !content.trim()}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Posting...
              </>
            ) : (
              "Post Comment"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
