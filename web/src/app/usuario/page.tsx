"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/controller";
import { onAuthStateChanged } from "firebase/auth";
import { collection, onSnapshot, query, where, doc, getDoc } from "firebase/firestore";

type Row = { id: string; eventId: string; quantity: number; createdAt?: any; event?: any; code?: string };

export default function UserDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    let unsubAuth: any;
    let unsub: any;
    unsubAuth = onAuthStateChanged(auth, (u) => {
      if (!u) {
        setRows([]);
        setLoading(false);
        return;
      }
      const q = query(collection(db, "tickets"), where("userUid", "==", u.uid));
      unsub = onSnapshot(q, async (snap) => {
        const base = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as Row[];
        // hydrate event data
        const withEvents = await Promise.all(
          base.map(async (r) => {
            try {
              const esnap = await getDoc(doc(db, "events", r.eventId));
              return { ...r, event: esnap.exists() ? esnap.data() : null };
            } catch {
              return r;
            }
          })
        );
        setRows(withEvents);
        setLoading(false);
      });
    });
    return () => {
      unsub && unsub();
      unsubAuth && unsubAuth();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center text-muted">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ background: "#fff7ef" }}>
      <div className="container" style={{ maxWidth: 960 }}>
        <div className="card shadow-sm border-0" style={{ borderTop: "4px solid #ff7a00" }}>
          <div className="card-body p-4">
            <h5 className="card-title">Meus ingressos</h5>
            {rows.length === 0 ? (
              <div className="text-muted">Nenhuma compra ainda.</div>
            ) : (
              <div className="table-responsive">
                <table className="table align-middle">
                  <thead>
                    <tr>
                      <th>Evento</th>
                      <th>Local</th>
                      <th>Data</th>
                      <th>Quantidade</th>
                      <th>Código</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r) => (
                      <tr key={r.id}>
                        <td>{r.event?.organizerName || r.eventId}</td>
                        <td>{r.event?.location || "—"}</td>
                        <td>{r.event?.date || "—"}</td>
                        <td>{r.quantity}</td>
                        <td><code>{r.code || "—"}</code></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


