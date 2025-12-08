import { z } from 'zod';

/**
 * Registration form validation schema
 */
export const registrationSchema = z.object({
  surname: z
    .string()
    .min(1, 'Surname is required')
    .max(50, 'Surname cannot exceed 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Surname can only contain letters and spaces')
    .transform((val) => val.trim()),
  
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(50, 'First name cannot exceed 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'First name can only contain letters and spaces')
    .transform((val) => val.trim()),
  
  middleName: z
    .string()
    .min(1, 'Middle name is required')
    .max(50, 'Middle name cannot exceed 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Middle name can only contain letters and spaces')
    .transform((val) => val.trim()),
  
  email: z
    .string()
    .email('Invalid email address')
    .optional()
    .or(z.literal(''))
    .transform((val) => (val === '' ? undefined : val)),
  
  phone: z
    .string()
    .regex(/^[\d\s\-\+\(\)]*$/, 'Invalid phone number')
    .optional()
    .or(z.literal(''))
    .transform((val) => (val === '' ? undefined : val)),
});

export type RegistrationFormData = z.infer<typeof registrationSchema>;

/**
 * Name validation helper
 */
export const validateName = (name: string): boolean => {
  return /^[a-zA-Z\s]+$/.test(name) && name.trim().length > 0;
};

/**
 * Email validation helper
 */
export const validateEmail = (email: string): boolean => {
  if (!email) return true; // Email is optional
  return /^\S+@\S+\.\S+$/.test(email);
};

/**
 * Phone validation helper
 */
export const validatePhone = (phone: string): boolean => {
  if (!phone) return true; // Phone is optional
  return /^[\d\s\-\+\(\)]+$/.test(phone);
};
