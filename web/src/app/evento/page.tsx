"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { auth, db } from "@/controller";
import { onAuthStateChanged } from "firebase/auth";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

type EventRow = {
  id: string;
  organizerName?: string;
  location: string;
  date: string;
  price: number;
  tickets: number;
};

export default function EventsListPage() {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<EventRow[]>([]);
  const [qText, setQText] = useState("");
  const [qCategory, setQCategory] = useState("");
  const [qMinPrice, setQMinPrice] = useState("");
  const [qMaxPrice, setQMaxPrice] = useState("");
  const [qDate, setQDate] = useState("");
  const [sort, setSort] = useState<"recent" | "priceAsc" | "priceDesc" | "dateAsc" | "dateDesc">("recent");

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, () => {
      // Apenas para garantir reatividade de auth; página visível a logados
    });
    const q = query(collection(db, "events"));
    const unsub = onSnapshot(q, (snap) => {
      const rows = snap.docs.map((d) => {
        const v = d.data() as any;
        return {
          id: d.id,
          organizerName: v.organizerName,
          location: v.location ?? "",
          date: v.date ?? "",
          price: typeof v.price === "number" ? v.price : Number(v.price ?? 0),
          tickets: typeof v.tickets === "number" ? v.tickets : Number(v.tickets ?? 0),
        } as EventRow;
      });
      setEvents(rows);
      setLoading(false);
    });
    return () => {
      unsub();
      unsubAuth();
    };
  }, []);

  const filtered = useMemo(() => {
    let rows = events.slice();
    if (qText) {
      const t = qText.toLowerCase();
      rows = rows.filter((e) =>
        (e.organizerName || "").toLowerCase().includes(t) ||
        (e.location || "").toLowerCase().includes(t)
      );
    }
    if (qCategory) rows = rows.filter((e) => (e as any).category?.toLowerCase() === qCategory.toLowerCase());
    const minP = qMinPrice ? parseFloat(qMinPrice) : null;
    const maxP = qMaxPrice ? parseFloat(qMaxPrice) : null;
    if (minP != null) rows = rows.filter((e) => e.price >= minP);
    if (maxP != null) rows = rows.filter((e) => e.price <= maxP);
    if (qDate) rows = rows.filter((e) => e.date === qDate);
    switch (sort) {
      case "priceAsc": rows.sort((a,b)=>a.price-b.price); break;
      case "priceDesc": rows.sort((a,b)=>b.price-a.price); break;
      case "dateAsc": rows.sort((a,b)=> (a.date>a.date?1:-1)); break;
      case "dateDesc": rows.sort((a,b)=> (a.date<b.date?1:-1)); break;
      default: break;
    }
    return rows;
  }, [events, qText, qCategory, qMinPrice, qMaxPrice, qDate, sort]);

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
            <h5 className="card-title">Eventos</h5>
            <div className="row g-2 mb-3">
              <div className="col-12 col-md-3">
                <input className="form-control" placeholder="Buscar por nome/local" value={qText} onChange={(e)=>setQText(e.target.value)} />
              </div>
              <div className="col-6 col-md-2">
                <input className="form-control" placeholder="Categoria" value={qCategory} onChange={(e)=>setQCategory(e.target.value)} />
              </div>
              <div className="col-6 col-md-2">
                <input className="form-control" type="date" value={qDate} onChange={(e)=>setQDate(e.target.value)} />
              </div>
              <div className="col-6 col-md-2">
                <input className="form-control" type="number" step="0.01" placeholder="Preço mín" value={qMinPrice} onChange={(e)=>setQMinPrice(e.target.value)} />
              </div>
              <div className="col-6 col-md-2">
                <input className="form-control" type="number" step="0.01" placeholder="Preço máx" value={qMaxPrice} onChange={(e)=>setQMaxPrice(e.target.value)} />
              </div>
              <div className="col-12 col-md-1">
                <select className="form-select" value={sort} onChange={(e)=>setSort(e.target.value as any)}>
                  <option value="recent">Recentes</option>
                  <option value="priceAsc">Preço ↑</option>
                  <option value="priceDesc">Preço ↓</option>
                  <option value="dateAsc">Data ↑</option>
                  <option value="dateDesc">Data ↓</option>
                </select>
              </div>
            </div>
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th>Evento</th>
                    <th>Local</th>
                    <th>Data</th>
                    <th>Preço</th>
                    <th>Tickets</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((e) => (
                    <tr key={e.id}>
                      <td>{e.organizerName || "Evento"}</td>
                      <td>{e.location}</td>
                      <td>{e.date}</td>
                      <td>{e.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</td>
                      <td>{e.tickets}</td>
                      <td>
                        <Link className="btn btn-sm btn-warning" href={`/evento/${e.id}`}>
                          Ver
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


