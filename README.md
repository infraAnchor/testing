# WhatsApp Invoice SaaS

A production-ready mobile-first web application for Nigerian SMEs to create and send invoices via WhatsApp with integrated payment links. Built with Next.js 14, TypeScript, and Tailwind CSS.

## 🚀 Features

### Core Features
- **60-Second Invoice Creation** - Mobile-optimized form for quick invoice generation
- **WhatsApp Integration** - One-click sharing with pre-formatted messages
- **Paystack Payment Integration** - Instant payment links for card and bank transfers
- **Mobile-First Design** - Optimized for Nigerian business owners on mobile devices
- **Real-time Payment Tracking** - Webhook-based payment status updates
- **Customer Management** - Store and reuse customer information
- **Business Analytics** - Revenue tracking and payment insights

### Technical Features
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Prisma ORM** with PostgreSQL
- **Tailwind CSS** for styling
- **Paystack API** integration
- **WhatsApp Web** sharing
- **PWA Support** for offline functionality
- **Responsive Design** for all screen sizes

## 📱 Target Users

Small businesses in Nigeria:
- Tailors and fashion designers
- Salons and beauty services
- Mini-marts and retail stores
- Freelancers and consultants
- Artisans and craftsmen
- Service providers

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Headless UI
- **Database**: PostgreSQL with Prisma ORM
- **Payment**: Paystack API
- **Authentication**: NextAuth.js
- **Deployment**: Vercel/Railway
- **Monitoring**: Sentry
- **Email**: Nodemailer

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Paystack account
- Cloudinary account (for file uploads)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/whatsapp-invoice-saas.git
   cd whatsapp-invoice-saas
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your environment variables:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/whatsapp_invoice_saas"
   
   # Authentication
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-nextauth-secret-key"
   
   # Paystack
   PAYSTACK_SECRET_KEY="sk_test_your_paystack_secret_key"
   PAYSTACK_PUBLIC_KEY="pk_test_your_paystack_public_key"
   PAYSTACK_WEBHOOK_SECRET="your_paystack_webhook_secret"
   
   # File Storage
   CLOUDINARY_CLOUD_NAME="your_cloudinary_cloud_name"
   CLOUDINARY_API_KEY="your_cloudinary_api_key"
   CLOUDINARY_API_SECRET="your_cloudinary_api_secret"
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📊 Database Schema

The application uses the following main tables:

- **Users** - Business owners and their profiles
- **Customers** - Customer information and history
- **Invoices** - Invoice details and status
- **Payments** - Payment records and gateway responses
- **Subscriptions** - User subscription plans

## 🔧 Configuration

### Paystack Setup

1. Create a Paystack account at [paystack.com](https://paystack.com)
2. Get your API keys from the dashboard
3. Set up webhook endpoint: `https://yourdomain.com/api/webhooks/paystack`
4. Configure webhook events: `charge.success`, `transfer.success`

### Cloudinary Setup

1. Create a Cloudinary account at [cloudinary.com](https://cloudinary.com)
2. Get your cloud name, API key, and secret
3. Configure upload presets for business logos

## 🚀 Deployment

### Vercel Deployment

1. **Connect your repository to Vercel**
2. **Set environment variables** in Vercel dashboard
3. **Deploy** - Vercel will automatically build and deploy

### Railway Deployment

1. **Connect your repository to Railway**
2. **Add PostgreSQL database** from Railway
3. **Set environment variables**
4. **Deploy** the application

### Manual Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start the production server**
   ```bash
   npm start
   ```

## 📱 Mobile Optimization

The application is optimized for mobile devices with:

- **Touch-friendly buttons** (44px minimum)
- **Responsive design** for all screen sizes
- **Bottom navigation** for mobile users
- **Offline support** with service workers
- **Fast loading** with optimized images
- **Nigerian phone number** formatting

## 🔒 Security Features

- **HTTPS only** in production
- **Input validation** with Zod schemas
- **SQL injection prevention** with Prisma ORM
- **XSS protection** with proper sanitization
- **Rate limiting** on API endpoints
- **Webhook signature verification**
- **Environment variable encryption**

## 📈 Analytics & Monitoring

- **Payment tracking** with real-time webhooks
- **Revenue analytics** with charts and reports
- **Customer insights** with spending patterns
- **Error tracking** with Sentry integration
- **Performance monitoring** with Vercel Analytics

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run type checking
npm run type-check

# Run linting
npm run lint
```

## 📝 API Documentation

### Invoice Endpoints

- `GET /api/invoices` - List invoices
- `POST /api/invoices` - Create invoice
- `PUT /api/invoices` - Update invoice
- `GET /api/invoices/[id]` - Get invoice details

### Payment Endpoints

- `POST /api/webhooks/paystack` - Paystack webhook
- `GET /api/payments/verify` - Verify payment

### Customer Endpoints

- `GET /api/customers` - List customers
- `POST /api/customers` - Create customer
- `PUT /api/customers/[id]` - Update customer

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs.invoicepro.com](https://docs.invoicepro.com)
- **Email**: support@invoicepro.com
- **WhatsApp**: +234 XXX XXX XXXX
- **Issues**: [GitHub Issues](https://github.com/yourusername/whatsapp-invoice-saas/issues)

## 🎯 Roadmap

### Phase 1 (Current)
- ✅ Basic invoice creation
- ✅ WhatsApp sharing
- ✅ Paystack integration
- ✅ Mobile-responsive design

### Phase 2 (Next)
- 🔄 WhatsApp Business API integration
- 🔄 Advanced analytics dashboard
- 🔄 Bulk invoice sending
- 🔄 Customer portal

### Phase 3 (Future)
- 📋 Multi-currency support
- 📋 Advanced reporting
- 📋 API for third-party integrations
- 📋 Mobile app (React Native)

## 🙏 Acknowledgments

- **Paystack** for payment processing
- **Next.js** team for the amazing framework
- **Tailwind CSS** for the utility-first CSS framework
- **Nigerian business community** for feedback and testing

---

Made with ❤️ for Nigerian businesses