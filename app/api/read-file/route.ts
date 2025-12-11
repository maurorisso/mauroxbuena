import { NextRequest, NextResponse } from "next/server";
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const { path } = await request.json();
  console.log("[read-file] input path", path);

  if (!path || typeof path !== "string") {
    return NextResponse.json(
      { error: "Provide a storage path or URL" },
      { status: 400 }
    );
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY is not configured" },
      { status: 500 }
    );
  }

  try {
    const result = await generateText({
      model: openai("gpt-4o-mini"),
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Extract all readable text from this document.",
            },
            { type: "image", image: path },
          ],
        },
      ],
    });

    console.log(
      "[read-file] AI result (truncated)",
      result.text?.slice(0, 200)
    );
    return NextResponse.json({ text: result.text });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : typeof error === "string"
        ? error
        : "AI request failed";

    console.error("[read-file] vision call failed", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
