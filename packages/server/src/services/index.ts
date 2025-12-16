import { Session, Message } from '../types';

// Mock data storage
const sessions: Map<string, Session> = new Map();
const messages: Map<string, Message[]> = new Map();

// Initialize with some mock data
const mockSessions: Session[] = [
  {
    id: '1',
    title: 'General Chat',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-02'),
    messageCount: 5,
  },
  {
    id: '2',
    title: 'Code Review',
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-04'),
    messageCount: 8,
  },
];

const mockMessages: { [key: string]: Message[] } = {
  '1': [
    {
      id: '1',
      sessionId: '1',
      role: 'user',
      content: 'Hello, how are you?',
      createdAt: new Date('2024-01-01T10:00:00Z'),
    },
    {
      id: '2',
      sessionId: '1',
      role: 'assistant',
      content: 'I\'m doing well, thank you! How can I help you today?',
      createdAt: new Date('2024-01-01T10:01:00Z'),
    },
  ],
  '2': [
    {
      id: '3',
      sessionId: '2',
      role: 'user',
      content: 'Can you review this code?',
      createdAt: new Date('2024-01-03T14:00:00Z'),
    },
    {
      id: '4',
      sessionId: '2',
      role: 'assistant',
      content: 'I\'d be happy to review your code. Please share the code you\'d like me to look at.',
      createdAt: new Date('2024-01-03T14:01:00Z'),
    },
  ],
};

// Initialize mock data
mockSessions.forEach(session => {
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
    const now = new Date();
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

  static async updateSession(id: string, updates: Partial<Session>): Promise<Session | null> {
    const session = sessions.get(id);
    if (!session) return null;
    
    const updatedSession = { ...session, ...updates, updatedAt: new Date() };
    sessions.set(id, updatedSession);
    
    return updatedSession;
  }
}

export class MessageService {
  static async getMessages(sessionId: string, page: number = 1, pageSize: number = 50) {
    const sessionMessages = messages.get(sessionId) || [];
    const total = sessionMessages.length;
    const totalPages = Math.ceil(total / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    
    return {
      data: sessionMessages.slice(startIndex, endIndex),
      total,
      page,
      pageSize,
      totalPages,
    };
  }

  static async addMessage(sessionId: string, role: 'user' | 'assistant' | 'system', content: string): Promise<Message> {
    const message: Message = {
      id: Date.now().toString(),
      sessionId,
      role,
      content,
      createdAt: new Date(),
    };
    
    const sessionMessages = messages.get(sessionId) || [];
    sessionMessages.push(message);
    messages.set(sessionId, sessionMessages);
    
    // Update session message count
    const session = sessions.get(sessionId);
    if (session) {
      session.messageCount = sessionMessages.length;
      session.updatedAt = new Date();
    }
    
    return message;
  }

  static async deleteMessage(sessionId: string, messageId: string): Promise<boolean> {
    const sessionMessages = messages.get(sessionId) || [];
    const initialLength = sessionMessages.length;
    const filteredMessages = sessionMessages.filter(msg => msg.id !== messageId);
    
    if (filteredMessages.length < initialLength) {
      messages.set(sessionId, filteredMessages);
      
      // Update session message count
      const session = sessions.get(sessionId);
      if (session) {
        session.messageCount = filteredMessages.length;
        session.updatedAt = new Date();
      }
      
      return true;
    }
    
    return false;
  }
}