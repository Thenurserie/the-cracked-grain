import { WifiOff, Home, Beaker } from 'lucide-react';
import Link from 'next/link';

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="mb-6 flex justify-center">
          <div className="p-4 bg-amber-600/20 rounded-full">
            <WifiOff className="w-16 h-16 text-amber-500" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-white mb-2">
          You're Offline
        </h1>

        <p className="text-neutral-400 mb-8">
          You can still use brewing tools and view cached recipes.
        </p>

        <div className="space-y-3">
          <Link
            href="/brewing"
            className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            <Beaker className="w-5 h-5" />
            Use Brewing Tools
          </Link>

          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 transition-colors"
          >
            <Home className="w-5 h-5" />
            Try Home Page
          </Link>
        </div>

        <p className="mt-8 text-sm text-neutral-500">
          You'll be automatically redirected when your connection is restored.
        </p>
      </div>
    </div>
  );
}
