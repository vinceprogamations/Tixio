"use client";

import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PaymentFormProps {
  eventId: string;
  quantity: number;
  price: number;
  userUid: string;
  organizerUid: string;
  onSuccess: (ticketCode: string) => void;
  onError: (error: string) => void;
  onLoading: (loading: boolean) => void;
}

function PaymentForm({ eventId, quantity, price, userUid, organizerUid, onSuccess, onError, onLoading }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [stripeLoaded, setStripeLoaded] = useState(false);

  useEffect(() => {
    if (stripe && elements) {
      setStripeLoaded(true);
    }
  }, [stripe, elements]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    onLoading(true);

    try {
      // Criar Payment Intent
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

      const { clientSecret, paymentIntentId } = await response.json();

      if (!response.ok) {
        throw new Error('Erro ao criar pagamento');
      }

      // Confirmar pagamento
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardNumberElement)!,
        },
      });

      if (error) {
        onError(error.message || 'Erro no pagamento');
      } else if (paymentIntent?.status === 'succeeded') {
        // Confirmar no backend
        const confirmResponse = await fetch('/api/confirm-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paymentIntentId,
            userUid,
          }),
        });

        const result = await confirmResponse.json();
        
        if (confirmResponse.ok) {
          onSuccess(result.ticketCode);
        } else {
          onError(result.error || 'Erro ao confirmar pagamento');
        }
      }
    } catch (err: any) {
      onError(err.message || 'Erro na compra');
    } finally {
      setProcessing(false);
      onLoading(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  if (!stripeLoaded) {
    return (
      <div className="mt-3">
        <div className="alert alert-info">
          Carregando formulário de pagamento...
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3">
      <div className="mb-3">
        <label className="form-label">Dados do Cartão</label>
        <div className="border rounded p-3" style={{ backgroundColor: '#fff', minHeight: '200px' }}>
          <div className="mb-3">
            <label className="form-label small">Número do Cartão</label>
            <div style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: '#fff' }}>
              <CardNumberElement options={cardElementOptions} />
            </div>
          </div>
          <div className="row">
            <div className="col-6">
              <label className="form-label small">Data de Expiração</label>
              <div style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: '#fff' }}>
                <CardExpiryElement options={cardElementOptions} />
              </div>
            </div>
            <div className="col-6">
              <label className="form-label small">CVC</label>
              <div style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: '#fff' }}>
                <CardCvcElement options={cardElementOptions} />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <strong>Total: {(price * quantity).toLocaleString('pt-BR', { 
            style: 'currency', 
            currency: 'BRL' 
          })}</strong>
        </div>
        <button 
          type="submit" 
          className="btn btn-warning"
          disabled={!stripe || processing}
        >
          {processing ? 'Processando...' : 'Pagar com Stripe'}
        </button>
      </div>
    </form>
  );
}

interface StripePaymentFormProps {
  eventId: string;
  quantity: number;
  price: number;
  userUid: string;
  organizerUid: string;
  onSuccess: (ticketCode: string) => void;
  onError: (error: string) => void;
  onLoading: (loading: boolean) => void;
}

export default function StripePaymentForm(props: StripePaymentFormProps) {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm {...props} />
    </Elements>
  );
}