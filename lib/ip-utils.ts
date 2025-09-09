import { NextRequest } from "next/server"



export async function getClientIP(req: any): Promise<string> {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0];
  }
  return "127.0.0.1"; // fallback (localhost)
}

export async function getLocationFromIP(ip: string) {
  try {
    // Replace localhost with a demo IP (Chittoor, India) for testing
    const queryIP =
      ip === "127.0.0.1" || ip.startsWith("::1")
        ? "103.144.170.15"
        : ip;

    const response = await fetch(
      `https://ipinfo.io/${queryIP}?token=${process.env.IPINFO_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch location: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      city: data.city || "Unknown",
      country: data.country || "Unknown",
    };
  } catch (error) {
    console.error("Error fetching location:", error);
    return { city: "Unknown", country: "Unknown" };
  }
}
