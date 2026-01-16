from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from uuid import UUID
from decimal import Decimal
from app.models.order import OrderStatus


class OrderItemBase(BaseModel):
    product_id: UUID
    quantity: int = Field(..., gt=0)


class OrderItemCreate(OrderItemBase):
    pass


class OrderItemResponse(BaseModel):
    id: UUID
    product_id: UUID
    product_name: str
    product_image: Optional[str]
    quantity: int
    price: Decimal

    class Config:
        from_attributes = True


class OrderBase(BaseModel):
    shipping_address: dict
    billing_address: Optional[dict] = None
    notes: Optional[str] = None


class OrderCreate(OrderBase):
    items: List[OrderItemCreate]
    payment_intent_id: Optional[str] = None


class OrderUpdate(BaseModel):
    status: Optional[OrderStatus] = None
    tracking_number: Optional[str] = None
    notes: Optional[str] = None


class OrderResponse(BaseModel):
    id: UUID
    user_id: UUID
    order_number: str
    total_amount: Decimal
    subtotal: Decimal
    discount_amount: Decimal
    tax_amount: Decimal
    shipping_cost: Decimal
    status: OrderStatus
    payment_method: Optional[str]
    stripe_payment_intent_id: Optional[str]
    shipping_address: dict
    billing_address: Optional[dict]
    notes: Optional[str]
    tracking_number: Optional[str]
    created_at: datetime
    paid_at: Optional[datetime]
    shipped_at: Optional[datetime]
    delivered_at: Optional[datetime]
    items: List[OrderItemResponse]

    class Config:
        from_attributes = True


class PaymentIntentCreate(BaseModel):
    items: List[OrderItemCreate]
    shipping_address: dict


class PaymentIntentResponse(BaseModel):
    clientSecret: str
    paymentIntentId: str
    amount: Decimal
    subtotal: Decimal
    shipping: Decimal
    tax: Decimal
