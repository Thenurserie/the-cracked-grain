import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Twitter, Youtube, MapPin, Phone, Mail, CreditCard } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-amber/20 bg-[#1a1a1a] mt-auto">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-6 md:gap-8">
          <div className="col-span-2 lg:col-span-2 space-y-4">
            <Image
              src="https://admin.thecrackedgrain.com/assets/d7a88cfe-5eea-405c-92de-8b7003ff3618"
              alt="The Cracked Grain"
              width={200}
              height={50}
              className="w-[200px] h-auto mb-2"
            />
            <p className="text-sm text-cream/80">
              Premium homebrew supplies for craft beer enthusiasts in Bryant, Arkansas.
            </p>

            <div className="space-y-2 text-sm text-cream/80">
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-gold mt-0.5 flex-shrink-0" />
                <span>Bryant, Arkansas</span>
              </div>
              <div className="flex items-start space-x-2">
                <Phone className="h-4 w-4 text-gold mt-0.5 flex-shrink-0" />
                <a href="tel:+15014380808" className="hover:text-gold transition-colors">(501) 438-0808</a>
              </div>
              <div className="flex items-start space-x-2">
                <Mail className="h-4 w-4 text-gold mt-0.5 flex-shrink-0" />
                <a href="mailto:info@thecrackedgrain.com" className="hover:text-gold transition-colors">info@thecrackedgrain.com</a>
              </div>
            </div>

            <div className="flex space-x-4">
              <a href="#" className="text-cream/60 hover:text-gold transition-colors" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-cream/60 hover:text-gold transition-colors" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-cream/60 hover:text-gold transition-colors" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-cream/60 hover:text-gold transition-colors" aria-label="YouTube">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/shop" className="text-cream/80 hover:text-gold transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/shop?category=grains-malts" className="text-cream/80 hover:text-gold transition-colors">
                  Grains & Malts
                </Link>
              </li>
              <li>
                <Link href="/shop?category=hops" className="text-cream/80 hover:text-gold transition-colors">
                  Hops
                </Link>
              </li>
              <li>
                <Link href="/shop?category=yeast" className="text-cream/80 hover:text-gold transition-colors">
                  Yeast
                </Link>
              </li>
              <li>
                <Link href="/shop?category=equipment" className="text-cream/80 hover:text-gold transition-colors">
                  Equipment
                </Link>
              </li>
              <li>
                <Link href="/shop?category=fermentation" className="text-cream/80 hover:text-gold transition-colors">
                  Fermentation
                </Link>
              </li>
              <li>
                <Link href="/shop?category=testing" className="text-cream/80 hover:text-gold transition-colors">
                  Testing
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gold mb-4">Information</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-cream/80 hover:text-gold transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-cream/80 hover:text-gold transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-cream/80 hover:text-gold transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-cream/80 hover:text-gold transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gold mb-4">Policies</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/shipping" className="text-cream/80 hover:text-gold transition-colors">
                  Shipping
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-cream/80 hover:text-gold transition-colors">
                  Returns
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-cream/80 hover:text-gold transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-cream/80 hover:text-gold transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-amber/20">
          <div className="text-center">
            <p className="text-xs md:text-sm text-cream/60">
              © 2025 The Cracked Grain. Part of The Nurserie family in Bryant, AR. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
