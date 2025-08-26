#!/bin/bash

# WhatsApp Invoice SaaS Deployment Script
# This script helps deploy the application to various platforms

set -e

echo "🚀 WhatsApp Invoice SaaS Deployment Script"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
check_node() {
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js version 18+ is required. Current version: $(node -v)"
        exit 1
    fi
    
    print_success "Node.js version: $(node -v)"
}

# Check if npm is installed
check_npm() {
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    print_success "npm version: $(npm -v)"
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    npm install
    print_success "Dependencies installed successfully"
}

# Build the application
build_app() {
    print_status "Building the application..."
    npm run build
    print_success "Application built successfully"
}

# Run database migrations
run_migrations() {
    print_status "Running database migrations..."
    npx prisma generate
    npx prisma db push
    print_success "Database migrations completed"
}

# Check environment variables
check_env() {
    print_status "Checking environment variables..."
    
    if [ ! -f ".env.local" ]; then
        print_warning ".env.local file not found. Creating from template..."
        cp .env.example .env.local
        print_warning "Please update .env.local with your actual values"
        exit 1
    fi
    
    # Check required environment variables
    required_vars=("DATABASE_URL" "NEXTAUTH_SECRET" "PAYSTACK_SECRET_KEY" "PAYSTACK_PUBLIC_KEY")
    
    for var in "${required_vars[@]}"; do
        if ! grep -q "^${var}=" .env.local; then
            print_error "Missing required environment variable: $var"
            exit 1
        fi
    done
    
    print_success "Environment variables check passed"
}

# Run tests
run_tests() {
    print_status "Running tests..."
    npm run test
    print_success "Tests passed"
}

# Run linting
run_lint() {
    print_status "Running linting..."
    npm run lint
    print_success "Linting passed"
}

# Type checking
run_type_check() {
    print_status "Running TypeScript type checking..."
    npm run type-check
    print_success "Type checking passed"
}

# Deploy to Vercel
deploy_vercel() {
    print_status "Deploying to Vercel..."
    
    if ! command -v vercel &> /dev/null; then
        print_error "Vercel CLI is not installed. Please install it first: npm i -g vercel"
        exit 1
    fi
    
    vercel --prod
    print_success "Deployed to Vercel successfully"
}

# Deploy to Railway
deploy_railway() {
    print_status "Deploying to Railway..."
    
    if ! command -v railway &> /dev/null; then
        print_error "Railway CLI is not installed. Please install it first: npm i -g @railway/cli"
        exit 1
    fi
    
    railway up
    print_success "Deployed to Railway successfully"
}

# Start development server
start_dev() {
    print_status "Starting development server..."
    npm run dev
}

# Start production server
start_prod() {
    print_status "Starting production server..."
    npm start
}

# Show help
show_help() {
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  setup     - Initial setup (install deps, check env, run migrations)"
    echo "  build     - Build the application"
    echo "  test      - Run tests and linting"
    echo "  dev       - Start development server"
    echo "  prod      - Start production server"
    echo "  vercel    - Deploy to Vercel"
    echo "  railway   - Deploy to Railway"
    echo "  help      - Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 setup"
    echo "  $0 vercel"
    echo "  $0 dev"
}

# Main script logic
case "${1:-help}" in
    "setup")
        print_status "Running initial setup..."
        check_node
        check_npm
        check_env
        install_dependencies
        run_migrations
        print_success "Setup completed successfully!"
        ;;
    "build")
        check_node
        check_npm
        install_dependencies
        build_app
        ;;
    "test")
        check_node
        check_npm
        install_dependencies
        run_lint
        run_type_check
        run_tests
        ;;
    "dev")
        check_node
        check_npm
        install_dependencies
        start_dev
        ;;
    "prod")
        check_node
        check_npm
        install_dependencies
        build_app
        start_prod
        ;;
    "vercel")
        check_node
        check_npm
        install_dependencies
        run_lint
        run_type_check
        build_app
        deploy_vercel
        ;;
    "railway")
        check_node
        check_npm
        install_dependencies
        run_lint
        run_type_check
        build_app
        deploy_railway
        ;;
    "help"|*)
        show_help
        ;;
esac