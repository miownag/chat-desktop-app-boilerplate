import { Session, Message } from "../types";

// Mock data storage
const sessions: Map<string, Session> = new Map();
const messages: Map<string, Message[]> = new Map();

// Initialize with some mock data
const mockSessions: Session[] = [
  {
    id: "2",
    title: "Could you please",
    createdAt: String(new Date("2024-01-03").getTime()),
    updatedAt: String(new Date("2024-01-04").getTime()),
    messageCount: 8,
  },
  {
    id: "1",
    title: "General Chat",
    createdAt: String(new Date("2024-01-01").getTime()),
    updatedAt: String(new Date("2024-01-02").getTime()),
    messageCount: 5,
  },
];

const mockMessages: { [key: string]: Message[] } = {
  "1": [
    {
      id: "1",
      sessionId: "1",
      role: "user",
      content: "Hello, how are you?",
      createdAt: String(new Date("2024-01-01T10:00:00Z").getTime()),
    },
    {
      id: "2",
      sessionId: "1",
      role: "assistant",
      content: "I'm doing well, thank you! How can I help you today?",
      createdAt: String(new Date("2024-01-01T10:01:00Z").getTime()),
    },
  ],
  "2": [
    {
      id: "3",
      sessionId: "2",
      role: "user",
      content: "Can you review this code?",
      createdAt: String(new Date("2024-01-03T14:00:00Z").getTime()),
    },
    {
      id: "4",
      sessionId: "2",
      role: "assistant",
      content:
        "I'd be happy to review your code. Please share the code you'd like me to look at.",
      createdAt: String(new Date("2024-01-03T14:02:00Z").getTime()),
    },
  ],
};

// Initialize mock data
mockSessions.forEach((session) => {
  sessions.set(session.id, session);
  messages.set(session.id, mockMessages[session.id] || []);
});

export class SessionService {
  static async getSessions(page: number = 1, pageSize: number = 10) {
    // TODO: Get from Postgres
    const sessionArray = Array.from(sessions.values());
    const total = sessionArray.length;
    const totalPages = Math.ceil(total / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    return {
      data: sessionArray.slice(startIndex, endIndex),
      total,
      page,
      pageSize,
      totalPages,
    };
  }

  static async getSessionById(id: string): Promise<Session | null> {
    return sessions.get(id) || null;
  }

  static async createSession(title?: string): Promise<Session> {
    const id = Date.now().toString();
    const now = new Date().toTimeString();
    const session: Session = {
      id,
      title: title || `New Chat ${id}`,
      createdAt: now,
      updatedAt: now,
      messageCount: 0,
    };

    sessions.set(id, session);
    messages.set(id, []);

    return session;
  }

  static async deleteSession(id: string): Promise<boolean> {
    const deleted = sessions.delete(id);
    messages.delete(id);
    return deleted;
  }

  static async updateSession(
    id: string,
    updates: Partial<Session>
  ): Promise<Session | null> {
    const session = sessions.get(id);
    if (!session) return null;

    const updatedSession = {
      ...session,
      ...updates,
      updatedAt: new Date().toTimeString(),
    };
    sessions.set(id, updatedSession);

    return updatedSession;
  }
}

export class MessageService {
  static async getMessages(sessionId: string) {
    const sessionMessages = messages.get(sessionId) || [];
    return {
      data: sessionMessages,
    };
  }

  static async addMessage(
    sessionId: string,
    role: "user" | "assistant" | "system",
    content: string
  ): Promise<Message> {
    const message: Message = {
      id: Date.now().toString(),
      sessionId,
      role,
      content,
      createdAt: new Date().toTimeString(),
    };

    const sessionMessages = messages.get(sessionId) || [];
    sessionMessages.push(message);
    messages.set(sessionId, sessionMessages);

    // Update session message count
    const session = sessions.get(sessionId);
    if (session) {
      session.messageCount = sessionMessages.length;
      session.updatedAt = new Date().toTimeString();
    }

    return message;
  }

  static async deleteMessage(
    sessionId: string,
    messageId: string
  ): Promise<boolean> {
    const sessionMessages = messages.get(sessionId) || [];
    const initialLength = sessionMessages.length;
    const filteredMessages = sessionMessages.filter(
      (msg) => msg.id !== messageId
    );

    if (filteredMessages.length < initialLength) {
      messages.set(sessionId, filteredMessages);

      // Update session message count
      const session = sessions.get(sessionId);
      if (session) {
        session.messageCount = filteredMessages.length;
        session.updatedAt = new Date().toTimeString();
      }

      return true;
    }

    return false;
  }

  static async updateFeedback(
    conversationId: string,
    messageId: string,
    actionType: "like" | "dislike",
    action: "submit" | "cancel"
  ): Promise<Message | null> {
    const sessionMessages = messages.get(conversationId) || [];
    const messageIndex = sessionMessages.findIndex(
      (msg) => msg.id === messageId
    );
    const feedbackStatus =
      action === "cancel" ? null : actionType === "like" ? "liked" : "disliked";
    if (messageIndex !== -1) {
      const updatedMessage = {
        ...sessionMessages[messageIndex],
        feedback: feedbackStatus as typeof feedbackStatus,
      };
      sessionMessages[messageIndex] = updatedMessage;
      messages.set(conversationId, sessionMessages);
      return updatedMessage;
    }
    return null;
  }
}
