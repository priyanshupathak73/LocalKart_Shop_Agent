"use client";

import { useEffect } from 'react';
import { useAppRouter } from '../../hooks/useAppRouter';

export default function DeliveryIndex() {
  const router = useAppRouter();

  useEffect(() => {
    router.replace('/delivery/dashboard');
  }, [router]);

  return null;
}
