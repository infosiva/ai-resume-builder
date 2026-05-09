import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2026-04-22.dahlia' })

export async function POST(req: Request) {
  const origin = req.headers.get('origin') || 'https://resumevault.app'
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price: process.env.STRIPE_PRICE_ID!, quantity: 1 }],
    success_url: `${origin}/?upgraded=1&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: origin,
    metadata: { product: 'resumevault' },
  })
  return Response.json({ url: session.url })
}
