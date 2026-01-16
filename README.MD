# Brands Galaxy - Luxury Cosmetics & Skincare E-commerce

A premium e-commerce platform for branded cosmetics and skincare products with a luxurious gold and black theme.

## 🎨 Design Theme
- **Primary Colors**: Gold (#FFD700, #FFA500) and Black (#000000, #1a1a1a)
- **Style**: Luxury, Premium, Elegant
- **Target**: High-end cosmetics and skincare brands

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **UI Library**: React 18+
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

### Backend
- **Framework**: FastAPI (Python)
- **Database**: PostgreSQL
- **ORM**: SQLAlchemy
- **Authentication**: JWT
- **Payment**: Stripe
- **File Upload**: Python Multipart

### Development Tools
- **IDE**: VS Code
- **Specifications**: SpecKit Plus
- **AI Assistant**: Claude
- **Version Control**: Git

## 📁 Project Structure
```
brands-galaxy/
├── frontend/                 # Next.js Application
│   ├── src/
│   │   ├── app/             # App Router Pages
│   │   │   ├── page.js      # Homepage
│   │   │   ├── layout.js    # Root Layout
│   │   │   ├── products/    # Product Listing & Details
│   │   │   ├── cart/        # Shopping Cart
│   │   │   ├── checkout/    # Checkout Process
│   │   │   ├── auth/        # Login/Register
│   │   │   ├── profile/     # User Profile
│   │   │   └── admin/       # Admin Dashboard
│   │   ├── components/      # Reusable Components
│   │   │   ├── layout/
│   │   │   │   ├── Header.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   └── Sidebar.jsx
│   │   │   ├── products/
│   │   │   │   ├── ProductCard.jsx
│   │   │   │   ├── ProductGrid.jsx
│   │   │   │   └── ProductFilter.jsx
│   │   │   ├── cart/
│   │   │   │   ├── CartItem.jsx
│   │   │   │   └── CartSummary.jsx
│   │   │   └── common/
│   │   │       ├── Button.jsx
│   │   │       ├── Input.jsx
│   │   │       └── Modal.jsx
│   │   ├── lib/             # Utilities & Configs
│   │   │   ├── api.js       # API Client
│   │   │   └── store.js     # Zustand Store
│   │   └── styles/
│   │       └── globals.css  # Global Styles
│   ├── public/              # Static Assets
│   │   ├── images/
│   │   └── icons/
│   ├── package.json
│   └── tailwind.config.js
│
├── backend/                 # FastAPI Application
│   ├── app/
│   │   ├── main.py         # FastAPI Entry Point
│   │   ├── database.py     # Database Connection
│   │   ├── models/         # SQLAlchemy Models
│   │   │   ├── user.py
│   │   │   ├── product.py
│   │   │   ├── order.py
│   │   │   └── category.py
│   │   ├── routes/         # API Endpoints
│   │   │   ├── auth.py
│   │   │   ├── products.py
│   │   │   ├── orders.py
│   │   │   ├── users.py
│   │   │   └── admin.py
│   │   ├── schemas/        # Pydantic Schemas
│   │   │   ├── user.py
│   │   │   ├── product.py
│   │   │   └── order.py
│   │   ├── utils/          # Helper Functions
│   │   │   ├── auth.py     # JWT & Password Hashing
│   │   │   ├── stripe.py   # Payment Processing
│   │   │   └── email.py    # Email Notifications
│   │   └── config.py       # Configuration
│   ├── venv/               # Virtual Environment
│   ├── requirements.txt
│   └── .env
│
├── README.md               # This File
└── .gitignore
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- Python 3.9+
- PostgreSQL 14+
- Git

### Step 1: Clone & Navigate
```bash
# Already in VS Code terminal
pwd  # Confirm you're in brands-galaxy folder
```

### Step 2: Frontend Setup
```bash
# Create Next.js app
npx create-next-app@latest frontend

# Choose these options:
# Would you like to use TypeScript? No
# Would you like to use ESLint? Yes
# Would you like to use Tailwind CSS? Yes
# Would you like to use `src/` directory? Yes
# Would you like to use App Router? Yes
# Would you like to customize the default import alias? No

# Navigate and install dependencies
cd frontend
npm install axios zustand react-hot-toast @stripe/stripe-js lucide-react
```

### Step 3: Backend Setup
```bash
# Go back to root
cd ..

# Create backend folder
mkdir backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install Python packages
pip install fastapi uvicorn sqlalchemy psycopg2-binary python-dotenv pydantic pydantic-settings stripe python-multipart pillow python-jose passlib bcrypt

# Save requirements
pip freeze > requirements.txt
```

### Step 4: Database Setup
```bash
# Create PostgreSQL database
psql -U postgres
CREATE DATABASE brands_galaxy;
\q
```

### Step 5: Environment Variables

Create `backend/.env`:
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/brands_galaxy
SECRET_KEY=your-secret-key-here-change-this
STRIPE_SECRET_KEY=sk_test_your_stripe_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

Create `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
```

## 🎯 Features to Implement

### Phase 1: Core Features
- [ ] User Authentication (Register, Login, JWT)
- [ ] Product Catalog (List, Search, Filter)
- [ ] Product Details Page
- [ ] Shopping Cart (Add, Remove, Update Quantity)
- [ ] Checkout Process
- [ ] Stripe Payment Integration
- [ ] Order Management

### Phase 2: Advanced Features
- [ ] User Profile & Order History
- [ ] Product Reviews & Ratings
- [ ] Wishlist
- [ ] Admin Dashboard
- [ ] Inventory Management
- [ ] Email Notifications
- [ ] Image Upload for Products

### Phase 3: Enhancements
- [ ] Advanced Search & Filters
- [ ] Product Recommendations
- [ ] Discount Codes & Promotions
- [ ] Multi-image Gallery
- [ ] Size/Variant Selection
- [ ] Social Sharing
- [ ] Newsletter Subscription

## 🎨 Design System

### Color Palette
```css
/* Gold Variants */
--gold-primary: #FFD700;
--gold-light: #FFE55C;
--gold-dark: #DAA520;
--gold-accent: #FFA500;

/* Black Variants */
--black-primary: #000000;
--black-light: #1a1a1a;
--black-lighter: #2d2d2d;

/* Neutrals */
--white: #FFFFFF;
--gray-light: #F5F5F5;
--gray: #CCCCCC;
```

### Typography
- **Headings**: Playfair Display / Cormorant Garamond
- **Body**: Inter / Roboto
- **Accent**: Montserrat

## 🏃 Running the Application

### Development Mode

**Terminal 1 - Frontend:**
```bash
cd frontend
npm run dev
```
Access at: http://localhost:3000

**Terminal 2 - Backend:**
```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
uvicorn app.main:app --reload
```
Access at: http://localhost:8000
API Docs: http://localhost:8000/docs

## 📦 Database Schema

### Users Table
- id (UUID, Primary Key)
- email (String, Unique)
- password_hash (String)
- full_name (String)
- phone (String, Optional)
- address (JSON)
- is_admin (Boolean, Default: False)
- created_at (DateTime)
- updated_at (DateTime)

### Products Table
- id (UUID, Primary Key)
- name (String)
- slug (String, Unique)
- description (Text)
- price (Decimal)
- discount_price (Decimal, Optional)
- brand (String)
- category_id (Foreign Key)
- images (JSON Array)
- stock_quantity (Integer)
- is_featured (Boolean)
- created_at (DateTime)
- updated_at (DateTime)

### Categories Table
- id (UUID, Primary Key)
- name (String)
- slug (String, Unique)
- image (String, Optional)

### Orders Table
- id (UUID, Primary Key)
- user_id (Foreign Key)
- order_number (String, Unique)
- total_amount (Decimal)
- status (Enum: pending, paid, shipped, delivered, cancelled)
- payment_method (String)
- stripe_payment_id (String, Optional)
- shipping_address (JSON)
- created_at (DateTime)
- updated_at (DateTime)

### Order Items Table
- id (UUID, Primary Key)
- order_id (Foreign Key)
- product_id (Foreign Key)
- quantity (Integer)
- price (Decimal)

## 🔐 API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user

### Products
- GET `/api/products` - Get all products (with filters)
- GET `/api/products/{id}` - Get single product
- POST `/api/products` - Create product (Admin)
- PUT `/api/products/{id}` - Update product (Admin)
- DELETE `/api/products/{id}` - Delete product (Admin)

### Cart & Orders
- POST `/api/orders` - Create order
- GET `/api/orders` - Get user orders
- GET `/api/orders/{id}` - Get order details
- POST `/api/payments/create-intent` - Create Stripe payment intent

### Admin
- GET `/api/admin/dashboard` - Dashboard stats
- GET `/api/admin/orders` - All orders
- PUT `/api/admin/orders/{id}/status` - Update order status

## 🎯 SpecKit Plus Specifications

### User Stories to Define:
1. **As a customer**, I want to browse products by brand and category
2. **As a customer**, I want to add products to cart and checkout securely
3. **As a customer**, I want to track my order status
4. **As an admin**, I want to manage products and inventory
5. **As an admin**, I want to view and process orders

### Claude Coding Tasks:
1. Generate component boilerplate from specs
2. Create API endpoint handlers
3. Implement authentication logic
4. Write database migration scripts
5. Build responsive UI components with Tailwind

## 📝 Development Workflow

1. **Write specs in SpecKit Plus** - Define features, user flows, data models
2. **Use Claude for coding** - Generate code from specifications
3. **Test in VS Code** - Run dev servers and test functionality
4. **Iterate** - Refine specs and regenerate code as needed

## 🤝 Contributing

This is a commercial project. All contributions should follow the project guidelines.

## 📄 License

Proprietary - All rights reserved

## 🆘 Support

For issues and questions, contact the development team.

---

**Ready to build Brands Galaxy! 🌟**

Start by setting up the environment, then use Claude to generate code from your SpecKit specifications.