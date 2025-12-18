import { Suspense } from 'react';
import ShopContent from './ShopContent';

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber mb-4"></div>
            <p className="text-cream text-lg">Loading shop...</p>
          </div>
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
