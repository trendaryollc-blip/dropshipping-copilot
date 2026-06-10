/**
 * Email API Route
 * Sends transactional emails via Resend.
 * Requires: RESEND_API_KEY env variable
 */

import { NextRequest, NextResponse } from "next/server"
import { EmailService } from "@/lib/email-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, ...payload } = body

    if (!type) {
      return NextResponse.json(
        { error: "Email type is required (e.g., order_confirmation, abandoned_cart, low_stock)" },
        { status: 400 }
      )
    }

    let result

    switch (type) {
      case "order_confirmation":
        result = await EmailService.sendOrderConfirmation(
          payload.customerEmail,
          payload.orderDetails
        )
        break

      case "abandoned_cart":
        result = await EmailService.sendAbandonedCartEmail(
          payload.customerEmail,
          payload.cartDetails
        )
        break

      case "low_stock":
        result = await EmailService.sendLowStockAlert(
          payload.adminEmail,
          payload.productDetails
        )
        break

      default:
        // Generic send
        if (!payload.to || !payload.subject || !payload.html) {
          return NextResponse.json(
            { error: "For generic emails, 'to', 'subject', and 'html' are required" },
            { status: 400 }
          )
        }
        result = await EmailService.sendEmail({
          to: payload.to,
          subject: payload.subject,
          html: payload.html,
          text: payload.text,
          replyTo: payload.replyTo,
        })
    }

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to send email" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      messageId: "messageId" in result ? (result as { messageId?: string }).messageId : null,
    })
  } catch (error) {
    console.error("[Email API] Error:", error)
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    )
  }
}