import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = 'NGN'): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Handle Nigerian phone numbers
  if (cleaned.startsWith('234')) {
    const number = cleaned.substring(3);
    return `+234 ${number.substring(0, 3)} ${number.substring(3, 6)} ${number.substring(6)}`;
  }
  
  if (cleaned.startsWith('0')) {
    const number = cleaned.substring(1);
    return `+234 ${number.substring(0, 3)} ${number.substring(3, 6)} ${number.substring(6)}`;
  }
  
  return phone;
}

export function generateInvoiceNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `INV-${year}-${random}`;
}

export function calculateInvoiceTotal(items: any[], discount: number = 0, tax: number = 0): {
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  total: number;
} {
  const subtotal = items.reduce((sum, item) => sum + (item.total || 0), 0);
  const discountAmount = (subtotal * discount) / 100;
  const taxAmount = ((subtotal - discountAmount) * tax) / 100;
  const total = subtotal - discountAmount + taxAmount;
  
  return {
    subtotal,
    discountAmount,
    taxAmount,
    total,
  };
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleString('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'paid':
    case 'successful':
      return 'text-green-600 bg-green-100';
    case 'pending':
      return 'text-yellow-600 bg-yellow-100';
    case 'overdue':
    case 'failed':
      return 'text-red-600 bg-red-100';
    case 'draft':
      return 'text-gray-600 bg-gray-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function validateNigerianPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '');
  
  // Nigerian phone number patterns
  const patterns = [
    /^234[789][01]\d{8}$/, // +234 format
    /^0[789][01]\d{8}$/,   // 0 format
    /^[789][01]\d{8}$/,    // No prefix
  ];
  
  return patterns.some(pattern => pattern.test(cleaned));
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export function generateWhatsAppMessage(data: {
  customerName: string;
  invoiceNumber: string;
  businessName: string;
  items: any[];
  total: number;
  paymentLink: string;
}): string {
  const itemsText = data.items
    .map(item => `• ${item.description} - ₦${item.total.toLocaleString()}`)
    .join('\n');
  
  return `Hello ${data.customerName} 👋

Invoice #${data.invoiceNumber}
From: ${data.businessName}

Items:
${itemsText}

Total: ₦${data.total.toLocaleString()}

Pay now: ${data.paymentLink}

Thank you for your business!`;
}

export function copyToClipboard(text: string): Promise<boolean> {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text).then(() => true).catch(() => false);
  }
  
  // Fallback for older browsers
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  textArea.style.top = '-999999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  
  try {
    document.execCommand('copy');
    document.body.removeChild(textArea);
    return Promise.resolve(true);
  } catch (err) {
    document.body.removeChild(textArea);
    return Promise.resolve(false);
  }
}

export function downloadFile(url: string, filename: string): void {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function isMobile(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}