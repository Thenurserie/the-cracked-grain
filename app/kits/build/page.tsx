import { Metadata } from 'next';
import KitBuilder from '@/components/KitBuilder';

export const metadata: Metadata = {
  title: 'Build Your Own Brewing Kit - The Cracked Grain',
  description: 'Build a custom brewing equipment kit. Select exactly what you need and skip what you already have. Bundle discount available!',
};

export default function BuildKitPage() {
  return <KitBuilder />;
}
