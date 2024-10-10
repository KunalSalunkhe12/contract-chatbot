import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import fs from "fs";
import path from "path";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { filePath, assistantId, message } = await req.json();

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

    // const fileStreams = fs.createReadStream(fullPath);

    // Create a vector store
    // const vectorStore = await openai.beta.vectorStores.create({
    //   name: "PDF Vector Store",
    // });

    // Upload and poll the file
    // A user wants to attach a file to a specific message, let's upload it.
    const contract = await openai.files.create({
      file: fs.createReadStream(fullPath),
      purpose: "assistants",
    });

    const thread = await openai.beta.threads.create({
      messages: [
        {
          role: "user",
          content: message,
          // Attach the new file to the message.
          attachments: [
            { file_id: contract.id, tools: [{ type: "file_search" }] },
          ],
        },
      ],
    });

    // The thread now has a vector store in its tool resources.
    console.log(thread.tool_resources?.file_search);

    const run = await openai.beta.threads.runs.createAndPoll(thread.id, {
      assistant_id: assistantId,
    });

    const messages = await openai.beta.threads.messages.list(thread.id, {
      run_id: run.id,
    });

    const assistant_message = messages.data.pop()!;
    if (assistant_message.content[0].type === "text") {
      const { text } = assistant_message.content[0];
      const { annotations } = text;
      const citations: string[] = [];

      let index = 0;
      for (const annotation of annotations) {
        text.value = text.value.replace("", "[" + index + "]");
        //@ts-ignore
        const { file_citation } = annotation;
        if (file_citation) {
          const citedFile = await openai.files.retrieve(file_citation.file_id);
          citations.push("[" + index + "]" + citedFile.filename);
        }
        index++;
      }

      return NextResponse.json({ text: text.value, citations });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in create-assistant API:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
