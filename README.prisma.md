# Prisma Setup Instructions

## Database Configuration

1. **Update DATABASE_URL in `.env`**:
   Replace the placeholder with your DigitalOcean PostgreSQL connection string:
   ```
   DATABASE_URL="postgresql://username:password@your-host.db.ondigitalocean.com:25060/your-database?sslmode=require"
   ```

2. **Run Migrations**:
   Once you've updated the DATABASE_URL, run:
   ```bash
   npx prisma migrate dev --name initial_schema
   ```

   This will:
   - Create the database tables
   - Generate the Prisma Client
   - Apply all schema changes to your database

3. **For Production Deployments**:
   ```bash
   npx prisma migrate deploy
   ```

## Database Schema

The schema includes:

### Products
- Grains, hops, yeast, and equipment
- Stock quantity tracking
- Category organization
- Pricing and specifications

### Orders
- Customer orders with line items
- Order status tracking (pending, processing, shipped, delivered, cancelled)
- Support for both authenticated and guest checkout
- Auto-generated unique order numbers

### Recipes
- User-saved brewing recipes
- Public and private recipes
- Detailed brewing parameters (OG, FG, ABV, IBU, SRM)
- Ingredients and mash schedules

### Inventory Management
- Transaction history (purchases, sales, adjustments, returns)
- Automatic stock updates on orders
- Low stock and out-of-stock alerts
- Full audit trail

## Using Prisma in Your Code

### Import the client:
```typescript
import { prisma } from '@/lib/db';
```

### Helper Functions:

#### Products
```typescript
import { getProducts, getProduct, createProduct } from '@/lib/products';

// Get all active products
const products = await getProducts({ isActive: true });

// Get product by slug or ID
const product = await getProduct('pale-ale-malt');

// Create new product
const newProduct = await createProduct({
  name: 'Pale Ale Malt',
  slug: 'pale-ale-malt',
  category: 'grains',
  price: 2.50,
  stockQuantity: 100
});
```

#### Orders
```typescript
import { createOrder, getOrder, getUserOrders } from '@/lib/orders';

// Create new order (automatically handles inventory)
const order = await createOrder({
  userId: 'user-uuid',
  customerEmail: 'customer@example.com',
  customerName: 'John Doe',
  shippingAddress: { /* address object */ },
  items: [
    { productId: 'product-uuid', quantity: 2 }
  ]
});

// Get user's orders
const orders = await getUserOrders('user-uuid');
```

#### Inventory
```typescript
import { recordInventoryTransaction, getActiveAlerts } from '@/lib/inventory';

// Record inventory change
await recordInventoryTransaction({
  productId: 'product-uuid',
  transactionType: 'purchase',
  quantityChange: 50,
  notes: 'Restocking from supplier'
});

// Get active low-stock alerts
const alerts = await getActiveAlerts();
```

#### Recipes
```typescript
import { createRecipe, getUserRecipes, getPublicRecipes } from '@/lib/recipes';

// Create new recipe
const recipe = await createRecipe({
  userId: 'user-uuid',
  name: 'Classic IPA',
  style: 'American IPA',
  batchSize: 5.0,
  ingredients: { /* ingredients object */ }
});

// Get user's recipes
const myRecipes = await getUserRecipes('user-uuid');

// Get public recipes
const publicRecipes = await getPublicRecipes(20);
```

## Server Components and API Routes

Prisma should only be used in:
- Server Components (by default in Next.js 13+)
- API Routes (`app/api/**/route.ts`)
- Server Actions

**Never import Prisma in Client Components** - this will cause build errors.

## Environment Variables

Required in `.env`:
```
DATABASE_URL="postgresql://..." # Your PostgreSQL connection string
```

## Troubleshooting

### "Can't reach database server"
- Verify DATABASE_URL is correct
- Check that your DigitalOcean database allows connections from your IP
- Ensure SSL mode is configured correctly

### "Table already exists"
- If tables already exist, use: `npx prisma db pull` to introspect
- Then: `npx prisma generate` to generate the client

### Type errors after schema changes
- Run: `npx prisma generate` to regenerate types
- Restart your TypeScript server in VS Code

## Additional Commands

```bash
# View and manage migrations
npx prisma migrate status

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Open Prisma Studio (database GUI)
npx prisma studio

# Format schema file
npx prisma format
```
