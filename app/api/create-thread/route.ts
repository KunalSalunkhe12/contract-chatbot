import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import fs from "fs";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { filePath } = await req.json();

    console.log("File path:", filePath);

    if (!filePath) {
      return NextResponse.json(
        { error: "File path is required" },
        { status: 400 }
      );
    }

    // A user wants to attach a file to a specific message, let's upload it.
    const contract = await openai.files.create({
      file: fs.createReadStream(filePath),
      purpose: "assistants",
    });

    const thread = await openai.beta.threads.create({
      messages: [
        {
          role: "user",
          content: "Analyze the following document.",
          attachments: [
            { file_id: contract.id, tools: [{ type: "file_search" }] },
          ],
        },
      ],
    });

    return NextResponse.json({ success: true, threadId: thread.id });
  } catch (error) {
    console.error("Error in create-assistant API:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
