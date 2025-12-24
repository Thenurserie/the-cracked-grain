'use client';

import { useState, useEffect } from 'react';
import { X, Download, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [showIOSPrompt, setShowIOSPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed as PWA
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Check if user dismissed within last 24 hours
    const dismissed = localStorage.getItem('pwa-prompt-dismissed');
    if (dismissed) {
      const dismissedTime = parseInt(dismissed, 10);
      if (Date.now() - dismissedTime < 24 * 60 * 60 * 1000) {
        return;
      }
    }

    // Check for iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isInStandaloneMode = ('standalone' in window.navigator) && (window.navigator as any).standalone;

    if (isIOS && !isInStandaloneMode) {
      setTimeout(() => setShowIOSPrompt(true), 3000);
      return;
    }

    // Listen for beforeinstallprompt (Android/Desktop Chrome)
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setTimeout(() => setShowPrompt(true), 3000);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Listen for successful install
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setShowIOSPrompt(false);
    localStorage.setItem('pwa-prompt-dismissed', Date.now().toString());
  };

  // Don't render if installed or nothing to show
  if (isInstalled || (!showPrompt && !showIOSPrompt)) {
    return null;
  }

  return (
    <>
      {/* Floating banner - fixed to bottom */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 animate-in slide-in-from-bottom duration-300"
        style={{
          background: 'linear-gradient(to right, #1c1917, #292524)',
          borderTop: '1px solid #d97706',
          boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.5)',
        }}
      >
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">

            {/* Left side - Icon and text */}
            <div className="flex items-center gap-3">
              <div
                className="p-2 rounded-lg flex-shrink-0"
                style={{ backgroundColor: '#d97706' }}
              >
                <Smartphone className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3
                  className="font-semibold text-sm sm:text-base"
                  style={{ color: '#fbbf24' }}
                >
                  Install The Cracked Grain
                </h3>
                <p
                  className="text-xs sm:text-sm"
                  style={{ color: '#a8a29e' }}
                >
                  {showIOSPrompt
                    ? 'Tap Share, then "Add to Home Screen"'
                    : 'Offline brewing tools & recipes'}
                </p>
              </div>
            </div>

            {/* Right side - Buttons */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Install button - only show for non-iOS */}
              {!showIOSPrompt && (
                <button
                  onClick={handleInstall}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all hover:scale-105"
                  style={{
                    backgroundColor: '#d97706',
                    color: '#ffffff',
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#b45309'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#d97706'}
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Install</span>
                </button>
              )}

              {/* iOS Share icon hint */}
              {showIOSPrompt && (
                <div
                  className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm"
                  style={{ backgroundColor: '#292524', color: '#d97706' }}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 5l-1.42 1.42-1.59-1.59V16h-1.98V4.83L9.42 6.42 8 5l4-4 4 4zm4 5v11c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2V10c0-1.1.9-2 2-2h3v2H6v11h12V10h-3V8h3c1.1 0 2 .9 2 2z"/>
                  </svg>
                  <span>→ Add to Home</span>
                </div>
              )}

              {/* Dismiss button */}
              <button
                onClick={handleDismiss}
                className="p-2 rounded-lg transition-colors"
                style={{ color: '#78716c' }}
                onMouseOver={(e) => e.currentTarget.style.color = '#ffffff'}
                onMouseOut={(e) => e.currentTarget.style.color = '#78716c'}
                aria-label="Dismiss"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
