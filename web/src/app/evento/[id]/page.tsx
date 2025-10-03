"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { auth, db } from "@/controller";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import StripePaymentForm from "@/components/StripePaymentForm";

export default function EventDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [eventData, setEventData] = useState<any>(null);
  const [qty, setQty] = useState(1);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        router.replace("/login");
        return;
      }
      setUser(u);
      const ref = doc(db, "events", params.id);
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        setError("Evento não encontrado");
        setLoading(false);
        return;
      }
      setEventData({ id: snap.id, ...snap.data() });
      setLoading(false);
    });
    return () => unsub();
  }, [params.id, router]);

  function handlePaymentSuccess(ticketCode: string) {
    setMsg(`Compra realizada com sucesso! Código do ingresso: ${ticketCode}`);
    setShowPaymentForm(false);
  }

  function handlePaymentError(error: string) {
    setError(error);
    setShowPaymentForm(false);
  }

  function handlePaymentLoading(loading: boolean) {
    setSaving(loading);
  }

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center text-muted">Carregando...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="alert alert-danger" role="alert">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ background: "#fff7ef" }}>
      <div className="container" style={{ maxWidth: 720 }}>
        <div className="card shadow-sm border-0" style={{ borderTop: "4px solid #ff7a00" }}>
          <div className="card-body p-4">
            <h5 className="card-title">{eventData?.organizerName || "Evento"}</h5>
            <p className="mb-1"><strong>Local:</strong> {eventData?.location}</p>
            <p className="mb-1"><strong>Data:</strong> {eventData?.date}</p>
            <p className="mb-1"><strong>Preço:</strong> {Number(eventData?.price || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
            <p className="mb-3"><strong>Tickets disponíveis:</strong> {eventData?.tickets}</p>

            {msg && <div className="alert alert-success py-2">{msg}</div>}
            {error && <div className="alert alert-danger py-2">{error}</div>}

            <div className="d-flex gap-2 align-items-center mb-3">
              <input 
                type="number" 
                min={1} 
                className="form-control" 
                style={{ maxWidth: 120 }} 
                value={qty} 
                onChange={(e)=>setQty(Number(e.target.value))} 
              />
              <button 
                className="btn btn-warning" 
                onClick={() => setShowPaymentForm(true)} 
                disabled={saving || Number(eventData?.tickets || 0) <= 0 || eventData?.active === false}
              >
                {saving ? "Processando..." : "Comprar ingresso"}
              </button>
            </div>

            {showPaymentForm && user && (
              <div className="mt-3">
                <StripePaymentForm
                  eventId={params.id}
                  quantity={qty}
                  price={Number(eventData?.price || 0)}
                  userUid={user.uid}
                  organizerUid={eventData?.organizerUid}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                  onLoading={handlePaymentLoading}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


