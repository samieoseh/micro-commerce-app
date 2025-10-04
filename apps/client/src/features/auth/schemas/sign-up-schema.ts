import { z } from 'zod';

export const signUpSchema = z
  .object({
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .nonempty('Password is required')
      .min(8, 'Password must be at least 8 characters'),
    confirmPassword: z
      .string()
      .nonempty('Confirm Password is required')
      .min(8, 'Confirm Password must be at least 8 characters'),
    termsAndondition: z.boolean().refine((value) => value === true, {
      message: 'You must agree to the terms and conditions',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'], // Display error on confirmPassword field
    message: 'Passwords must match',
  });

export type SignUpFormData = z.infer<typeof signUpSchema>;