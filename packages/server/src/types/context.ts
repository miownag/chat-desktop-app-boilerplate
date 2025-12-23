import type { Session, User } from 'better-auth';

export interface AppContext {
  Variables: {
    requestId: string;
    timestamp: number;
    user: User | null;
    session: Session | null;
  };
}
