import { NextRequest, NextResponse } from 'next/server';
import { auth, db } from '@/controller';
import { doc, getDoc, runTransaction, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover',
});

export async function POST(request: NextRequest) {
  try {
    const { paymentIntentId, userUid } = await request.json();

    if (!paymentIntentId || !userUid) {
      return NextResponse.json(
        { error: 'Dados obrigatórios não fornecidos' },
        { status: 400 }
      );
    }

    // Verificar o status do pagamento no Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return NextResponse.json(
        { error: 'Pagamento não foi concluído com sucesso' },
        { status: 400 }
      );
    }

    const { eventId, quantity, organizerUid } = paymentIntent.metadata;

    // Processar a compra no Firestore
    const result = await runTransaction(db, async (trx) => {
      // Verificar se o evento ainda existe e tem tickets disponíveis
      const eventRef = doc(db, 'events', eventId);
      const eventSnap = await trx.get(eventRef);
      
      if (!eventSnap.exists()) {
        throw new Error('Evento não encontrado');
      }

      const eventData = eventSnap.data();
      const availableTickets = typeof eventData.tickets === 'number' ? eventData.tickets : Number(eventData.tickets || 0);
      const requestedQuantity = parseInt(quantity);

      if (availableTickets < requestedQuantity) {
        throw new Error('Quantidade de tickets indisponível');
      }

      // Atualizar estoque do evento
      trx.update(eventRef, { 
        tickets: availableTickets - requestedQuantity 
      });

      return { eventData, requestedQuantity };
    });

    // Criar documento de ticket do usuário
    const code = crypto.randomUUID ? crypto.randomUUID() : `${eventId}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    
    await addDoc(collection(db, 'tickets'), {
      userUid,
      eventId,
      organizerUid,
      quantity: result.requestedQuantity,
      code,
      paymentIntentId,
      createdAt: serverTimestamp(),
    });

    return NextResponse.json({
      success: true,
      message: 'Compra realizada com sucesso!',
      ticketCode: code,
    });

  } catch (error) {
    console.error('Erro ao confirmar pagamento:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}