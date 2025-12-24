'use client';

import { useState, useEffect } from 'react';
import { X, Download, Smartphone } from 'lucide-react';

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [showIOSPrompt, setShowIOSPrompt] = useState(false);

  useEffect(() => {
    // Don't show if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return;
    }

    // Check if user dismissed recently (within 24 hours)
    const dismissed = localStorage.getItem('pwa-prompt-dismissed');
    if (dismissed && Date.now() - parseInt(dismissed) < 86400000) {
      return;
    }

    // iOS detection and prompt
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS && !('standalone' in navigator && (navigator as any).standalone)) {
      setTimeout(() => setShowIOSPrompt(true), 3000);
      return;
    }

    // Android/Desktop Chrome prompt
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setTimeout(() => setShowPrompt(true), 3000);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    await deferredPrompt.userChoice;

    setShowPrompt(false);
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setShowIOSPrompt(false);
    localStorage.setItem('pwa-prompt-dismissed', Date.now().toString());
  };

  if (!showPrompt && !showIOSPrompt) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-gradient-to-r from-amber-900 to-amber-800 border-t border-amber-600 shadow-lg">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-4 flex-wrap md:flex-nowrap">
        <div className="flex items-center gap-3 flex-1">
          <div className="p-2 bg-amber-600 rounded-lg flex-shrink-0">
            <Smartphone className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white">
              Install The Cracked Grain App
            </h3>
            <p className="text-sm text-amber-200">
              {showIOSPrompt
                ? 'Tap Share → Add to Home Screen'
                : 'Offline brewing tools, recipes & more'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!showIOSPrompt && (
            <button
              onClick={handleInstall}
              className="flex items-center gap-2 px-4 py-2 bg-white text-amber-900 rounded-lg font-medium hover:bg-amber-100 transition-colors"
            >
              <Download className="w-4 h-4" />
              Install
            </button>
          )}
          <button
            onClick={handleDismiss}
            className="p-2 text-amber-200 hover:text-white transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
