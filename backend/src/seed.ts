/**
 * Seed script — populates the products collection with ~50 realistic Nigerian
 * grocery and household products.
 *
 * Idempotent: deletes all existing products before inserting.
 * Run with:  npm run seed
 */

import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { config } from './config/env';
import { Product } from './models/Product';
import { generateSlug } from './utils/slugify';

interface SeedProduct {
  name: string;
  price: number;
  image: string;
  unit: string;
  description: string;
  category: string;
  stock: number;
}

const productData: SeedProduct[] = [
  // ── Grains & Cereals ──────────────────────────────────────────────────────
  {
    name: 'Long Grain Parboiled Rice',
    price: 50000,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop&auto=format',
    unit: '50kg',
    description: 'Premium long grain parboiled rice — perfect for jollof, fried rice, and white rice.',
    category: 'grains',
    stock: 120,
  },
  {
    name: 'African King Rice',
    price: 54000,
    image: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=400&h=400&fit=crop&auto=format',
    unit: '50kg',
    description: 'Locally processed African King parboiled rice. Great texture and aroma when cooked.',
    category: 'grains',
    stock: 95,
  },
  {
    name: 'Ofada Rice',
    price: 35000,
    image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&h=400&fit=crop&auto=format',
    unit: '25kg',
    description: 'Authentic locally grown Nigerian Ofada rice with a distinctive nutty flavour.',
    category: 'grains',
    stock: 60,
  },
  {
    name: 'Basmati Rice',
    price: 18000,
    image: 'https://images.unsplash.com/photo-1604833611936-44a33e671f6e?w=400&h=400&fit=crop&auto=format',
    unit: '5kg',
    description: 'Aromatic long-grain basmati rice, ideal for special occasions and pilaf dishes.',
    category: 'grains',
    stock: 80,
  },
  {
    name: 'Brown Rice',
    price: 14000,
    image: 'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=400&h=400&fit=crop&auto=format',
    unit: '5kg',
    description: 'Wholegrain brown rice — high in fibre and nutrients, great for health-conscious households.',
    category: 'grains',
    stock: 55,
  },
  {
    name: 'Yellow Garri',
    price: 12000,
    image: 'https://images.unsplash.com/photo-1567768509773-ccfe8f8b3944?w=400&h=400&fit=crop&auto=format',
    unit: '10kg',
    description: 'Crispy yellow garri made from palm-oil infused cassava. Perfect for eba and soaking.',
    category: 'grains',
    stock: 150,
  },
  {
    name: 'White Garri',
    price: 10000,
    image: 'https://images.unsplash.com/photo-1567768509773-ccfe8f8b3944?w=400&h=400&fit=crop&auto=format',
    unit: '10kg',
    description: 'Fine white garri from cassava — great for eba, soaking, or garri fritters.',
    category: 'grains',
    stock: 140,
  },
  {
    name: 'Semovita',
    price: 8500,
    image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=400&fit=crop&auto=format',
    unit: '2kg',
    description: 'Smooth semovita flour — makes the perfect swallow to pair with any Nigerian soup.',
    category: 'grains',
    stock: 200,
  },
  {
    name: 'Wheat Flour (All Purpose)',
    price: 9000,
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=400&fit=crop&auto=format',
    unit: '5kg',
    description: 'Premium all-purpose wheat flour for baking, frying, and thickening sauces.',
    category: 'grains',
    stock: 180,
  },
  {
    name: 'Akamu (Corn Flour)',
    price: 6000,
    image: 'https://images.unsplash.com/photo-1631209121750-a9f656d28f35?w=400&h=400&fit=crop&auto=format',
    unit: '1kg',
    description: 'Finely ground corn flour for making smooth pap (ogi) — a nutritious breakfast favourite.',
    category: 'grains',
    stock: 100,
  },

  // ── Vegetables ────────────────────────────────────────────────────────────
  {
    name: 'Okra',
    price: 20000,
    image: 'https://images.unsplash.com/photo-1591165703745-2d5097e2c6a0?w=400&h=400&fit=crop&auto=format',
    unit: '1kg',
    description: 'Fresh and tender okra pods, perfect for okra soup and stews.',
    category: 'vegetables',
    stock: 75,
  },
  {
    name: 'Ugu (Fluted Pumpkin Leaves)',
    price: 8000,
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=400&fit=crop&auto=format',
    unit: 'bunch',
    description: 'Fresh fluted pumpkin leaves — essential for egusi soup, edikang ikong, and stews.',
    category: 'vegetables',
    stock: 50,
  },
  {
    name: 'Onions',
    price: 15000,
    image: 'https://images.unsplash.com/photo-1510627498534-cf7e9002facc?w=400&h=400&fit=crop&auto=format',
    unit: '3kg',
    description: 'Fresh yellow onions — an essential base for virtually every Nigerian dish.',
    category: 'vegetables',
    stock: 200,
  },
  {
    name: 'Tomatoes',
    price: 18000,
    image: 'https://images.unsplash.com/photo-1546470427-e2a36e57b7e1?w=400&h=400&fit=crop&auto=format',
    unit: '3kg',
    description: 'Ripe, juicy red tomatoes. Perfect for stews, jollof rice, and sauces.',
    category: 'vegetables',
    stock: 90,
  },
  {
    name: 'Garden Egg',
    price: 7500,
    image: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400&h=400&fit=crop&auto=format',
    unit: '500g',
    description: 'Fresh garden eggs — great for garden-egg sauce, stews, and as a healthy snack.',
    category: 'vegetables',
    stock: 65,
  },
  {
    name: 'Bitter Leaf (Onugbu)',
    price: 5000,
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=400&fit=crop&auto=format',
    unit: '200g',
    description: 'Fresh bitter leaf for ofe onugbu (bitter-leaf soup) and other traditional soups.',
    category: 'vegetables',
    stock: 40,
  },
  {
    name: 'Cabbage',
    price: 12000,
    image: 'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=400&h=400&fit=crop&auto=format',
    unit: '1 head',
    description: 'Large fresh cabbage head — ideal for coleslaw, stir-fry, and Nigerian pepper soup.',
    category: 'vegetables',
    stock: 55,
  },
  {
    name: 'Water Leaf (Talinum)',
    price: 6000,
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=400&fit=crop&auto=format',
    unit: '500g',
    description: 'Tender water leaf for edikang ikong soup and other leafy vegetable dishes.',
    category: 'vegetables',
    stock: 45,
  },

  // ── Peppers ───────────────────────────────────────────────────────────────
  {
    name: 'Rodo Pepper (Tatashe)',
    price: 92000,
    image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400&h=400&fit=crop&auto=format',
    unit: '3kg',
    description: 'Bright red tatashe (rodo) peppers — essential for jollof rice, stews, and sauces.',
    category: 'peppers',
    stock: 70,
  },
  {
    name: 'Bell Pepper',
    price: 27500,
    image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400&h=400&fit=crop&auto=format',
    unit: '1kg',
    description: 'Colourful mixed bell peppers — adds sweetness and colour to any dish.',
    category: 'peppers',
    stock: 80,
  },
  {
    name: 'Scotch Bonnet (Habanero)',
    price: 45000,
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=400&fit=crop&auto=format',
    unit: '1kg',
    description: 'Fiery scotch bonnet peppers — the backbone of Nigerian pepper sauces and stews.',
    category: 'peppers',
    stock: 90,
  },
  {
    name: 'Cayenne Pepper (Dried)',
    price: 22000,
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=400&fit=crop&auto=format',
    unit: '500g',
    description: 'Dried and ground cayenne pepper — adds intense heat to soups and marinades.',
    category: 'peppers',
    stock: 110,
  },
  {
    name: 'Dry Tatashe (Ground)',
    price: 38000,
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=400&fit=crop&auto=format',
    unit: '1kg',
    description: 'Sun-dried and ground tatashe pepper — convenience and flavour in one pack.',
    category: 'peppers',
    stock: 65,
  },
  {
    name: 'Black Pepper (Ground)',
    price: 14000,
    image: 'https://images.unsplash.com/photo-1588421357574-87938a86fa28?w=400&h=400&fit=crop&auto=format',
    unit: '200g',
    description: 'Finely ground black pepper — a universal seasoning for all savoury dishes.',
    category: 'peppers',
    stock: 150,
  },

  // ── Fish & Protein ────────────────────────────────────────────────────────
  {
    name: 'K&O Smoked Fish',
    price: 9500,
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&h=400&fit=crop&auto=format',
    unit: '500g',
    description: 'Premium quality smoked fish — adds deep flavour to soups and stews.',
    category: 'fish & protein',
    stock: 120,
  },
  {
    name: 'Stockfish (Panla)',
    price: 45000,
    image: 'https://images.unsplash.com/photo-1534482421-64566f976cfa?w=400&h=400&fit=crop&auto=format',
    unit: '1kg',
    description: 'Norwegian stockfish — a cherished ingredient in ofe onugbu and other Nigerian soups.',
    category: 'fish & protein',
    stock: 55,
  },
  {
    name: 'Dried Crayfish (Ground)',
    price: 18000,
    image: 'https://images.unsplash.com/photo-1587334207407-e6e8ee0d7dc0?w=400&h=400&fit=crop&auto=format',
    unit: '200g',
    description: 'Ground dried crayfish — an indispensable seasoning in virtually every Nigerian soup.',
    category: 'fish & protein',
    stock: 200,
  },
  {
    name: 'Mackerel (Titus) Fish',
    price: 22000,
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&h=400&fit=crop&auto=format',
    unit: '1kg',
    description: 'Fresh Atlantic mackerel (titus) — popular for frying, grilling, and pepper soup.',
    category: 'fish & protein',
    stock: 80,
  },
  {
    name: 'Smoked Catfish',
    price: 35000,
    image: 'https://images.unsplash.com/photo-1534482421-64566f976cfa?w=400&h=400&fit=crop&auto=format',
    unit: '500g',
    description: 'Whole smoked catfish — perfect for catfish pepper soup and palm-oil-based soups.',
    category: 'fish & protein',
    stock: 65,
  },
  {
    name: 'Dried Prawns',
    price: 25000,
    image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400&h=400&fit=crop&auto=format',
    unit: '200g',
    description: 'Sun-dried prawns — an aromatic umami booster for soups, stews, and rice dishes.',
    category: 'fish & protein',
    stock: 90,
  },
  {
    name: 'Ponmo (Cow Skin)',
    price: 12000,
    image: 'https://images.unsplash.com/photo-1607305387299-a3d9611cd469?w=400&h=400&fit=crop&auto=format',
    unit: '500g',
    description: 'Pre-cooked and sliced ponmo — adds texture to soups, stews, and jollof rice.',
    category: 'fish & protein',
    stock: 75,
  },
  {
    name: 'Assorted Meat (Frozen)',
    price: 55000,
    image: 'https://images.unsplash.com/photo-1607305387299-a3d9611cd469?w=400&h=400&fit=crop&auto=format',
    unit: '2kg',
    description: 'Mixed assorted meat cuts — ideal for pepper soup, stews, and special occasions.',
    category: 'fish & protein',
    stock: 45,
  },

  // ── Household Supplies ────────────────────────────────────────────────────
  {
    name: '2Sure Original Dish Washing Liquid',
    price: 34000,
    image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=400&fit=crop&auto=format',
    unit: '1000ml',
    description: 'Powerful 2Sure dish washing liquid — cuts through grease and leaves dishes sparkling.',
    category: 'household',
    stock: 180,
  },
  {
    name: '2Sure Fresh Lemon Dish Liquid',
    price: 25000,
    image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=400&fit=crop&auto=format',
    unit: '500ml',
    description: 'Refreshing lemon-scented dish liquid — effective cleaning with a citrus freshness.',
    category: 'household',
    stock: 160,
  },
  {
    name: 'Omo Detergent',
    price: 28000,
    image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=400&h=400&fit=crop&auto=format',
    unit: '3kg',
    description: 'Omo active laundry detergent — tough on stains, gentle on fabrics.',
    category: 'household',
    stock: 150,
  },
  {
    name: 'Ariel Washing Powder',
    price: 32000,
    image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=400&h=400&fit=crop&auto=format',
    unit: '2.5kg',
    description: 'Ariel professional-grade washing powder with stain-fighting enzymes.',
    category: 'household',
    stock: 130,
  },
  {
    name: 'Morning Fresh Dish Soap',
    price: 22000,
    image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=400&fit=crop&auto=format',
    unit: '750ml',
    description: 'Morning Fresh concentrated dish soap — effective on oil and grease.',
    category: 'household',
    stock: 140,
  },
  {
    name: 'Izal Disinfectant',
    price: 15000,
    image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=400&h=400&fit=crop&auto=format',
    unit: '750ml',
    description: 'Classic Izal pine disinfectant — kills germs on floors and surfaces effectively.',
    category: 'household',
    stock: 200,
  },
  {
    name: 'Dettol Antiseptic Liquid',
    price: 18000,
    image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=400&h=400&fit=crop&auto=format',
    unit: '500ml',
    description: 'Trusted Dettol antiseptic — protects against 99.9% of bacteria and germs.',
    category: 'household',
    stock: 175,
  },
  {
    name: 'Air Freshener (Lavender)',
    price: 12000,
    image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=400&h=400&fit=crop&auto=format',
    unit: '300ml',
    description: 'Long-lasting lavender air freshener — keeps your home smelling fresh all day.',
    category: 'household',
    stock: 100,
  },

  // ── Condiments & Cooking Essentials ───────────────────────────────────────
  {
    name: 'Maggi Seasoning Cubes',
    price: 8000,
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=400&fit=crop&auto=format',
    unit: '100 cubes',
    description: 'Classic Maggi seasoning cubes — the go-to flavour enhancer for Nigerian cooking.',
    category: 'condiments',
    stock: 300,
  },
  {
    name: 'Knorr Chicken Cubes',
    price: 6500,
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=400&fit=crop&auto=format',
    unit: '50 cubes',
    description: 'Knorr chicken-flavoured seasoning cubes — rich taste for soups, stews, and rice.',
    category: 'condiments',
    stock: 280,
  },
  {
    name: 'Cameroon Pepper (Ground)',
    price: 9000,
    image: 'https://images.unsplash.com/photo-1588421357574-87938a86fa28?w=400&h=400&fit=crop&auto=format',
    unit: '100g',
    description: 'Authentic ground Cameroon pepper — adds a unique smoky heat to peppersoup and stews.',
    category: 'condiments',
    stock: 120,
  },
  {
    name: 'Ogiri (Locust Bean)',
    price: 5500,
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=400&fit=crop&auto=format',
    unit: '100g',
    description: 'Fermented locust beans — a traditional condiment that deepens the flavour of soups.',
    category: 'condiments',
    stock: 80,
  },
  {
    name: 'Red Palm Oil',
    price: 35000,
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=400&fit=crop&auto=format',
    unit: '4L',
    description: 'Pure unrefined red palm oil — the foundation of Nigerian soups and stews.',
    category: 'condiments',
    stock: 160,
  },
  {
    name: 'Groundnut Oil',
    price: 28000,
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=400&fit=crop&auto=format',
    unit: '4L',
    description: 'Refined groundnut (peanut) oil — neutral flavour ideal for frying and cooking.',
    category: 'condiments',
    stock: 140,
  },
  {
    name: 'Egusi (Ground Melon Seeds)',
    price: 22000,
    image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&h=400&fit=crop&auto=format',
    unit: '500g',
    description: 'Pre-ground egusi melon seeds — ready to use in egusi soup. Rich in protein and fat.',
    category: 'condiments',
    stock: 110,
  },
  {
    name: 'Coconut Oil (Virgin)',
    price: 18000,
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=400&fit=crop&auto=format',
    unit: '500ml',
    description: 'Cold-pressed virgin coconut oil — great for cooking, baking, and skincare.',
    category: 'condiments',
    stock: 85,
  },

  // ── Fruits ────────────────────────────────────────────────────────────────
  {
    name: 'Plantain (Unripe)',
    price: 25000,
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop&auto=format',
    unit: 'bunch (~10 fingers)',
    description: 'Fresh unripe plantain — best for boli (roasted plantain) or fried plantain chips.',
    category: 'fruits',
    stock: 90,
  },
  {
    name: 'Ripe Plantain',
    price: 18000,
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop&auto=format',
    unit: 'bunch (~10 fingers)',
    description: 'Sweet ripe plantain — perfect for dodo (fried sweet plantain) and plantain porridge.',
    category: 'fruits',
    stock: 80,
  },
  {
    name: 'Sweet Banana',
    price: 15000,
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop&auto=format',
    unit: 'bunch',
    description: 'Ripe sweet bananas — a nutritious snack packed with potassium and energy.',
    category: 'fruits',
    stock: 70,
  },
  {
    name: 'Pineapple',
    price: 10000,
    image: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=400&h=400&fit=crop&auto=format',
    unit: '1 large',
    description: 'Fresh whole pineapple — sweet, tangy, and packed with vitamin C.',
    category: 'fruits',
    stock: 60,
  },
  {
    name: 'Pawpaw (Papaya)',
    price: 8000,
    image: 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=400&h=400&fit=crop&auto=format',
    unit: '1 medium',
    description: 'Ripe tropical pawpaw — rich in vitamins A and C, great eaten fresh or in smoothies.',
    category: 'fruits',
    stock: 50,
  },
];

async function seed(): Promise<void> {
  console.log('Connecting to MongoDB…');
  await mongoose.connect(config.MONGODB_URI);
  console.log('Connected.\n');

  console.log('Clearing existing products…');
  await Product.deleteMany({});
  console.log('Products collection cleared.\n');

  const products = productData.map((p) => ({
    ...p,
    slug: generateSlug(p.name),
  }));

  console.log(`Inserting ${products.length} products…`);
  await Product.insertMany(products);
  console.log(`\n✓ Seeded ${products.length} products successfully.\n`);

  // Print a quick summary
  const categories = [...new Set(products.map((p) => p.category))];
  console.log('Categories:');
  for (const cat of categories) {
    const count = products.filter((p) => p.category === cat).length;
    console.log(`  ${cat}: ${count} products`);
  }

  await mongoose.disconnect();
  console.log('\nDisconnected from MongoDB. Done!');
}

seed().catch((err: unknown) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
