import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/server";
import { sendOrderConfirmation } from "@/lib/email";
import type { OrderWithItems } from "@/types";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Webhook error";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const { user_id, product_id, product_name, price_cents } = session.metadata || {};

    if (!user_id || !product_id) {
      return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
    }

    const supabase = createAdminClient();

    // Create order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id,
        status: "paid",
        total_cents: Number(price_cents),
        stripe_session_id: session.id,
        stripe_payment_intent_id:
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : null,
        customer_email: session.customer_email || session.customer_details?.email || "",
        customer_name: session.customer_details?.name || null,
        paid_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (orderError || !order) {
      console.error("Order insert error:", orderError);
      return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }

    // Create order items
    const { error: itemError } = await supabase.from("order_items").insert({
      order_id: order.id,
      product_id,
      product_name,
      quantity: 1,
      price_cents: Number(price_cents),
    });

    if (itemError) {
      console.error("Order item insert error:", itemError);
    }

    // Send confirmation email
    try {
      const orderWithItems: OrderWithItems = {
        ...order,
        order_items: [
          {
            id: "temp",
            order_id: order.id,
            product_id,
            product_name,
            quantity: 1,
            price_cents: Number(price_cents),
          },
        ],
      };
      await sendOrderConfirmation(orderWithItems);
    } catch (emailError) {
      console.error("Email send error:", emailError);
      // Don't fail the webhook for email errors
    }
  }

  return NextResponse.json({ received: true });
}
