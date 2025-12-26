'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Check,
  ShoppingCart,
  Package,
  HelpCircle,
  Loader2,
  Plus,
  Minus,
  CheckSquare,
  Square,
  Info
} from 'lucide-react';
import {
  kitBuilderSteps,
  bundleDiscounts,
  KitCategory,
  kitTiers,
  equipmentCategories,
  ingredientCategories,
  KitTier
} from '@/lib/kit-builder-config';

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
  const [selectedTier, setSelectedTier] = useState<KitTier | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  const [skippedCategories, setSkippedCategories] = useState<Set<string>>(new Set());
  const [categoryProducts, setCategoryProducts] = useState<Map<string, Product[]>>(new Map());
  const [loadingCategories, setLoadingCategories] = useState<Set<string>>(new Set());
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

  // Pre-fetch products when equipment step is reached
  useEffect(() => {
    const step = kitBuilderSteps[currentStep];
    if (step?.type === 'equipment' || step?.type === 'ingredients') {
      step.categories?.forEach(category => {
        fetchProductsForCategory(category);
      });
    }
  }, [currentStep]);

  // Handle tier selection
  const selectTier = (tier: KitTier) => {
    setSelectedTier(tier);
    setCurrentStep(1); // Move to equipment step
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
      let sessionId = localStorage.getItem('sessionId');
      if (!sessionId) {
        sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('sessionId', sessionId);
      }

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

  // Check if category is included in selected tier
  const isCategoryInTier = (categoryId: string): boolean => {
    return selectedTier?.includedCategories.includes(categoryId) || false;
  };

  // Check if category has products selected or is skipped
  const isCategoryComplete = (categoryId: string): boolean => {
    return selectedProducts.some(p => p.categoryId === categoryId) || skippedCategories.has(categoryId);
  };

  const step = kitBuilderSteps[currentStep];

  return (
    <div className="min-h-screen bg-neutral-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Content */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold text-white mb-2">Build Your Custom Brewing Kit</h1>
            <p className="text-neutral-400 mb-6">
              {step.id === 'tier-selection' && 'Start by choosing your kit level'}
              {step.id === 'equipment' && 'Customize your equipment selection'}
              {step.id === 'ingredients' && 'Add brewing chemicals and ingredients'}
            </p>

            {/* Tier Selection Step */}
            {step.id === 'tier-selection' && (
              <div className="grid grid-cols-1 gap-6">
                {kitTiers.map(tier => (
                  <button
                    key={tier.id}
                    onClick={() => selectTier(tier)}
                    className={`p-6 rounded-lg border-2 text-left transition-all ${
                      selectedTier?.id === tier.id
                        ? 'border-amber-500 bg-amber-500/10'
                        : 'border-neutral-700 bg-neutral-800 hover:border-neutral-600'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-2xl font-bold text-white">{tier.name}</h3>
                        <p className="text-amber-500 text-lg font-semibold">{tier.price}</p>
                      </div>
                      {selectedTier?.id === tier.id && (
                        <Check className="w-6 h-6 text-amber-500 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-neutral-300 mb-2">{tier.description}</p>
                    <p className="text-sm text-neutral-400 italic">{tier.recommended}</p>
                    <div className="mt-4 pt-4 border-t border-neutral-700">
                      <p className="text-xs text-neutral-300 mb-2">Includes:</p>
                      <div className="flex flex-wrap gap-2">
                        {tier.includedCategories.map(catId => {
                          const category = [...equipmentCategories, ...ingredientCategories].find(c => c.id === catId);
                          return category ? (
                            <span key={catId} className="text-xs bg-neutral-700 text-neutral-300 px-2 py-1 rounded">
                              {category.name}
                            </span>
                          ) : null;
                        })}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Equipment Step */}
            {step.id === 'equipment' && step.categories && (
              <div className="space-y-6">
                {step.categories.map(category => {
                  const products = categoryProducts.get(category.id) || [];
                  const isLoading = loadingCategories.has(category.id);
                  const isSkipped = skippedCategories.has(category.id);
                  const isInTier = isCategoryInTier(category.id);
                  const categorySelections = selectedProducts.filter(p => p.categoryId === category.id);

                  return (
                    <div key={category.id} className="bg-neutral-800 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-xl font-semibold text-white">{category.name}</h3>
                            {isInTier && (
                              <span className="text-xs bg-amber-600 text-white px-2 py-0.5 rounded">
                                Included in {selectedTier?.name}
                              </span>
                            )}
                            {(categorySelections.length > 0 || isSkipped) && (
                              <Check className="w-5 h-5 text-green-500 ml-1" />
                            )}
                          </div>
                          <p className="text-sm text-neutral-400 mb-2">{category.description}</p>
                          {category.why && (
                            <div className="flex items-start gap-2 mt-2 p-3 bg-blue-500/10 border border-blue-500/30 rounded">
                              <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                              <p className="text-sm text-blue-300">{category.why}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                          <Loader2 className="w-6 h-6 text-amber-500 animate-spin" />
                        </div>
                      ) : products.length === 0 ? (
                        <div className="text-center py-8 text-neutral-300">
                          No products found in this category
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {products.map(product => {
                            const quantity = getProductQuantity(category.id, product.id);

                            return (
                              <div
                                key={product.id}
                                className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${
                                  quantity > 0
                                    ? 'border-amber-500 bg-amber-500/10'
                                    : product.inStock
                                    ? 'border-neutral-700 bg-neutral-900'
                                    : 'border-neutral-700 bg-neutral-900 opacity-50'
                                }`}
                              >
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
                                      <Package className="w-6 h-6 text-neutral-400" />
                                    </div>
                                  )}
                                </div>

                                <div className="flex-grow">
                                  <div className="font-medium text-white">{product.name}</div>
                                  {product.description && (
                                    <p className="text-xs text-neutral-400 mt-1 line-clamp-2">{product.description}</p>
                                  )}
                                  {!product.inStock && (
                                    <span className="text-xs text-red-400">Out of stock</span>
                                  )}
                                </div>

                                <div className="text-lg font-semibold text-amber-500 flex-shrink-0">
                                  ${product.price.toFixed(2)}
                                </div>

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
                                    >
                                      <Plus className="w-4 h-4 text-white" />
                                    </button>
                                  </div>
                                )}
                              </div>
                            );
                          })}

                          {category.allowSkip && (
                            <button
                              onClick={() => toggleSkipCategory(category.id)}
                              className={`w-full flex items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all ${
                                isSkipped
                                  ? 'border-green-500 bg-green-500/10 text-green-400'
                                  : 'border-neutral-700 bg-neutral-900 hover:border-neutral-600 text-neutral-400'
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

                <div className="flex gap-4">
                  <button
                    onClick={() => setCurrentStep(0)}
                    className="px-6 py-3 bg-neutral-700 text-white rounded-lg hover:bg-neutral-600 transition-colors"
                  >
                    Change Kit Level
                  </button>
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="flex-1 px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                  >
                    Continue to Ingredients
                  </button>
                </div>
              </div>
            )}

            {/* Ingredients Step */}
            {step.id === 'ingredients' && step.categories && (
              <div className="space-y-6">
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <p className="text-blue-300 text-sm">
                    Optional brewing chemicals and ingredients to enhance your brews. Each item includes an explanation of what it does and when to use it.
                  </p>
                </div>

                {step.categories.map(category => {
                  const products = categoryProducts.get(category.id) || [];
                  const isLoading = loadingCategories.has(category.id);
                  const isSkipped = skippedCategories.has(category.id);
                  const categorySelections = selectedProducts.filter(p => p.categoryId === category.id);

                  return (
                    <div key={category.id} className="bg-neutral-800 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-xl font-semibold text-white">{category.name}</h3>
                            {categorySelections.length > 0 && (
                              <Check className="w-5 h-5 text-green-500" />
                            )}
                          </div>
                          <p className="text-sm text-neutral-400 mb-2">{category.description}</p>
                          {category.why && (
                            <div className="flex items-start gap-2 mt-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded">
                              <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                              <p className="text-sm text-blue-300">{category.why}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                          <Loader2 className="w-6 h-6 text-amber-500 animate-spin" />
                        </div>
                      ) : products.length === 0 ? (
                        <div className="text-center py-8 text-neutral-300">
                          No products found
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {products.map(product => {
                            const quantity = getProductQuantity(category.id, product.id);

                            return (
                              <div
                                key={product.id}
                                className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${
                                  quantity > 0
                                    ? 'border-amber-500 bg-amber-500/10'
                                    : product.inStock
                                    ? 'border-neutral-700 bg-neutral-900'
                                    : 'border-neutral-700 bg-neutral-900 opacity-50'
                                }`}
                              >
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
                                      <Package className="w-6 h-6 text-neutral-400" />
                                    </div>
                                  )}
                                </div>

                                <div className="flex-grow">
                                  <div className="font-medium text-white">{product.name}</div>
                                  {product.description && (
                                    <p className="text-xs text-neutral-400 mt-1 line-clamp-2">{product.description}</p>
                                  )}
                                  {!product.inStock && (
                                    <span className="text-xs text-red-400">Out of stock</span>
                                  )}
                                </div>

                                <div className="text-lg font-semibold text-amber-500 flex-shrink-0">
                                  ${product.price.toFixed(2)}
                                </div>

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
                                    >
                                      <Plus className="w-4 h-4 text-white" />
                                    </button>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}

                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-6 py-3 bg-neutral-700 text-white rounded-lg hover:bg-neutral-600 transition-colors"
                >
                  Back to Equipment
                </button>
              </div>
            )}
          </div>

          {/* Sidebar - Checklist & Summary */}
          <div className="lg:col-span-1">
            <div className="bg-neutral-800 rounded-lg p-6 sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto">
              <h2 className="text-lg font-semibold text-white mb-4">
                {selectedTier ? `${selectedTier.name} Checklist` : 'Your Kit'}
              </h2>

              {selectedTier && (
                <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                  <p className="text-xs text-amber-300">
                    {selectedTier.name} includes: {selectedTier.includedCategories.length} categories
                  </p>
                </div>
              )}

              {/* Equipment Checklist */}
              <div className="space-y-2 mb-4">
                <h3 className="text-sm font-semibold text-neutral-400 uppercase mb-2">Equipment</h3>
                {equipmentCategories.map(category => {
                  const isComplete = isCategoryComplete(category.id);
                  const isInTier = isCategoryInTier(category.id);

                  return (
                    <div key={category.id} className="flex items-center gap-2 text-sm">
                      {isComplete ? (
                        <CheckSquare className="w-4 h-4 text-green-500 flex-shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                      )}
                      <span className={`flex-1 ${isComplete ? 'text-neutral-300' : 'text-neutral-300'}`}>
                        {category.name}
                      </span>
                      {isInTier && (
                        <span className="text-xs text-amber-500">★</span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Ingredients Checklist */}
              <div className="space-y-2 mb-4 pt-4 border-t border-neutral-700">
                <h3 className="text-sm font-semibold text-neutral-400 uppercase mb-2">Ingredients</h3>
                {ingredientCategories.map(category => {
                  const isComplete = isCategoryComplete(category.id);

                  return (
                    <div key={category.id} className="flex items-center gap-2 text-sm">
                      {isComplete ? (
                        <CheckSquare className="w-4 h-4 text-green-500 flex-shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                      )}
                      <span className={`flex-1 ${isComplete ? 'text-neutral-300' : 'text-neutral-300'}`}>
                        {category.name}
                      </span>
                    </div>
                  );
                })}
              </div>

              {itemCount > 0 && (
                <>
                  <div className="border-t border-neutral-700 pt-4 mb-4">
                    <h3 className="text-sm font-semibold text-neutral-400 uppercase mb-2">Selected Items</h3>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {selectedProducts.map(({ product, quantity, categoryId }) => (
                        <div key={`${categoryId}-${product.id}`} className="flex items-center justify-between text-sm gap-2">
                          <span className="text-neutral-300 truncate flex-1">{product.name}</span>
                          {quantity > 1 && (
                            <span className="text-neutral-300">×{quantity}</span>
                          )}
                          <span className="text-white font-medium flex-shrink-0">
                            ${(product.price * quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-neutral-700 pt-4 space-y-2 bg-neutral-800 sticky bottom-0 pb-2">
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
                    disabled={isAddingToCart}
                    className="w-full mt-4 flex items-center justify-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50"
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
