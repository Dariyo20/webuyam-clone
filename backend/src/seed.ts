/**
 * Seed script — populates the products collection with 100 realistic Nigerian
 * grocery and household products.
 *
 * Idempotent: deletes all existing products before inserting.
 * Run with:  npm run seed
 *
 * Image strategy:
 *   ~50 products → curated Unsplash URLs (known food photo IDs + crop params)
 *   ~50 products → placehold.co branded placeholders (always loads, never 404)
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

// ── Image helpers ─────────────────────────────────────────────────────────────

const u = (id: string) =>
  `https://images.unsplash.com/${id}?w=400&h=400&fit=crop&auto=format`;

const p = (hex: string, name: string) => {
  const text = encodeURIComponent(name.slice(0, 18));
  return `https://placehold.co/400x400/${hex}/ffffff?text=${text}`;
};

// Category placeholder colours
const C = {
  grains:    'b45309',
  peppers:   'b91c1c',
  vegs:      '15803d',
  protein:   '1d4ed8',
  oils:      'a16207',
  beverages: '1e3a8a',
  snacks:    '7c2d12',
  household: '6d28d9',
};

// ── Product data ──────────────────────────────────────────────────────────────

const productData: SeedProduct[] = [

  // ── Grains & Cereals (16) ─────────────────────────────────────────────────
  {
    name: 'Long Grained Rice – Kiara',
    price: 50000,
    image: u('photo-1586201375761-83865001e31c'),
    unit: '50kg',
    description: 'Premium long grain parboiled rice — perfect for jollof, fried rice, and white rice.',
    category: 'grains',
    stock: 120,
  },
  {
    name: 'African King Rice',
    price: 54000,
    image: p(C.grains, 'African King Rice'),
    unit: '50kg',
    description: 'Locally processed African King parboiled rice. Great texture and aroma when cooked.',
    category: 'grains',
    stock: 95,
  },
  {
    name: 'Mama Gold Parboiled Rice',
    price: 28000,
    image: u('photo-1536304993881-ff6e9eefa2a6'),
    unit: '25kg',
    description: 'Mama Gold — Nigeria\'s favourite parboiled rice brand, consistent grain quality.',
    category: 'grains',
    stock: 110,
  },
  {
    name: 'Royal Stallion Rice',
    price: 52000,
    image: p(C.grains, 'Royal Stallion Rice'),
    unit: '50kg',
    description: 'Royal Stallion extra-long grain rice — consistent softness and taste every time.',
    category: 'grains',
    stock: 80,
  },
  {
    name: 'Caprice Parboiled Rice',
    price: 7500,
    image: u('photo-1574484284002-952d92456975'),
    unit: '5kg',
    description: 'Quality parboiled rice in a convenient 5 kg pack — ideal for mid-size households.',
    category: 'grains',
    stock: 150,
  },
  {
    name: 'Ofada Rice',
    price: 6500,
    image: p(C.grains, 'Ofada Rice'),
    unit: '3kg',
    description: 'Authentic locally grown Nigerian Ofada rice with a distinctive nutty flavour.',
    category: 'grains',
    stock: 60,
  },
  {
    name: 'Basmati Rice',
    price: 18000,
    image: u('photo-1604833611936-44a33e671f6e'),
    unit: '5kg',
    description: 'Aromatic long-grain basmati rice, ideal for special occasions and pilaf dishes.',
    category: 'grains',
    stock: 80,
  },
  {
    name: 'Brown Rice',
    price: 14000,
    image: p(C.grains, 'Brown Rice'),
    unit: '5kg',
    description: 'Wholegrain brown rice — high in fibre and nutrients, great for health-conscious households.',
    category: 'grains',
    stock: 55,
  },
  {
    name: 'Yellow Garri (Ijebu)',
    price: 12000,
    image: u('photo-1567768509773-ccfe8f8b3944'),
    unit: '10kg',
    description: 'Crispy yellow garri made from palm-oil infused cassava. Perfect for eba and soaking.',
    category: 'grains',
    stock: 150,
  },
  {
    name: 'White Garri',
    price: 10000,
    image: p(C.grains, 'White Garri'),
    unit: '10kg',
    description: 'Fine white garri from cassava — great for eba, soaking, or garri fritters.',
    category: 'grains',
    stock: 140,
  },
  {
    name: 'Semovita',
    price: 8500,
    image: u('photo-1567620905732-2d1ec7ab7445'),
    unit: '2kg',
    description: 'Smooth semovita flour — makes the perfect swallow to pair with any Nigerian soup.',
    category: 'grains',
    stock: 200,
  },
  {
    name: 'Wheat Flour (All Purpose)',
    price: 9000,
    image: p(C.grains, 'Wheat Flour'),
    unit: '5kg',
    description: 'Premium all-purpose wheat flour for baking, frying, and thickening sauces.',
    category: 'grains',
    stock: 180,
  },
  {
    name: 'Akamu (Corn Flour)',
    price: 6000,
    image: p(C.grains, 'Akamu Corn Flour'),
    unit: '1kg',
    description: 'Finely ground corn flour for making smooth pap (ogi) — a nutritious breakfast favourite.',
    category: 'grains',
    stock: 100,
  },
  {
    name: 'Honey Beans',
    price: 18000,
    image: u('photo-1512621776951-a57141f2eefd'),
    unit: '5kg',
    description: 'Premium honey beans — sweet-tasting and great for porridge, moi-moi, and akara.',
    category: 'grains',
    stock: 90,
  },
  {
    name: 'Brown Beans (Oloyin)',
    price: 16000,
    image: p(C.grains, 'Brown Beans'),
    unit: '5kg',
    description: 'Oloyin brown beans — high in protein, excellent for bean porridge and moi-moi.',
    category: 'grains',
    stock: 85,
  },
  {
    name: 'Soya Beans (Dehulled)',
    price: 9500,
    image: p(C.grains, 'Soya Beans'),
    unit: '2kg',
    description: 'Dehulled soya beans — high-protein base for soy milk, tofu, and baby food.',
    category: 'grains',
    stock: 70,
  },

  // ── Peppers (10) ──────────────────────────────────────────────────────────
  {
    name: 'Rodo Pepper (Tatashe)',
    price: 22000,
    image: u('photo-1525607551862-4d197d17c50a'),
    unit: '1kg',
    description: 'Bright red tatashe (rodo) peppers — essential for jollof rice, stews, and sauces.',
    category: 'peppers',
    stock: 70,
  },
  {
    name: 'Bell Pepper (Mixed)',
    price: 27500,
    image: u('photo-1563565375-f3fdfdbefa83'),
    unit: '1kg',
    description: 'Colourful mixed bell peppers — adds sweetness and colour to any dish.',
    category: 'peppers',
    stock: 80,
  },
  {
    name: 'Scotch Bonnet (Habanero)',
    price: 18000,
    image: u('photo-1518977676601-b53f82aba655'),
    unit: '500g',
    description: 'Fiery scotch bonnet peppers — the backbone of Nigerian pepper sauces and stews.',
    category: 'peppers',
    stock: 90,
  },
  {
    name: 'Shombo Pepper',
    price: 15000,
    image: p(C.peppers, 'Shombo Pepper'),
    unit: '1kg',
    description: 'Long red shombo peppers — medium heat with a fruity flavour, ideal for stews.',
    category: 'peppers',
    stock: 75,
  },
  {
    name: 'Atarodo (Bird\'s Eye Chilli)',
    price: 12000,
    image: p(C.peppers, 'Atarodo Chilli'),
    unit: '200g',
    description: 'Tiny but intensely hot atarodo — a staple in Nigerian pepper sauce.',
    category: 'peppers',
    stock: 100,
  },
  {
    name: 'Cayenne Pepper (Dried Ground)',
    price: 9500,
    image: p(C.peppers, 'Cayenne Pepper'),
    unit: '500g',
    description: 'Dried and ground cayenne pepper — adds intense heat to soups and marinades.',
    category: 'peppers',
    stock: 110,
  },
  {
    name: 'Dry Tatashe (Ground)',
    price: 14000,
    image: u('photo-1596040033229-a9821ebd058d'),
    unit: '1kg',
    description: 'Sun-dried and ground tatashe pepper — convenience and flavour in one pack.',
    category: 'peppers',
    stock: 65,
  },
  {
    name: 'Black Pepper (Ground)',
    price: 8500,
    image: p(C.peppers, 'Black Pepper'),
    unit: '200g',
    description: 'Finely ground black pepper — a universal seasoning for all savoury dishes.',
    category: 'peppers',
    stock: 150,
  },
  {
    name: 'Suya Pepper Spice Mix',
    price: 7500,
    image: p(C.peppers, 'Suya Spice Mix'),
    unit: '100g',
    description: 'Authentic suya spice blend — yaji, groundnut, and chilli for perfect suya.',
    category: 'peppers',
    stock: 120,
  },
  {
    name: 'Fresh Green Pepper',
    price: 10000,
    image: u('photo-1598511796432-32a96e07e086'),
    unit: '500g',
    description: 'Crisp fresh green peppers — mild heat and fresh flavour for stir-fries and soups.',
    category: 'peppers',
    stock: 85,
  },

  // ── Vegetables (14) ──────────────────────────────────────────────────────
  {
    name: 'Okra',
    price: 8000,
    image: u('photo-1591165703745-2d5097e2c6a0'),
    unit: '1kg',
    description: 'Fresh and tender okra pods, perfect for okra soup and stews.',
    category: 'vegetables',
    stock: 75,
  },
  {
    name: 'Ugu (Fluted Pumpkin Leaves)',
    price: 5000,
    image: u('photo-1540420773420-3366772f4999'),
    unit: '500g',
    description: 'Fresh fluted pumpkin leaves — essential for egusi soup, edikang ikong, and stews.',
    category: 'vegetables',
    stock: 50,
  },
  {
    name: 'Red Onions',
    price: 15000,
    image: u('photo-1510627498534-cf7e9002facc'),
    unit: '3kg',
    description: 'Fresh red onions — an essential base for virtually every Nigerian dish.',
    category: 'vegetables',
    stock: 200,
  },
  {
    name: 'Fresh Tomatoes',
    price: 18000,
    image: u('photo-1546470427-e2a36e57b7e1'),
    unit: '3kg',
    description: 'Ripe, juicy red tomatoes. Perfect for stews, jollof rice, and sauces.',
    category: 'vegetables',
    stock: 90,
  },
  {
    name: 'Garden Egg (Igba)',
    price: 7500,
    image: u('photo-1568702846914-96b305d2aaeb'),
    unit: '500g',
    description: 'Fresh garden eggs — great for garden-egg sauce, stews, and as a healthy snack.',
    category: 'vegetables',
    stock: 65,
  },
  {
    name: 'Cabbage (Large)',
    price: 8000,
    image: u('photo-1594282486552-05b4d80fbb9f'),
    unit: '1kg',
    description: 'Large fresh cabbage head — ideal for coleslaw, stir-fry, and Nigerian pepper soup.',
    category: 'vegetables',
    stock: 55,
  },
  {
    name: 'Water Leaf (Talinum)',
    price: 4500,
    image: p(C.vegs, 'Water Leaf'),
    unit: '500g',
    description: 'Tender water leaf for edikang ikong soup and other leafy vegetable dishes.',
    category: 'vegetables',
    stock: 45,
  },
  {
    name: 'Bitter Leaf (Onugbu)',
    price: 4000,
    image: p(C.vegs, 'Bitter Leaf'),
    unit: '200g',
    description: 'Fresh bitter leaf for ofe onugbu (bitter-leaf soup) and other traditional soups.',
    category: 'vegetables',
    stock: 40,
  },
  {
    name: 'Spinach (Efo Tete)',
    price: 5500,
    image: p(C.vegs, 'Spinach Efo Tete'),
    unit: '500g',
    description: 'Tender spinach leaves — rich in iron and perfect for efo riro and other soups.',
    category: 'vegetables',
    stock: 60,
  },
  {
    name: 'Carrots',
    price: 9500,
    image: p(C.vegs, 'Carrots'),
    unit: '1kg',
    description: 'Fresh orange carrots — sweet, crunchy, and loaded with vitamin A.',
    category: 'vegetables',
    stock: 80,
  },
  {
    name: 'Irish Potato',
    price: 11000,
    image: p(C.vegs, 'Irish Potato'),
    unit: '3kg',
    description: 'Fresh Irish potatoes — great for frying, boiling, or in pepper soup.',
    category: 'vegetables',
    stock: 100,
  },
  {
    name: 'Sweet Potato (Yellow)',
    price: 13000,
    image: p(C.vegs, 'Sweet Potato'),
    unit: '3kg',
    description: 'Nutritious yellow sweet potatoes — rich in fibre, vitamins, and natural sweetness.',
    category: 'vegetables',
    stock: 75,
  },
  {
    name: 'Yam Tuber',
    price: 22000,
    image: p(C.vegs, 'Yam Tuber'),
    unit: '3kg',
    description: 'Fresh white yam tuber — for pounded yam, fried yam, yam porridge, and pepper soup.',
    category: 'vegetables',
    stock: 60,
  },
  {
    name: 'Plantain (Unripe)',
    price: 12000,
    image: u('photo-1571771894821-ce9b6c11b08e'),
    unit: '1.5kg',
    description: 'Fresh unripe plantain — best for boli (roasted plantain) or fried plantain chips.',
    category: 'vegetables',
    stock: 90,
  },

  // ── Oils & Condiments (10) ────────────────────────────────────────────────
  {
    name: 'Red Palm Oil',
    price: 35000,
    image: u('photo-1474979266404-7eaacbcd87c5'),
    unit: '4L',
    description: 'Pure unrefined red palm oil — the foundation of Nigerian soups and stews.',
    category: 'oils & condiments',
    stock: 160,
  },
  {
    name: 'Groundnut Oil',
    price: 28000,
    image: u('photo-1474979266404-7eaacbcd87c5'),
    unit: '4L',
    description: 'Refined groundnut (peanut) oil — neutral flavour ideal for frying and cooking.',
    category: 'oils & condiments',
    stock: 140,
  },
  {
    name: 'Vegetable Oil (Knife Brand)',
    price: 26000,
    image: p(C.oils, 'Vegetable Oil'),
    unit: '4L',
    description: 'Premium refined vegetable oil — light, neutral, and perfect for everyday cooking.',
    category: 'oils & condiments',
    stock: 130,
  },
  {
    name: 'Coconut Oil (Virgin)',
    price: 18000,
    image: u('photo-1474979266404-7eaacbcd87c5'),
    unit: '500ml',
    description: 'Cold-pressed virgin coconut oil — great for cooking, baking, and skincare.',
    category: 'oils & condiments',
    stock: 85,
  },
  {
    name: 'Sunflower Oil',
    price: 22000,
    image: p(C.oils, 'Sunflower Oil'),
    unit: '2L',
    description: 'Light and healthy sunflower oil — high smoke point, ideal for frying.',
    category: 'oils & condiments',
    stock: 100,
  },
  {
    name: 'Egusi (Ground Melon Seeds)',
    price: 22000,
    image: p(C.oils, 'Egusi Ground'),
    unit: '500g',
    description: 'Pre-ground egusi melon seeds — ready to use in egusi soup. Rich in protein and fat.',
    category: 'oils & condiments',
    stock: 110,
  },
  {
    name: 'Ogiri (Locust Bean)',
    price: 5500,
    image: p(C.oils, 'Ogiri Locust Bean'),
    unit: '100g',
    description: 'Fermented locust beans — a traditional condiment that deepens the flavour of soups.',
    category: 'oils & condiments',
    stock: 80,
  },
  {
    name: 'Maggi Seasoning Cubes',
    price: 8000,
    image: u('photo-1596040033229-a9821ebd058d'),
    unit: '100g',
    description: 'Classic Maggi seasoning cubes — the go-to flavour enhancer for Nigerian cooking.',
    category: 'oils & condiments',
    stock: 300,
  },
  {
    name: 'Knorr Chicken Cubes',
    price: 6500,
    image: p(C.oils, 'Knorr Cubes'),
    unit: '50g',
    description: 'Knorr chicken-flavoured seasoning cubes — rich taste for soups, stews, and rice.',
    category: 'oils & condiments',
    stock: 280,
  },
  {
    name: 'Cameroon Pepper (Ground)',
    price: 9000,
    image: p(C.oils, 'Cameroon Pepper'),
    unit: '100g',
    description: 'Authentic ground Cameroon pepper — adds a unique smoky heat to peppersoup and stews.',
    category: 'oils & condiments',
    stock: 120,
  },

  // ── Fish & Protein (12) ───────────────────────────────────────────────────
  {
    name: 'K&O Smoked Fish',
    price: 9500,
    image: u('photo-1519708227418-c8fd9a32b7a2'),
    unit: '500g',
    description: 'Premium quality smoked fish — adds deep flavour to soups and stews.',
    category: 'fish & protein',
    stock: 120,
  },
  {
    name: 'Stockfish (Panla)',
    price: 45000,
    image: u('photo-1534482421-64566f976cfa'),
    unit: '1kg',
    description: 'Norwegian stockfish — a cherished ingredient in ofe onugbu and other Nigerian soups.',
    category: 'fish & protein',
    stock: 55,
  },
  {
    name: 'Mackerel (Titus Fish)',
    price: 22000,
    image: u('photo-1519708227418-c8fd9a32b7a2'),
    unit: '1kg',
    description: 'Fresh Atlantic mackerel (titus) — popular for frying, grilling, and pepper soup.',
    category: 'fish & protein',
    stock: 80,
  },
  {
    name: 'Smoked Catfish',
    price: 35000,
    image: u('photo-1534482421-64566f976cfa'),
    unit: '500g',
    description: 'Whole smoked catfish — perfect for catfish pepper soup and palm-oil-based soups.',
    category: 'fish & protein',
    stock: 65,
  },
  {
    name: 'Dried Crayfish (Ground)',
    price: 18000,
    image: u('photo-1587334207407-e6e8ee0d7dc0'),
    unit: '200g',
    description: 'Ground dried crayfish — an indispensable seasoning in virtually every Nigerian soup.',
    category: 'fish & protein',
    stock: 200,
  },
  {
    name: 'Dried Prawns',
    price: 25000,
    image: u('photo-1565680018434-b513d5e5fd47'),
    unit: '200g',
    description: 'Sun-dried prawns — an aromatic umami booster for soups, stews, and rice dishes.',
    category: 'fish & protein',
    stock: 90,
  },
  {
    name: 'Ponmo (Cow Skin)',
    price: 12000,
    image: p(C.protein, 'Ponmo Cow Skin'),
    unit: '500g',
    description: 'Pre-cooked and sliced ponmo — adds texture to soups, stews, and jollof rice.',
    category: 'fish & protein',
    stock: 75,
  },
  {
    name: 'Assorted Meat (Frozen)',
    price: 55000,
    image: p(C.protein, 'Assorted Meat'),
    unit: '2kg',
    description: 'Mixed assorted meat cuts — ideal for pepper soup, stews, and special occasions.',
    category: 'fish & protein',
    stock: 45,
  },
  {
    name: 'Frozen Chicken (Whole)',
    price: 38000,
    image: p(C.protein, 'Frozen Chicken'),
    unit: '1.5kg',
    description: 'Whole dressed frozen chicken — great for grilling, roasting, and peppersoup.',
    category: 'fish & protein',
    stock: 60,
  },
  {
    name: 'Goat Meat (Frozen)',
    price: 28000,
    image: p(C.protein, 'Goat Meat'),
    unit: '1kg',
    description: 'Fresh frozen goat meat — richly flavoured for pepper soup and native soups.',
    category: 'fish & protein',
    stock: 50,
  },
  {
    name: 'Snail (Large)',
    price: 20000,
    image: p(C.protein, 'Snail Large'),
    unit: '500g',
    description: 'Pre-cleaned large African snails — a delicacy for pepper soup and stews.',
    category: 'fish & protein',
    stock: 35,
  },
  {
    name: 'Periwinkle (Ngolo)',
    price: 15000,
    image: p(C.protein, 'Periwinkle'),
    unit: '500g',
    description: 'Fresh periwinkle shells — a classic seafood addition to pepper soup and banga soup.',
    category: 'fish & protein',
    stock: 45,
  },

  // ── Beverages (14) ────────────────────────────────────────────────────────
  {
    name: 'Milo Chocolate Drink',
    price: 18000,
    image: p(C.beverages, 'Milo Choc Drink'),
    unit: '400g',
    description: 'Nestle Milo — the classic chocolate malt drink loved by Nigerian families.',
    category: 'beverages',
    stock: 150,
  },
  {
    name: 'Bournvita Cocoa Drink',
    price: 22000,
    image: p(C.beverages, 'Bournvita'),
    unit: '500g',
    description: 'Cadbury Bournvita — rich cocoa drink packed with vitamins and minerals.',
    category: 'beverages',
    stock: 140,
  },
  {
    name: 'Ovaltine Chocolate Malt',
    price: 20000,
    image: p(C.beverages, 'Ovaltine Malt'),
    unit: '400g',
    description: 'Ovaltine nutritious chocolate malt drink — great for children and adults.',
    category: 'beverages',
    stock: 120,
  },
  {
    name: 'Peak Milk (Powdered)',
    price: 16000,
    image: p(C.beverages, 'Peak Milk'),
    unit: '400g',
    description: 'Peak full-cream powdered milk — rich and creamy, great in tea, pap, and cereal.',
    category: 'beverages',
    stock: 180,
  },
  {
    name: 'Three Crowns Milk',
    price: 15500,
    image: p(C.beverages, 'Three Crowns'),
    unit: '400g',
    description: 'Three Crowns powdered milk — smooth, creamy taste for beverages and recipes.',
    category: 'beverages',
    stock: 160,
  },
  {
    name: 'Hollandia Evaporated Milk',
    price: 9000,
    image: p(C.beverages, 'Hollandia Milk'),
    unit: '410g',
    description: 'Rich evaporated milk — ideal for tea, coffee, porridge, and baking.',
    category: 'beverages',
    stock: 200,
  },
  {
    name: 'Lipton Yellow Label Tea',
    price: 7500,
    image: p(C.beverages, 'Lipton Tea'),
    unit: '100g',
    description: 'Classic Lipton yellow label tea — refreshing, smooth, and soothing anytime.',
    category: 'beverages',
    stock: 250,
  },
  {
    name: 'Nescafé Original Coffee',
    price: 28000,
    image: p(C.beverages, 'Nescafe Coffee'),
    unit: '200g',
    description: 'Nescafé classic instant coffee — rich aroma and smooth taste in every cup.',
    category: 'beverages',
    stock: 130,
  },
  {
    name: 'Ribena Blackcurrant Drink',
    price: 8500,
    image: p(C.beverages, 'Ribena'),
    unit: '1L',
    description: 'Ribena blackcurrant drink — packed with vitamin C, great for kids and adults.',
    category: 'beverages',
    stock: 100,
  },
  {
    name: 'Lacasera Apple Drink',
    price: 12000,
    image: p(C.beverages, 'Lacasera Apple'),
    unit: '3L',
    description: 'Lacasera sparkling apple drink — refreshing and lightly carbonated.',
    category: 'beverages',
    stock: 80,
  },
  {
    name: 'Malta Guinness',
    price: 15000,
    image: p(C.beverages, 'Malta Guinness'),
    unit: '2L',
    description: 'Malta Guinness non-alcoholic malt drink — rich in B vitamins and energy.',
    category: 'beverages',
    stock: 90,
  },
  {
    name: 'Dry Zobo (Hibiscus Flowers)',
    price: 6000,
    image: p(C.beverages, 'Dry Zobo'),
    unit: '500g',
    description: 'Dried hibiscus flowers for making zobo — tangy, refreshing, and antioxidant-rich.',
    category: 'beverages',
    stock: 70,
  },
  {
    name: 'Kunu Powder Mix',
    price: 8000,
    image: p(C.beverages, 'Kunu Mix'),
    unit: '500g',
    description: 'Ready-mix kunu powder — just add water for a traditional northern Nigerian drink.',
    category: 'beverages',
    stock: 60,
  },
  {
    name: 'Viju Milk Drink',
    price: 7500,
    image: p(C.beverages, 'Viju Milk'),
    unit: '1L',
    description: 'Viju creamy milk drink — smooth, sweet, and popular with Nigerian children.',
    category: 'beverages',
    stock: 110,
  },

  // ── Snacks & Noodles (12) ─────────────────────────────────────────────────
  {
    name: 'Indomie Chicken Noodles',
    price: 28000,
    image: u('photo-1569718212165-3a8278d5f624'),
    unit: '3.5kg',
    description: 'Indomie chicken-flavoured instant noodles — Nigeria\'s most loved quick meal.',
    category: 'snacks & noodles',
    stock: 200,
  },
  {
    name: 'Indomie Onion Chicken',
    price: 27000,
    image: u('photo-1569718212165-3a8278d5f624'),
    unit: '3.5kg',
    description: 'Indomie onion chicken — bold flavour with a satisfying aroma.',
    category: 'snacks & noodles',
    stock: 185,
  },
  {
    name: 'Golden Morn Cereal',
    price: 16000,
    image: p(C.snacks, 'Golden Morn'),
    unit: '1kg',
    description: 'Nestle Golden Morn maize-based cereal — nutritious breakfast for the whole family.',
    category: 'snacks & noodles',
    stock: 120,
  },
  {
    name: 'Chin-Chin (Bag)',
    price: 6500,
    image: p(C.snacks, 'Chin Chin'),
    unit: '500g',
    description: 'Crunchy sweet chin-chin — a beloved Nigerian snack for all ages.',
    category: 'snacks & noodles',
    stock: 150,
  },
  {
    name: 'Plantain Chips',
    price: 5500,
    image: p(C.snacks, 'Plantain Chips'),
    unit: '200g bag',
    description: 'Crispy fried plantain chips — lightly salted and perfectly crunchy.',
    category: 'snacks & noodles',
    stock: 130,
  },
  {
    name: 'Agege Bread',
    price: 3500,
    image: p(C.snacks, 'Agege Bread'),
    unit: '600g',
    description: 'Soft, pillowy Agege-style bread — Nigeria\'s favourite everyday bread.',
    category: 'snacks & noodles',
    stock: 80,
  },
  {
    name: 'Cabin Biscuits',
    price: 22000,
    image: p(C.snacks, 'Cabin Biscuits'),
    unit: '2kg',
    description: 'Classic UAC Cabin biscuits — light, crispy, and mildly sweet.',
    category: 'snacks & noodles',
    stock: 90,
  },
  {
    name: 'Digestive Biscuits',
    price: 8500,
    image: p(C.snacks, 'Digestive Biscuits'),
    unit: '400g',
    description: 'Whole-wheat digestive biscuits — wholesome snack that pairs perfectly with tea.',
    category: 'snacks & noodles',
    stock: 100,
  },
  {
    name: 'Roasted Groundnut',
    price: 5000,
    image: p(C.snacks, 'Roasted Groundnut'),
    unit: '500g',
    description: 'Lightly salted roasted groundnuts — protein-packed and irresistibly crunchy.',
    category: 'snacks & noodles',
    stock: 160,
  },
  {
    name: 'Kuli-Kuli (Groundnut Cake)',
    price: 6000,
    image: p(C.snacks, 'Kuli Kuli'),
    unit: '500g',
    description: 'Traditional northern Nigerian kuli-kuli — spiced groundnut cake with a satisfying crunch.',
    category: 'snacks & noodles',
    stock: 80,
  },
  {
    name: 'Tiger Nut (Ofio)',
    price: 7000,
    image: p(C.snacks, 'Tiger Nut Ofio'),
    unit: '500g',
    description: 'Dried tiger nuts — sweet, chewy, and high in fibre. Great as a snack or for kunu.',
    category: 'snacks & noodles',
    stock: 70,
  },
  {
    name: 'Walnuts (Ukpa)',
    price: 9000,
    image: p(C.snacks, 'Walnuts Ukpa'),
    unit: '300g',
    description: 'Dried African walnuts (ukpa) — a traditional Igbo snack, rich in healthy fats.',
    category: 'snacks & noodles',
    stock: 55,
  },

  // ── Household Supplies (12) ───────────────────────────────────────────────
  {
    name: '2Sure Original Dish Washing Liquid',
    price: 34000,
    image: u('photo-1585771724684-38269d6639fd'),
    unit: '1L',
    description: 'Powerful 2Sure dish washing liquid — cuts through grease and leaves dishes sparkling.',
    category: 'household',
    stock: 180,
  },
  {
    name: '2Sure Fresh Lemon Dish Liquid',
    price: 25000,
    image: u('photo-1585771724684-38269d6639fd'),
    unit: '500ml',
    description: 'Refreshing lemon-scented dish liquid — effective cleaning with a citrus freshness.',
    category: 'household',
    stock: 160,
  },
  {
    name: 'Morning Fresh Dish Soap',
    price: 22000,
    image: u('photo-1585771724684-38269d6639fd'),
    unit: '750ml',
    description: 'Morning Fresh concentrated dish soap — effective on oil and grease.',
    category: 'household',
    stock: 140,
  },
  {
    name: 'Omo Active Detergent',
    price: 28000,
    image: p(C.household, 'Omo Detergent'),
    unit: '3kg',
    description: 'Omo active laundry detergent — tough on stains, gentle on fabrics.',
    category: 'household',
    stock: 150,
  },
  {
    name: 'Ariel Washing Powder',
    price: 32000,
    image: p(C.household, 'Ariel Washing'),
    unit: '2.5kg',
    description: 'Ariel professional-grade washing powder with stain-fighting enzymes.',
    category: 'household',
    stock: 130,
  },
  {
    name: 'Dettol Antiseptic Liquid',
    price: 18000,
    image: p(C.household, 'Dettol Antiseptic'),
    unit: '500ml',
    description: 'Trusted Dettol antiseptic — protects against 99.9% of bacteria and germs.',
    category: 'household',
    stock: 175,
  },
  {
    name: 'Izal Pine Disinfectant',
    price: 15000,
    image: p(C.household, 'Izal Disinfectant'),
    unit: '750ml',
    description: 'Classic Izal pine disinfectant — kills germs on floors and surfaces effectively.',
    category: 'household',
    stock: 200,
  },
  {
    name: 'Air Freshener (Lavender)',
    price: 12000,
    image: p(C.household, 'Air Freshener'),
    unit: '300ml',
    description: 'Long-lasting lavender air freshener — keeps your home smelling fresh all day.',
    category: 'household',
    stock: 100,
  },
  {
    name: 'Toilet Roll (10-Pack)',
    price: 9500,
    image: p(C.household, 'Toilet Roll'),
    unit: '500g',
    description: 'Soft 2-ply toilet rolls — gentle and absorbent for everyday comfort.',
    category: 'household',
    stock: 200,
  },
  {
    name: 'Kitchen Tissue Roll',
    price: 5500,
    image: p(C.household, 'Kitchen Tissue'),
    unit: '200g',
    description: 'Strong kitchen paper towels — ideal for cleaning surfaces and draining fried food.',
    category: 'household',
    stock: 180,
  },
  {
    name: 'Lux Soap (Pack of 6)',
    price: 14500,
    image: p(C.household, 'Lux Soap'),
    unit: '600g',
    description: 'Lux beauty soap with moisturising fragrance — for soft, smooth skin every day.',
    category: 'household',
    stock: 120,
  },
  {
    name: 'Dettol Bar Soap',
    price: 12000,
    image: p(C.household, 'Dettol Bar Soap'),
    unit: '400g',
    description: 'Dettol antibacterial bar soap — kills germs while gently cleansing your skin.',
    category: 'household',
    stock: 150,
  },
];

// ── Seed runner ───────────────────────────────────────────────────────────────

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

  const categories = [...new Set(products.map((prod) => prod.category))];
  console.log('Categories seeded:');
  for (const cat of categories) {
    const count = products.filter((prod) => prod.category === cat).length;
    const unsplashCount = products.filter(
      (prod) => prod.category === cat && prod.image.includes('unsplash')
    ).length;
    console.log(
      `  ${cat.padEnd(22)} ${String(count).padStart(3)} products  ` +
      `(${unsplashCount} Unsplash, ${count - unsplashCount} placeholder)`
    );
  }

  await mongoose.disconnect();
  console.log('\nDisconnected from MongoDB. Done!');
}

seed().catch((err: unknown) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
