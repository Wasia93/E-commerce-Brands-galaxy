from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.schemas.product import ProductResponse, ProductCreate, ProductUpdate, CategoryResponse, CategoryCreate
from app.models.product import Product
from app.models.category import Category
from app.dependencies import get_current_admin

router = APIRouter()


# Product Endpoints
@router.get("/", response_model=List[ProductResponse])
async def list_products(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    search: Optional[str] = None,
    category: Optional[str] = None,
    brand: Optional[str] = None,
    min_price: Optional[float] = Query(None, ge=0),
    max_price: Optional[float] = Query(None, ge=0),
    is_featured: Optional[bool] = None,
    in_stock: Optional[bool] = None,
    sort_by: Optional[str] = Query("created_at", regex="^(price|name|created_at)$"),
    sort_order: Optional[str] = Query("desc", regex="^(asc|desc)$"),
    db: Session = Depends(get_db)
):
    """List products with pagination and filtering"""
    query = db.query(Product).filter(Product.is_active == True)

    # Apply filters
    if category:
        query = query.filter(Product.category_id == category)
    if brand:
        query = query.filter(Product.brand.ilike(f"%{brand}%"))
    if search:
        query = query.filter(
            (Product.name.ilike(f"%{search}%")) |
            (Product.description.ilike(f"%{search}%"))
        )
    if min_price is not None:
        query = query.filter(Product.price >= min_price)
    if max_price is not None:
        query = query.filter(Product.price <= max_price)
    if is_featured is not None:
        query = query.filter(Product.is_featured == is_featured)
    if in_stock:
        query = query.filter(Product.stock_quantity > 0)

    # Apply sorting
    if sort_order == "asc":
        query = query.order_by(getattr(Product, sort_by).asc())
    else:
        query = query.order_by(getattr(Product, sort_by).desc())

    # Pagination
    products = query.offset(skip).limit(limit).all()
    return products


@router.get("/{product_id}", response_model=ProductResponse)
async def get_product(product_id: str, db: Session = Depends(get_db)):
    """Get single product by ID or slug"""
    product = db.query(Product).filter(
        ((Product.id == product_id) | (Product.slug == product_id)) &
        (Product.is_active == True)
    ).first()

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    return product


@router.post("/", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
async def create_product(
    product: ProductCreate,
    current_user = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Create new product (Admin only)"""
    # Check if slug already exists
    existing = db.query(Product).filter(Product.slug == product.slug).first()
    if existing:
        raise HTTPException(status_code=400, detail="Product slug already exists")

    new_product = Product(**product.model_dump())
    db.add(new_product)
    db.commit()
    db.refresh(new_product)

    return new_product


@router.put("/{product_id}", response_model=ProductResponse)
async def update_product(
    product_id: str,
    product: ProductUpdate,
    current_user = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Update product (Admin only)"""
    db_product = db.query(Product).filter(Product.id == product_id).first()

    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")

    update_data = product.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_product, field, value)

    db.commit()
    db.refresh(db_product)

    return db_product


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_product(
    product_id: str,
    current_user = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Delete product (Admin only)"""
    product = db.query(Product).filter(Product.id == product_id).first()

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    db.delete(product)
    db.commit()

    return None


# Category Endpoints
@router.get("/categories/", response_model=List[CategoryResponse])
async def list_categories(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """List all categories"""
    categories = db.query(Category).offset(skip).limit(limit).all()
    return categories


@router.post("/categories/", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
async def create_category(
    category: CategoryCreate,
    current_user = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Create new category (Admin only)"""
    # Check if slug already exists
    existing = db.query(Category).filter(Category.slug == category.slug).first()
    if existing:
        raise HTTPException(status_code=400, detail="Category slug already exists")

    new_category = Category(**category.model_dump())
    db.add(new_category)
    db.commit()
    db.refresh(new_category)

    return new_category
