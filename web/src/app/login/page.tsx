"use client";

import { useState, useEffect } from "react";
import { auth, db } from "@/controller";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [userType, setUserType] = useState<"person" | "company">("person");
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUid, setCurrentUid] = useState<string | null>(null);
  const [isCompany, setIsCompany] = useState(false);

  // Estados de evento removidos desta página

  // Detecta usuário logado e tipo (empresa)
  // Exibe área de eventos somente para empresas autenticadas
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  

  // Checagens de evento/empresa removidas desta página

  // Criação de evento removida desta página

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === "login") {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        console.log("login success", cred.user.uid);
        try {
          const usnap = await import("firebase/firestore").then(m => m.getDoc(m.doc(db, "users", cred.user.uid)));
          const type = (usnap.exists() ? (usnap.data() as any).type : null) as string | null;
          router.replace(type === "company" ? "/dashboard" : "/evento");
        } catch (e) {
          router.replace("/evento");
        }
      } else {
        if (password !== confirmPassword) {
          throw new Error("As senhas não coincidem");
        }
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        const displayName = userType === "company" ? companyName : name;
        if (displayName) {
          await updateProfile(cred.user, { displayName });
        }
        await setDoc(doc(db, "users", cred.user.uid), {
          uid: cred.user.uid,
          email,
          type: userType,
          name: displayName ?? "",
          createdAt: serverTimestamp(),
        });
        console.log("register success", cred.user.uid, "type:", userType);
        router.replace(userType === "company" ? "/dashboard" : "/evento");
      }
    } catch (err: any) {
      setError(err?.message ?? "Falha na autenticação");
      console.error("auth error", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ background: "#fff7ef" }}>
      <div className="container" style={{ maxWidth: 960 }}>
        <div className="row g-4 align-items-stretch">
          <div className="col-12 col-lg-6">
            <div className="card h-100 shadow-sm border-0" style={{ borderTop: "4px solid #ff7a00" }}>
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="card-title m-0">{mode === "login" ? "Entrar" : "Registrar"}</h5>
                  <div className="btn-group" role="group">
                    <button
                      type="button"
                      className={`btn btn-sm ${mode === "login" ? "btn-warning" : "btn-outline-warning"}`}
                      onClick={() => setMode("login")}
                    >
                      Login
                    </button>
                    <button
                      type="button"
                      className={`btn btn-sm ${mode === "register" ? "btn-warning" : "btn-outline-warning"}`}
                      onClick={() => setMode("register")}
                    >
                      Registrar
                    </button>
                  </div>
                </div>

                {mode === "register" && (
                  <div className="mb-3">
                    <label className="form-label">Tipo de cadastro</label>
                    <div className="d-flex gap-2">
                      <button
                        type="button"
                        className={`btn ${userType === "person" ? "btn-warning" : "btn-outline-warning"}`}
                        onClick={() => setUserType("person")}
                      >
                        Pessoa
                      </button>
                      <button
                        type="button"
                        className={`btn ${userType === "company" ? "btn-warning" : "btn-outline-warning"}`}
                        onClick={() => setUserType("company")}
                      >
                        Empresa
                      </button>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="alert alert-danger py-2" role="alert">
                    {error}
                  </div>
                )}

                <form className="mt-3" onSubmit={handleSubmit}>
                  {mode === "register" && userType === "company" && (
                    <div className="mb-3">
                      <label className="form-label">Nome da empresa</label>
                      <input value={companyName} onChange={(e) => setCompanyName(e.target.value)} type="text" className="form-control" placeholder="Ex: ACME Ltda" />
                    </div>
                  )}

                  {mode === "register" && userType === "person" && (
                    <div className="mb-3">
                      <label className="form-label">Nome completo</label>
                      <input value={name} onChange={(e) => setName(e.target.value)} type="text" className="form-control" placeholder="Seu nome" />
                    </div>
                  )}

                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="form-control" placeholder="voce@exemplo.com" />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Senha</label>
                    <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="form-control" placeholder="••••••••" />
                  </div>

                  {mode === "register" && (
                    <div className="mb-3">
                      <label className="form-label">Confirmar senha</label>
                      <input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} type="password" className="form-control" placeholder="••••••••" />
                    </div>
                  )}

                  <button type="submit" className="btn btn-warning w-100" disabled={loading}>
                    {loading ? "Carregando..." : mode === "login" ? "Entrar" : "Criar conta"}
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-6">
            <div className="h-100 p-4 rounded-3" style={{ background: "linear-gradient(135deg,#ff9a3d,#ff7a00)", color: "#1a1a1a" }}>
              <h3 className="fw-bold">Tixio</h3>
              <p className="mb-4">Acesse sua conta ou crie um cadastro como pessoa ou empresa.</p>
              <ul className="mb-0">
                <li>Design em laranja com alto contraste</li>
                <li>Suporte a cadastro de empresa e pessoa</li>
                <li>Pronto para integrar com Firebase Auth</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Seção de eventos removida desta página */}
      </div>
    </div>
  );
}


