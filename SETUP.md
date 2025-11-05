# Setup Guide - Kotaiah's Foods

Complete setup instructions for getting the Kotaiah's Foods e-commerce website up and running.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Development](#development)
5. [Production Build](#production-build)
6. [Deployment](#deployment)
7. [Troubleshooting](#troubleshooting)

## 🔧 Prerequisites

Before you begin, ensure you have the following installed:

### Required Software

- **Node.js**: Version 18.x or higher
  - Download from [nodejs.org](https://nodejs.org/)
  - Verify installation: `node --version`
  - Verify npm: `npm --version`

- **Git**: For version control
  - Download from [git-scm.com](https://git-scm.com/)
  - Verify installation: `git --version`

### Optional Software

- **VS Code**: Recommended code editor
- **Docker**: For containerized deployment (optional)

## 📥 Installation

### Step 1: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/ChakravarthulaSaiTeja/sweets-.git

# Navigate to project directory
cd sweets-
```

### Step 2: Install Dependencies

```bash
# Install all dependencies
npm install
```

This will install:
- Next.js 15.5.4 and React 19
- TypeScript 5.0
- Tailwind CSS 4.0
- All UI components and utilities
- Development dependencies

### Step 3: Verify Installation

```bash
# Check if installation was successful
npm list --depth=0
```

You should see all packages listed without errors.

## ⚙️ Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Create environment file
touch .env.local
```

Add the following variables (optional for basic functionality):

```env
# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="Kotaiah's Foods"
```

> **Note**: This application uses localStorage for data persistence, so environment variables are optional for basic functionality. They may be needed for advanced features like email notifications or payment processing.

### Next.js Configuration

The `next.config.ts` file is already configured with:
- Image optimization enabled
- Remote image patterns configured
- Static Site Generation (SSG) setup
- ESLint ignore during builds

No additional configuration needed unless you want to customize:
- Image domains
- Output settings (for Docker)
- Build optimizations

## 🚀 Development

### Start Development Server

```bash
# Start with Turbopack (faster)
npm run dev
```

The application will be available at:
- **Local**: http://localhost:3000
- **Network**: http://[your-ip]:3000

### Development Features

- **Hot Reload**: Changes automatically refresh the browser
- **Turbopack**: Fast bundling and compilation
- **TypeScript**: Type checking in real-time
- **ESLint**: Code quality checks

### Available Routes

- `/` - Homepage
- `/products` - All products
- `/products/[slug]` - Product detail or category page
- `/cart` - Shopping cart
- `/checkout` - Checkout page
- `/track` - Order tracking
- `/admin` - Admin dashboard
- `/admin/products` - Product management
- `/admin/orders` - Order management
- `/admin/promotions` - Promotion management
- `/admin/analytics` - Analytics dashboard
- `/admin/settings` - Admin settings

## 🏗️ Production Build

### Build for Production

```bash
# Build the application
npm run build
```

This will:
- Compile TypeScript
- Optimize images
- Generate static pages
- Create production bundle

### Start Production Server

```bash
# Start production server
npm run start
```

The production server runs on port 3000 by default.

### Build Output

After building, you'll find:
- `.next/` - Compiled Next.js application
- Static HTML files for all pages
- Optimized images and assets

## 📦 Deployment

### Vercel (Recommended)

#### Option 1: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

#### Option 2: Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure environment variables (if needed)
5. Deploy

**Vercel automatically:**
- Detects Next.js
- Runs `npm run build`
- Deploys to production
- Sets up HTTPS
- Provides CDN

### Docker Deployment

#### Build Docker Image

```bash
# Build the image
docker build -t kotaiah-foods:latest .
```

#### Run Docker Container

```bash
# Run the container
docker run -p 3000:3000 \
  --env-file .env.local \
  kotaiah-foods:latest
```

**Note**: For Docker deployment, uncomment `output: 'standalone'` in `next.config.ts` if needed.

### Netlify Deployment

1. Connect your GitHub repository
2. Install Netlify Next.js plugin
3. Set build command: `npm run build`
4. Set publish directory: `.next`
5. Deploy

### Other Platforms

- **Railway**: Connect GitHub, deploy Node.js service
- **Render**: Connect repository, use Node.js service
- **AWS Amplify**: Connect GitHub, auto-detect Next.js
- **DigitalOcean**: Use App Platform with Node.js

## 🧹 Cleanup & Maintenance

### Clean Build Files

```bash
# Remove .next directory and node_modules
npm run clean
```

### Rebuild from Scratch

```bash
# Clean, reinstall, and rebuild
npm run rebuild
```

### Update Dependencies

```bash
# Check for outdated packages
npm outdated

# Update packages
npm update

# Update specific package
npm install package-name@latest
```

## 🔍 Troubleshooting

### Common Issues

#### 1. Port Already in Use

**Error**: `Port 3000 is already in use`

**Solution**:
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 npm run dev
```

#### 2. Build Memory Issues

**Error**: `JavaScript heap out of memory`

**Solution**: Already configured in `package.json`:
```json
"build": "NODE_OPTIONS='--max-old-space-size=4096' next build"
```

#### 3. Image Optimization Errors

**Error**: Image loading issues

**Solution**: 
- Check `next.config.ts` for `remotePatterns`
- Verify image URLs are HTTPS
- Check browser console for CORS errors

#### 4. TypeScript Errors

**Error**: Type errors in development

**Solution**:
```bash
# Check TypeScript
npx tsc --noEmit

# Fix auto-fixable issues
npm run lint -- --fix
```

#### 5. localStorage Not Working

**Issue**: Data not persisting

**Solution**:
- Check browser console for errors
- Verify localStorage is enabled
- Check browser private/incognito mode (localStorage may be restricted)

### Development Tips

1. **Clear Browser Cache**: If styles aren't updating, clear cache
2. **Check Console**: Browser DevTools for errors
3. **Restart Dev Server**: Sometimes needed after config changes
4. **Check Node Version**: Ensure Node.js 18+ is installed

## 📊 Project Structure Explained

### Key Directories

- **`src/app/`**: Next.js App Router pages
- **`src/components/`**: Reusable React components
- **`src/contexts/`**: React Context providers
- **`src/hooks/`**: Custom React hooks
- **`src/lib/`**: Core utilities and data
- **`src/utils/`**: Helper functions
- **`public/`**: Static assets (images, fonts, etc.)

### Key Files

- **`next.config.ts`**: Next.js configuration
- **`tailwind.config.ts`**: Tailwind CSS configuration
- **`package.json`**: Dependencies and scripts
- **`tsconfig.json`**: TypeScript configuration

## 🎯 Next Steps

After setup:

1. **Explore the Admin Panel**: Visit `/admin` to manage products
2. **Add Products**: Use the admin panel to add your products
3. **Test Checkout**: Create a test order
4. **Customize**: Update colors, content, and branding
5. **Deploy**: Deploy to Vercel or your preferred platform

## 📚 Additional Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **TypeScript**: https://www.typescriptlang.org/docs
- **Vercel Deployment**: https://vercel.com/docs

## 🆘 Getting Help

If you encounter issues:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review error messages in browser console
3. Check the [GitHub Issues](https://github.com/ChakravarthulaSaiTeja/sweets-/issues)
4. Create a new issue with:
   - Error message
   - Steps to reproduce
   - Your environment (OS, Node version)

---

**Happy Coding! 🎉**

For more information, see the [README.md](./README.md) file.

