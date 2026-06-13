// src/pages/Hotels.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Star, MapPin, Wifi, Coffee, Dumbbell, Waves, Utensils, Car, Sparkles, Search } from "lucide-react";

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

const STORAGE_KEY = "hotels_data";

const DEFAULT_HOTELS: Hotel[] = [
  {
    id: "h1",
    nom: "Hôtel Terrou-Bi",
    ville: "Dakar",
    adresse: "Corniche Ouest, Dakar",
    prixNuit: 85000,
    note: 4.7,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&q=80",
    description: "Hôtel de luxe en bord de mer avec vue imprenable sur l'océan. Piscine à débordement, spa et restaurants gastronomiques.",
    amenities: ["Piscine", "SPA", "Restaurant", "Wifi gratuit", "Parking", "Bar"],
    disponible: true,
  },
  {
    id: "h2",
    nom: "Radisson Blu",
    ville: "Dakar",
    adresse: "Route de la Corniche, Dakar",
    prixNuit: 120000,
    note: 4.9,
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=500&q=80",
    description: "Hôtel 5 étoiles avec services premium. Vue imprenable sur l'océan, piscine infinie et espaces de réunion haut de gamme.",
    amenities: ["Piscine", "SPA", "Restaurant", "Gym", "Wifi gratuit", "Terrasse"],
    disponible: true,
  },
  {
    id: "h3",
    nom: "Pullman Dakar",
    ville: "Dakar",
    adresse: "Place de l'Indépendance, Dakar",
    prixNuit: 98000,
    note: 4.6,
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=500&q=80",
    description: "Hôtel d'affaires au cœur de Dakar. Idéal pour les voyages professionnels avec des espaces de travail modernes.",
    amenities: ["Piscine", "Restaurant", "Bar", "Salle de sport", "Wifi gratuit"],
    disponible: true,
  },
  {
    id: "h4",
    nom: "Hôtel Lagon 2",
    ville: "Saly",
    adresse: "Station balnéaire, Saly",
    prixNuit: 65000,
    note: 4.4,
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=500&q=80",
    description: "Hôtel familial proche de la plage. Parfait pour des vacances en famille avec club enfants et animations.",
    amenities: ["Piscine", "Restaurant", "Bar", "Wifi gratuit", "Parking"],
    disponible: true,
  },
];

const initHotels = () => {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_HOTELS));
  }
};

initHotels();

const getHotels = (): Hotel[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  return DEFAULT_HOTELS;
};

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
  return Icon ? <Icon size={12} /> : null;
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} className={`w-3.5 h-3.5 ${s <= Math.round(rating) ? "text-amber-400" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function Hotels() {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHotels();
  }, []);

  const loadHotels = () => {
    const allHotels = getHotels();
    const availableHotels = allHotels.filter(h => h.disponible);
    setHotels(availableHotels);
    setLoading(false);
  };

  const filteredHotels = hotels.filter(hotel =>
    hotel.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hotel.ville.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Découvrez nos hôtels</h1>
        <p className="text-gray-600">Trouvez l'hôtel parfait pour votre séjour au Sénégal</p>
      </div>

      <div className="mb-8 flex justify-center">
        <div className="relative w-full max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un hôtel ou une ville..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
        </div>
      </div>

      {filteredHotels.length === 0 ? (
        <div className="text-center py-12">
          <HotelIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-700">Aucun hôtel trouvé</h3>
          <p className="text-gray-500 mt-1">Essayez une autre recherche</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHotels.map((hotel) => (
            <div
              key={hotel.id}
              className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 overflow-hidden"
              onClick={() => navigate("/booking", { state: { hotel } })}
            >
              <div className="relative h-48 overflow-hidden">
                <img src={hotel.image} alt={hotel.nom} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-3 right-3 bg-white/90 rounded-lg px-2.5 py-1 shadow-sm">
                  <span className="text-gray-900 font-bold text-sm">{hotel.prixNuit.toLocaleString("fr-FR")}</span>
                  <span className="text-gray-500 text-xs"> FCFA/nuit</span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-gray-900 text-lg">{hotel.nom}</h3>
                  <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-lg">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="font-semibold text-sm">{hotel.note}</span>
                  </div>
                </div>
                
                <p className="text-gray-500 text-sm flex items-center gap-1 mb-2">
                  <MapPin size={14} className="text-amber-500" />
                  {hotel.ville}
                </p>
                
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{hotel.description}</p>
                
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {hotel.amenities.slice(0, 3).map((a) => (
                    <span key={a} className="flex items-center gap-1 text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">
                      {getAmenityIcon(a)}
                      {a}
                    </span>
                  ))}
                  {hotel.amenities.length > 3 && (
                    <span className="text-xs text-gray-400">+{hotel.amenities.length - 3}</span>
                  )}
                </div>
                
                <button
                  onClick={(e) => { e.stopPropagation(); navigate("/booking", { state: { hotel } }); }}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all"
                >
                  Réserver
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
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