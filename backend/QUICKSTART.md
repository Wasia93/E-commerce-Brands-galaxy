# Quick Start Guide - Brands Galaxy Backend

Get the backend running in 5 minutes!

## Prerequisites

- Python 3.9+ installed
- PostgreSQL 14+ installed and running
- Git (optional)

## Quick Setup (Windows)

### Option 1: Use Setup Script (Recommended)

```bash
# Run the setup script
setup.bat

# Update .env file with your settings
# Then start the server
run.bat
```

### Option 2: Manual Setup

```bash
# 1. Create virtual environment
python -m venv venv
venv\Scripts\activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Create .env file
copy .env.example .env
# Edit .env with your configuration

# 4. Create database
psql -U postgres
CREATE DATABASE brands_galaxy;
\q

# 5. Start server
uvicorn app.main:app --reload
```

## Quick Setup (Mac/Linux)

```bash
# 1. Create virtual environment
python3 -m venv venv
source venv/bin/activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Create .env file
cp .env.example .env
# Edit .env with your configuration

# 4. Create database
psql -U postgres
CREATE DATABASE brands_galaxy;
\q

# 5. Start server
uvicorn app.main:app --reload
```

## Configuration (.env)

Minimum required configuration:

```env
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/brands_galaxy
SECRET_KEY=your-secret-key-change-this-min-32-characters-long
```

## Verify Installation

Once the server is running, test these endpoints:

1. **Health Check**: http://localhost:8000/health
   ```bash
   curl http://localhost:8000/health
   ```

2. **API Documentation**: http://localhost:8000/api/docs

3. **Create Test User**:
   ```bash
   curl -X POST "http://localhost:8000/api/v1/auth/register" \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"Test1234","full_name":"Test User"}'
   ```

## Common Issues

### "Database does not exist"
```bash
psql -U postgres
CREATE DATABASE brands_galaxy;
```

### "Module not found"
```bash
# Activate virtual environment
venv\Scripts\activate  # Windows
source venv/bin/activate  # Mac/Linux

# Reinstall dependencies
pip install -r requirements.txt
```

### "Connection refused" (Database)
- Make sure PostgreSQL is running
- Check DATABASE_URL in .env
- Verify username/password

## Next Steps

1. ✅ Backend is running at http://localhost:8000
2. 📚 Read API docs at http://localhost:8000/api/docs
3. 🧪 Test endpoints with Swagger UI
4. 🎨 Set up the frontend (see ../frontend)

## Available Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register
- `POST /api/v1/auth/login` - Login
- `GET /api/v1/auth/me` - Get current user

### Products
- `GET /api/v1/products/` - List products
- `GET /api/v1/products/{id}` - Get product
- `POST /api/v1/products/` - Create (Admin)
- `PUT /api/v1/products/{id}` - Update (Admin)
- `DELETE /api/v1/products/{id}` - Delete (Admin)

### Orders
- `POST /api/v1/orders/create-payment-intent` - Payment intent
- `POST /api/v1/orders/` - Create order
- `GET /api/v1/orders/` - User orders
- `GET /api/v1/orders/{id}` - Order details

### Admin
- `GET /api/v1/admin/dashboard` - Dashboard stats
- `GET /api/v1/admin/orders` - All orders
- `PUT /api/v1/admin/orders/{id}/status` - Update status

## Development Tips

- Use `--reload` flag for auto-restart on code changes
- Check logs in the terminal for errors
- Use Swagger UI (http://localhost:8000/api/docs) for testing
- Set `DEBUG=True` in .env during development

## Need Help?

- Check README.md for detailed documentation
- Review the API specs in .claude/agents/
- Check logs for error messages

---

Happy coding! 🚀
