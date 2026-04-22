import Stripe from "stripe";

let _stripe: Stripe | undefined;

export function getStripe(): Stripe {
  return (_stripe ??= new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-03-25.dahlia",
  }));
}
