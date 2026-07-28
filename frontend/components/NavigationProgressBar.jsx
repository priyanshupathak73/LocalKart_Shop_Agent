"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

const ProgressBarInnerContent = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  // Stop loading and complete progress on route change
  useEffect(() => {
    setProgress(100);
    const timer = setTimeout(() => {
      setLoading(false);
      setVisible(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  // Handle loading bar progression
  useEffect(() => {
    let timer;
    let safetyTimer;
    if (loading) {
      setVisible(true);
      setProgress(10);
      
      timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(timer);
            return 90;
          }
          const increment = prev < 50 ? 10 : 2;
          return prev + increment;
        });
      }, 80);

      // Safety fallback to clean up if navigation hangs
      safetyTimer = setTimeout(() => {
        setProgress(100);
        setTimeout(() => {
          setLoading(false);
          setVisible(false);
        }, 150);
      }, 600);
    } else {
      if (progress === 100) {
        timer = setTimeout(() => {
          setProgress(0);
          setVisible(false);
        }, 200);
      }
    }
    return () => {
      if (timer) clearInterval(timer);
      if (safetyTimer) clearTimeout(safetyTimer);
    };
  }, [loading, progress]);

  // Intercept standard anchor clicks and custom route transitions
  useEffect(() => {
    const handleStart = () => {
      setLoading(true);
    };

    const handleAnchorClick = (e) => {
      const target = e.target.closest('a');
      if (!target) return;

      const href = target.getAttribute('href');
      if (!href) return;

      // Ignore hash links, external links, and target="_blank"
      if (
        href.startsWith('#') || 
        href.startsWith('mailto:') || 
        href.startsWith('tel:') || 
        target.getAttribute('target') === '_blank'
      ) {
        return;
      }

      // Ignore if navigating to current path
      try {
        const currentUrl = new URL(window.location.href);
        const targetUrl = new URL(href, window.location.href);
        if (currentUrl.pathname === targetUrl.pathname && currentUrl.search === targetUrl.search) {
          return;
        }
      } catch (err) {
        return;
      }

      setLoading(true);
    };

    document.addEventListener('click', handleAnchorClick, { capture: true });
    window.addEventListener('routeChangeStart', handleStart);

    return () => {
      document.removeEventListener('click', handleAnchorClick, { capture: true });
      window.removeEventListener('routeChangeStart', handleStart);
    };
  }, []);

  return (
    <>
      {/* Sleek top progress bar */}
      {(visible || loading) && (
        <div className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none">
          <div 
            className="h-[3px] bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-500 transition-all duration-200 ease-out shadow-[0_0_8px_rgba(16,185,129,0.7)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Backdrop loading overlay for page transitions */}
      {loading && (
        <div className="fixed inset-0 z-[9998] flex flex-col items-center justify-center bg-slate-900/10 backdrop-blur-[2px] transition-all duration-300">
          <div className="bg-white/95 border border-slate-200/80 rounded-2xl p-5 flex items-center gap-3.5 shadow-2xl select-none animate-pulse">
            <div className="w-5 h-5 rounded-full border-2 border-slate-100 border-t-emerald-500 animate-spin"></div>
            <span className="text-xs font-bold text-slate-700 tracking-wider">Loading Page...</span>
          </div>
        </div>
      )}
    </>
  );
};

const ProgressBarInner = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return <ProgressBarInnerContent />;
};

export default function NavigationProgressBar() {
  return (
    <Suspense fallback={null}>
      <ProgressBarInner />
    </Suspense>
  );
}
