import { zValidator } from '@hono/zod-validator';
import type { UIMessage } from 'ai';
import { Hono } from 'hono';
import z from 'zod';
import { authMiddleware } from '../middleware';
import { AIService, ConversationService, MessageService } from '../services';
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
            text: z.string().optional(),
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

    // If the message sent is the first, update conversation's title
    const hasMessage = await ConversationService.hasMessageInConversation(id);
    if (!hasMessage) {
      await ConversationService.updateConversation(id, user.id, {
        title: message.parts
          .filter((part) => part.type === 'text')
          .map((part) => part.text || '')
          .join(''),
      });
    }

    const response = await AIService.sendMessage({
      conversationId: id,
      userId: user.id,
      message: message as UIMessage,
      enableDeepThink,
      enableSearch,
    });

    return response;
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
