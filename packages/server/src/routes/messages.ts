import { Hono } from 'hono';
import { AppContext } from '../types/context';
import { MessageService } from '../services';
import { PaginatedResponse } from '../types';

const messages = new Hono<AppContext>();

// Get messages for a session (paginated)
messages.get('/list', async (c) => {
  const sessionId = c.req.query('sessionId');
  const page = Number(c.req.query('page') || '1');
  const pageSize = Number(c.req.query('pageSize') || '50');
  
  if (!sessionId) {
    return c.json({ error: 'sessionId is required' }, 400);
  }
  
  const result = await MessageService.getMessages(sessionId, page, pageSize);
  
  return c.json<PaginatedResponse<any>>(result);
});

// Send message (with SSE response)
messages.post('/send', async (c) => {
  const body = await c.req.json<{
    sessionId: string;
    content: string;
    context?: {
      systemPrompt?: string;
      temperature?: number;
      maxTokens?: number;
    };
  }>();
  
  const { sessionId, content, context } = body;
  
  if (!sessionId || !content) {
    return c.json({ error: 'sessionId and content are required' }, 400);
  }
  
  // Add user message
  const userMessage = await MessageService.addMessage(sessionId, 'user', content);
  
  // Set up SSE headers
  c.header('Content-Type', 'text/event-stream');
  c.header('Cache-Control', 'no-cache');
  c.header('Connection', 'keep-alive');
  
  // Create a readable stream for SSE
  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Send initial event
        controller.enqueue(`data: ${JSON.stringify({ type: 'user_message', data: userMessage })}\n\n`);
        
        // Simulate LLM processing delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Simulate streaming response chunks
        const responseText = `I received your message: "${content}". This is a mock response from the LLM.`;
        const chunks = responseText.split(' ');
        
        for (let i = 0; i < chunks.length; i++) {
          const chunk = chunks[i];
          const eventData = {
            type: 'assistant_message_chunk',
            data: {
              content: chunk + (i < chunks.length - 1 ? ' ' : ''),
              done: i === chunks.length - 1,
            },
          };
          
          controller.enqueue(`data: ${JSON.stringify(eventData)}\n\n`);
          
          // Small delay between chunks to simulate streaming
          await new Promise(resolve => setTimeout(resolve, 50));
        }
        
        // Add assistant message to database
        const assistantMessage = await MessageService.addMessage(sessionId, 'assistant', responseText);
        
        // Send completion event
        controller.enqueue(`data: ${JSON.stringify({ type: 'assistant_message', data: assistantMessage })}\n\n`);
        controller.enqueue(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
        
        controller.close();
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        controller.enqueue(`data: ${JSON.stringify({ type: 'error', error: errorMessage })}\n\n`);
        controller.close();
      }
    },
  });
  
  return c.body(stream);
});

export default messages;