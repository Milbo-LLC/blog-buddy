import { NextResponse } from "next/server";
import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain";

// Handle Langchain logic
const runLLMChain = async (prompt: string) => {
  const encoder = new TextEncoder();
  const stream = new TransformStream(); // streamable object
  const writer = stream.writable.getWriter(); // writter object for writing to stream

  // Initalize the wrapper
  const model = new OpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    temperature: 0.9,
    modelName: "gpt-3.5-turbo",
    streaming: true,
    callbacks: [
      {
        async handleLLMNewToken(token) {
          await writer.ready;
          await writer.write(encoder.encode(`${token}`));
        },
        async handleLLMEnd() {
          await writer.ready;
          await writer.close();
        },
      },
    ],
  });

  // Create model error handling
  if (!model) {
    return NextResponse.json(
      { error: "Failed to instantiate OpenAI instance." },
      { status: 400 }
    );
  }

  const promptTemplate = new PromptTemplate({
    template: `Write a blog post about “{prompt}”. The blog post should be formatted as Markdown, must have a minimum of 1000 words, must have a title, concise subtitle, and clearly defined sections and conclusion.`,
    inputVariables: ["prompt"],
  });

  // Create promptTemplate error handling
  if (!promptTemplate) {
    return NextResponse.json(
      { error: "Failed to instantiate prompt template." },
      { status: 400 }
    );
  }

  // Create prompt
  const formattedPrompt = await promptTemplate.format({ prompt });

  // Create prompt error handling
  if (!formattedPrompt) {
    return NextResponse.json(
      { error: "Failed to create formatted prompt." },
      { status: 400 }
    );
  }

  model.call(formattedPrompt);

  return stream.readable;
};

export async function POST(request: Request) {
  const { prompt } = await request.json();
  const stream = runLLMChain(prompt);
  return new Response(await stream);
}
