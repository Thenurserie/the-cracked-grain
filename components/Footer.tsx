import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Twitter, Youtube, MapPin, Phone, Mail, CreditCard } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-amber/20 bg-[#1a1a1a] mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="space-y-4 lg:col-span-2">
            <Image
              src="https://admin.thecrackedgrain.com/assets/dd3f051f-5b80-475e-b8fa-13cac5d9482d"
              alt="The Cracked Grain"
              width={150}
              height={38}
              className="w-[150px] h-auto mb-2"
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

        <div className="mt-12 pt-8 border-t border-amber/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs text-cream/60">We accept:</span>
              <div className="flex items-center gap-2">
                <CreditCard className="h-6 w-10 text-cream/40" />
                <CreditCard className="h-6 w-10 text-cream/40" />
                <CreditCard className="h-6 w-10 text-cream/40" />
                <CreditCard className="h-6 w-10 text-cream/40" />
              </div>
            </div>
            <p className="text-sm text-cream/60 text-center">
              © 2025 The Cracked Grain. Part of The Nurserie family in Bryant, AR. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
