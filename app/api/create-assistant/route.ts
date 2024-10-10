import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST() {
  try {
    const assistant = await openai.beta.assistants.create({
      name: "PDF Assistant",
      instructions:
        "You are an expert at analyzing PDFs and answering questions about their content.",
      model: "gpt-4o",
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
