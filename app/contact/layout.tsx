import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | The Cracked Grain - Bryant, Arkansas',
  description: 'Get in touch with The Cracked Grain homebrew supply store in Bryant, Arkansas. Call (501) 438-0808 or visit us for expert brewing advice and quality ingredients.',
  openGraph: {
    title: 'Contact The Cracked Grain',
    description: 'Get in touch for expert brewing advice and quality ingredients. Located in Bryant, Arkansas.',
    url: '/contact',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
