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
        <main id="main-content" role="main">
          <div className="card shadow-sm border-0" style={{ borderTop: "4px solid #ff7a00" }}>
            <div className="card-body p-4">
              <h1 className="card-title h5" id="page-title">Validar ingresso</h1>
              <p className="text-muted mb-4">Digite o código do ingresso para validar a entrada no evento.</p>
              
              <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} role="search" aria-labelledby="page-title">
                <div className="input-group mb-3">
                  <label htmlFor="ticket-code" className="visually-hidden">Código do ingresso</label>
                  <input 
                    id="ticket-code"
                    className="form-control" 
                    placeholder="Código do ingresso" 
                    value={code} 
                    onChange={(e)=>setCode(e.target.value)}
                    aria-describedby="code-help"
                    required
                    autoComplete="off"
                    spellCheck="false"
                  />
                  <button 
                    className="btn btn-warning" 
                    type="submit"
                    disabled={!code.trim()}
                    aria-label="Buscar ingresso pelo código"
                  >
                    Buscar
                  </button>
                </div>
                <div id="code-help" className="form-text">
                  Digite o código completo do ingresso para localizar e validar.
                </div>
              </form>

              {error && (
                <div className="alert alert-danger py-2" role="alert" aria-live="polite">
                  <strong>Erro:</strong> {error}
                </div>
              )}

              {result && (
                <div className="border rounded p-3" role="region" aria-labelledby="ticket-info">
                  <h2 id="ticket-info" className="h6 mb-3">Informações do Ingresso</h2>
                  <dl className="row mb-3">
                    <dt className="col-sm-4">Evento:</dt>
                    <dd className="col-sm-8">{result.eventId}</dd>
                    
                    <dt className="col-sm-4">Quantidade:</dt>
                    <dd className="col-sm-8">{result.quantity}</dd>
                    
                    <dt className="col-sm-4">Status:</dt>
                    <dd className="col-sm-8">
                      <span className={`badge ${result.usedAt ? 'bg-danger' : 'bg-success'}`}>
                        {result.usedAt ? "Usado" : "Válido"}
                      </span>
                    </dd>
                  </dl>
                  
                  <button 
                    className="btn btn-warning" 
                    disabled={saving || !!result.usedAt} 
                    onClick={handleValidate}
                    aria-describedby="validate-help"
                  >
                    {saving ? "Validando..." : "Marcar como usado"}
                  </button>
                  
                  {result.usedAt && (
                    <div id="validate-help" className="form-text mt-2">
                      Este ingresso já foi utilizado e não pode ser validado novamente.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}


