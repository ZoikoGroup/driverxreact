import Stripe from "stripe";
export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

// Server-only secret. STRIPE_SECRET_KEY is the correct name; the legacy NEXT_PUBLIC_ name is still read
// (on the server only, never sent to browsers by this file) so existing deployments keep working while the
// variable is renamed and the key rotated. Remove the fallback afterwards. The client is created lazily so a
// missing key fails the request (503) instead of failing `next build`.
let warnedLegacy = false;
let stripeClient: Stripe | undefined;
function getStripe(): Stripe | undefined {
  if (stripeClient) return stripeClient;
  let key = process.env.STRIPE_SECRET_KEY;
  if (!key && process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY) {
    key = process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY;
    if (!warnedLegacy) {
      warnedLegacy = true;
      console.warn("[create-payment-intent] using legacy NEXT_PUBLIC_STRIPE_SECRET_KEY; set STRIPE_SECRET_KEY and remove the public variable after rotating the key");
    }
  }
  if (!key) return undefined;
  stripeClient = new Stripe(key);
  return stripeClient;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      cart = [],
      billingAddress = {},
      shippingAddress = {},
      subtotal = 0,
      shippingFee = 0,
      discountAmount = 0,
      total,
    } = body;

    /* ------------------------------
       VALIDATION
    ------------------------------ */
    const amount = Number(total);

    if (!amount || isNaN(amount) || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid total amount" },
        { status: 400 }
      );
    }

    /* ------------------------------
       CREATE PAYMENT INTENT
    ------------------------------ */
    const stripe = getStripe();
    if (!stripe) {
      return NextResponse.json({ error: "Payments are not configured" }, { status: 503 });
    }
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: "usd",

      automatic_payment_methods: {
        enabled: true,
      },

      metadata: {
        items: cart.length.toString(),
        subtotal: String(subtotal),
        shipping: String(shippingFee),
        discount: String(discountAmount),
      },
    });

    /* ------------------------------
       RESPONSE (SAFE)
    ------------------------------ */
    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err: any) {
    console.error("❌ Stripe PI Error:", err);

    return NextResponse.json(
      { error: "Payment initialization failed" },
      { status: 500 }
    );
  }
}