import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../../convex/_generated/api";
import Stripe from "stripe";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_mock", {
  apiVersion: "2025-08-27.basil",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    // Handle the event
    switch (event.type) {
      case "checkout.session.completed":
        // await convex.mutation(api.billing.handleWebhook, {
        //   eventType: event.type,
        //   data: event.data.object,
        // });
        console.log("Webhook event:", event.type, event.data.object);
        break;
      case "customer.subscription.updated":
        // await convex.mutation(api.billing.handleWebhook, {
        //   eventType: event.type,
        //   data: event.data.object,
        // });
        console.log("Webhook event:", event.type, event.data.object);
        break;
      case "customer.subscription.deleted":
        // await convex.mutation(api.billing.handleWebhook, {
        //   eventType: event.type,
        //   data: event.data.object,
        // });
        console.log("Webhook event:", event.type, event.data.object);
        break;
      case "invoice.payment_succeeded":
        // await convex.mutation(api.billing.handleWebhook, {
        //   eventType: event.type,
        //   data: event.data.object,
        // });
        console.log("Webhook event:", event.type, event.data.object);
        break;
      case "invoice.payment_failed":
        // await convex.mutation(api.billing.handleWebhook, {
        //   eventType: event.type,
        //   data: event.data.object,
        // });
        console.log("Webhook event:", event.type, event.data.object);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
