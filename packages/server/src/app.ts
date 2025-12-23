import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { auth } from './lib/auth';
import { errorHandler, requestLogger, responseWrapper } from './middleware';
import healthRoutes from './routes/health';
import messageRoutes from './routes/messages';
import sessionRoutes from './routes/sessions';

const app = new Hono();

// CORS configuration for Better Auth
app.use(
  '*',
  cors({
    origin: ['http://localhost:1420', 'tauri://localhost'],
    credentials: true,
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  }),
);

// Global middleware
app.use('*', requestLogger);
app.use('*', errorHandler);
app.use('*', responseWrapper);

// Better Auth routes
app.on(['GET', 'POST'], '/api/auth/*', (c) => auth.handler(c.req.raw));

// Routes
app.route('/health', healthRoutes);
app.route('/api/sessions', sessionRoutes);
app.route('/api/messages', messageRoutes);

// Root route
app.get('/', (c) => {
  return c.json({
    message: 'Chat Desktop App API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      sessions: '/api/sessions',
      messages: '/api/messages',
    },
  });
});

// 404 handler
app.notFound((c) => {
  return c.json(
    { error: 'Not Found', message: 'The requested resource was not found' },
    404,
  );
});

export default app;
