from sqlalchemy import Column, String, Numeric, Integer, Boolean, JSON, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime
from app.database import Base


def generate_uuid():
    return str(uuid.uuid4())


class Product(Base):
    __tablename__ = "products"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(200), nullable=False)
    slug = Column(String(250), unique=True, nullable=False, index=True)
    description = Column(Text)
    brand = Column(String(100), index=True)
    category_id = Column(String(36), ForeignKey('categories.id'))
    price = Column(Numeric(10, 2), nullable=False)
    discount_price = Column(Numeric(10, 2))
    stock_quantity = Column(Integer, default=0)
    images = Column(JSON)  # Array of image URLs
    is_featured = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    additional_info = Column(JSON)  # For flexible attributes (ingredients, size, etc.)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    category = relationship("Category", back_populates="products")
    order_items = relationship("OrderItem", back_populates="product")
