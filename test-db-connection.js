import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testDatabaseConnection() {
  try {
    console.log('🔍 Testing database connection...')
    
    // Test basic connection
    await prisma.$connect()
    console.log('✅ Database connected successfully')
    
    // Test categories
    const categories = await prisma.category.findMany()
    console.log('📂 Categories found:', categories.length)
    categories.forEach(cat => console.log(`  - ${cat.name} (${cat.slug})`))
    
    // Test products
    const products = await prisma.product.findMany({
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    })
    console.log('📦 Products found:', products.length)
    products.forEach(prod => console.log(`  - ${prod.name} (${prod.sku}) - Category: ${prod.category.name}`))
    
    // Test specific category
    const sweetsProducts = await prisma.product.findMany({
      where: {
        category: {
          slug: 'sweets'
        }
      },
      include: {
        category: true
      }
    })
    console.log('🍰 Sweets products:', sweetsProducts.length)
    
    const giftBoxProducts = await prisma.product.findMany({
      where: {
        category: {
          slug: 'gift-boxes'
        }
      },
      include: {
        category: true
      }
    })
    console.log('🎁 Gift box products:', giftBoxProducts.length)
    
  } catch (error) {
    console.error('❌ Database connection error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testDatabaseConnection()

