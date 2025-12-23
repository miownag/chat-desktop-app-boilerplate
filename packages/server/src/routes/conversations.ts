import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { z } from 'zod';
import { authMiddleware } from '../middleware';
import { ConversationService } from '../services';
import type { Conversation, PaginatedResponse } from '../types';
import type { AppContext } from '../types/context';

const conversations = new Hono<AppContext>();

// Apply auth middleware to all routes
conversations.use('*', authMiddleware);

conversations.post(
  '/list',
  zValidator(
    'json',
    z.object({
      page: z.number(),
      pageSize: z.number(),
    }),
  ),
  async (c) => {
    const { page, pageSize } = c.req.valid('json');
    const user = c.get('user')!;
    const result = await ConversationService.getConversations(
      user.id,
      page,
      pageSize,
    );

    return c.json<PaginatedResponse<Conversation>>(result);
  },
);

// Create new conversation
conversations.post(
  '/create',
  zValidator(
    'json',
    z.object({
      title: z.string().optional(),
    }),
  ),
  async (c) => {
    const { title } = c.req.valid('json');
    const user = c.get('user')!;
    const conversation = await ConversationService.createConversation(
      user.id,
      title,
    );

    return c.json(conversation);
  },
);

// Get conversation by ID
conversations.get('/get/:id', async (c) => {
  const id = c.req.param('id');
  const user = c.get('user')!;
  const conversation = await ConversationService.getConversationById(
    id,
    user.id,
  );

  if (!conversation) {
    return c.json({ error: 'conversation not found' }, 404);
  }

  return c.json(conversation);
});

// Delete conversation
conversations.delete(
  '/delete/:id',
  zValidator(
    'param',
    z.object({
      id: z.string(),
    }),
  ),
  async (c) => {
    const { id } = c.req.valid('param');
    const user = c.get('user')!;
    const deleted = await ConversationService.deleteConversation(id, user.id);

    if (!deleted) {
      return c.json({ error: 'conversation not found' }, 404);
    }

    return c.json({ message: 'conversation deleted successfully' });
  },
);

// Update conversation
conversations.put(
  '/update/:id',
  zValidator(
    'param',
    z.object({
      id: z.string(),
    }),
  ),
  zValidator(
    'json',
    z.object({
      title: z.string().optional(),
    }),
  ),
  async (c) => {
    const { id } = c.req.valid('param');
    const { title } = c.req.valid('json');
    const user = c.get('user')!;
    const conversation = await ConversationService.updateConversation(
      id,
      user.id,
      { title },
    );

    if (!conversation) {
      return c.json({ error: 'conversation not found' }, 404);
    }

    return c.json(conversation);
  },
);

export default conversations;
