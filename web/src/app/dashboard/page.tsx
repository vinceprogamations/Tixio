"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/controller";
import { onAuthStateChanged, updateProfile } from "firebase/auth";
import { doc, getDoc, updateDoc, addDoc, collection, serverTimestamp, onSnapshot, query, where } from "firebase/firestore";

type UserDoc = {
  uid: string;
  email: string;
  type: "person" | "company";
  name?: string;
  photoURL?: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userDoc, setUserDoc] = useState<UserDoc | null>(null);
  const [name, setName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [events, setEvents] = useState<Array<{
    id: string;
    location: string;
    date: string;
    price: number;
    tickets: number;
    category?: string;
    description?: string;
    capacity?: number;
    imageUrl?: string;
    active?: boolean;
    _createdAtMs?: number;
  }>>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [sales, setSales] = useState<Record<string, { sold: number; revenue: number }>>({});
  // Estados do novo evento
  const [evLocal, setEvLocal] = useState("");
  const [evPreco, setEvPreco] = useState("");
  const [evData, setEvData] = useState("");
  const [evTickets, setEvTickets] = useState("");
  const [evCategoria, setEvCategoria] = useState("");
  const [evDescricao, setEvDescricao] = useState("");
  const [evCapacidade, setEvCapacidade] = useState("");
  const [evImageUrl, setEvImageUrl] = useState("");
  const [evAtivo, setEvAtivo] = useState(true);
  const [savingEvent, setSavingEvent] = useState(false);
  const [eventMsg, setEventMsg] = useState<string | null>(null);
  const [eventError, setEventError] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace("/login");
        return;
      }
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        router.replace("/login");
        return;
      }
      const data = snap.data() as UserDoc;
      if (!data || data.type !== "company") {
        router.replace("/login");
        return;
      }
      setUserDoc(data);
      setName(data.name ?? "");
      setPhotoURL(data.photoURL ?? user.photoURL ?? "");
      setLoading(false);

      // Subscribe aos eventos desta empresa
      const q = query(
        collection(db, "events"),
        where("organizerUid", "==", user.uid)
      );
      const unsubEvents = onSnapshot(q, (snap) => {
        const rows = snap.docs.map((d) => {
          const v = d.data() as any;
          return {
            id: d.id,
            location: v.location ?? "",
            date: v.date ?? "",
            price: typeof v.price === "number" ? v.price : Number(v.price ?? 0),
            tickets: typeof v.tickets === "number" ? v.tickets : Number(v.tickets ?? 0),
            category: v.category ?? "",
            description: v.description ?? "",
            capacity: typeof v.capacity === "number" ? v.capacity : Number(v.capacity ?? 0),
            imageUrl: v.imageUrl ?? "",
            active: typeof v.active === "boolean" ? v.active : true,
            _createdAtMs: v.createdAt?.toMillis ? v.createdAt.toMillis() : 0,
          };
        });
        rows.sort((a, b) => (b._createdAtMs || 0) - (a._createdAtMs || 0));
        setEvents(rows);
      });
      return () => unsubEvents();
    });
    return () => unsub();
  }, [router]);

  // Assina vendas por evento (tickets) e agrega por evento
  useEffect(() => {
    if (!auth.currentUser || !userDoc) return;
    const q = query(collection(db, "tickets"), where("organizerUid", "==", auth.currentUser.uid));
    const unsub = onSnapshot(q, (snap) => {
      const agg: Record<string, { sold: number; revenue: number }> = {};
      snap.forEach((d) => {
        const t = d.data() as any;
        const eventId = t.eventId as string;
        const quantity = Number(t.quantity || 0);
        if (!agg[eventId]) agg[eventId] = { sold: 0, revenue: 0 };
        agg[eventId].sold += quantity;
      });
      // compute revenue from events list price
      for (const e of events) {
        if (agg[e.id]) {
          agg[e.id].revenue = (agg[e.id].sold || 0) * (e.price || 0);
        }
      }
      setSales(agg);
    });
    return () => unsub();
  }, [userDoc, events]);

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!userDoc || !auth.currentUser) return;
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      await updateDoc(doc(db, "users", userDoc.uid), {
        name: name ?? "",
        photoURL: photoURL ?? "",
      });
      await updateProfile(auth.currentUser, {
        displayName: name || undefined,
        photoURL: photoURL || undefined,
      });
      setSaved(true);
    } catch (err: any) {
      setError(err?.message ?? "Falha ao salvar");
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdateEvent(
    id: string,
    patch: Partial<{ location: string; date: string; price: number; tickets: number; category: string; description: string; capacity: number; imageUrl: string; active: boolean }>
  ) {
    if (!auth.currentUser || !userDoc) return;
    try {
      await updateDoc(doc(db, "events", id), patch);
    } catch (e) {
      console.error(e);
    }
  }

  async function handleCreateEvent(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEventMsg(null);
    setEventError(null);
    if (!auth.currentUser || !userDoc || userDoc.type !== "company") {
      setEventError("Apenas empresas autenticadas podem criar eventos.");
      return;
    }
    if (!evLocal || !evPreco || !evData || !evTickets || !evCategoria || !evDescricao) {
      setEventError("Preencha todos os campos do evento.");
      return;
    }
    const price = parseFloat(evPreco);
    const tickets = parseInt(evTickets, 10);
    const capacity = evCapacidade ? parseInt(evCapacidade, 10) : tickets;
    if (Number.isNaN(price) || Number.isNaN(tickets)) {
      setEventError("Preço e Tickets devem ser numéricos.");
      return;
    }
    setSavingEvent(true);
    try {
      await addDoc(collection(db, "events"), {
        organizerUid: userDoc.uid,
        organizerName: (name || userDoc.name || auth.currentUser?.displayName || "").trim(),
        location: evLocal,
        price,
        date: evData,
        tickets,
        category: evCategoria,
        description: evDescricao,
        capacity,
        imageUrl: evImageUrl,
        active: !!evAtivo,
        createdAt: serverTimestamp(),
      });
      setEventMsg("Evento cadastrado com sucesso!");
      setEvLocal("");
      setEvPreco("");
      setEvData("");
      setEvTickets("");
      setEvCategoria("");
      setEvDescricao("");
      setEvCapacidade("");
      setEvImageUrl("");
      setEvAtivo(true);
    } catch (err: any) {
      setEventError(err?.message ?? "Falha ao salvar evento");
    } finally {
      setSavingEvent(false);
    }
  }

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center text-muted">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ background: "#fff7ef" }}>
      <div className="container" style={{ maxWidth: 800 }}>
        <div className="card shadow-sm border-0" style={{ borderTop: "4px solid #ff7a00" }}>
          <div className="card-body p-4">
            <div className="d-flex align-items-center gap-3 mb-4">
              <img
                src={photoURL || "https://via.placeholder.com/72x72.png?text=Logo"}
                alt="Logo"
                width={72}
                height={72}
                className="rounded"
              />
              <div>
                <h5 className="m-0">Dashboard da Empresa</h5>
                <small className="text-muted">Atualize o nome e a foto (link)</small>
              </div>
            </div>

            {error && (
              <div className="alert alert-danger py-2" role="alert">{error}</div>
            )}
            {saved && (
              <div className="alert alert-success py-2" role="alert">Alterações salvas</div>
            )}

            <form onSubmit={handleSave} className="row g-3">
              <div className="col-12">
                <label className="form-label">Nome da empresa</label>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: ACME Ltda"
                />
              </div>
              <div className="col-12">
                <label className="form-label">URL da foto do perfil</label>
                <input
                  type="url"
                  className="form-control"
                  value={photoURL}
                  onChange={(e) => setPhotoURL(e.target.value)}
                  placeholder="https://.../logo.png"
                />
                <div className="form-text">Cole um link público para a imagem do perfil.</div>
              </div>
              <div className="col-12">
                <button className="btn btn-warning" disabled={saving} type="submit">
                  {saving ? "Salvando..." : "Salvar alterações"}
                </button>
              </div>
            </form>
          </div>
        </div>
        {/* Cadastrar Evento - somente empresas */
        }
        <div className="card shadow-sm border-0 mt-4" style={{ borderTop: "4px solid #ff7a00" }}>
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="card-title m-0">Cadastrar Evento</h5>
              <span className="badge text-bg-warning">Empresa</span>
            </div>

            {eventError && <div className="alert alert-danger py-2">{eventError}</div>}
            {eventMsg && <div className="alert alert-success py-2">{eventMsg}</div>}

            <form onSubmit={handleCreateEvent} className="row g-3">
              <div className="col-12 col-md-4">
                <label className="form-label">Categoria</label>
                <input type="text" className="form-control" placeholder="Ex: Música" value={evCategoria} onChange={(e) => setEvCategoria(e.target.value)} />
              </div>
              <div className="col-12 col-md-8">
                <label className="form-label">Descrição</label>
                <input type="text" className="form-control" placeholder="Descreva o evento" value={evDescricao} onChange={(e) => setEvDescricao(e.target.value)} />
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label">Local</label>
                <input type="text" className="form-control" placeholder="Endereço ou local" value={evLocal} onChange={(e) => setEvLocal(e.target.value)} />
              </div>
              <div className="col-12 col-md-3">
                <label className="form-label">Preço</label>
                <input type="number" step="0.01" className="form-control" placeholder="0.00" value={evPreco} onChange={(e) => setEvPreco(e.target.value)} />
              </div>
              <div className="col-12 col-md-3">
                <label className="form-label">Data</label>
                <input type="date" className="form-control" value={evData} onChange={(e) => setEvData(e.target.value)} />
              </div>
              <div className="col-12 col-md-3">
                <label className="form-label">Tickets</label>
                <input type="number" className="form-control" placeholder="0" value={evTickets} onChange={(e) => setEvTickets(e.target.value)} />
              </div>
              <div className="col-12 col-md-3">
                <label className="form-label">Capacidade</label>
                <input type="number" className="form-control" placeholder="0" value={evCapacidade} onChange={(e) => setEvCapacidade(e.target.value)} />
              </div>
              <div className="col-12 col-md-4">
                <label className="form-label">Imagem (URL)</label>
                <input type="url" className="form-control" placeholder="https://..." value={evImageUrl} onChange={(e) => setEvImageUrl(e.target.value)} />
              </div>
              <div className="col-12 col-md-2 d-flex align-items-end">
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" id="evAtivo" checked={evAtivo} onChange={(e) => setEvAtivo(e.target.checked)} />
                  <label className="form-check-label" htmlFor="evAtivo">Ativo</label>
                </div>
              </div>
              <div className="col-12">
                <button className="btn btn-warning" disabled={savingEvent} type="submit">
                  {savingEvent ? "Salvando..." : "Cadastrar Evento"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Lista de eventos da empresa */}
        <div className="card shadow-sm border-0 mt-4" style={{ borderTop: "4px solid #ff7a00" }}>
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="card-title m-0">Meus Eventos</h5>
              <span className="badge text-bg-warning">Empresa</span>
            </div>

            {events.length === 0 ? (
              <div className="text-muted">Nenhum evento ainda.</div>
            ) : (
              <div className="table-responsive">
                <table className="table align-middle">
                  <thead>
                    <tr>
                      <th>Categoria</th>
                      <th>Local</th>
                      <th>Descrição</th>
                      <th>Data</th>
                      <th>Preço</th>
                      <th>Tickets</th>
                      <th>Capacidade</th>
                      <th>Imagem</th>
                      <th>Ativo</th>
                      <th style={{ width: 120 }}>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.map((ev) => (
                      <tr key={ev.id}>
                        <td>
                          {editing === ev.id ? (
                            <input className="form-control" defaultValue={ev.category || ""} onBlur={(e) => handleUpdateEvent(ev.id, { category: e.target.value })} />
                          ) : (
                            ev.category || "—"
                          )}
                        </td>
                        <td>
                          {editing === ev.id ? (
                            <input className="form-control" defaultValue={ev.location} onBlur={(e) => handleUpdateEvent(ev.id, { location: e.target.value })} />
                          ) : (
                            ev.location
                          )}
                        </td>
                        <td style={{ minWidth: 200 }}>
                          {editing === ev.id ? (
                            <input className="form-control" defaultValue={ev.description || ""} onBlur={(e) => handleUpdateEvent(ev.id, { description: e.target.value })} />
                          ) : (
                            ev.description || "—"
                          )}
                        </td>
                        <td>
                          {editing === ev.id ? (
                            <input type="date" className="form-control" defaultValue={ev.date} onBlur={(e) => handleUpdateEvent(ev.id, { date: e.target.value })} />
                          ) : (
                            ev.date
                          )}
                        </td>
                        <td style={{ minWidth: 120 }}>
                          {editing === ev.id ? (
                            <input type="number" step="0.01" className="form-control" defaultValue={String(ev.price)} onBlur={(e) => handleUpdateEvent(ev.id, { price: Number(e.target.value) })} />
                          ) : (
                            ev.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
                          )}
                        </td>
                        <td style={{ minWidth: 100 }}>
                          {editing === ev.id ? (
                            <input type="number" className="form-control" defaultValue={String(ev.tickets)} onBlur={(e) => handleUpdateEvent(ev.id, { tickets: Number(e.target.value) })} />
                          ) : (
                            ev.tickets
                          )}
                        </td>
                        <td style={{ minWidth: 100 }}>
                          {editing === ev.id ? (
                            <input type="number" className="form-control" defaultValue={String(ev.capacity || 0)} onBlur={(e) => handleUpdateEvent(ev.id, { capacity: Number(e.target.value) })} />
                          ) : (
                            ev.capacity ?? "—"
                          )}
                        </td>
                        <td style={{ minWidth: 200 }}>
                          {editing === ev.id ? (
                            <input className="form-control" defaultValue={ev.imageUrl || ""} onBlur={(e) => handleUpdateEvent(ev.id, { imageUrl: e.target.value })} />
                          ) : (
                            ev.imageUrl ? (
                              <a href={ev.imageUrl} target="_blank" rel="noreferrer">Imagem</a>
                            ) : "—"
                          )}
                        </td>
                        <td>
                          {editing === ev.id ? (
                            <div className="form-check">
                              <input className="form-check-input" type="checkbox" defaultChecked={!!ev.active} onChange={(e) => handleUpdateEvent(ev.id, { active: e.target.checked })} />
                            </div>
                          ) : (
                            ev.active ? "Sim" : "Não"
                          )}
                        </td>
                        <td>
                          {editing === ev.id ? (
                            <button className="btn btn-sm btn-outline-secondary" onClick={() => setEditing(null)}>Concluir</button>
                          ) : (
                            <button className="btn btn-sm btn-outline-warning" onClick={() => setEditing(ev.id)}>Editar</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Relatórios simples */}
        <div className="card shadow-sm border-0 mt-4" style={{ borderTop: "4px solid #ff7a00" }}>
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="card-title m-0">Relatórios de Vendas</h5>
              <button
                className="btn btn-sm btn-outline-warning"
                onClick={() => {
                  const headers = ["Evento", "Vendidos", "Receita (BRL)"];
                  const lines = [headers.join(",")];
                  for (const e of events) {
                    const s = sales[e.id] || { sold: 0, revenue: 0 };
                    lines.push([e.description || e.location, String(s.sold), String(s.revenue)].join(","));
                  }
                  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "relatorio_vendas.csv";
                  a.click();
                  URL.revokeObjectURL(url);
                }}
              >
                Exportar CSV
              </button>
            </div>
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th>Evento</th>
                    <th>Vendidos</th>
                    <th>Receita (BRL)</th>
                    <th>Restantes</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((e) => {
                    const s = sales[e.id] || { sold: 0, revenue: 0 };
                    const remaining = (e.tickets ?? 0);
                    return (
                      <tr key={e.id}>
                        <td>{e.description || e.location}</td>
                        <td>{s.sold}</td>
                        <td>{s.revenue.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</td>
                        <td>{remaining}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


