# Testing Guide

## Prerequisites

### 1. Supabase Setup

You need to set up the following in your Supabase project:

#### Database Tables

All tables should already be created from Phase 1. Verify these exist:
- `menu_items`
- `daily_menus`
- `daily_menu_items`

#### Storage Bucket

Create a storage bucket for menu images:
1. Go to Storage in Supabase Dashboard
2. Create a new bucket named `menu-images`
3. Set it to **Public** (for image URLs to work)
4. Configure upload restrictions (optional): Max file size 5MB, allowed types: image/*

#### Authentication

Enable email/password authentication:
1. Go to Authentication → Providers
2. Enable "Email" provider
3. Disable email confirmation (for testing) or configure SMTP

#### Create Test User

In Supabase Dashboard → Authentication → Users:
- Click "Add User"
- Email: `admin@test.com`
- Password: `test123456`
- Auto-confirm user: Yes

### 2. Environment Variables

Ensure your `.env` file has:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Manual Testing Steps

### 1. Start the Application

```bash
npm install
npm run dev
```

Open http://localhost:5173

### 2. Test Display Screen (Public)

- Navigate to `/display`
- Should show "No menu available" if no menu is published
- Leave this tab open to verify live updates later

### 3. Test Admin Login

- Navigate to `/admin/login`
- Try logging in with wrong credentials → Should show error
- Login with: `admin@test.com` / `test123456`
- Should redirect to `/admin/items`

### 4. Test Item Library

**Create Items:**
1. Click "+ Add Item"
2. Fill in:
   - Name: "Caesar Salad"
   - Category: Appetizer
   - Base Price: 12.99
   - Description: "Fresh romaine lettuce with Caesar dressing"
   - Upload an image (use any food image)
   - Select dietary tags: vegetarian
   - Check "Available in item library"
3. Click "Create Item"
4. Item should appear in the grid

**Create more items** for different categories:
- Main: "Grilled Salmon" - $24.99
- Side: "French Fries" - $6.99
- Dessert: "Chocolate Cake" - $8.99
- Beverage: "Fresh Lemonade" - $4.99

**Edit Item:**
1. Click "Edit" on any item
2. Change the price or description
3. Click "Update Item"
4. Changes should be reflected

**Filter Items:**
1. Click category filters (All, Appetizer, Main, etc.)
2. Only items from that category should show

**Delete Item:**
1. Click "Delete" on an item
2. Confirm the deletion
3. Item should be removed

### 5. Test Daily Menu Builder

Click "Daily Menu" in header

**Build a Menu:**
1. Date should default to today
2. From left panel (Available Items):
   - Search for items using search box
   - Filter by category
   - Click "Add" on several items
3. In right panel (Daily Menu):
   - Items should appear
   - Drag items up/down to reorder
   - Change daily prices
   - Check "Chef's Special" on one item
   - Add special description: "Caught fresh this morning!"
4. Click "Save Menu"
5. Should see success message

**Publish Menu:**
1. Click "Publish Menu" button
2. Status should change from "Draft" to "Published"
3. Now go to `/display` tab
4. Menu should now be visible with all items!

**Test Different Dates:**
1. Change the date picker to tomorrow
2. Add different items
3. Save and publish
4. Each date should have its own menu

**Unpublish Menu:**
1. Click "Unpublish Menu"
2. Status changes to "Draft"
3. Display screen should show "No menu available"

### 6. Test Protected Routes

1. Sign out from admin panel
2. Try to access `/admin/items` directly
3. Should redirect to `/admin/login`
4. Same for `/admin/daily`

### 7. Test Photo Upload

1. Create/edit an item
2. Upload different image formats (PNG, JPG)
3. Image preview should show
4. After saving, image should appear on item card
5. Check Supabase Storage → menu-images bucket
6. Files should be uploaded there

## Expected Behaviors

✅ **Authentication**
- Login with valid credentials works
- Invalid credentials show error
- Protected routes redirect to login
- Sign out clears session

✅ **Item Library**
- CRUD operations work
- Filtering by category works
- Images upload to Supabase Storage
- Dietary tags are saved and displayed

✅ **Daily Menu**
- Items can be added from library
- Drag-to-reorder works
- Daily prices can be customized
- Chef's specials can be marked
- Different dates have separate menus
- Publish/unpublish toggles correctly

✅ **Display Screen**
- Shows published menu for current date
- Updates when menu is published/unpublished
- Shows items in correct order
- Displays chef's specials prominently
- Shows dietary tags

## Troubleshooting

**Images not showing:**
- Verify storage bucket is public
- Check browser console for CORS errors
- Verify Supabase URL and keys are correct

**Authentication not working:**
- Check email provider is enabled in Supabase
- Verify user exists in Authentication → Users
- Clear browser cache/localStorage

**Menu not appearing on display:**
- Verify menu is published (not draft)
- Check date matches today's date
- Refresh the page
- Check browser console for errors
