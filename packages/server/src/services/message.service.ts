import type { UIMessage } from 'ai';
import { eq } from 'drizzle-orm';
import { db } from '../db';
import { conversation, message } from '../db/schema';
import type { Message } from '../types';

export class MessageService {
  static async getMessages(conversationId: string, userId: string) {
    // Verify conversation ownership
    const [conv] = await db
      .select({ userId: conversation.userId })
      .from(conversation)
      .where(eq(conversation.id, conversationId));

    if (!conv || conv.userId !== userId) {
      return { data: [] };
    }

    const messages = await db
      .select({
        id: message.id,
        conversationId: message.conversationId,
        role: message.role,
        parts: message.parts,
        metadata: message.metadata,
        createdAt: message.createdAt,
      })
      .from(message)
      .where(eq(message.conversationId, conversationId))
      .orderBy(message.createdAt);

    return {
      data: messages.map((m) => ({
        id: m.id,
        conversationId: m.conversationId,
        role: m.role,
        parts: m.parts,
        metadata: m.metadata,
        createdAt: String(m.createdAt.getTime()),
      })) as Message[],
    };
  }

  static async addMessage(
    conversationId: string,
    userId: string,
    role: 'user' | 'assistant' | 'system',
    parts: UIMessage['parts'],
    metadata: Record<string, unknown> | null,
  ): Promise<Message | null> {
    // Verify conversation ownership
    const [conv] = await db
      .select({ userId: conversation.userId })
      .from(conversation)
      .where(eq(conversation.id, conversationId));

    if (!conv || conv.userId !== userId) {
      return null;
    }

    const id = crypto.randomUUID();
    const now = new Date();

    const [newMessage] = await db
      .insert(message)
      .values({
        id,
        conversationId,
        role,
        parts,
        metadata,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    // Update conversation's updatedAt
    await db
      .update(conversation)
      .set({ updatedAt: now })
      .where(eq(conversation.id, conversationId));

    return {
      id: newMessage.id,
      conversationId: newMessage.conversationId,
      role: newMessage.role,
      parts: newMessage.parts,
      createdAt: String(newMessage.createdAt.getTime()),
      metadata: newMessage.metadata,
    };
  }

  static async deleteMessage(
    conversationId: string,
    messageId: string,
    userId: string,
  ): Promise<boolean> {
    // Verify conversation ownership
    const [conv] = await db
      .select({ userId: conversation.userId })
      .from(conversation)
      .where(eq(conversation.id, conversationId));

    if (!conv || conv.userId !== userId) {
      return false;
    }

    const result = await db
      .delete(message)
      .where(eq(message.id, messageId))
      .returning({ id: message.id });

    if (result.length > 0) {
      // Update conversation's updatedAt
      await db
        .update(conversation)
        .set({ updatedAt: new Date() })
        .where(eq(conversation.id, conversationId));
      return true;
    }

    return false;
  }

  static async updateFeedback(
    conversationId: string,
    messageId: string,
    userId: string,
    actionType: 'like' | 'dislike',
    action: 'submit' | 'cancel',
  ): Promise<Message | null> {
    // Verify conversation ownership
    const [conv] = await db
      .select({ userId: conversation.userId })
      .from(conversation)
      .where(eq(conversation.id, conversationId));

    if (!conv || conv.userId !== userId) {
      return null;
    }

    const feedbackValue =
      action === 'cancel' ? null : actionType === 'like' ? 'liked' : 'disliked';

    const [updated] = await db
      .update(message)
      .set({
        metadata: {
          feedback: feedbackValue || undefined,
        },
        updatedAt: new Date(),
      })
      .where(eq(message.id, messageId))
      .returning();

    if (!updated) return null;

    return {
      id: updated.id,
      conversationId: updated.conversationId,
      role: updated.role,
      parts: updated.parts,
      createdAt: String(updated.createdAt.getTime()),
      metadata: updated.metadata,
    };
  }
}
