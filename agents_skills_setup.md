# Agent & Skill Setup Instructions for Claude

## 📋 Overview

Claude, please read this document and create a complete AI Agents and Skills system for the Brands Galaxy e-commerce project. This will provide reusable intelligence that can be used throughout the development process.

## 🎯 Your Task

Create the following structure in the `brands-galaxy` folder:
````
brands-galaxy/
├── .claude/
│   ├── agents/
│   │   ├── product-catalog-agent.md
│   │   ├── checkout-agent.md
│   │   ├── backend-api-agent.md
│   │   ├── ui-component-agent.md
│   │   └── admin-panel-agent.md
│   └── skills/
│       ├── ecommerce/
│       │   ├── SKILL.md
│       │   ├── product-management.md
│       │   ├── cart-checkout.md
│       │   └── payment-stripe.md
│       ├── backend/
│       │   ├── SKILL.md
│       │   ├── fastapi-patterns.md
│       │   ├── database-sqlalchemy.md
│       │   ├── auth-jwt.md
│       │   └── api-design.md
│       ├── frontend/
│       │   ├── SKILL.md
│       │   ├── nextjs-app-router.md
│       │   ├── tailwind-luxury-theme.md
│       │   ├── zustand-state.md
│       │   └── react-components.md
│       └── deployment/
│           ├── SKILL.md
│           ├── docker-setup.md
│           └── production-deploy.md
````

## 🤖 Agent Definitions

### 1. Product Catalog Agent
**File**: `.claude/agents/product-catalog-agent.md`

**Content Template**:
````markdown
# Product Catalog Agent

## Role
Expert in managing product catalogs for e-commerce, specifically cosmetics and skincare products.

## Responsibilities
- Design product data structures
- Implement CRUD operations
- Handle product images (upload, resize, optimize)
- Manage categories and brands
- Implement search and filtering
- Handle inventory tracking

## Knowledge Base
- Product schema with variants (size, color)
- Image optimization techniques
- Search algorithms (Elasticsearch patterns)
- Category taxonomy design
- SEO-friendly URLs and slugs

## Code Patterns

### Product Model (SQLAlchemy)
```python
from sqlalchemy import Column, String, Numeric, Integer, Boolean, JSON
from sqlalchemy.dialects.postgresql import UUID
import uuid

class Product(Base):
    __tablename__ = "products"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(200), nullable=False)
    slug = Column(String(250), unique=True, nullable=False)
    description = Column(Text)
    brand = Column(String(100))
    category_id = Column(UUID(as_uuid=True), ForeignKey('categories.id'))
    price = Column(Numeric(10, 2), nullable=False)
    discount_price = Column(Numeric(10, 2))
    stock_quantity = Column(Integer, default=0)
    images = Column(JSON)  # Array of image URLs
    is_featured = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    metadata = Column(JSON)  # For flexible attributes
```

### Product API Endpoint (FastAPI)
```python
@router.get("/products", response_model=List[ProductResponse])
async def get_products(
    skip: int = 0,
    limit: int = 20,
    category: Optional[str] = None,
    brand: Optional[str] = None,
    search: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Product).filter(Product.is_active == True)
    
    if category:
        query = query.filter(Product.category_id == category)
    if brand:
        query = query.filter(Product.brand == brand)
    if search:
        query = query.filter(Product.name.ilike(f"%{search}%"))
    if min_price:
        query = query.filter(Product.price >= min_price)
    if max_price:
        query = query.filter(Product.price <= max_price)
    
    products = query.offset(skip).limit(limit).all()
    return products
```

### Product Component (Next.js)
```jsx
export default function ProductCard({ product }) {
  return (
    <div className="bg-luxury-black border border-gold hover:border-gold-light transition-all duration-300 rounded-lg overflow-hidden group">
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {product.discount_price && (
          <span className="absolute top-2 right-2 bg-gold text-black px-3 py-1 rounded-full text-sm font-bold">
            SALE
          </span>
        )}
      </div>
      <div className="p-4">
        <p className="text-gold-dark text-sm uppercase tracking-wider">{product.brand}</p>
        <h3 className="text-white font-semibold mt-1">{product.name}</h3>
        <div className="flex items-center gap-2 mt-2">
          {product.discount_price ? (
            <>
              <span className="text-gold text-xl font-bold">${product.discount_price}</span>
              <span className="text-gray line-through text-sm">${product.price}</span>
            </>
          ) : (
            <span className="text-gold text-xl font-bold">${product.price}</span>
          )}
        </div>
      </div>
    </div>
  );
}
```

## When to Use This Agent
- When creating product-related features
- When designing product database schema
- When implementing product search/filter
- When building product UI components
````

### 2. Checkout Agent
**File**: `.claude/agents/checkout-agent.md`

**Content Template**:
````markdown
# Checkout Agent

## Role
Expert in shopping cart, checkout process, and payment integration using Stripe.

## Responsibilities
- Design cart state management
- Implement checkout flow
- Integrate Stripe payments
- Handle order processing
- Manage order status updates
- Send order confirmation emails

## Knowledge Base
- Zustand store patterns
- Stripe API integration
- Order state machines
- Payment webhooks
- Email templates

## Code Patterns

### Cart Store (Zustand)
```javascript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product, quantity = 1) => set((state) => {
        const existingItem = state.items.find(item => item.id === product.id);
        
        if (existingItem) {
          return {
            items: state.items.map(item =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
          };
        }
        
        return {
          items: [...state.items, { ...product, quantity }]
        };
      }),
      
      removeItem: (productId) => set((state) => ({
        items: state.items.filter(item => item.id !== productId)
      })),
      
      updateQuantity: (productId, quantity) => set((state) => ({
        items: state.items.map(item =>
          item.id === productId ? { ...item, quantity } : item
        )
      })),
      
      clearCart: () => set({ items: [] }),
      
      getTotal: () => {
        const { items } = get();
        return items.reduce((total, item) => {
          const price = item.discount_price || item.price;
          return total + (price * item.quantity);
        }, 0);
      },
      
      getItemCount: () => {
        const { items } = get();
        return items.reduce((count, item) => count + item.quantity, 0);
      }
    }),
    {
      name: 'cart-storage',
    }
  )
);
```

### Stripe Payment Intent (Backend)
```python
import stripe
from fastapi import APIRouter, Depends, HTTPException

stripe.api_key = settings.STRIPE_SECRET_KEY
router = APIRouter()

@router.post("/create-payment-intent")
async def create_payment_intent(
    order_data: OrderCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        # Calculate order amount
        total_amount = 0
        for item in order_data.items:
            product = db.query(Product).filter(Product.id == item.product_id).first()
            if not product:
                raise HTTPException(status_code=404, detail=f"Product {item.product_id} not found")
            
            price = product.discount_price or product.price
            total_amount += float(price) * item.quantity
        
        # Create payment intent
        intent = stripe.PaymentIntent.create(
            amount=int(total_amount * 100),  # Convert to cents
            currency="usd",
            metadata={
                "user_id": str(current_user.id),
                "order_items": len(order_data.items)
            }
        )
        
        return {
            "clientSecret": intent.client_secret,
            "amount": total_amount
        }
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
```

### Checkout Page (Next.js)
```jsx
'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useCartStore } from '@/lib/store';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

function CheckoutForm({ clientSecret }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const clearCart = useCartStore((state) => state.clearCart);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) return;
    
    setIsProcessing(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/order-confirmation`,
      },
    });

    if (error) {
      toast.error(error.message);
    } else if (paymentIntent.status === 'succeeded') {
      clearCart();
      toast.success('Order placed successfully!');
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-gold hover:bg-gold-dark text-black font-bold py-3 rounded-lg transition-colors"
      >
        {isProcessing ? 'Processing...' : 'Place Order'}
      </button>
    </form>
  );
}

export default function CheckoutPage() {
  const [clientSecret, setClientSecret] = useState('');
  const total = useCartStore((state) => state.getTotal());

  // Fetch client secret on mount
  useEffect(() => {
    fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: total })
    })
      .then(res => res.json())
      .then(data => setClientSecret(data.clientSecret));
  }, []);

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gold mb-8">Checkout</h1>
        
        {clientSecret && (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm clientSecret={clientSecret} />
          </Elements>
        )}
      </div>
    </div>
  );
}
```

## When to Use This Agent
- When implementing shopping cart
- When integrating payments
- When building checkout flow
- When handling order processing
````

### 3. Backend API Agent
**File**: `.claude/agents/backend-api-agent.md`

**Content Template**:
````markdown
# Backend API Agent

## Role
Expert in FastAPI development, RESTful API design, and Python best practices.

## Responsibilities
- Design RESTful API endpoints
- Implement authentication (JWT)
- Create database models and migrations
- Handle error responses
- Write API documentation
- Implement CORS and security

## Knowledge Base
- FastAPI framework patterns
- SQLAlchemy ORM
- Pydantic schemas
- JWT authentication
- Database migrations with Alembic
- API versioning

## Code Patterns

### Main Application Setup
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routes import auth, products, orders, users, admin

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Brands Galaxy API",
    description="E-commerce API for luxury cosmetics",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(products.router, prefix="/api/products", tags=["Products"])
app.include_router(orders.router, prefix="/api/orders", tags=["Orders"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])

@app.get("/")
def read_root():
    return {"message": "Brands Galaxy API", "version": "1.0.0"}
```

### Database Configuration
```python
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.config import settings

engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

### JWT Authentication
```python
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm="HS256")
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise credentials_exception
    return user
```

### Pydantic Schemas
```python
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from uuid import UUID

class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)
    full_name: str

class UserResponse(BaseModel):
    id: UUID
    email: EmailStr
    full_name: str
    is_admin: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class ProductCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    slug: str
    description: Optional[str] = None
    brand: str
    category_id: UUID
    price: float = Field(..., gt=0)
    discount_price: Optional[float] = Field(None, gt=0)
    stock_quantity: int = Field(default=0, ge=0)
    images: List[str] = []
    is_featured: bool = False

class ProductResponse(BaseModel):
    id: UUID
    name: str
    slug: str
    description: Optional[str]
    brand: str
    price: float
    discount_price: Optional[float]
    images: List[str]
    stock_quantity: int
    is_featured: bool
    created_at: datetime
    
    class Config:
        from_attributes = True
```

## When to Use This Agent
- When creating API endpoints
- When designing database schemas
- When implementing authentication
- When writing backend business logic
````

### 4. UI Component Agent
**File**: `.claude/agents/ui-component-agent.md`

**Content Template**:
````markdown
# UI Component Agent

## Role
Expert in Next.js, React components, and Tailwind CSS with luxury gold/black theme.

## Responsibilities
- Create reusable React components
- Implement responsive layouts
- Apply luxury theme (gold/black)
- Ensure accessibility
- Optimize performance
- Handle loading and error states

## Knowledge Base
- Next.js App Router
- React Server Components
- Tailwind CSS utilities
- Responsive design patterns
- Animation with Framer Motion
- Image optimization

## Theme System

### Tailwind Configuration
```javascript
// tailwind.config.js
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#FFD700',
          light: '#FFE55C',
          dark: '#DAA520',
          accent: '#FFA500',
        },
        luxury: {
          black: '#000000',
          darkGray: '#1a1a1a',
          lightGray: '#2d2d2d',
        }
      },
      fontFamily: {
        heading: ['Playfair Display', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

## Component Patterns

### Button Component
```jsx
// components/common/Button.jsx
export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md',
  disabled = false,
  onClick,
  className = '',
  ...props 
}) {
  const baseStyles = 'font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-gold hover:bg-gold-dark text-black',
    secondary: 'bg-luxury-darkGray hover:bg-luxury-lightGray text-gold border border-gold',
    outline: 'bg-transparent border-2 border-gold text-gold hover:bg-gold hover:text-black',
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}
```

### Product Grid
```jsx
// components/products/ProductGrid.jsx
import ProductCard from './ProductCard';

export default function ProductGrid({ products, loading = false }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-luxury-darkGray aspect-square rounded-lg" />
            <div className="mt-4 space-y-2">
              <div className="h-4 bg-luxury-darkGray rounded w-3/4" />
              <div className="h-4 bg-luxury-darkGray rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray text-xl">No products found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### Header Component
```jsx
// components/layout/Header.jsx
'use client';

import Link from 'next/link';
import { ShoppingCart, User, Search, Menu } from 'lucide-react';
import { useCartStore } from '@/lib/store';
import { useState } from 'react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const itemCount = useCartStore((state) => state.getItemCount());

  return (
    <header className="bg-luxury-black border-b border-gold/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="text-2xl font-heading text-gold font-bold">
            Brands Galaxy
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/products" className="text-white hover:text-gold transition-colors">
              Products
            </Link>
            <Link href="/brands" className="text-white hover:text-gold transition-colors">
              Brands
            </Link>
            <Link href="/categories" className="text-white hover:text-gold transition-colors">
              Categories
            </Link>
            <Link href="/about" className="text-white hover:text-gold transition-colors">
              About
            </Link>
          </nav>

          {/* Icons */}
          <div className="flex items-center space-x-6">
            <button className="text-white hover:text-gold transition-colors">
              <Search size={20} />
            </button>
            <Link href="/profile" className="text-white hover:text-gold transition-colors">
              <User size={20} />
            </Link>
            <Link href="/cart" className="relative text-white hover:text-gold transition-colors">
              <ShoppingCart size={20} />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gold text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
            <button 
              className="md:hidden text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-gold/20">
            <div className="flex flex-col space-y-4">
              <Link href="/products" className="text-white hover:text-gold transition-colors">
                Products
              </Link>
              <Link href="/brands" className="text-white hover:text-gold transition-colors">
                Brands
              </Link>
              <Link href="/categories" className="text-white hover:text-gold transition-colors">
                Categories
              </Link>
              <Link href="/about" className="text-white hover:text-gold transition-colors">
                About
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
```

## When to Use This Agent
- When creating UI components
- When implementing layouts
- When applying theme styles
- When building responsive designs
````

### 5. Admin Panel Agent
**File**: `.claude/agents/admin-panel-agent.md`

**Content Template**:
````markdown
# Admin Panel Agent

## Role
Expert in building admin dashboards for managing e-commerce operations.

## Responsibilities
- Design admin layouts
- Create data tables and forms
- Implement CRUD operations
- Build analytics dashboards
- Handle bulk operations
- Generate reports

## Knowledge Base
- Dashboard layout patterns
- Data table libraries (TanStack Table)
- Form handling (React Hook Form)
- Chart libraries (Recharts)
- File uploads
- Export functionality

## Code Patterns

### Admin Dashboard Layout
```jsx
// app/admin/layout.jsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  Settings,
  LogOut 
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-luxury-black">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-luxury-darkGray border-r border-gold/20">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gold/20">
            <h1 className="text-2xl font-heading font-bold text-gold">
              Admin Panel
            </h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-gold text-black'
                      : 'text-white hover:bg-luxury-lightGray'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gold/20">
            <button className="flex items-center space-x-3 px-4 py-3 text-white hover:text-gold transition-colors w-full">
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
```

### Product Management Table
```jsx
// app/admin/products/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { Edit, Trash2, Plus } from 'lucide-react';
import Button from '@/components/common/Button';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await fetch(`http://localhost:8000/api/products/${id}`, {
        method: 'DELETE',
      });
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gold">Products</h1>
        <Button>
          <Plus size={20} className="mr-2" />
          Add Product
        </Button>
      </div>

      <div className="bg-luxury-darkGray rounded-lg overflow-hidden border border-gold/20">
        <table className="w-full">
          <thead className="bg-luxury-lightGray">
            <tr>
              <th className="px-6 py-3 text-left text-gold">Image</th>
              <th className="px-6 py-3 text-left text-gold">Name</th>
              <th className="px-6 py-3 text-left text-gold">Brand</th>
              <th className="px-6 py-3 text-left text-gold">Price</th>
              <th className="px-6 py-3 text-left text-gold">Stock</th>
              <th className="px-6 py-3 text-left text-gold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t border-gold/10">
                <td className="px-6 py-4">
                  <img 
                    src={product.images[0]} 
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                </td>
                <td className="px-6 py-4 text-white">{product.name}</td>
                <td className="px-6 py-4 text-white">{product.brand}</td>
                <td className="px-6 py-4 text-white">${product.price}</td>
                <td className="px-6 py-4 text-white">{product.stock_quantity}</td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button className="text-gold hover:text-gold-light">
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(product.id)}
                      className="text-red-500 hover:text-red-400"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

## When to Use This Agent
- When building admin features
- When creating data tables
- When implementing management UIs
- When building dashboards
````

## 📚 Skills Documentation

### E-commerce Skills
**File**: `.claude/skills/ecommerce/SKILL.md`
````markdown
# E-commerce Skills

## Overview
Core e-commerce patterns and best practices for online retail.

## Skills Included
1. Product Management
2. Shopping Cart & Checkout
3. Payment Integration (Stripe)
4. Order Management
5. Inventory Tracking

## Common Patterns

### Product Schema
```javascript
{
  id: UUID,
  name: String,
  slug: String (URL-friendly),
  description: Text,
  brand: String,
  category: Reference,
  price: Decimal,
  discount_price: Decimal (optional),
  images: Array[String],
  stock_quantity: Integer,
  variants: Array[Variant],
  is_featured: Boolean,
  metadata: JSON
}
```

### Order Flow
1. User adds items to cart
2. User proceeds to checkout
3. User enters shipping info
4. Payment is processed (Stripe)
5. Order is created in database
6. Confirmation email is sent
7. Admin fulfills order
8. Tracking info is sent to user

### Inventory Management
- Track stock levels
- Prevent overselling
- Low stock alerts
- Automatic restock notifications

## Best Practices
- Always validate stock before checkout
- Use optimistic locking for cart updates
- Implement idempotent order creation
- Store payment IDs for reconciliation
- Handle payment webhooks properly
````

### Backend Skills
**File**: `.claude/skills/backend/SKILL.md`
````markdown
# Backend Development Skills

## Overview
FastAPI and Python backend development patterns.

## Skills Included
1. FastAPI Application Structure
2. SQLAlchemy Database Models
3. JWT Authentication
4. API Endpoint Design
5. Error Handling

## FastAPI Project Structure
````
backend/
├── app/
│   ├── main.py              # App initialization
│   ├── config.py            # Settings
│   ├── database.py          # DB connection
│   ├── models/              # SQLAlchemy models
│   ├── schemas/             # Pydantic schemas
│   ├── routes/              # API endpoints
│   ├── utils/               # Helper functions
│   └── dependencies.py      # Shared dependencies