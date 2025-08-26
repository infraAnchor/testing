import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { PaystackService } from '@/lib/paystack';
import { generateInvoiceNumber, calculateInvoiceTotal } from '@/lib/utils';
import { z } from 'zod';

// Validation schemas
const createInvoiceSchema = z.object({
  customerId: z.string(),
  items: z.array(z.object({
    description: z.string().min(1),
    quantity: z.number().min(1),
    unitPrice: z.number().min(0),
  })),
  discount: z.number().min(0).max(100).optional(),
  tax: z.number().min(0).max(100).optional(),
  dueDate: z.string().optional(),
  notes: z.string().optional(),
});

const updateInvoiceSchema = z.object({
  status: z.enum(['DRAFT', 'SENT', 'PAID', 'CANCELLED']).optional(),
  items: z.array(z.object({
    description: z.string().min(1),
    quantity: z.number().min(1),
    unitPrice: z.number().min(0),
  })).optional(),
  discount: z.number().min(0).max(100).optional(),
  tax: z.number().min(0).max(100).optional(),
  dueDate: z.string().optional(),
  notes: z.string().optional(),
});

// GET /api/invoices - List invoices
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');
    const customerId = searchParams.get('customerId');
    const userId = searchParams.get('userId'); // TODO: Get from auth session

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = { userId };
    if (status) where.status = status;
    if (customerId) where.customerId = customerId;

    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({
        where,
        include: {
          customer: true,
          payments: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.invoice.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: invoices,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invoices' },
      { status: 500 }
    );
  }
}

// POST /api/invoices - Create invoice
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createInvoiceSchema.parse(body);
    const userId = body.userId; // TODO: Get from auth session

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Calculate totals
    const { subtotal, discountAmount, taxAmount, total } = calculateInvoiceTotal(
      validatedData.items,
      validatedData.discount || 0,
      validatedData.tax || 0
    );

    // Generate invoice number
    const invoiceNumber = generateInvoiceNumber();

    // Create invoice
    const invoice = await prisma.invoice.create({
      data: {
        userId,
        invoiceNumber,
        customerId: validatedData.customerId,
        items: validatedData.items,
        subtotal,
        discount: validatedData.discount || 0,
        tax: validatedData.tax || 0,
        total,
        dueDate: validatedData.dueDate ? new Date(validatedData.dueDate) : null,
        notes: validatedData.notes,
        status: 'DRAFT',
      },
      include: {
        customer: true,
      },
    });

    // Generate payment link if customer has email
    if (invoice.customer.email) {
      try {
        const paymentLink = await PaystackService.generatePaymentLink({
          amount: total,
          email: invoice.customer.email,
          reference: invoiceNumber,
          metadata: {
            custom_fields: [
              {
                display_name: 'Invoice Number',
                variable_name: 'invoice_number',
                value: invoiceNumber,
              },
              {
                display_name: 'Customer Name',
                variable_name: 'customer_name',
                value: invoice.customer.name,
              },
            ],
          },
        });

        // Update invoice with payment link
        await prisma.invoice.update({
          where: { id: invoice.id },
          data: { paymentLink },
        });

        invoice.paymentLink = paymentLink;
      } catch (error) {
        console.error('Failed to generate payment link:', error);
        // Continue without payment link
      }
    }

    return NextResponse.json({
      success: true,
      data: invoice,
      message: 'Invoice created successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating invoice:', error);
    return NextResponse.json(
      { error: 'Failed to create invoice' },
      { status: 500 }
    );
  }
}

// PUT /api/invoices - Update invoice
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    const validatedData = updateInvoiceSchema.parse(updateData);
    const userId = body.userId; // TODO: Get from auth session

    if (!userId || !id) {
      return NextResponse.json(
        { error: 'Unauthorized or missing invoice ID' },
        { status: 401 }
      );
    }

    // Check if invoice exists and belongs to user
    const existingInvoice = await prisma.invoice.findFirst({
      where: { id, userId },
    });

    if (!existingInvoice) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      );
    }

    // Recalculate totals if items are updated
    let updatePayload: any = validatedData;
    if (validatedData.items) {
      const { subtotal, discountAmount, taxAmount, total } = calculateInvoiceTotal(
        validatedData.items,
        validatedData.discount || existingInvoice.discount || 0,
        validatedData.tax || existingInvoice.tax || 0
      );

      updatePayload = {
        ...validatedData,
        items: validatedData.items,
        subtotal,
        total,
      };
    }

    // Update invoice
    const invoice = await prisma.invoice.update({
      where: { id },
      data: updatePayload,
      include: {
        customer: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: invoice,
      message: 'Invoice updated successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error updating invoice:', error);
    return NextResponse.json(
      { error: 'Failed to update invoice' },
      { status: 500 }
    );
  }
}