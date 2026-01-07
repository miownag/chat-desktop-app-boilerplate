import { toBaseMessages, toUIMessageStream } from '@ai-sdk/langchain';
import { ChatOpenAI } from '@langchain/openai';
import {
  createUIMessageStream,
  createUIMessageStreamResponse,
  type UIMessage,
} from 'ai';
import { createAgent } from 'langchain';
import { MessageService } from './message.service';

export interface SendMessageOptions {
  conversationId: string;
  userId: string;
  message: UIMessage;
  enableDeepThink?: boolean;
  enableSearch?: boolean;
}

const model = new ChatOpenAI({
  model: 'qwen/qwen3-next-80b',
  apiKey: '',
  configuration: {
    baseURL: 'http://10.2.37.87:1234/v1',
  },
});

export class AIService {
  /**
   * Send a message and stream the AI response
   */
  static async sendMessage(options: SendMessageOptions) {
    const { conversationId, userId, message, enableDeepThink, enableSearch } =
      options;

    const userMessage = await MessageService.addMessage(
      conversationId,
      userId,
      message.role,
      message.parts,
      null,
    );

    if (!userMessage) {
      throw new Error('Failed to add user message');
    }

    const agent = createAgent({
      model,
      tools: [],
    });

    const { data: messages } = await MessageService.getMessages(
      conversationId,
      userId,
    );
    const langchainMessages = await toBaseMessages(messages);
    const langchainStream = await agent.stream(
      { messages: langchainMessages },
      { streamMode: ['values', 'messages'] },
    );

    const stream = createUIMessageStream({
      originalMessages: messages,
      execute: ({ writer }) => {
        writer.merge(toUIMessageStream(langchainStream) as never);
      },
      onFinish: ({ messages }) => {
        MessageService.addMessage(
          conversationId,
          userId,
          'assistant',
          messages[messages.length - 1].parts,
          null,
        );
      },
    });

    return createUIMessageStreamResponse({
      stream,
    });
  }
}
