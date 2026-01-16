from pydantic import BaseModel, Field, field_validator
from typing import Optional, List
from datetime import datetime
from uuid import UUID
from decimal import Decimal


class ProductBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    slug: str = Field(..., max_length=250)
    description: Optional[str] = None
    brand: str = Field(..., max_length=100)
    category_id: UUID
    price: Decimal = Field(..., gt=0)
    discount_price: Optional[Decimal] = Field(None, gt=0)
    stock_quantity: int = Field(default=0, ge=0)
    images: List[str] = []
    is_featured: bool = False
    additional_info: Optional[dict] = None

    @field_validator('discount_price')
    @classmethod
    def discount_must_be_less_than_price(cls, v, info):
        if v is not None and 'price' in info.data and v >= info.data['price']:
            raise ValueError('Discount price must be less than regular price')
        return v


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[Decimal] = Field(None, gt=0)
    discount_price: Optional[Decimal] = Field(None, gt=0)
    stock_quantity: Optional[int] = Field(None, ge=0)
    images: Optional[List[str]] = None
    is_featured: Optional[bool] = None
    is_active: Optional[bool] = None
    additional_info: Optional[dict] = None


class ProductResponse(BaseModel):
    id: UUID
    name: str
    slug: str
    description: Optional[str]
    brand: str
    category_id: UUID
    price: Decimal
    discount_price: Optional[Decimal]
    images: List[str]
    stock_quantity: int
    is_featured: bool
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class CategoryBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    slug: str = Field(..., max_length=120)
    image: Optional[str] = None
    parent_id: Optional[UUID] = None


class CategoryCreate(CategoryBase):
    pass


class CategoryResponse(BaseModel):
    id: UUID
    name: str
    slug: str
    image: Optional[str]
    parent_id: Optional[UUID]

    class Config:
        from_attributes = True
