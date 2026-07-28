import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding LocalKart database...');

  // Clean existing data
  await prisma.inventoryLog.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.deliveryPartner.deleteMany();
  await prisma.shop.deleteMany();
  await prisma.user.deleteMany();

  const password = await bcrypt.hash('password123', 12);

  // ── Shopkeeper ──────────────────────────────────────────────────────────────
  const shopkeeperUser = await prisma.user.create({
    data: {
      name: 'Suresh Gupta',
      email: 'suresh@localkart.com',
      password,
      phone: '9876543210',
      role: 'SHOPKEEPER',
      shop: {
        create: {
          name: 'Gupta Kirana Store',
          description: 'Fresh groceries and daily essentials delivered to your doorstep',
          address: 'Sector 4, Main Market, Noida, UP - 201301',
          phone: '9876543210',
          isActive: true,
        },
      },
    },
    include: { shop: true },
  });

  const shop = shopkeeperUser.shop;
  console.log(`✅ Shopkeeper created: ${shopkeeperUser.email}`);

  // ── Products ─────────────────────────────────────────────────────────────────
  const productsData = [
    { name: 'Organic Basmati Rice 1kg', description: 'Premium organic basmati rice', price: 120, stock: 8, category: 'Grains' },
    { name: 'Fresh Cow Milk 1L', description: 'Farm-fresh pasteurized cow milk', price: 65, stock: 45, category: 'Dairy' },
    { name: 'Premium Almonds 500g', description: 'California-origin premium almonds', price: 450, stock: 12, category: 'Dry Fruits' },
    { name: 'Brown Bread Whole Wheat', description: 'Multigrain healthy bread loaf', price: 45, stock: 5, category: 'Bakery' },
    { name: 'Farm Fresh Tomatoes 1kg', description: 'Locally sourced red tomatoes', price: 40, stock: 20, category: 'Vegetables' },
    { name: 'Sunflower Oil 1L', description: 'Refined sunflower cooking oil', price: 150, stock: 30, category: 'Oils' },
    { name: 'Atta Whole Wheat 5kg', description: 'Premium chakki atta for soft rotis', price: 270, stock: 3, category: 'Grains' },
    { name: 'Paneer 200g', description: 'Fresh soft cottage cheese', price: 90, stock: 15, category: 'Dairy' },
  ];

  for (const p of productsData) {
    const product = await prisma.product.create({ data: { shopId: shop.id, ...p } });
    await prisma.inventoryLog.create({
      data: { productId: product.id, changeAmount: p.stock, reason: 'Initial seed stock', stockBefore: 0, stockAfter: p.stock },
    });
  }
  console.log(`✅ ${productsData.length} products created`);

  // ── Delivery Partner ─────────────────────────────────────────────────────────
  const deliveryUser = await prisma.user.create({
    data: {
      name: 'Ramesh Kumar',
      email: 'ramesh@localkart.com',
      password,
      phone: '9123456789',
      role: 'DELIVERY_PARTNER',
      deliveryPartner: {
        create: {
          vehicleType: 'MOTORCYCLE',
          isAvailable: true,
          rating: 4.8,
          totalDeliveries: 42,
          totalEarnings: 3360,
        },
      },
    },
    include: { deliveryPartner: true },
  });
  console.log(`✅ Delivery partner created: ${deliveryUser.email}`);

  // ── Sample Orders ────────────────────────────────────────────────────────────
  const products = await prisma.product.findMany({ where: { shopId: shop.id } });

  await prisma.order.create({
    data: {
      shopId: shop.id,
      status: 'Pending',
      totalAmount: 280,
      deliveryFee: 60,
      customerName: 'Priya Sharma',
      customerPhone: '9000011111',
      deliveryAddress: 'Flat 304, Block A, Apex Heights, Sector 62, Noida',
      items: {
        create: [
          { productId: products[0].id, quantity: 2, unitPrice: 120 },
          { productId: products[4].id, quantity: 1, unitPrice: 40 },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      shopId: shop.id,
      deliveryPartnerId: deliveryUser.deliveryPartner.id,
      status: 'InTransit',
      totalAmount: 175,
      deliveryFee: 40,
      customerName: 'Aarav Mehta',
      customerPhone: '9000022222',
      deliveryAddress: 'House 58, Gali 2, Sector 15, Noida',
      items: {
        create: [
          { productId: products[1].id, quantity: 2, unitPrice: 65 },
          { productId: products[3].id, quantity: 1, unitPrice: 45 },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      shopId: shop.id,
      deliveryPartnerId: deliveryUser.deliveryPartner.id,
      status: 'Delivered',
      totalAmount: 450,
      deliveryFee: 80,
      customerName: 'Kabir Singh',
      customerPhone: '9000033333',
      deliveryAddress: 'Villa 12, Spring Fields, Sector 120, Noida',
      items: {
        create: [{ productId: products[2].id, quantity: 1, unitPrice: 450 }],
      },
    },
  });

  console.log('✅ 3 sample orders created');
  console.log('\n🎉 Seed complete!');
  console.log('──────────────────────────────────────────');
  console.log('📧 Shopkeeper:        suresh@localkart.com / password123');
  console.log('📧 Delivery Partner:  ramesh@localkart.com / password123');
  console.log('──────────────────────────────────────────');
}

main()
  .catch((e) => { console.error('❌ Seed failed:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
