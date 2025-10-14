import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'sweets' },
      update: {},
      create: {
        name: 'Sweets',
        slug: 'sweets',
        description: 'Traditional Indian sweets made with authentic recipes',
        image: '/images/categories/sweets.svg',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'hot-snacks' },
      update: {},
      create: {
        name: 'Hot Snacks',
        slug: 'hot-snacks',
        description: 'Freshly prepared hot snacks and savories',
        image: '/images/categories/hot-snacks.svg',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'pickles' },
      update: {},
      create: {
        name: 'Pickles',
        slug: 'pickles',
        description: 'Traditional pickles and preserves',
        image: '/images/categories/pickles.svg',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'powders' },
      update: {},
      create: {
        name: 'Powders',
        slug: 'powders',
        description: 'Spice powders and masala mixes',
        image: '/images/categories/powders.svg',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'gift-boxes' },
      update: {},
      create: {
        name: 'Gift Boxes',
        slug: 'gift-boxes',
        description: 'Curated gift boxes for special occasions',
        image: '/images/categories/gift-boxes.svg',
      },
    }),
  ])

  console.log('✅ Categories created')

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12)
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@kotaiahsweets.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@kotaiahsweets.com',
      password: hashedPassword,
      role: 'ADMIN',
      phone: '+91 9876543210',
    },
  })

  console.log('✅ Admin user created')

  // Create sample products
  const products = [
    {
      name: 'Gulab Jamun',
      slug: 'gulab-jamun',
      description: 'Soft and spongy milk-based sweet balls soaked in sugar syrup. A classic Indian dessert loved by all.',
      shortDescription: 'Soft milk-based sweet balls in sugar syrup',
      categoryId: categories[0].id,
      price: 280,
      originalPrice: null,
      sku: 'GJ001',
      images: ['/images/products/gulab-jamun-1.svg'],
      ingredients: ['Milk powder', 'All-purpose flour', 'Sugar', 'Cardamom', 'Rose water'],
      shelfLife: 3,
      weight: '500g',
      packSize: '1 Box',
      taxPercent: 18,
      inventoryQty: 50,
      isPerishable: true,
      isBestSeller: false,
      isFeatured: false,
      shippingRegions: ['500001', '500002', '500003', '500004', '500005'],
      metaTitle: 'Gulab Jamun - Traditional Indian Sweet | Kotaiah\'s Sweets',
      metaDescription: 'Buy authentic Gulab Jamun online. Soft, spongy milk-based sweet balls soaked in sugar syrup. Fresh delivery available.',
    },
    {
      name: 'Kaju Katli',
      slug: 'kaju-katli',
      description: 'Premium cashew-based diamond-shaped sweets with silver leaf garnish. Rich, creamy texture with authentic taste.',
      shortDescription: 'Premium cashew diamond-shaped sweets',
      categoryId: categories[0].id,
      price: 450,
      originalPrice: null,
      sku: 'KK001',
      images: ['/images/products/kaju-katli-1.svg'],
      ingredients: ['Cashews', 'Sugar', 'Ghee', 'Cardamom', 'Silver leaf'],
      shelfLife: 15,
      weight: '250g',
      packSize: '1 Box',
      taxPercent: 18,
      inventoryQty: 30,
      isPerishable: false,
      isBestSeller: false,
      isFeatured: false,
      shippingRegions: ['500001', '500002', '500003', '500004', '500005'],
      metaTitle: 'Kaju Katli - Premium Cashew Sweets | Kotaiah\'s Sweets',
      metaDescription: 'Buy authentic Kaju Katli online. Premium cashew-based diamond-shaped sweets with silver leaf garnish.',
    },
    {
      name: 'Samosa',
      slug: 'samosa',
      description: 'Crispy triangular pastries filled with spiced potatoes and peas. Perfect as a snack or appetizer.',
      shortDescription: 'Crispy triangular pastries with spiced potato filling',
      categoryId: categories[1].id,
      price: 15,
      sku: 'SM001',
      images: ['/images/products/samosa-1.svg'],
      ingredients: ['All-purpose flour', 'Potatoes', 'Peas', 'Onions', 'Spices', 'Oil'],
      shelfLife: 1,
      weight: '50g',
      packSize: '1 Piece',
      taxPercent: 18,
      inventoryQty: 100,
      isPerishable: true,
      isBestSeller: true,
      shippingRegions: ['500001', '500002', '500003', '500004', '500005'],
      metaTitle: 'Samosa - Crispy Indian Snack | Kotaiah\'s Sweets',
      metaDescription: 'Buy fresh Samosa online. Crispy triangular pastries filled with spiced potatoes and peas.',
    },
    {
      name: 'Mango Pickle',
      slug: 'mango-pickle',
      description: 'Traditional raw mango pickle with authentic spices. Perfect accompaniment to meals.',
      shortDescription: 'Traditional raw mango pickle with spices',
      categoryId: categories[2].id,
      price: 180,
      sku: 'MP001',
      images: ['/images/products/mango-pickle-1.svg'],
      ingredients: ['Raw mango', 'Mustard seeds', 'Fenugreek', 'Turmeric', 'Red chili powder', 'Salt', 'Oil'],
      shelfLife: 365,
      weight: '500g',
      packSize: '1 Jar',
      taxPercent: 18,
      inventoryQty: 25,
      isPerishable: false,
      shippingRegions: ['500001', '500002', '500003', '500004', '500005'],
      metaTitle: 'Mango Pickle - Traditional Indian Pickle | Kotaiah\'s Sweets',
      metaDescription: 'Buy authentic Mango Pickle online. Traditional raw mango pickle with authentic spices.',
    },
    {
      name: 'Garam Masala',
      slug: 'garam-masala',
      description: 'Aromatic blend of ground spices used in Indian cooking. Enhances the flavor of curries and dishes.',
      shortDescription: 'Aromatic blend of ground spices',
      categoryId: categories[3].id,
      price: 120,
      sku: 'GM001',
      images: ['/images/products/garam-masala-1.svg'],
      ingredients: ['Cinnamon', 'Cardamom', 'Cloves', 'Cumin', 'Coriander', 'Black pepper', 'Bay leaves'],
      shelfLife: 180,
      weight: '100g',
      packSize: '1 Packet',
      taxPercent: 18,
      inventoryQty: 40,
      isPerishable: false,
      shippingRegions: ['500001', '500002', '500003', '500004', '500005'],
      metaTitle: 'Garam Masala - Aromatic Spice Blend | Kotaiah\'s Sweets',
      metaDescription: 'Buy authentic Garam Masala online. Aromatic blend of ground spices for Indian cooking.',
    },
    {
      name: 'Diwali Gift Box',
      slug: 'diwali-gift-box',
      description: 'Curated collection of premium sweets and snacks perfect for Diwali celebrations. Includes Gulab Jamun, Kaju Katli, and Samosas.',
      shortDescription: 'Curated collection for Diwali celebrations',
      categoryId: categories[4].id,
      price: 1200,
      originalPrice: null,
      sku: 'DGB001',
      images: ['/images/products/diwali-gift-box-1.svg'],
      ingredients: ['Mixed sweets and snacks'],
      shelfLife: 15,
      weight: '1kg',
      packSize: '1 Gift Box',
      taxPercent: 18,
      inventoryQty: 20,
      isPerishable: false,
      isFeatured: true,
      shippingRegions: ['500001', '500002', '500003', '500004', '500005'],
      metaTitle: 'Diwali Gift Box - Premium Sweet Collection | Kotaiah\'s Sweets',
      metaDescription: 'Buy Diwali Gift Box online. Curated collection of premium sweets and snacks for celebrations.',
    },
    {
      name: 'Rasgulla',
      slug: 'rasgulla',
      description: 'Soft cottage cheese balls soaked in sugar syrup. A Bengali delicacy loved across India.',
      shortDescription: 'Soft cottage cheese balls in sugar syrup',
      categoryId: categories[0].id,
      price: 320,
      sku: 'RG001',
      images: ['/images/products/rasgulla-1.svg'],
      ingredients: ['Cottage cheese', 'Sugar', 'Cardamom', 'Rose water'],
      shelfLife: 3,
      weight: '500g',
      packSize: '1 Box',
      taxPercent: 18,
      inventoryQty: 35,
      isPerishable: true,
      shippingRegions: ['500001', '500002', '500003', '500004', '500005'],
      metaTitle: 'Rasgulla - Bengali Cottage Cheese Sweet | Kotaiah\'s Sweets',
      metaDescription: 'Buy authentic Rasgulla online. Soft cottage cheese balls soaked in sugar syrup.',
    },
    {
      name: 'Pakora',
      slug: 'pakora',
      description: 'Crispy fritters made with gram flour and vegetables. Perfect evening snack.',
      shortDescription: 'Crispy gram flour fritters',
      categoryId: categories[1].id,
      price: 25,
      sku: 'PK001',
      images: ['/images/products/pakora-1.svg'],
      ingredients: ['Gram flour', 'Onions', 'Potatoes', 'Spices', 'Oil'],
      shelfLife: 1,
      weight: '100g',
      packSize: '1 Plate',
      taxPercent: 18,
      inventoryQty: 80,
      isPerishable: true,
      shippingRegions: ['500001', '500002', '500003', '500004', '500005'],
      metaTitle: 'Pakora - Crispy Gram Flour Fritters | Kotaiah\'s Sweets',
      metaDescription: 'Buy fresh Pakora online. Crispy fritters made with gram flour and vegetables.',
    },
    {
      name: 'Lemon Pickle',
      slug: 'lemon-pickle',
      description: 'Tangy lemon pickle with traditional spices. Adds zest to any meal.',
      shortDescription: 'Tangy lemon pickle with spices',
      categoryId: categories[2].id,
      price: 160,
      sku: 'LP001',
      images: ['/images/products/lemon-pickle-1.svg'],
      ingredients: ['Lemons', 'Mustard seeds', 'Fenugreek', 'Turmeric', 'Red chili powder', 'Salt', 'Oil'],
      shelfLife: 365,
      weight: '500g',
      packSize: '1 Jar',
      taxPercent: 18,
      inventoryQty: 30,
      isPerishable: false,
      shippingRegions: ['500001', '500002', '500003', '500004', '500005'],
      metaTitle: 'Lemon Pickle - Tangy Indian Pickle | Kotaiah\'s Sweets',
      metaDescription: 'Buy authentic Lemon Pickle online. Tangy lemon pickle with traditional spices.',
    },
    {
      name: 'Chana Masala Powder',
      slug: 'chana-masala-powder',
      description: 'Special spice blend for making authentic chana masala. Ready-to-use masala powder.',
      shortDescription: 'Special spice blend for chana masala',
      categoryId: categories[3].id,
      price: 95,
      sku: 'CMP001',
      images: ['/images/products/chana-masala-powder-1.svg'],
      ingredients: ['Coriander', 'Cumin', 'Red chili', 'Turmeric', 'Garam masala', 'Amchur'],
      shelfLife: 180,
      weight: '100g',
      packSize: '1 Packet',
      taxPercent: 18,
      inventoryQty: 45,
      isPerishable: false,
      shippingRegions: ['500001', '500002', '500003', '500004', '500005'],
      metaTitle: 'Chana Masala Powder - Ready-to-use Spice Blend | Kotaiah\'s Sweets',
      metaDescription: 'Buy Chana Masala Powder online. Special spice blend for making authentic chana masala.',
    },
    {
      name: 'Kakinada Kaja',
      slug: 'kakinada-kaja',
      description: 'Traditional Andhra Pradesh sweet made with maida flour, deep-fried and coated with sugar syrup. Crispy on the outside, soft inside with a perfect balance of sweetness.',
      shortDescription: 'Traditional Andhra crispy sweet with sugar coating',
      categoryId: categories[0].id,
      price: 180,
      originalPrice: null,
      sku: 'KKJ001',
      images: ['/images/sweets/kakinada-kaja/kakinada-kaja-01-800.jpg'],
      ingredients: ['Maida flour', 'Sugar', 'Ghee', 'Cardamom', 'Oil'],
      shelfLife: 7,
      weight: '200g',
      packSize: '1 Box',
      taxPercent: 18,
      inventoryQty: 25,
      isPerishable: true,
      isBestSeller: true,
      isFeatured: true,
      shippingRegions: ['500001', '500002', '500003', '500004', '500005'],
      metaTitle: 'Kakinada Kaja - Traditional Andhra Sweet | Kotaiah\'s Sweets',
      metaDescription: 'Buy authentic Kakinada Kaja online. Traditional Andhra Pradesh crispy sweet with sugar coating.',
    },
  ]

  for (const product of products) {
    await prisma.product.upsert({
      where: { sku: product.sku },
      update: {},
      create: product,
    })
  }

  console.log('✅ Products created')

  // Create delivery slots for next 7 days
  const today = new Date()
  const deliverySlots = []

  for (let i = 0; i < 7; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)

    // Morning slot
    deliverySlots.push({
      date: date,
      startTime: '09:00',
      endTime: '12:00',
      maxOrders: 50,
      currentOrders: 0,
      isActive: true,
    })

    // Evening slot
    deliverySlots.push({
      date: date,
      startTime: '16:00',
      endTime: '19:00',
      maxOrders: 50,
      currentOrders: 0,
      isActive: true,
    })
  }

  for (const slot of deliverySlots) {
    await prisma.deliverySlot.upsert({
      where: {
        date_startTime_endTime: {
          date: slot.date,
          startTime: slot.startTime,
          endTime: slot.endTime,
        },
      },
      update: {},
      create: slot,
    })
  }

  console.log('✅ Delivery slots created')

  // Create sample coupons
  const coupons = [
    {
      code: 'WELCOME10',
      type: 'PERCENTAGE' as const,
      value: 10,
      minOrderValue: 500,
      maxDiscount: 200,
      usageLimit: 100,
      usedCount: 0,
      isActive: true,
      validFrom: new Date(),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    },
    {
      code: 'FIRST50',
      type: 'FIXED' as const,
      value: 50,
      minOrderValue: 300,
      usageLimit: 50,
      usedCount: 0,
      isActive: true,
      validFrom: new Date(),
      validUntil: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
    },
  ]

  for (const coupon of coupons) {
    await prisma.coupon.upsert({
      where: { code: coupon.code },
      update: {},
      create: coupon,
    })
  }

  console.log('✅ Coupons created')

  // Create Diwali banners
  const diwaliBanners = [
    {
      title: 'Diwali Festival Special',
      subtitle: 'Up to 30% OFF on Premium Sweets',
      imagePath: '/images/banners/diwali-01-1600.webp',
      ctaLabel: 'Shop Now',
      ctaUrl: '/products/sweets',
      position: 'HERO' as const,
      startAt: new Date(),
      endAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
      priority: 1,
      active: true,
    },
    {
      title: 'Festive Gift Boxes',
      subtitle: 'Perfect for Diwali Celebrations',
      imagePath: '/images/banners/diwali-02-1600.webp',
      ctaLabel: 'View Gift Boxes',
      ctaUrl: '/products/gift-boxes',
      position: 'HERO' as const,
      startAt: new Date(),
      endAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      priority: 2,
      active: true,
    },
    {
      title: 'Traditional Sweets',
      subtitle: 'Authentic Recipes, Fresh Daily',
      imagePath: '/images/banners/diwali-03-1600.webp',
      ctaLabel: 'Explore Sweets',
      ctaUrl: '/products/sweets',
      position: 'HERO' as const,
      startAt: new Date(),
      endAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      priority: 3,
      active: true,
    },
    {
      title: 'Hot Snacks & Savories',
      subtitle: 'Freshly Prepared Daily',
      imagePath: '/images/banners/diwali-04-1600.webp',
      ctaLabel: 'Order Snacks',
      ctaUrl: '/products/hot-snacks',
      position: 'HERO' as const,
      startAt: new Date(),
      endAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      priority: 4,
      active: true,
    },
  ]

  console.log('✅ Diwali banners skipped (removed from schema)')

  // Create promotions
  const promotions = [
    {
      name: 'Diwali Sitewide Sale',
      type: 'PERCENTAGE' as const,
      value: 20,
      minOrder: 299,
      couponCode: 'DIWALI20',
      maxUses: 1000,
      userLimit: 1,
      startAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // Started 1 day ago
      endAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // Ends in 10 days
      combinable: false,
      active: true,
    },
    {
      name: 'Sweet Festival Special',
      type: 'PERCENTAGE' as const,
      value: 25,
      minOrder: 499,
      couponCode: 'SWEETFEST',
      maxUses: 500,
      userLimit: 1,
      startAt: new Date(),
      endAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      combinable: false,
      active: true,
    },
    {
      name: 'Kaju Katli Flash Sale',
      type: 'PERCENTAGE' as const,
      value: 30,
      minOrder: 0,
      couponCode: 'FLASH30',
      maxUses: 100,
      userLimit: 1,
      startAt: new Date(),
      endAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 48 hours
      combinable: false,
      active: true,
    },
    {
      name: 'Buy 2 Get 1 Free Snacks',
      type: 'BOGO' as const,
      value: 0,
      minOrder: 0,
      couponCode: 'BOGO2',
      maxUses: 200,
      userLimit: 1,
      startAt: new Date(),
      endAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days
      combinable: false,
      active: true,
    },
  ]

  for (const promotion of promotions) {
    await prisma.promotion.create({
      data: promotion,
    })
  }

  console.log('✅ Promotions created')

  // Link promotions to categories and products
  const sweetsCategory = categories.find(c => c.slug === 'sweets')
  const hotSnacksCategory = categories.find(c => c.slug === 'hot-snacks')
  const kajuKatliProduct = await prisma.product.findUnique({ where: { slug: 'kaju-katli' } })
  const samosaProduct = await prisma.product.findUnique({ where: { slug: 'samosa' } })
  const pakoraProduct = await prisma.product.findUnique({ where: { slug: 'pakora' } })

  // Link Sweet Festival promotion to Sweets category
  if (sweetsCategory) {
    const sweetFestPromotion = await prisma.promotion.findUnique({ where: { couponCode: 'SWEETFEST' } })
    if (sweetFestPromotion) {
      await prisma.categoryPromotion.create({
        data: {
          categoryId: sweetsCategory.id,
          promotionId: sweetFestPromotion.id,
        },
      })
    }
  }

  // Link Kaju Katli Flash Sale to Kaju Katli product
  if (kajuKatliProduct) {
    const flashPromotion = await prisma.promotion.findUnique({ where: { couponCode: 'FLASH30' } })
    if (flashPromotion) {
      await prisma.productPromotion.create({
        data: {
          productId: kajuKatliProduct.id,
          promotionId: flashPromotion.id,
        },
      })
    }
  }

  // Link BOGO promotion to Samosa and Pakora products
  if (samosaProduct && pakoraProduct) {
    const bogoPromotion = await prisma.promotion.findUnique({ where: { couponCode: 'BOGO2' } })
    if (bogoPromotion) {
      await prisma.productPromotion.createMany({
        data: [
          {
            productId: samosaProduct.id,
            promotionId: bogoPromotion.id,
          },
          {
            productId: pakoraProduct.id,
            promotionId: bogoPromotion.id,
          },
        ],
      })
    }
  }

  console.log('✅ Promotion links created')

  // Generate additional DIWALI20 coupons
  const diwaliPromotion = await prisma.promotion.findUnique({ where: { couponCode: 'DIWALI20' } })
  if (diwaliPromotion) {
    const additionalCoupons = []
    for (let i = 1; i <= 50; i++) {
      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '')
      const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase()
      additionalCoupons.push({
        code: `DIWALI-${dateStr}-${randomSuffix}`,
        type: 'PERCENTAGE' as const,
        value: 20,
        minOrderValue: 299,
        maxDiscount: 200,
        usageLimit: 1,
        usedCount: 0,
        isActive: true,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      })
    }

    for (const coupon of additionalCoupons) {
      await prisma.coupon.create({
        data: coupon,
      })
    }
    console.log('✅ Additional DIWALI20 coupons created')
  }

  // Create store locations
  const storeLocations = [
    {
      name: 'Main Store',
      address: '123 Heritage Street, Old City',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500001',
      phone: '+91 9876543210',
      email: 'main@kotaiahsweets.com',
      isActive: true,
    },
    {
      name: 'Branch Store',
      address: '456 Modern Road, New City',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500002',
      phone: '+91 9876543211',
      email: 'branch@kotaiahsweets.com',
      isActive: true,
    },
  ]

  for (const location of storeLocations) {
    await prisma.storeLocation.create({
      data: location,
    })
  }

  console.log('✅ Store locations created')

  console.log('🎉 Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
