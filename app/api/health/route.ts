import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"

export async function GET() {
  try {
    // Test database connection
    const db = await getDatabase()
    await db.admin().ping()

    return NextResponse.json({
      success: true,
      status: "healthy",
      timestamp: new Date().toISOString(),
      services: {
        database: "connected",
        api: "operational",
      },
    })
  } catch (error) {
    console.error("Health check failed:", error)
    return NextResponse.json(
      {
        success: false,
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: "Database connection failed",
      },
      { status: 503 },
    )
  }
}
