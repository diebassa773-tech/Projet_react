// src/pages/Auth/Register.tsx
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, Star, CheckCircle } from "lucide-react"
import { authService } from "../../services/auth"

export default function Register() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [form, setForm] = useState({
    prenom: "",
    nom: "",
    email: "",
    telephone: "",
    password: "",
    confirm: "",
    accept: false,
  })

  const update = (key: string, value: string | boolean) =>
    setForm(prev => ({ ...prev, [key]: value }))

  const passwordStrength = (): { label: string; color: string; width: string } => {
    const p = form.password
    if (p.length === 0) return { label: "", color: "#E2E8F0", width: "0%" }
    if (p.length < 6)   return { label: "Trop court", color: "#EF4444", width: "25%" }
    if (p.length < 10)  return { label: "Moyen", color: "#F59E0B", width: "60%" }
    return { label: "Fort", color: "#22C55E", width: "100%" }
  }

  const strength = passwordStrength()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    if (!form.prenom || !form.nom || !form.email || !form.password) {
      setError("Veuillez remplir tous les champs obligatoires.")
      return
    }
    
    if (form.password !== form.confirm) {
      setError("Les mots de passe ne correspondent pas.")
      return
    }
    
    if (form.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.")
      return
    }
    
    if (!form.accept) {
      setError("Veuillez accepter les conditions d'utilisation.")
      return
    }
    
    setLoading(true)
    
    try {
      const newUser = authService.register(
        form.nom,
        form.prenom,
        form.email,
        form.password
      )
      
      if (newUser) {
        authService.login(form.email, form.password)
        navigate("/")
      }
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue lors de l'inscription")
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    border: "1.5px solid #E2E8F0",
    color: "#0f172a",
    background: "#F8FAFC",
  }

  const focusGold = (e: React.FocusEvent<HTMLInputElement>) =>
    (e.target.style.borderColor = "#C9A84C")
  const blurReset = (e: React.FocusEvent<HTMLInputElement>) =>
    (e.target.style.borderColor = "#E2E8F0")

  return (
    <div className="min-h-screen flex">

      {/* Panneau gauche */}
      <div
        className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12"
        style={{ background: "linear-gradient(160deg, #0f172a 0%, #1e3a5f 50%, #0f2942 100%)" }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#C9A84C" }}>
            <Star size={18} fill="white" color="white" />
          </div>
          <span className="text-white text-xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
            HotelBooking
          </span>
        </div>

        <div>
          <p className="text-4xl font-bold text-white leading-tight mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>
            Rejoignez<br />
            <span style={{ color: "#C9A84C" }}>10 000+</span> voyageurs<br />
            satisfaits.
          </p>
          <div className="space-y-4">
            {[
              "Accès aux meilleures offres en exclusivité",
              "Gestion de vos réservations en temps réel",
              "Programme de fidélité Bronze → Silver → Gold",
              "Support client disponible 7j/7",
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <CheckCircle size={18} style={{ color: "#C9A84C", flexShrink: 0 }} />
                <p className="text-white/80 text-sm">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[
            { val: "50+", label: "Hôtels partenaires" },
            { val: "10k+", label: "Clients satisfaits" },
            { val: "4.9★", label: "Note moyenne" },
          ].map((s, i) => (
            <div key={i} className="p-4 rounded-xl text-center" style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }}>
              <p className="text-2xl font-bold" style={{ color: "#C9A84C", fontFamily: "'Playfair Display', serif" }}>{s.val}</p>
              <p className="text-white/60 text-xs mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Panneau droit : formulaire */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-white overflow-y-auto">
        <div className="w-full max-w-md py-8">

          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#C9A84C" }}>
              <Star size={14} fill="white" color="white" />
            </div>
            <span className="font-bold text-lg" style={{ fontFamily: "'Playfair Display', serif", color: "#0f172a" }}>
              HotelBooking
            </span>
          </div>

          <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif", color: "#0f172a" }}>
            Créer un compte
          </h1>
          <p className="text-sm mb-8" style={{ color: "#64748b" }}>
            Gratuit · Sans engagement · Réservez en 2 minutes.
          </p>

          {error && (
            <div className="mb-6 p-4 rounded-xl text-sm" style={{ background: "#FEF2F2", color: "#DC2626", border: "1px solid #FECACA" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#94a3b8" }}>Prénom *</label>
                <div className="relative">
                  <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "#94a3b8" }} />
                  <input
                    type="text"
                    value={form.prenom}
                    onChange={e => update("prenom", e.target.value)}
                    placeholder="Aminata"
                    className="w-full pl-10 pr-4 py-3.5 rounded-xl text-sm outline-none transition-all"
                    style={inputStyle}
                    onFocus={focusGold}
                    onBlur={blurReset}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#94a3b8" }}>Nom *</label>
                <input
                  type="text"
                  value={form.nom}
                  onChange={e => update("nom", e.target.value)}
                  placeholder="Fall"
                  className="w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all"
                  style={inputStyle}
                  onFocus={focusGold}
                  onBlur={blurReset}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#94a3b8" }}>Email *</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "#94a3b8" }} />
                <input
                  type="email"
                  value={form.email}
                  onChange={e => update("email", e.target.value)}
                  placeholder="vous@exemple.com"
                  className="w-full pl-10 pr-4 py-3.5 rounded-xl text-sm outline-none transition-all"
                  style={inputStyle}
                  onFocus={focusGold}
                  onBlur={blurReset}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#94a3b8" }}>Téléphone</label>
              <div className="relative">
                <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "#94a3b8" }} />
                <input
                  type="tel"
                  value={form.telephone}
                  onChange={e => update("telephone", e.target.value)}
                  placeholder="+221 77 000 00 00"
                  className="w-full pl-10 pr-4 py-3.5 rounded-xl text-sm outline-none transition-all"
                  style={inputStyle}
                  onFocus={focusGold}
                  onBlur={blurReset}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#94a3b8" }}>Mot de passe *</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "#94a3b8" }} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={e => update("password", e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3.5 rounded-xl text-sm outline-none transition-all"
                  style={inputStyle}
                  onFocus={focusGold}
                  onBlur={blurReset}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2" style={{ color: "#94a3b8" }}>
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {form.password && (
                <div className="mt-2">
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "#E2E8F0" }}>
                    <div className="h-full rounded-full transition-all duration-300" style={{ width: strength.width, background: strength.color }} />
                  </div>
                  <p className="text-xs mt-1" style={{ color: strength.color }}>{strength.label}</p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#94a3b8" }}>Confirmer le mot de passe *</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "#94a3b8" }} />
                <input
                  type={showConfirm ? "text" : "password"}
                  value={form.confirm}
                  onChange={e => update("confirm", e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3.5 rounded-xl text-sm outline-none transition-all"
                  style={{
                    ...inputStyle,
                    borderColor: form.confirm && form.confirm !== form.password ? "#EF4444" : "#E2E8F0",
                  }}
                  onFocus={focusGold}
                  onBlur={blurReset}
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2" style={{ color: "#94a3b8" }}>
                  {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {form.confirm && form.confirm !== form.password && (
                <p className="text-xs mt-1" style={{ color: "#EF4444" }}>Les mots de passe ne correspondent pas</p>
              )}
            </div>

            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={form.accept}
                onChange={e => update("accept", e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded accent-yellow-600 flex-shrink-0"
              />
              <span className="text-sm" style={{ color: "#64748b" }}>
                J'accepte les{" "}
                <a href="#" className="font-medium hover:underline" style={{ color: "#C9A84C" }}>conditions d'utilisation</a>
                {" "}et la{" "}
                <a href="#" className="font-medium hover:underline" style={{ color: "#C9A84C" }}>politique de confidentialité</a>
              </span>
            </label>

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
                  Création du compte...
                </span>
              ) : (
                <>Créer mon compte <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <p className="text-center text-sm mt-8" style={{ color: "#64748b" }}>
            Déjà un compte ?{" "}
            <Link to="/login" className="font-semibold hover:underline" style={{ color: "#C9A84C" }}>
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}