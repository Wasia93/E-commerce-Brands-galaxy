# Brands Galaxy Backend API

FastAPI backend for the Brands Galaxy luxury e-commerce platform.

## Tech Stack

- **Framework**: FastAPI 0.109+
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Authentication**: JWT (python-jose)
- **Password Hashing**: bcrypt (passlib)
- **Validation**: Pydantic v2
- **Payments**: Stripe API
- **Server**: Uvicorn

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application
│   ├── config.py            # Settings and configuration
│   ├── database.py          # Database connection
│   ├── dependencies.py      # Shared dependencies (auth)
│   │
│   ├── models/              # SQLAlchemy models
│   │   ├── user.py
│   │   ├── product.py
│   │   ├── order.py
│   │   └── category.py
│   │
│   ├── schemas/             # Pydantic schemas
│   │   ├── user.py
│   │   ├── product.py
│   │   └── order.py
│   │
│   ├── routes/              # API endpoints
│   │   ├── auth.py
│   │   ├── products.py
│   │   ├── orders.py
│   │   └── admin.py
│   │
│   └── utils/               # Utilities
│       └── auth.py          # JWT and password hashing
│
├── tests/                   # Test files
├── alembic/                 # Database migrations
├── .env.example             # Example environment variables
├── .gitignore
├── requirements.txt
└── README.md
```

## Setup Instructions

### 1. Prerequisites

- Python 3.9 or higher
- PostgreSQL 14+
- pip

### 2. Create Virtual Environment

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Mac/Linux
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Database Setup

```bash
# Create PostgreSQL database
psql -U postgres
CREATE DATABASE brands_galaxy;
\q
```

### 5. Environment Variables

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

Update `.env` with your configuration:

```env
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/brands_galaxy
SECRET_KEY=your-secret-key-min-32-characters
STRIPE_SECRET_KEY=sk_test_your_stripe_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
```

### 6. Initialize Database

The database tables will be created automatically when you first run the application.

```bash
uvicorn app.main:app --reload
```

### 7. Run the Server

```bash
# Development mode with auto-reload
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Production mode
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

The API will be available at: `http://localhost:8000`

## API Documentation

Once the server is running, you can access:

- **Swagger UI**: http://localhost:8000/api/docs
- **ReDoc**: http://localhost:8000/api/redoc
- **Health Check**: http://localhost:8000/health

## API Endpoints

### Authentication

- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/me` - Get current user

### Products

- `GET /api/v1/products/` - List products (with filters)
- `GET /api/v1/products/{id}` - Get single product
- `POST /api/v1/products/` - Create product (Admin)
- `PUT /api/v1/products/{id}` - Update product (Admin)
- `DELETE /api/v1/products/{id}` - Delete product (Admin)

### Categories

- `GET /api/v1/products/categories/` - List categories
- `POST /api/v1/products/categories/` - Create category (Admin)

### Orders

- `POST /api/v1/orders/create-payment-intent` - Create payment intent
- `POST /api/v1/orders/` - Create order
- `GET /api/v1/orders/` - Get user orders
- `GET /api/v1/orders/{id}` - Get order details

### Admin

- `GET /api/v1/admin/dashboard` - Dashboard statistics
- `GET /api/v1/admin/orders` - List all orders
- `PUT /api/v1/admin/orders/{id}/status` - Update order status
- `GET /api/v1/admin/users` - List all users
- `GET /api/v1/admin/products/low-stock` - Get low stock products

## Database Models

### User
- Email, password, full name, phone
- Admin flag, active status
- Created/updated timestamps

### Product
- Name, slug, description, brand
- Price, discount price, stock quantity
- Images (JSON array), category
- Featured flag, active status

### Category
- Name, slug, image
- Parent category support

### Order
- User reference, order number
- Total, subtotal, tax, shipping
- Status, payment method
- Stripe payment intent ID
- Shipping/billing addresses

### OrderItem
- Order reference, product reference
- Quantity, price at purchase
- Product name/image snapshot

## Authentication

The API uses JWT (JSON Web Tokens) for authentication.

### Getting a Token

1. Register: `POST /api/v1/auth/register`
2. Login: `POST /api/v1/auth/login`
3. Receive JWT token in response
4. Include token in subsequent requests:
   ```
   Authorization: Bearer <your_token>
   ```

### Password Requirements

- Minimum 8 characters
- At least one digit
- At least one uppercase letter

## Testing

Create a test user:

```bash
curl -X POST "http://localhost:8000/api/v1/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234",
    "full_name": "Test User"
  }'
```

Login:

```bash
curl -X POST "http://localhost:8000/api/v1/auth/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=test@example.com&password=Test1234"
```

## Database Migrations (Optional - Alembic)

If you want to use Alembic for database migrations:

```bash
# Initialize Alembic
alembic init alembic

# Create migration
alembic revision --autogenerate -m "Initial migration"

# Apply migration
alembic upgrade head

# Rollback
alembic downgrade -1
```

## Development Tips

1. **Auto-reload**: Use `--reload` flag during development
2. **Debug mode**: Set `DEBUG=True` in `.env`
3. **API Docs**: Use Swagger UI for testing endpoints
4. **Database**: Use PostgreSQL GUI tools like pgAdmin

## Security Notes

- Never commit `.env` file
- Use strong SECRET_KEY in production
- Enable HTTPS in production
- Set `DEBUG=False` in production
- Restrict CORS origins in production
- Use environment-specific Stripe keys

## Production Deployment

1. Set `DEBUG=False` in `.env`
2. Use strong SECRET_KEY
3. Configure production database
4. Set up proper CORS origins
5. Enable HTTPS
6. Use production Stripe keys
7. Set up monitoring and logging

## Troubleshooting

### Database Connection Error
- Check PostgreSQL is running
- Verify DATABASE_URL in `.env`
- Ensure database exists

### Import Errors
- Activate virtual environment
- Install requirements: `pip install -r requirements.txt`

### Token Errors
- Check SECRET_KEY is set
- Verify token format: `Bearer <token>`
- Ensure token hasn't expired

## Support

For issues and questions, refer to the project documentation or check the API logs.

---

**Built with FastAPI for Brands Galaxy E-commerce Platform**
