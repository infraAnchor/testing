'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  MessageCircle, 
  Save,
  Eye,
  X
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { formatCurrency, calculateInvoiceTotal, generateInvoiceNumber } from '@/lib/utils';

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export default function CreateInvoicePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    dueDate: '',
    notes: '',
  });
  const [items, setItems] = useState<InvoiceItem[]>([
    {
      id: '1',
      description: '',
      quantity: 1,
      unitPrice: 0,
      total: 0,
    },
  ]);
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      unitPrice: 0,
      total: 0,
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitPrice') {
          updatedItem.total = updatedItem.quantity * updatedItem.unitPrice;
        }
        return updatedItem;
      }
      return item;
    }));
  };

  const { subtotal, discountAmount, taxAmount, total } = calculateInvoiceTotal(
    items,
    discount,
    tax
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate form
      if (!formData.customerName.trim()) {
        toast.error('Customer name is required');
        return;
      }

      if (!formData.customerPhone.trim()) {
        toast.error('Customer phone number is required');
        return;
      }

      if (items.some(item => !item.description.trim())) {
        toast.error('All items must have descriptions');
        return;
      }

      if (total <= 0) {
        toast.error('Invoice total must be greater than 0');
        return;
      }

      // TODO: Implement actual invoice creation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Invoice created successfully!');
      router.push('/invoices');
    } catch (error) {
      toast.error('Failed to create invoice. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement draft saving
      await new Promise(resolve => setTimeout(resolve, 500));
      toast.success('Draft saved successfully!');
    } catch (error) {
      toast.error('Failed to save draft.');
    } finally {
      setIsLoading(false);
    }
  };

  const InvoicePreview = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Invoice Preview</h2>
            <button
              onClick={() => setShowPreview(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="invoice-preview">
            <div className="invoice-header">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">InvoicePro</h3>
                  <p className="text-sm text-gray-600">Professional Invoice SaaS</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">Invoice #{generateInvoiceNumber()}</p>
                  <p className="text-sm text-gray-600">{new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-2">Bill To:</h4>
              <p className="text-sm text-gray-900">{formData.customerName}</p>
              <p className="text-sm text-gray-600">{formData.customerPhone}</p>
              {formData.customerEmail && (
                <p className="text-sm text-gray-600">{formData.customerEmail}</p>
              )}
            </div>

            <div className="invoice-items">
              <div className="flex justify-between items-center py-2 border-b border-gray-200 font-medium text-sm">
                <span>Item</span>
                <span>Qty</span>
                <span>Price</span>
                <span>Total</span>
              </div>
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-900 flex-1">{item.description}</span>
                  <span className="text-sm text-gray-600 w-12 text-center">{item.quantity}</span>
                  <span className="text-sm text-gray-600 w-20 text-right">{formatCurrency(item.unitPrice)}</span>
                  <span className="text-sm font-medium text-gray-900 w-20 text-right">{formatCurrency(item.total)}</span>
                </div>
              ))}
            </div>

            <div className="invoice-total">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Discount ({discount}%):</span>
                  <span>-{formatCurrency(discountAmount)}</span>
                </div>
              )}
              {tax > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Tax ({tax}%):</span>
                  <span>{formatCurrency(taxAmount)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg border-t border-gray-200 pt-2 mt-2">
                <span>Total:</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>

            {formData.notes && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-1">Notes:</h4>
                <p className="text-sm text-gray-600">{formData.notes}</p>
              </div>
            )}
          </div>

          <div className="flex space-x-3 mt-6">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setShowPreview(false)}
            >
              Back to Edit
            </Button>
            <Button className="flex-1" onClick={handleSubmit} loading={isLoading}>
              Create Invoice
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Create Invoice</h1>
              <p className="text-sm text-gray-600">Create a new invoice in under 60 seconds</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleSaveDraft}>
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </Button>
            <Button size="sm" onClick={() => setShowPreview(true)}>
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
          </div>
        </div>
      </div>

      <div className="container-mobile container-tablet container-desktop py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Information */}
          <div className="dashboard-card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="customerName" className="form-label">
                  Customer Name *
                </label>
                <Input
                  id="customerName"
                  type="text"
                  placeholder="Enter customer name"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  required
                />
              </div>
              <div>
                <label htmlFor="customerPhone" className="form-label">
                  Phone Number *
                </label>
                <Input
                  id="customerPhone"
                  type="tel"
                  placeholder="0803 XXX XXXX"
                  value={formData.customerPhone}
                  onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                  required
                  className="phone-input"
                />
              </div>
              <div>
                <label htmlFor="customerEmail" className="form-label">
                  Email (optional)
                </label>
                <Input
                  id="customerEmail"
                  type="email"
                  placeholder="Enter email address"
                  value={formData.customerEmail}
                  onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="dueDate" className="form-label">
                  Due Date (optional)
                </label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Invoice Items */}
          <div className="dashboard-card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Invoice Items</h2>
              <Button type="button" variant="outline" size="sm" onClick={addItem}>
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </div>

            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={item.id} className="grid grid-cols-12 gap-3 items-end">
                  <div className="col-span-6">
                    <label className="form-label">Description *</label>
                    <Input
                      type="text"
                      placeholder="Item description"
                      value={item.description}
                      onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="form-label">Qty</label>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                    />
                  </div>
                  <div className="col-span-3">
                    <label className="form-label">Unit Price</label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="col-span-1">
                    {items.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Details */}
          <div className="dashboard-card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Additional Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="discount" className="form-label">
                  Discount (%)
                </label>
                <Input
                  id="discount"
                  type="number"
                  min="0"
                  max="100"
                  value={discount}
                  onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                />
              </div>
              <div>
                <label htmlFor="tax" className="form-label">
                  Tax (%)
                </label>
                <Input
                  id="tax"
                  type="number"
                  min="0"
                  max="100"
                  value={tax}
                  onChange={(e) => setTax(parseFloat(e.target.value) || 0)}
                />
              </div>
              <div>
                <label className="form-label">Total</label>
                <div className="text-2xl font-bold text-gray-900">
                  {formatCurrency(total)}
                </div>
              </div>
            </div>
            <div className="mt-4">
              <label htmlFor="notes" className="form-label">
                Notes (optional)
              </label>
              <textarea
                id="notes"
                rows={3}
                className="input"
                placeholder="Add any additional notes..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <Link href="/dashboard" className="flex-1">
              <Button variant="outline" className="w-full">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              className="flex-1"
              loading={isLoading}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Create & Send Invoice
            </Button>
          </div>
        </form>
      </div>

      {showPreview && <InvoicePreview />}
    </div>
  );
}