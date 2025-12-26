'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function SubmitRecipePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    type: 'Beer',
    style: '',
    description: '',
    batchSize: '5 gallons',
    difficulty: 'Intermediate',
    fermentables: [{ name: '', amount: '', unit: 'lb' }],
    hops: [{ name: '', amount: '', time: '', use: 'Bittering' }],
    yeast: { name: '', type: 'Dry', notes: '' },
    instructions: '',
    fermentationNotes: '',
    tips: '',
    agreedToTerms: false
  });

  // Check if user is logged in
  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        setUser(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const addFermentable = () => {
    setFormData(prev => ({
      ...prev,
      fermentables: [...prev.fermentables, { name: '', amount: '', unit: 'lb' }]
    }));
  };

  const addHop = () => {
    setFormData(prev => ({
      ...prev,
      hops: [...prev.hops, { name: '', amount: '', time: '', use: 'Bittering' }]
    }));
  };

  const updateFermentable = (index: number, field: string, value: string) => {
    const updated = [...formData.fermentables];
    updated[index] = { ...updated[index], [field]: value };
    setFormData(prev => ({ ...prev, fermentables: updated }));
  };

  const updateHop = (index: number, field: string, value: string) => {
    const updated = [...formData.hops];
    updated[index] = { ...updated[index], [field]: value };
    setFormData(prev => ({ ...prev, hops: updated }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.agreedToTerms) {
      setError('You must agree to the terms to submit a recipe');
      return;
    }

    if (!formData.name || !formData.style) {
      setError('Recipe name and style are required');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/recipes/community/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSuccess(true);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to submit recipe');
      }
    } catch (err) {
      setError('Failed to submit recipe. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-zinc-900 pt-24 pb-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <p className="text-gray-400">Loading...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Not logged in
  if (!user) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-zinc-900 pt-24 pb-16">
          <div className="max-w-4xl mx-auto px-4">
            <div className="bg-zinc-800 rounded-lg p-8 text-center">
              <h1 className="text-2xl font-bold text-white mb-4">Sign In Required</h1>
              <p className="text-gray-400 mb-6">
                You must be signed in to submit a recipe to the community.
              </p>
              <div className="flex gap-4 justify-center">
                <Link
                  href="/login?redirect=/recipes/submit"
                  className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg"
                >
                  Sign In
                </Link>
                <Link
                  href="/register?redirect=/recipes/submit"
                  className="bg-zinc-700 hover:bg-zinc-600 text-white px-6 py-2 rounded-lg"
                >
                  Create Account
                </Link>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Success state
  if (success) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-zinc-900 pt-24 pb-16">
          <div className="max-w-4xl mx-auto px-4">
            <div className="bg-zinc-800 rounded-lg p-8 text-center">
              <div className="text-green-500 text-5xl mb-4">✓</div>
              <h1 className="text-2xl font-bold text-white mb-4">Recipe Submitted!</h1>
              <p className="text-gray-400 mb-6">
                Thank you for sharing your recipe with the community.
                We'll review it and notify you when it's published.
              </p>
              <div className="flex gap-4 justify-center">
                <Link
                  href="/recipes"
                  className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg"
                >
                  Browse Recipes
                </Link>
                <button
                  onClick={() => {
                    setSuccess(false);
                    setFormData({
                      name: '',
                      type: 'Beer',
                      style: '',
                      description: '',
                      batchSize: '5 gallons',
                      difficulty: 'Intermediate',
                      fermentables: [{ name: '', amount: '', unit: 'lb' }],
                      hops: [{ name: '', amount: '', time: '', use: 'Bittering' }],
                      yeast: { name: '', type: 'Dry', notes: '' },
                      instructions: '',
                      fermentationNotes: '',
                      tips: '',
                      agreedToTerms: false
                    });
                  }}
                  className="bg-zinc-700 hover:bg-zinc-600 text-white px-6 py-2 rounded-lg"
                >
                  Submit Another
                </button>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-zinc-900 pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-white mb-2">Submit Your Recipe</h1>
          <p className="text-gray-400 mb-8">
            Share your homebrew recipe with The Cracked Grain community.
          </p>

          {error && (
            <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Info */}
            <div className="bg-zinc-800 rounded-lg p-6">
              <h2 className="text-xl font-bold text-amber-500 mb-4">Basic Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Recipe Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-2 text-white"
                    placeholder="My Awesome IPA"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Type *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-2 text-white"
                  >
                    <option value="Beer">Beer</option>
                    <option value="Wine">Wine</option>
                    <option value="Mead">Mead</option>
                    <option value="Cider">Cider</option>
                    <option value="Kombucha">Kombucha</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Style *</label>
                  <input
                    type="text"
                    value={formData.style}
                    onChange={(e) => setFormData(prev => ({ ...prev, style: e.target.value }))}
                    className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-2 text-white"
                    placeholder="American IPA, Dry Stout, etc."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Difficulty</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value }))}
                    className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-2 text-white"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Batch Size</label>
                  <select
                    value={formData.batchSize}
                    onChange={(e) => setFormData(prev => ({ ...prev, batchSize: e.target.value }))}
                    className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-2 text-white"
                  >
                    <option value="1 gallon">1 gallon</option>
                    <option value="3 gallons">3 gallons</option>
                    <option value="5 gallons">5 gallons</option>
                    <option value="10 gallons">10 gallons</option>
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm text-gray-400 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-2 text-white h-24"
                  placeholder="Tell us about your recipe..."
                />
              </div>
            </div>

            {/* Fermentables */}
            <div className="bg-zinc-800 rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-amber-500">Fermentables</h2>
                <button
                  type="button"
                  onClick={addFermentable}
                  className="text-amber-500 hover:text-amber-400 text-sm"
                >
                  + Add Fermentable
                </button>
              </div>

              {formData.fermentables.map((ferm, index) => (
                <div key={index} className="grid grid-cols-3 gap-2 mb-2">
                  <input
                    type="text"
                    value={ferm.name}
                    onChange={(e) => updateFermentable(index, 'name', e.target.value)}
                    className="bg-zinc-700 border border-zinc-600 rounded px-3 py-2 text-white"
                    placeholder="Grain name"
                  />
                  <input
                    type="text"
                    value={ferm.amount}
                    onChange={(e) => updateFermentable(index, 'amount', e.target.value)}
                    className="bg-zinc-700 border border-zinc-600 rounded px-3 py-2 text-white"
                    placeholder="Amount"
                  />
                  <select
                    value={ferm.unit}
                    onChange={(e) => updateFermentable(index, 'unit', e.target.value)}
                    className="bg-zinc-700 border border-zinc-600 rounded px-3 py-2 text-white"
                  >
                    <option value="lb">lb</option>
                    <option value="oz">oz</option>
                    <option value="kg">kg</option>
                  </select>
                </div>
              ))}
            </div>

            {/* Hops */}
            <div className="bg-zinc-800 rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-amber-500">Hops</h2>
                <button
                  type="button"
                  onClick={addHop}
                  className="text-amber-500 hover:text-amber-400 text-sm"
                >
                  + Add Hop
                </button>
              </div>

              {formData.hops.map((hop, index) => (
                <div key={index} className="grid grid-cols-4 gap-2 mb-2">
                  <input
                    type="text"
                    value={hop.name}
                    onChange={(e) => updateHop(index, 'name', e.target.value)}
                    className="bg-zinc-700 border border-zinc-600 rounded px-3 py-2 text-white"
                    placeholder="Hop variety"
                  />
                  <input
                    type="text"
                    value={hop.amount}
                    onChange={(e) => updateHop(index, 'amount', e.target.value)}
                    className="bg-zinc-700 border border-zinc-600 rounded px-3 py-2 text-white"
                    placeholder="oz"
                  />
                  <input
                    type="text"
                    value={hop.time}
                    onChange={(e) => updateHop(index, 'time', e.target.value)}
                    className="bg-zinc-700 border border-zinc-600 rounded px-3 py-2 text-white"
                    placeholder="60 min"
                  />
                  <select
                    value={hop.use}
                    onChange={(e) => updateHop(index, 'use', e.target.value)}
                    className="bg-zinc-700 border border-zinc-600 rounded px-3 py-2 text-white"
                  >
                    <option value="Bittering">Bittering</option>
                    <option value="Flavor">Flavor</option>
                    <option value="Aroma">Aroma</option>
                    <option value="Dry Hop">Dry Hop</option>
                  </select>
                </div>
              ))}
            </div>

            {/* Yeast */}
            <div className="bg-zinc-800 rounded-lg p-6">
              <h2 className="text-xl font-bold text-amber-500 mb-4">Yeast</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  value={formData.yeast.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, yeast: { ...prev.yeast, name: e.target.value }}))}
                  className="bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-2 text-white"
                  placeholder="Yeast name (e.g., Safale US-05)"
                />
                <select
                  value={formData.yeast.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, yeast: { ...prev.yeast, type: e.target.value }}))}
                  className="bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-2 text-white"
                >
                  <option value="Dry">Dry</option>
                  <option value="Liquid">Liquid</option>
                </select>
                <input
                  type="text"
                  value={formData.yeast.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, yeast: { ...prev.yeast, notes: e.target.value }}))}
                  className="bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-2 text-white"
                  placeholder="Notes (optional)"
                />
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-zinc-800 rounded-lg p-6">
              <h2 className="text-xl font-bold text-amber-500 mb-4">Instructions</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Brewing Instructions</label>
                  <textarea
                    value={formData.instructions}
                    onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
                    className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-2 text-white h-32"
                    placeholder="Step-by-step brewing instructions..."
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Fermentation Notes</label>
                  <textarea
                    value={formData.fermentationNotes}
                    onChange={(e) => setFormData(prev => ({ ...prev, fermentationNotes: e.target.value }))}
                    className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-2 text-white h-24"
                    placeholder="Temperature, duration, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Tips & Recommendations</label>
                  <textarea
                    value={formData.tips}
                    onChange={(e) => setFormData(prev => ({ ...prev, tips: e.target.value }))}
                    className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-2 text-white h-24"
                    placeholder="Any tips for others brewing this recipe..."
                  />
                </div>
              </div>
            </div>

            {/* Terms Agreement */}
            <div className="bg-zinc-800 rounded-lg p-6">
              <h2 className="text-xl font-bold text-amber-500 mb-4">Terms & Agreement</h2>

              <div className="bg-zinc-700 rounded-lg p-4 mb-4 text-sm text-gray-300">
                <p className="mb-2">By submitting this recipe, I agree to the following:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>My recipe may be viewed and used by other members of The Cracked Grain community</li>
                  <li>Only my username will be displayed publicly - my real name and email will remain private</li>
                  <li>The Cracked Grain and its owners are not liable for any outcomes from anyone brewing this recipe</li>
                  <li>I confirm this is my original recipe or I have permission to share it</li>
                  <li>I understand recipes are reviewed before publishing and may be rejected</li>
                  <li>Anyone who brews this recipe does so at their own risk</li>
                </ul>
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.agreedToTerms}
                  onChange={(e) => setFormData(prev => ({ ...prev, agreedToTerms: e.target.checked }))}
                  className="w-5 h-5 rounded border-zinc-600 bg-zinc-700 text-amber-500 focus:ring-amber-500"
                />
                <span className="text-white">I have read and agree to these terms *</span>
              </label>
            </div>

            {/* Submit */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={submitting}
                className="bg-amber-600 hover:bg-amber-700 disabled:bg-amber-800 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-medium"
              >
                {submitting ? 'Submitting...' : 'Submit Recipe'}
              </button>
              <Link
                href="/recipes"
                className="bg-zinc-700 hover:bg-zinc-600 text-white px-8 py-3 rounded-lg font-medium"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
