/*
  # Inventory Management Schema

  1. New Tables
    - `inventory_transactions`
      - Tracks all inventory changes
      - Records: purchases, sales, adjustments, returns
      - Maintains audit trail with before/after quantities
      - Links to orders and users

    - `inventory_alerts`
      - Monitors low stock and out-of-stock conditions
      - Auto-generated based on thresholds
      - Can be marked as resolved
      - Helps prevent stockouts

  2. Security
    - Enable RLS on both tables
    - Only authenticated users can view/manage inventory
    - Transactions are immutable (no updates/deletes)
    - Alerts can be updated to mark as resolved

  3. Important Features
    - Automatic inventory tracking on orders
    - Smart alert system for low stock
    - Helper function to safely record transactions
    - Prevents negative inventory levels
    - Full audit trail of all stock changes

  4. Usage
    - Call `record_inventory_transaction()` to update stock
    - Automatic triggers handle order-based inventory
    - Low stock alerts auto-create when thresholds reached
*/

-- Inventory transactions table
CREATE TABLE IF NOT EXISTS inventory_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  transaction_type text NOT NULL CHECK (transaction_type IN ('purchase', 'sale', 'adjustment', 'return')),
  quantity_change integer NOT NULL,
  previous_quantity integer NOT NULL,
  new_quantity integer NOT NULL,
  reference_id uuid,
  reference_type text,
  notes text,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Inventory alerts table
CREATE TABLE IF NOT EXISTS inventory_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  alert_type text NOT NULL CHECK (alert_type IN ('low_stock', 'out_of_stock')),
  message text NOT NULL,
  is_resolved boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  resolved_at timestamptz
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_inventory_transactions_product_id ON inventory_transactions(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_transactions_created_at ON inventory_transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inventory_alerts_product_id ON inventory_alerts(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_alerts_is_resolved ON inventory_alerts(is_resolved);

-- Enable RLS
ALTER TABLE inventory_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_alerts ENABLE ROW LEVEL SECURITY;

-- Inventory transactions policies (read-only for users, insertable)
CREATE POLICY "Authenticated users can view inventory transactions"
  ON inventory_transactions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert inventory transactions"
  ON inventory_transactions FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Inventory alerts policies
CREATE POLICY "Authenticated users can view inventory alerts"
  ON inventory_alerts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update inventory alerts"
  ON inventory_alerts FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Function to safely record inventory transaction and update product stock
CREATE OR REPLACE FUNCTION record_inventory_transaction(
  p_product_id uuid,
  p_transaction_type text,
  p_quantity_change integer,
  p_reference_id uuid DEFAULT NULL,
  p_reference_type text DEFAULT NULL,
  p_notes text DEFAULT NULL,
  p_created_by uuid DEFAULT NULL
)
RETURNS uuid AS $$
DECLARE
  v_previous_quantity integer;
  v_new_quantity integer;
  v_transaction_id uuid;
BEGIN
  -- Get current stock quantity
  SELECT stock_quantity INTO v_previous_quantity
  FROM products
  WHERE id = p_product_id;
  
  IF v_previous_quantity IS NULL THEN
    RAISE EXCEPTION 'Product not found';
  END IF;
  
  -- Calculate new quantity
  v_new_quantity := v_previous_quantity + p_quantity_change;
  
  -- Prevent negative inventory
  IF v_new_quantity < 0 THEN
    RAISE EXCEPTION 'Insufficient stock: only % available', v_previous_quantity;
  END IF;
  
  -- Create transaction record
  INSERT INTO inventory_transactions (
    product_id,
    transaction_type,
    quantity_change,
    previous_quantity,
    new_quantity,
    reference_id,
    reference_type,
    notes,
    created_by
  ) VALUES (
    p_product_id,
    p_transaction_type,
    p_quantity_change,
    v_previous_quantity,
    v_new_quantity,
    p_reference_id,
    p_reference_type,
    p_notes,
    p_created_by
  ) RETURNING id INTO v_transaction_id;
  
  -- Update product stock quantity
  UPDATE products
  SET stock_quantity = v_new_quantity,
      in_stock = (v_new_quantity > 0),
      updated_at = now()
  WHERE id = p_product_id;
  
  RETURN v_transaction_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check inventory levels and create alerts
CREATE OR REPLACE FUNCTION check_inventory_alerts()
RETURNS TRIGGER AS $$
DECLARE
  v_low_stock_threshold integer := 10;
BEGIN
  -- Check for out of stock
  IF NEW.stock_quantity = 0 THEN
    -- Create out of stock alert if one doesn't exist
    INSERT INTO inventory_alerts (product_id, alert_type, message)
    VALUES (NEW.id, 'out_of_stock', NEW.name || ' is out of stock')
    ON CONFLICT DO NOTHING;
    
  -- Check for low stock (using configurable threshold)
  ELSIF NEW.stock_quantity <= v_low_stock_threshold AND NEW.stock_quantity > 0 THEN
    -- Create low stock alert if one doesn't exist
    INSERT INTO inventory_alerts (product_id, alert_type, message)
    VALUES (NEW.id, 'low_stock', NEW.name || ' is running low (only ' || NEW.stock_quantity || ' left)')
    ON CONFLICT DO NOTHING;
    
  -- Resolve alerts if stock is replenished above threshold
  ELSIF NEW.stock_quantity > v_low_stock_threshold THEN
    UPDATE inventory_alerts
    SET is_resolved = true, resolved_at = now()
    WHERE product_id = NEW.id AND is_resolved = false;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to check alerts when stock quantity changes
CREATE TRIGGER check_inventory_alerts_trigger
  AFTER UPDATE OF stock_quantity ON products
  FOR EACH ROW
  WHEN (OLD.stock_quantity IS DISTINCT FROM NEW.stock_quantity)
  EXECUTE FUNCTION check_inventory_alerts();

-- Function to automatically record inventory transactions for new order items
CREATE OR REPLACE FUNCTION record_order_inventory_transaction()
RETURNS TRIGGER AS $$
BEGIN
  -- Only process if product_id is not null
  IF NEW.product_id IS NOT NULL THEN
    PERFORM record_inventory_transaction(
      NEW.product_id,
      'sale',
      -NEW.quantity,
      NEW.order_id,
      'order',
      'Order ' || (SELECT order_number FROM orders WHERE id = NEW.order_id),
      (SELECT user_id FROM orders WHERE id = NEW.order_id)
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update inventory when order items are created
CREATE TRIGGER order_item_inventory_trigger
  AFTER INSERT ON order_items
  FOR EACH ROW
  EXECUTE FUNCTION record_order_inventory_transaction();
