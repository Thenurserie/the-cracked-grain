-- CreateTable
CREATE TABLE IF NOT EXISTS "products" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "subcategory" TEXT,
    "price" DECIMAL(10,2) NOT NULL,
    "unit" TEXT NOT NULL DEFAULT 'each',
    "stock_quantity" INTEGER NOT NULL DEFAULT 0,
    "low_stock_threshold" INTEGER NOT NULL DEFAULT 10,
    "image_url" TEXT,
    "specifications" JSONB NOT NULL DEFAULT '{}',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "orders" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID,
    "order_number" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "customer_email" TEXT NOT NULL,
    "customer_name" TEXT NOT NULL,
    "shipping_address" JSONB NOT NULL,
    "billing_address" JSONB,
    "subtotal" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "tax" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "shipping_cost" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "total" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "notes" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "order_items" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "order_id" UUID NOT NULL,
    "product_id" UUID,
    "product_name" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit_price" DECIMAL(10,2) NOT NULL,
    "subtotal" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "recipes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "style" TEXT,
    "batch_size" DECIMAL(10,2) DEFAULT 5.0,
    "boil_time" INTEGER DEFAULT 60,
    "original_gravity" DECIMAL(5,3),
    "final_gravity" DECIMAL(5,3),
    "abv" DECIMAL(4,2),
    "ibu" DECIMAL(5,1),
    "srm" DECIMAL(5,1),
    "ingredients" JSONB NOT NULL DEFAULT '{"grains":[],"hops":[],"yeast":[],"other":[]}',
    "mash_schedule" JSONB NOT NULL DEFAULT '[]',
    "instructions" TEXT,
    "notes" TEXT,
    "is_public" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "recipes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "inventory_transactions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "product_id" UUID NOT NULL,
    "transaction_type" TEXT NOT NULL,
    "quantity_change" INTEGER NOT NULL,
    "previous_quantity" INTEGER NOT NULL,
    "new_quantity" INTEGER NOT NULL,
    "reference_id" UUID,
    "reference_type" TEXT,
    "notes" TEXT,
    "created_by" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inventory_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "inventory_alerts" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "product_id" UUID NOT NULL,
    "alert_type" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "is_resolved" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolved_at" TIMESTAMPTZ(6),

    CONSTRAINT "inventory_alerts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "products_slug_key" ON "products"("slug");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "products_category_idx" ON "products"("category");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "products_slug_idx" ON "products"("slug");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "products_is_active_idx" ON "products"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "orders_order_number_key" ON "orders"("order_number");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "orders_user_id_idx" ON "orders"("user_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "orders_order_number_idx" ON "orders"("order_number");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "orders_status_idx" ON "orders"("status");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "orders_customer_email_idx" ON "orders"("customer_email");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "order_items_order_id_idx" ON "order_items"("order_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "order_items_product_id_idx" ON "order_items"("product_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "recipes_user_id_idx" ON "recipes"("user_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "recipes_style_idx" ON "recipes"("style");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "recipes_is_public_idx" ON "recipes"("is_public");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "inventory_transactions_product_id_idx" ON "inventory_transactions"("product_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "inventory_transactions_created_at_idx" ON "inventory_transactions"("created_at" DESC);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "inventory_alerts_product_id_idx" ON "inventory_alerts"("product_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "inventory_alerts_is_resolved_idx" ON "inventory_alerts"("is_resolved");

-- AddForeignKey
ALTER TABLE "order_items" DROP CONSTRAINT IF EXISTS "order_items_order_id_fkey";
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" DROP CONSTRAINT IF EXISTS "order_items_product_id_fkey";
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_transactions" DROP CONSTRAINT IF EXISTS "inventory_transactions_product_id_fkey";
ALTER TABLE "inventory_transactions" ADD CONSTRAINT "inventory_transactions_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_alerts" DROP CONSTRAINT IF EXISTS "inventory_alerts_product_id_fkey";
ALTER TABLE "inventory_alerts" ADD CONSTRAINT "inventory_alerts_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Create Prisma migrations table
CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
    "id" VARCHAR(36) NOT NULL,
    "checksum" VARCHAR(64) NOT NULL,
    "finished_at" TIMESTAMPTZ(6),
    "migration_name" VARCHAR(255) NOT NULL,
    "logs" TEXT,
    "rolled_back_at" TIMESTAMPTZ(6),
    "started_at" TIMESTAMPTZ(6) NOT NULL DEFAULT now(),
    "applied_steps_count" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "_prisma_migrations_pkey" PRIMARY KEY ("id")
);

-- Record this migration
INSERT INTO "_prisma_migrations" ("id", "checksum", "migration_name", "finished_at", "applied_steps_count")
VALUES (
    gen_random_uuid()::text,
    'manual_migration_checksum',
    '0001_init',
    now(),
    1
) ON CONFLICT DO NOTHING;
