#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚀 Setting up database for Vercel deployment...');

try {
  // Check if we're connected to Vercel
  console.log('📡 Checking Vercel connection...');
  execSync('vercel env pull .env.vercel', { stdio: 'inherit' });
  
  // Check if DATABASE_URL exists
  if (!fs.existsSync('.env.vercel')) {
    console.log('❌ No .env.vercel file found. Please set up Vercel Postgres first.');
    process.exit(1);
  }
  
  const envContent = fs.readFileSync('.env.vercel', 'utf8');
  if (!envContent.includes('db_POSTGRES_URL')) {
    console.log('❌ db_POSTGRES_URL not found in Vercel environment. Please set up Vercel Postgres first.');
    process.exit(1);
  }
  
  console.log('✅ db_POSTGRES_URL found in Vercel environment');
  
  // Push database schema
  console.log('📊 Pushing database schema...');
  execSync('npx prisma db push --schema=./prisma/schema.prisma', { 
    stdio: 'inherit',
    env: { ...process.env, ...require('dotenv').config({ path: '.env.vercel' }).parsed }
  });
  
  // Seed the database
  console.log('🌱 Seeding database...');
  execSync('npx prisma db seed', { 
    stdio: 'inherit',
    env: { ...process.env, ...require('dotenv').config({ path: '.env.vercel' }).parsed }
  });
  
  console.log('✅ Database setup complete!');
  console.log('🎉 Your Vercel app should now show products!');
  
} catch (error) {
  console.error('❌ Database setup failed:', error.message);
  process.exit(1);
}
