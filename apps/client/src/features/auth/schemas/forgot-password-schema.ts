import { z } from 'zod';

export const forgotPasswordSchema = z.object({
  email_address: z.string().email({ message: 'Please enter a valid email address' }),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;