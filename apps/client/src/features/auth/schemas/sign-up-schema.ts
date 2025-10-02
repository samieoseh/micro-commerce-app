import { z } from 'zod';

export const signUpSchema = z
  .object({
    first_name: z.string().min(1, 'First Name is required'),
    last_name: z.string().nonempty('Last Name is required'),
    email_address: z.string().email('Invalid email address'),
    password: z
      .string()
      .nonempty('Password is required')
      .min(8, 'Password must be at least 8 characters'),
    confirm_password: z
      .string()
      .nonempty('Confirm Password is required')
      .min(8, 'Confirm Password must be at least 8 characters'),
    mobile_number: z
      .string()
      .nonempty('Mobile Number is required')
      .min(9, 'Mobile number cannot be less than 9')
      .max(15, 'Mobile number cannot be more than 15'),
    referral_code: z.string().optional(),
    terms_and_condition: z.boolean().refine((value) => value === true, {
      message: 'You must agree to the terms and conditions',
    }),
  })
  .refine((data) => data.password === data.confirm_password, {
    path: ['confirmPassword'], // Display error on confirmPassword field
    message: 'Passwords must match',
  });

export type SignUpFormData = z.infer<typeof signUpSchema>;