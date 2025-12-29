import { desc, eq, sql } from 'drizzle-orm';
import { db } from '../db';
import { conversation, message } from '../db/schema';
import type { Conversation } from '../types';

export class ConversationService {
  static async getConversations(
    userId: string,
    page: number = 1,
    pageSize: number = 10,
  ) {
    const offset = (page - 1) * pageSize;

    // Get conversations with message count
    const conversationsWithCount = await db
      .select({
        id: conversation.id,
        title: conversation.title,
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt,
        messageCount: sql<number>`(
          SELECT COUNT(*)::int FROM ${message}
          WHERE ${message.conversationId} = ${conversation.id}
        )`,
      })
      .from(conversation)
      .where(eq(conversation.userId, userId))
      .orderBy(desc(conversation.updatedAt))
      .limit(pageSize)
      .offset(offset);

    // Get total count
    const [{ count }] = await db
      .select({ count: sql<number>`COUNT(*)::int` })
      .from(conversation)
      .where(eq(conversation.userId, userId));

    const total = count;
    const totalPages = Math.ceil(total / pageSize);

    return {
      data: conversationsWithCount.map((c) => ({
        id: c.id,
        title: c.title ?? 'New Conversation',
        createdAt: String(c.createdAt.getTime()),
        updatedAt: String(c.updatedAt.getTime()),
        messageCount: c.messageCount,
      })) as Conversation[],
      total,
      page,
      pageSize,
      totalPages,
    };
  }

  static async getConversationById(
    id: string,
    userId: string,
  ): Promise<Conversation | null> {
    const [result] = await db
      .select({
        id: conversation.id,
        title: conversation.title,
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt,
        messageCount: sql<number>`(
          SELECT COUNT(*)::int FROM ${message}
          WHERE ${message.conversationId} = ${conversation.id}
        )`,
      })
      .from(conversation)
      .where(eq(conversation.id, id));

    if (!result) return null;

    // Verify ownership
    const [ownership] = await db
      .select({ userId: conversation.userId })
      .from(conversation)
      .where(eq(conversation.id, id));

    if (ownership?.userId !== userId) return null;

    return {
      id: result.id,
      title: result.title ?? 'New Conversation',
      createdAt: String(result.createdAt.getTime()),
      updatedAt: String(result.updatedAt.getTime()),
      messageCount: result.messageCount,
    };
  }

  static async createConversation(
    userId: string,
    title?: string,
  ): Promise<Conversation> {
    const id = crypto.randomUUID();
    const now = new Date();

    await db.insert(conversation).values({
      id,
      title: title ?? 'New Conversation',
      userId,
      createdAt: now,
      updatedAt: now,
    });

    return {
      id,
      title: title ?? 'New Conversation',
      createdAt: String(now.getTime()),
      updatedAt: String(now.getTime()),
      messageCount: 0,
    };
  }

  static async deleteConversation(
    id: string,
    userId: string,
  ): Promise<boolean> {
    // Verify ownership before deletion
    const [existing] = await db
      .select({ userId: conversation.userId })
      .from(conversation)
      .where(eq(conversation.id, id));

    if (!existing || existing.userId !== userId) return false;

    // Messages will be cascade deleted due to foreign key constraint
    const result = await db
      .delete(conversation)
      .where(eq(conversation.id, id))
      .returning({ id: conversation.id });

    return result.length > 0;
  }

  static async updateConversation(
    id: string,
    userId: string,
    updates: Partial<Pick<Conversation, 'title'>>,
  ): Promise<Conversation | null> {
    // Verify ownership before update
    const [existing] = await db
      .select({ userId: conversation.userId })
      .from(conversation)
      .where(eq(conversation.id, id));

    if (!existing || existing.userId !== userId) return null;

    const now = new Date();

    const [updated] = await db
      .update(conversation)
      .set({
        ...(updates.title && { title: updates.title }),
        updatedAt: now,
      })
      .where(eq(conversation.id, id))
      .returning();

    if (!updated) return null;

    // Get message count
    const [{ count }] = await db
      .select({ count: sql<number>`COUNT(*)::int` })
      .from(message)
      .where(eq(message.conversationId, id));

    return {
      id: updated.id,
      title: updated.title ?? 'New Conversation',
      createdAt: String(updated.createdAt.getTime()),
      updatedAt: String(updated.updatedAt.getTime()),
      messageCount: count,
    };
  }

  static async hasMessageInConversation(id: string): Promise<boolean> {
    const [result] = await db
      .select({ count: sql<number>`COUNT(*)::int` })
      .from(message)
      .where(eq(message.conversationId, id))
      .limit(1);

    return result?.count > 0;
  }
}
