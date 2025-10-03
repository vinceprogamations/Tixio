import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover',
});

export async function POST(request: NextRequest) {
  try {
    const { eventId, quantity, price, userUid, organizerUid } = await request.json();

    // Validar dados obrigatórios
    if (!eventId || !quantity || !price || !userUid || !organizerUid) {
      return NextResponse.json(
        { error: 'Dados obrigatórios não fornecidos' },
        { status: 400 }
      );
    }

    // Calcular valor total em centavos (Stripe usa centavos)
    const totalAmount = Math.round(price * quantity * 100);

    // Criar Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount,
      currency: 'brl',
      metadata: {
        eventId,
        quantity: quantity.toString(),
        userUid,
        organizerUid,
      },
      description: `Ingresso para evento - ${quantity} unidade(s)`,
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error('Erro ao criar Payment Intent:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}