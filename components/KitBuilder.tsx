'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  ChevronRight,
  ChevronLeft,
  Check,
  ShoppingCart,
  Package,
  HelpCircle,
  Loader2
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

interface SelectedItem {
  categoryId: string;
  product: Product | null;
  skipped: boolean;
}

export default function KitBuilder() {
  const [currentStep, setCurrentStep] = useState(0);
  const [beverageType, setBeverageType] = useState<string>('');
  const [batchSize, setBatchSize] = useState<string>('');
  const [brewingMethod, setBrewingMethod] = useState<string>('');
  const [selectedItems, setSelectedItems] = useState<Map<string, SelectedItem>>(new Map());
  const [categoryProducts, setCategoryProducts] = useState<Map<string, Product[]>>(new Map());
  const [loadingCategories, setLoadingCategories] = useState<Set<string>>(new Set());
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Get current step config
  const step = kitBuilderSteps[currentStep];

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
      params.set('batchSize', batchSize);

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

  // Fetch products when entering equipment/accessories steps
  useEffect(() => {
    if ((step?.type === 'products' || step?.type === 'accessories') && step.categories) {
      step.categories.forEach(category => {
        fetchProductsForCategory(category);
      });
    }
  }, [currentStep, batchSize]);

  // Handle choice selection
  const handleChoice = (value: string) => {
    if (step.id === 'beverage-type') {
      setBeverageType(value);
    } else if (step.id === 'batch-size') {
      setBatchSize(value);
    } else if (step.id === 'brewing-method') {
      setBrewingMethod(value);
    }

    // Auto-advance after selection
    setTimeout(() => nextStep(), 300);
  };

  // Handle product selection
  const selectProduct = (categoryId: string, product: Product | null, skipped: boolean = false) => {
    setSelectedItems(prev => {
      const next = new Map(prev);
      next.set(categoryId, { categoryId, product, skipped });
      return next;
    });
  };

  // Navigation
  const nextStep = () => {
    let nextIndex = currentStep + 1;

    // Skip brewing method step if not beer
    while (nextIndex < kitBuilderSteps.length) {
      const nextStepConfig = kitBuilderSteps[nextIndex];
      if (nextStepConfig.showIf) {
        if (nextStepConfig.showIf.beverageType && nextStepConfig.showIf.beverageType !== beverageType) {
          nextIndex++;
          continue;
        }
      }
      break;
    }

    if (nextIndex < kitBuilderSteps.length) {
      setCurrentStep(nextIndex);
    }
  };

  const prevStep = () => {
    let prevIndex = currentStep - 1;

    // Skip brewing method step if not beer
    while (prevIndex >= 0) {
      const prevStepConfig = kitBuilderSteps[prevIndex];
      if (prevStepConfig.showIf) {
        if (prevStepConfig.showIf.beverageType && prevStepConfig.showIf.beverageType !== beverageType) {
          prevIndex--;
          continue;
        }
      }
      break;
    }

    if (prevIndex >= 0) {
      setCurrentStep(prevIndex);
    }
  };

  // Calculate totals
  const calculateTotals = () => {
    let subtotal = 0;
    let itemCount = 0;
    const items: { product: Product; categoryId: string }[] = [];

    selectedItems.forEach((item) => {
      if (item.product && !item.skipped) {
        subtotal += item.product.price;
        itemCount++;
        items.push({ product: item.product, categoryId: item.categoryId });
      }
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

    return { subtotal, discount, discountPercent, total, itemCount, items };
  };

  // Add all to cart
  const addAllToCart = async () => {
    setIsAddingToCart(true);
    const { items } = calculateTotals();

    try {
      // Get session ID from cookies or localStorage
      let sessionId = localStorage.getItem('sessionId');
      if (!sessionId) {
        sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('sessionId', sessionId);
      }

      // Add each item to cart
      for (const { product } of items) {
        await fetch('/api/cart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-session-id': sessionId,
          },
          body: JSON.stringify({
            productId: product.id,
            quantity: 1,
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

  const { subtotal, discount, discountPercent, total, itemCount, items } = calculateTotals();

  const isLastStep = currentStep === kitBuilderSteps.length - 1;

  return (
    <div className="min-h-screen bg-neutral-900">
      {/* Progress Bar */}
      <div className="bg-neutral-800 border-b border-neutral-700">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-neutral-400">
              Step {currentStep + 1} of {kitBuilderSteps.length}
            </span>
            <span className="text-sm text-amber-500 font-medium">
              {itemCount} items selected • ${total.toFixed(2)}
            </span>
          </div>
          <div className="h-2 bg-neutral-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-600 transition-all duration-300"
              style={{ width: `${((currentStep + 1) / kitBuilderSteps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Content */}
          <div className="lg:col-span-2">
            <h1 className="text-2xl font-bold text-white mb-2">{step.title}</h1>

            {/* Choice Step */}
            {step.type === 'choice' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                {step.options?.map(option => {
                  const isSelected =
                    (step.id === 'beverage-type' && beverageType === option.value) ||
                    (step.id === 'batch-size' && batchSize === option.value) ||
                    (step.id === 'brewing-method' && brewingMethod === option.value);

                  return (
                    <button
                      key={option.value}
                      onClick={() => handleChoice(option.value)}
                      className={`p-6 rounded-lg border-2 text-left transition-all ${
                        isSelected
                          ? 'border-amber-500 bg-amber-500/10'
                          : 'border-neutral-700 bg-neutral-800 hover:border-neutral-600'
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
              <div className="space-y-8 mt-6">
                {step.categories?.map(category => {
                  const products = categoryProducts.get(category.id) || [];
                  const isLoading = loadingCategories.has(category.id);
                  const selection = selectedItems.get(category.id);

                  return (
                    <div key={category.id} className="bg-neutral-800 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold text-white">{category.name}</h3>
                            {category.required && (
                              <span className="text-xs bg-amber-600 text-white px-2 py-0.5 rounded">
                                Required
                              </span>
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
                            const isSelected = selection?.product?.id === product.id && !selection?.skipped;

                            return (
                              <button
                                key={product.id}
                                onClick={() => selectProduct(category.id, product)}
                                disabled={!product.inStock}
                                className={`w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${
                                  isSelected
                                    ? 'border-amber-500 bg-amber-500/10'
                                    : product.inStock
                                    ? 'border-neutral-700 bg-neutral-900 hover:border-neutral-600'
                                    : 'border-neutral-700 bg-neutral-900 opacity-50 cursor-not-allowed'
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
                                <div className="flex-grow text-left">
                                  <div className="font-medium text-white">{product.name}</div>
                                  {!product.inStock && (
                                    <span className="text-xs text-red-400">Out of stock</span>
                                  )}
                                </div>

                                {/* Price and selection */}
                                <div className="text-right flex-shrink-0">
                                  <div className="text-lg font-semibold text-amber-500">
                                    ${product.price.toFixed(2)}
                                  </div>
                                  {isSelected && (
                                    <Check className="w-5 h-5 text-amber-500 ml-auto" />
                                  )}
                                </div>
                              </button>
                            );
                          })}

                          {/* "I already have one" option */}
                          {category.allowSkip && (
                            <button
                              onClick={() => selectProduct(category.id, null, true)}
                              className={`w-full flex items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all ${
                                selection?.skipped
                                  ? 'border-green-500 bg-green-500/10 text-green-400'
                                  : 'border-neutral-700 bg-neutral-900 hover:border-neutral-600 text-neutral-400'
                              }`}
                            >
                              {selection?.skipped && <Check className="w-5 h-5" />}
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

            {/* Navigation */}
            <div className="flex justify-between mt-8">
              <button
                onClick={prevStep}
                disabled={currentStep === 0}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${
                  currentStep === 0
                    ? 'bg-neutral-800 text-neutral-600 cursor-not-allowed'
                    : 'bg-neutral-800 text-white hover:bg-neutral-700'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
                Back
              </button>

              {!isLastStep ? (
                <button
                  onClick={nextStep}
                  className="flex items-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                >
                  Continue
                  <ChevronRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={addAllToCart}
                  disabled={itemCount === 0 || isAddingToCart}
                  className="flex items-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAddingToCart ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <ShoppingCart className="w-5 h-5" />
                  )}
                  Add All to Cart
                </button>
              )}
            </div>
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
                  <div className="space-y-3 mb-6">
                    {items.map(({ product, categoryId }) => (
                      <div key={categoryId} className="flex items-center justify-between text-sm">
                        <span className="text-neutral-300 truncate pr-2">{product.name}</span>
                        <span className="text-white font-medium">${product.price.toFixed(2)}</span>
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
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
