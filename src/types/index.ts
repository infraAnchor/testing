export interface User {
  id: string;
  email: string;
  phone?: string;
  businessName: string;
  businessAddress?: string;
  logoUrl?: string;
  subscriptionStatus: SubscriptionStatus;
  subscriptionEndDate?: Date;
  emailVerified?: Date;
  phoneVerified?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Customer {
  id: string;
  userId: string;
  name: string;
  phone: string;
  email?: string;
  totalSpent: number;
  invoiceCount: number;
  lastInvoiceDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  userId: string;
  invoiceNumber: string;
  customerId: string;
  items: InvoiceItem[];
  subtotal: number;
  discount?: number;
  tax?: number;
  total: number;
  status: InvoiceStatus;
  dueDate?: Date;
  paymentLink?: string;
  paidAt?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  customer?: Customer;
  payments?: Payment[];
}

export interface Payment {
  id: string;
  invoiceId: string;
  userId: string;
  gateway: PaymentGateway;
  reference: string;
  amount: number;
  status: PaymentStatus;
  gatewayResponse?: any;
  metadata?: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface Subscription {
  id: string;
  userId: string;
  plan: SubscriptionPlan;
  amount: number;
  status: SubscriptionStatus;
  nextBillingDate?: Date;
  paystackSubscriptionCode?: string;
  paystackCustomerCode?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum SubscriptionStatus {
  TRIAL = 'TRIAL',
  ACTIVE = 'ACTIVE',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
  PAST_DUE = 'PAST_DUE',
}

export enum SubscriptionPlan {
  TRIAL = 'TRIAL',
  STARTER = 'STARTER',
  PROFESSIONAL = 'PROFESSIONAL',
}

export enum InvoiceStatus {
  DRAFT = 'DRAFT',
  SENT = 'SENT',
  VIEWED = 'VIEWED',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
  CANCELLED = 'CANCELLED',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  SUCCESSFUL = 'SUCCESSFUL',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

export enum PaymentGateway {
  PAYSTACK = 'PAYSTACK',
  FLUTTERWAVE = 'FLUTTERWAVE',
}

export interface CreateInvoiceData {
  customerId: string;
  items: Omit<InvoiceItem, 'id' | 'total'>[];
  discount?: number;
  tax?: number;
  dueDate?: Date;
  notes?: string;
}

export interface CreateCustomerData {
  name: string;
  phone: string;
  email?: string;
}

export interface UpdateUserData {
  businessName?: string;
  businessAddress?: string;
  logoUrl?: string;
}

export interface DashboardStats {
  todayRevenue: number;
  pendingPayments: number;
  totalCustomers: number;
  totalInvoices: number;
  monthlyRevenue: number;
  weeklyRevenue: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PaystackPaymentData {
  amount: number;
  email: string;
  reference: string;
  callback_url: string;
  metadata?: {
    custom_fields: Array<{
      display_name: string;
      variable_name: string;
      value: string;
    }>;
  };
}

export interface PaystackWebhookData {
  event: string;
  data: {
    id: number;
    domain: string;
    amount: number;
    currency: string;
    reference: string;
    status: string;
    gateway_response: string;
    paid_at: string;
    channel: string;
    ip_address: string;
    metadata: any;
    customer: {
      id: number;
      first_name: string;
      last_name: string;
      email: string;
      customer_code: string;
      phone: string;
    };
    authorization: {
      authorization_code: string;
      bin: string;
      last4: string;
      exp_month: string;
      exp_year: string;
      channel: string;
      card_type: string;
      bank: string;
      country_code: string;
      brand: string;
      reusable: boolean;
      signature: string;
    };
    plan: any;
    split: any;
    order_id: any;
    paidAt: string;
    requested_amount: number;
    pos_transaction_data: any;
    source: any;
    fees_breakdown: any;
    transaction_date: string;
    plan_object: any;
    subaccount: any;
  };
}

export interface WhatsAppMessageData {
  customerName: string;
  invoiceNumber: string;
  businessName: string;
  items: InvoiceItem[];
  total: number;
  paymentLink: string;
}

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'number' | 'textarea' | 'select' | 'date';
  placeholder?: string;
  required?: boolean;
  validation?: any;
  options?: Array<{ value: string; label: string }>;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ToastMessage {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

export interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  current?: boolean;
}

export interface ChartData {
  name: string;
  value: number;
  color?: string;
}

export interface FilterOptions {
  status?: InvoiceStatus;
  dateRange?: {
    start: Date;
    end: Date;
  };
  customerId?: string;
  minAmount?: number;
  maxAmount?: number;
}

export interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
}

export interface ExportOptions {
  format: 'csv' | 'excel' | 'pdf';
  dateRange?: {
    start: Date;
    end: Date;
  };
  filters?: FilterOptions;
}