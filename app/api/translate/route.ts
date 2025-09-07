import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { commentText, targetLanguage } = await req.json();

    const url = `https://free-google-translator.p.rapidapi.com/external-api/free-google-translator?from=auto&to=${targetLanguage}&query=${encodeURIComponent(
      commentText
    )}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "x-rapidapi-key": process.env.RAPIDAPI_KEY!, // ✅ store in .env
        "x-rapidapi-host": "free-google-translator.p.rapidapi.com",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ translate: "rapidapi" }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Translation API error: ${response.status} ${errorText}`
      );
    }

    const data = await response.json();
    console.log("🌍 API Response:", data);

    // ✅ FIX: return the response properly
    return new Response(
      JSON.stringify({
        translatedText: data.translation || data.translated_text || data.result || "N/A",
        language: targetLanguage,
      }),
      { status: 200 }
    );

  } catch (err: any) {
    console.error("Translation error:", err);
    return new Response(
      JSON.stringify({ error: err.message || "Translation failed" }),
      { status: 500 }
    );
  }
}
