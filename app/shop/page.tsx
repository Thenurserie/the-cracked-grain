import { Suspense } from 'react';
import Image from 'next/image';
import ShopContent from './ShopContent';

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <Image
              src="https://admin.thecrackedgrain.com/assets/5a80e87b-402a-4d9b-b8f2-c1622865aa46"
              alt="Loading"
              width={48}
              height={48}
              className="w-12 h-12 mx-auto mb-4 opacity-50 animate-pulse"
            />
            <p className="text-cream text-lg">Loading shop...</p>
          </div>
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
