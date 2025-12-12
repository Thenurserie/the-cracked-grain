'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Save, Trash2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { Badge } from '@/components/ui/badge';

interface InventoryItem {
  id: string;
  type: string;
  name: string;
  quantity: number;
  unit: string;
  purchase_date: string;
  expiration_date: string;
  location: string;
  notes: string;
}

const CATEGORIES = ['Grain', 'Hops', 'Yeast', 'Adjuncts', 'Other'];
const UNITS = ['lbs', 'oz', 'g', 'kg', 'each'];

export default function Inventory() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'inventory' | 'alerts'>('inventory');
  const [editingItem, setEditingItem] = useState<Partial<InventoryItem> | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('inventory_items')
      .select('*')
      .eq('user_id', user.id)
      .order('name');

    if (error) {
      toast.error('Failed to load inventory');
      console.error(error);
    } else {
      setItems(data || []);
    }

    setLoading(false);
  };

  const createNewItem = () => {
    setEditingItem({
      type: 'Grain',
      name: '',
      quantity: 0,
      unit: 'lbs',
      purchase_date: new Date().toISOString().split('T')[0],
      expiration_date: '',
      location: '',
      notes: ''
    });
  };

  const saveItem = async () => {
    if (!editingItem?.name) {
      toast.error('Please enter an item name');
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      toast.error('Please sign in to save inventory');
      return;
    }

    const itemData = {
      user_id: user.id,
      type: editingItem.type,
      name: editingItem.name,
      quantity: editingItem.quantity || 0,
      unit: editingItem.unit,
      purchase_date: editingItem.purchase_date,
      expiration_date: editingItem.expiration_date,
      location: editingItem.location,
      notes: editingItem.notes
    };

    if (editingItem.id) {
      const { error } = await supabase
        .from('inventory_items')
        .update(itemData)
        .eq('id', editingItem.id);

      if (error) {
        toast.error('Failed to update item');
        console.error(error);
      } else {
        toast.success('Item updated!');
        setEditingItem(null);
        loadInventory();
      }
    } else {
      const { error } = await supabase.from('inventory_items').insert([itemData]);

      if (error) {
        toast.error('Failed to save item');
        console.error(error);
      } else {
        toast.success('Item saved!');
        setEditingItem(null);
        loadInventory();
      }
    }
  };

  const deleteItem = async (id: string) => {
    const { error } = await supabase.from('inventory_items').delete().eq('id', id);

    if (error) {
      toast.error('Failed to delete item');
    } else {
      toast.success('Item deleted');
      loadInventory();
    }
  };

  const getExpiringItems = () => {
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    return items.filter(item => {
      if (!item.expiration_date) return false;
      const expDate = new Date(item.expiration_date);
      return expDate <= thirtyDaysFromNow;
    });
  };

  const getLowStockItems = () => {
    return items.filter(item => item.quantity <= 1);
  };

  const getCategoryStats = () => {
    const stats: { [key: string]: number } = {};
    CATEGORIES.forEach(cat => {
      stats[cat] = items.filter(i => i.type === cat).length;
    });
    return stats;
  };

  const filteredItems = filterCategory === 'all'
    ? items
    : items.filter(i => i.type === filterCategory);

  if (loading) {
    return <div className="text-center py-8">Loading inventory...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Inventory Management</h2>
        <Button onClick={createNewItem}>
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>

      <Tabs value={view} onValueChange={(v) => setView(v as any)}>
        <TabsList>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="alerts">
            Alerts
            {(getExpiringItems().length + getLowStockItems().length > 0) && (
              <Badge variant="destructive" className="ml-2">
                {getExpiringItems().length + getLowStockItems().length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-4">
          {editingItem && (
            <Card>
              <CardHeader>
                <CardTitle>{editingItem.id ? 'Edit Item' : 'New Item'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Category</Label>
                    <Select
                      value={editingItem.type}
                      onValueChange={(value) => setEditingItem({ ...editingItem, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Item Name</Label>
                    <Input
                      value={editingItem.name}
                      onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                      placeholder="e.g., Cascade Hops"
                    />
                  </div>
                  <div>
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={editingItem.quantity}
                      onChange={(e) => setEditingItem({ ...editingItem, quantity: parseFloat(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label>Unit</Label>
                    <Select
                      value={editingItem.unit}
                      onValueChange={(value) => setEditingItem({ ...editingItem, unit: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {UNITS.map(unit => (
                          <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Purchase Date</Label>
                    <Input
                      type="date"
                      value={editingItem.purchase_date}
                      onChange={(e) => setEditingItem({ ...editingItem, purchase_date: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Expiration Date (optional)</Label>
                    <Input
                      type="date"
                      value={editingItem.expiration_date}
                      onChange={(e) => setEditingItem({ ...editingItem, expiration_date: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Location (optional)</Label>
                    <Input
                      value={editingItem.location}
                      onChange={(e) => setEditingItem({ ...editingItem, location: e.target.value })}
                      placeholder="e.g., Freezer, Pantry"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={saveItem}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Item
                  </Button>
                  <Button variant="outline" onClick={() => setEditingItem(null)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex gap-2 items-center">
            <Label>Filter by Category:</Label>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {CATEGORIES.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {filteredItems.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8 text-muted-foreground">
                No items in inventory. Add your first item to start tracking!
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredItems.map((item) => (
                <Card key={item.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <Badge variant="secondary" className="mb-2">{item.type}</Badge>
                        <CardTitle className="text-base">{item.name}</CardTitle>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingItem(item)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Quantity:</span>
                      <span className="font-semibold">
                        {item.quantity} {item.unit}
                      </span>
                    </div>
                    {item.location && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Location:</span>
                        <span>{item.location}</span>
                      </div>
                    )}
                    {item.expiration_date && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Expires:</span>
                        <span>
                          {new Date(item.expiration_date).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    {item.quantity <= 1 && (
                      <Badge variant="destructive" className="w-full justify-center">
                        Low Stock
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                Low Stock Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              {getLowStockItems().length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  No low stock items
                </div>
              ) : (
                <div className="space-y-2">
                  {getLowStockItems().map(item => (
                    <div key={item.id} className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <div className="font-semibold">{item.name}</div>
                        <div className="text-sm text-muted-foreground">{item.type}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-yellow-600">
                          {item.quantity} {item.unit}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingItem(item)}
                          className="mt-1"
                        >
                          Update
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Expiring Soon (30 days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {getExpiringItems().length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  No items expiring soon
                </div>
              ) : (
                <div className="space-y-2">
                  {getExpiringItems().map(item => {
                    const daysUntilExpiry = Math.ceil(
                      (new Date(item.expiration_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                    );
                    const isExpired = daysUntilExpiry < 0;

                    return (
                      <div key={item.id} className="flex justify-between items-center p-3 border rounded-lg">
                        <div>
                          <div className="font-semibold">{item.name}</div>
                          <div className="text-sm text-muted-foreground">{item.type}</div>
                        </div>
                        <div className="text-right">
                          <div className={`font-semibold ${isExpired ? 'text-red-600' : 'text-orange-600'}`}>
                            {isExpired ? 'Expired' : `${daysUntilExpiry} days`}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(item.expiration_date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Inventory Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Total Items:</span>
                  <span className="font-semibold">{items.length}</span>
                </div>
                {CATEGORIES.map(cat => {
                  const stats = getCategoryStats();
                  return (
                    <div key={cat} className="flex justify-between text-sm">
                      <span>{cat}:</span>
                      <span className="font-semibold">{stats[cat]}</span>
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
