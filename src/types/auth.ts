export type AuthenticateBuilder = {
  path: '/g/s/auth/login' | '/g/s/auth/register';
  email: string;
  secret: string;
  body?: Record<string, unknown>;
};
