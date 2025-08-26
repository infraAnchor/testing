import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { PaystackService, PaystackWebhookData } from '@/lib/paystack';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-paystack-signature');

    if (!signature) {
      console.error('Missing Paystack signature');
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    const isValidSignature = PaystackService.verifyWebhookSignature(body, signature);
    if (!isValidSignature) {
      console.error('Invalid Paystack signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    const webhookData: PaystackWebhookData = JSON.parse(body);
    const { event, data } = webhookData;

    console.log('Paystack webhook received:', { event, reference: data.reference });

    // Handle different webhook events
    switch (event) {
      case 'charge.success':
        await handlePaymentSuccess(data);
        break;
      
      case 'transfer.success':
        await handleTransferSuccess(data);
        break;
      
      case 'subscription.create':
        await handleSubscriptionCreate(data);
        break;
      
      case 'subscription.disable':
        await handleSubscriptionDisable(data);
        break;
      
      default:
        console.log('Unhandled webhook event:', event);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handlePaymentSuccess(data: any) {
  try {
    const { reference, amount, status, gateway_response, paid_at } = data;

    // Find invoice by reference
    const invoice = await prisma.invoice.findUnique({
      where: { invoiceNumber: reference },
      include: { customer: true },
    });

    if (!invoice) {
      console.error('Invoice not found for reference:', reference);
      return;
    }

    // Check if payment already exists
    const existingPayment = await prisma.payment.findFirst({
      where: { reference },
    });

    if (existingPayment) {
      console.log('Payment already processed for reference:', reference);
      return;
    }

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        invoiceId: invoice.id,
        userId: invoice.userId,
        gateway: 'PAYSTACK',
        reference,
        amount: amount / 100, // Convert from kobo to naira
        status: status === 'success' ? 'SUCCESSFUL' : 'FAILED',
        gatewayResponse: data,
        metadata: {
          paid_at,
          gateway_response,
          channel: data.channel,
          ip_address: data.ip_address,
        },
      },
    });

    // Update invoice status if payment is successful
    if (status === 'success') {
      await prisma.invoice.update({
        where: { id: invoice.id },
        data: {
          status: 'PAID',
          paidAt: new Date(paid_at),
        },
      });

      // Update customer total spent
      await prisma.customer.update({
        where: { id: invoice.customerId },
        data: {
          totalSpent: {
            increment: amount / 100,
          },
          lastInvoiceDate: new Date(),
        },
      });

      // TODO: Send notification to user
      console.log('Payment processed successfully for invoice:', invoice.invoiceNumber);
    }

    console.log('Payment record created:', payment.id);
  } catch (error) {
    console.error('Error handling payment success:', error);
    throw error;
  }
}

async function handleTransferSuccess(data: any) {
  try {
    const { reference, amount, status, recipient } = data;

    // Handle bank transfer success
    console.log('Bank transfer successful:', { reference, amount, recipient });
    
    // TODO: Implement bank transfer handling logic
  } catch (error) {
    console.error('Error handling transfer success:', error);
    throw error;
  }
}

async function handleSubscriptionCreate(data: any) {
  try {
    const { subscription_code, customer_code, plan_code, status } = data;

    // Find user by customer code
    const user = await prisma.user.findFirst({
      where: { 
        subscriptions: {
          some: {
            paystackCustomerCode: customer_code,
          },
        },
      },
    });

    if (!user) {
      console.error('User not found for customer code:', customer_code);
      return;
    }

    // Update or create subscription
    await prisma.subscription.upsert({
      where: {
        paystackSubscriptionCode: subscription_code,
      },
      update: {
        status: status === 'active' ? 'ACTIVE' : 'CANCELLED',
      },
      create: {
        userId: user.id,
        plan: 'PROFESSIONAL', // TODO: Map plan_code to subscription plan
        amount: 3000, // TODO: Get from plan
        status: status === 'active' ? 'ACTIVE' : 'CANCELLED',
        paystackSubscriptionCode: subscription_code,
        paystackCustomerCode: customer_code,
      },
    });

    console.log('Subscription created/updated:', subscription_code);
  } catch (error) {
    console.error('Error handling subscription create:', error);
    throw error;
  }
}

async function handleSubscriptionDisable(data: any) {
  try {
    const { subscription_code, status } = data;

    // Update subscription status
    await prisma.subscription.update({
      where: {
        paystackSubscriptionCode: subscription_code,
      },
      data: {
        status: 'CANCELLED',
      },
    });

    console.log('Subscription disabled:', subscription_code);
  } catch (error) {
    console.error('Error handling subscription disable:', error);
    throw error;
  }
}

// GET endpoint for webhook verification (Paystack requirement)
export async function GET() {
  return NextResponse.json({
    message: 'Paystack webhook endpoint is active',
    timestamp: new Date().toISOString(),
  });
}