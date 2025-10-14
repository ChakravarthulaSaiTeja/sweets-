#!/bin/bash

# Kotaiah's Sweets & Foods - Deployment Script
# This script helps deploy the application to various platforms

set -e

echo "🚀 Kotaiah's Sweets & Foods - Deployment Script"
echo "=============================================="

# Function to display usage
usage() {
    echo "Usage: $0 [OPTIONS]"
    echo "Options:"
    echo "  -p, --platform PLATFORM    Deployment platform (vercel|docker|manual)"
    echo "  -e, --env ENV              Environment (development|staging|production)"
    echo "  -h, --help                 Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 --platform vercel --env production"
    echo "  $0 --platform docker --env staging"
    echo "  $0 --platform manual --env development"
}

# Default values
PLATFORM=""
ENVIRONMENT="development"

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -p|--platform)
            PLATFORM="$2"
            shift 2
            ;;
        -e|--env)
            ENVIRONMENT="$2"
            shift 2
            ;;
        -h|--help)
            usage
            exit 0
            ;;
        *)
            echo "Unknown option $1"
            usage
            exit 1
            ;;
    esac
done

# Validate platform
if [[ -z "$PLATFORM" ]]; then
    echo "❌ Error: Platform is required"
    usage
    exit 1
fi

if [[ "$PLATFORM" != "vercel" && "$PLATFORM" != "docker" && "$PLATFORM" != "manual" ]]; then
    echo "❌ Error: Invalid platform. Must be one of: vercel, docker, manual"
    usage
    exit 1
fi

echo "📋 Deployment Configuration:"
echo "  Platform: $PLATFORM"
echo "  Environment: $ENVIRONMENT"
echo ""

# Check if .env file exists
if [[ ! -f ".env.local" && ! -f ".env" ]]; then
    echo "⚠️  Warning: No .env file found. Please create one from .env.example"
    echo "   cp .env.example .env.local"
    echo ""
fi

# Function to run tests
run_tests() {
    echo "🧪 Running tests..."
    if npm run test; then
        echo "✅ Tests passed"
    else
        echo "❌ Tests failed. Deployment aborted."
        exit 1
    fi
}

# Function to build application
build_app() {
    echo "🔨 Building application..."
    
    # Install dependencies
    echo "📦 Installing dependencies..."
    npm ci
    
    # Generate Prisma client
    echo "🗄️  Generating Prisma client..."
    npm run db:generate
    
    # Build application
    echo "🏗️  Building Next.js application..."
    npm run build
    
    echo "✅ Build completed successfully"
}

# Function to deploy to Vercel
deploy_vercel() {
    echo "🚀 Deploying to Vercel..."
    
    # Check if Vercel CLI is installed
    if ! command -v vercel &> /dev/null; then
        echo "📦 Installing Vercel CLI..."
        npm install -g vercel
    fi
    
    # Deploy based on environment
    if [[ "$ENVIRONMENT" == "production" ]]; then
        echo "🌐 Deploying to production..."
        vercel --prod
    else
        echo "🧪 Deploying to preview..."
        vercel
    fi
    
    echo "✅ Vercel deployment completed"
}

# Function to deploy with Docker
deploy_docker() {
    echo "🐳 Building Docker image..."
    
    # Build Docker image
    docker build -t kotaiah-sweets:$ENVIRONMENT .
    
    echo "✅ Docker image built successfully"
    echo ""
    echo "📋 To run the container:"
    echo "   docker run -p 3000:3000 --env-file .env.local kotaiah-sweets:$ENVIRONMENT"
    echo ""
    echo "📋 To push to registry:"
    echo "   docker tag kotaiah-sweets:$ENVIRONMENT your-registry/kotaiah-sweets:$ENVIRONMENT"
    echo "   docker push your-registry/kotaiah-sweets:$ENVIRONMENT"
}

# Function for manual deployment
deploy_manual() {
    echo "🔧 Manual deployment setup..."
    
    echo "📋 Manual deployment steps:"
    echo "1. Ensure your server has Node.js 18+ installed"
    echo "2. Copy the application files to your server"
    echo "3. Install dependencies: npm ci"
    echo "4. Generate Prisma client: npm run db:generate"
    echo "5. Set up environment variables"
    echo "6. Run database migrations: npm run db:push"
    echo "7. Build the application: npm run build"
    echo "8. Start the application: npm run start"
    echo ""
    echo "🔧 Production server setup:"
    echo "   - Use PM2 for process management"
    echo "   - Set up reverse proxy with Nginx"
    echo "   - Configure SSL certificates"
    echo "   - Set up monitoring and logging"
}

# Main deployment logic
echo "🔄 Starting deployment process..."

# Run tests for all platforms except manual
if [[ "$PLATFORM" != "manual" ]]; then
    run_tests
fi

# Build application for all platforms
build_app

# Deploy based on platform
case $PLATFORM in
    "vercel")
        deploy_vercel
        ;;
    "docker")
        deploy_docker
        ;;
    "manual")
        deploy_manual
        ;;
esac

echo ""
echo "🎉 Deployment process completed!"
echo ""
echo "📚 Next steps:"
echo "   - Verify the deployment"
echo "   - Test critical functionality"
echo "   - Monitor application logs"
echo "   - Set up monitoring and alerts"
echo ""
echo "🆘 Need help?"
echo "   - Check the README.md for detailed instructions"
echo "   - Review the deployment logs for any issues"
echo "   - Contact support if needed"
echo ""
echo "Thank you for using Kotaiah's Sweets & Foods! 🍯"
