/**
 * Payment Service
 * Handles Stripe integration for DropEase Pro subscription billing and payment processing.
 * 
 * Requires: npm install stripe
 */

import Stripe from 'stripe';

// Initialize Stripe with secret key from environment variables
const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2026-05-27.dahlia' })
  : null;

export interface CreateSubscriptionParams {
  customerId: string;
  priceId: string; // Stripe Price ID for the subscription tier
}

export interface CreateCheckoutSessionParams {
  customerId: string;
  priceId: string;
  successUrl: string;
  cancelUrl: string;
}

class PaymentService {
  /**
   * Create a new Stripe customer
   */
  async createCustomer(email: string, name: string): Promise<{ success: boolean; customerId?: string; error?: string }> {
    if (!stripe) {
      return { success: false, error: 'Stripe is not configured' };
    }

    try {
      const customer = await stripe.customers.create({
        email,
        name,
      });
      return { success: true, customerId: customer.id };
    } catch (error) {
      console.error('[PaymentService] Failed to create customer:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  /**
   * Create a subscription checkout session
   */
  async createCheckoutSession(params: CreateCheckoutSessionParams): Promise<{ success: boolean; sessionUrl?: string; error?: string }> {
    if (!stripe) {
      return { success: false, error: 'Stripe is not configured' };
    }

    try {
      const session = await stripe.checkout.sessions.create({
        customer: params.customerId,
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [
          {
            price: params.priceId,
            quantity: 1,
          },
        ],
        success_url: params.successUrl,
        cancel_url: params.cancelUrl,
      });

      return { success: true, sessionUrl: session.url || undefined };
    } catch (error) {
      console.error('[PaymentService] Failed to create checkout session:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  /**
   * Create a subscription directly (e.g., after a free trial or internal upgrade)
   */
  async createSubscription(params: CreateSubscriptionParams): Promise<{ success: boolean; subscriptionId?: string; error?: string }> {
    if (!stripe) {
      return { success: false, error: 'Stripe is not configured' };
    }

    try {
      const subscription = await stripe.subscriptions.create({
        customer: params.customerId,
        items: [{ price: params.priceId }],
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
        expand: ['latest_invoice.payment_intent'],
      });

      return { success: true, subscriptionId: subscription.id };
    } catch (error) {
      console.error('[PaymentService] Failed to create subscription:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  /**
   * Cancel a subscription
   */
  async cancelSubscription(subscriptionId: string): Promise<{ success: boolean; error?: string }> {
    if (!stripe) {
      return { success: false, error: 'Stripe is not configured' };
    }

    try {
      await stripe.subscriptions.cancel(subscriptionId);
      return { success: true };
    } catch (error) {
      console.error('[PaymentService] Failed to cancel subscription:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  /**
   * Handle Stripe webhook events (to be called from /api/webhooks/stripe)
   */
  async handleWebhook(payload: string, signature: string): Promise<{ success: boolean; event?: Stripe.Event; error?: string }> {
    if (!stripe) {
      return { success: false, error: 'Stripe is not configured' };
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      return { success: false, error: 'STRIPE_WEBHOOK_SECRET is not configured' };
    }

    try {
      const event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
      
      // Handle specific event types
      switch (event.type) {
        case 'checkout.session.completed': {
          console.log('[PaymentService] Checkout session completed:', event.data.object.id);
          const session = event.data.object as Stripe.Checkout.Session;
          // Update user's plan in Firestore to 'pro'
          try {
            const { updateDocument } = await import('@/lib/firestore-service');
            const customerId = session.customer as string;
            if (customerId) {
              // Find the user document by Stripe customer ID and upgrade their plan
              // In a real implementation, you'd map stripeCustomerId -> userId in a metadata field
              await updateDocument('users', session.client_reference_id || customerId, {
                plan: 'pro' as any,
                stripeCustomerId: customerId,
                subscriptionId: session.subscription as string,
              });
              console.log('[PaymentService] User plan upgraded to pro');
            }
          } catch (fbError) {
            console.error('[PaymentService] Failed to update user plan:', fbError);
          }
          break;
        }
        case 'customer.subscription.deleted': {
          console.log('[PaymentService] Subscription canceled:', event.data.object.id);
          const subscription = event.data.object as Stripe.Subscription;
          // Downgrade user's plan in Firestore to 'free'
          try {
            const { updateDocument } = await import('@/lib/firestore-service');
            const customerId = subscription.customer as string;
            if (customerId) {
              // Find user by stripeCustomerId and downgrade their plan
              await updateDocument('users', subscription.metadata?.userId || customerId, {
                plan: 'free' as any,
                subscriptionId: null as any,
              });
              console.log('[PaymentService] User plan downgraded to free');
            }
          } catch (fbError) {
            console.error('[PaymentService] Failed to update user plan:', fbError);
          }
          break;
        }
        default:
          console.log(`[PaymentService] Unhandled event type: ${event.type}`);
      }

      return { success: true, event };
    } catch (error) {
      console.error('[PaymentService] Webhook signature verification failed:', error);
      return { success: false, error: (error as Error).message };
    }
  }
}

export const paymentService = new PaymentService();
export default paymentService;