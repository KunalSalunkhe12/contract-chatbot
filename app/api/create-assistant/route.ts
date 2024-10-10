import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST() {
  try {
    const assistant = await openai.beta.assistants.create({
      name: "PDF Assistant",
      instructions:
        "You are an expert at analyzing PDFs and answering questions about their content. Do not output any person or company names from the pdf in its responses.",
      model: "gpt-4o-mini",
      tools: [{ type: "file_search" }],
    });

    return NextResponse.json({ assistantId: assistant.id });
  } catch (error) {
    console.error("Error in create-assistant API:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
