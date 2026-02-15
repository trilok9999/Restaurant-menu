# Restaurant Menu Display App

A two-surface web application for managing and displaying restaurant menus.

## Tech Stack

- **Frontend**: React + Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Routing**: React Router v6
- **Backend**: Supabase (Auth + PostgreSQL + Storage)
- **Deployment**: Vercel

## Project Structure

```
src/
├── pages/
│   ├── Display.jsx              # Public menu display
│   └── admin/
│       ├── Login.jsx            # Admin authentication
│       ├── ItemLibrary.jsx      # Menu item management
│       └── DailyMenu.jsx        # Daily menu builder
├── components/
│   ├── display/                 # Display app components
│   ├── admin/                   # Admin app components
│   └── shared/                  # Shared components
├── hooks/                       # Custom React hooks
└── lib/
    └── supabase.js             # Supabase client config
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Copy `.env.example` to `.env`
3. Add your Supabase credentials to `.env`:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### 3. Set Up Database

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Run the SQL from `supabase-schema.sql`

This will create:
- `menu_items` table - Master list of all menu items
- `daily_menu` table - Daily menu configurations
- `daily_menu_items` table - Junction table for daily menu items
- Row Level Security policies for public and authenticated access
- Sample data for testing

### 4. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Routes

- `/display` - Public menu display (fullscreen)
- `/admin/login` - Admin login
- `/admin/items` - Menu item library
- `/admin/daily` - Daily menu builder

## Development Phases

- ✅ **Phase 1**: Foundation & Setup (Current)
- ⏳ **Phase 2**: Admin functionality
- ⏳ **Phase 3**: Display functionality
- ⏳ **Phase 4**: Polish & deployment

## Design Language

- **Background**: #FAF7F2 (warm off-white)
- **Text Primary**: #1C1C1C (near black)
- **Text Muted**: #6B6B6B (warm gray)
- **Accent**: #C8A96E (warm gold)
- **Display Font**: Playfair Display
- **Body Font**: Inter

Elegant minimal, typography-first, warm bistro feel.
