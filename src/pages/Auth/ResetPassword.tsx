// src/pages/Auth/ForgotPassword.tsx
import { useState } from "react"
import { Link } from "react-router-dom"
import { Mail, ArrowRight, ArrowLeft, Star, CheckCircle } from "lucide-react"

type Step = "email" | "sent"

export default function ForgotPassword() {
  const [step, setStep] = useState<Step>("email")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!email) {
      setError("Veuillez entrer votre adresse email.")
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("Adresse email invalide.")
      return
    }
    setLoading(true)
    // Simuler l'envoi d'email (remplacer par Firebase Auth sendPasswordResetEmail)
    setTimeout(() => {
      setLoading(false)
      setStep("sent")
    }, 1500)
  }

  return (
    <div className="min-h-screen flex">

      {/* ── Panneau gauche ── */}
      <div
        className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12"
        style={{ background: "linear-gradient(160deg, #0f172a 0%, #1e3a5f 50%, #0f2942 100%)" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#C9A84C" }}>
            <Star size={18} fill="white" color="white" />
          </div>
          <span className="text-white text-xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
            LuxeStay
          </span>
        </div>

        {/* Message central */}
        <div>
          <p className="text-5xl font-bold text-white leading-tight mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
            Pas de<br />
            panique,<br />
            <span style={{ color: "#C9A84C" }}>on vous aide.</span>
          </p>
          <p className="text-white/60 text-lg">
            Réinitialisez votre mot de passe en quelques secondes.
          </p>
        </div>

        {/* Étapes */}
        <div className="space-y-4">
          {[
            { n: "01", text: "Entrez votre adresse email ci-contre" },
            { n: "02", text: "Vérifiez votre boîte mail (et les spams)" },
            { n: "03", text: "Cliquez sur le lien et créez un nouveau mot de passe" },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
              <span className="text-xs font-bold w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "#C9A84C", color: "white" }}>
                {s.n}
              </span>
              <p className="text-white/80 text-sm">{s.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Panneau droit ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-white">
        <div className="w-full max-w-md">

          {/* Logo mobile */}
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#C9A84C" }}>
              <Star size={14} fill="white" color="white" />
            </div>
            <span className="font-bold text-lg" style={{ fontFamily: "'Playfair Display', serif", color: "#0f172a" }}>
              LuxeStay
            </span>
          </div>

          {/* Retour vers login */}
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm mb-8 hover:underline"
            style={{ color: "#64748b" }}
          >
            <ArrowLeft size={15} /> Retour à la connexion
          </Link>

          {/* ── ÉTAPE 1 : saisie email ── */}
          {step === "email" && (
            <>
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6" style={{ background: "rgba(201,168,76,0.1)" }}>
                <Mail size={28} style={{ color: "#C9A84C" }} />
              </div>

              <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif", color: "#0f172a" }}>
                Mot de passe oublié ?
              </h1>
              <p className="text-sm mb-8" style={{ color: "#64748b" }}>
                Entrez l'email associé à votre compte. Nous vous enverrons un lien de réinitialisation.
              </p>

              {error && (
                <div className="mb-6 p-4 rounded-xl text-sm" style={{ background: "#FEF2F2", color: "#DC2626", border: "1px solid #FECACA" }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#94a3b8" }}>
                    Adresse email
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "#94a3b8" }} />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="vous@exemple.com"
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm outline-none transition-all"
                      style={{ border: "1.5px solid #E2E8F0", color: "#0f172a", background: "#F8FAFC" }}
                      onFocus={e => (e.target.style.borderColor = "#C9A84C")}
                      onBlur={e => (e.target.style.borderColor = "#E2E8F0")}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-95"
                  style={{
                    background: loading ? "#94a3b8" : "linear-gradient(135deg, #1e3a5f, #0f2942)",
                    cursor: loading ? "not-allowed" : "pointer",
                  }}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeDasharray="30" strokeDashoffset="10" />
                      </svg>
                      Envoi en cours...
                    </span>
                  ) : (
                    <>Envoyer le lien <ArrowRight size={16} /></>
                  )}
                </button>
              </form>

              <p className="text-center text-sm mt-8" style={{ color: "#64748b" }}>
                Vous vous souvenez ?{" "}
                <Link to="/login" className="font-semibold hover:underline" style={{ color: "#C9A84C" }}>
                  Se connecter
                </Link>
              </p>
            </>
          )}

          {/* ── ÉTAPE 2 : email envoyé ── */}
          {step === "sent" && (
            <div className="text-center">
              {/* Icône succès animée */}
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: "rgba(34,197,94,0.1)" }}>
                <CheckCircle size={40} style={{ color: "#22C55E" }} />
              </div>

              <h1 className="text-3xl font-bold mb-3" style={{ fontFamily: "'Playfair Display', serif", color: "#0f172a" }}>
                Email envoyé !
              </h1>
              <p className="text-sm mb-2" style={{ color: "#64748b" }}>
                Un lien de réinitialisation a été envoyé à :
              </p>
              <p className="font-semibold mb-8 px-4 py-2 rounded-xl inline-block" style={{ color: "#0f172a", background: "#F8FAFC", border: "1px solid #E2E8F0" }}>
                {email}
              </p>

              <div className="p-5 rounded-2xl mb-8 text-left" style={{ background: "#FFFBEB", border: "1px solid #FDE68A" }}>
                <p className="text-sm font-semibold mb-2" style={{ color: "#92400E" }}>💡 Vous ne trouvez pas l'email ?</p>
                <ul className="text-sm space-y-1" style={{ color: "#78350F" }}>
                  <li>• Vérifiez votre dossier spam / courriers indésirables</li>
                  <li>• Attendez quelques minutes</li>
                  <li>• Assurez-vous d'avoir utilisé le bon email</li>
                </ul>
              </div>

              <button
                onClick={() => setStep("email")}
                className="w-full py-4 rounded-xl font-semibold mb-4 transition-all hover:bg-slate-50 active:scale-95"
                style={{ border: "1.5px solid #E2E8F0", color: "#0f172a" }}
              >
                Changer d'adresse email
              </button>

              <Link
                to="/login"
                className="w-full py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #1e3a5f, #0f2942)" }}
              >
                Retour à la connexion <ArrowRight size={16} />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}