-- Database setup script for Kotaiah's Sweets & Foods
-- Run this in your Vercel Postgres database

-- Create Categories
INSERT INTO "Category" (id, name, slug, description, "isActive", "createdAt", "updatedAt") VALUES
('cat-1', 'Sweets', 'sweets', 'Traditional Indian sweets made with authentic recipes', true, NOW(), NOW()),
('cat-2', 'Hot Snacks', 'hot-snacks', 'Freshly prepared hot snacks and savories', true, NOW(), NOW()),
('cat-3', 'Pickles', 'pickles', 'Traditional pickles and preserves', true, NOW(), NOW()),
('cat-4', 'Powders', 'powders', 'Spice powders and masala mixes', true, NOW(), NOW()),
('cat-5', 'Gift Boxes', 'gift-boxes', 'Curated gift boxes for special occasions', true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Create Products
INSERT INTO "Product" (id, name, slug, description, "shortDescription", "categoryId", price, "originalPrice", sku, images, ingredients, "shelfLife", weight, "packSize", "taxPercent", "inventoryQty", "isPerishable", "isBestSeller", "isFeatured", "isActive", "shippingRegions", "metaTitle", "metaDescription", "createdAt", "updatedAt") VALUES
('prod-1', 'Gulab Jamun', 'gulab-jamun', 'Soft, spongy milk-based dumplings soaked in rose-flavored sugar syrup. A classic Indian dessert that melts in your mouth.', 'Soft milk dumplings in rose syrup', 'cat-1', 280.00, NULL, 'GJ001', ARRAY['https://www.shutterstock.com/image-photo/gulab-jamun-beloved-dessert-indian-260nw-2536754249.jpg'], ARRAY['Milk powder', 'Flour', 'Sugar', 'Rose water', 'Cardamom'], 3, '500g', '1 Box', 18.00, 20, true, false, false, true, ARRAY['500001', '500002', '500003', '500004', '500005'], 'Gulab Jamun - Traditional Indian Sweet | Kotaiah''s Sweets', 'Buy authentic Gulab Jamun online. Soft, spongy milk-based dumplings soaked in rose-flavored sugar syrup.', NOW(), NOW()),

('prod-2', 'Kaju Katli', 'kaju-katli', 'Rich, creamy cashew fudge with a diamond-like appearance. Made with premium cashews and traditional techniques.', 'Rich cashew fudge with diamond cut', 'cat-1', 450.00, NULL, 'KK001', ARRAY['https://upload.wikimedia.org/wikipedia/commons/a/ac/Kaju_katli_sweet.jpg'], ARRAY['Cashews', 'Sugar', 'Ghee', 'Cardamom', 'Silver foil'], 7, '250g', '1 Box', 18.00, 15, true, false, false, true, ARRAY['500001', '500002', '500003', '500004', '500005'], 'Kaju Katli - Premium Cashew Fudge | Kotaiah''s Sweets', 'Buy authentic Kaju Katli online. Rich, creamy cashew fudge with traditional diamond cut.', NOW(), NOW()),

('prod-3', 'Kakinada Kaja', 'kakinada-kaja', 'Traditional Andhra Pradesh sweet made with maida flour, deep-fried and coated with sugar syrup. Crispy on the outside, soft inside with a perfect balance of sweetness.', 'Traditional Andhra crispy sweet with sugar coating', 'cat-1', 180.00, NULL, 'KKJ001', ARRAY['https://sitarafoods.com/wp-content/uploads/2022/07/04-2.jpg'], ARRAY['Maida flour', 'Sugar', 'Ghee', 'Cardamom', 'Oil'], 7, '200g', '1 Box', 18.00, 25, true, true, true, true, ARRAY['500001', '500002', '500003', '500004', '500005'], 'Kakinada Kaja - Traditional Andhra Sweet | Kotaiah''s Sweets', 'Buy authentic Kakinada Kaja online. Traditional Andhra Pradesh crispy sweet with sugar coating.', NOW(), NOW()),

('prod-4', 'Diwali Gift Box', 'diwali-gift-box', 'Beautifully curated gift box containing an assortment of premium sweets, perfect for Diwali celebrations and special occasions.', 'Assorted sweets gift box for festivals', 'cat-5', 1200.00, NULL, 'DGB001', ARRAY['https://images.unsplash.com/photo-1607082349566-187342175e2f?w=400&h=400&fit=crop&crop=center'], ARRAY['Mixed sweets', 'Gift packaging', 'Decorative box'], 7, '1kg', '1 Box', 18.00, 10, true, false, false, true, ARRAY['500001', '500002', '500003', '500004', '500005'], 'Diwali Gift Box - Premium Assorted Sweets | Kotaiah''s Sweets', 'Buy authentic Diwali gift box online. Beautifully curated assortment of premium sweets.', NOW(), NOW()),

('prod-5', 'Rasagulla', 'rasagulla', 'Soft and spongy cottage cheese balls soaked in light sugar syrup. A traditional Bengali sweet that melts in your mouth.', 'Soft cottage cheese balls in light syrup', 'cat-1', 320.00, NULL, 'RG001', ARRAY['https://t3.ftcdn.net/jpg/01/24/13/32/360_F_124133223_wT7dPKKkL83cdkZTascooO8REQISsY1f.jpg'], ARRAY['Cottage cheese', 'Sugar', 'Cardamom', 'Rose water', 'Saffron'], 2, '500g', '1 Box', 18.00, 30, true, false, false, true, ARRAY['500001', '500002', '500003', '500004', '500005'], 'Rasagulla - Traditional Bengali Sweet | Kotaiah''s Sweets', 'Buy authentic Rasagulla online. Soft, spongy cottage cheese balls soaked in light sugar syrup.', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;
