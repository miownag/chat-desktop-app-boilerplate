import { type LanguageModel, streamText, type UIMessage } from 'ai';
import { ollama } from 'ollama-ai-provider-v2';
import { MessageService } from './message.service';

export interface SendMessageOptions {
  conversationId: string;
  userId: string;
  message: UIMessage;
  enableDeepThink?: boolean;
  enableSearch?: boolean;
}

const model = ollama('qwen3:4b');

export class AIService {
  /**
   * Send a message and stream the AI response
   */
  static async sendMessage(options: SendMessageOptions) {
    const { conversationId, userId, message, enableDeepThink, enableSearch } =
      options;

    console.log('--------> 查看入参', conversationId, message);
    // Add user message to database
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

    // Extract text from parts for processing
    const userText = message.parts
      .filter((part) => part.type === 'text')
      .map((part) => part.text as string)
      .join('');

    // Get conversation history for context
    const { data: historyMessages } = await MessageService.getMessages(
      conversationId,
      userId,
    );

    // Convert to AI SDK message format (excluding the just-added user message)
    const messages = historyMessages
      .filter((m) => m.id !== userMessage.id)
      .map((m) => ({
        role: m.role,
        content: m.parts
          .filter((p) => p.type === 'text')
          .map((p) => p.text as string)
          .join(''),
      }));

    // Add current user message
    messages.push({
      role: 'user',
      content: userText,
    });

    // Stream response from AI
    const result = streamText({
      model: model as LanguageModel,
      providerOptions: {
        ollama: {
          think: enableDeepThink,
        },
      },
      prompt: userText,
      temperature: 0.7,
    });

    return result.toUIMessageStreamResponse({
      onFinish: async ({ messages }) => {
        // Save assistant message to database when stream finishes
        await MessageService.addMessage(
          conversationId,
          userId,
          'assistant',
          messages[messages.length - 1].parts,
          null,
        );
      },
    });
  }
}
