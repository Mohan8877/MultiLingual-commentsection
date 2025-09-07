import type { NextRequest } from "next/server"

export function getClientIP(request: NextRequest): string {
  // Try to get IP from various headers (for different hosting environments)
  const forwarded = request.headers.get("x-forwarded-for")
  const realIP = request.headers.get("x-real-ip")
  const cfConnectingIP = request.headers.get("cf-connecting-ip")

  if (forwarded) {
    return forwarded.split(",")[0].trim()
  }

  if (realIP) {
    return realIP
  }

  if (cfConnectingIP) {
    return cfConnectingIP
  }

  // Fallback to default IP if none of the headers are present
  return "127.0.0.1"
}
export async function getLocationFromIP(ip: string) {
  if (ip === '127.0.0.1' || ip === '::1') {
    // Local development fallback
    return { city: 'Localhost', country: 'Localhost' };
  }

  try {
    const response = await fetch(`https://ipapi.co/${ip}/json/`);
    if (!response.ok) throw new Error('Failed to fetch location');
    return await response.json();
  } catch (err) {
    console.warn('Location fetch failed, returning fallback', err);
    return { city: 'Unknown', country: 'Unknown' };
  }
}


