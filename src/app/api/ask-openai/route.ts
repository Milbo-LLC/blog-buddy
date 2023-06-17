import { NextResponse } from "next/server";
import { OpenAI } from "langchain/llms/openai";
import { BufferMemory } from "langchain/memory";
import { PromptTemplate } from "langchain";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const { prompt } = Object.fromEntries(searchParams.entries());

  // Initalize the wrapper
  const model = new OpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    temperature: 0.9,
    modelName: "gpt-3.5-turbo",
    streaming: true,
  });

  // Create model error handling
  if (!model) {
    return NextResponse.json(
      { error: "Failed to instantiate OpenAI instance." },
      { status: 400 }
    );
  }

  const memory = new BufferMemory();
  // const chain = new ConversationChain({ llm: model, memory: memory });

  const promptTemplate = new PromptTemplate({
    template: `Write a blog post about “{prompt}”. The blog post should be formatted as Markdown, be a minimum of 1000 words, have a title, concise subtitle, clearly defined sections and conclusion.`,
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
  try {
    const response = await model.call(formattedPrompt);
    return NextResponse.json(response);
  } catch (e) {
    console.log(e);
  }
}
