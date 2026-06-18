const { z } = require('zod');

const createProductSchema = z.object({
  name: z.string().min(2, 'Product name is required'),
  description: z.string().optional(),
  price: z.number().positive('Price must be a positive number'),
  stock: z.number().int().min(0, 'Stock cannot be negative'),
  category: z.string().min(1, 'Category is required'),
  imageUrl: z.string().url().optional().or(z.literal('')),
  isAvailable: z.boolean().optional().default(true),
});

const updateProductSchema = createProductSchema.partial();

const updateStockSchema = z.object({
  stock: z.number().int().min(0),
  reason: z.string().min(1, 'Reason for stock change is required'),
});

const shopUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional(),
  address: z.string().min(5).optional(),
  phone: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal('')),
  isActive: z.boolean().optional(),
});

module.exports = {
  createProductSchema,
  updateProductSchema,
  updateStockSchema,
  shopUpdateSchema,
};
