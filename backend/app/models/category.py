from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.orm import relationship
import uuid
from app.database import Base


def generate_uuid():
    return str(uuid.uuid4())


class Category(Base):
    __tablename__ = "categories"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(100), nullable=False)
    slug = Column(String(120), unique=True, nullable=False, index=True)
    image = Column(String(500))
    parent_id = Column(String(36), ForeignKey('categories.id'), nullable=True)

    # Relationships
    products = relationship("Product", back_populates="category")
    children = relationship("Category")
