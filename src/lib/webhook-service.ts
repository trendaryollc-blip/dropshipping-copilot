/**
 * Webhook Service
 * Handles reliable outbound webhook delivery with exponential backoff retry logic.
 */

import axios, { AxiosError } from 'axios';

export interface WebhookPayload {
  url: string;
  event: string;
  data: Record<string, unknown>;
  secret?: string; // For generating HMAC signature
}

export interface WebhookResult {
  success: boolean;
  statusCode?: number;
  error?: string;
  attempts: number;
}

class WebhookService {
  private maxRetries = 3;
  private baseDelay = 1000; // 1 second

  /**
   * Generate HMAC signature for webhook payload
   */
  private generateSignature(payload: string, secret: string): string {
    const crypto = require('crypto');
    return crypto.createHmac('sha256', secret).update(payload).digest('hex');
  }

  /**
   * Send a webhook with retry logic
   */
  async sendWebhook(payload: WebhookPayload): Promise<WebhookResult> {
    const { url, event, data, secret } = payload;
    let attempts = 0;
    let lastError: string | undefined;
    let lastStatusCode: number | undefined;

    while (attempts < this.maxRetries) {
      attempts++;
      try {
        const stringifiedData = JSON.stringify(data);
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
          'X-Webhook-Event': event,
          'X-Webhook-Timestamp': new Date().toISOString(),
        };

        if (secret) {
          headers['X-Webhook-Signature'] = this.generateSignature(stringifiedData, secret);
        }

        const response = await axios.post(url, stringifiedData, {
          headers,
          timeout: 10000, // 10 second timeout
          validateStatus: (status) => status >= 200 && status < 300, // Only 2xx is success
        });

        console.log(`[WebhookService] Successfully delivered webhook to ${url} (Attempt ${attempts})`);
        return { success: true, statusCode: response.status, attempts };
      } catch (error) {
        const axiosError = error as AxiosError;
        lastStatusCode = axiosError.response?.status;
        lastError = axiosError.message || 'Unknown error';
        
        console.warn(`[WebhookService] Webhook delivery failed to ${url} (Attempt ${attempts}/${this.maxRetries}): ${lastError}`);

        // If it's a 4xx error (except 429 Too Many Requests), don't retry as it's likely a permanent failure
        if (lastStatusCode && lastStatusCode >= 400 && lastStatusCode < 500 && lastStatusCode !== 429) {
          console.error(`[WebhookService] Permanent failure (HTTP ${lastStatusCode}). Aborting retries.`);
          return { success: false, statusCode: lastStatusCode, error: lastError, attempts };
        }

        // Exponential backoff: 1s, 2s, 4s
        if (attempts < this.maxRetries) {
          const delay = this.baseDelay * Math.pow(2, attempts - 1);
          console.log(`[WebhookService] Retrying in ${delay}ms...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    console.error(`[WebhookService] Webhook delivery failed after ${attempts} attempts to ${url}`);
    return { success: false, statusCode: lastStatusCode, error: lastError, attempts };
  }

  /**
   * Send webhooks to multiple endpoints (e.g., for multiple subscribers)
   */
  async sendWebhooks(payloads: WebhookPayload[]): Promise<WebhookResult[]> {
    return Promise.all(payloads.map((p) => this.sendWebhook(p)));
  }
}

export const webhookService = new WebhookService();
export default webhookService;