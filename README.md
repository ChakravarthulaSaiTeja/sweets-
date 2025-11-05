# Kotaiah's Foods - E-commerce Website

A modern, production-ready e-commerce web application for **Kotaiah's Foods** - A Tradition of Sweetness Since 1900. Built with Next.js 15, TypeScript, and Tailwind CSS, featuring a beautiful traditional design with comprehensive e-commerce functionality.

![Kotaiah's Foods](https://img.shields.io/badge/Brand-Kotaiah's%20Foods-8B1A1A)
![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

### 🛒 E-commerce Features
- **Product Catalog**: Browse products by category with search and filtering
- **Shopping Cart**: Persistent cart with localStorage support
- **Checkout Flow**: Complete checkout with address, delivery slots, and payment options
- **Order Tracking**: Track orders by order number or phone number
- **Admin Dashboard**: Complete product, order, category, and promotion management
- **Responsive Design**: Mobile-first design that works on all devices

### 🎨 Design & UX
- **Modern UI**: Beautiful gradient backgrounds, smooth animations, and hover effects
- **Brand Colors**: Burgundy (#8B1A1A), Gold (#D4AF37), and Amber (#FFB347) color scheme
- **Two-Tier Navigation**: Elegant navigation with logo, auth buttons, and category links
- **Enhanced Cards**: Animated admin dashboard cards with gradients and shadows
- **Image Optimization**: Automatic WebP/AVIF conversion and responsive sizing

### 🔧 Technical Features
- **Static Site Generation (SSG)**: Fast page loads with pre-rendered static pages
- **Image Optimization**: Next.js Image component with automatic optimization
- **TypeScript**: Full type safety throughout the application
- **Client-Side State**: localStorage-based data persistence
- **Form Validation**: Comprehensive validation with helpful error messages
- **Code Quality**: ESLint, TypeScript, and comprehensive code comments

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 15.5.4 (App Router)
- **Language**: TypeScript 5.0
- **Styling**: Tailwind CSS 4.0
- **UI Components**: Radix UI
- **Icons**: Lucide React
- **Animations**: Framer Motion, CSS animations

### State Management
- **React Context**: Cart context for shopping cart
- **PostgreSQL (Neon)**: Production database for persistent data
- **Next.js API Routes**: Backend API for all data operations

### Deployment
- **Recommended**: Vercel (automatic deployments)
- **Alternative**: Docker, Netlify, or any Node.js hosting

## 📋 Prerequisites

- **Node.js**: 18.x or higher
- **npm** or **yarn**: Package manager
- **Git**: Version control

> **Note**: This application uses PostgreSQL (Neon) for production data persistence. See [SETUP.md](./SETUP.md) for database configuration.

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/ChakravarthulaSaiTeja/sweets-.git
cd sweets-
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup (Optional)

Create a `.env.local` file for environment variables (only needed for advanced features):

```env
# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="Kotaiah's Foods"
```

### 4. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
sweets-/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── admin/             # Admin dashboard pages
│   │   │   ├── page.tsx       # Admin dashboard
│   │   │   ├── products/       # Product management
│   │   │   ├── orders/        # Order management
│   │   │   ├── categories/    # Category management
│   │   │   ├── promotions/    # Promotion management
│   │   │   ├── analytics/     # Analytics dashboard
│   │   │   └── settings/       # Admin settings
│   │   ├── products/          # Product pages
│   │   │   ├── page.tsx       # All products
│   │   │   └── [slug]/        # Product detail & category pages
│   │   ├── cart/              # Shopping cart page
│   │   ├── checkout/          # Checkout page
│   │   ├── track/             # Order tracking page
│   │   ├── auth/              # Authentication pages
│   │   └── ...                # Other pages
│   ├── components/             # React components
│   │   ├── home/              # Homepage sections
│   │   ├── products/          # Product components
│   │   ├── ui/                # Reusable UI components
│   │   ├── navigation.tsx     # Main navigation
│   │   ├── footer.tsx         # Site footer
│   │   └── conditional-layout.tsx # Conditional layout wrapper
│   ├── contexts/              # React contexts
│   │   └── cart-context.tsx   # Shopping cart context
│   ├── hooks/                 # Custom React hooks
│   │   └── useAdminData.ts    # Admin data sync hook
│   ├── lib/                   # Core utilities
│   │   └── static-data.ts     # Static product data
│   └── utils/                 # Helper functions
│       ├── index.ts          # Main utilities
│       └── types.ts          # TypeScript types
├── public/                    # Static assets
├── next.config.ts            # Next.js configuration
├── tailwind.config.ts       # Tailwind CSS configuration
└── package.json              # Dependencies
```

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run clean` | Remove `.next` and `node_modules` |
| `npm run rebuild` | Clean, install, and build |

## 🎨 Design System

### Color Palette

- **Burgundy (Primary)**: `#8B1A1A` - Main brand color
- **Gold (Accent)**: `#D4AF37` - Accent color for highlights
- **Amber (Secondary)**: `#FFB347` - Secondary accent
- **Cream (Background)**: `#FFF7EE` - Main background color

### Typography

- **Headings**: Playfair Display (Serif)
- **Body**: Inter (Sans-serif)

### Components

- Custom button styles with gradients and hover effects
- Animated cards with shadows and transitions
- Form inputs with consistent styling
- Responsive grid layouts

## 🛒 E-commerce Features

### Product Management
- Product catalog with categories (Hot Snacks, Pickles, Powders, Gift Boxes)
- Product detail pages with images, descriptions, and reviews
- Product visibility control (admin can hide/show products)
- Inventory management

### Shopping Cart
- Persistent cart using localStorage
- Real-time cart updates
- Quantity management
- Add to cart notifications

### Checkout Process
1. **Customer Information**: Name, email, phone
2. **Delivery Address**: Full address with validation
3. **Delivery Date & Slot**: Date picker and time slot selection
4. **Payment Method**: COD or Online payment
5. **Order Confirmation**: Order summary and confirmation

### Order Tracking
- Track by order number
- Track by phone number (normalized for matching)
- Order status timeline
- Delivery information display

### Admin Panel
- **Dashboard**: Overview with stats and quick navigation
- **Products**: Create, edit, delete, and manage product visibility
- **Orders**: View and manage customer orders
- **Categories**: Manage product categories
- **Promotions**: Create and manage promotional campaigns
- **Analytics**: Sales and performance metrics
- **Settings**: Store configuration and currency settings

## 🔐 Data Persistence

This application uses **PostgreSQL (Neon)** for production data persistence:

- **Database**: Neon Postgres (cloud-hosted PostgreSQL)
- **ORM**: Prisma for type-safe database access
- **API Routes**: Next.js API routes handle all database operations
- **Models**: User, Product, Variant, Category, Order, CartItem, Promotion, Settings

> **Note**: All data is persisted in Neon PostgreSQL database. See [SETUP.md](./SETUP.md) for database configuration.

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect Repository**
   ```bash
   npm i -g vercel
   vercel
   ```

2. **Environment Variables**
   - Add `NEXT_PUBLIC_APP_URL` in Vercel dashboard
   - Set to your production domain

3. **Automatic Deployments**
   - Vercel automatically deploys on every push to `main` branch

### Docker

1. **Build Image**
   ```bash
   docker build -t kotaiah-foods .
   ```

2. **Run Container**
   ```bash
   docker run -p 3000:3000 --env-file .env.local kotaiah-foods
   ```

### Other Platforms

- **Netlify**: Use Next.js plugin
- **AWS Amplify**: Connect GitHub repository
- **Railway**: Deploy with Node.js preset
- **Render**: Use Node.js service

## 📖 Documentation

- **[SETUP.md](./SETUP.md)**: Detailed setup instructions
- **[DEPLOYMENT.md](./DEPLOYMENT.md)**: Complete deployment guide for Vercel
- **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)**: Comprehensive API reference

## 🐛 Bug Fixes

### Phone Number Normalization
- **Fixed**: Phone numbers are now normalized (non-digits removed) when storing orders
- **Fixed**: Order tracking normalizes both stored and input phone numbers for consistent matching
- **Result**: Users can search with formatted phone numbers (e.g., "98-76-54-3210") and still find orders

## 🔧 Configuration

### Image Optimization

The project uses Next.js Image optimization with:
- Automatic WebP/AVIF conversion
- Responsive image sizing
- Remote image patterns configured
- See `IMAGE_OPTIMIZATION_SETUP.md` for details

### Admin Panel

Access the admin panel at `/admin`:
- Manage products, orders, categories, and promotions
- View analytics and configure settings
- All changes sync in real-time via localStorage

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- **Email**: info@kotaiahsweets.com
- **GitHub Issues**: [Open an issue](https://github.com/ChakravarthulaSaiTeja/sweets-/issues)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Radix UI for accessible component primitives
- Lucide for beautiful icons
- All open-source contributors

---

**Kotaiah's Foods** - A Tradition of Sweetness Since 1900

Made with ❤️ using Next.js and TypeScript
