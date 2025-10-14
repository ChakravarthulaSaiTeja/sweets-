#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function setupDatabase() {
  try {
    console.log('🔍 Setting up database for deployment...');
    
    // Check if database is accessible
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    
    // Check if we have data
    const categoryCount = await prisma.category.count();
    const productCount = await prisma.product.count();
    
    console.log(`📊 Found ${categoryCount} categories and ${productCount} products`);
    
    if (categoryCount === 0 || productCount === 0) {
      console.log('⚠️  No data found. Running seed script...');
      
      // Import and run seed script
      const seedPath = path.join(__dirname, 'prisma', 'seed.ts');
      if (fs.existsSync(seedPath)) {
        const { execSync } = require('child_process');
        execSync('npx prisma db seed', { stdio: 'inherit' });
        console.log('✅ Database seeded successfully');
      } else {
        console.log('❌ Seed script not found');
      }
    } else {
      console.log('✅ Database already has data');
    }
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

setupDatabase();
