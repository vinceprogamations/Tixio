import { loadStripe } from '@stripe/stripe-js';

// Carrega o Stripe.js
export const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// Função para criar Payment Intent
export async function createPaymentIntent(eventId: string, quantity: number, price: number, userUid: string, organizerUid: string) {
  const response = await fetch('/api/create-payment-intent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      eventId,
      quantity,
      price,
      userUid,
      organizerUid,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erro ao criar pagamento');
  }

  return response.json();
}

// Função para confirmar pagamento
export async function confirmPayment(paymentIntentId: string, userUid: string) {
  const response = await fetch('/api/confirm-payment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      paymentIntentId,
      userUid,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erro ao confirmar pagamento');
  }

  return response.json();
}