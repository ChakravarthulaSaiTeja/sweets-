# Kotaiah's Sweets & Foods - E-commerce Website

A production-ready e-commerce web application for "Kotaiah's Sweets & Foods" built with Next.js, TypeScript, and modern web technologies. This application features a clean traditional design with comprehensive e-commerce functionality including product catalog, cart management, checkout with payments, order tracking, and admin dashboard.

## 🚀 Features

### Core E-commerce Features
- **Product Catalog**: Browse products by category with filtering and search
- **Shopping Cart**: Persistent cart for logged-in users and localStorage for guests
- **Checkout Flow**: Address selection, delivery slot booking, and payment processing
- **Order Management**: Track orders and manage order status
- **User Authentication**: Email/password and magic link authentication
- **Admin Dashboard**: Complete product, order, and content management

### Technical Features
- **Server-Side Rendering**: SEO-optimized product pages with schema.org markup
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Payment Integration**: Razorpay integration with webhook verification
- **Image Optimization**: Next.js Image component with lazy loading
- **Performance**: Optimized for Core Web Vitals
- **Clean Architecture**: Organized folder structure with reusable components

## 🛠 Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js
- **Payments**: Razorpay
- **Deployment**: Vercel (recommended), Docker support

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Razorpay account (for payments)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd sweets-
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Copy the environment variables template:

```bash
cp .env.example .env.local
```

Update `.env.local` with your configuration:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/kotaiah_sweets"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-key-here"

# Razorpay
RAZORPAY_KEY_ID="your-razorpay-key-id"
RAZORPAY_SECRET="your-razorpay-secret"

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="Kotaiah's Sweets & Foods"
```

### 4. Database Setup

Generate Prisma client and push schema to database:

```bash
npm run db:generate
npm run db:push
```

### 5. Seed the Database

Populate the database with sample data:

```bash
npm run db:seed
```

### 6. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/          # NextAuth routes
│   │   ├── cart/          # Cart management
│   │   ├── products/      # Product APIs
│   │   └── promotions/    # Promotion APIs
│   ├── admin/             # Admin dashboard
│   ├── products/          # Product pages
│   ├── auth/              # Authentication pages
│   ├── cart/              # Cart page
│   ├── contact/           # Contact page
│   └── about/             # About page
├── components/            # React components
│   ├── home/              # Homepage sections
│   ├── products/          # Product components
│   ├── ui/                # Reusable UI components
│   ├── navigation.tsx     # Main navigation
│   ├── footer.tsx         # Site footer
│   └── providers.tsx      # Context providers
├── contexts/              # React contexts
│   └── cart-context.tsx   # Shopping cart context
├── lib/                   # Core utilities
│   ├── auth.ts           # NextAuth configuration
│   ├── prisma.ts         # Prisma client
│   ├── analytics.ts      # Analytics utilities
│   └── notifications.ts  # Notification utilities
├── utils/                 # Helper functions
│   ├── index.ts          # Main utilities
│   ├── constants.ts      # App constants
│   └── types.ts          # TypeScript types
└── types/                # TypeScript type definitions
    └── next-auth.d.ts    # NextAuth type extensions
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:seed` - Seed database with sample data
- `npm run db:studio` - Open Prisma Studio

## 🎨 Design System

### Theme Colors
- **Cream**: #FFF7EE (Background)
- **Maroon**: #7B1E2D (Primary)
- **Saffron**: #F39C12 (Accent)
- **Chili**: #B71C1C (Error/Danger)
- **Gold**: #C79A2A (Secondary)
- **Cardamom**: #2F6F4A (Success)

### Typography
- **Headings**: Playfair Display (Serif)
- **Body**: Inter (Sans-serif)

### Components
- Custom button styles (btn-primary, btn-secondary, btn-outline)
- Card components with hover effects
- Form input styles
- Responsive grid layouts

## 🛒 E-commerce Features

### Product Management
- Product catalog with categories (Sweets, Hot Snacks, Pickles, Powders, Gift Boxes)
- Product variants and inventory management
- Product images with optimization
- SEO-friendly product pages

### Shopping Cart
- Persistent cart for logged-in users
- localStorage cart for guests
- Real-time cart updates
- Cart item quantity management

### Checkout Process
1. **Address Selection**: Delivery and billing addresses
2. **Payment**: Razorpay integration with multiple payment methods
3. **Order Confirmation**: Email notifications

### Order Management
- Order tracking with status updates
- Order history for customers
- Admin order management

## 🔐 Authentication

### User Roles
- **Customer**: Browse, order, track orders
- **Admin**: Manage products, orders, content

### Authentication Methods
- Email/password login
- Magic link authentication

## 💳 Payment Integration

### Razorpay Integration
- Order creation API
- Payment verification webhooks
- Multiple payment methods:
  - UPI
  - Credit/Debit Cards
  - Net Banking
  - Wallets
  - Cash on Delivery (COD)

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy
   vercel
   ```

2. **Environment Variables**
   - Add all environment variables in Vercel dashboard
   - Set `NEXTAUTH_URL` to your production domain

3. **Database**
   - Use Vercel Postgres or external PostgreSQL
   - Run migrations: `npm run db:push`

### Docker Deployment

1. **Build Image**
   ```bash
   docker build -t kotaiah-sweets .
   ```

2. **Run Container**
   ```bash
   docker run -p 3000:3000 --env-file .env kotaiah-sweets
   ```

## 🔧 Configuration

### Production Keys Setup

1. **Razorpay**
   - Switch from test to live keys
   - Update webhook URLs
   - Configure payment methods

2. **Database**
   - Use production PostgreSQL instance
   - Configure connection pooling
   - Set up backups

## 📊 Monitoring & Maintenance

### Performance Monitoring
- Core Web Vitals tracking
- Database query optimization
- Image optimization
- CDN configuration

### Security
- Rate limiting on APIs
- Input validation and sanitization
- Secure environment variables
- HTTPS enforcement

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Email: support@kotaiahsweets.com
- Documentation: [Link to documentation]
- Issues: [GitHub Issues]

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Prisma team for the excellent ORM
- Tailwind CSS for the utility-first CSS framework
- All open-source contributors

---

**Kotaiah's Sweets & Foods** - A Tradition of Sweetness Since 1900

