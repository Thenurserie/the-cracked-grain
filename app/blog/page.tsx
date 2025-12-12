import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto text-center py-16">
        <BookOpen className="h-24 w-24 text-gold mx-auto mb-8" />
        <h1 className="text-4xl md:text-5xl font-bold text-cream mb-6">
          Blog Coming Soon
        </h1>
        <p className="text-cream/70 text-lg mb-8 max-w-2xl mx-auto">
          We're working on bringing you brewing guides, recipes, tips, and industry news. Stay tuned!
        </p>

        <div className="bg-card border border-amber/20 rounded-lg p-8 max-w-md mx-auto">
          <h3 className="text-xl font-bold text-cream mb-4">Get Notified</h3>
          <p className="text-cream/70 mb-6 text-sm">
            Subscribe to our newsletter to be the first to know when we launch our blog.
          </p>
          <form className="space-y-4">
            <input
              type="email"
              placeholder="Your email address"
              className="w-full px-4 py-3 bg-[#2a2a2a] border border-amber/30 rounded text-cream placeholder:text-cream/50 focus:outline-none focus:border-gold"
            />
            <Button type="submit" className="w-full bg-amber hover:bg-gold text-white">
              Subscribe
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
