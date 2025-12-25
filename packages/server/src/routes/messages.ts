import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import z from 'zod';
import { authMiddleware } from '../middleware';
import { MessageService } from '../services';
import type { Message } from '../types';
import type { AppContext } from '../types/context';

const messages = new Hono<AppContext>();

// Apply auth middleware to all routes
messages.use('*', authMiddleware);

// Get messages for a conversation
messages.get(
  '/list',
  zValidator(
    'query',
    z.object({
      conversationId: z.string(),
    }),
  ),
  async (c) => {
    const { conversationId } = c.req.valid('query');
    const user = c.get('user');
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    const result = await MessageService.getMessages(conversationId, user.id);

    return c.json<{
      data: Message[];
    }>(result);
  },
);

// Send message (with SSE response)
messages.post(
  '/send',
  zValidator(
    'json',
    z.object({
      id: z.string(),
      message: z.object({
        id: z.string(),
        parts: z.array(
          z.object({
            type: z.string(),
            text: z.string(),
          }),
        ),
        role: z.enum(['user', 'assistant', 'system']),
      }),
      enableDeepThink: z.boolean().optional(),
      enableSearch: z.boolean().optional(),
    }),
  ),
  async (c) => {
    const user = c.get('user');
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { id, message, enableDeepThink, enableSearch } = c.req.valid('json');

    if (!id || !message) {
      return c.json({ error: 'id and message are required' }, 400);
    }

    // Add user message
    const userMessage = await MessageService.addMessage(
      id,
      user.id,
      message.role,
      message.parts.map((part) => part.text).join(''),
    );

    if (!userMessage) {
      return c.json({ error: 'Failed to add message' }, 500);
    }

    // Set up SSE headers
    c.header('Content-Type', 'text/event-stream');
    c.header('Cache-Control', 'no-cache');
    c.header('Connection', 'keep-alive');

    // Create a readable stream for SSE
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Send initial event
          controller.enqueue(
            `data: ${JSON.stringify({
              type: 'user_message',
              data: userMessage,
            })}\n\n`,
          );

          // Simulate LLM processing delay
          await new Promise((resolve) => setTimeout(resolve, 500));

          // Simulate streaming response chunks
          const responseText = `I received your message: "${message.parts.map((part) => part.text).join('')}". This is a mock response from the LLM.
Your **${enableDeepThink ? 'wanna' : 'dont wanna'}** deep think. And your search config is ${enableSearch}.`;
          const chunks = responseText.split(' ');

          for (let i = 0; i < chunks.length; i++) {
            const chunk = chunks[i];
            const eventData = {
              type: 'assistant_message_chunk',
              data: {
                content: chunk + (i < chunks.length - 1 ? ' ' : ''),
                done: i === chunks.length - 1,
              },
            };

            controller.enqueue(`data: ${JSON.stringify(eventData)}\n\n`);

            // Small delay between chunks to simulate streaming
            await new Promise((resolve) => setTimeout(resolve, 500));
          }

          // Add assistant message to database
          const assistantMessage = await MessageService.addMessage(
            id,
            user.id,
            'assistant',
            responseText,
          );

          // Send completion event
          controller.enqueue(
            `data: ${JSON.stringify({
              type: 'assistant_message',
              data: assistantMessage,
            })}\n\n`,
          );
          controller.enqueue(`data: ${JSON.stringify({ type: 'done' })}\n\n`);

          controller.close();
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : 'Unknown error';
          controller.enqueue(
            `data: ${JSON.stringify({ type: 'error', error: errorMessage })}\n\n`,
          );
          controller.close();
        }
      },
    });

    return c.body(stream);
  },
);

messages.post(
  '/feedback',
  zValidator(
    'json',
    z.object({
      conversationId: z.string(),
      messageId: z.string(),
      actionType: z.enum(['like', 'dislike']),
      action: z.enum(['submit', 'cancel']),
    }),
  ),
  async (c) => {
    const { conversationId, messageId, actionType, action } =
      c.req.valid('json');
    const user = c.get('user');
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    const result = await MessageService.updateFeedback(
      conversationId,
      messageId,
      user.id,
      actionType,
      action,
    );
    return c.json(result);
  },
);

export default messages;
