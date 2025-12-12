'use client';

import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function ContactPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);

    setTimeout(() => {
      toast({
        title: 'Message sent!',
        description: "We'll get back to you within 24 hours.",
      });
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setSubmitting(false);
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-cream mb-4">Contact Us</h1>
          <p className="text-cream/70 text-lg max-w-2xl mx-auto">
            Have questions about homebrewing or our products? We're here to help!
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-card border border-amber/20 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-cream mb-6">Send Us a Message</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-cream mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-[#2a2a2a] border border-amber/30 rounded text-cream placeholder:text-cream/50 focus:outline-none focus:border-gold"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-cream mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-[#2a2a2a] border border-amber/30 rounded text-cream placeholder:text-cream/50 focus:outline-none focus:border-gold"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-cream mb-2">
                      Phone (Optional)
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-[#2a2a2a] border border-amber/30 rounded text-cream placeholder:text-cream/50 focus:outline-none focus:border-gold"
                      placeholder="(501) 123-4567"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-cream mb-2">
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-[#2a2a2a] border border-amber/30 rounded text-cream focus:outline-none focus:border-gold"
                    >
                      <option value="">Select a subject</option>
                      <option value="product-inquiry">Product Inquiry</option>
                      <option value="order-status">Order Status</option>
                      <option value="brewing-help">Brewing Help</option>
                      <option value="wholesale">Wholesale Inquiry</option>
                      <option value="feedback">Feedback</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-cream mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 bg-[#2a2a2a] border border-amber/30 rounded text-cream placeholder:text-cream/50 focus:outline-none focus:border-gold resize-none"
                    placeholder="How can we help you?"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-amber hover:bg-gold text-white py-6 text-lg font-semibold"
                >
                  {submitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-card border border-amber/20 rounded-lg p-6">
              <h3 className="text-xl font-bold text-cream mb-6">Store Information</h3>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-gold mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-cream">The Cracked Grain</p>
                    <p className="text-sm text-cream/70">Part of The Nurserie Family</p>
                    <p className="text-sm text-cream/70">Bryant, Arkansas</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Phone className="h-5 w-5 text-gold mt-1 flex-shrink-0" />
                  <div>
                    <a href="tel:+15014380808" className="text-cream hover:text-gold transition-colors">
                      (501) 438-0808
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Mail className="h-5 w-5 text-gold mt-1 flex-shrink-0" />
                  <div>
                    <a href="mailto:info@thecrackedgrain.com" className="text-cream hover:text-gold transition-colors">
                      info@thecrackedgrain.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-gold mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-cream/90 font-semibold mb-1">Hours</p>
                    <p className="text-sm text-cream/70">Mon-Sat: 9am - 6pm</p>
                    <p className="text-sm text-cream/70">Sunday: 12pm - 5pm</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-amber/20">
                <p className="text-sm font-semibold text-cream mb-3">Follow Us</p>
                <div className="flex space-x-4">
                  <a href="#" className="text-cream/60 hover:text-gold transition-colors">
                    <Facebook className="h-5 w-5" />
                  </a>
                  <a href="#" className="text-cream/60 hover:text-gold transition-colors">
                    <Instagram className="h-5 w-5" />
                  </a>
                  <a href="#" className="text-cream/60 hover:text-gold transition-colors">
                    <Twitter className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-card border border-amber/20 rounded-lg p-6 h-64 flex items-center justify-center">
              <p className="text-cream/50 text-sm">Google Map Placeholder</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
