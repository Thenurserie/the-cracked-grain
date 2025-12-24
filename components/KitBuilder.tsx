'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  ChevronDown,
  ChevronUp,
  Check,
  ShoppingCart,
  Package,
  HelpCircle,
  Loader2,
  Plus,
  Minus,
  X
} from 'lucide-react';
import { kitBuilderSteps, bundleDiscounts, KitCategory } from '@/lib/kit-builder-config';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  comparePrice: number | null;
  image: string | null;
  slug: string;
  inStock: boolean;
  stockQuantity: number;
  sku: string;
}

interface SelectedProduct {
  product: Product;
  quantity: number;
  categoryId: string;
}

export default function KitBuilder() {
  const [experienceLevel, setExperienceLevel] = useState<string>('');
  const [beverageType, setBeverageType] = useState<string>('');
  const [batchSize, setBatchSize] = useState<string>('');
  const [brewingMethod, setBrewingMethod] = useState<string>('');
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  const [skippedCategories, setSkippedCategories] = useState<Set<string>>(new Set());
  const [categoryProducts, setCategoryProducts] = useState<Map<string, Product[]>>(new Map());
  const [loadingCategories, setLoadingCategories] = useState<Set<string>>(new Set());
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['experience-level']));
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Fetch products for a category
  const fetchProductsForCategory = async (category: KitCategory) => {
    if (categoryProducts.has(category.id) || loadingCategories.has(category.id)) {
      return;
    }

    setLoadingCategories(prev => new Set(prev).add(category.id));

    try {
      const params = new URLSearchParams();
      if (category.productFilter.category) {
        params.set('category', category.productFilter.category);
      }
      if (category.productFilter.tags?.length) {
        params.set('tags', category.productFilter.tags.join(','));
      }
      if (category.productFilter.searchTerms?.length) {
        params.set('search', category.productFilter.searchTerms.join(','));
      }
      if (batchSize) {
        params.set('batchSize', batchSize);
      }

      const response = await fetch(`/api/products/by-category?${params}`);
      const data = await response.json();

      setCategoryProducts(prev => new Map(prev).set(category.id, data.products || []));
    } catch (error) {
      console.error(`Error fetching products for ${category.id}:`, error);
      setCategoryProducts(prev => new Map(prev).set(category.id, []));
    } finally {
      setLoadingCategories(prev => {
        const next = new Set(prev);
        next.delete(category.id);
        return next;
      });
    }
  };

  // Fetch products when batch size is set
  useEffect(() => {
    if (batchSize) {
      kitBuilderSteps.forEach(step => {
        if ((step.type === 'products' || step.type === 'accessories') && step.categories) {
          step.categories.forEach(category => {
            fetchProductsForCategory(category);
          });
        }
      });
    }
  }, [batchSize]);

  // Toggle section expansion
  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  };

  // Add or update product quantity
  const updateProductQuantity = (categoryId: string, product: Product, delta: number) => {
    setSelectedProducts(prev => {
      const existing = prev.find(p => p.product.id === product.id && p.categoryId === categoryId);

      if (existing) {
        const newQuantity = existing.quantity + delta;
        if (newQuantity <= 0) {
          return prev.filter(p => !(p.product.id === product.id && p.categoryId === categoryId));
        }
        return prev.map(p =>
          p.product.id === product.id && p.categoryId === categoryId
            ? { ...p, quantity: newQuantity }
            : p
        );
      } else if (delta > 0) {
        return [...prev, { product, quantity: delta, categoryId }];
      }
      return prev;
    });

    // Remove from skipped if adding product
    if (delta > 0) {
      setSkippedCategories(prev => {
        const next = new Set(prev);
        next.delete(categoryId);
        return next;
      });
    }
  };

  // Skip category
  const toggleSkipCategory = (categoryId: string) => {
    setSkippedCategories(prev => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
        // Remove all products from this category
        setSelectedProducts(prevProducts =>
          prevProducts.filter(p => p.categoryId !== categoryId)
        );
      }
      return next;
    });
  };

  // Pre-select items based on experience level
  useEffect(() => {
    if (experienceLevel && batchSize) {
      // Expand next section after selecting experience
      setExpandedSections(prev => new Set(prev).add('beverage-type'));
    }
  }, [experienceLevel]);

  // Calculate totals
  const calculateTotals = () => {
    let subtotal = 0;
    let itemCount = 0;

    selectedProducts.forEach(({ product, quantity }) => {
      subtotal += product.price * quantity;
      itemCount += quantity;
    });

    // Calculate discount
    let discountPercent = 0;
    if (itemCount >= bundleDiscounts.maxDiscountThreshold) {
      discountPercent = bundleDiscounts.maxDiscountPercent;
    } else if (itemCount >= bundleDiscounts.minItemsForDiscount) {
      discountPercent = bundleDiscounts.discountPercent;
    }

    const discount = subtotal * (discountPercent / 100);
    const total = subtotal - discount;

    return { subtotal, discount, discountPercent, total, itemCount };
  };

  // Add all to cart
  const addAllToCart = async () => {
    setIsAddingToCart(true);

    try {
      // Get session ID from cookies or localStorage
      let sessionId = localStorage.getItem('sessionId');
      if (!sessionId) {
        sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('sessionId', sessionId);
      }

      // Add each item to cart
      for (const { product, quantity } of selectedProducts) {
        await fetch('/api/cart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-session-id': sessionId,
          },
          body: JSON.stringify({
            productId: product.id,
            quantity,
          }),
        });
      }

      // Redirect to cart
      window.location.href = '/cart';
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Error adding items to cart. Please try again.');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const { subtotal, discount, discountPercent, total, itemCount } = calculateTotals();

  // Get product quantity for a specific product
  const getProductQuantity = (categoryId: string, productId: string): number => {
    const item = selectedProducts.find(p => p.product.id === productId && p.categoryId === categoryId);
    return item ? item.quantity : 0;
  };

  // Check if step should be shown
  const shouldShowStep = (step: typeof kitBuilderSteps[0]): boolean => {
    if (step.showIf) {
      if (step.showIf.beverageType && step.showIf.beverageType !== beverageType) {
        return false;
      }
    }
    return true;
  };

  return (
    <div className="min-h-screen bg-neutral-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4">
            <h1 className="text-3xl font-bold text-white mb-6">Build Your Custom Kit</h1>

            {/* All Steps as Accordion */}
            {kitBuilderSteps.filter(shouldShowStep).map((step, index) => {
              const isExpanded = expandedSections.has(step.id);
              const isCompleted =
                (step.id === 'experience-level' && experienceLevel) ||
                (step.id === 'beverage-type' && beverageType) ||
                (step.id === 'batch-size' && batchSize) ||
                (step.id === 'brewing-method' && brewingMethod) ||
                (step.type === 'products' && step.categories?.some(cat =>
                  selectedProducts.some(p => p.categoryId === cat.id) || skippedCategories.has(cat.id)
                )) ||
                (step.type === 'accessories' && step.categories?.some(cat =>
                  selectedProducts.some(p => p.categoryId === cat.id) || skippedCategories.has(cat.id)
                ));

              return (
                <div key={step.id} className="bg-neutral-800 rounded-lg overflow-hidden">
                  {/* Accordion Header */}
                  <button
                    onClick={() => toggleSection(step.id)}
                    className="w-full flex items-center justify-between p-6 text-left hover:bg-neutral-700/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isCompleted ? 'bg-green-500' : 'bg-neutral-700'
                      }`}>
                        {isCompleted ? (
                          <Check className="w-5 h-5 text-white" />
                        ) : (
                          <span className="text-sm text-neutral-400">{index + 1}</span>
                        )}
                      </div>
                      <h2 className="text-xl font-semibold text-white">{step.title}</h2>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-neutral-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-neutral-400" />
                    )}
                  </button>

                  {/* Accordion Content */}
                  {isExpanded && (
                    <div className="p-6 pt-0 border-t border-neutral-700">
                      {/* Choice Step */}
                      {step.type === 'choice' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                          {step.options?.map(option => {
                            const isSelected =
                              (step.id === 'experience-level' && experienceLevel === option.value) ||
                              (step.id === 'beverage-type' && beverageType === option.value) ||
                              (step.id === 'batch-size' && batchSize === option.value) ||
                              (step.id === 'brewing-method' && brewingMethod === option.value);

                            return (
                              <button
                                key={option.value}
                                onClick={() => {
                                  if (step.id === 'experience-level') {
                                    setExperienceLevel(option.value);
                                  } else if (step.id === 'beverage-type') {
                                    setBeverageType(option.value);
                                  } else if (step.id === 'batch-size') {
                                    setBatchSize(option.value);
                                  } else if (step.id === 'brewing-method') {
                                    setBrewingMethod(option.value);
                                  }
                                }}
                                className={`p-6 rounded-lg border-2 text-left transition-all ${
                                  isSelected
                                    ? 'border-amber-500 bg-amber-500/10'
                                    : 'border-neutral-700 bg-neutral-900 hover:border-neutral-600'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-lg font-semibold text-white">{option.label}</span>
                                  {isSelected && <Check className="w-5 h-5 text-amber-500" />}
                                </div>
                                {option.description && (
                                  <p className="text-sm text-neutral-400 mt-1">{option.description}</p>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {/* Products/Accessories Step */}
                      {(step.type === 'products' || step.type === 'accessories') && (
                        <div className="space-y-6 mt-4">
                          {step.categories?.map(category => {
                            const products = categoryProducts.get(category.id) || [];
                            const isLoading = loadingCategories.has(category.id);
                            const isSkipped = skippedCategories.has(category.id);
                            const categorySelections = selectedProducts.filter(p => p.categoryId === category.id);

                            return (
                              <div key={category.id} className="bg-neutral-900 rounded-lg p-5">
                                <div className="flex items-start justify-between mb-4">
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <h3 className="text-lg font-semibold text-white">{category.name}</h3>
                                      {category.required && (
                                        <span className="text-xs bg-amber-600 text-white px-2 py-0.5 rounded">
                                          Required
                                        </span>
                                      )}
                                      {(categorySelections.length > 0 || isSkipped) && (
                                        <Check className="w-5 h-5 text-green-500 ml-1" />
                                      )}
                                    </div>
                                    <p className="text-sm text-neutral-400">{category.description}</p>
                                  </div>
                                  {category.helpText && (
                                    <div className="group relative">
                                      <HelpCircle className="w-5 h-5 text-neutral-500 cursor-help" />
                                      <div className="absolute right-0 top-6 w-64 p-3 bg-neutral-700 rounded-lg text-sm text-neutral-300 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                                        {category.helpText}
                                      </div>
                                    </div>
                                  )}
                                </div>

                                {isLoading ? (
                                  <div className="flex items-center justify-center py-8">
                                    <Loader2 className="w-6 h-6 text-amber-500 animate-spin" />
                                  </div>
                                ) : products.length === 0 ? (
                                  <div className="text-center py-8 text-neutral-500">
                                    No products found in this category
                                  </div>
                                ) : (
                                  <div className="space-y-3">
                                    {/* Product options */}
                                    {products.map(product => {
                                      const quantity = getProductQuantity(category.id, product.id);

                                      return (
                                        <div
                                          key={product.id}
                                          className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${
                                            quantity > 0
                                              ? 'border-amber-500 bg-amber-500/10'
                                              : product.inStock
                                              ? 'border-neutral-700 bg-neutral-800'
                                              : 'border-neutral-700 bg-neutral-800 opacity-50'
                                          }`}
                                        >
                                          {/* Product image */}
                                          <div className="w-16 h-16 bg-neutral-700 rounded-lg overflow-hidden flex-shrink-0">
                                            {product.image ? (
                                              <Image
                                                src={product.image}
                                                alt={product.name}
                                                width={64}
                                                height={64}
                                                className="w-full h-full object-cover"
                                              />
                                            ) : (
                                              <div className="w-full h-full flex items-center justify-center">
                                                <Package className="w-6 h-6 text-neutral-500" />
                                              </div>
                                            )}
                                          </div>

                                          {/* Product info */}
                                          <div className="flex-grow">
                                            <div className="font-medium text-white">{product.name}</div>
                                            {!product.inStock && (
                                              <span className="text-xs text-red-400">Out of stock</span>
                                            )}
                                          </div>

                                          {/* Price */}
                                          <div className="text-lg font-semibold text-amber-500 flex-shrink-0">
                                            ${product.price.toFixed(2)}
                                          </div>

                                          {/* Quantity Controls */}
                                          {product.inStock && (
                                            <div className="flex items-center gap-2 flex-shrink-0">
                                              {quantity > 0 && (
                                                <>
                                                  <button
                                                    onClick={() => updateProductQuantity(category.id, product, -1)}
                                                    className="w-8 h-8 flex items-center justify-center bg-neutral-700 hover:bg-neutral-600 rounded transition-colors"
                                                  >
                                                    <Minus className="w-4 h-4 text-white" />
                                                  </button>
                                                  <span className="w-8 text-center text-white font-medium">{quantity}</span>
                                                </>
                                              )}
                                              <button
                                                onClick={() => updateProductQuantity(category.id, product, 1)}
                                                className="w-8 h-8 flex items-center justify-center bg-amber-600 hover:bg-amber-700 rounded transition-colors"
                                                disabled={!product.inStock}
                                              >
                                                <Plus className="w-4 h-4 text-white" />
                                              </button>
                                            </div>
                                          )}
                                        </div>
                                      );
                                    })}

                                    {/* "I already have one" option */}
                                    {category.allowSkip && (
                                      <button
                                        onClick={() => toggleSkipCategory(category.id)}
                                        className={`w-full flex items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all ${
                                          isSkipped
                                            ? 'border-green-500 bg-green-500/10 text-green-400'
                                            : 'border-neutral-700 bg-neutral-800 hover:border-neutral-600 text-neutral-400'
                                        }`}
                                      >
                                        {isSkipped && <Check className="w-5 h-5" />}
                                        I already have one
                                      </button>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Sidebar - Kit Summary */}
          <div className="lg:col-span-1">
            <div className="bg-neutral-800 rounded-lg p-6 sticky top-4">
              <h2 className="text-lg font-semibold text-white mb-4">Your Custom Kit</h2>

              {itemCount === 0 ? (
                <p className="text-neutral-500 text-sm">
                  Select equipment to build your kit
                </p>
              ) : (
                <>
                  <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
                    {selectedProducts.map(({ product, quantity, categoryId }) => (
                      <div key={`${categoryId}-${product.id}`} className="flex items-center justify-between text-sm gap-2">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span className="text-neutral-300 truncate">{product.name}</span>
                          {quantity > 1 && (
                            <span className="text-neutral-500">×{quantity}</span>
                          )}
                        </div>
                        <span className="text-white font-medium flex-shrink-0">
                          ${(product.price * quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-neutral-700 pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-400">Subtotal ({itemCount} items)</span>
                      <span className="text-white">${subtotal.toFixed(2)}</span>
                    </div>

                    {discountPercent > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-green-400">Bundle Discount ({discountPercent}%)</span>
                        <span className="text-green-400">-${discount.toFixed(2)}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-lg font-semibold pt-2 border-t border-neutral-700">
                      <span className="text-white">Total</span>
                      <span className="text-amber-500">${total.toFixed(2)}</span>
                    </div>
                  </div>

                  {discountPercent === 0 && itemCount < bundleDiscounts.minItemsForDiscount && (
                    <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                      <p className="text-sm text-amber-400">
                        Add {bundleDiscounts.minItemsForDiscount - itemCount} more item(s) to get {bundleDiscounts.discountPercent}% off!
                      </p>
                    </div>
                  )}

                  <button
                    onClick={addAllToCart}
                    disabled={itemCount === 0 || isAddingToCart}
                    className="w-full mt-6 flex items-center justify-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAddingToCart ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <ShoppingCart className="w-5 h-5" />
                    )}
                    Add All to Cart
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
