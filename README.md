# Peboli - Next-Generation Ecommerce Marketplace

**Core Brand Promise: "Best deals. Zero hassle."**

A modern, full-featured ecommerce marketplace platform built with Next.js 14+, TypeScript, and Tailwind CSS.

## 🚀 Features

### ✅ Implemented

- **Homepage**
  - Hero section with CTA
  - Today's Splash Deals section with splash sale timers
  - Category grid with 8 main categories
  - Trust signals footer

- **Product Pages**
  - Image gallery with thumbnail navigation
  - Detailed product information
  - Pricing with savings badges
  - Splash sale countdown timers
  - Vendor information
  - Product specifications
  - Shipping & returns information

- **Category Pages**
  - Product grid with filtering
  - Price range slider
  - Brand filters
  - Sort options (price, newest, bestselling, etc.)
  - Active filter badges
  - Responsive mobile/desktop layouts

- **Design System**
  - Peboli brand colors (Splash Blue, Coral Accent, Success Green)
  - Inter font family (400-900 weights)
  - Consistent component styling
  - Micro-interactions with Framer Motion
  - Mobile-first responsive design

- **Navigation**
  - Sticky header with search bar
  - Category navigation
  - Shopping cart icon with badge
  - User account access

### 🚧 In Progress / Planned

- Checkout flow (guest checkout, delivery, payment)
- Vendor dashboard (product upload, orders, analytics)
- Admin dashboard (user management, vendor approvals)
- Authentication system (buyers and vendors)
- Database schema and API routes
- Payment gateway integration
- Search functionality with Algolia
- Reviews and ratings system
- Splash sales engine
- Referral system

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Data Fetching**: React Query (TanStack Query)
- **Icons**: Lucide React

## 📁 Project Structure

```
peboli/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Homepage
│   ├── products/[slug]/   # Product detail pages
│   ├── categories/[slug]/ # Category pages
│   └── layout.tsx         # Root layout
├── components/
│   ├── layout/            # Header, Footer
│   ├── home/              # Homepage sections
│   ├── product/           # Product components
│   ├── category/          # Category components
│   ├── deals/             # Splash sale components
│   └── ui/                # shadcn/ui components
├── lib/
│   ├── constants/         # App constants
│   └── utils/             # Utility functions
└── types/                 # TypeScript types
```

## 🎨 Brand Colors

- **Splash Blue**: `#0B1220` - Primary color, CTAs, links
- **Coral Accent**: `#FF6B4A` - Deals, urgency, highlights
- **Success Green**: `#00C48C` - Confirmations, savings badges
- **Pure White**: `#FFFFFF` - Backgrounds
- **Soft Gray**: `#F7F8FA` - Cards, sections
- **Medium Gray**: `#8B95A5` - Secondary text
- **Deep Charcoal**: `#1A1D29` - Headlines, primary text

## 🚀 Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Run development server**
```bash
npm run dev
   ```

3. **Open browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📝 Development Notes

- All components are built with TypeScript for type safety
- Responsive design follows mobile-first approach
- Components use shadcn/ui for consistent styling
- Framer Motion provides smooth animations
- Mock data is currently used; will be replaced with API calls

## 🔜 Next Steps

1. Set up PostgreSQL database schema
2. Create API routes for products, orders, users
3. Implement authentication (NextAuth.js or similar)
4. Integrate payment gateway (PayGate/Paystack)
5. Set up Algolia for search
6. Build vendor dashboard
7. Build admin dashboard
8. Implement splash sales engine
9. Add reviews and ratings system
10. Set up deployment (Vercel + Railway/AWS)

## 📄 License

Private project - All rights reserved
