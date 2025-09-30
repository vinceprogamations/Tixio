"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/controller";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, limit, query, updateDoc, where } from "firebase/firestore";

export default function ValidatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isCompany, setIsCompany] = useState(false);
  const [code, setCode] = useState("");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) return router.replace("/login");
      setIsCompany(true); // dashboard já garantiu tipo; aqui assumimos uso interno
      setLoading(false);
    });
    return () => unsub();
  }, [router]);

  async function handleSearch() {
    setError(null);
    setResult(null);
    if (!code.trim()) return;
    try {
      if (!auth.currentUser) throw new Error("Não autenticado");
      const q = query(collection(db, "tickets"), where("code", "==", code.trim()), where("organizerUid", "==", auth.currentUser.uid), limit(1));
      const snap = await getDocs(q);
      if (snap.empty) {
        setError("Ingresso não encontrado para sua organização");
        return;
      }
      const docSnap = snap.docs[0];
      setResult({ id: docSnap.id, ...(docSnap.data() as any) });
    } catch (e: any) {
      setError(e?.message ?? "Erro ao buscar ingresso");
    }
  }

  async function handleValidate() {
    if (!result) return;
    setSaving(true);
    setError(null);
    try {
      await updateDoc((await import("firebase/firestore")).doc(db, "tickets", result.id), {
        usedAt: (await import("firebase/firestore")).serverTimestamp(),
        usedBy: auth.currentUser?.uid || null,
      });
      setResult((prev: any) => ({ ...prev, usedAt: new Date(), usedBy: auth.currentUser?.uid || null }));
    } catch (e: any) {
      setError(e?.message ?? "Erro ao validar ingresso");
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

  if (!isCompany) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="alert alert-danger">Apenas empresas podem validar ingressos.</div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ background: "#fff7ef" }}>
      <div className="container" style={{ maxWidth: 720 }}>
        <div className="card shadow-sm border-0" style={{ borderTop: "4px solid #ff7a00" }}>
          <div className="card-body p-4">
            <h5 className="card-title">Validar ingresso</h5>
            <div className="input-group mb-3">
              <input className="form-control" placeholder="Código do ingresso" value={code} onChange={(e)=>setCode(e.target.value)} />
              <button className="btn btn-warning" onClick={handleSearch}>Buscar</button>
            </div>
            {error && <div className="alert alert-danger py-2">{error}</div>}
            {result && (
              <div className="border rounded p-3">
                <div className="mb-1"><strong>Evento:</strong> {result.eventId}</div>
                <div className="mb-1"><strong>Quantidade:</strong> {result.quantity}</div>
                <div className="mb-1"><strong>Usado:</strong> {result.usedAt ? "Sim" : "Não"}</div>
                <button className="btn btn-warning mt-2" disabled={saving || !!result.usedAt} onClick={handleValidate}>
                  {saving ? "Validando..." : "Marcar como usado"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


