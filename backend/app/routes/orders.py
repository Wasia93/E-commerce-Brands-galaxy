from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
import uuid
from app.database import get_db
from app.schemas.order import OrderResponse, OrderCreate, PaymentIntentCreate, PaymentIntentResponse
from app.models.order import Order, OrderItem, OrderStatus
from app.models.product import Product
from app.models.user import User
from app.dependencies import get_current_active_user
from app.config import settings

router = APIRouter()


@router.post("/create-payment-intent", response_model=PaymentIntentResponse)
async def create_payment_intent(
    order_data: PaymentIntentCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Create Stripe payment intent for checkout"""
    try:
        # Validate and calculate order amount
        total_amount = 0
        order_items = []

        for item in order_data.items:
            product = db.query(Product).filter(Product.id == item.product_id).first()
            if not product:
                raise HTTPException(
                    status_code=404,
                    detail=f"Product {item.product_id} not found"
                )

            # Check stock availability
            if product.stock_quantity < item.quantity:
                raise HTTPException(
                    status_code=400,
                    detail=f"Insufficient stock for {product.name}. Available: {product.stock_quantity}"
                )

            price = float(product.discount_price or product.price)
            total_amount += price * item.quantity

            order_items.append({
                "product_id": str(product.id),
                "name": product.name,
                "quantity": item.quantity,
                "price": price
            })

        # Add shipping and tax
        shipping_cost = 10.00 if total_amount < 100 else 0
        tax_rate = 0.08  # 8% tax
        tax_amount = total_amount * tax_rate
        final_amount = total_amount + shipping_cost + tax_amount

        # For now, return mock payment intent (Stripe integration can be added later)
        mock_intent_id = f"pi_{uuid.uuid4().hex[:24]}"

        return {
            "clientSecret": f"{mock_intent_id}_secret",
            "paymentIntentId": mock_intent_id,
            "amount": final_amount,
            "subtotal": total_amount,
            "shipping": shipping_cost,
            "tax": tax_amount
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error creating payment intent: {str(e)}"
        )


@router.post("/", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
async def create_order(
    order_data: OrderCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Create order after successful payment"""
    try:
        # Calculate order totals
        subtotal = 0
        for item in order_data.items:
            product = db.query(Product).filter(Product.id == item.product_id).first()
            if not product:
                raise HTTPException(status_code=404, detail=f"Product {item.product_id} not found")

            # Check stock
            if product.stock_quantity < item.quantity:
                raise HTTPException(
                    status_code=400,
                    detail=f"Insufficient stock for {product.name}"
                )

            price = float(product.discount_price or product.price)
            subtotal += price * item.quantity

        # Calculate shipping and tax
        shipping_cost = 10.00 if subtotal < 100 else 0
        tax_amount = subtotal * 0.08
        total_amount = subtotal + shipping_cost + tax_amount

        # Generate order number
        order_number = f"ORD-{datetime.utcnow().strftime('%Y%m%d')}-{uuid.uuid4().hex[:8].upper()}"

        # Create order
        new_order = Order(
            user_id=current_user.id,
            order_number=order_number,
            total_amount=total_amount,
            subtotal=subtotal,
            shipping_cost=shipping_cost,
            tax_amount=tax_amount,
            status=OrderStatus.PAID,
            payment_method="stripe",
            stripe_payment_intent_id=order_data.payment_intent_id,
            shipping_address=order_data.shipping_address,
            billing_address=order_data.billing_address or order_data.shipping_address,
            notes=order_data.notes,
            paid_at=datetime.utcnow()
        )

        db.add(new_order)
        db.flush()

        # Create order items and update inventory
        for item in order_data.items:
            product = db.query(Product).filter(Product.id == item.product_id).first()

            order_item = OrderItem(
                order_id=new_order.id,
                product_id=product.id,
                quantity=item.quantity,
                price=product.discount_price or product.price,
                product_name=product.name,
                product_image=product.images[0] if product.images else None
            )

            db.add(order_item)

            # Update stock
            product.stock_quantity -= item.quantity

        db.commit()
        db.refresh(new_order)

        return new_order

    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error creating order: {str(e)}"
        )


@router.get("/", response_model=List[OrderResponse])
async def list_orders(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get user's orders"""
    orders = db.query(Order).filter(Order.user_id == current_user.id).order_by(Order.created_at.desc()).all()
    return orders


@router.get("/{order_id}", response_model=OrderResponse)
async def get_order(
    order_id: str,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get order details"""
    order = db.query(Order).filter(
        Order.id == order_id,
        Order.user_id == current_user.id
    ).first()

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    return order
