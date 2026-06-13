// src/pages/Dashboard/Hotels.tsx
import { useState, useEffect } from "react";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  X,
  MapPin,
  Star,
  Wifi,
  Coffee,
  Dumbbell,
  Waves,
  Utensils,
  Car,
  Sparkles,
  Hotel
} from "lucide-react";

// Interface pour un hôtel
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

// Données initiales des hôtels
const DEFAULT_HOTELS: Hotel[] = [
  {
    id: "h1",
    nom: "Hôtel Terrou-Bi",
    ville: "Dakar",
    adresse: "Corniche Ouest, Dakar",
    prixNuit: 85000,
    note: 4.7,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80",
    description: "Hôtel de luxe en bord de mer avec vue imprenable sur l'océan.",
    amenities: ["Piscine", "SPA", "Restaurant", "Wifi gratuit", "Parking"],
    disponible: true,
  },
  {
    id: "h2",
    nom: "Radisson Blu",
    ville: "Dakar",
    adresse: "Route de la Corniche, Dakar",
    prixNuit: 120000,
    note: 4.9,
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&q=80",
    description: "Hôtel 5 étoiles avec services premium.",
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
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&q=80",
    description: "Hôtel d'affaires au cœur de Dakar.",
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
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&q=80",
    description: "Hôtel familial proche de la plage.",
    amenities: ["Piscine", "Restaurant", "Bar", "Wifi gratuit", "Parking"],
    disponible: true,
  },
];

const STORAGE_KEY = "hotels_data";

// Initialiser les hôtels dans localStorage
const initHotels = () => {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_HOTELS));
  }
};

initHotels();

// Services hôtels
const hotelService = {
  getAllHotels: (): Hotel[] => {
    const hotels = localStorage.getItem(STORAGE_KEY);
    return hotels ? JSON.parse(hotels) : DEFAULT_HOTELS;
  },
  
  getHotelById: (id: string): Hotel | undefined => {
    const hotels = hotelService.getAllHotels();
    return hotels.find(h => h.id === id);
  },
  
  addHotel: (hotel: Omit<Hotel, "id">): Hotel => {
    const hotels = hotelService.getAllHotels();
    const newHotel = {
      ...hotel,
      id: `h${Date.now()}`,
    };
    hotels.push(newHotel);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(hotels));
    return newHotel;
  },
  
  updateHotel: (id: string, updatedHotel: Partial<Hotel>): boolean => {
    const hotels = hotelService.getAllHotels();
    const index = hotels.findIndex(h => h.id === id);
    if (index !== -1) {
      hotels[index] = { ...hotels[index], ...updatedHotel };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(hotels));
      return true;
    }
    return false;
  },
  
  deleteHotel: (id: string): boolean => {
    const hotels = hotelService.getAllHotels();
    const filtered = hotels.filter(h => h.id !== id);
    if (filtered.length !== hotels.length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      return true;
    }
    return false;
  },
};

// Liste des équipements disponibles
const AMENITIES_LIST = [
  "Piscine", "SPA", "Restaurant", "Wifi gratuit", "Parking", 
  "Bar", "Salle de sport", "Terrasse", "Vue mer", "Animaux acceptés",
  "Service d'étage", "Navette aéroport", "Climatisation", "TV écran plat"
];

// Composant Modal pour ajouter/modifier un hôtel
function HotelModal({ 
  hotel, 
  onClose, 
  onSave 
}: { 
  hotel?: Hotel | null; 
  onClose: () => void; 
  onSave: () => void;
}) {
  const [formData, setFormData] = useState({
    nom: hotel?.nom || "",
    ville: hotel?.ville || "",
    adresse: hotel?.adresse || "",
    prixNuit: hotel?.prixNuit || 0,
    note: hotel?.note || 4,
    image: hotel?.image || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80",
    description: hotel?.description || "",
    amenities: hotel?.amenities || [],
    disponible: hotel?.disponible !== undefined ? hotel.disponible : true,
  });
  
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(formData.amenities);

  const toggleAmenity = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter(a => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const hotelData = {
      ...formData,
      amenities: selectedAmenities,
    };
    
    if (hotel) {
      // Modifier un hôtel existant
      hotelService.updateHotel(hotel.id, hotelData);
    } else {
      // Ajouter un nouvel hôtel
      hotelService.addHotel(hotelData);
    }
    
    onSave();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">
            {hotel ? "Modifier l'hôtel" : "Ajouter un hôtel"}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Nom de l'hôtel *</label>
              <input
                type="text"
                required
                value={formData.nom}
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500"
                placeholder="Nom de l'hôtel"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Ville *</label>
              <input
                type="text"
                required
                value={formData.ville}
                onChange={(e) => setFormData({ ...formData, ville: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500"
                placeholder="Dakar, Saly..."
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Adresse</label>
            <input
              type="text"
              value={formData.adresse}
              onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500"
              placeholder="Adresse complète"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Prix par nuit (FCFA) *</label>
              <input
                type="number"
                required
                value={formData.prixNuit}
                onChange={(e) => setFormData({ ...formData, prixNuit: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500"
                placeholder="85000"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Note (0-5)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500"
                placeholder="4.5"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">URL de l'image</label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500"
              placeholder="https://..."
            />
            <div className="mt-2">
              <img src={formData.image} alt="Aperçu" className="w-32 h-20 object-cover rounded-lg" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500"
              placeholder="Description de l'hôtel..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Équipements</label>
            <div className="flex flex-wrap gap-2">
              {AMENITIES_LIST.map((amenity) => (
                <button
                  key={amenity}
                  type="button"
                  onClick={() => toggleAmenity(amenity)}
                  className={`px-3 py-1.5 text-sm rounded-full transition ${
                    selectedAmenities.includes(amenity)
                      ? "bg-amber-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {amenity}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.disponible}
                onChange={(e) => setFormData({ ...formData, disponible: e.target.checked })}
                className="w-4 h-4 rounded accent-amber-500"
              />
              <span className="text-sm text-gray-700">Hôtel disponible</span>
            </label>
          </div>
          
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition"
            >
              {hotel ? "Enregistrer" : "Ajouter"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Composant principal
export default function HotelsManagement() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null);
  const itemsPerPage = 6;

  useEffect(() => {
    loadHotels();
  }, []);

  useEffect(() => {
    filterHotels();
  }, [hotels, searchTerm]);

  const loadHotels = () => {
    setLoading(true);
    const allHotels = hotelService.getAllHotels();
    setHotels(allHotels);
    setLoading(false);
  };

  const filterHotels = () => {
    let filtered = [...hotels];
    
    if (searchTerm) {
      filtered = filtered.filter(h => 
        h.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        h.ville.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredHotels(filtered);
    setCurrentPage(1);
  };

  const handleDelete = (id: string, nom: string) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer l'hôtel "${nom}" ?`)) {
      hotelService.deleteHotel(id);
      loadHotels();
    }
  };

  const handleSave = () => {
    loadHotels();
  };

  const totalPages = Math.ceil(filteredHotels.length / itemsPerPage);
  const paginatedHotels = filteredHotels.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Chargement des hôtels...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* En-tête */}
      <div className="flex flex-wrap justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestion des hôtels</h1>
          <p className="text-gray-500 mt-1">Ajoutez, modifiez ou supprimez des hôtels</p>
        </div>
        <button
          onClick={() => {
            setEditingHotel(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition"
        >
          <Plus size={18} />
          Ajouter un hôtel
        </button>
      </div>

      {/* Recherche */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par nom ou ville..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
          <button
            onClick={loadHotels}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
          >
            <RefreshCw size={18} />
            Actualiser
          </button>
        </div>
      </div>

      {/* Grille des hôtels */}
      {paginatedHotels.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-gray-100">
          <Hotel size={48} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Aucun hôtel</h3>
          <p className="text-gray-500">Aucun hôtel trouvé. Cliquez sur "Ajouter un hôtel" pour commencer.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {paginatedHotels.map((hotel) => (
            <div key={hotel.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
              <div className="flex flex-col sm:flex-row">
                <img
                  src={hotel.image}
                  alt={hotel.nom}
                  className="sm:w-40 h-40 object-cover"
                />
                <div className="flex-1 p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">{hotel.nom}</h3>
                      <div className="flex items-center gap-1 text-sm text-gray-500 mt-0.5">
                        <MapPin size={14} />
                        {hotel.ville}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
                      <Star size={14} className="fill-amber-400 text-amber-400" />
                      <span className="font-semibold text-sm">{hotel.note}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">{hotel.description}</p>
                  
                  <div className="flex flex-wrap gap-1 mt-2">
                    {hotel.amenities.slice(0, 4).map((a) => (
                      <span key={a} className="flex items-center gap-1 px-2 py-0.5 bg-gray-100 rounded-full text-xs text-gray-600">
                        {getAmenityIcon(a)}
                        {a}
                      </span>
                    ))}
                    {hotel.amenities.length > 4 && (
                      <span className="text-xs text-gray-400">+{hotel.amenities.length - 4}</span>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-center mt-3 pt-2 border-t">
                    <div>
                      <span className="text-xl font-bold text-amber-600">{hotel.prixNuit.toLocaleString()} FCFA</span>
                      <span className="text-xs text-gray-400">/nuit</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingHotel(hotel);
                          setShowModal(true);
                        }}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Modifier"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(hotel.id, hotel.nom)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Supprimer"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-500">
            {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredHotels.length)} sur {filteredHotels.length}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-2 text-gray-500 hover:text-amber-600 rounded-lg disabled:opacity-50"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-2 text-gray-500 hover:text-amber-600 rounded-lg disabled:opacity-50"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <HotelModal
          hotel={editingHotel}
          onClose={() => {
            setShowModal(false);
            setEditingHotel(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}