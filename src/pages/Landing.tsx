import { useState, useRef } from "react";
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

interface Offer {
  id: number;
  title: string;
  description: string;
  discount: string;
  expires: string;
  color: string;
  icon: string;
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
    amenities: ["🏊 Piscine", "🍽️ Restaurant", "🌊 Vue mer"],
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
    amenities: ["🏋️ Gym", "🍹 Bar", "🚗 Parking"],
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
    amenities: ["👑 Suite", "🧖 Spa", "✈️ Navette"],
  },
  {
    id: 4,
    name: "Lamantin Beach Resort",
    location: "Saly, Sénégal",
    priceXof: 62320,
    rating: 4.6,
    reviews: 421,
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
    amenities: ["🏖️ Plage privée", "🎵 Animation", "🌴 Jardin"],
  },
];

const DESTINATIONS = ["Dakar", "Saly", "Saint-Louis", "Ziguinchor", "Mbour", "Thiès"];

const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "Sophie Martin",
    country: "France",
    flag: "🇫🇷",
    text: "Service exceptionnel, chambre magnifique avec vue sur l'océan. Une expérience inoubliable au Sénégal !",
    rating: 5,
    avatar: "SM",
    stayed: "Hôtel Terrou-Bi",
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

const OFFERS: Offer[] = [
  {
    id: 1,
    title: "Escapade estivale",
    description: "Profitez de l'été sénégalais au meilleur prix",
    discount: "-20%",
    expires: "31 août 2025",
    color: "from-amber-500 to-orange-600",
    icon: "☀️",
  },
  {
    id: 2,
    title: "Week-end de luxe",
    description: "2 nuits + petit-déjeuner offert dans nos hôtels 5★",
    discount: "-15%",
    expires: "30 juin 2025",
    color: "from-emerald-500 to-teal-600",
    icon: "🌙",
  },
  {
    id: 3,
    title: "Réservation anticipée",
    description: "Réservez 30 jours à l'avance et économisez",
    discount: "-25%",
    expires: "31 décembre 2025",
    color: "from-blue-500 to-indigo-600",
    icon: "⚡",
  },
];

// ─── StarRating ───────────────────────────────────────────────────────────────
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} className={`w-4 h-4 ${s <= rating ? "text-amber-400" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20">
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
      className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-100"
      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-6px)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; }}
      style={{ transition: "transform 0.3s ease, box-shadow 0.3s ease" }}
      onClick={() => navigate("/booking", { state: { hotelId: hotel.id } })}
    >
      <div className="relative h-52 overflow-hidden">
        <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        {hotel.badge && (
          <span className="absolute top-3 left-3 bg-white/95 text-amber-700 text-xs font-bold px-3 py-1 rounded-full shadow">
            ✦ {hotel.badge}
          </span>
        )}
        <div className="absolute bottom-3 right-3 bg-white/95 rounded-xl px-3 py-1.5 shadow">
          <span className="text-gray-900 font-black">{hotel.priceXof.toLocaleString("fr-FR")}</span>
          <span className="text-gray-500 text-xs"> FCFA/nuit</span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-bold text-gray-900 text-lg mb-1">{hotel.name}</h3>
        <p className="text-gray-400 text-sm flex items-center gap-1 mb-3">
          <svg className="w-3.5 h-3.5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          {hotel.location}
        </p>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {hotel.amenities.map((a) => (
            <span key={a} className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">{a}</span>
          ))}
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1.5">
            <StarRating rating={hotel.rating} />
            <span className="text-gray-700 font-semibold text-sm">{hotel.rating}</span>
            <span className="text-gray-400 text-xs">({hotel.reviews})</span>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); navigate("/booking", { state: { hotelId: hotel.id } }); }}
            className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow hover:shadow-md"
          >
            Réserver
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── SearchBar ────────────────────────────────────────────────────────────────
function SearchBar() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = DESTINATIONS.filter((d) =>
    d.toLowerCase().includes(query.toLowerCase()) && query.length > 0
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/booking", { state: { destination: query, checkIn, checkOut, guests } });
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl overflow-visible max-w-5xl mx-auto border border-gray-100">
      <form onSubmit={handleSearch} className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">

          {/* Destination */}
          <div className="md:col-span-4 relative">
            <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Destination</label>
            <div className={`flex items-center gap-3 border-2 rounded-xl px-4 py-3 transition-all ${query ? "border-amber-400 bg-amber-50/30" : "border-gray-200 hover:border-gray-300"}`}>
              <svg className="w-5 h-5 text-amber-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                placeholder="Où voulez-vous aller ?"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setShowSuggestions(true); }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                className="flex-1 bg-transparent text-gray-800 placeholder-gray-400 text-sm font-medium outline-none"
              />
              {query && (
                <button type="button" onClick={() => setQuery("")} className="text-gray-400 hover:text-gray-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            {/* Suggestions */}
            {showSuggestions && (filtered.length > 0 || query.length === 0) && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden">
                {query.length === 0 && (
                  <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-50">
                    Destinations populaires
                  </div>
                )}
                {(query.length === 0 ? DESTINATIONS.slice(0, 5) : filtered).map((dest) => (
                  <button
                    key={dest}
                    type="button"
                    onClick={() => { setQuery(dest); setShowSuggestions(false); }}
                    className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-700 flex items-center gap-3 transition-colors"
                  >
                    <span>{query.length === 0 ? "🔥" : "📍"}</span>
                    {dest}, Sénégal
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Check-in */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Arrivée</label>
            <div className={`flex items-center gap-2 border-2 rounded-xl px-4 py-3 transition-all ${checkIn ? "border-amber-400 bg-amber-50/30" : "border-gray-200 hover:border-gray-300"}`}>
              <svg className="w-4 h-4 text-amber-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="flex-1 bg-transparent text-gray-800 text-sm font-medium outline-none min-w-0" />
            </div>
          </div>

          {/* Check-out */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Départ</label>
            <div className={`flex items-center gap-2 border-2 rounded-xl px-4 py-3 transition-all ${checkOut ? "border-amber-400 bg-amber-50/30" : "border-gray-200 hover:border-gray-300"}`}>
              <svg className="w-4 h-4 text-amber-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="flex-1 bg-transparent text-gray-800 text-sm font-medium outline-none min-w-0" />
            </div>
          </div>

          {/* Voyageurs */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Voyageurs</label>
            <div className="flex items-center gap-2 border-2 border-gray-200 hover:border-gray-300 rounded-xl px-4 py-3 transition-all">
              <svg className="w-4 h-4 text-amber-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <button type="button" onClick={() => setGuests(Math.max(1, guests - 1))} className="w-5 h-5 rounded-full bg-gray-100 hover:bg-amber-100 text-gray-600 text-xs font-bold flex items-center justify-center transition-colors">−</button>
              <span className="text-gray-800 text-sm font-bold w-4 text-center">{guests}</span>
              <button type="button" onClick={() => setGuests(Math.min(10, guests + 1))} className="w-5 h-5 rounded-full bg-gray-100 hover:bg-amber-100 text-gray-600 text-xs font-bold flex items-center justify-center transition-colors">+</button>
            </div>
          </div>

          {/* Bouton */}
          <div className="md:col-span-2 flex items-end">
            <button type="submit" className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg text-sm flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Rechercher
            </button>
          </div>
        </div>

        {/* Filtres rapides */}
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
          <span className="text-xs text-gray-400 font-medium self-center">Populaires :</span>
          {["Dakar", "Saly plage", "Hôtel 5★", "Petit-déjeuner inclus"].map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setQuery(tag.split(" ")[0])}
              className="text-xs bg-gray-100 hover:bg-amber-100 hover:text-amber-700 text-gray-600 px-3 py-1.5 rounded-full transition-colors font-medium"
            >
              {tag}
            </button>
          ))}
        </div>
      </form>
    </div>
  );
}

// ─── Page principale ──────────────────────────────────────────────────────────
export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-50">

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1920&q=90" alt="Hero" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/45 to-black/75" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-6xl mx-auto w-full">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 mb-8">
            <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
            <span className="text-white/90 text-sm font-medium">+500 hôtels disponibles au Sénégal</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white mb-5 leading-tight tracking-tight">
            Réservez votre
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
              hôtel idéal
            </span>
          </h1>

          <p className="text-white/75 text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
            Découvrez les plus beaux hôtels du Sénégal. Comparez, réservez et voyagez en toute sérénité.
          </p>

          <SearchBar />

          <div className="flex flex-wrap items-center justify-center gap-10 mt-14">
            {[
              { value: "500+", label: "Hôtels partenaires" },
              { value: "50k+", label: "Clients satisfaits" },
              { value: "4.9★", label: "Note moyenne" },
              { value: "24/7", label: "Support client" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-black text-white">{stat.value}</div>
                <div className="text-white/55 text-sm mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 animate-bounce">
          <span className="text-white/40 text-xs tracking-wider">DÉFILER</span>
          <svg className="w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* ── Hôtels populaires ── */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
          <div>
            <span className="text-amber-500 font-bold text-xs tracking-widest uppercase">Nos sélections</span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mt-2 leading-tight">Hôtels populaires</h2>
            <p className="text-gray-400 mt-3 text-lg">Les établissements les plus appréciés par nos voyageurs</p>
          </div>
          <button onClick={() => navigate("/booking")} className="hidden md:flex items-center gap-2 bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold px-5 py-3 rounded-xl transition-colors text-sm">
            Voir tous les hôtels
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {HOTELS.map((hotel) => <HotelCard key={hotel.id} hotel={hotel} />)}
        </div>
        <div className="text-center mt-10 md:hidden">
          <button onClick={() => navigate("/booking")} className="text-amber-600 font-bold border-2 border-amber-200 rounded-xl px-6 py-3 hover:bg-amber-50 transition-colors text-sm">
            Voir tous les hôtels →
          </button>
        </div>
      </section>

      {/* ── Offres spéciales ── */}
      <section className="py-24 bg-gray-900 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-amber-400 font-bold text-xs tracking-widest uppercase">Promotions</span>
            <h2 className="text-4xl md:text-5xl font-black text-white mt-2">Offres spéciales</h2>
            <p className="text-gray-500 mt-3 text-lg">Des réductions exceptionnelles pour vos prochains séjours</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {OFFERS.map((offer) => (
              <div key={offer.id} className="relative overflow-hidden rounded-3xl p-8 cursor-pointer group" onClick={() => navigate("/booking")}>
                <div className={`absolute inset-0 bg-gradient-to-br ${offer.color} opacity-90 group-hover:opacity-100 transition-opacity`} />
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/4 translate-x-1/4" />
                <div className="relative z-10">
                  <div className="text-4xl mb-3">{offer.icon}</div>
                  <div className="text-5xl font-black text-white mb-2">{offer.discount}</div>
                  <h3 className="text-xl font-bold text-white mb-2">{offer.title}</h3>
                  <p className="text-white/75 text-sm mb-6">{offer.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-xs">Expire le {offer.expires}</span>
                    <button className="bg-white/20 hover:bg-white/30 text-white text-sm font-bold px-5 py-2 rounded-xl transition-all">Profiter →</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Avantages ── */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-amber-500 font-bold text-xs tracking-widest uppercase">Nos avantages</span>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mt-2">Pourquoi nous choisir ?</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: "🏆", title: "Meilleur prix garanti", desc: "Garantie du meilleur prix sur tous nos hôtels partenaires" },
            { icon: "🔒", title: "Paiement sécurisé", desc: "Vos données bancaires sont protégées à 100%" },
            { icon: "📞", title: "Support 24/7", desc: "Notre équipe est disponible à toute heure pour vous aider" },
            { icon: "✅", title: "Annulation gratuite", desc: "Annulez gratuitement jusqu'à 24h avant votre arrivée" },
          ].map((item) => (
            <div key={item.title} className="text-center group p-6 rounded-2xl hover:bg-amber-50 transition-colors">
              <div className="w-16 h-16 bg-amber-100 group-hover:bg-amber-200 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-5 transition-colors">
                {item.icon}
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-2">{item.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Témoignages ── */}
      <section className="py-24 bg-gradient-to-br from-amber-50 to-orange-50 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-amber-500 font-bold text-xs tracking-widest uppercase">Avis clients</span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mt-2">Ce que disent nos clients</h2>
            <p className="text-gray-400 mt-3 text-lg">Des milliers de voyageurs nous font confiance</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t) => (
              <div key={t.id} className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-5">
                  <StarRating rating={t.rating} />
                  <span className="text-2xl">{t.flag}</span>
                </div>
                <p className="text-gray-700 leading-relaxed italic mb-6 text-sm">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <div className="w-11 h-11 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white font-black text-sm shrink-0">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-sm">{t.name}</div>
                    <div className="text-gray-400 text-xs">{t.country} · Séjour à {t.stayed}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6 bg-gradient-to-br from-amber-500 to-orange-600 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-black/10 rounded-full translate-y-1/2 blur-3xl" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-5">Prêt pour votre prochaine aventure ?</h2>
          <p className="text-white/80 text-xl mb-10">Rejoignez 50 000 voyageurs qui nous font confiance pour leurs séjours au Sénégal.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate("/register")} className="bg-white text-amber-600 font-black px-8 py-4 rounded-2xl hover:bg-amber-50 transition-all shadow-xl text-base">
              Créer un compte gratuit
            </button>
            <button onClick={() => navigate("/booking")} className="border-2 border-white/40 text-white font-bold px-8 py-4 rounded-2xl hover:bg-white/10 transition-all text-base">
              Explorer les hôtels →
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}