import { z } from 'zod';

// Shared fields
const emailSchema = z.string().email('Please enter a valid email address');
const passwordSchema = z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .max(100, 'Password is too long');
const phoneSchema = z
    .string()
    .regex(/^[\d\-\(\)\s\+]+$/, 'Please enter a valid phone number')
    .min(10, 'Phone number must be at least 10 digits long');

// Login Form
export const loginSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
    role: z.enum(['customer', 'mechanic'], {
        message: 'Please select your role',
    }),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Customer Registration
export const registerCustomerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: emailSchema,
    phone: phoneSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});

export type RegisterCustomerFormData = z.infer<typeof registerCustomerSchema>;

// Mechanic Registration
export const registerMechanicSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: emailSchema,
    phone: phoneSchema,
    salary: z.number().min(0, 'Salary must be a positive number'),
    password: passwordSchema,
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});

export type RegisterMechanicFormData = z.infer<typeof registerMechanicSchema>;