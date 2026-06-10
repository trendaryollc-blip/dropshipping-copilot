/**
 * SMS Service using Twilio
 * Handles transactional SMS: order status updates, low stock alerts, 2FA, etc.
 * 
 * Requires: npm install twilio
 */

// Lazy Twilio client — avoids crash at import time if credentials are invalid placeholders
let twilioClient: any = null;

function getTwilioClient() {
  if (twilioClient !== null) return twilioClient;
  
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  
  if (!accountSid || !authToken || accountSid === 'your_twilio_account_sid_here') {
    twilioClient = null;
    return null;
  }
  
  try {
    // Dynamic require to avoid eager validation at import time
    const twilio = require('twilio');
    twilioClient = twilio(accountSid, authToken);
    return twilioClient;
  } catch {
    twilioClient = null;
    return null;
  }
}

const FROM_PHONE = process.env.TWILIO_PHONE_NUMBER || process.env.TWILIO_FROM_NUMBER || '';

export interface SMSPayload {
  to: string;
  body: string;
}

export class SMSService {
  /**
   * Send an SMS message
   */
  static async sendSMS(payload: SMSPayload): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const twilio = getTwilioClient();
    if (!twilio) {
      console.warn('⚠️ Twilio credentials are not configured. SMS not sent.');
      return { success: false, error: 'Twilio credentials not configured' };
    }

    try {
      const message = await twilio.messages.create({
        body: payload.body,
        from: FROM_PHONE,
        to: payload.to,
      });

      console.log(`[SMSService] SMS sent successfully to ${payload.to}. Message SID: ${message.sid}`);
      return { success: true, messageId: message.sid };
    } catch (error) {
      console.error('[SMSService] Failed to send SMS:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  /**
   * Send order status update to customer
   */
  static async sendOrderStatusUpdate(customerPhone: string, orderDetails: { orderId: string; status: string; trackingNumber?: string }): Promise<{ success: boolean; error?: string }> {
    let body = `Your order #${orderDetails.orderId} is now ${orderDetails.status}.`;
    if (orderDetails.trackingNumber) {
      body += ` Track it here: ${orderDetails.trackingNumber}`;
    }
    body += ' Thank you for shopping with us!';

    return this.sendSMS({
      to: customerPhone,
      body,
    });
  }

  /**
   * Send low stock alert to admin
   */
  static async sendLowStockAlert(adminPhone: string, productDetails: { name: string; currentStock: number }): Promise<{ success: boolean; error?: string }> {
    const body = `⚠️ LOW STOCK ALERT: "${productDetails.name}" is down to ${productDetails.currentStock} units. Please restock soon.`;

    return this.sendSMS({
      to: adminPhone,
      body,
    });
  }

  /**
   * Send 2FA verification code
   */
  static async sendVerificationCode(phone: string, code: string): Promise<{ success: boolean; error?: string }> {
    const body = `Your DropEase verification code is: ${code}. Do not share this code with anyone.`;

    return this.sendSMS({
      to: phone,
      body,
    });
  }
}

export default SMSService;