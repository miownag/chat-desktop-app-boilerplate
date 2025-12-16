import { Hono } from 'hono';
import { AppContext } from '../types/context';
import { SessionService } from '../services';
import { PaginatedResponse } from '../types';

const sessions = new Hono<AppContext>();

// Get sessions list (paginated)
sessions.get('/list', async (c) => {
  const page = Number(c.req.query('page') || '1');
  const pageSize = Number(c.req.query('pageSize') || '10');
  
  const result = await SessionService.getSessions(page, pageSize);
  
  return c.json<PaginatedResponse<any>>(result);
});

// Create new session
sessions.post('/create', async (c) => {
  const body = await c.req.json<{ title?: string }>();
  const session = await SessionService.createSession(body?.title);
  
  return c.json(session, 201);
});

// Get session by ID
sessions.get('/get/:id', async (c) => {
  const id = c.req.param('id');
  const session = await SessionService.getSessionById(id);
  
  if (!session) {
    return c.json({ error: 'Session not found' }, 404);
  }
  
  return c.json(session);
});

// Delete session
sessions.delete('/delete/:id', async (c) => {
  const id = c.req.param('id');
  const deleted = await SessionService.deleteSession(id);
  
  if (!deleted) {
    return c.json({ error: 'Session not found' }, 404);
  }
  
  return c.json({ message: 'Session deleted successfully' });
});

export default sessions;