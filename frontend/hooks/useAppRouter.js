"use client";

import { useRouter as useNextRouter } from 'next/navigation';

export function useAppRouter() {
  const router = useNextRouter();

  const triggerLoading = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('routeChangeStart'));
    }
  };

  return {
    push: (href, options) => {
      triggerLoading();
      return router.push(href, options);
    },
    replace: (href, options) => {
      triggerLoading();
      return router.replace(href, options);
    },
    back: () => router.back(),
    forward: () => router.forward(),
    refresh: () => router.refresh(),
    prefetch: (href, options) => router.prefetch(href, options)
  };
}
