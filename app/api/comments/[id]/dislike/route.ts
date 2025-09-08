import { type NextRequest } from "next/server";
import { dbOps } from "@/lib/database-operations";
import { getClientIP } from "@/lib/ip-utils";


export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> } // 🔧 params is a Promise
) {
  try {
    const { id } = await context.params; // 🔧 await here
    const clientIP = getClientIP(request);

    const updatedComment = await dbOps.dislikeComment(id, clientIP);

    // Optionally emit socket event
    

    return new Response(JSON.stringify(updatedComment), { status: 200 });
  } catch (err: any) {
    console.error("Dislike comment error:", err);
    return new Response(
      JSON.stringify({ error: err.message || "Failed to dislike comment" }),
      { status: 500 }
    );
  }
}
