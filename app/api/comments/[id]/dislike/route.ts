import { type NextRequest, NextResponse } from "next/server"
import { dbOps } from "@/lib/database-operations"
import { getClientIP } from "@/lib/ip-utils"
import { socketEmitter } from "@/lib/socket-emitter"



export async function POST(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params; // ✅ get comment id
    const clientIP = getClientIP(request);

    const updatedComment = await dbOps.dislikeComment(id, clientIP);

    return new Response(JSON.stringify(updatedComment), { status: 200 });
  } catch (err: any) {
    console.error("Dislike comment error:", err);
    return new Response(
      JSON.stringify({ error: err.message || "Failed to dislike comment" }),
      { status: 500 }
    );
  }
}
