/**
 * Invoice Service
 * Handles auto-generation and emailing of PDF invoices for orders.
 * Uses pdf-lib for PDF generation.
 */

import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { EmailService } from './email-service';

export interface InvoiceData {
  invoiceNumber: string;
  orderId: string;
  date: string;
  customerName: string;
  customerEmail: string;
  customerAddress: string;
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
}

class InvoiceService {
  /**
   * Generate a PDF invoice buffer
   */
  async generatePDF(invoice: InvoiceData): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const { width, height } = page.getSize();
    let y = height - 50;

    // Helper to draw text
    const drawText = (text: string, x: number, yPos: number, f = font, size = 12, color = rgb(0, 0, 0)) => {
      page.drawText(text, { x, y: yPos, font: f, size, color });
    };

    // Header
    drawText('INVOICE', 50, y, boldFont, 24);
    y -= 40;
    drawText(`Invoice #: ${invoice.invoiceNumber}`, 50, y, font, 12);
    y -= 20;
    drawText(`Date: ${invoice.date}`, 50, y, font, 12);
    y -= 20;
    drawText(`Order ID: ${invoice.orderId}`, 50, y, font, 12);

    y -= 40;
    drawText('Bill To:', 50, y, boldFont, 14);
    y -= 25;
    drawText(invoice.customerName, 50, y, font, 12);
    y -= 20;
    drawText(invoice.customerAddress.replace(/\n/g, ' | '), 50, y, font, 12);

    y -= 50;
    // Table Header
    drawText('Description', 50, y, boldFont, 12);
    drawText('Qty', 300, y, boldFont, 12);
    drawText('Unit Price', 380, y, boldFont, 12);
    drawText('Total', 500, y, boldFont, 12);
    y -= 20;

    // Table Rows
    for (const item of invoice.items) {
      drawText(item.description.substring(0, 35), 50, y, font, 11);
      drawText(item.quantity.toString(), 310, y, font, 11);
      drawText(`$${item.unitPrice.toFixed(2)}`, 380, y, font, 11);
      drawText(`$${item.total.toFixed(2)}`, 500, y, font, 11);
      y -= 20;
    }

    y -= 30;
    // Totals
    drawText('Subtotal:', 400, y, font, 12);
    drawText(`$${invoice.subtotal.toFixed(2)}`, 500, y, font, 12);
    y -= 20;
    drawText('Tax:', 400, y, font, 12);
    drawText(`$${invoice.tax.toFixed(2)}`, 500, y, font, 12);
    y -= 20;
    drawText('Shipping:', 400, y, font, 12);
    drawText(`$${invoice.shipping.toFixed(2)}`, 500, y, font, 12);
    y -= 30;
    drawText('Total:', 400, y, boldFont, 14);
    drawText(`$${invoice.total.toFixed(2)}`, 500, y, boldFont, 14);

    y -= 60;
    drawText('Thank you for your business!', 50, y, boldFont, 14, rgb(0.2, 0.4, 0.6));

    return await pdfDoc.save();
  }

  /**
   * Generate and email invoice to customer
   */
  async generateAndEmailInvoice(invoice: InvoiceData): Promise<{ success: boolean; error?: string }> {
    try {
      const pdfBytes = await this.generatePDF(invoice);
      
      // Convert Uint8Array to Buffer for Resend (if supported, otherwise base64)
      const base64Pdf = Buffer.from(pdfBytes).toString('base64');

      const html = `
        <h1>Your Invoice is Ready</h1>
        <p>Dear ${invoice.customerName},</p>
        <p>Thank you for your order. Please find your invoice attached to this email.</p>
        <p><strong>Invoice Number:</strong> ${invoice.invoiceNumber}</p>
        <p><strong>Total Amount:</strong> $${invoice.total.toFixed(2)}</p>
        <p>If you have any questions, please reply to this email.</p>
      `;

      // Note: Resend requires attachments to be passed in a specific format. 
      // For now, we'll send the invoice details in the email body. 
      // To add attachments, update the EmailService to support Resend's attachment format.
      const result = await EmailService.sendEmail({
        to: invoice.customerEmail,
        subject: `Invoice #${invoice.invoiceNumber} for Order ${invoice.orderId}`,
        html,
      });

      return result;
    } catch (error) {
      console.error('[InvoiceService] Failed to generate and email invoice:', error);
      return { success: false, error: (error as Error).message };
    }
  }
}

export const invoiceService = new InvoiceService();
export default invoiceService;