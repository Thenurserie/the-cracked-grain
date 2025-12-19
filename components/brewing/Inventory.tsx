'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit2, Trash2, Package, AlertTriangle, X, Search } from 'lucide-react';

interface InventoryItem {
  id: string;
  name: string;
  category: 'Grains' | 'Hops' | 'Yeast' | 'Equipment' | 'Chemicals' | 'Other';
  quantity: number;
  unit: string;
  purchaseDate: string;
  expirationDate: string;
  notes: string;
  createdAt: string;
}

const CATEGORY_COLORS = {
  Grains: 'bg-amber-600',
  Hops: 'bg-green-600',
  Yeast: 'bg-purple-600',
  Equipment: 'bg-blue-600',
  Chemicals: 'bg-red-600',
  Other: 'bg-gray-600'
};

const COMMON_UNITS = ['lb', 'oz', 'g', 'kg', 'each', 'packet', 'ml', 'L', 'gal'];

const LOW_STOCK_THRESHOLD = 5;

export default function Inventory() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [formData, setFormData] = useState({
    name: '',
    category: 'Grains' as InventoryItem['category'],
    quantity: '',
    unit: 'lb',
    purchaseDate: '',
    expirationDate: '',
    notes: ''
  });

  // Load items from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('brewInventory');
    if (stored) {
      setItems(JSON.parse(stored));
    }
  }, []);

  // Save items to localStorage
  const saveItems = (newItems: InventoryItem[]) => {
    setItems(newItems);
    localStorage.setItem('brewInventory', JSON.stringify(newItems));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const quantity = parseFloat(formData.quantity);
    if (isNaN(quantity) || quantity < 0) {
      alert('Please enter a valid quantity');
      return;
    }

    if (editingItem) {
      // Update existing item
      const updatedItems = items.map(item =>
        item.id === editingItem.id
          ? { ...item, ...formData, quantity }
          : item
      );
      saveItems(updatedItems);
    } else {
      // Create new item
      const newItem: InventoryItem = {
        id: Date.now().toString(),
        ...formData,
        quantity,
        createdAt: new Date().toISOString()
      };
      saveItems([newItem, ...items]);
    }

    closeForm();
  };

  const openForm = (item?: InventoryItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        category: item.category,
        quantity: item.quantity.toString(),
        unit: item.unit,
        purchaseDate: item.purchaseDate,
        expirationDate: item.expirationDate,
        notes: item.notes
      });
    }
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingItem(null);
    setFormData({
      name: '',
      category: 'Grains',
      quantity: '',
      unit: 'lb',
      purchaseDate: '',
      expirationDate: '',
      notes: ''
    });
  };

  const deleteItem = (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      saveItems(items.filter(item => item.id !== id));
    }
  };

  const isLowStock = (item: InventoryItem): boolean => {
    return item.quantity <= LOW_STOCK_THRESHOLD;
  };

  const isExpiringSoon = (expirationDate: string): boolean => {
    if (!expirationDate) return false;
    const expDate = new Date(expirationDate);
    const today = new Date();
    const daysUntilExpiration = Math.floor((expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiration >= 0 && daysUntilExpiration <= 30;
  };

  const isExpired = (expirationDate: string): boolean => {
    if (!expirationDate) return false;
    return new Date(expirationDate) < new Date();
  };

  // Filter items based on search and category
  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-cream">Brewing Inventory</h2>
        <Button
          onClick={() => openForm()}
          className="bg-amber hover:bg-gold text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>

      {/* Search and Filter */}
      {items.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-cream/50" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search inventory..."
              className="pl-10 bg-[#2a2a2a] border-amber/20 text-cream"
            />
          </div>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-full sm:w-[200px] bg-[#2a2a2a] border-amber/20 text-cream">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-amber/20">
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Grains">Grains</SelectItem>
              <SelectItem value="Hops">Hops</SelectItem>
              <SelectItem value="Yeast">Yeast</SelectItem>
              <SelectItem value="Equipment">Equipment</SelectItem>
              <SelectItem value="Chemicals">Chemicals</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Item Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 overflow-y-auto py-8">
          <Card className="w-full max-w-2xl mx-4 bg-card border-amber/20">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-gold">
                {editingItem ? 'Edit Item' : 'Add Item'}
              </CardTitle>
              <button onClick={closeForm} className="text-cream/50 hover:text-cream">
                <X className="h-5 w-5" />
              </button>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-cream/70 mb-1 block">Item Name *</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Pale Malt 2-Row"
                      required
                      className="bg-[#2a2a2a] border-amber/20 text-cream"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-cream/70 mb-1 block">Category *</label>
                    <Select value={formData.category} onValueChange={(value: InventoryItem['category']) => setFormData({ ...formData, category: value })}>
                      <SelectTrigger className="bg-[#2a2a2a] border-amber/20 text-cream">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-amber/20">
                        <SelectItem value="Grains">Grains</SelectItem>
                        <SelectItem value="Hops">Hops</SelectItem>
                        <SelectItem value="Yeast">Yeast</SelectItem>
                        <SelectItem value="Equipment">Equipment</SelectItem>
                        <SelectItem value="Chemicals">Chemicals</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm text-cream/70 mb-1 block">Quantity *</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      placeholder="e.g., 10"
                      required
                      className="bg-[#2a2a2a] border-amber/20 text-cream"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-cream/70 mb-1 block">Unit *</label>
                    <Select value={formData.unit} onValueChange={(value) => setFormData({ ...formData, unit: value })}>
                      <SelectTrigger className="bg-[#2a2a2a] border-amber/20 text-cream">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-amber/20">
                        {COMMON_UNITS.map(unit => (
                          <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm text-cream/70 mb-1 block">Purchase Date</label>
                    <Input
                      type="date"
                      value={formData.purchaseDate}
                      onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                      className="bg-[#2a2a2a] border-amber/20 text-cream"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-cream/70 mb-1 block">Expiration Date</label>
                    <Input
                      type="date"
                      value={formData.expirationDate}
                      onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
                      className="bg-[#2a2a2a] border-amber/20 text-cream"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-cream/70 mb-1 block">Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Storage location, supplier, lot number..."
                    rows={3}
                    className="w-full bg-[#2a2a2a] border border-amber/20 rounded-md p-3 text-cream placeholder:text-cream/50 focus:outline-none focus:border-gold"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="flex-1 bg-amber hover:bg-gold text-white">
                    {editingItem ? 'Update Item' : 'Add Item'}
                  </Button>
                  <Button type="button" onClick={closeForm} variant="outline" className="border-amber/30 text-cream hover:bg-amber/10">
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Items List */}
      {filteredItems.length === 0 && items.length === 0 ? (
        <Card className="bg-card border-amber/20">
          <CardContent className="text-center py-12">
            <Package className="h-16 w-16 mx-auto mb-4 text-cream/30" />
            <p className="text-cream/70 mb-4">No inventory items yet. Start tracking your supplies!</p>
            <Button onClick={() => openForm()} className="bg-amber hover:bg-gold text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Item
            </Button>
          </CardContent>
        </Card>
      ) : filteredItems.length === 0 ? (
        <Card className="bg-card border-amber/20">
          <CardContent className="text-center py-12">
            <Package className="h-16 w-16 mx-auto mb-4 text-cream/30" />
            <p className="text-cream/70">No items match your search or filter.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => {
            const lowStock = isLowStock(item);
            const expiringSoon = isExpiringSoon(item.expirationDate);
            const expired = isExpired(item.expirationDate);

            return (
              <Card
                key={item.id}
                className={`bg-card border-amber/20 hover:border-gold transition-colors ${
                  lowStock || expired ? 'ring-2 ring-red-500/50' : expiringSoon ? 'ring-2 ring-yellow-500/50' : ''
                }`}
              >
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-lg text-cream">{item.name}</CardTitle>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openForm(item)}
                        className="text-cream/50 hover:text-gold transition-colors"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="text-cream/50 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <span className={`inline-block px-2 py-1 rounded text-xs font-bold text-white ${CATEGORY_COLORS[item.category]}`}>
                      {item.category}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Quantity Display */}
                  <div className={`bg-amber/10 border ${lowStock ? 'border-red-500/50' : 'border-amber/30'} rounded p-3`}>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-cream/70">Stock Level:</span>
                      <span className={`text-xl font-bold ${lowStock ? 'text-red-500' : 'text-gold'}`}>
                        {item.quantity} {item.unit}
                      </span>
                    </div>
                    {lowStock && (
                      <div className="flex items-center gap-1 mt-2 text-red-500 text-xs">
                        <AlertTriangle className="h-3 w-3" />
                        <span>Low Stock Warning</span>
                      </div>
                    )}
                  </div>

                  {/* Dates */}
                  {(item.purchaseDate || item.expirationDate) && (
                    <div className="text-sm space-y-1">
                      {item.purchaseDate && (
                        <div className="text-cream/60">
                          Purchased: {new Date(item.purchaseDate).toLocaleDateString()}
                        </div>
                      )}
                      {item.expirationDate && (
                        <div className={expired ? 'text-red-500 font-semibold' : expiringSoon ? 'text-yellow-500' : 'text-cream/60'}>
                          {expired && <AlertTriangle className="h-3 w-3 inline mr-1" />}
                          Expires: {new Date(item.expirationDate).toLocaleDateString()}
                          {expired && ' (EXPIRED)'}
                          {expiringSoon && !expired && ' (Soon)'}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Notes */}
                  {item.notes && (
                    <div className="pt-2 border-t border-amber/20">
                      <p className="text-xs text-cream/60 line-clamp-2">{item.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
