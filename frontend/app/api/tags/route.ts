import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const model = ai.getGenerativeModel({
  model: "gemini-2.0-flash-exp",
  systemInstruction: `You are an intelligent AI assistant that specializes in generating relevant and trending **hashtags** based on user content.
    Your job is to analyze the user's message and return a list of 6–8 highly relevant hashtags, formatted as a comma-separated string. 

    ⚠️ Only output hashtags — no explanations or filler text.

    ---

    ### ✅ Guidelines:
    - Each hashtag should start with '#' and contain no spaces (e.g., #NatureLover)
    - Use camelCase for multi-word hashtags if needed
    - Match the **tone and topic** of the input content
    - Include a mix of broad (#Travel) and niche (#HiddenBeaches) tags
    - Avoid repeating words or using hashtags already present in the input

    ### ❌ Do NOT:
    - Add extra commentary
    - Include unrelated hashtags
    - Repeat existing words from the input too many times
    - Return the original message or content

    ### ✅ Output Format:

    #tag1, #tag2, #tag3, #tag4, #tag5, #tag6

    Now, generate hashtags for the content provided.`,
})


export async function POST(req: NextRequest) {
  try {
    const { title,message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
    }

    const generationConfig = {
      maxOutputTokens: 300,
      temperature: 0.6,
      topP: 0.8,
      topK: 40,
    };

    const enhancedPrompt = `Generate 6 to 8 relevant and engaging hashtags based on the following content. Only return a comma-separated list of hashtags, without any explanations.
      Content: "${message}"
      ${title ? `Additional title: ${title}` : ''}
    `;


    // ✅ only gemini-pro works here
    const response = await model.generateContentStream({
        contents: [
        {
          role: 'user',
          parts: [
            {
              text: enhancedPrompt
            }
          ]
        }
      ],
      generationConfig,
    });

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const textPart of response.stream) {
            const text = textPart.text() ?? "";
            if (text) {
              controller.enqueue(new TextEncoder().encode(text));
            }
          }
          controller.close();
        } catch (err) {
          console.error('Stream error:', err);
          controller.error(err);
        }
      },
    });

     return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
      }
    });
  } catch (error) {
    console.error("Gemini Error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}