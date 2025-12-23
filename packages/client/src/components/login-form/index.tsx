import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { SiGithub } from 'react-icons/si';
import { Button } from '@/components/ui/button';
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  useEmailSignIn,
  useEmailSignUp,
  useGithubSignIn,
  useGoogleSignIn,
} from '@/hooks/apis/use-auth';
import { cn } from '@/lib/utils';

type AuthMode = 'signin' | 'signup';

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const emailSignIn = useEmailSignIn();
  const emailSignUp = useEmailSignUp();
  const githubSignIn = useGithubSignIn();
  const googleSignIn = useGoogleSignIn();

  const isLoading =
    emailSignIn.isPending ||
    emailSignUp.isPending ||
    githubSignIn.isPending ||
    googleSignIn.isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'signin') {
      await emailSignIn.mutateAsync({ email, password });
    } else {
      await emailSignUp.mutateAsync({ email, password, name });
    }
  };

  const handleGithubLogin = async () => {
    await githubSignIn.mutateAsync();
  };

  const handleGoogleLogin = async () => {
    await googleSignIn.mutateAsync();
  };

  const toggleMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
    setEmail('');
    setPassword('');
    setName('');
  };

  const error =
    emailSignIn.error ||
    emailSignUp.error ||
    githubSignIn.error ||
    googleSignIn.error;

  return (
    <div className={cn('flex flex-col gap-8', className)} {...props}>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">
          {mode === 'signin' ? (
            <>
              Welcome back to <span className="gradient-text">Bricks</span>
            </>
          ) : (
            <>
              Create your <span className="gradient-text">Bricks</span> account
            </>
          )}
        </CardTitle>
        <CardDescription>
          {mode === 'signin'
            ? 'Login with your Google or GitHub account'
            : 'Sign up with your email or social account'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <Button
                variant="outline"
                type="button"
                className="cursor-pointer"
                onClick={handleGoogleLogin}
                disabled={isLoading}
              >
                <FcGoogle />
                {mode === 'signin'
                  ? 'Login with Google'
                  : 'Sign up with Google'}
              </Button>
              <Button
                variant="outline"
                type="button"
                className="cursor-pointer"
                onClick={handleGithubLogin}
                disabled={isLoading}
              >
                <SiGithub />
                {mode === 'signin'
                  ? 'Login with GitHub'
                  : 'Sign up with GitHub'}
              </Button>
            </Field>
            <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
              Or continue with email
            </FieldSeparator>
            {mode === 'signup' && (
              <Field>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={mode === 'signup'}
                  disabled={isLoading}
                />
              </Field>
            )}
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </Field>
            <Field>
              <div className="flex items-center">
                <FieldLabel htmlFor="password">Password</FieldLabel>
                {mode === 'signin' && (
                  <a
                    href="https://www.example.com"
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                )}
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </Field>
            {error && (
              <Field>
                <p className="text-sm text-destructive text-center">
                  {error.message}
                </p>
              </Field>
            )}
            <Field>
              <Button
                type="submit"
                className="mb-4 cursor-pointer"
                disabled={isLoading}
              >
                {isLoading
                  ? 'Loading...'
                  : mode === 'signin'
                    ? 'Login'
                    : 'Sign Up'}
              </Button>
              <FieldDescription className="px-6 text-center">
                {mode === 'signin' ? (
                  <>
                    Don't have an account?{' '}
                    <button
                      type="button"
                      className="underline underline-offset-4 hover:text-primary"
                      onClick={toggleMode}
                    >
                      Sign up
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{' '}
                    <button
                      type="button"
                      className="underline underline-offset-4 hover:text-primary"
                      onClick={toggleMode}
                    >
                      Login
                    </button>
                  </>
                )}
              </FieldDescription>
              <FieldDescription className="px-6 text-center mt-2">
                By clicking continue, you agree to our{' '}
                <a href="https://www.example.com">Terms of Service</a> and{' '}
                <a href="https://www.example.com">Privacy Policy</a>.
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </div>
  );
}
