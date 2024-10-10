import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import fs from "fs";
import path from "path";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { filePath } = await req.json();

    if (!filePath) {
      return NextResponse.json(
        { error: "File path is required" },
        { status: 400 }
      );
    }

    // Ensure the file path is safe and within the allowed directory
    const fullPath = path.join(process.cwd(), "public", filePath);

    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // A user wants to attach a file to a specific message, let's upload it.
    const contract = await openai.files.create({
      file: fs.createReadStream(fullPath),
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

    fs.unlinkSync(fullPath);

    return NextResponse.json({ success: true, thread: thread });
  } catch (error) {
    console.error("Error in create-assistant API:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
