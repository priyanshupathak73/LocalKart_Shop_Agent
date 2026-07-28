import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional(),
  role: z.enum(['SHOPKEEPER', 'DELIVERY_PARTNER'], {
    errorMap: () => ({ message: 'Role must be SHOPKEEPER or DELIVERY_PARTNER' }),
  }),
  // SHOPKEEPER fields
  shopName: z.string().optional(),
  shopAddress: z.string().optional(),
  // DELIVERY_PARTNER fields
  vehicleType: z.enum(['BICYCLE', 'MOTORCYCLE', 'CAR', 'AUTO']).optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});
