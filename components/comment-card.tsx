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
          commentText: comment.content,
          targetLanguage,
        }),
      })

      const data = await response.json()
      if (data.translatedText) {
        setTranslatedText(data.translatedText)
        setSourceLanguage("auto")
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
    <Card className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 border border-purple-100/40 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <CommentAvatar username={comment.username} />

          <div className="flex-1 min-w-0">
            {/* Username + Location */}
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h4 className="font-semibold text-sm text-indigo-700">
                {comment.username}
              </h4>

              {/* ✅ Location (only if available) */}
              {(comment.city || comment.country) && (
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <MapPin className="w-3 h-3 text-pink-500" />
                  <p className="text-sm text-gray-500">
                    {comment.city ?? "Unknown"},{" "}
                    {comment.country ?? "Unknown"}
                  </p>
                </div>
              )}
            </div>

            <div className="text-xs text-gray-400 mb-3">
              {formatDate(comment.createdAt)}
            </div>

            {/* Comment Content */}
            <div className="mb-4">
              <p className="text-sm text-gray-800 leading-relaxed">
                {showTranslation ? translatedText : comment.content}
              </p>

              {showTranslation && (
                <div className="mt-2 text-xs text-indigo-500 italic">
                  {`Translated → ${targetLanguage.toUpperCase()}`}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowTranslation(false)}
                    className="ml-2 h-auto p-0 text-xs text-indigo-600 hover:text-indigo-400"
                  >
                    Show original
                  </Button>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-5">
              {/* Like / Dislike */}
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLike}
                  disabled={isLiking}
                  className="h-8 px-3 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg"
                >
                  {isLiking ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Heart className="w-4 h-4" />
                  )}
                  <span className="ml-1 text-xs">{comment.likes}</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDislike}
                  disabled={isDisliking}
                  className="h-8 px-3 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                >
                  {isDisliking ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <HeartOff className="w-4 h-4" />
                  )}
                  <span className="ml-1 text-xs">{comment.dislikes}</span>
                </Button>
              </div>

              {/* Translate */}
              <div className="flex items-center gap-2">
                <select
                  value={targetLanguage}
                  onChange={(e) => setTargetLanguage(e.target.value)}
                  className="text-xs bg-white/70 border border-gray-200 rounded-md px-2 py-1 shadow-sm focus:ring-2 focus:ring-indigo-300"
                >
                  <option value="en">English</option>
                  <option value="hi">Hindi</option>
                  <option value="te">Telugu</option>
                  <option value="ta">Tamil</option>
                  <option value="kn">Kannada</option>
                  <option value="ml">Malayalam</option>
                  <option value="bn">Bengali</option>
                  <option value="mr">Marathi</option>
                  <option value="gu">Gujarati</option>
                  <option value="pa">Punjabi</option>
                  <option value="ur">Urdu</option>
                  <option value="or">Odia</option>
                  <option value="as">Assamese</option>
                  <option value="ks">Kashmiri</option>
                  <option value="mai">Maithili</option>
                  <option value="sd">Sindhi</option>
                  <option value="sa">Sanskrit</option>
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
                  className="h-8 px-3 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"
                >
                  {isTranslating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Languages className="w-4 h-4" />
                  )}
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
