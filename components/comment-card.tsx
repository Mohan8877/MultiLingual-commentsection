"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CommentAvatar } from "./comment-avatar"
import { Heart, HeartOff, Languages, MapPin, Loader2 } from "lucide-react"
import type { Comment } from "@/lib/models/comment"

interface CommentCardProps {
  comment: Comment
  onCommentUpdate: (updatedComment: Comment | null) => void
}

export function CommentCard({ comment, onCommentUpdate }: CommentCardProps) {
  const [isLiking, setIsLiking] = useState(false)
  const [isDisliking, setIsDisliking] = useState(false)
  const [isTranslating, setIsTranslating] = useState(false)
  const [translatedText, setTranslatedText] = useState("")
  const [showTranslation, setShowTranslation] = useState(false)
  const [targetLanguage, setTargetLanguage] = useState("en")
  const [sourceLanguage, setSourceLanguage] = useState("")

  const handleLike = async () => {
    setIsLiking(true)
    try {
      const updatedComment = await fetch(`/api/comments/${comment._id}/like`, {
        method: "POST",
      }).then((res) => res.json())
      onCommentUpdate(updatedComment)
    } catch (error) {
      console.error("Failed to like comment:", error)
    } finally {
      setIsLiking(false)
    }
  }

  const handleDislike = async () => {
    setIsDisliking(true)
    try {
      const updatedComment = await fetch(`/api/comments/${comment._id}/dislike`, {
        method: "POST",
      }).then((res) => res.json())
      onCommentUpdate(updatedComment)
    } catch (error) {
      console.error("Failed to dislike comment:", error)
    } finally {
      setIsDisliking(false)
    }
  }

  const handleTranslate = async () => {
    setIsTranslating(true)
    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          commentText: comment.content, // ✅ send actual text
          targetLanguage,
        }),
      })

      const data = await response.json()
      if (data.translatedText) {
        setTranslatedText(data.translatedText)
        setSourceLanguage("auto") // fallback since API doesn’t return it
        setShowTranslation(true)
      }
    } catch (error) {
      console.error("Failed to translate comment:", error)
    } finally {
      setIsTranslating(false)
    }
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Card className="bg-card border-border shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <CommentAvatar username={comment.username} />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-card-foreground text-sm">{comment.username}</h4>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="w-3 h-3" />
                {comment.city}, {comment.country}
              </div>
            </div>

            <div className="text-xs text-muted-foreground mb-3">{formatDate(comment.createdAt)}</div>

            <div className="mb-4">
              <p className="text-card-foreground text-sm leading-relaxed text-pretty">
                {showTranslation ? translatedText : comment.content}
              </p>

              {showTranslation && (
                <div className="mt-2 text-xs text-muted-foreground italic">
                  {`Translated → ${targetLanguage.toUpperCase()}`}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowTranslation(false)}
                    className="ml-2 h-auto p-0 text-xs text-primary hover:text-primary/80"
                  >
                    Show original
                  </Button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4">
              {/* Like/Dislike */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLike}
                  disabled={isLiking}
                  className="h-8 px-2 text-muted-foreground hover:text-green-600 hover:bg-green-50"
                >
                  {isLiking ? <Loader2 className="w-4 h-4 animate-spin" /> : <Heart className="w-4 h-4" />}
                  <span className="ml-1 text-xs">{comment.likes}</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDislike}
                  disabled={isDisliking}
                  className="h-8 px-2 text-muted-foreground hover:text-red-600 hover:bg-red-50"
                >
                  {isDisliking ? <Loader2 className="w-4 h-4 animate-spin" /> : <HeartOff className="w-4 h-4" />}
                  <span className="ml-1 text-xs">{comment.dislikes}</span>
                </Button>
              </div>

              {/* Translate */}
              <div className="flex items-center gap-2">
                <select
                  value={targetLanguage}
                  onChange={(e) => setTargetLanguage(e.target.value)}
                  className="text-xs bg-input border-border rounded px-2 py-1 text-foreground"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="it">Italian</option>
                  <option value="pt">Portuguese</option>
                  <option value="ru">Russian</option>
                  <option value="ja">Japanese</option>
                  <option value="ko">Korean</option>
                  <option value="zh">Chinese</option>
                </select>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleTranslate}
                  disabled={isTranslating}
                  className="h-8 px-2 text-muted-foreground hover:text-primary hover:bg-primary/10"
                >
                  {isTranslating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Languages className="w-4 h-4" />}
                  <span className="ml-1 text-xs">Translate</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
