import type { ObjectId } from "mongodb"

export interface Comment {
  _id?: ObjectId
  username: string
  content: string
  originalLanguage?: string
  city: string
  country: string
  ipAddress: string
  likes: number
  dislikes: number
  likedBy: string[] // Array of user IPs who liked
  dislikedBy: string[] // Array of user IPs who disliked
  createdAt: Date
  updatedAt: Date
}

export interface Translation {
  _id?: ObjectId
  commentId: ObjectId
  originalText: string
  translatedText: string
  targetLanguage: string
  sourceLanguage: string
  createdAt: Date
}

// Validation regex - only allow letters, numbers, spaces, and basic punctuation
export const COMMENT_VALIDATION_REGEX = /^[a-zA-Z0-9\s.,!?'"()-]+$/

export function validateComment(content: string): boolean {
  if (!content || content.trim().length === 0) return false
  if (content.length > 500) return false
  return COMMENT_VALIDATION_REGEX.test(content)
}

export function validateUsername(username: string): boolean {
  if (!username || username.trim().length === 0) return false
  if (username.length > 50) return false
  return /^[a-zA-Z0-9_-]+$/.test(username)
}
