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

export { getSessionList, getMessagesById };
