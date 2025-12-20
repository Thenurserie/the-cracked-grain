'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit2, Trash2, Calendar, Beaker, X, LogIn, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

interface Batch {
  id: string;
  name: string;
  style: string;
  brewDate: string;
  status: 'Planning' | 'Brewing' | 'Fermenting' | 'Conditioning' | 'Carbonating' | 'Ready' | 'Archived';
  originalGravity: string;
  finalGravity: string;
  abv: number;
  notes: string;
  createdAt: string;
}

const STATUS_COLORS = {
  Planning: 'bg-gray-500',
  Brewing: 'bg-blue-500',
  Fermenting: 'bg-purple-500',
  Conditioning: 'bg-indigo-500',
  Carbonating: 'bg-cyan-500',
  Ready: 'bg-green-500',
  Archived: 'bg-gray-400'
};

export default function BrewBatches() {
  const { isLoggedIn, isLoading: authLoading } = useAuth();
  const [batches, setBatches] = useState<Batch[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState<Batch | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    style: '',
    brewDate: '',
    status: 'Planning' as Batch['status'],
    originalGravity: '',
    finalGravity: '',
    notes: ''
  });

  // Load batches on mount
  useEffect(() => {
    if (authLoading) return;
    loadBatches();
  }, [isLoggedIn, authLoading]);

  // Load batches from API or localStorage
  const loadBatches = async () => {
    if (isLoggedIn) {
      // Load from API
      setIsLoading(true);
      try {
        const response = await fetch('/api/user/batches');
        const data = await response.json();
        if (data.success && data.batches) {
          setBatches(data.batches);
        }
      } catch (error) {
        console.error('Failed to load batches:', error);
        setError('Failed to load batches');
      } finally {
        setIsLoading(false);
      }
    } else {
      // Load from localStorage (guest mode)
      const stored = localStorage.getItem('brewBatches');
      if (stored) {
        setBatches(JSON.parse(stored));
      }
    }
  };

  // Save batch to API or localStorage
  const saveBatch = async (batchData: Partial<Batch>, id?: string) => {
    setIsSaving(true);
    setError('');

    try {
      if (isLoggedIn) {
        // Save to API
        const url = id ? `/api/user/batches/${id}` : '/api/user/batches';
        const method = id ? 'PUT' : 'POST';

        const response = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(batchData),
        });

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || 'Failed to save batch');
        }

        // Reload batches from API
        await loadBatches();
      } else {
        // Save to localStorage (guest mode)
        if (id) {
          const updatedBatches = batches.map(batch =>
            batch.id === id ? { ...batch, ...batchData } : batch
          );
          setBatches(updatedBatches);
          localStorage.setItem('brewBatches', JSON.stringify(updatedBatches));
        } else {
          const newBatch: Batch = {
            id: Date.now().toString(),
            ...(batchData as Omit<Batch, 'id'>),
            createdAt: new Date().toISOString()
          };
          const newBatches = [newBatch, ...batches];
          setBatches(newBatches);
          localStorage.setItem('brewBatches', JSON.stringify(newBatches));
        }
      }
    } catch (error: any) {
      console.error('Save batch error:', error);
      setError(error.message || 'Failed to save batch');
    } finally {
      setIsSaving(false);
    }
  };

  // Delete batch from API or localStorage
  const deleteBatchData = async (id: string) => {
    if (!confirm('Are you sure you want to delete this batch?')) return;

    setError('');

    try {
      if (isLoggedIn) {
        // Delete from API
        const response = await fetch(`/api/user/batches/${id}`, {
          method: 'DELETE',
        });

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || 'Failed to delete batch');
        }

        // Reload batches from API
        await loadBatches();
      } else {
        // Delete from localStorage (guest mode)
        const newBatches = batches.filter(batch => batch.id !== id);
        setBatches(newBatches);
        localStorage.setItem('brewBatches', JSON.stringify(newBatches));
      }
    } catch (error: any) {
      console.error('Delete batch error:', error);
      setError(error.message || 'Failed to delete batch');
    }
  };

  // Calculate ABV from OG and FG
  const calculateABV = (og: string, fg: string): number => {
    const ogNum = parseFloat(og);
    const fgNum = parseFloat(fg);
    if (isNaN(ogNum) || isNaN(fgNum)) return 0;
    return parseFloat(((ogNum - fgNum) * 131.25).toFixed(2));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const abv = calculateABV(formData.originalGravity, formData.finalGravity);

    const batchData = {
      ...formData,
      abv,
    };

    await saveBatch(batchData, editingBatch?.id);
    closeForm();
  };

  const openForm = (batch?: Batch) => {
    if (batch) {
      setEditingBatch(batch);
      setFormData({
        name: batch.name,
        style: batch.style,
        brewDate: batch.brewDate,
        status: batch.status,
        originalGravity: batch.originalGravity,
        finalGravity: batch.finalGravity,
        notes: batch.notes
      });
    }
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingBatch(null);
    setFormData({
      name: '',
      style: '',
      brewDate: '',
      status: 'Planning',
      originalGravity: '',
      finalGravity: '',
      notes: ''
    });
  };

  const currentABV = calculateABV(formData.originalGravity, formData.finalGravity);

  return (
    <div className="space-y-6">
      {/* Guest Sign-in Banner */}
      {!isLoggedIn && !authLoading && (
        <Card className="bg-gradient-to-r from-amber/20 to-gold/20 border-amber/40">
          <CardContent className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <LogIn className="h-5 w-5 text-gold" />
              <div>
                <p className="text-sm font-medium text-cream">Sign in to save your batches permanently</p>
                <p className="text-xs text-cream/70">Currently using guest mode - data stored locally</p>
              </div>
            </div>
            <Link href="/login">
              <Button className="bg-amber hover:bg-gold text-white">
                Sign In
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Error Message */}
      {error && (
        <Card className="bg-red-500/10 border-red-500/50">
          <CardContent className="flex items-center gap-2 py-3">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <p className="text-sm text-red-500">{error}</p>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-cream">Brew Batches</h2>
        <Button
          onClick={() => openForm()}
          className="bg-amber hover:bg-gold text-white"
          disabled={isSaving}
        >
          <Plus className="h-4 w-4 mr-2" />
          New Batch
        </Button>
      </div>

      {/* Batch Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 overflow-y-auto py-8">
          <Card className="w-full max-w-2xl mx-4 bg-card border-amber/20">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-gold">
                {editingBatch ? 'Edit Batch' : 'New Batch'}
              </CardTitle>
              <button onClick={closeForm} className="text-cream/50 hover:text-cream">
                <X className="h-5 w-5" />
              </button>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-cream/70 mb-1 block">Batch Name *</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Summer IPA #3"
                      required
                      className="bg-[#2a2a2a] border-amber/20 text-cream"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-cream/70 mb-1 block">Beer Style *</label>
                    <Input
                      value={formData.style}
                      onChange={(e) => setFormData({ ...formData, style: e.target.value })}
                      placeholder="e.g., American IPA"
                      required
                      className="bg-[#2a2a2a] border-amber/20 text-cream"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-cream/70 mb-1 block">Brew Date *</label>
                    <Input
                      type="date"
                      value={formData.brewDate}
                      onChange={(e) => setFormData({ ...formData, brewDate: e.target.value })}
                      required
                      className="bg-[#2a2a2a] border-amber/20 text-cream"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-cream/70 mb-1 block">Status *</label>
                    <Select value={formData.status} onValueChange={(value: Batch['status']) => setFormData({ ...formData, status: value })}>
                      <SelectTrigger className="bg-[#2a2a2a] border-amber/20 text-cream">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-amber/20">
                        <SelectItem value="Planning">Planning</SelectItem>
                        <SelectItem value="Brewing">Brewing</SelectItem>
                        <SelectItem value="Fermenting">Fermenting</SelectItem>
                        <SelectItem value="Conditioning">Conditioning</SelectItem>
                        <SelectItem value="Carbonating">Carbonating</SelectItem>
                        <SelectItem value="Ready">Ready</SelectItem>
                        <SelectItem value="Archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm text-cream/70 mb-1 block">Original Gravity (OG)</label>
                    <Input
                      type="number"
                      step="0.001"
                      value={formData.originalGravity}
                      onChange={(e) => setFormData({ ...formData, originalGravity: e.target.value })}
                      placeholder="e.g., 1.060"
                      className="bg-[#2a2a2a] border-amber/20 text-cream"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-cream/70 mb-1 block">Final Gravity (FG)</label>
                    <Input
                      type="number"
                      step="0.001"
                      value={formData.finalGravity}
                      onChange={(e) => setFormData({ ...formData, finalGravity: e.target.value })}
                      placeholder="e.g., 1.012"
                      className="bg-[#2a2a2a] border-amber/20 text-cream"
                    />
                  </div>
                </div>

                {formData.originalGravity && formData.finalGravity && currentABV > 0 && (
                  <div className="bg-amber/10 border border-amber/30 rounded-lg p-3">
                    <p className="text-sm text-cream/70">
                      Calculated ABV: <span className="text-gold font-bold text-lg">{currentABV}%</span>
                    </p>
                  </div>
                )}

                <div>
                  <label className="text-sm text-cream/70 mb-1 block">Notes / Tasting Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Recipe details, process notes, tasting observations..."
                    rows={4}
                    className="w-full bg-[#2a2a2a] border border-amber/20 rounded-md p-3 text-cream placeholder:text-cream/50 focus:outline-none focus:border-gold"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="flex-1 bg-amber hover:bg-gold text-white" disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        {editingBatch ? 'Updating...' : 'Creating...'}
                      </>
                    ) : (
                      editingBatch ? 'Update Batch' : 'Create Batch'
                    )}
                  </Button>
                  <Button type="button" onClick={closeForm} variant="outline" className="border-amber/30 text-cream hover:bg-amber/10" disabled={isSaving}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Batches List */}
      {isLoading ? (
        <Card className="bg-card border-amber/20">
          <CardContent className="flex justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-gold" />
          </CardContent>
        </Card>
      ) : batches.length === 0 ? (
        <Card className="bg-card border-amber/20">
          <CardContent className="text-center py-12">
            <Beaker className="h-16 w-16 mx-auto mb-4 text-cream/30" />
            <p className="text-cream/70 mb-4">No batches yet. Start tracking your brews!</p>
            <Button onClick={() => openForm()} className="bg-amber hover:bg-gold text-white">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Batch
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {batches.map((batch) => (
            <Card key={batch.id} className="bg-card border-amber/20 hover:border-gold transition-colors">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-lg text-cream">{batch.name}</CardTitle>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openForm(batch)}
                      className="text-cream/50 hover:text-gold transition-colors"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteBatchData(batch.id)}
                      className="text-cream/50 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-cream/60">{batch.style}</p>
                <div className="mt-2">
                  <span className={`inline-block px-2 py-1 rounded text-xs font-bold text-white ${STATUS_COLORS[batch.status]}`}>
                    {batch.status}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-cream/70">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(batch.brewDate).toLocaleDateString()}</span>
                </div>

                {batch.abv > 0 && (
                  <div className="bg-amber/10 border border-amber/30 rounded p-2">
                    <p className="text-xs text-cream/70">
                      OG: {batch.originalGravity} | FG: {batch.finalGravity}
                    </p>
                    <p className="text-gold font-bold">ABV: {batch.abv}%</p>
                  </div>
                )}

                {batch.notes && (
                  <div className="pt-2 border-t border-amber/20">
                    <p className="text-xs text-cream/60 line-clamp-3">{batch.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
