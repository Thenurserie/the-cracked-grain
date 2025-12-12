'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

export function AgeVerification() {
  const [showModal, setShowModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const isVerified = localStorage.getItem('age_verified');
    if (!isVerified) {
      setShowModal(true);
    }
  }, []);

  const handleYes = () => {
    localStorage.setItem('age_verified', 'true');
    setShowModal(false);
  };

  const handleNo = () => {
    window.location.href = 'https://www.google.com';
  };

  if (!mounted || !showModal) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-[#1a1a1a] border-2 border-gold rounded-lg p-8 max-w-md mx-4 text-center">
        <h2 className="text-3xl font-bold text-gold mb-4">Age Verification</h2>
        <p className="text-cream/90 text-lg mb-6">
          You must be 21 years or older to access this website.
        </p>
        <p className="text-cream/80 mb-8">
          Are you 21 or older?
        </p>
        <div className="flex gap-4 justify-center">
          <Button
            onClick={handleYes}
            className="bg-amber hover:bg-gold text-white px-8 py-6 text-lg font-semibold"
          >
            Yes, I am 21+
          </Button>
          <Button
            onClick={handleNo}
            variant="outline"
            className="border-2 border-cream/30 text-cream hover:bg-cream/10 px-8 py-6 text-lg font-semibold"
          >
            No
          </Button>
        </div>
      </div>
    </div>
  );
}
