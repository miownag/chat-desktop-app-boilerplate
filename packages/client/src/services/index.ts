import { CommonResponse } from "@/types";

const isDev = process.env.NODE_ENV === "development";
const BASE_URL = isDev
  ? "http://localhost:3000/api"
  : "https://api.example.com/api";

async function getSessionList(
  page: number = 1,
  pageSize: number = 10
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
  const response = await fetch(`${BASE_URL}/sessions/list`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ page, pageSize }),
  });
  return await response.json();
}

async function getMessagesById(
  conversationId: string
): Promise<CommonResponse<any>> {
  const response = await fetch(
    `${BASE_URL}/messages/list?conversationId=${conversationId}`
  );
  return await response.json();
}

async function createConversation(
  title?: string
): Promise<CommonResponse<{ id: string; title: string; createdAt: string }>> {
  const response = await fetch(`${BASE_URL}/sessions/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title }),
  });
  return await response.json();
}

async function deleteConversation(
  conversationId: string
): Promise<CommonResponse<null>> {
  const response = await fetch(
    `${BASE_URL}/sessions/delete/${conversationId}`,
    {
      method: "GET",
    }
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
  onError?: (error: Error) => void
): Promise<ReadableStream<Uint8Array> | undefined> {
  try {
    const response = await fetch(`${BASE_URL}/messages/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream",
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (!response.body) {
      throw new Error("Response body is null");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullMessage = "";

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
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6).trim();
              if (data === "[DONE]") {
                onComplete?.(fullMessage);
                return;
              }
              try {
                const parsed = JSON.parse(data);
                const content = parsed.content || parsed.delta || "";
                if (content) {
                  fullMessage += content;
                  onMessage?.(content);
                }
              } catch (e) {
                // 忽略解析错误的行
                console.warn("Failed to parse SSE data:", data);
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
  messageId: string;
  actionType: "like" | "dislike";
  action: "submit" | "cancel";
}): Promise<CommonResponse<null>> {
  const response = await fetch(`${BASE_URL}/messages/feedback`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });
  return await response.json();
}

export {
  getSessionList,
  getMessagesById,
  createConversation,
  deleteConversation,
  sendMessage,
  submitFeedback,
};
