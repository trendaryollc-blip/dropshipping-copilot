/**
 * Email Service using Resend
 * Handles transactional emails: order confirmations, abandoned cart, supplier messages, etc.
 * 
 * Requires: npm install resend
 */

import { Resend } from 'resend';

// Initialize Resend with API key from environment variables
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const FROM_EMAIL = process.env.EMAIL_FROM || 'DropEase <notifications@dropease.com>';

export interface EmailPayload {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

export class EmailService {
  /**
   * Send a transactional email
   */
  static async sendEmail(payload: EmailPayload): Promise<{ success: boolean; messageId?: string; error?: string }> {
    if (!resend) {
      console.warn('⚠️ Resend API key is not configured. Email not sent.');
      return { success: false, error: 'Resend API key not configured' };
    }

    try {
      const { to, subject, html, text, replyTo } = payload;
      
      const data = await resend.emails.send({
        from: FROM_EMAIL,
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
        text: text || html.replace(/<[^>]*>/g, ''), // Fallback to plain text if not provided
        replyTo,
      });

      if (data.error) {
        console.error('[EmailService] Failed to send email:', data.error);
        return { success: false, error: data.error.message };
      }

      console.log(`[EmailService] Email sent successfully to ${Array.isArray(to) ? to.join(', ') : to}. Message ID: ${data.data?.id}`);
      return { success: true, messageId: data.data?.id };
    } catch (error) {
      console.error('[EmailService] Unexpected error sending email:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  /**
   * Send order confirmation email to customer
   */
  static async sendOrderConfirmation(customerEmail: string, orderDetails: { orderId: string; total: number; items: { name: string; quantity: number }[] }): Promise<{ success: boolean; error?: string }> {
    const html = `
      <h1>Order Confirmed! 🎉</h1>
      <p>Thank you for your order. Here are the details:</p>
      <p><strong>Order ID:</strong> ${orderDetails.orderId}</p>
      <p><strong>Total:</strong> $${orderDetails.total.toFixed(2)}</p>
      <ul>
        ${orderDetails.items.map(item => `<li>${item.name} x ${item.quantity}</li>`).join('')}
      </ul>
      <p>We will notify you once your order is shipped.</p>
    `;

    return this.sendEmail({
      to: customerEmail,
      subject: `Order Confirmation #${orderDetails.orderId}`,
      html,
    });
  }

  /**
   * Send abandoned cart recovery email
   */
  static async sendAbandonedCartEmail(customerEmail: string, cartDetails: { items: { name: string; price: number }[]; discountCode?: string }): Promise<{ success: boolean; error?: string }> {
    const discountText = cartDetails.discountCode 
      ? `<p>Use code <strong>${cartDetails.discountCode}</strong> at checkout for 10% off!</p>` 
      : '';

    const html = `
      <h1>You left something behind! 🛒</h1>
      <p>Don't miss out on these great items:</p>
      <ul>
        ${cartDetails.items.map(item => `<li>${item.name} - $${item.price.toFixed(2)}</li>`).join('')}
      </ul>
      ${discountText}
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/cart">Complete your purchase now</a></p>
    `;

    return this.sendEmail({
      to: customerEmail,
      subject: 'Complete your purchase - Items waiting in your cart!',
      html,
    });
  }

  /**
   * Send low stock alert to admin
   */
  static async sendLowStockAlert(adminEmail: string, productDetails: { name: string; currentStock: number; threshold: number }): Promise<{ success: boolean; error?: string }> {
    const html = `
      <h1>⚠️ Low Stock Alert</h1>
      <p>The following product is running low on inventory:</p>
      <p><strong>Product:</strong> ${productDetails.name}</p>
      <p><strong>Current Stock:</strong> ${productDetails.currentStock}</p>
      <p><strong>Threshold:</strong> ${productDetails.threshold}</p>
      <p>Please restock soon to avoid losing sales.</p>
    `;

    return this.sendEmail({
      to: adminEmail,
      subject: `Low Stock Alert: ${productDetails.name}`,
      html,
    });
  }
}

export default EmailService;