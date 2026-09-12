"use client";

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAppRouter } from '../../hooks/useAppRouter';
import { useAuthStore } from '../../store/useAuthStore';
import { DashboardLayout } from '../../components/DashboardLayout';
import { 
  LayoutDashboard, 
  Package, 
  ClipboardList, 
  Users, 
  IndianRupee, 
  Star, 
  Settings, 
  ShoppingBag,
  User
} from 'lucide-react';

const ShopkeeperLayoutContent = ({ children }) => {
  const { user, logout } = useAuthStore();
  const router = useAppRouter();
  const pathname = usePathname();

  // Shopkeeper menu
  const shopkeeperMenu = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'inventory', label: 'Inventory', icon: ClipboardList },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'earnings', label: 'Earnings', icon: IndianRupee },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  // Determine active tab from pathname
  const pathParts = pathname.split('/');
  const activeTab = pathParts[pathParts.length - 1] === 'shopkeeper' ? 'dashboard' : pathParts[pathParts.length - 1];

  useEffect(() => {
    shopkeeperMenu.forEach(item => {
      router.prefetch(`/shopkeeper/${item.id}`);
    });
    router.prefetch('/shopkeeper/profile');
  }, [router]);

  const handleSetActiveTab = (tabId) => {
    router.push(`/shopkeeper/${tabId}`);
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <DashboardLayout
      sidebarItems={shopkeeperMenu}
      activeTab={activeTab}
      setActiveTab={handleSetActiveTab}
      user={user}
      logout={handleLogout}
    >
      {children}
    </DashboardLayout>
  );
};

export default function ShopkeeperClientLayout({ children }) {
  const { user, isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && (!isAuthenticated || user?.role?.toLowerCase() !== 'shopkeeper')) {
      window.location.href = '/';
    }
  }, [mounted, isAuthenticated, user]);

  if (!mounted || !isAuthenticated || user?.role?.toLowerCase() !== 'shopkeeper') {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-400">Loading portal...</div>;
  }

  return <ShopkeeperLayoutContent>{children}</ShopkeeperLayoutContent>;
}
