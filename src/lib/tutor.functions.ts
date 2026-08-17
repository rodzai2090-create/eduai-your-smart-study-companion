import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

/**
 * AI tutor. All prompting and the Lovable AI key stay on the server.
 * Requires the LOVABLE_API_KEY secret (provisioned automatically by Lovable).
 */

const MessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(6000),
});

const TutorInput = z.object({
  messages: z.array(MessageSchema).min(1).max(24),
  mode: z
    .enum(["explain_simply", "step_by_step", "example", "practice_question", "test_me", "chat"])
    .default("chat"),
  context: z
    .object({
      country: z.string().nullish(),
      board: z.string().nullish(),
      className: z.string().nullish(),
      subject: z.string().nullish(),
      chapter: z.string().nullish(),
      topic: z.string().nullish(),
    })
    .default({}),
});

const modeInstruction: Record<string, string> = {
  explain_simply: "Explain the current question in the simplest possible language, as to a beginner.",
  step_by_step: "Give a complete step-by-step solution or derivation, numbering each step.",
  example: "Give one fully worked example relevant to the student's topic.",
  practice_question: "Give exactly one practice question with a hint, and do not reveal the answer yet.",
  test_me: "Ask the student three short questions one message at a time, starting with the first.",
  chat: "Answer the student's message.",
};

export const askTutor = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => TutorInput.parse(input))
  .handler(async ({ data }) => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) {
      return { ok: false as const, error: "AI is not configured yet (missing LOVABLE_API_KEY)." };
    }

    const { createLovableAiGatewayProvider, TUTOR_MODEL } = await import("./ai-gateway.server");
    const { streamText } = await import("ai");

    const ctx = data.context;
    const contextLine = [
      ctx.country && `Country: ${ctx.country}`,
      ctx.board && `Board: ${ctx.board}`,
      ctx.className && `Class: ${ctx.className}`,
      ctx.subject && `Subject: ${ctx.subject}`,
      ctx.chapter && `Chapter: ${ctx.chapter}`,
      ctx.topic && `Topic: ${ctx.topic}`,
    ]
      .filter(Boolean)
      .join(" | ");

    const system = [
      "You are EduAI, a patient school tutor for students. You teach — you never just hand over homework answers.",
      contextLine ? `Student curriculum context: ${contextLine}.` : "The student has not set a curriculum yet; ask which class and subject they mean if it matters.",
      "Structure substantial answers with these sections when they apply:",
      "1. Simple explanation  2. Step-by-step working  3. Example  4. Common mistakes  5. Short practice question  6. A follow-up question for the student.",
      "Keep answers concise, use plain Markdown, and never claim your content is official board or past-paper material.",
      modeInstruction[data.mode] ?? modeInstruction["chat"],
    ].join("\n");

    try {
      const gateway = createLovableAiGatewayProvider(apiKey);
      const result = streamText({
        model: gateway(TUTOR_MODEL),
        system,
        messages: data.messages,
      });
      const text = await result.text;
      return { ok: true as const, text };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      if (message.includes("429")) {
        return { ok: false as const, error: "The tutor is busy right now — please try again in a moment." };
      }
      if (message.includes("402")) {
        return { ok: false as const, error: "AI credits are exhausted. Add credits to keep using the tutor." };
      }
      console.error("[tutor]", message);
      return { ok: false as const, error: "The tutor could not answer that. Please try again." };
    }
  });
