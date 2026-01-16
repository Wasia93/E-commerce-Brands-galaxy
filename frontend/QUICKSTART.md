# Quick Start Guide - Brands Galaxy Frontend

Get the frontend running in 3 minutes!

## Prerequisites

- Node.js 18+ installed
- Backend API running at http://localhost:8000

## Quick Setup

```bash
# 1. Install dependencies
npm install

# 2. Create environment file
copy .env.local.example .env.local

# 3. Start development server
npm run dev
```

That's it! Open http://localhost:3000

## Configuration

Edit `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
```

## Verify Installation

1. **Homepage**: http://localhost:3000
2. **Products**: http://localhost:3000/products
3. **Cart**: http://localhost:3000/cart
4. **Login**: http://localhost:3000/auth/login

## Test User Flow

1. Register: Go to `/auth/register`
2. Create account with:
   - Email: test@example.com
   - Password: Test1234
   - Name: Test User

3. Login with credentials

4. Browse products at `/products`

5. Add items to cart

6. View cart at `/cart`

## Common Issues

### "Network Error"
- Make sure backend is running: `http://localhost:8000/health`
- Check NEXT_PUBLIC_API_URL in `.env.local`

### "Module not found"
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

### Port 3000 already in use
```bash
# Use different port
npm run dev -- -p 3001
```

## Available Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm start        # Production server
npm run lint     # Run linter
```

## Features Working

✅ Homepage with hero section
✅ Product catalog with filters
✅ Shopping cart
✅ User authentication
✅ Responsive design
✅ State management

## Next Steps

1. ✅ Frontend is running at http://localhost:3000
2. 🛍️ Browse products
3. 🛒 Add items to cart
4. 👤 Create an account
5. 📦 Place test orders

## Need Help?

- Check README.md for detailed documentation
- Review components in `/src/components`
- Check API integration in `/src/lib/api.js`

---

Happy coding! 🚀
