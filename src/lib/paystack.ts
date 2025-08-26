import axios from 'axios';
import crypto from 'crypto';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_PUBLIC_KEY = process.env.PAYSTACK_PUBLIC_KEY;
const PAYSTACK_WEBHOOK_SECRET = process.env.PAYSTACK_WEBHOOK_SECRET;

const paystackApi = axios.create({
  baseURL: 'https://api.paystack.co',
  headers: {
    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
    'Content-Type': 'application/json',
  },
});

export interface PaystackTransaction {
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
  data: PaystackTransaction;
}

export class PaystackService {
  static async initializeTransaction(data: PaystackPaymentData) {
    try {
      const response = await paystackApi.post('/transaction/initialize', {
        amount: data.amount * 100, // Convert to kobo
        email: data.email,
        reference: data.reference,
        callback_url: data.callback_url,
        metadata: data.metadata,
        channels: ['card', 'bank_transfer', 'ussd', 'bank'],
      });

      return response.data;
    } catch (error) {
      console.error('Paystack initialization error:', error);
      throw new Error('Failed to initialize payment');
    }
  }

  static async verifyTransaction(reference: string) {
    try {
      const response = await paystackApi.get(`/transaction/verify/${reference}`);
      return response.data;
    } catch (error) {
      console.error('Paystack verification error:', error);
      throw new Error('Failed to verify payment');
    }
  }

  static async createCustomer(email: string, first_name: string, last_name: string, phone?: string) {
    try {
      const response = await paystackApi.post('/customer', {
        email,
        first_name,
        last_name,
        phone,
      });
      return response.data;
    } catch (error) {
      console.error('Paystack customer creation error:', error);
      throw new Error('Failed to create customer');
    }
  }

  static async createSubscription(customerCode: string, planCode: string) {
    try {
      const response = await paystackApi.post('/subscription', {
        customer: customerCode,
        plan: planCode,
      });
      return response.data;
    } catch (error) {
      console.error('Paystack subscription creation error:', error);
      throw new Error('Failed to create subscription');
    }
  }

  static verifyWebhookSignature(payload: string, signature: string): boolean {
    try {
      const hash = crypto
        .createHmac('sha512', PAYSTACK_WEBHOOK_SECRET!)
        .update(payload)
        .digest('hex');
      
      return hash === signature;
    } catch (error) {
      console.error('Webhook signature verification error:', error);
      return false;
    }
  }

  static async generatePaymentLink(data: {
    amount: number;
    email: string;
    reference: string;
    metadata?: any;
  }) {
    try {
      const response = await paystackApi.post('/transaction/initialize', {
        amount: data.amount * 100,
        email: data.email,
        reference: data.reference,
        metadata: data.metadata,
        channels: ['card', 'bank_transfer', 'ussd', 'bank'],
      });

      return response.data.data.authorization_url;
    } catch (error) {
      console.error('Payment link generation error:', error);
      throw new Error('Failed to generate payment link');
    }
  }

  static async getTransactionStatus(reference: string) {
    try {
      const response = await paystackApi.get(`/transaction/verify/${reference}`);
      return response.data.data.status;
    } catch (error) {
      console.error('Transaction status check error:', error);
      throw new Error('Failed to check transaction status');
    }
  }

  static async refundTransaction(reference: string, amount?: number) {
    try {
      const payload: any = { transaction: reference };
      if (amount) {
        payload.amount = amount * 100; // Convert to kobo
      }

      const response = await paystackApi.post('/refund', payload);
      return response.data;
    } catch (error) {
      console.error('Refund error:', error);
      throw new Error('Failed to process refund');
    }
  }

  static async getBankList() {
    try {
      const response = await paystackApi.get('/bank');
      return response.data.data;
    } catch (error) {
      console.error('Bank list fetch error:', error);
      throw new Error('Failed to fetch bank list');
    }
  }

  static async resolveAccountNumber(accountNumber: string, bankCode: string) {
    try {
      const response = await paystackApi.get('/bank/resolve', {
        params: {
          account_number: accountNumber,
          bank_code: bankCode,
        },
      });
      return response.data.data;
    } catch (error) {
      console.error('Account resolution error:', error);
      throw new Error('Failed to resolve account number');
    }
  }
}

export const PAYSTACK_CONFIG = {
  publicKey: PAYSTACK_PUBLIC_KEY,
  secretKey: PAYSTACK_SECRET_KEY,
  webhookSecret: PAYSTACK_WEBHOOK_SECRET,
  currency: 'NGN',
  channels: ['card', 'bank_transfer', 'ussd', 'bank'],
  callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/verify`,
  webhookUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/paystack`,
};