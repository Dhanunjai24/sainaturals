const bcrypt = require('bcryptjs');

async function getSeedData() {
  const adminPasswordHash = await bcrypt.hash('Admin@123', 10);
  const customerPasswordHash = await bcrypt.hash('Customer@123', 10);

  const categories = [
    {
      id: 1,
      name: 'Wood-Pressed Oils',
      local_name: 'గానుగ నూనెలు (Ganuga Nunelu)',
      slug: 'wood-pressed-oils',
      description: 'Traditional kachi ghani wood-pressed oils extracted at low temperatures with zero chemicals or heat.',
      icon: 'Droplet',
      image_url: '/images/sesame-oil-shelf-1l.jpeg',
      display_order: 1
    },
    {
      id: 2,
      name: 'Desi Ghee & Butter',
      local_name: 'స్వచ్ఛమైన ఆవు నెయ్యి (Desi Cow Ghee)',
      slug: 'desi-ghee',
      description: 'A2 Vedic Bilona cultured ghee prepared using curd churning method from free-grazing Gir cows.',
      icon: 'Milk',
      image_url: '/images/ghee.jpg',
      display_order: 2
    },
    {
      id: 3,
      name: 'Organic Dals & Pulses',
      local_name: 'సేంద్రీయ పప్పులు (Organic Pappulu)',
      slug: 'organic-pulses',
      description: 'Unpolished, pesticide-free dals sourced directly from certified organic farmer collectives.',
      icon: 'Wheat',
      image_url: '/images/pulses.jpg',
      display_order: 3
    },
    {
      id: 4,
      name: 'Natural Spices & Masalas',
      local_name: 'సహజ మసాలాలు (Natural Masalalu)',
      slug: 'natural-spices',
      description: 'Stone-ground whole spices with rich aroma, natural essential oils, and zero adulteration.',
      icon: 'Flame',
      image_url: '/images/spices.jpg',
      display_order: 4
    },
    {
      id: 5,
      name: 'Raw Forest Honey & Jaggery',
      local_name: 'స్వచ్ఛమైన అడవి తేనె & బెల్లం',
      slug: 'raw-honey-jaggery',
      description: 'Unheated, unfiltered wild multi-flora honey and organic chemical-free cane jaggery.',
      icon: 'Heart',
      image_url: '/images/honey.jpg',
      display_order: 5
    }
  ];

  const products = [
    {
      id: 1,
      category_id: 1,
      name: 'Wood-Pressed Mustard Oil (Kachi Ghani)',
      local_name: 'ఆవ నూనె (Aava Nune)',
      slug: 'wood-pressed-mustard-oil-5l',
      description: 'Freshly pressed on clean wooden kolhu machines right at our Hafeezpet store. Strong pungent aroma, rich in omega-3 and natural antioxidants. Zero heat used.',
      price: 1450,
      discount_price: 1320,
      stock_quantity: 28,
      unit: '5 Litre Tin',
      image_url: '/images/mustard-oil.jpg',
      is_featured: true,
      is_active: true,
      rating: 4.9,
      review_count: 34
    },
    {
      id: 2,
      category_id: 1,
      name: 'Wood-Pressed Mustard Oil (Bottle)',
      local_name: 'ఆవ నూనె (Aava Nune)',
      slug: 'wood-pressed-mustard-oil-1l',
      description: 'Single-source yellow & black mustard seeds crushed at low RPM. Best for everyday cooking, immunity, and traditional Indian pickles.',
      price: 290,
      discount_price: 260,
      stock_quantity: 45,
      unit: '1 Litre Bottle',
      image_url: '/images/mustard-oil.jpg',
      is_featured: false,
      is_active: true,
      rating: 4.8,
      review_count: 19
    },
    {
      id: 3,
      category_id: 1,
      name: 'Wood-Pressed Groundnut Oil (Lakdi Ghana First Press)',
      local_name: 'వేరుశనగ నూనె (Verusenaga Nune)',
      slug: 'wood-pressed-groundnut-oil-5l',
      description: 'Golden, sweet-nutty wood-pressed virgin groundnut oil from heirloom Saurashtra seeds in a convenient 2.6kg can. High smoke point for Indian cooking.',
      price: 1114,
      discount_price: 999,
      stock_quantity: 32,
      unit: '2.6 kg Can',
      image_url: '/images/groundnut-oil-2-5kg.jpeg',
      is_featured: true,
      is_active: true,
      rating: 4.9,
      review_count: 42
    },
    {
      id: 4,
      category_id: 1,
      name: 'Wood-Pressed Sunflower Oil (Pure Cold Pressed)',
      local_name: 'పొద్దుతిరుగుడు నూనె (Sunflower Oil)',
      slug: 'wood-pressed-sunflower-oil-1l',
      description: '100% pure wood cold-pressed sunflower oil extracted fresh at room temperature. Natural vitamin E, delicate sweet nutty aroma, excellent for healthy daily cooking.',
      price: 450,
      discount_price: 399,
      stock_quantity: 60,
      unit: '1 Litre Bottle',
      image_url: '/images/sunflower-oil-1l.jpeg',
      is_featured: false,
      is_active: true,
      rating: 4.8,
      review_count: 22
    },
    {
      id: 5,
      category_id: 1,
      name: 'Wood-Pressed Sesame / Gingelly Oil (Pure Wood Cold Pressed)',
      local_name: 'నువ్వుల నూనె (Nuvvula Nune)',
      slug: 'wood-pressed-sesame-oil-1l',
      description: '100% wood cold-pressed sesame oil extracted with organic seeds and palm jaggery. Rich in calcium and iron. Perfect for dosas, idli podi, and oil pulling.',
      price: 550,
      discount_price: 490,
      stock_quantity: 24,
      unit: '1 Litre Bottle',
      image_url: '/images/sesame-oil-1l.jpeg',
      is_featured: true,
      is_active: true,
      rating: 4.9,
      review_count: 18
    },
    {
      id: 6,
      category_id: 1,
      name: 'Cold-Pressed Virgin Coconut Oil',
      local_name: 'కొబ్బరి నూనె (Kobbari Nune)',
      slug: 'cold-pressed-coconut-oil-1l',
      description: 'Extracted from sun-dried organic sulphur-free copra. 100% pure food-grade oil suitable for cooking, hair nourishment, and baby massage.',
      price: 420,
      discount_price: 380,
      stock_quantity: 35,
      unit: '1 Litre Bottle',
      image_url: '/images/oils-collection.jpg',
      is_featured: false,
      is_active: true,
      rating: 4.9,
      review_count: 27
    },
    {
      id: 7,
      category_id: 2,
      name: 'A2 Gir Cow Cultured Bilona Ghee',
      local_name: 'గిర్ ఆవు స్వచ్ఛమైన నెయ్యి',
      slug: 'a2-gir-cow-bilona-ghee-1l',
      description: 'Hand-churned from cultured whole milk curd using wooden bilona churners. Golden granular texture, delightful aroma, easy to digest and packed with natural CLA.',
      price: 2100,
      discount_price: 1899,
      stock_quantity: 18,
      unit: '1 Litre Glass Jar',
      image_url: '/images/ghee.jpg',
      is_featured: true,
      is_active: true,
      rating: 5.0,
      review_count: 51
    },
    {
      id: 8,
      category_id: 2,
      name: 'A2 Gir Cow Cultured Bilona Ghee (500ml)',
      local_name: 'గిర్ ఆవు స్వచ్ఛమైన నెయ్యి',
      slug: 'a2-gir-cow-bilona-ghee-500ml',
      description: 'Pure Vedic bilona cow ghee in a handy 500ml glass jar. Made by slow heating white makkhan on cow dung cake fire.',
      price: 940,
      discount_price: 849,
      stock_quantity: 25,
      unit: '500ml Glass Jar',
      image_url: '/images/desi-cow-ghee-500ml.jpeg',
      is_featured: false,
      is_active: true,
      rating: 4.9,
      review_count: 29
    },
    {
      id: 9,
      category_id: 3,
      name: 'Unpolished Organic Toor Dal',
      local_name: 'సేంద్రీయ కందిపప్పు (Kandi Pappu)',
      slug: 'unpolished-organic-toor-dal-1kg',
      description: 'Locally grown Desi toor dal, completely unpolished without any oil or water processing. Cooks faster, tastes authentic, and preserves fiber.',
      price: 195,
      discount_price: 175,
      stock_quantity: 50,
      unit: '1 kg Pack',
      image_url: '/images/pulses.jpg',
      is_featured: true,
      is_active: true,
      rating: 4.8,
      review_count: 16
    },
    {
      id: 10,
      category_id: 3,
      name: 'Organic Green Gram / Moong Dal (Split)',
      local_name: 'పెసర పప్పు (Pesara Pappu)',
      slug: 'organic-moong-dal-1kg',
      description: 'Nutrient-rich split yellow moong dal. Easily digestible, high protein staple for kichdi, rasam, and traditional dal recipes.',
      price: 175,
      discount_price: 160,
      stock_quantity: 40,
      unit: '1 kg Pack',
      image_url: '/images/pulses.jpg',
      is_featured: false,
      is_active: true,
      rating: 4.7,
      review_count: 14
    },
    {
      id: 11,
      category_id: 4,
      name: 'Whole Stone-Ground Turmeric Powder',
      local_name: 'సేంద్రీయ పసుపు (Pasupu)',
      slug: 'stone-ground-turmeric-powder-500g',
      description: 'High curcumin (above 4.5%) Salem variety turmeric roots stone ground to preserve essential aroma and medicinal potency.',
      price: 190,
      discount_price: 170,
      stock_quantity: 30,
      unit: '500g Pouch',
      image_url: '/images/spices.jpg',
      is_featured: true,
      is_active: true,
      rating: 4.9,
      review_count: 23
    },
    {
      id: 12,
      category_id: 4,
      name: 'Stone-Pounded Guntur Red Chilli Powder',
      local_name: 'గుంటూరు కారం పొడి (Karam Podi)',
      slug: 'guntur-red-chilli-powder-500g',
      description: 'Traditional cold-pounded stemless Guntur Sannam chillies. Vibrant red natural color with zero added colors or fillers.',
      price: 220,
      discount_price: 195,
      stock_quantity: 35,
      unit: '500g Pouch',
      image_url: '/images/spices.jpg',
      is_featured: false,
      is_active: true,
      rating: 4.8,
      review_count: 19
    },
    {
      id: 13,
      category_id: 5,
      name: 'Pure Raw Forest Multiflora Honey (250g)',
      local_name: 'స్వచ్ఛమైన కొండ తేనె (Wild Honey)',
      slug: 'wild-forest-raw-honey-1kg',
      description: 'Collected by tribal honey hunters from dense Eastern Ghats forests. Never pasteurized or heated. Contains natural bee pollen and enzymes.',
      price: 150,
      discount_price: 135,
      stock_quantity: 20,
      unit: '250g Glass Jar',
      image_url: '/images/pure-honey-250g.jpeg',
      is_featured: true,
      is_active: true,
      rating: 4.9,
      review_count: 38
    },
    {
      id: 14,
      category_id: 5,
      name: 'Organic Chemical-Free Jaggery Powder',
      local_name: 'నాటు బెల్లం పొడి (Natu Bellam)',
      slug: 'organic-jaggery-powder-1kg',
      description: 'Made from sun-ripened organic sugarcane without chemical bleaches or hydros. Perfect healthy alternative to refined white sugar.',
      price: 140,
      discount_price: 125,
      stock_quantity: 45,
      unit: '1 kg Pack',
      image_url: '/images/honey.jpg',
      is_featured: false,
      is_active: true,
      rating: 4.8,
      review_count: 15
    },
    {
      id: 15,
      category_id: 1,
      name: 'Wood-Pressed Sesame / Gingelly Oil (5L Can)',
      local_name: 'నువ్వుల నూనె 5L (Nuvvula Nune)',
      slug: 'wood-pressed-sesame-oil-5l',
      description: '100% pure wood cold pressed sesame oil in a 5L family value can. Extracted on wooden kolhu machines with zero chemicals or high heat.',
      price: 2750,
      discount_price: 2499,
      stock_quantity: 15,
      unit: '5 Litre Can',
      image_url: '/images/sesame-oil-5l.jpeg',
      is_featured: true,
      is_active: true,
      rating: 5.0,
      review_count: 24
    },
    {
      id: 16,
      category_id: 1,
      name: 'Wood-Pressed Sunflower Oil (2.6kg Can)',
      local_name: 'పొద్దుతిరుగుడు నూనె 2.6kg (Sunflower Oil)',
      slug: 'wood-pressed-sunflower-oil-2-6kg',
      description: '100% pure wood cold pressed sunflower oil in a 2.6kg value can. Ambient room temperature pressing preserves natural plant phytosterols.',
      price: 1235,
      discount_price: 1120,
      stock_quantity: 20,
      unit: '2.6 kg Can',
      image_url: '/images/sunflower-oil-2-5kg.jpeg',
      is_featured: true,
      is_active: true,
      rating: 4.9,
      review_count: 31
    },
    {
      id: 17,
      category_id: 2,
      name: 'Pure Desi Cow Ghee (250g Jar)',
      local_name: 'స్వచ్ఛమైన ఆవు నెయ్యి (Pure Cow Ghee)',
      slug: 'pure-desi-cow-ghee-250g',
      description: '100% pure wood-churned Desi cow ghee in a convenient 250g glass jar. Traditional golden aroma and grainy texture.',
      price: 290,
      discount_price: 260,
      stock_quantity: 35,
      unit: '250g Glass Jar',
      image_url: '/images/pure-ghee-250g.jpeg',
      is_featured: false,
      is_active: true,
      rating: 4.9,
      review_count: 18
    }
  ];

  const coupons = [
    {
      id: 1,
      code: 'WELCOME50',
      description: '₹50 flat discount on your first order above ₹300',
      discount_type: 'fixed',
      discount_value: 50,
      min_order_amount: 300,
      max_discount: 50,
      valid_until: '2027-12-31T23:59:59Z',
      max_uses: 1000,
      used_count: 4,
      is_active: true
    },
    {
      id: 2,
      code: 'SAI10',
      description: '10% discount on all natural groceries (Up to ₹200 off)',
      discount_type: 'percent',
      discount_value: 10,
      min_order_amount: 500,
      max_discount: 200,
      valid_until: '2027-12-31T23:59:59Z',
      max_uses: 500,
      used_count: 12,
      is_active: true
    },
    {
      id: 3,
      code: 'BULKOIL15',
      description: '15% instant discount on orders above ₹1,500 (Max ₹500 off)',
      discount_type: 'percent',
      discount_value: 15,
      min_order_amount: 1500,
      max_discount: 500,
      valid_until: '2027-12-31T23:59:59Z',
      max_uses: 200,
      used_count: 21,
      is_active: true
    }
  ];

  const banners = [
    {
      id: 1,
      title: 'Fresh Wood-Pressed Oils',
      subtitle: 'Watch it pressed live at our Hafeezpet store. 100% Pure Kachi Ghani Mustard, Groundnut & Sesame Oils.',
      badge: 'Bestseller ⭐ 4.9 Rating',
      image_url: '/images/sesame-oil-shelf-1l.jpeg',
      link_url: '/products?category=wood-pressed-oils',
      display_order: 1,
      is_active: true
    },
    {
      id: 2,
      title: 'A2 Vedic Bilona Desi Cow Ghee',
      subtitle: 'Cultured curd churned with wooden bilona. Golden granular goodness for your family.',
      badge: '100% Pure Vedic Tradition',
      image_url: '/images/ghee.jpg',
      link_url: '/products?category=desi-ghee',
      display_order: 2,
      is_active: true
    },
    {
      id: 3,
      title: 'Monthly Organic Kitchen Saver',
      subtitle: 'Unpolished Dals, Raw Forest Honey & Stone-Ground Spices delivered to your doorstep.',
      badge: 'Free Delivery on ₹500+',
      image_url: '/images/pulses.jpg',
      link_url: '/products',
      display_order: 3,
      is_active: true
    }
  ];

  const users = [
    {
      id: 1,
      name: 'Store Administrator',
      email: 'admin@sainaturals.com',
      phone: '+91 77995 49977',
      password_hash: adminPasswordHash,
      role: 'admin'
    },
    {
      id: 2,
      name: 'Ramesh Kumar',
      email: 'customer@sainaturals.com',
      phone: '+91 98765 43210',
      password_hash: customerPasswordHash,
      role: 'customer'
    }
  ];

  const addresses = [
    {
      id: 1,
      user_id: 2,
      full_name: 'Ramesh Kumar',
      phone: '+91 98765 43210',
      street_address: 'Flat 302, Sri Sai Enclave, Kaman Main Road',
      landmark: 'Near Gopal Nagar Bus Stop',
      area: 'Hafeezpet',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500085',
      address_type: 'Home',
      is_default: true
    }
  ];

  const reviews = [
    {
      id: 1,
      product_id: 1,
      user_id: 2,
      rating: 5,
      title: 'Best mustard oil in Hyderabad',
      comment: 'Authentic strong pungent aroma. You can even see the oil being pressed live in the shop. High quality!',
      status: 'approved'
    },
    {
      id: 2,
      product_id: 7,
      user_id: 2,
      rating: 5,
      title: 'Pure aroma like village ghee',
      comment: 'The granules and aroma take me back to my native village. Excellent bilona ghee.',
      status: 'approved'
    }
  ];

  return { categories, products, coupons, banners, users, addresses, reviews };
}

module.exports = { getSeedData };
