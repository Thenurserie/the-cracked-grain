# Square Checkout Integration Guide

## Overview

This guide walks through integrating Square Web Payments SDK for checkout on The Cracked Grain e-commerce site.

---

## Prerequisites

### Square Account Setup

1. **Create/Access Square Developer Account**
   - Go to: https://developer.squareup.com
   - Sign in with your existing Square account (The Nurserie)
   - Go to "Applications" in the dashboard

2. **Create Application** (if not exists)
   - Click "+" to create new application
   - Name it: "The Cracked Grain - Web Store"
   - This creates your application credentials

---

## Square Credentials Needed

### 1. Get Your Credentials

**Sandbox (Testing):**
- Go to: https://developer.squareup.com/apps
- Click on your application
- Click "Sandbox" tab
- You'll need:
  - **Application ID** (starts with `sandbox-sq0idb-`)
  - **Access Token** (starts with `EAAAl...`)
  - **Location ID** - Find in Sandbox test locations

**Production (Live):**
- Same dashboard, click "Production" tab
- You'll need:
  - **Application ID** (starts with `sq0idp-`)
  - **Access Token** (starts with `EAAAE...`)
  - **Location ID** - Your actual business location

### 2. Add to Environment Variables

Create/update `.env.local` file in project root:

```env
# Square Sandbox Credentials (for testing)
NEXT_PUBLIC_SQUARE_APPLICATION_ID=sandbox-sq0idb-YOUR_APP_ID
SQUARE_ACCESS_TOKEN=EAAAl_YOUR_SANDBOX_ACCESS_TOKEN
SQUARE_LOCATION_ID=YOUR_SANDBOX_LOCATION_ID
SQUARE_ENVIRONMENT=sandbox

# For production, change to:
# NEXT_PUBLIC_SQUARE_APPLICATION_ID=sq0idp-YOUR_PRODUCTION_APP_ID
# SQUARE_ACCESS_TOKEN=EAAAE_YOUR_PRODUCTION_ACCESS_TOKEN
# SQUARE_LOCATION_ID=YOUR_PRODUCTION_LOCATION_ID
# SQUARE_ENVIRONMENT=production
```

**Important:**
- `NEXT_PUBLIC_*` variables are exposed to browser (safe for Application ID)
- `SQUARE_ACCESS_TOKEN` is server-only (never expose to browser)
- Keep Access Token secret - it has full API access

---

## Database Schema

Good news! Your database already has the Orders tables configured:

### Existing Tables:
- **orders** - Main order records
- **order_items** - Individual items in each order

### Order Fields:
```typescript
Order {
  id: UUID
  orderNumber: string (unique)
  status: string (pending, processing, completed, cancelled)
  customerEmail: string
  customerName: string
  shippingAddress: JSON
  billingAddress: JSON
  subtotal: Decimal
  tax: Decimal
  shippingCost: Decimal
  total: Decimal
  notes: string
  createdAt: DateTime
  updatedAt: DateTime
  items: OrderItem[]
}

OrderItem {
  id: UUID
  orderId: UUID
  productId: UUID
  productName: string
  quantity: number
  unitPrice: Decimal
  subtotal: Decimal
}
```

No database changes needed - schema is ready!

---

## Implementation Steps

### Step 1: Install Square SDK

```bash
npm install square
npm install @square/web-sdk
```

### Step 2: Create Checkout Page

File: `app/checkout/page.tsx`

Features needed:
- Shipping information form (name, email, phone, address)
- Order summary (items, quantities, prices)
- Square payment card form
- Submit button to process payment

### Step 3: Create Payment API Endpoint

File: `app/api/checkout/route.ts`

Responsibilities:
- Receive payment nonce from Square Web SDK
- Create payment using Square Payments API
- Create order in database after successful payment
- Clear cart after successful order
- Return order confirmation data

### Step 4: Order Confirmation Page

File: `app/order-confirmation/[orderNumber]/page.tsx`

Display:
- Order number
- Order summary
- Shipping information
- Payment confirmation
- Order status

### Step 5: Connect Orders to Directus

Directus automatically recognizes the `orders` and `order_items` tables.

To view/manage orders in Directus:
1. Go to admin.thecrackedgrain.com
2. Click "orders" in left sidebar
3. View all orders with filters by status, date, customer
4. Click any order to see details and items
5. Update order status (pending → processing → shipped → delivered)

---

## Square Web Payments SDK Integration

### Client-Side (Checkout Page)

```tsx
'use client';

import { useEffect, useState } from 'react';

export default function CheckoutPage() {
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function initializeSquare() {
      if (!window.Square) {
        throw new Error('Square.js failed to load');
      }

      const payments = window.Square.payments(
        process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID,
        process.env.SQUARE_LOCATION_ID
      );

      const cardInstance = await payments.card();
      await cardInstance.attach('#card-container');
      setCard(cardInstance);
    }

    initializeSquare();
  }, []);

  async function handlePayment(e) {
    e.preventDefault();
    setLoading(true);

    try {
      // Tokenize card information
      const result = await card.tokenize();

      if (result.status === 'OK') {
        // Send token to your server
        const response = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sourceId: result.token,
            shippingInfo: {
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
              address: formData.address
            },
            amount: totalInCents // e.g., 5000 for $50.00
          })
        });

        const data = await response.json();

        if (data.success) {
          // Redirect to order confirmation
          router.push(`/order-confirmation/${data.orderNumber}`);
        }
      }
    } catch (error) {
      console.error('Payment error:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handlePayment}>
      {/* Shipping info fields */}

      {/* Square card element */}
      <div id="card-container"></div>

      <button type="submit" disabled={loading}>
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
}
```

### Server-Side (Payment API)

```typescript
// app/api/checkout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Client, Environment } from 'square';
import { prisma } from '@/lib/db';

const client = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN!,
  environment: process.env.SQUARE_ENVIRONMENT === 'production'
    ? Environment.Production
    : Environment.Sandbox
});

export async function POST(request: NextRequest) {
  try {
    const { sourceId, shippingInfo, amount, cartItems } = await request.json();

    // Create payment with Square
    const { result } = await client.paymentsApi.createPayment({
      sourceId,
      amountMoney: {
        amount: BigInt(amount),
        currency: 'USD'
      },
      locationId: process.env.SQUARE_LOCATION_ID!,
      idempotencyKey: crypto.randomUUID()
    });

    if (result.payment?.status === 'COMPLETED') {
      // Create order in database
      const orderNumber = `TCG-${Date.now()}`;

      const order = await prisma.order.create({
        data: {
          orderNumber,
          status: 'processing',
          customerEmail: shippingInfo.email,
          customerName: shippingInfo.name,
          shippingAddress: shippingInfo.address,
          subtotal: subtotal,
          tax: 0,
          shippingCost: shippingCost,
          total: amount / 100,
          items: {
            create: cartItems.map(item => ({
              productId: item.productId,
              productName: item.product.name,
              quantity: item.quantity,
              unitPrice: item.product.price,
              subtotal: item.product.price * item.quantity
            }))
          }
        }
      });

      // Clear cart
      await clearCart(sessionId);

      return NextResponse.json({
        success: true,
        orderNumber: order.orderNumber,
        paymentId: result.payment.id
      });
    }

    return NextResponse.json({ success: false, error: 'Payment failed' }, { status: 400 });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
```

---

## Testing Workflow

### Using Square Sandbox

1. **Test Credit Cards** (Sandbox only):
   ```
   Card Number: 4111 1111 1111 1111
   Expiration: Any future date
   CVV: Any 3 digits
   ZIP: Any 5 digits
   ```

2. **Test Payment Flow**:
   - Add items to cart
   - Go to checkout
   - Fill shipping info
   - Enter test card
   - Click "Pay Now"
   - Verify order created in database
   - Check order appears in Directus

3. **Verify in Square Dashboard**:
   - Go to Square Sandbox dashboard
   - Check "Payments" tab
   - See test payment appear

### Switch to Production

1. Update `.env.local` with production credentials
2. Change `SQUARE_ENVIRONMENT=production`
3. Test with real card (small amount first!)
4. Monitor Square Production dashboard

---

## Security Checklist

- ✅ Never expose `SQUARE_ACCESS_TOKEN` to client
- ✅ Use HTTPS in production
- ✅ Validate amounts server-side
- ✅ Use idempotency keys for payments
- ✅ Store payment ID for refund capability
- ✅ Verify payment status before creating order
- ✅ Sanitize user inputs
- ✅ Rate limit payment endpoint

---

## Order Management in Directus

### View Orders

1. Go to admin.thecrackedgrain.com
2. Click "orders" in sidebar
3. See all orders with:
   - Order number
   - Customer name/email
   - Total amount
   - Status
   - Created date

### Order Details

Click any order to see:
- Full shipping address
- All order items with quantities and prices
- Payment status
- Timestamps

### Update Order Status

1. Click order to edit
2. Change "status" field:
   - `pending` - Payment pending
   - `processing` - Payment received, preparing shipment
   - `shipped` - Order shipped to customer
   - `delivered` - Order delivered
   - `cancelled` - Order cancelled
3. Save changes

### Order Filters

- Filter by status (show only "processing" orders)
- Filter by date range
- Search by customer email
- Sort by total amount, date, etc.

---

## Email Notifications (Future Enhancement)

After basic checkout works, add email notifications:

- **Order Confirmation** - Send when order created
- **Shipping Notification** - Send when status → "shipped"
- **Delivery Confirmation** - Send when status → "delivered"

Use services like:
- SendGrid
- Resend
- AWS SES
- Mailgun

---

## Next Steps

1. **Get Square Credentials**
   - Log into Square Developer dashboard
   - Copy Application ID, Access Token, Location ID
   - Add to `.env.local`

2. **Install Dependencies**
   ```bash
   npm install square @square/web-sdk
   ```

3. **Create Checkout Page**
   - Build shipping form
   - Integrate Square Web SDK
   - Add payment submission

4. **Create Payment API**
   - Process Square payments
   - Create orders in database
   - Handle errors gracefully

5. **Test in Sandbox**
   - Use test cards
   - Verify orders created
   - Check Directus integration

6. **Go Live**
   - Switch to production credentials
   - Test with real payment
   - Monitor for issues

---

## Support Resources

- **Square Documentation**: https://developer.squareup.com/docs/web-payments/overview
- **Square Web SDK**: https://developer.squareup.com/docs/web-payments/take-card-payment
- **Square API Reference**: https://developer.squareup.com/reference/square
- **Directus Docs**: https://docs.directus.io

Need help? The Square Developer community and documentation are excellent resources.

Good luck with your checkout integration!
