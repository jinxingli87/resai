import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe";
import { COURSES } from "@/lib/data";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { productId } = await request.json();

  const course = COURSES.find((c) => c.id === productId);
  if (!course) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const stripePriceId = process.env[course.stripe_price_env];
  if (!stripePriceId) {
    return NextResponse.json(
      { error: "This product is not yet available for purchase." },
      { status: 400 }
    );
  }

  const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_SITE_URL!;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    customer_email: user.email,
    line_items: [{ price: stripePriceId, quantity: 1 }],
    success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/courses`,
    metadata: {
      user_id: user.id,
      product_id: course.id,
      product_name: course.name,
      price_cents: course.price_cents.toString(),
    },
  });

  return NextResponse.json({ url: session.url });
}
