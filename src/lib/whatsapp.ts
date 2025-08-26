import { generateWhatsAppMessage } from '@/lib/utils';

export interface WhatsAppShareData {
  customerName: string;
  customerPhone: string;
  invoiceNumber: string;
  businessName: string;
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  total: number;
  paymentLink: string;
  notes?: string;
}

export class WhatsAppService {
  static generateShareUrl(data: WhatsAppShareData): string {
    const message = this.formatMessage(data);
    const encodedMessage = encodeURIComponent(message);
    
    // Format phone number for WhatsApp
    const phone = this.formatPhoneForWhatsApp(data.customerPhone);
    
    return `https://wa.me/${phone}?text=${encodedMessage}`;
  }

  static formatMessage(data: WhatsAppShareData): string {
    const itemsText = data.items
      .map(item => `• ${item.description} - ${item.quantity}x ₦${item.unitPrice.toLocaleString()} = ₦${item.total.toLocaleString()}`)
      .join('\n');

    let message = `Hello ${data.customerName} 👋

*Invoice #${data.invoiceNumber}*
From: ${data.businessName}

*Items:*
${itemsText}

*Total: ₦${data.total.toLocaleString()}*

💳 *Pay now:* ${data.paymentLink}

Thank you for your business! 🙏`;

    if (data.notes) {
      message += `\n\n*Notes:* ${data.notes}`;
    }

    return message;
  }

  static formatPhoneForWhatsApp(phone: string): string {
    // Remove all non-digit characters
    let cleaned = phone.replace(/\D/g, '');
    
    // Handle Nigerian phone numbers
    if (cleaned.startsWith('234')) {
      return cleaned;
    }
    
    if (cleaned.startsWith('0')) {
      return '234' + cleaned.substring(1);
    }
    
    if (cleaned.length === 10) {
      return '234' + cleaned;
    }
    
    return cleaned;
  }

  static async shareInvoice(data: WhatsAppShareData): Promise<boolean> {
    try {
      const shareUrl = this.generateShareUrl(data);
      
      // For web browsers, open WhatsApp Web
      if (typeof window !== 'undefined') {
        window.open(shareUrl, '_blank');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('WhatsApp sharing error:', error);
      return false;
    }
  }

  static async shareMultipleInvoices(
    invoices: WhatsAppShareData[],
    maxInvoices: number = 10
  ): Promise<boolean[]> {
    try {
      const results: boolean[] = [];
      
      // Limit to max invoices
      const limitedInvoices = invoices.slice(0, maxInvoices);
      
      for (const invoice of limitedInvoices) {
        const result = await this.shareInvoice(invoice);
        results.push(result);
        
        // Add delay between shares to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      return results;
    } catch (error) {
      console.error('Multiple WhatsApp sharing error:', error);
      return invoices.map(() => false);
    }
  }

  static generateBulkMessage(invoices: WhatsAppShareData[]): string {
    if (invoices.length === 0) return '';
    
    const businessName = invoices[0].businessName;
    const totalAmount = invoices.reduce((sum, inv) => sum + inv.total, 0);
    
    let message = `Hello! 👋

*Bulk Invoice Summary*
From: ${businessName}

*Invoices:*
${invoices.map(inv => `• ${inv.invoiceNumber} - ₦${inv.total.toLocaleString()}`).join('\n')}

*Total Amount: ₦${totalAmount.toLocaleString()}*

Please review and process these invoices. Thank you! 🙏`;

    return message;
  }

  static validatePhoneNumber(phone: string): boolean {
    const cleaned = phone.replace(/\D/g, '');
    
    // Nigerian phone number patterns
    const patterns = [
      /^234[789][01]\d{8}$/, // +234 format
      /^0[789][01]\d{8}$/,   // 0 format
      /^[789][01]\d{8}$/,    // No prefix
    ];
    
    return patterns.some(pattern => pattern.test(cleaned));
  }

  static async copyToClipboard(text: string): Promise<boolean> {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        return true;
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
      
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    } catch (error) {
      console.error('Copy to clipboard error:', error);
      return false;
    }
  }

  static async shareViaAPI(data: WhatsAppShareData): Promise<boolean> {
    try {
      // TODO: Implement WhatsApp Business API integration
      // This would require a WhatsApp Business API provider
      
      const message = this.formatMessage(data);
      const phone = this.formatPhoneForWhatsApp(data.customerPhone);
      
      // Example API call (replace with actual provider)
      /*
      const response = await fetch('/api/whatsapp/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone,
          message,
          invoiceId: data.invoiceNumber,
        }),
      });
      
      return response.ok;
      */
      
      console.log('WhatsApp API sharing not implemented yet');
      return false;
    } catch (error) {
      console.error('WhatsApp API sharing error:', error);
      return false;
    }
  }
}

// WhatsApp sharing hook for React components
export const useWhatsAppShare = () => {
  const shareInvoice = async (data: WhatsAppShareData) => {
    return await WhatsAppService.shareInvoice(data);
  };

  const shareMultiple = async (invoices: WhatsAppShareData[]) => {
    return await WhatsAppService.shareMultipleInvoices(invoices);
  };

  const copyMessage = async (data: WhatsAppShareData) => {
    const message = WhatsAppService.formatMessage(data);
    return await WhatsAppService.copyToClipboard(message);
  };

  const getShareUrl = (data: WhatsAppShareData) => {
    return WhatsAppService.generateShareUrl(data);
  };

  return {
    shareInvoice,
    shareMultiple,
    copyMessage,
    getShareUrl,
  };
};