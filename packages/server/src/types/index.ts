export interface Conversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
}

export interface Message {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant' | 'system';
  parts: Array<{
    type: string;
    [key: string]: unknown;
  }>;
  createdAt: string;
  metadata: Record<string, unknown> | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface CreateConversationRequest {
  title?: string;
}

export interface SendMessageRequest {
  content: string;
  context?: {
    systemPrompt?: string;
    temperature?: number;
    maxTokens?: number;
  };
}
