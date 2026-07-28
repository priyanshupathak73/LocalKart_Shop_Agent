"use client";

import React from 'react';
import { useAppRouter } from '../../../hooks/useAppRouter';
import { StatsHome } from '../../../components/shopkeeper/StatsHome';

export default function ShopkeeperDashboardPage() {
  const router = useAppRouter();
  
  const handleSetActiveTab = (tabId) => {
    router.push(`/shopkeeper/${tabId}`);
  };

  return <StatsHome setActiveTab={handleSetActiveTab} />;
}
