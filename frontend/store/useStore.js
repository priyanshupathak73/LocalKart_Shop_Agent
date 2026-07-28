import { create } from 'zustand';

const initialProducts = [
  { id: '1', name: 'Organic Basmati Rice (1kg)', price: 120, stock: 8, category: 'Grains' },
  { id: '2', name: 'Fresh Cow Milk 1L', price: 65, stock: 45, category: 'Dairy' },
  { id: '3', name: 'Premium Almonds 500g', price: 450, stock: 12, category: 'Dry Fruits' },
  { id: '4', name: 'Brown Bread Whole Wheat', price: 45, stock: 5, category: 'Bakery' },
  { id: '5', name: 'Farm Fresh Tomatoes 1kg', price: 40, stock: 20, category: 'Vegetables' },
];

const initialOrders = [
  { 
    id: 'LK-9023', 
    customerName: 'Priya Sharma', 
    items: 'Organic Basmati Rice (2), Farm Fresh Tomatoes (1)', 
    total: 280, 
    status: 'Pending', 
    createdAt: '2026-06-17T10:30:00Z', 
    deliveryFee: 60, 
    address: 'Flat 304, Block A, Apex Heights, Sector 62',
    shopName: 'Gupta Kirana Store',
    shopAddress: 'Sector 4, Main Market, Noida'
  },
  { 
    id: 'LK-8891', 
    customerName: 'Aarav Mehta', 
    items: 'Fresh Cow Milk 1L (2), Brown Wheat Bread (1)', 
    total: 175, 
    status: 'Preparing', 
    createdAt: '2026-06-17T11:15:00Z', 
    deliveryFee: 40, 
    address: 'House 58, Gali 2, Sector 15',
    shopName: 'Gupta Kirana Store',
    shopAddress: 'Sector 4, Main Market, Noida'
  },
  { 
    id: 'LK-8772', 
    customerName: 'Kabir Singh', 
    items: 'Premium Almonds 500g (1)', 
    total: 450, 
    status: 'Out for Delivery', 
    createdAt: '2026-06-17T12:00:00Z', 
    deliveryFee: 80, 
    address: 'Villa 12, Spring Fields, Sector 120',
    shopName: 'Gupta Kirana Store',
    shopAddress: 'Sector 4, Main Market, Noida'
  },
  { 
    id: 'LK-8541', 
    customerName: 'Neha Gupta', 
    items: 'Fresh Cow Milk 1L (1)', 
    total: 65, 
    status: 'Delivered', 
    createdAt: '2026-06-17T09:00:00Z', 
    deliveryFee: 40, 
    address: 'Apt 102, Tower C, Eldeco Apts',
    shopName: 'Gupta Kirana Store',
    shopAddress: 'Sector 4, Main Market, Noida'
  },
];

export const useStore = create((set) => ({
  products: initialProducts,
  orders: initialOrders,
  
  // Product actions
  addProduct: (product) => set((state) => ({ 
    products: [{ ...product, id: Date.now().toString() }, ...state.products] 
  })),
  
  updateProduct: (updatedProduct) => set((state) => ({
    products: state.products.map((p) => p.id === updatedProduct.id ? updatedProduct : p)
  })),
  
  deleteProduct: (id) => set((state) => ({
    products: state.products.filter((p) => p.id !== id)
  })),
  
  updateProductStock: (id, stock) => set((state) => ({
    products: state.products.map((p) => p.id === id ? { ...p, stock: parseInt(stock) || 0 } : p)
  })),

  // Order actions
  updateOrderStatus: (id, status) => set((state) => ({
    orders: state.orders.map((o) => o.id === id ? { ...o, status } : o)
  })),
  
  addOrder: (order) => set((state) => ({
    orders: [{ ...order, id: `LK-${Math.floor(1000 + Math.random() * 9000)}`, createdAt: new Date().toISOString() }, ...state.orders]
  }))
}));
