import { type NextRequest, NextResponse } from "next/server"
import { dbOps } from "@/lib/database-operations"
import { getClientIP } from "@/lib/ip-utils"
import { socketEmitter } from "@/lib/socket-emitter"



export async function POST(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params; // ✅ this works
    const clientIP = getClientIP(request);

    const updatedComment = await dbOps.likeComment(id, clientIP);

    return new Response(JSON.stringify(updatedComment), { status: 200 });
  } catch (err: any) {
    console.error("Like comment error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

