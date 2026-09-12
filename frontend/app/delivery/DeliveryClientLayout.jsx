"use client";

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAppRouter } from '../../hooks/useAppRouter';
import { useAuthStore } from '../../store/useAuthStore';
import { DashboardLayout } from '../../components/DashboardLayout';
import { 
  LayoutDashboard, 
  Truck, 
  IndianRupee, 
  Settings,
  HelpCircle as SupportIcon
} from 'lucide-react';

const DeliveryLayoutContent = ({ children }) => {
  const { user, logout } = useAuthStore();
  const router = useAppRouter();
  const pathname = usePathname();

  // Delivery partner menu
  const deliveryMenu = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'deliveries', label: 'Deliveries', icon: Truck },
    { id: 'earnings', label: 'Earnings', icon: IndianRupee },
    { id: 'support', label: 'Support', icon: SupportIcon },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  // Determine active tab from pathname
  const pathParts = pathname.split('/');
  const activeTab = pathParts[pathParts.length - 1] === 'delivery' ? 'dashboard' : pathParts[pathParts.length - 1];

  const handleSetActiveTab = (tabId) => {
    router.push(`/delivery/${tabId}`);
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <DashboardLayout
      sidebarItems={deliveryMenu}
      activeTab={activeTab}
      setActiveTab={handleSetActiveTab}
      user={user}
      logout={handleLogout}
    >
      {children}
    </DashboardLayout>
  );
};

export default function DeliveryClientLayout({ children }) {
  const { user, isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const role = user?.role?.toLowerCase();
    if (mounted && (!isAuthenticated || (role !== 'delivery' && role !== 'delivery_partner'))) {
      window.location.href = '/';
    }
  }, [mounted, isAuthenticated, user]);

  const role = user?.role?.toLowerCase();
  if (!mounted || !isAuthenticated || (role !== 'delivery' && role !== 'delivery_partner')) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-400">Loading portal...</div>;
  }

  return <DeliveryLayoutContent>{children}</DeliveryLayoutContent>;
}
