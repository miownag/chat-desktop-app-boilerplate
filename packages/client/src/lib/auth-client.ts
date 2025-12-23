import { createAuthClient } from 'better-auth/react';

const isDev = import.meta.env.DEV;
const BASE_URL = isDev ? 'http://localhost:3000' : 'https://api.example.com';

export const authClient = createAuthClient({
  baseURL: BASE_URL,
  fetchOptions: {
    credentials: 'include',
  },
});

export const { signIn, signUp, signOut, useSession, getSession } = authClient;
