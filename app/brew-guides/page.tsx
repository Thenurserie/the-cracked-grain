import type { Metadata } from 'next';
import Link from 'next/link';
import { Book, Beaker, Droplets, Wheat, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Brewing Guides & Resources | The Cracked Grain',
  description: 'Comprehensive brewing guides, ingredient substitution charts, and resources for homebrewers. Learn about hops, yeast, grains, and brewing techniques.',
};

const guides = [
  {
    title: 'Hop Substitutions',
    description: 'Comprehensive chart covering 80+ hop varieties with suitable substitutes. Perfect when you can\'t find a specific hop for your recipe.',
    href: '/brew-guides/hop-substitutions',
    icon: Wheat,
    tags: ['Ingredients', 'Reference'],
  },
  {
    title: 'Yeast Substitutions',
    description: 'Cross-brand yeast equivalents across Fermentis, White Labs, Wyeast, Lallemand, Omega, and Imperial. Find alternatives when your preferred yeast is unavailable.',
    href: '/brew-guides/yeast-substitutions',
    icon: Droplets,
    tags: ['Ingredients', 'Reference'],
  },
];

export default function BrewGuidesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-800 to-zinc-900">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Book className="h-10 w-10 text-amber-500" />
            <h1 className="text-4xl md:text-5xl font-bold text-amber-500">
              Brewing Guides & Resources
            </h1>
          </div>

          <p className="text-xl text-gray-300 max-w-3xl">
            Everything you need to brew better beer. From ingredient substitutions to brewing techniques, we've got you covered.
          </p>
        </div>

        {/* Introduction */}
        <div className="bg-amber-900/20 border border-amber-600/30 rounded-lg p-6 mb-12">
          <h2 className="text-xl font-semibold text-amber-400 mb-3">Welcome to Our Brewing Library</h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            Whether you're a beginner just starting your homebrewing journey or an experienced brewer looking for quick reference materials, our guides are designed to help you brew with confidence.
          </p>
          <p className="text-gray-300 leading-relaxed">
            Can't find a specific ingredient? Our substitution charts help you find suitable alternatives. Want to learn new techniques? Check out our brewing guides below.
          </p>
        </div>

        {/* Guides Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-amber-500 mb-6">Reference Charts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {guides.map((guide) => {
              const Icon = guide.icon;
              return (
                <Link
                  key={guide.href}
                  href={guide.href}
                  className="group bg-zinc-800/50 border border-zinc-700 hover:border-amber-600/50 rounded-lg p-6 transition-all hover:transform hover:scale-[1.02]"
                >
                  <div className="flex items-start gap-4">
                    <div className="bg-amber-600/20 p-3 rounded-lg">
                      <Icon className="h-6 w-6 text-amber-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-semibold text-white group-hover:text-amber-400 transition-colors">
                          {guide.title}
                        </h3>
                        <ArrowRight className="h-4 w-4 text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <p className="text-gray-400 mb-3 leading-relaxed">
                        {guide.description}
                      </p>
                      <div className="flex gap-2">
                        {guide.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-zinc-700 text-amber-400 text-xs rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Coming Soon Section */}
        <div className="bg-zinc-800/30 border border-zinc-700/50 rounded-lg p-8">
          <div className="flex items-center gap-3 mb-4">
            <Beaker className="h-6 w-6 text-amber-500" />
            <h2 className="text-2xl font-bold text-amber-500">More Guides Coming Soon</h2>
          </div>
          <p className="text-gray-300 mb-6">
            We're constantly expanding our brewing resources. Future guides will include:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-2">
              <span className="text-amber-500">•</span>
              <span className="text-gray-300">Getting Started with Homebrewing</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-amber-500">•</span>
              <span className="text-gray-300">All-Grain Brewing 101</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-amber-500">•</span>
              <span className="text-gray-300">Extract Brewing Guide</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-amber-500">•</span>
              <span className="text-gray-300">Water Chemistry Basics</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-amber-500">•</span>
              <span className="text-gray-300">Common Brewing Problems & Solutions</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-amber-500">•</span>
              <span className="text-gray-300">Recipe Formulation & Scaling</span>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 bg-gradient-to-r from-amber-900/30 to-amber-800/30 border border-amber-600/30 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-amber-400 mb-3">
            Ready to Start Brewing?
          </h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Browse our recipe library for inspiration or shop our selection of quality brewing ingredients and equipment.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/recipes"
              className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              View Recipes
            </Link>
            <Link
              href="/shop"
              className="inline-block bg-zinc-700 hover:bg-zinc-600 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              Shop Ingredients
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
