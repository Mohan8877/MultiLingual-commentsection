import { NextRequest } from "next/server"

export function getClientIP(req: NextRequest): string {
  // Check common headers set by reverse proxies (like Vercel, Nginx, etc.)
  const forwardedFor = req.headers.get("x-forwarded-for")
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim()
  }

  const realIP = req.headers.get("x-real-ip")
  if (realIP) {
    return realIP
  }

  // Fallback to Next.js provided IP or localhost
  return req.ip ?? "127.0.0.1"
}

export async function getLocationFromIP(ip: string) {
  try {
    // Local dev fallback
    if (ip === "127.0.0.1" || ip === "::1") {
      return { city: "Localhost", country: "Local Development" }
    }

    // Free API for IP geolocation
    const res = await fetch(`https://ipapi.co/${ip}/json/`, { cache: "no-store" })
    if (!res.ok) {
      throw new Error("Failed to fetch location")
    }

    const data = await res.json()

    return {
      city: data.city || "Unknown",
      country: data.country_name || "Unknown",
    }
  } catch (err) {
    console.error("IP location lookup failed:", err)
    return { city: "Unknown", country: "Unknown" }
  }
}
