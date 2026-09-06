import { create } from 'zustand';

export const useStore = create((set) => ({
  products: [],
  orders: [],
  
  // Set catalog & orders from API
  setProducts: (products) => set({ products }),
  setOrders: (orders) => set({ orders }),

  // Product actions
  addProduct: (product) => set((state) => ({ 
    products: [{ ...product, id: product.id || Date.now().toString() }, ...state.products] 
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
    orders: [{ ...order, id: order.id || `LK-${Math.floor(1000 + Math.random() * 9000)}`, createdAt: new Date().toISOString() }, ...state.orders]
  }))
}));
