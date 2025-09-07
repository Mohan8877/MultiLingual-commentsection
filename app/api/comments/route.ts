import { type NextRequest, NextResponse } from "next/server"
import { dbOps } from "@/lib/database-operations"
import { getClientIP, getLocationFromIP } from "@/lib/ip-utils"
import { validateComment, validateUsername } from "@/lib/models/comment"
import { socketEmitter } from "@/lib/socket-emitter"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const skip = Number.parseInt(searchParams.get("skip") || "0")

    const comments = await dbOps.getComments(limit, skip)

    return NextResponse.json({
      success: true,
      data: comments,
    })
  } catch (error) {
    console.error("Error fetching comments:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch comments" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, content } = body

    // Validate input
    if (!validateUsername(username)) {
      return NextResponse.json(
        { success: false, error: "Invalid username. Only letters, numbers, hyphens, and underscores allowed." },
        { status: 400 },
      )
    }

    if (!validateComment(content)) {
      return NextResponse.json(
        { success: false, error: "Invalid comment. Only letters, numbers, spaces, and basic punctuation allowed." },
        { status: 400 },
      )
    }

    // Get client IP and location
    const clientIP = getClientIP(request)
    const location = await getLocationFromIP(clientIP)

    // Create comment
    const comment = await dbOps.createComment({
      username: username.trim(),
      content: content.trim(),
      city: location.city,
      country: location.country,
      ipAddress: clientIP,
      likes: 0,
      dislikes: 0,
      likedBy: [],
      dislikedBy: [],
    })

    socketEmitter.emitNewComment(comment)

    return NextResponse.json(
      {
        success: true,
        data: comment,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating comment:", error)
    return NextResponse.json({ success: false, error: "Failed to create comment" }, { status: 500 })
  }
}
