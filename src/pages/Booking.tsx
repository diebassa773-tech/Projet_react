// src/pages/Booking.tsx
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { 
  Calendar, 
  User, 
  MapPin, 
  Star, 
  ChevronLeft, 
  Wifi, 
  Coffee, 
  Dumbbell, 
  Waves, 
  Utensils, 
  Car, 
  Sparkles,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { authService } from "../services/auth";
import { reservationService } from "../services/reservationService";

// Interface pour les hôtels
interface Hotel {
  id: string;
  nom: string;
  ville: string;
  adresse: string;
  prixNuit: number;
  note: number;
  image: string;
  description: string;
  amenities: string[];
  disponible: boolean;
}

const getAmenityIcon = (amenity: string) => {
  const icons: Record<string, any> = {
    "Piscine": Waves,
    "SPA": Sparkles,
    "Restaurant": Utensils,
    "Wifi gratuit": Wifi,
    "Parking": Car,
    "Bar": Coffee,
    "Salle de sport": Dumbbell,
  };
  const Icon = icons[amenity];
  return Icon ? <Icon size={14} /> : null;
};

export default function Booking() {
  const location = useLocation();
  const navigate = useNavigate();
  const hotel = location.state?.hotel as Hotel | null;
  
  const [nomComplet, setNomComplet] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [chambre, setChambre] = useState("standard");
  const [dateArrivee, setDateArrivee] = useState("");
  const [dateDepart, setDateDepart] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const chambres = [
    { id: "standard", name: "Chambre Standard", price: 0, description: "Lit double, salle de bain privée, climatisation" },
    { id: "superieure", name: "Chambre Supérieure", price: 15000, description: "Lit king size, vue sur jardin, salon" },
    { id: "deluxe", name: "Chambre Deluxe", price: 30000, description: "Suite avec vue sur mer, terrasse privée" },
    { id: "suite", name: "Suite Présidentielle", price: 60000, description: "2 chambres, salon, jacuzzi, vue panoramique" },
  ];

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      setNomComplet(`${user.prenom} ${user.nom}`);
      setEmail(user.email);
      
      // Récupérer le téléphone depuis le profil si disponible
      const savedPhone = localStorage.getItem(`user_phone_${user.id}`);
      if (savedPhone) setTelephone(savedPhone);
    }
  }, []);

  const calculerNuits = () => {
    if (dateArrivee && dateDepart) {
      const arrivee = new Date(dateArrivee);
      const depart = new Date(dateDepart);
      const nuits = Math.ceil((depart.getTime() - arrivee.getTime()) / (1000 * 60 * 60 * 24));
      return nuits > 0 ? nuits : 0;
    }
    return 0;
  };

  const nuits = calculerNuits();
  const chambreSelectionnee = chambres.find(c => c.id === chambre);
  const prixParNuit = (hotel?.prixNuit || 0) + (chambreSelectionnee?.price || 0);
  const total = nuits * prixParNuit;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      setError("Veuillez vous connecter pour réserver");
      setTimeout(() => navigate("/login"), 2000);
      setLoading(false);
      return;
    }

    if (!nomComplet || !email || !telephone) {
      setError("Veuillez remplir tous les champs obligatoires");
      setLoading(false);
      return;
    }

    if (!dateArrivee || !dateDepart) {
      setError("Veuillez sélectionner les dates d'arrivée et de départ");
      setLoading(false);
      return;
    }

    const arrivee = new Date(dateArrivee);
    const depart = new Date(dateDepart);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (arrivee < today) {
      setError("La date d'arrivée ne peut pas être dans le passé");
      setLoading(false);
      return;
    }

    if (depart <= arrivee) {
      setError("La date de départ doit être après la date d'arrivée");
      setLoading(false);
      return;
    }

    const reservationData = {
      hotelId: hotel!.id,
      hotelName: hotel!.nom,
      hotelImage: hotel!.image,
      hotelLocation: hotel!.ville,
      chambre: chambreSelectionnee?.name || "Chambre Standard",
      dateArrivee,
      dateDepart,
      nuits,
      prixTotal: total,
      clientName: nomComplet,
      clientEmail: email,
      clientPhone: telephone,
    };

    try {
      const newReservation = reservationService.createReservation(reservationData);
      console.log("✅ Réservation créée:", newReservation);
      setSuccess(`Réservation confirmée ! Votre réservation est en attente de confirmation.`);
      setTimeout(() => {
        navigate("/my-reservations");
      }, 2500);
    } catch (err) {
      setError("Une erreur est survenue lors de la réservation");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!hotel) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <HotelIcon className="w-10 h-10 text-amber-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Aucun hôtel sélectionné</h1>
          <p className="text-gray-500 mb-6">Veuillez sélectionner un hôtel depuis la page d'accueil</p>
          <button 
            onClick={() => navigate("/hotels")}
            className="inline-flex items-center gap-2 bg-amber-500 text-white px-6 py-3 rounded-xl hover:bg-amber-600 transition"
          >
            <ChevronLeft size={20} />
            Voir les hôtels
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-amber-600 mb-6 transition-colors"
        >
          <ChevronLeft size={20} />
          Retour
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Colonne gauche - Détails hôtel */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="relative h-64">
                <img src={hotel.image} alt={hotel.nom} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-4 right-4 bg-white/90 rounded-xl px-3 py-1.5 shadow-sm">
                  <span className="text-gray-900 font-bold">{hotel.prixNuit.toLocaleString("fr-FR")}</span>
                  <span className="text-gray-500 text-sm"> FCFA/nuit</span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-1">{hotel.nom}</h1>
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <MapPin size={16} />
                      <span>{hotel.ville}, Sénégal</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-amber-50 px-3 py-2 rounded-xl">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="font-bold text-gray-800">{hotel.note}</span>
                  </div>
                </div>
                
                <p className="text-gray-600 leading-relaxed mb-6">{hotel.description}</p>
                
                <div className="border-t pt-6">
                  <h3 className="font-semibold text-gray-800 mb-3">Équipements</h3>
                  <div className="flex flex-wrap gap-2">
                    {hotel.amenities.map((amenity: string) => (
                      <div key={amenity} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-full text-xs text-gray-600">
                        {getAmenityIcon(amenity)}
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Colonne droite - Formulaire */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg sticky top-8">
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold text-gray-800 mb-2">Votre réservation</h2>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-amber-600">{prixParNuit.toLocaleString()} FCFA</span>
                  <span className="text-gray-500">/nuit</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-xl text-sm">
                    <AlertCircle size={16} />
                    {error}
                  </div>
                )}
                
                {success && (
                  <div className="flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded-xl text-sm">
                    <CheckCircle size={16} />
                    {success}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nom complet *</label>
                  <div className="relative">
                    <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={nomComplet}
                      onChange={(e) => setNomComplet(e.target.value)}
                      className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500"
                      placeholder="Jean Dupont"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500"
                    placeholder="jean@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Téléphone *</label>
                  <input
                    type="tel"
                    required
                    value={telephone}
                    onChange={(e) => setTelephone(e.target.value)}
                    className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500"
                    placeholder="77 123 45 67"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Type de chambre</label>
                  <select
                    value={chambre}
                    onChange={(e) => setChambre(e.target.value)}
                    className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500"
                  >
                    {chambres.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name} {c.price > 0 ? `(+${c.price.toLocaleString()} FCFA/nuit)` : ""}
                      </option>
                    ))}
                  </select>
                  {chambreSelectionnee && (
                    <p className="text-xs text-gray-500 mt-1">{chambreSelectionnee.description}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Arrivée *</label>
                    <div className="relative">
                      <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="date"
                        required
                        value={dateArrivee}
                        onChange={(e) => setDateArrivee(e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                        className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Départ *</label>
                    <div className="relative">
                      <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="date"
                        required
                        value={dateDepart}
                        onChange={(e) => setDateDepart(e.target.value)}
                        min={dateArrivee || new Date().toISOString().split("T")[0]}
                        className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>
                </div>

                {nuits > 0 && (
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-gray-600 text-sm">
                      <span>{prixParNuit.toLocaleString()} FCFA × {nuits} nuit{nuits > 1 ? "s" : ""}</span>
                      <span>{total.toLocaleString()} FCFA</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span className="text-amber-600">{total.toLocaleString()} FCFA</span>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !dateArrivee || !dateDepart}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Traitement...
                    </div>
                  ) : (
                    "Confirmer la réservation"
                  )}
                </button>

                <p className="text-xs text-center text-gray-400 mt-4">
                  En confirmant, vous acceptez nos conditions générales. Votre réservation sera en attente de confirmation.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HotelIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  );
}