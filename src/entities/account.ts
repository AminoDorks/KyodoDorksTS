import z from 'zod';

export const AccountSchema = z.object({
  uid: z.string(),
  username: z.string(),
  isEmailVerified: z.boolean(),
  premiumType: z.number(),
  status: z.number(),
  createdTime: z.string(),
  email: z.string(),
});

export type Account = z.infer<typeof AccountSchema>;
