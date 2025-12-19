# Directus Products Collection Setup

## Access Directus Admin

**URL:** https://admin.thecrackedgrain.com

Log in with your Directus admin credentials.

---

## Finding the Products Collection

1. Once logged in, look in the **left sidebar**
2. Click on **"products"** under Content
3. You should see all 759 products from your database

---

## Configure Product Fields

### Make Category a Dropdown

1. Click **Settings** (gear icon in bottom left)
2. Click **Data Model**
3. Find and click **"products"** collection
4. Click on the **"category"** field
5. Under **Interface**, select **"Dropdown"**
6. Scroll down to **"Choices"** and add these options:
   ```
   Grains
   Hops
   Yeast
   Equipment
   Chemicals
   Flavorings
   Wine
   Kits
   Books
   Garden
   ```
7. Click **Save**

### Make Subcategory a Dropdown

1. Still in **Data Model > products**
2. Click on the **"subcategory"** field
3. Under **Interface**, select **"Dropdown"**
4. Enable **"Allow Other"** option (for flexibility)
5. Add all subcategory options:

   **Grains Subcategories:**
   ```
   Base Malts
   Specialty Malts
   Malt Extract
   Sugars & Adjuncts
   Other Grains
   ```

   **Hops Subcategories:**
   ```
   Pellet Hops
   ```

   **Yeast Subcategories:**
   ```
   Dry Yeast
   Liquid Yeast
   Other Yeast
   ```

   **Equipment Subcategories:**
   ```
   Fermentation
   Brewing
   Cooling
   Transfer
   Kegging
   Bottling
   Testing
   Other Equipment
   ```

   **Chemicals Subcategories:**
   ```
   Cleaning & Sanitizing
   Water Treatment
   Finings & Clarifiers
   Yeast Nutrients
   Enzymes
   Other Additives
   ```

   **Flavorings Subcategories:**
   ```
   Fruit
   Other Flavorings
   Spices & Herbs
   ```

   **Wine Subcategories:**
   ```
   Corks & Closures
   Wine Making
   ```

   **Kits Subcategories:**
   ```
   Beer Kits
   Equipment Kits
   Other Kits
   ```

6. Click **Save**

### Configure Image URL Field

1. In **Data Model > products**, click **"image_url"** field
2. Options:
   - Keep as **"Input"** if using Directus asset URLs
   - Or change to **"Image"** for direct file uploads
3. Click **Save**

### Other Editable Fields

These fields are already editable as text inputs:
- **name** - Product name
- **description** - Full product description
- **price** - Product price (decimal)
- **stock_quantity** - Inventory count
- **is_active** - Toggle product visibility

---

## Edit Products

Now when you go back to the **products** collection:

1. **View all products** - Browse the 759 products
2. **Click any product** to edit
3. **Category dropdown** - Select from 10 main categories
4. **Subcategory dropdown** - Select appropriate subcategory
5. **Edit other fields** - Name, price, description, stock, etc.

### Bulk Edit

1. **Select multiple products** using checkboxes
2. Click **Batch Edit** button
3. Update category/subcategory for multiple products at once
4. Very useful for categorizing existing products!

---

## Current Database Status

Based on database query:

- **Total Products**: 759
- **Categories**:
  - Grains (89)
  - Hops (27)
  - Yeast (111)
  - Equipment (204)
  - Chemicals (116)
  - Flavorings (81)
  - Wine (83)
  - Kits (33)
  - Books (7)
  - Garden (8)

All products are properly categorized and visible in Directus.

---

## Product Images

Your product images are stored in Directus assets at:
```
admin.thecrackedgrain.com/assets/[asset-id]
```

Images are automatically loaded from Directus when you set the `image_url` field.

---

## Tips

1. **Search products**: Use the search bar at the top to find specific products
2. **Filter by category**: Use column filters to show only products in a specific category
3. **Sort products**: Click column headers to sort by name, price, stock, etc.
4. **Export data**: Use the export feature to download product data as CSV
5. **Import products**: Use the import feature to bulk upload products from CSV

---

## Troubleshooting

**Can't see products collection?**
- Verify you have admin permissions
- Check database connection settings

**Changes not appearing on website?**
- Products are loaded from PostgreSQL database
- Changes should appear immediately after save
- Clear browser cache if needed

**Need to add new fields?**
- Go to Settings > Data Model > products
- Click "+ Create Field" to add custom fields
- Choose field type and configure options

---

## Next Steps

After configuring Directus:

1. **Categorize existing products** using bulk edit
2. **Add product images** for items missing photos
3. **Update descriptions** to be more detailed
4. **Set stock quantities** accurately
5. **Add new products** as inventory expands

Your Directus CMS is now fully configured for product management!
