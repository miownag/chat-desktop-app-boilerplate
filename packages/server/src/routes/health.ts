import { Hono } from 'hono';
import { AppContext } from '../types/context';

const health = new Hono<AppContext>();

health.get('/', (c) => {
  return c.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

export default health;