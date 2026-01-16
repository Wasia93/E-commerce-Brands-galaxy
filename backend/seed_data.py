"""Seed script to populate the database with sample products"""
import sys
sys.path.insert(0, '.')

from app.database import engine, SessionLocal, Base
from app.models.category import Category
from app.models.product import Product

# Create all tables
Base.metadata.create_all(bind=engine)

# Sample data
categories = [
    {"name": "Skincare", "slug": "skincare", "image": "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400"},
    {"name": "Makeup", "slug": "makeup", "image": "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400"},
    {"name": "Fragrance", "slug": "fragrance", "image": "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400"},
    {"name": "Haircare", "slug": "haircare", "image": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400"},
]

products = [
    # Skincare
    {
        "name": "La Mer Moisturizing Cream",
        "slug": "la-mer-moisturizing-cream",
        "description": "The iconic moisturizer that started it all. This luxuriously rich yet incredibly lightweight cream delivers deep, lasting moisture and helps soften the appearance of lines.",
        "brand": "La Mer",
        "category_slug": "skincare",
        "price": 380.00,
        "stock_quantity": 25,
        "images": ["https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=600"],
        "is_featured": True,
    },
    {
        "name": "SK-II Facial Treatment Essence",
        "slug": "sk-ii-facial-treatment-essence",
        "description": "The iconic essence that transforms skin with over 90% Pitera, a bio-ingredient that promotes skin's natural surface rejuvenation process.",
        "brand": "SK-II",
        "category_slug": "skincare",
        "price": 265.00,
        "stock_quantity": 40,
        "images": ["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600"],
        "is_featured": True,
    },
    {
        "name": "Estee Lauder Advanced Night Repair",
        "slug": "estee-lauder-advanced-night-repair",
        "description": "The world's #1 repair serum. Powerful nighttime renewal supports natural skin repair to help reduce the look of lines and wrinkles.",
        "brand": "Estee Lauder",
        "category_slug": "skincare",
        "price": 185.00,
        "stock_quantity": 50,
        "images": ["https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600"],
        "is_featured": False,
    },
    {
        "name": "Drunk Elephant Protini Polypeptide Cream",
        "slug": "drunk-elephant-protini-cream",
        "description": "A protein moisturizer formulated with signal peptides, growth factors, and amino acids to improve skin texture and firmness.",
        "brand": "Drunk Elephant",
        "category_slug": "skincare",
        "price": 68.00,
        "stock_quantity": 60,
        "images": ["https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600"],
        "is_featured": False,
    },
    # Makeup
    {
        "name": "Charlotte Tilbury Pillow Talk Lipstick",
        "slug": "charlotte-tilbury-pillow-talk",
        "description": "The iconic nude-pink lipstick that flatters every skin tone. Enriched with lip-loving ingredients for a perfect pout.",
        "brand": "Charlotte Tilbury",
        "category_slug": "makeup",
        "price": 34.00,
        "stock_quantity": 100,
        "images": ["https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600"],
        "is_featured": True,
    },
    {
        "name": "Tom Ford Shade and Illuminate",
        "slug": "tom-ford-shade-illuminate",
        "description": "A soft-focus, highlighting duo with a revolutionary formula that creates a beautifully natural-looking radiance.",
        "brand": "Tom Ford",
        "category_slug": "makeup",
        "price": 88.00,
        "stock_quantity": 30,
        "images": ["https://images.unsplash.com/photo-1512207855369-c6c3e595c884?w=600"],
        "is_featured": True,
    },
    {
        "name": "NARS Orgasm Blush",
        "slug": "nars-orgasm-blush",
        "description": "The iconic peachy-pink blush with golden shimmer that gives skin a natural, healthy-looking glow.",
        "brand": "NARS",
        "category_slug": "makeup",
        "price": 30.00,
        "stock_quantity": 80,
        "images": ["https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600"],
        "is_featured": False,
    },
    {
        "name": "Pat McGrath MatteTrance Lipstick",
        "slug": "pat-mcgrath-mattetrance",
        "description": "An opulent, creamy matte lipstick that delivers rich color payoff with a luxuriously lightweight feel.",
        "brand": "Pat McGrath Labs",
        "category_slug": "makeup",
        "price": 38.00,
        "stock_quantity": 45,
        "images": ["https://images.unsplash.com/photo-1631214500115-598fc2cb8d9a?w=600"],
        "is_featured": False,
    },
    # Fragrance
    {
        "name": "Chanel No. 5 Eau de Parfum",
        "slug": "chanel-no-5-edp",
        "description": "The iconic fragrance that revolutionized perfumery. A floral-aldehyde bouquet of timeless elegance and sophistication.",
        "brand": "Chanel",
        "category_slug": "fragrance",
        "price": 150.00,
        "stock_quantity": 35,
        "images": ["https://images.unsplash.com/photo-1541643600914-78b084683601?w=600"],
        "is_featured": True,
    },
    {
        "name": "Tom Ford Black Orchid",
        "slug": "tom-ford-black-orchid",
        "description": "A luxurious and sensual fragrance of rich, dark accords and an alluring potion of black orchids and spice.",
        "brand": "Tom Ford",
        "category_slug": "fragrance",
        "price": 180.00,
        "stock_quantity": 25,
        "images": ["https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600"],
        "is_featured": True,
    },
    {
        "name": "Dior Sauvage Eau de Parfum",
        "slug": "dior-sauvage-edp",
        "description": "A powerful and noble trail with fresh and woody notes. Raw and refined, wild and elegant.",
        "brand": "Dior",
        "category_slug": "fragrance",
        "price": 165.00,
        "stock_quantity": 50,
        "images": ["https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=600"],
        "is_featured": False,
    },
    # Haircare
    {
        "name": "Olaplex No. 3 Hair Perfector",
        "slug": "olaplex-no-3",
        "description": "A weekly at-home treatment that reduces breakage and visibly strengthens hair, improving its look and feel.",
        "brand": "Olaplex",
        "category_slug": "haircare",
        "price": 30.00,
        "stock_quantity": 70,
        "images": ["https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=600"],
        "is_featured": True,
    },
    {
        "name": "Dyson Supersonic Hair Dryer",
        "slug": "dyson-supersonic",
        "description": "Intelligent heat control to help protect your shine. Engineered for different hair types with magnetic attachments.",
        "brand": "Dyson",
        "category_slug": "haircare",
        "price": 429.00,
        "discount_price": 399.00,
        "stock_quantity": 15,
        "images": ["https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600"],
        "is_featured": True,
    },
    {
        "name": "Kerastase Elixir Ultime Oil",
        "slug": "kerastase-elixir-ultime",
        "description": "A luxurious hair oil that provides instant shine, smoothness, and protection while nourishing hair deeply.",
        "brand": "Kerastase",
        "category_slug": "haircare",
        "price": 56.00,
        "stock_quantity": 40,
        "images": ["https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=600"],
        "is_featured": False,
    },
]


def seed_database():
    db = SessionLocal()

    try:
        # Clear existing data
        db.query(Product).delete()
        db.query(Category).delete()
        db.commit()

        # Create categories
        category_map = {}
        for cat_data in categories:
            category = Category(**cat_data)
            db.add(category)
            db.flush()  # Get the ID
            category_map[cat_data["slug"]] = category.id

        db.commit()
        print(f"Created {len(categories)} categories")

        # Create products
        for prod_data in products:
            category_slug = prod_data.pop("category_slug")
            prod_data["category_id"] = category_map.get(category_slug)
            product = Product(**prod_data)
            db.add(product)

        db.commit()
        print(f"Created {len(products)} products")

        print("\nDatabase seeded successfully!")

    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
