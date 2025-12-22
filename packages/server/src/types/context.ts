import type { Context } from 'hono';

export interface AppContext extends Context {
  Variables: {
    requestId: string;
    timestamp: number;
  };
}
