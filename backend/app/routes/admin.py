from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from datetime import datetime, timedelta
from app.database import get_db
from app.schemas.order import OrderResponse, OrderUpdate
from app.models.order import Order, OrderStatus
from app.models.product import Product
from app.models.user import User
from app.dependencies import get_current_admin

router = APIRouter()


@router.get("/dashboard")
async def get_dashboard_stats(
    current_user = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Get dashboard statistics"""
    # Total revenue
    total_revenue = db.query(func.sum(Order.total_amount)).filter(
        Order.status.in_([OrderStatus.PAID, OrderStatus.PROCESSING, OrderStatus.SHIPPED, OrderStatus.DELIVERED])
    ).scalar() or 0

    # Total orders
    total_orders = db.query(func.count(Order.id)).scalar() or 0

    # Total products
    total_products = db.query(func.count(Product.id)).filter(Product.is_active == True).scalar() or 0

    # Total users
    total_users = db.query(func.count(User.id)).filter(User.is_active == True).scalar() or 0

    # Recent orders (last 10)
    recent_orders = db.query(Order).order_by(Order.created_at.desc()).limit(10).all()

    # Revenue trend (last 7 days)
    seven_days_ago = datetime.utcnow() - timedelta(days=7)
    daily_revenue = db.query(
        func.date(Order.created_at).label('date'),
        func.sum(Order.total_amount).label('revenue')
    ).filter(
        Order.created_at >= seven_days_ago,
        Order.status.in_([OrderStatus.PAID, OrderStatus.PROCESSING, OrderStatus.SHIPPED, OrderStatus.DELIVERED])
    ).group_by(func.date(Order.created_at)).all()

    return {
        "stats": {
            "totalRevenue": float(total_revenue),
            "totalOrders": total_orders,
            "totalProducts": total_products,
            "totalUsers": total_users
        },
        "recentOrders": recent_orders,
        "revenuetrend": [
            {"date": str(day.date), "revenue": float(day.revenue)}
            for day in daily_revenue
        ]
    }


@router.get("/orders", response_model=List[OrderResponse])
async def list_all_orders(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    status: Optional[OrderStatus] = None,
    current_user = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Get all orders (Admin only)"""
    query = db.query(Order)

    if status:
        query = query.filter(Order.status == status)

    orders = query.order_by(Order.created_at.desc()).offset(skip).limit(limit).all()
    return orders


@router.put("/orders/{order_id}/status", response_model=OrderResponse)
async def update_order_status(
    order_id: str,
    order_update: OrderUpdate,
    current_user = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Update order status (Admin only)"""
    order = db.query(Order).filter(Order.id == order_id).first()

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    # Update status
    if order_update.status:
        order.status = order_update.status

        # Update timestamps based on status
        if order_update.status == OrderStatus.SHIPPED and not order.shipped_at:
            order.shipped_at = datetime.utcnow()
        elif order_update.status == OrderStatus.DELIVERED and not order.delivered_at:
            order.delivered_at = datetime.utcnow()

    # Update tracking number
    if order_update.tracking_number:
        order.tracking_number = order_update.tracking_number

    # Update notes
    if order_update.notes:
        order.notes = order_update.notes

    db.commit()
    db.refresh(order)

    return order


@router.get("/users", response_model=List)
async def list_all_users(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    current_user = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Get all users (Admin only)"""
    users = db.query(User).offset(skip).limit(limit).all()
    return users


@router.get("/products/low-stock")
async def get_low_stock_products(
    threshold: int = Query(10, ge=0),
    current_user = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Get products with low stock (Admin only)"""
    products = db.query(Product).filter(
        Product.stock_quantity < threshold,
        Product.stock_quantity > 0,
        Product.is_active == True
    ).all()

    return {
        "products": products,
        "count": len(products),
        "threshold": threshold
    }
