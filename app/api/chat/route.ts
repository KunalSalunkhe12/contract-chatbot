import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { message, assistantId, threadId } = await req.json();

    await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: message,
    });

    const run = await openai.beta.threads.runs.createAndPoll(threadId, {
      assistant_id: assistantId,
    });

    const messages = await openai.beta.threads.messages.list(threadId, {
      run_id: run.id,
    });

    const current_message = messages.data.pop()!;
    if (current_message.content[0].type === "text") {
      const { text } = current_message.content[0];
      const { annotations } = text;
      const citations: string[] = [];

      let index = 0;
      for (const annotation of annotations) {
        text.value = text.value.replace(annotation.text, "[" + index + "]");
        //@ts-ignore
        const { file_citation } = annotation;
        if (file_citation) {
          const citedFile = await openai.files.retrieve(file_citation.file_id);
          citations.push("[" + index + "]" + citedFile.filename);
        }
        index++;
      }

      console.log(text.value);
      console.log(citations.join("\n"));
      return NextResponse.json({
        success: true,
        text: text.value.replace("**", ""),
        citations: citations,
      });
    }
  } catch (error) {
    console.error("Error in create-assistant API:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
