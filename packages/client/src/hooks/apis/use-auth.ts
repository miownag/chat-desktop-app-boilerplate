import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { QueryKeys } from '@/constants';
import { getSession, signIn, signOut, signUp } from '@/lib/auth-client';
import { useAuthStore } from '@/stores/auth';

// Query key for auth session
export const AUTH_QUERY_KEY = 'auth-session';

// Hook to get and sync session with Zustand store
export function useAuth() {
  const { setAuth, clearAuth, setIsLoading } = useAuthStore();
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [AUTH_QUERY_KEY],
    queryFn: async () => {
      const session = await getSession();
      return session;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });

  // Sync session data with Zustand store
  useEffect(() => {
    if (isLoading) {
      setIsLoading(true);
      return;
    }

    if (data?.data?.user && data?.data?.session) {
      // biome-ignore lint/suspicious/noExplicitAny: Better Auth types are complex
      setAuth(data.data.user as any, data.data.session as any);
    } else {
      clearAuth();
    }
  }, [data, isLoading, setAuth, clearAuth, setIsLoading]);

  const refreshSession = async () => {
    await queryClient.invalidateQueries({ queryKey: [AUTH_QUERY_KEY] });
  };

  return {
    user: data?.data?.user ?? null,
    session: data?.data?.session ?? null,
    isLoading,
    isAuthenticated: !!data?.data?.user,
    error,
    refetch,
    refreshSession,
  };
}

// Email sign in mutation with auto-register
export function useEmailSignIn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      // Try to sign in first
      const signInResult = await signIn.email({
        email,
        password,
      });

      // If sign in succeeds, return the data
      if (!signInResult.error) {
        return signInResult.data;
      }

      // If user not found, auto-register then sign in
      const errorCode = signInResult.error.code;
      if (
        errorCode === 'INVALID_EMAIL_OR_PASSWORD' ||
        errorCode === 'USER_NOT_FOUND'
      ) {
        // Auto-register with email as name
        const name = email.split('@')[0];
        const signUpResult = await signUp.email({
          email,
          password,
          name,
        });

        if (signUpResult.error) {
          // If registration also fails, throw the original sign-in error
          throw new Error(signInResult.error.message);
        }

        // Registration succeeded, user is now signed in
        return signUpResult.data;
      }

      // Other errors, throw as-is
      throw new Error(signInResult.error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [AUTH_QUERY_KEY] });
    },
  });
}

// Email sign up mutation
export function useEmailSignUp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      email,
      password,
      name,
    }: {
      email: string;
      password: string;
      name: string;
    }) => {
      const result = await signUp.email({
        email,
        password,
        name,
      });
      if (result.error) {
        throw new Error(result.error.message);
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [AUTH_QUERY_KEY] });
    },
  });
}

// Social sign in mutations
export function useGithubSignIn() {
  return useMutation({
    mutationFn: async () => {
      const result = await signIn.social({
        provider: 'github',
        callbackURL: window.location.origin,
      });
      if (result.error) {
        throw new Error(result.error.message);
      }
      return result.data;
    },
  });
}

export function useGoogleSignIn() {
  return useMutation({
    mutationFn: async () => {
      const result = await signIn.social({
        provider: 'google',
        callbackURL: window.location.origin,
      });
      if (result.error) {
        throw new Error(result.error.message);
      }
      return result.data;
    },
  });
}

// Sign out mutation
export function useSignOut() {
  const queryClient = useQueryClient();
  const { clearAuth } = useAuthStore();

  return useMutation({
    mutationFn: async () => {
      const result = await signOut();
      return result;
    },
    onSuccess: () => {
      clearAuth();
      queryClient.invalidateQueries({ queryKey: [AUTH_QUERY_KEY] });
      // Also invalidate other queries that depend on auth
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.CONVERSATION_LIST],
      });
    },
  });
}
