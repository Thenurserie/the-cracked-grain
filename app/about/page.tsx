import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Award, Users, Heart, MapPin } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | The Cracked Grain - Bryant, Arkansas Homebrew Supply',
  description: "Learn about The Cracked Grain, Bryant, Arkansas's premier homebrew supply store. Part of The Nurserie family, we provide quality brewing ingredients, equipment, and expert support to the homebrewing community.",
  openGraph: {
    title: 'About The Cracked Grain',
    description: "Bryant, Arkansas's premier homebrew supply store. Quality ingredients, expert support, community focused.",
    url: '/about',
  },
};

export default function AboutPage() {
  return (
    <div>
      <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/1267697/pexels-photo-1267697.jpeg)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-[#1a1a1a]" />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-cream mb-4">
            Our Story
          </h1>
          <p className="text-xl text-cream/90">
            Crafting better brews, one batch at a time
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg prose-invert mb-12">
            <h2 className="text-3xl font-bold text-cream mb-6">Welcome to The Cracked Grain</h2>

            <p className="text-cream/80 leading-relaxed mb-6">
              Founded with a passion for craft brewing, The Cracked Grain has become Bryant, Arkansas's
              premier destination for homebrewing supplies. We believe that great beer starts with quality
              ingredients and the right equipment, and we're dedicated to providing both to our community
              of brewing enthusiasts.
            </p>

            <p className="text-cream/80 leading-relaxed mb-6">
              What began as a small operation serving local homebrewers has grown into a comprehensive
              supply store offering everything from base malts and specialty grains to the latest in
              brewing technology. Our team consists of experienced brewers who understand the craft and
              are passionate about helping others create exceptional beers.
            </p>

            <p className="text-cream/80 leading-relaxed mb-6">
              Whether you're brewing your first batch or you're a seasoned pro perfecting your recipes,
              we have the ingredients, equipment, and expertise to support your brewing journey. We
              carefully select every product we carry, ensuring that our customers have access to the
              finest brewing supplies available.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center p-6 bg-card border border-amber/20 rounded-lg">
              <Award className="h-12 w-12 text-gold mx-auto mb-4" />
              <h3 className="text-xl font-bold text-cream mb-2">Premium Quality</h3>
              <p className="text-cream/70">
                Only the finest ingredients and equipment make it to our shelves
              </p>
            </div>

            <div className="text-center p-6 bg-card border border-amber/20 rounded-lg">
              <Users className="h-12 w-12 text-gold mx-auto mb-4" />
              <h3 className="text-xl font-bold text-cream mb-2">Expert Support</h3>
              <p className="text-cream/70">
                Our team of experienced brewers is here to help you succeed
              </p>
            </div>

            <div className="text-center p-6 bg-card border border-amber/20 rounded-lg">
              <Heart className="h-12 w-12 text-gold mx-auto mb-4" />
              <h3 className="text-xl font-bold text-cream mb-2">Community Focused</h3>
              <p className="text-cream/70">
                Supporting and growing the local homebrewing community
              </p>
            </div>
          </div>

          <div className="bg-card border border-amber/20 rounded-lg p-8 mb-12">
            <h3 className="text-2xl font-bold text-cream mb-4 flex items-center">
              <MapPin className="mr-3 h-6 w-6 text-gold" />
              Part of The Nurserie Family
            </h3>
            <p className="text-cream/80 leading-relaxed mb-4">
              The Cracked Grain is proud to be part of The Nurserie family of businesses in Bryant,
              Arkansas. Just as The Nurserie has helped our community grow beautiful gardens for years,
              we're helping brewers cultivate their craft and create outstanding beers.
            </p>
            <p className="text-cream/80 leading-relaxed">
              Our connection to The Nurserie reflects our shared commitment to quality, customer service,
              and being an integral part of the Bryant community. We're not just a store; we're your
              neighbors and fellow enthusiasts.
            </p>
          </div>

          <div className="text-center py-12 border-t border-amber/20">
            <h2 className="text-3xl font-bold text-cream mb-6">Ready to Start Brewing?</h2>
            <p className="text-cream/70 mb-8 max-w-2xl mx-auto">
              Visit us in Bryant or browse our online selection. Let's create something amazing together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/shop">
                <Button size="lg" className="bg-amber hover:bg-gold text-white px-8">
                  Shop Now
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="border-amber/30 text-cream hover:bg-amber/10 px-8"
              >
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
