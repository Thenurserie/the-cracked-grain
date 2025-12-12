'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Save, Trash2, Calendar as CalendarIcon } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { Badge } from '@/components/ui/badge';

interface Batch {
  id: string;
  name: string;
  brew_date: string;
  batch_size: number;
  og: number;
  fg: number;
  ibu: number;
  srm: number;
  status: string;
  notes: string;
}

const STATUS_OPTIONS = [
  'planning',
  'brewing',
  'fermenting',
  'conditioning',
  'kegged',
  'bottled',
  'complete'
];

const STATUS_COLORS: { [key: string]: string } = {
  planning: 'bg-gray-500',
  brewing: 'bg-orange-500',
  fermenting: 'bg-yellow-500',
  conditioning: 'bg-blue-500',
  kegged: 'bg-green-500',
  bottled: 'bg-green-500',
  complete: 'bg-purple-500'
};

export default function BrewBatches() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'list' | 'calendar' | 'analytics'>('list');
  const [editingBatch, setEditingBatch] = useState<Partial<Batch> | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    loadBatches();
  }, []);

  const loadBatches = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('brew_batches')
      .select('*')
      .eq('user_id', user.id)
      .order('brew_date', { ascending: false });

    if (error) {
      toast.error('Failed to load batches');
      console.error(error);
    } else {
      setBatches(data || []);
    }

    setLoading(false);
  };

  const createNewBatch = () => {
    setEditingBatch({
      name: '',
      brew_date: new Date().toISOString().split('T')[0],
      batch_size: 5.0,
      og: 1.050,
      fg: 1.010,
      ibu: 40,
      srm: 10,
      status: 'planning',
      notes: ''
    });
  };

  const saveBatch = async () => {
    if (!editingBatch?.name) {
      toast.error('Please enter a batch name');
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      toast.error('Please sign in to save batches');
      return;
    }

    const batchData = {
      user_id: user.id,
      name: editingBatch.name,
      brew_date: editingBatch.brew_date,
      batch_size: editingBatch.batch_size,
      og: editingBatch.og,
      fg: editingBatch.fg,
      ibu: editingBatch.ibu,
      srm: editingBatch.srm,
      status: editingBatch.status,
      notes: editingBatch.notes
    };

    if (editingBatch.id) {
      const { error } = await supabase
        .from('brew_batches')
        .update(batchData)
        .eq('id', editingBatch.id);

      if (error) {
        toast.error('Failed to update batch');
        console.error(error);
      } else {
        toast.success('Batch updated!');
        setEditingBatch(null);
        loadBatches();
      }
    } else {
      const { error } = await supabase.from('brew_batches').insert([batchData]);

      if (error) {
        toast.error('Failed to save batch');
        console.error(error);
      } else {
        toast.success('Batch saved!');
        setEditingBatch(null);
        loadBatches();
      }
    }
  };

  const deleteBatch = async (id: string) => {
    const { error } = await supabase.from('brew_batches').delete().eq('id', id);

    if (error) {
      toast.error('Failed to delete batch');
    } else {
      toast.success('Batch deleted');
      loadBatches();
    }
  };

  const getStatusStats = () => {
    const stats: { [key: string]: number } = {};
    STATUS_OPTIONS.forEach(status => {
      stats[status] = batches.filter(b => b.status === status).length;
    });
    return stats;
  };

  const getTotalVolume = () => {
    return batches.reduce((sum, b) => sum + (b.batch_size || 0), 0).toFixed(1);
  };

  const getAverageABV = () => {
    const abvs = batches.map(b => ((b.og - b.fg) * 131.25));
    return abvs.length > 0 ? (abvs.reduce((a, b) => a + b, 0) / abvs.length).toFixed(1) : '0';
  };

  const filteredBatches = filterStatus === 'all'
    ? batches
    : batches.filter(b => b.status === filterStatus);

  if (loading) {
    return <div className="text-center py-8">Loading batches...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Brew Batches</h2>
        <Button onClick={createNewBatch}>
          <Plus className="h-4 w-4 mr-2" />
          New Batch
        </Button>
      </div>

      <Tabs value={view} onValueChange={(v) => setView(v as any)}>
        <TabsList>
          <TabsTrigger value="list">Batches</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          {editingBatch && (
            <Card>
              <CardHeader>
                <CardTitle>{editingBatch.id ? 'Edit Batch' : 'New Batch'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Batch Name</Label>
                    <Input
                      value={editingBatch.name}
                      onChange={(e) => setEditingBatch({ ...editingBatch, name: e.target.value })}
                      placeholder="e.g., West Coast IPA #3"
                    />
                  </div>
                  <div>
                    <Label>Brew Date</Label>
                    <Input
                      type="date"
                      value={editingBatch.brew_date}
                      onChange={(e) => setEditingBatch({ ...editingBatch, brew_date: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Batch Size (gal)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={editingBatch.batch_size}
                      onChange={(e) => setEditingBatch({ ...editingBatch, batch_size: parseFloat(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Select
                      value={editingBatch.status}
                      onValueChange={(value) => setEditingBatch({ ...editingBatch, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTIONS.map(status => (
                          <SelectItem key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>OG</Label>
                    <Input
                      type="number"
                      step="0.001"
                      value={editingBatch.og}
                      onChange={(e) => setEditingBatch({ ...editingBatch, og: parseFloat(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label>FG</Label>
                    <Input
                      type="number"
                      step="0.001"
                      value={editingBatch.fg}
                      onChange={(e) => setEditingBatch({ ...editingBatch, fg: parseFloat(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label>IBU</Label>
                    <Input
                      type="number"
                      value={editingBatch.ibu}
                      onChange={(e) => setEditingBatch({ ...editingBatch, ibu: parseInt(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label>SRM</Label>
                    <Input
                      type="number"
                      value={editingBatch.srm}
                      onChange={(e) => setEditingBatch({ ...editingBatch, srm: parseInt(e.target.value) })}
                    />
                  </div>
                </div>
                <div>
                  <Label>Notes</Label>
                  <Textarea
                    value={editingBatch.notes}
                    onChange={(e) => setEditingBatch({ ...editingBatch, notes: e.target.value })}
                    placeholder="Brew notes, observations, etc."
                    rows={3}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={saveBatch}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Batch
                  </Button>
                  <Button variant="outline" onClick={() => setEditingBatch(null)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex gap-2 items-center">
            <Label>Filter by Status:</Label>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Batches</SelectItem>
                {STATUS_OPTIONS.map(status => (
                  <SelectItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {filteredBatches.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8 text-muted-foreground">
                No batches found. Create your first batch to start tracking!
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredBatches.map((batch) => {
                const abv = ((batch.og - batch.fg) * 131.25).toFixed(1);
                return (
                  <Card key={batch.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{batch.name}</CardTitle>
                          <div className="flex gap-2 mt-2">
                            <Badge className={STATUS_COLORS[batch.status]}>
                              {batch.status.charAt(0).toUpperCase() + batch.status.slice(1)}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {new Date(batch.brew_date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingBatch(batch)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteBatch(batch.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
                        <div>
                          <div className="text-muted-foreground">Size</div>
                          <div className="font-semibold">{batch.batch_size} gal</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">OG → FG</div>
                          <div className="font-semibold">{batch.og?.toFixed(3)} → {batch.fg?.toFixed(3)}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">ABV</div>
                          <div className="font-semibold">{abv}%</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">IBU</div>
                          <div className="font-semibold">{batch.ibu}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">SRM</div>
                          <div className="font-semibold">{batch.srm}</div>
                        </div>
                      </div>
                      {batch.notes && (
                        <div className="mt-3 text-sm text-muted-foreground">
                          {batch.notes}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Total Batches</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{batches.length}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  {getTotalVolume()} gallons total
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Average ABV</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{getAverageABV()}%</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Across all batches
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>In Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">
                  {batches.filter(b => ['brewing', 'fermenting', 'conditioning'].includes(b.status)).length}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  Active batches
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Batch Status Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {STATUS_OPTIONS.map(status => {
                  const stats = getStatusStats();
                  const count = stats[status] || 0;
                  const percentage = batches.length > 0 ? (count / batches.length * 100).toFixed(0) : 0;
                  return (
                    <div key={status} className="flex items-center gap-3">
                      <div className="w-32 capitalize">{status}</div>
                      <div className="flex-1 h-8 bg-muted rounded-lg overflow-hidden">
                        <div
                          className={`h-full ${STATUS_COLORS[status]} flex items-center justify-end px-2 text-white text-sm font-semibold`}
                          style={{ width: `${percentage}%` }}
                        >
                          {count > 0 && `${count}`}
                        </div>
                      </div>
                      <div className="w-16 text-sm text-muted-foreground text-right">
                        {percentage}%
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
