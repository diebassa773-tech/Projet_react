// src/pages/Auth/Login.tsx
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Mail, Lock, ArrowRight, Star, Eye, EyeOff } from "lucide-react"
import { authService } from "../../services/auth"

export default function Login() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (!email || !password) {
      setError("Veuillez remplir tous les champs")
      setLoading(false)
      return
    }

    try {
      const user = authService.login(email, password)
      
      if (user) {
        if (user.role === "admin") {
          navigate("/dashboard")
        } else {
          navigate("/")
        }
      } else {
        setError("Email ou mot de passe incorrect")
      }
    } catch (err) {
      setError("Une erreur est survenue")
    } finally {
      setLoading(false)
    }
  }

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
            Retrouvez votre<br />
            <span style={{ color: "#C9A84C" }}>espace personnel</span>
          </p>
          <div className="space-y-4">
            {[
              "Gérez vos réservations en un clic",
              "Accédez à vos offres exclusives",
              "Suivez vos points de fidélité",
              "Modifiez vos informations",
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "#C9A84C20" }}>
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#C9A84C" }} />
                </div>
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
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-white">
        <div className="w-full max-w-md">

          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#C9A84C" }}>
              <Star size={14} fill="white" color="white" />
            </div>
            <span className="font-bold text-lg" style={{ fontFamily: "'Playfair Display', serif", color: "#0f172a" }}>
              HotelBooking
            </span>
          </div>

          <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif", color: "#0f172a" }}>
            Connexion
          </h1>
          <p className="text-sm mb-8" style={{ color: "#64748b" }}>
            Ravi de vous revoir ! Connectez-vous à votre compte.
          </p>

          {error && (
            <div className="mb-6 p-4 rounded-xl text-sm" style={{ background: "#FEF2F2", color: "#DC2626", border: "1px solid #FECACA" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#94a3b8" }}>
                Email
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#94a3b8" }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vous@exemple.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all border border-gray-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#94a3b8" }}>
                Mot de passe
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#94a3b8" }} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 rounded-xl text-sm outline-none transition-all border border-gray-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: "#94a3b8" }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <Link
                to="/reset-password"
                className="text-xs font-medium hover:underline transition"
                style={{ color: "#C9A84C" }}
              >
                Mot de passe oublié ?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all hover:opacity-90"
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
                  Connexion...
                </span>
              ) : (
                <>Se connecter <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <p className="text-center text-sm mt-8" style={{ color: "#64748b" }}>
            Pas encore de compte ?{" "}
            <Link to="/register" className="font-semibold hover:underline" style={{ color: "#C9A84C" }}>
              Créer un compte
            </Link>
          </p>

          <div className="mt-8 pt-6 border-t text-center">
            <p className="text-xs text-gray-400 mb-2">Comptes de démonstration</p>
            <div className="flex flex-col gap-1 text-xs">
              <p className="text-gray-500">📧 <span className="font-mono">admin@hotel.com</span> / <span className="font-mono">admin123</span> (Admin)</p>
              <p className="text-gray-500">📧 <span className="font-mono">client@test.com</span> / <span className="font-mono">client123</span> (Client)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}