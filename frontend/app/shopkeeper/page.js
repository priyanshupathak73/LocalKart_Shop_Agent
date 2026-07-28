"use client";

import { useEffect } from 'react';
import { useAppRouter } from '../../hooks/useAppRouter';

export default function ShopkeeperIndex() {
  const router = useAppRouter();

  useEffect(() => {
    router.replace('/shopkeeper/dashboard');
  }, [router]);

  return null;
}
