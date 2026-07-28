"use client";

import React from 'react';
import { useAppRouter } from '../../../hooks/useAppRouter';
import { StatsHome } from '../../../components/delivery/StatsHome';

export default function DeliveryDashboardPage() {
  const router = useAppRouter();
  
  const handleSetActiveTab = (tabId) => {
    router.push(`/delivery/${tabId}`);
  };

  return <StatsHome setActiveTab={handleSetActiveTab} />;
}
