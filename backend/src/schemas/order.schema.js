import { z } from 'zod';

export const createOrderSchema = z.object({
  shopId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid shop ID'),
  customerName: z.string().min(2),
  customerPhone: z.string().min(10),
  deliveryAddress: z.string().min(10),
  notes: z.string().optional(),
  items: z
    .array(
      z.object({
        productId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid product ID'),
        quantity: z.number().int().positive('Quantity must be at least 1'),
      })
    )
    .min(1, 'Order must have at least one item'),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(['Pending', 'Accepted', 'PickedUp', 'InTransit', 'Delivered', 'Cancelled']),
  notes: z.string().optional(),
});

export const deliveryAvailabilitySchema = z.object({
  isAvailable: z.boolean(),
});
