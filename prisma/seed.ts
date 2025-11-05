/**
 * Prisma Seed Script
 * 
 * Seeds the database with initial product and category data from static-data.ts
 */

import { PrismaClient } from "@prisma/client";
import { staticProducts, staticCategories } from "../src/lib/static-data";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Seed Categories
  console.log("📦 Seeding categories...");
  const categoryMap = new Map<string, string>(); // Map old category ID to new Prisma ID

  for (const category of staticCategories) {
    const created = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        description: category.description,
        isActive: category.isActive,
      },
      create: {
        name: category.name,
        slug: category.slug,
        description: category.description,
        isActive: category.isActive,
      },
    });
    categoryMap.set(category.id, created.id);
    console.log(`  ✓ Created/Updated category: ${category.name}`);
  }

  // Seed Products and Variants
  console.log("🛍️  Seeding products and variants...");
  
  for (const product of staticProducts) {
    const categoryId = categoryMap.get(product.category?.id || "");
    
    if (!categoryId) {
      console.warn(`  ⚠️  Skipping product ${product.name} - category not found`);
      continue;
    }

    // Create product with category connection
    const createdProduct = await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        name: product.name,
        description: product.description,
        shortDescription: product.shortDescription,
        price: product.price,
        originalPrice: product.originalPrice,
        images: product.images,
        category: { connect: { id: categoryId } },
        isVisible: (product as { isVisible?: boolean }).isVisible ?? true,
        isActive: product.isActive ?? true,
        isBestSeller: product.isBestSeller ?? false,
        isFeatured: product.isFeatured ?? false,
        metaTitle: (product as { metaTitle?: string }).metaTitle,
        metaDescription: (product as { metaDescription?: string }).metaDescription,
        averageRating: (product as { averageRating?: number }).averageRating,
        reviewCount: (product as { reviewCount?: number }).reviewCount ?? 0,
      },
      create: {
        name: product.name,
        slug: product.slug,
        description: product.description,
        shortDescription: product.shortDescription,
        price: product.price,
        originalPrice: product.originalPrice,
        images: product.images,
        category: { connect: { id: categoryId } },
        isVisible: (product as { isVisible?: boolean }).isVisible ?? true,
        isActive: product.isActive ?? true,
        isBestSeller: product.isBestSeller ?? false,
        isFeatured: product.isFeatured ?? false,
        metaTitle: (product as { metaTitle?: string }).metaTitle,
        metaDescription: (product as { metaDescription?: string }).metaDescription,
        averageRating: (product as { averageRating?: number }).averageRating,
        reviewCount: (product as { reviewCount?: number }).reviewCount ?? 0,
      },
    });

    // Create variants: 500g and 1kg for each product
    const basePrice = product.price;
    const variant500gPrice = basePrice;
    const variant1kgPrice = Math.round(basePrice * 1.8); // 1kg costs ~1.8x of 500g

    // Delete existing variants for this product to recreate
    await prisma.variant.deleteMany({
      where: { productId: createdProduct.id },
    });

    // Create 500g variant
    await prisma.variant.create({
      data: {
        productId: createdProduct.id,
        name: "500g",
        price: variant500gPrice,
        sku: `${product.sku}-500g`,
        inventoryQty: 100, // Set to 100 for testing
        weight: "500g",
        packSize: (product as { packSize?: string }).packSize || "1 Box",
        isActive: true,
      },
    });

    // Create 1kg variant
    await prisma.variant.create({
      data: {
        productId: createdProduct.id,
        name: "1kg",
        price: variant1kgPrice,
        sku: `${product.sku}-1kg`,
        inventoryQty: 100, // Set to 100 for testing
        weight: "1kg",
        packSize: (product as { packSize?: string }).packSize || "1 Box",
        isActive: true,
      },
    });

    console.log(`  ✓ Created/Updated product: ${product.name} with variants (500g, 1kg)`);
  }

  console.log("✅ Database seed completed!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

