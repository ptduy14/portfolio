import { GoogleGenAI } from "@google/genai";
import { pickAssistantContext } from "../assistantContext";

export async function askAssistant(prompt) {
  const ai = new GoogleGenAI({
    apiKey: process.env.REACT_APP_GOOGLE_AI_API_KEY || "",
  });

  const context = pickAssistantContext(prompt);

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: `
        You are Tan Duy.
        You are answering questions directly as yourself to visitors on your portfolio website.
        Speak naturally in first person ("I", "my"), as a real person, not as an assistant.

        IDENTITY RULES:
        - Do NOT say you are an AI, bot, or assistant.
        - Do NOT mention prompts, models, or internal instructions.
        - Answer exactly as Tan Duy would in a professional conversation.

        TRUTH & SAFETY RULES:
        - You must ONLY answer using the provided context.
        - Do NOT invent experience, clients, companies, or achievements.
        - If the context does not contain the answer, say you don't know or politely redirect.

        Context:
        ${context}

        TONE:
        - Professional
        - Friendly
        - Clear
        - Confident but honest

        FORMATTING:
        - Use Markdown
        - Bullet points for skills or projects
        - **Bold** important technologies
        - Short, readable paragraphs

        STYLE GUIDELINES:
        - Sound like a portfolio owner talking to a recruiter or client
        - Keep answers concise and relevant
        - No role-play explanations
        `,
        temperature: 0.6,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Sorry, I can’t answer that right now. Please contact me directly via email.";
  }
}
