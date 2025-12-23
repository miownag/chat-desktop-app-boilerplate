import type { CommonResponse } from '@/types';

const isDev = import.meta.env.DEV;
const BASE_URL = isDev
  ? 'http://localhost:3000/api'
  : 'https://api.example.com/api';

// Common fetch options for authenticated requests
const fetchWithAuth = (url: string, options: RequestInit = {}) => {
  return fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
};

async function getConversationList(
  page: number = 1,
  pageSize: number = 10,
): Promise<
  CommonResponse<{
    data: {
      id: string;
      title: string;
      createdAt: string;
      updatedAt: string;
    }[];
    total: number;
    totalPages: number;
    page: number;
    pageSize: number;
  }>
> {
  const response = await fetchWithAuth(`${BASE_URL}/conversations/list`, {
    method: 'POST',
    body: JSON.stringify({ page, pageSize }),
  });
  return await response.json();
}

async function getMessagesById(
  conversationId: string,
): Promise<CommonResponse<any>> {
  const response = await fetchWithAuth(
    `${BASE_URL}/messages/list?conversationId=${conversationId}`,
  );
  return await response.json();
}

async function createConversation(
  title?: string,
): Promise<CommonResponse<{ id: string; title: string; createdAt: string }>> {
  const response = await fetchWithAuth(`${BASE_URL}/conversations/create`, {
    method: 'POST',
    body: JSON.stringify({ title }),
  });
  return await response.json();
}

async function deleteConversation(
  conversationId: string,
): Promise<CommonResponse<null>> {
  const response = await fetchWithAuth(
    `${BASE_URL}/conversations/delete/${conversationId}`,
    {
      method: 'DELETE',
    },
  );
  return await response.json();
}

async function sendMessage(
  params: {
    conversationId: string;
    content: string;
  },
  onMessage?: (chunk: string) => void,
  onComplete?: (fullMessage: string) => void,
  onError?: (error: Error) => void,
): Promise<ReadableStream<Uint8Array> | undefined> {
  try {
    const response = await fetchWithAuth(`${BASE_URL}/messages/send`, {
      method: 'POST',
      headers: {
        Accept: 'text/event-stream',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (!response.body) {
      throw new Error('Response body is null');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullMessage = '';

    // 读取流
    const readStream = async () => {
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            onComplete?.(fullMessage);
            break;
          }

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6).trim();
              if (data === '[DONE]') {
                onComplete?.(fullMessage);
                return;
              }
              try {
                const parsed = JSON.parse(data);
                const content = parsed.content || parsed.delta || '';
                if (content) {
                  fullMessage += content;
                  onMessage?.(content);
                }
              } catch {
                // 忽略解析错误的行
                console.warn('Failed to parse SSE data:', data);
              }
            }
          }
        }
      } catch (error) {
        onError?.(error as Error);
      }
    };

    readStream();
    return response.body;
  } catch (error) {
    onError?.(error as Error);
    throw error;
  }
}

async function submitFeedback(params: {
  conversationId: string;
  messageId: string;
  actionType: 'like' | 'dislike';
  action: 'submit' | 'cancel';
}): Promise<CommonResponse<null>> {
  const response = await fetchWithAuth(`${BASE_URL}/messages/feedback`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
  return await response.json();
}

export {
  getConversationList,
  getMessagesById,
  createConversation,
  deleteConversation,
  sendMessage,
  submitFeedback,
};
