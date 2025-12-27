import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Order Confirmed | The Cracked Grain',
  description: 'Thank you for your order!',
};

export default function CheckoutSuccessPage() {
  return (
    <main className="min-h-screen bg-zinc-900 pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <div className="bg-zinc-800 rounded-lg p-8 border border-amber-600/30">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-20 w-20 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Order Confirmed!</h1>
          <p className="text-gray-300 mb-6">
            Thank you for your order! You will receive a confirmation email shortly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/shop"
              className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
            >
              Continue Shopping
            </Link>
            <Link
              href="/"
              className="bg-zinc-700 hover:bg-zinc-600 text-white px-6 py-3 rounded-lg transition-colors font-medium"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
