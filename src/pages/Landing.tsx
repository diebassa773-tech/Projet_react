import { useNavigate } from "react-router-dom";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Hotel {
  id: number;
  name: string;
  location: string;
  priceXof: number;
  rating: number;
  reviews: number;
  image: string;
  badge?: string;
  amenities: string[];
}

interface Testimonial {
  id: number;
  name: string;
  country: string;
  flag: string;
  text: string;
  rating: number;
  avatar: string;
  stayed: string;
}

// ─── Données mock ─────────────────────────────────────────────────────────────
const HOTELS: Hotel[] = [
  {
    id: 1,
    name: "Hôtel Terrou-Bi",
    location: "Dakar, Sénégal",
    priceXof: 78720,
    rating: 4.9,
    reviews: 312,
    image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&q=80",
    badge: "Coup de cœur",
    amenities: ["Piscine", "Restaurant", "Vue mer"],
  },
  {
    id: 2,
    name: "Radisson Blu",
    location: "Dakar, Sénégal",
    priceXof: 118080,
    rating: 4.8,
    reviews: 245,
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80",
    badge: "Luxe",
    amenities: ["Gym", "Bar", "Parking"],
  },
  {
    id: 3,
    name: "King Fahd Palace",
    location: "Dakar, Sénégal",
    priceXof: 164000,
    rating: 4.7,
    reviews: 198,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
    badge: "Premium",
    amenities: ["Suite", "Spa", "Navette"],
  },
  {
    id: 4,
    name: "Lamantin Beach Resort",
    location: "Saly, Sénégal",
    priceXof: 62320,
    rating: 4.6,
    reviews: 421,
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
    amenities: ["Plage privée", "Animation", "Jardin"],
  },
];

const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "Sophie Martin",
    country: "France",
    flag: "🇫🇷",
    text: "Service exceptionnel, chambre magnifique avec vue sur l'océan. Une expérience inoubliable au Sénégal !",
    rating: 5,
    avatar: "SM",
    stayed: "Terrou-Bi",
  },
  {
    id: 2,
    name: "Amadou Diallo",
    country: "Sénégal",
    flag: "🇸🇳",
    text: "La plateforme est très intuitive. J'ai réservé en 2 minutes et l'hôtel était exactement comme sur les photos.",
    rating: 5,
    avatar: "AD",
    stayed: "Radisson Blu",
  },
  {
    id: 3,
    name: "James Carter",
    country: "États-Unis",
    flag: "🇺🇸",
    text: "Best hotel booking experience in West Africa. The prices are great and the service is top notch.",
    rating: 5,
    avatar: "JC",
    stayed: "King Fahd Palace",
  },
];

// ─── StarRating ───────────────────────────────────────────────────────────────
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} className={`w-3.5 h-3.5 ${s <= rating ? "text-amber-400" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

// ─── HotelCard ────────────────────────────────────────────────────────────────
function HotelCard({ hotel }: { hotel: Hotel }) {
  const navigate = useNavigate();
  return (
    <div
      className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100"
      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; }}
      onClick={() => navigate("/hotels")}
    >
      <div className="relative h-48 overflow-hidden">
        <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        {hotel.badge && (
          <span className="absolute top-3 left-3 bg-white/90 text-amber-700 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
            ✦ {hotel.badge}
          </span>
        )}
        <div className="absolute bottom-3 right-3 bg-white/90 rounded-lg px-2.5 py-1 shadow-sm">
          <span className="text-gray-900 font-bold text-sm">{hotel.priceXof.toLocaleString("fr-FR")}</span>
          <span className="text-gray-500 text-xs"> FCFA/nuit</span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-gray-900 text-base mb-0.5">{hotel.name}</h3>
        <p className="text-gray-400 text-xs flex items-center gap-1 mb-2">
          <svg className="w-3 h-3 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          {hotel.location}
        </p>
        <div className="flex flex-wrap gap-1 mb-3">
          {hotel.amenities.slice(0, 3).map((a) => (
            <span key={a} className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">{a}</span>
          ))}
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center gap-1.5">
            <StarRating rating={hotel.rating} />
            <span className="text-gray-700 font-semibold text-xs">{hotel.rating}</span>
            <span className="text-gray-400 text-xs">({hotel.reviews})</span>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); navigate("/hotels"); }}
            className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
          >
            Réserver
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Page principale ──────────────────────────────────────────────────────────
export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-50">

      {/* ── HERO SECTION ── */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1920&q=90" alt="Hero" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto w-full">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
            <span className="text-white/90 text-xs font-medium">+500 hôtels disponibles au Sénégal</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-5 leading-tight">
            Réservez votre
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
              hôtel idéal
            </span>
          </h1>

          <p className="text-white/70 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
            Découvrez les plus beaux établissements du Sénégal. Comparez, réservez et vivez une expérience unique.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/hotels")}
              className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold px-8 py-3 rounded-xl transition-all shadow-lg text-base"
            >
              Explorer les hôtels
            </button>
            <button
              onClick={() => navigate("/register")}
              className="border-2 border-white/30 text-white font-semibold px-8 py-3 rounded-xl hover:bg-white/10 transition-all text-base"
            >
              Créer un compte
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 mt-12">
            {[
              { value: "500+", label: "Hôtels partenaires" },
              { value: "50k+", label: "Clients satisfaits" },
              { value: "4.9★", label: "Note moyenne" },
              { value: "24/7", label: "Support client" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-white/40 text-xs mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-4 h-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* ── À PROPOS DE HOTELBOOKING ── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-amber-500 font-semibold text-xs tracking-wider uppercase mb-2 block">Notre histoire</span>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Plus qu'une plateforme,<br />une <span className="text-amber-500">passion</span>
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                HotelBooking est né en 2020 d'une ambition simple : révolutionner la réservation hôtelière au Sénégal. 
                Nous avons créé une plateforme qui connecte les voyageurs aux meilleurs établissements du pays, 
                avec transparence, simplicité et authenticité.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                Aujourd'hui, nous sommes fiers de collaborer avec plus de 500 hôtels partenaires et d'avoir 
                accompagné plus de 50 000 voyageurs dans la découverte des merveilles du Sénégal.
              </p>
              <div className="flex gap-8">
                <div>
                  <div className="text-3xl font-bold text-amber-500">500+</div>
                  <div className="text-xs text-gray-500">Hôtels partenaires</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-amber-500">50k+</div>
                  <div className="text-xs text-gray-500">Clients satisfaits</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-amber-500">4.9★</div>
                  <div className="text-xs text-gray-500">Note moyenne</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-32 h-32 bg-amber-100 rounded-2xl -z-0"></div>
              <img 
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80" 
                alt="À propos" 
                className="relative z-10 rounded-2xl shadow-xl w-full h-80 object-cover"
              />
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-amber-100 rounded-2xl -z-0"></div>
            </div>
          </div>
        </div>
      </section>

      {/* ── NOS VALEURS ── */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-amber-500 font-semibold text-xs tracking-wider uppercase">Pourquoi nous choisir</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">Nos valeurs</h2>
            <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
              La confiance, la transparence et l'excellence sont au cœur de notre engagement
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "🤝",
                title: "Confiance & Transparence",
                description: "Prix clairs, sans surprise. Ce que vous voyez est ce que vous payez.",
              },
              {
                icon: "⚡",
                title: "Simplicité & Rapidité",
                description: "Réservez votre hôtel en moins de 2 minutes, où que vous soyez.",
              },
              {
                icon: "🌟",
                title: "Excellence & Qualité",
                description: "Des établissements rigoureusement sélectionnés pour vous.",
              },
              {
                icon: "💚",
                title: "Authenticité Locale",
                description: "Promotion de l'hôtellerie sénégalaise et de ses talents.",
              },
              {
                icon: "🔒",
                title: "Sécurité Maximale",
                description: "Paiements sécurisés et données personnelles protégées.",
              },
              {
                icon: "📞",
                title: "Support Dédié",
                description: "Une équipe à votre écoute 24h/24 et 7j/7.",
              },
            ].map((value) => (
              <div key={value.title} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all text-center group">
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="font-bold text-gray-800 mb-2">{value.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HÔTELS POPULAIRES ── */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-amber-500 font-semibold text-xs tracking-wider uppercase">Nos sélections</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-1">Hôtels populaires</h2>
            <p className="text-gray-500 mt-2">Les établissements les plus appréciés par nos voyageurs</p>
          </div>
          <button onClick={() => navigate("/hotels")} className="hidden md:flex items-center gap-2 bg-amber-50 hover:bg-amber-100 text-amber-700 font-semibold px-4 py-2 rounded-lg transition-colors text-sm">
            Voir tous les hôtels
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {HOTELS.map((hotel) => <HotelCard key={hotel.id} hotel={hotel} />)}
        </div>
        <div className="text-center mt-8 md:hidden">
          <button onClick={() => navigate("/hotels")} className="text-amber-600 font-semibold border border-amber-200 rounded-lg px-5 py-2 hover:bg-amber-50 transition-colors text-sm">
            Voir tous les hôtels →
          </button>
        </div>
      </section>

      {/* ── TÉMOIGNAGES ── */}
      <section className="py-16 px-6 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-amber-500 font-semibold text-xs tracking-wider uppercase">Avis clients</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-1">Ils nous font confiance</h2>
            <p className="text-gray-500 mt-2">Des milliers de voyageurs satisfaits</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.id} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-4">
                  <StarRating rating={t.rating} />
                  <span className="text-2xl">{t.flag}</span>
                </div>
                <p className="text-gray-600 leading-relaxed italic text-sm mb-4">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                  <div className="w-9 h-9 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800 text-sm">{t.name}</div>
                    <div className="text-gray-400 text-xs">{t.country} · {t.stayed}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="py-16 px-6 bg-gradient-to-r from-amber-500 to-orange-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Prêt pour votre prochaine aventure ?</h2>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto">
            Rejoignez des milliers de voyageurs qui nous font confiance pour leurs séjours au Sénégal
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/register")}
              className="bg-white text-amber-600 font-semibold px-8 py-3 rounded-xl hover:bg-amber-50 transition-all shadow-md"
            >
              Créer un compte gratuit
            </button>
            <button
              onClick={() => navigate("/hotels")}
              className="border-2 border-white/30 text-white font-semibold px-8 py-3 rounded-xl hover:bg-white/10 transition-all"
            >
              Explorer les hôtels
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}