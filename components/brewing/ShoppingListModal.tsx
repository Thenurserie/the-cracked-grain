'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Copy, Printer, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import type { ShoppingListItem } from '@/lib/productMatcher';

interface ShoppingListModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipeName: string;
  items: ShoppingListItem[];
  totalCost: number;
}

export default function ShoppingListModal({
  isOpen,
  onClose,
  recipeName,
  items,
  totalCost
}: ShoppingListModalProps) {
  const [copied, setCopied] = useState(false);

  const formatShoppingListText = (): string => {
    const sections = {
      'Grains': items.filter(i => i.category === 'Grains'),
      'Hops': items.filter(i => i.category === 'Hops'),
      'Yeast': items.filter(i => i.category === 'Yeast'),
      'Other': items.filter(i => !['Grains', 'Hops', 'Yeast'].includes(i.category))
    };

    let text = `SHOPPING LIST FOR: ${recipeName}\n`;
    text += '='.repeat(50) + '\n\n';

    Object.entries(sections).forEach(([category, categoryItems]) => {
      if (categoryItems.length > 0) {
        text += `${category.toUpperCase()}:\n`;
        categoryItems.forEach(item => {
          text += `☐ ${item.name} - ${item.quantity} ${item.unit}`;
          if (item.price) {
            text += ` ($${item.price.toFixed(2)})`;
          }
          text += '\n';
        });
        text += '\n';
      }
    });

    text += `ESTIMATED TOTAL: $${totalCost.toFixed(2)}\n`;

    return text;
  };

  const handleCopy = async () => {
    const text = formatShoppingListText();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('Shopping list copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const handlePrint = () => {
    const text = formatShoppingListText();
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Shopping List - ${recipeName}</title>
            <style>
              body {
                font-family: 'Courier New', monospace;
                padding: 20px;
                max-width: 800px;
                margin: 0 auto;
              }
              pre {
                white-space: pre-wrap;
                word-wrap: break-word;
              }
              @media print {
                body { padding: 10px; }
              }
            </style>
          </head>
          <body>
            <pre>${text}</pre>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const sections = {
    'Grains': items.filter(i => i.category === 'Grains'),
    'Hops': items.filter(i => i.category === 'Hops'),
    'Yeast': items.filter(i => i.category === 'Yeast'),
    'Other': items.filter(i => !['Grains', 'Hops', 'Yeast'].includes(i.category))
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-gold">Shopping List</DialogTitle>
          <DialogDescription>
            {recipeName || 'Recipe Ingredients'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {Object.entries(sections).map(([category, categoryItems]) => {
            if (categoryItems.length === 0) return null;

            return (
              <div key={category} className="space-y-2">
                <h3 className="font-bold text-lg text-gold border-b border-gold/30 pb-1">
                  {category}
                </h3>
                <div className="space-y-1">
                  {categoryItems.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-border/50">
                      <div className="flex-1">
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {item.quantity} {item.unit}
                        </div>
                      </div>
                      {item.price && (
                        <div className="text-right font-semibold">
                          ${item.price.toFixed(2)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          <div className="border-t-2 border-gold/30 pt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-gold">Estimated Total</span>
              <span className="text-2xl font-bold text-gold">${totalCost.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button onClick={handleCopy} variant="outline" className="flex-1">
              {copied ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy to Clipboard
                </>
              )}
            </Button>
            <Button onClick={handlePrint} variant="outline" className="flex-1">
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
