import { type NextRequest, NextResponse } from "next/server"
import { dbOps } from "@/lib/database-operations"
import { validateComment, validateUsername } from "@/lib/models/comment"
import { socketEmitter } from "@/lib/socket-emitter"
import { getClientIP, getLocationFromIP } from "@/lib/ip-utils";

// 🔹 Fetch all comments
export async function GET() {
  try {
    const comments = await dbOps.getComments()
    return NextResponse.json({ success: true, data: comments }, { status: 200 })
  } catch (error) {
    console.error("Error loading comments:", error)
    return NextResponse.json({ success: false, error: "Failed to load comments" }, { status: 500 })
  }
}

// 🔹 Create a new comment


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, content } = body;

    // Get IP + Location
    const clientIP = await getClientIP(request);
    const location = await getLocationFromIP(clientIP);

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
    });

    socketEmitter.emitNewComment(comment);

    return NextResponse.json({ success: true, data: comment }, { status: 201 });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create comment" },
      { status: 500 }
    );
  }
}
