import { Product, Category, Coupon, Banner, Review, Order } from '../types';

export const FALLBACK_CATEGORIES: Category[] = [
  {
    "id": 1,
    "name": "Wood-Pressed Oils",
    "local_name": "గానుగ నూనెలు (Ganuga Nunelu)",
    "slug": "wood-pressed-oils",
    "description": "Traditional kachi ghani wood-pressed oils extracted at low temperatures with zero chemicals or heat.",
    "icon": "Droplet",
    "image_url": "/images/sesame-oil-shelf-1l.jpeg",
    "display_order": 1
  },
  {
    "id": 2,
    "name": "Desi Ghee & Butter",
    "local_name": "స్వచ్ఛమైన ఆవు నెయ్యి (Desi Cow Ghee)",
    "slug": "desi-ghee",
    "description": "A2 Vedic Bilona cultured ghee prepared using curd churning method from free-grazing Gir cows.",
    "icon": "Milk",
    "image_url": "/images/ghee.jpg",
    "display_order": 2
  },
  {
    "id": 3,
    "name": "Organic Dals & Pulses",
    "local_name": "సేంద్రీయ పప్పులు (Organic Pappulu)",
    "slug": "organic-pulses",
    "description": "Unpolished, pesticide-free dals sourced directly from certified organic farmer collectives.",
    "icon": "Wheat",
    "image_url": "/images/pulses.jpg",
    "display_order": 3
  },
  {
    "id": 4,
    "name": "Natural Spices & Masalas",
    "local_name": "సహజ మసాలాలు (Natural Masalalu)",
    "slug": "natural-spices",
    "description": "Stone-ground whole spices with rich aroma, natural essential oils, and zero adulteration.",
    "icon": "Flame",
    "image_url": "/images/spices.jpg",
    "display_order": 4
  },
  {
    "id": 5,
    "name": "Raw Forest Honey & Jaggery",
    "local_name": "స్వచ్ఛమైన అడవి తేనె & బెల్లం",
    "slug": "raw-honey-jaggery",
    "description": "Unheated, unfiltered wild multi-flora honey and organic chemical-free cane jaggery.",
    "icon": "Heart",
    "image_url": "/images/honey.jpg",
    "display_order": 5
  }
];

export const FALLBACK_PRODUCTS: Product[] = [
  {
    "id": 1,
    "category_id": 1,
    "name": "Single-Estate Black Mustard Oil · First Wood Press (Kachi Ghani)",
    "local_name": "ఆవ నూనె (Aava Nune) · 2026 Reserve",
    "slug": "wood-pressed-mustard-oil-5l",
    "description": "Slow-extracted at ambient room temperature in Vagai wood churns to preserve pungent volatile bio-enzymes. Unbleached, unrefined, and single-estate sourced.",
    "price": 1450,
    "discount_price": 1320,
    "stock_quantity": 12,
    "unit": "5 Litre Tin",
    "image_url": "/images/mustard-oil-reserve.jpg",
    "is_featured": true,
    "is_active": true,
    "rating": 4.9,
    "review_count": 34,
    "category_name": "Wood-Pressed Oils",
    "category_slug": "wood-pressed-oils",
    "updated_at": "2026-09-05T19:28:13.011Z"
  },
  {
    "id": 2,
    "category_id": 1,
    "name": "Artisanal Wood-Pressed Mustard Oil (Reserve Bottle)",
    "local_name": "ఆవ నూనె (Aava Nune)",
    "slug": "wood-pressed-mustard-oil-1l",
    "description": "First cold extraction of heritage black mustard seeds. Decanted through gravitational resting without chemical filtration or thermal alteration.",
    "price": 290,
    "discount_price": 260,
    "stock_quantity": 45,
    "unit": "1 Litre Bottle",
    "image_url": "/images/mustard-oil-reserve.jpg",
    "is_featured": false,
    "is_active": true,
    "rating": 4.8,
    "review_count": 19
  },
  {
    "id": 3,
    "category_id": 1,
    "name": "Wood-Pressed Groundnut Oil (Lakdi Ghana First Press)",
    "local_name": "వేరుశనగ నూనె (Verusenaga Nune)",
    "slug": "wood-pressed-groundnut-oil-5l",
    "description": "Golden, sweet-nutty wood-churned virgin groundnut oil from heirloom Saurashtra seeds. Sub-35°C ambient pressing preserves natural plant phytosterols.",
    "price": 1114,
    "discount_price": 999,
    "stock_quantity": 32,
    "unit": "2.6 kg Can",
    "image_url": "/images/groundnut-oil-2-5kg.jpeg",
    "is_featured": true,
    "is_active": true,
    "rating": 4.9,
    "review_count": 42
  },
  {
    "id": 4,
    "category_id": 1,
    "name": "Wood-Pressed Sunflower Oil (Pure Cold Pressed)",
    "local_name": "పొద్దుతిరుగుడు నూనె (Sunflower Oil)",
    "slug": "wood-pressed-sunflower-oil-1l",
    "description": "100% pure wood cold pressed sunflower oil extracted fresh at room temperature. Natural vitamin E and plant sterols.",
    "price": 450,
    "discount_price": 399,
    "stock_quantity": 60,
    "unit": "1 Litre Bottle",
    "image_url": "/images/sunflower-oil-1l.jpeg",
    "is_featured": false,
    "is_active": true,
    "rating": 4.8,
    "review_count": 22
  },
  {
    "id": 5,
    "category_id": 1,
    "name": "Wood-Pressed Sesame / Gingelly Oil (Pure Wood Cold Pressed)",
    "local_name": "నువ్వుల నూనె (Nuvvula Nune)",
    "slug": "wood-pressed-sesame-oil-1l",
    "description": "Traditional slow wood-churning of organic black sesame seeds with pure toddy palm jaggery. Rich in bio-available calcium and sesamol antioxidants.",
    "price": 650,
    "discount_price": 490,
    "stock_quantity": 24,
    "unit": "1 Litre Bottle",
    "image_url": "/images/sesame-oil-1l.jpeg",
    "is_featured": true,
    "is_active": true,
    "rating": 4.9,
    "review_count": 18,
    "category_name": "Wood-Pressed Oils",
    "category_slug": "wood-pressed-oils",
    "updated_at": "2026-09-06T12:18:04.432Z"
  },
  {
    "id": 6,
    "category_id": 1,
    "name": "Cold-Pressed Wild Virgin Coconut Elixir",
    "local_name": "కొబ్బరి నూనె (Kobbari Nune)",
    "slug": "cold-pressed-coconut-oil-1l",
    "description": "Extracted from sun-ripened organic sulphur-free copra using slow stone grinding. Raw, fragrant, and pristine culinary botanical.",
    "price": 420,
    "discount_price": 380,
    "stock_quantity": 35,
    "unit": "1 Litre Bottle",
    "image_url": "/images/oils-collection.jpg",
    "is_featured": false,
    "is_active": true,
    "rating": 4.9,
    "review_count": 27
  },
  {
    "id": 7,
    "category_id": 2,
    "name": "Grass-Fed A2 Gir Cow Cultured Bilona Ghee · Vedic Churn",
    "local_name": "గిర్ ఆవు స్వచ్ఛమైన నెయ్యి · Vedic Reserve",
    "slug": "a2-gir-cow-bilona-ghee-1l",
    "description": "Slow-simmered golden elixir hand-churned from cultured whole curd using traditional bi-directional wooden bilona. Grainy golden texture and Vedic purity.",
    "price": 2100,
    "discount_price": 1899,
    "stock_quantity": 18,
    "unit": "1 Litre Stoneware Jar",
    "image_url": "/images/ghee-reserve.jpg",
    "is_featured": true,
    "is_active": true,
    "rating": 5,
    "review_count": 51
  },
  {
    "id": 8,
    "category_id": 2,
    "name": "A2 Gir Cow Cultured Bilona Ghee (500ml)",
    "local_name": "గిర్ ఆవు స్వచ్ఛమైన నెయ్యి",
    "slug": "a2-gir-cow-bilona-ghee-500ml",
    "description": "Pure Vedic bilona cow ghee in a handy 500ml glass jar. Made by slow heating white makkhan on cow dung cake fire.",
    "price": 940,
    "discount_price": 849,
    "stock_quantity": 25,
    "unit": "500ml Glass Jar",
    "image_url": "/images/desi-cow-ghee-500ml.jpeg",
    "is_featured": false,
    "is_active": true,
    "rating": 4.9,
    "review_count": 29
  },
  {
    "id": 9,
    "category_id": 3,
    "name": "Unpolished Organic Toor Dal",
    "local_name": "సేంద్రీయ కందిపప్పు (Kandi Pappu)",
    "slug": "unpolished-organic-toor-dal-1kg",
    "description": "Locally grown Desi toor dal, completely unpolished without any oil or water processing. Cooks faster, tastes authentic, and preserves fiber.",
    "price": 195,
    "discount_price": 175,
    "stock_quantity": 50,
    "unit": "1 kg Pack",
    "image_url": "/images/pulses.jpg",
    "is_featured": true,
    "is_active": true,
    "rating": 4.8,
    "review_count": 16
  },
  {
    "id": 10,
    "category_id": 3,
    "name": "Organic Green Gram / Moong Dal (Split)",
    "local_name": "పెసర పప్పు (Pesara Pappu)",
    "slug": "organic-moong-dal-1kg",
    "description": "Nutrient-rich split yellow moong dal. Easily digestible, high protein staple for kichdi, rasam, and traditional dal recipes.",
    "price": 175,
    "discount_price": 160,
    "stock_quantity": 40,
    "unit": "1 kg Pack",
    "image_url": "/images/pulses.jpg",
    "is_featured": false,
    "is_active": true,
    "rating": 4.7,
    "review_count": 14
  },
  {
    "id": 11,
    "category_id": 4,
    "name": "Whole Stone-Ground Turmeric Powder",
    "local_name": "సేంద్రీయ పసుపు (Pasupu)",
    "slug": "stone-ground-turmeric-powder-500g",
    "description": "High curcumin (above 4.5%) Salem variety turmeric roots stone ground to preserve essential aroma and medicinal potency.",
    "price": 190,
    "discount_price": 170,
    "stock_quantity": 30,
    "unit": "500g Pouch",
    "image_url": "/images/spices.jpg",
    "is_featured": true,
    "is_active": true,
    "rating": 4.9,
    "review_count": 23
  },
  {
    "id": 12,
    "category_id": 4,
    "name": "Stone-Pounded Guntur Red Chilli Powder",
    "local_name": "గుంటూరు కారం పొడి (Karam Podi)",
    "slug": "guntur-red-chilli-powder-500g",
    "description": "Traditional cold-pounded stemless Guntur Sannam chillies. Vibrant red natural color with zero added colors or fillers.",
    "price": 220,
    "discount_price": 195,
    "stock_quantity": 35,
    "unit": "500g Pouch",
    "image_url": "/images/spices.jpg",
    "is_featured": false,
    "is_active": true,
    "rating": 4.8,
    "review_count": 19
  },
  {
    "id": 13,
    "category_id": 5,
    "name": "Pure Raw Forest Multiflora Honey (250g)",
    "local_name": "స్వచ్ఛమైన కొండ తేనె (Wild Honey)",
    "slug": "wild-forest-raw-honey-1kg",
    "description": "Collected by tribal honey hunters from dense Eastern Ghats forests. Never pasteurized or heated. Contains natural bee pollen and enzymes.",
    "price": 175,
    "discount_price": 150,
    "stock_quantity": 20,
    "unit": "250g Glass Jar",
    "image_url": "/images/pure-honey-250g.jpeg",
    "is_featured": true,
    "is_active": true,
    "rating": 4.9,
    "review_count": 38,
    "category_name": "Raw Forest Honey & Jaggery",
    "category_slug": "raw-honey-jaggery",
    "updated_at": "2026-09-06T12:18:32.312Z"
  },
  {
    "id": 14,
    "category_id": 5,
    "name": "Organic Chemical-Free Jaggery Powder",
    "local_name": "నాటు బెల్లం పొడి (Natu Bellam)",
    "slug": "organic-jaggery-powder-1kg",
    "description": "Made from sun-ripened organic sugarcane without chemical bleaches or hydros. Perfect healthy alternative to refined white sugar.",
    "price": 140,
    "discount_price": 125,
    "stock_quantity": 45,
    "unit": "1 kg Pack",
    "image_url": "/images/honey.jpg",
    "is_featured": false,
    "is_active": true,
    "rating": 4.8,
    "review_count": 15
  },
  {
    "id": 15,
    "category_id": 1,
    "name": "Wood-Pressed Sesame / Gingelly Oil (5L Can)",
    "local_name": "నువ్వుల నూనె 5L (Nuvvula Nune)",
    "slug": "wood-pressed-sesame-oil-5l",
    "description": "100% pure wood cold pressed sesame oil in a 5L family value can. Extracted on wooden kolhu machines with zero chemicals or high heat.",
    "price": 2750,
    "discount_price": 2499,
    "stock_quantity": 15,
    "unit": "5 Litre Can",
    "image_url": "/images/sesame-oil-5l.jpeg",
    "is_featured": true,
    "is_active": true,
    "rating": 5,
    "review_count": 24,
    "category_name": "Wood-Pressed Oils",
    "category_slug": "wood-pressed-oils"
  },
  {
    "id": 16,
    "category_id": 1,
    "name": "Wood-Pressed Sunflower Oil (2.6kg Can)",
    "local_name": "పొద్దుతిరుగుడు నూనె 2.6kg (Sunflower Oil)",
    "slug": "wood-pressed-sunflower-oil-2-6kg",
    "description": "100% pure wood cold pressed sunflower oil in a 2.6kg value can. Ambient room temperature pressing preserves natural plant phytosterols.",
    "price": 1235,
    "discount_price": 1120,
    "stock_quantity": 20,
    "unit": "2.6 kg Can",
    "image_url": "/images/sunflower-oil-2-5kg.jpeg",
    "is_featured": true,
    "is_active": true,
    "rating": 4.9,
    "review_count": 31,
    "category_name": "Wood-Pressed Oils",
    "category_slug": "wood-pressed-oils"
  },
  {
    "id": 17,
    "category_id": 2,
    "name": "Pure Desi Cow Ghee (250g Jar)",
    "local_name": "స్వచ్ఛమైన ఆవు నెయ్యి (Pure Cow Ghee)",
    "slug": "pure-desi-cow-ghee-250g",
    "description": "100% pure wood-churned Desi cow ghee in a convenient 250g glass jar. Traditional golden aroma and grainy texture.",
    "price": 290,
    "discount_price": 260,
    "stock_quantity": 35,
    "unit": "250g Glass Jar",
    "image_url": "/images/pure-ghee-250g.jpeg",
    "is_featured": false,
    "is_active": true,
    "rating": 4.9,
    "review_count": 18,
    "category_name": "Desi Ghee & Butter",
    "category_slug": "desi-ghee",
    "updated_at": "2026-09-06T12:19:00.013Z"
  }
];

export const FALLBACK_COUPONS: Coupon[] = [
  {
    "id": 1,
    "code": "WELCOME50",
    "description": "₹50 flat discount on your first order above ₹300",
    "discount_type": "fixed",
    "discount_value": 50,
    "min_order_amount": 300,
    "max_discount": 50,
    "valid_until": "2027-12-31T23:59:59Z",
    "max_uses": 1000,
    "used_count": 4,
    "is_active": true
  },
  {
    "id": 2,
    "code": "SAI10",
    "description": "10% discount on all natural groceries (Up to ₹200 off)",
    "discount_type": "percent",
    "discount_value": 10,
    "min_order_amount": 500,
    "max_discount": 200,
    "valid_until": "2027-12-31T23:59:59Z",
    "max_uses": 500,
    "used_count": 12,
    "is_active": true
  },
  {
    "id": 3,
    "code": "BULKOIL15",
    "description": "15% instant discount on orders above ₹1,500 (Max ₹500 off)",
    "discount_type": "percent",
    "discount_value": 15,
    "min_order_amount": 1500,
    "max_discount": 500,
    "valid_until": "2027-12-31T23:59:59Z",
    "max_uses": 200,
    "used_count": 21,
    "is_active": true
  }
];

export const FALLBACK_BANNERS: Banner[] = [
  {
    "id": 1,
    "title": "Fresh Wood-Pressed Oils",
    "subtitle": "Watch it pressed live at our Hafeezpet store. 100% Pure Kachi Ghani Mustard, Groundnut & Sesame Oils.",
    "badge": "Bestseller ⭐ 4.9 Rating",
    "image_url": "/images/sesame-oil-shelf-1l.jpeg",
    "link_url": "/products?category=wood-pressed-oils",
    "display_order": 1,
    "is_active": true
  },
  {
    "id": 2,
    "title": "A2 Vedic Bilona Desi Cow Ghee",
    "subtitle": "Cultured curd churned with wooden bilona. Golden granular goodness for your family.",
    "badge": "100% Pure Vedic Tradition",
    "image_url": "/images/ghee.jpg",
    "link_url": "/products?category=desi-ghee",
    "display_order": 2,
    "is_active": true
  },
  {
    "id": 3,
    "title": "Monthly Organic Kitchen Saver",
    "subtitle": "Unpolished Dals, Raw Forest Honey & Stone-Ground Spices delivered to your doorstep.",
    "badge": "Free Delivery on ₹500+",
    "image_url": "/images/pulses.jpg",
    "link_url": "/products",
    "display_order": 3,
    "is_active": true
  }
];

export const FALLBACK_REVIEWS: Review[] = [
  {
    "id": 1,
    "product_id": 1,
    "user_id": 2,
    "rating": 5,
    "title": "Best mustard oil in Hyderabad",
    "comment": "Authentic strong pungent aroma. You can even see the oil being pressed live in the shop. High quality!",
    "status": "approved"
  },
  {
    "id": 2,
    "product_id": 7,
    "user_id": 2,
    "rating": 5,
    "title": "Pure aroma like village ghee",
    "comment": "The granules and aroma take me back to my native village. Excellent bilona ghee.",
    "status": "approved"
  }
];

export const FALLBACK_ADMIN_ORDERS: Order[] = [
  {
    id: 101,
    order_number: 'SSNF-20260908-0101',
    user_id: 2,
    customer_name: 'Sai Ramesh Kumar',
    customer_email: 'customer@sainaturals.com',
    customer_phone: '+91 98765 43210',
    shipping_name: 'Sai Ramesh Kumar',
    shipping_phone: '+91 98765 43210',
    street_address: 'Flat 302, Sri Sai Enclave, Kaman Main Road',
    landmark: 'Beside Gopal Nagar Bus Stop',
    area: 'Hafeezpet',
    city: 'Hyderabad',
    pincode: '500085',
    subtotal: 1350,
    delivery_fee: 0,
    total_amount: 1350,
    payment_method: 'upi',
    payment_status: 'paid',
    order_status: 'out_for_delivery',
    delivery_slot: 'Morning (8:00 AM - 11:00 AM)',
    created_at: new Date(Date.now() - 2 * 3600000).toISOString(),
    items: [
      {
        id: 1,
        order_id: 101,
        product_id: 1,
        product_name: 'Single-Estate Black Mustard Oil · 1L',
        unit_price: 340,
        quantity: 2,
        total_price: 680
      },
      {
        id: 2,
        order_id: 101,
        product_id: 7,
        product_name: 'A2 Vedic Bilona Gir Cow Cultured Ghee · 500ml',
        unit_price: 670,
        quantity: 1,
        total_price: 670
      }
    ]
  },
  {
    id: 102,
    order_number: 'SSNF-20260908-0102',
    user_id: 3,
    customer_name: 'Pooja Reddy',
    customer_email: 'pooja.reddy@gmail.com',
    customer_phone: '+91 91234 56789',
    shipping_name: 'Pooja Reddy',
    shipping_phone: '+91 91234 56789',
    street_address: 'Villa 14, Silicon Valley Meadows',
    landmark: 'Near Hafeezpet Flyover',
    area: 'Hafeezpet',
    city: 'Hyderabad',
    pincode: '500085',
    subtotal: 820,
    delivery_fee: 0,
    total_amount: 820,
    payment_method: 'cod',
    payment_status: 'pending',
    order_status: 'confirmed',
    delivery_slot: 'Evening (5:00 PM - 8:00 PM)',
    created_at: new Date(Date.now() - 5 * 3600000).toISOString(),
    items: [
      {
        id: 3,
        order_id: 102,
        product_id: 3,
        product_name: 'Wood-Pressed White Sesame Oil (Til Oil) · 1L',
        unit_price: 490,
        quantity: 1,
        total_price: 490
      },
      {
        id: 4,
        order_id: 102,
        product_id: 8,
        product_name: 'Unpolished Organic Toor Dal · 1kg',
        unit_price: 195,
        quantity: 1,
        total_price: 195
      },
      {
        id: 5,
        order_id: 102,
        product_id: 12,
        product_name: 'Wild Multi-Flora Raw Honey · 500g',
        unit_price: 480,
        quantity: 1,
        total_price: 480
      }
    ]
  },
  {
    id: 103,
    order_number: 'SSNF-20260907-0099',
    user_id: 4,
    customer_name: 'Venkat Rao',
    customer_email: 'venkat.rao@outlook.com',
    customer_phone: '+91 99887 76655',
    shipping_name: 'Venkat Rao',
    shipping_phone: '+91 99887 76655',
    street_address: 'Flat 504, Aparna CyberLife',
    landmark: 'Nallagandla Road',
    area: 'Kondapur',
    city: 'Hyderabad',
    pincode: '500084',
    subtotal: 2150,
    delivery_fee: 0,
    total_amount: 2150,
    payment_method: 'upi',
    payment_status: 'paid',
    order_status: 'delivered',
    delivery_slot: 'Morning (8:00 AM - 11:00 AM)',
    created_at: new Date(Date.now() - 26 * 3600000).toISOString(),
    items: [
      {
        id: 6,
        order_id: 103,
        product_id: 2,
        product_name: 'Wood-Pressed Groundnut Oil · 5L Can',
        unit_price: 1750,
        quantity: 1,
        total_price: 1750
      },
      {
        id: 7,
        order_id: 103,
        product_id: 10,
        product_name: 'Organic Guntur Salem Sannam Red Chilli Powder · 500g',
        unit_price: 240,
        quantity: 1,
        total_price: 240
      }
    ]
  },
  {
    id: 104,
    order_number: 'SSNF-20260907-0098',
    user_id: 5,
    customer_name: 'Ananya Sharma',
    customer_email: 'ananya.s@gmail.com',
    customer_phone: '+91 98450 11223',
    shipping_name: 'Ananya Sharma',
    shipping_phone: '+91 98450 11223',
    street_address: 'Plot 88, Shilpa Avenue Colony',
    landmark: 'Behind Sai Baba Temple',
    area: 'Hafeezpet',
    city: 'Hyderabad',
    pincode: '500085',
    subtotal: 580,
    delivery_fee: 0,
    total_amount: 580,
    payment_method: 'upi',
    payment_status: 'paid',
    order_status: 'delivered',
    delivery_slot: 'Afternoon (12:00 PM - 3:00 PM)',
    created_at: new Date(Date.now() - 30 * 3600000).toISOString(),
    items: [
      {
        id: 8,
        order_id: 104,
        product_id: 9,
        product_name: 'Unpolished Whole Moong Dal (Green Gram) · 1kg',
        unit_price: 180,
        quantity: 2,
        total_price: 360
      },
      {
        id: 9,
        order_id: 104,
        product_id: 11,
        product_name: 'Stone-Ground Single-Origin Turmeric Powder · 250g',
        unit_price: 120,
        quantity: 1,
        total_price: 120
      }
    ]
  }
];

export const FALLBACK_ADMIN_CUSTOMERS: Array<any> = [
  {
    id: 2,
    name: 'Sai Ramesh Kumar',
    email: 'customer@sainaturals.com',
    phone: '+91 98765 43210',
    role: 'customer',
    total_orders: 8,
    total_spend: 11450,
    created_at: '2026-06-15T10:00:00.000Z'
  },
  {
    id: 3,
    name: 'Pooja Reddy',
    email: 'pooja.reddy@gmail.com',
    phone: '+91 91234 56789',
    role: 'customer',
    total_orders: 5,
    total_spend: 6820,
    created_at: '2026-07-02T14:30:00.000Z'
  },
  {
    id: 4,
    name: 'Venkat Rao',
    email: 'venkat.rao@outlook.com',
    phone: '+91 99887 76655',
    role: 'customer',
    total_orders: 12,
    total_spend: 24300,
    created_at: '2026-05-18T09:15:00.000Z'
  },
  {
    id: 5,
    name: 'Ananya Sharma',
    email: 'ananya.s@gmail.com',
    phone: '+91 98450 11223',
    role: 'customer',
    total_orders: 3,
    total_spend: 3450,
    created_at: '2026-08-10T16:45:00.000Z'
  }
];

export const FALLBACK_ADMIN_SALES_REPORT = {
  totalRevenue: 64850,
  totalOrders: 42,
  averageOrderValue: 1544,
  paymentSplit: {
    upi: 48200,
    cod: 16650
  },
  dailySales: [
    { date: '02 Sep', amount: 8400 },
    { date: '03 Sep', amount: 9200 },
    { date: '04 Sep', amount: 7650 },
    { date: '05 Sep', amount: 11300 },
    { date: '06 Sep', amount: 12500 },
    { date: '07 Sep', amount: 9400 },
    { date: '08 Sep', amount: 6400 }
  ]
};

export const FALLBACK_ADMIN_STATS = {
  totalRevenue: 64850,
  totalOrders: 42,
  totalCustomers: 18,
  lowStockCount: 2,
  recentOrders: FALLBACK_ADMIN_ORDERS,
  topProducts: FALLBACK_PRODUCTS.slice(0, 5).map((p, idx) => ({
    id: p.id,
    name: p.name,
    image_url: p.image_url,
    price: p.price,
    discount_price: p.discount_price,
    stock_quantity: p.stock_quantity,
    total_sold: 38 - idx * 6
  }))
};

