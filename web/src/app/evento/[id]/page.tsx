"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { auth, db } from "@/controller";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, runTransaction, collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function EventDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [eventData, setEventData] = useState<any>(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        router.replace("/login");
        return;
      }
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

  async function handlePurchase() {
    if (!params.id) return;
    setError(null);
    setMsg(null);
    setSaving(true);
    try {
      const bought = await runTransaction(db, async (trx) => {
        const ref = doc(db, "events", params.id);
        const snap = await trx.get(ref);
        if (!snap.exists()) throw new Error("Evento indisponível");
        const data = snap.data() as any;
        const n = Math.max(1, Number(qty || 1));
        const available = typeof data.tickets === "number" ? data.tickets : Number(data.tickets || 0);
        if (available < n) throw new Error("Quantidade indisponível");
        trx.update(ref, { tickets: available - n });
        return n;
      });
      // Cria documento de tickets do usuário
      const u = auth.currentUser;
      if (!u) throw new Error("Sessão expirada");
      const code = (typeof crypto !== 'undefined' && 'randomUUID' in crypto) ? (crypto as any).randomUUID() : `${params.id}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      await addDoc(collection(db, "tickets"), {
        userUid: u.uid,
        eventId: params.id,
        organizerUid: eventData?.organizerUid || null,
        quantity: bought,
        code,
        createdAt: serverTimestamp(),
      });
      setMsg("Compra realizada!");
    } catch (e: any) {
      setError(e?.message ?? "Falha na compra");
    } finally {
      setSaving(false);
    }
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
              <input type="number" min={1} className="form-control" style={{ maxWidth: 120 }} value={qty} onChange={(e)=>setQty(Number(e.target.value))} />
              <button className="btn btn-warning" onClick={handlePurchase} disabled={saving || Number(eventData?.tickets || 0) <= 0 || eventData?.active === false}>
              {saving ? "Processando..." : "Comprar ingresso"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


