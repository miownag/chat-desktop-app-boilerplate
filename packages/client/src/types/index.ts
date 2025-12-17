type CommonResponse<T> = {
  code: number;
  message: string;
  data: T;
};

type Conversation = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
};

type GroupedConversations = {
  period: string;
  conversations: Conversation[];
}[];

export type { Conversation, GroupedConversations, CommonResponse };
