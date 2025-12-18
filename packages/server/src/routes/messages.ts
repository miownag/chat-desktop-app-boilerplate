import { Hono } from "hono";
import { AppContext } from "../types/context";
import { MessageService } from "../services";
import { Message } from "../types";
import { zValidator } from "@hono/zod-validator";
import z from "zod";

const messages = new Hono<AppContext>();

// Get messages for a session (paginated)
messages.get(
  "/list",
  zValidator(
    "query",
    z.object({
      conversationId: z.string(),
    })
  ),
  async (c) => {
    const { conversationId } = c.req.valid("query");
    const result = await MessageService.getMessages(conversationId);

    return c.json<{
      data: Message[];
    }>(result);
  }
);

// Send message (with SSE response)
messages.post("/send", async (c) => {
  const body = await c.req.json<{
    sessionId: string;
    content: string;
    context?: {
      systemPrompt?: string;
      temperature?: number;
      maxTokens?: number;
    };
  }>();

  const { sessionId, content, context } = body;

  if (!sessionId || !content) {
    return c.json({ error: "sessionId and content are required" }, 400);
  }

  // Add user message
  const userMessage = await MessageService.addMessage(
    sessionId,
    "user",
    content
  );

  // Set up SSE headers
  c.header("Content-Type", "text/event-stream");
  c.header("Cache-Control", "no-cache");
  c.header("Connection", "keep-alive");

  // Create a readable stream for SSE
  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Send initial event
        controller.enqueue(
          `data: ${JSON.stringify({
            type: "user_message",
            data: userMessage,
          })}\n\n`
        );

        // Simulate LLM processing delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Simulate streaming response chunks
        const responseText = `I received your message: "${content}". This is a mock response from the LLM.`;
        const chunks = responseText.split(" ");

        for (let i = 0; i < chunks.length; i++) {
          const chunk = chunks[i];
          const eventData = {
            type: "assistant_message_chunk",
            data: {
              content: chunk + (i < chunks.length - 1 ? " " : ""),
              done: i === chunks.length - 1,
            },
          };

          controller.enqueue(`data: ${JSON.stringify(eventData)}\n\n`);

          // Small delay between chunks to simulate streaming
          await new Promise((resolve) => setTimeout(resolve, 50));
        }

        // Add assistant message to database
        const assistantMessage = await MessageService.addMessage(
          sessionId,
          "assistant",
          responseText
        );

        // Send completion event
        controller.enqueue(
          `data: ${JSON.stringify({
            type: "assistant_message",
            data: assistantMessage,
          })}\n\n`
        );
        controller.enqueue(`data: ${JSON.stringify({ type: "done" })}\n\n`);

        controller.close();
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        controller.enqueue(
          `data: ${JSON.stringify({ type: "error", error: errorMessage })}\n\n`
        );
        controller.close();
      }
    },
  });

  return c.body(stream);
});

messages.post(
  "/feedback",
  zValidator(
    "json",
    z.object({
      conversationId: z.string(),
      messageId: z.string(),
      actionType: z.enum(["like", "dislike"]),
      action: z.enum(["submit", "cancel"]),
    })
  ),
  async (c) => {
    const { conversationId, messageId, actionType, action } =
      c.req.valid("json");
    const result = await MessageService.updateFeedback(
      conversationId,
      messageId,
      actionType,
      action
    );
    return c.json(result);
  }
);

export default messages;
