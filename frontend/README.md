# Brands Galaxy Frontend

Next.js 14+ frontend for the Brands Galaxy luxury e-commerce platform.

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **UI Library**: React 18+
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Payments**: Stripe.js

## Design Theme

- **Colors**: Luxury Gold (#FFD700) and Black (#000000)
- **Typography**: Playfair Display (headings), Inter (body)
- **Style**: Premium, elegant, luxury aesthetic

## Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.jsx          # Root layout
│   │   ├── page.jsx            # Homepage
│   │   ├── globals.css         # Global styles
│   │   ├── products/           # Products pages
│   │   ├── cart/               # Shopping cart
│   │   └── auth/               # Authentication pages
│   │
│   ├── components/             # Reusable components
│   │   ├── common/             # Button, Input, Modal
│   │   ├── layout/             # Header, Footer
│   │   ├── products/           # ProductCard, ProductGrid
│   │   └── cart/               # Cart components
│   │
│   └── lib/                    # Utilities
│       ├── api.js              # API client
│       ├── store.js            # Zustand stores
│       └── utils.js            # Helper functions
│
├── public/                     # Static assets
├── .env.local.example          # Example environment variables
├── tailwind.config.js          # Tailwind configuration
├── next.config.js              # Next.js configuration
└── package.json
```

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- Backend API running at http://localhost:8000

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Copy `.env.local.example` to `.env.local`:

```bash
copy .env.local.example .env.local
```

Update `.env.local` with your configuration:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
```

### 3. Run Development Server

```bash
npm run dev
```

The app will be available at http://localhost:3000

### 4. Build for Production

```bash
npm run build
npm start
```

## Features

### ✅ Implemented

- **Homepage**: Hero section with CTA
- **Product Catalog**: Browse products with search and filters
- **Shopping Cart**: Add/remove items, update quantities
- **Authentication**: Login and register pages
- **Responsive Design**: Mobile-first approach
- **State Management**: Cart and auth with Zustand
- **API Integration**: Connected to FastAPI backend

### 🔄 Planned

- Checkout with Stripe
- User profile and order history
- Product details page
- Admin dashboard
- Wishlist functionality
- Product reviews

## Available Pages

- `/` - Homepage
- `/products` - Product catalog
- `/cart` - Shopping cart
- `/auth/login` - Login page
- `/auth/register` - Registration page

## Components

### Common Components

- **Button**: Versatile button with variants (primary, secondary, outline, danger)
- **Input**: Text input with label, icon, and error handling
- **Modal**: Reusable modal dialog
- **Loading**: Loading spinner component

### Layout Components

- **Header**: Navigation, search, cart icon
- **Footer**: Links and social media

### Product Components

- **ProductCard**: Product display card with add to cart
- **ProductGrid**: Responsive grid of products

## State Management

### Cart Store (Zustand)

```javascript
const items = useCartStore((state) => state.items);
const addItem = useCartStore((state) => state.addItem);
const removeItem = useCartStore((state) => state.removeItem);
const updateQuantity = useCartStore((state) => state.updateQuantity);
const getTotal = useCartStore((state) => state.getTotal());
```

### Auth Store (Zustand)

```javascript
const user = useAuthStore((state) => state.user);
const setAuth = useAuthStore((state) => state.setAuth);
const logout = useAuthStore((state) => state.logout);
```

## API Integration

The app connects to the FastAPI backend for:

- Product data
- User authentication
- Order processing
- Payment processing

API client is configured with interceptors for:
- Adding auth tokens to requests
- Handling 401 errors (redirect to login)

## Styling

### Tailwind Classes

Custom classes defined in `globals.css`:

- `.btn-primary` - Gold button
- `.btn-secondary` - Outlined button
- `.btn-outline` - Transparent with border
- `.input-luxury` - Styled input field
- `.card-luxury` - Card container

### Color Palette

```css
--gold-primary: #FFD700
--gold-light: #FFE55C
--gold-dark: #DAA520
--black-primary: #000000
--black-darkGray: #1a1a1a
--black-lightGray: #2d2d2d
```

## Development Tips

1. **Hot Reload**: Changes are reflected immediately
2. **Component Organization**: Keep components small and reusable
3. **API Calls**: Use the API client in `/lib/api.js`
4. **State**: Use Zustand stores for global state
5. **Styling**: Use Tailwind utility classes

## Common Tasks

### Add a New Page

1. Create folder in `src/app/`
2. Add `page.jsx` file
3. Export default component

### Add a New Component

1. Create file in appropriate `src/components/` folder
2. Use `'use client'` directive if it needs interactivity
3. Import and use in pages

### Connect to API

```javascript
import { productsAPI } from '@/lib/api';

const response = await productsAPI.getAll();
const products = response.data;
```

## Troubleshooting

### "Module not found"
- Run `npm install`
- Check import paths use `@/` alias

### API Connection Error
- Ensure backend is running at http://localhost:8000
- Check NEXT_PUBLIC_API_URL in `.env.local`

### Styles Not Loading
- Restart dev server: `npm run dev`
- Clear `.next` folder: `rm -rf .next`

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production
vercel --prod
```

### Manual Build

```bash
npm run build
npm start
```

## Environment Variables for Production

```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api/v1
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_key
```

## Support

For issues and questions, refer to the project documentation or check the `.claude/` folder for specifications.

---

**Built with Next.js for Brands Galaxy E-commerce Platform**
