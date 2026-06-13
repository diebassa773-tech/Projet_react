// src/pages/MyReservations.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Calendar, 
  MapPin, 
  CreditCard, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Home,
  Eye,
  RefreshCw,
  Trash2
} from "lucide-react";
import { reservationService } from "../services/reservationService";
import { authService } from "../services/auth";

export default function MyReservations() {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [selectedReservation, setSelectedReservation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadReservations = () => {
    const user = authService.getCurrentUser();
    if (user) {
      const userReservations = reservationService.getUserReservations(user.email);
      console.log("Réservations chargées:", userReservations);
      setReservations(userReservations);
    }
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    loadReservations();
  }, []);

  const refreshData = () => {
    setRefreshing(true);
    loadReservations();
  };

  const getStatusConfig = (status: string) => {
    const config: Record<string, { label: string; icon: any; bgColor: string; textColor: string; badgeColor: string }> = {
      en_attente: {
        label: "En attente",
        icon: Clock,
        bgColor: "bg-yellow-50",
        textColor: "text-yellow-700",
        badgeColor: "bg-yellow-500",
      },
      confirmee: {
        label: "Confirmée",
        icon: CheckCircle,
        bgColor: "bg-green-50",
        textColor: "text-green-700",
        badgeColor: "bg-green-500",
      },
      terminee: {
        label: "Terminée",
        icon: CheckCircle,
        bgColor: "bg-blue-50",
        textColor: "text-blue-700",
        badgeColor: "bg-blue-500",
      },
      annulee: {
        label: "Annulée",
        icon: XCircle,
        bgColor: "bg-red-50",
        textColor: "text-red-700",
        badgeColor: "bg-red-500",
      },
    };
    return config[status] || config.en_attente;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString("fr-FR") + " FCFA";
  };

  const filteredReservations = reservations.filter((r: any) => {
    if (filter === "all") return true;
    return r.statut === filter;
  });

  const stats = {
    total: reservations.length,
    enAttente: reservations.filter((r: any) => r.statut === "en_attente").length,
    confirmees: reservations.filter((r: any) => r.statut === "confirmee").length,
    terminees: reservations.filter((r: any) => r.statut === "terminee").length,
    annulees: reservations.filter((r: any) => r.statut === "annulee").length,
  };

  const handleCancelReservation = (id: string, hotelName: string) => {
    if (confirm(`Voulez-vous annuler votre réservation pour ${hotelName} ?`)) {
      reservationService.cancelReservation(id);
      refreshData();
    }
  };

  const handleDeleteReservation = (id: string, hotelName: string) => {
    if (confirm(`Voulez-vous supprimer définitivement votre réservation pour ${hotelName} ? Cette action est irréversible.`)) {
      reservationService.deleteReservation(id);
      refreshData();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Chargement de vos réservations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="flex flex-wrap justify-between items-center mb-8">
          <div className="flex items-center gap-3 mb-2 sm:mb-0">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Mes réservations</h1>
              <p className="text-sm text-gray-500">Suivez l'état de vos séjours</p>
            </div>
          </div>
          <button
            onClick={refreshData}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 text-sm text-amber-600 hover:bg-amber-50 rounded-lg transition"
          >
            <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
            Actualiser
          </button>
        </div>

        {/* Statistiques */}
        {reservations.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
            <div className="bg-white rounded-xl p-3 text-center shadow-sm border">
              <div className="text-xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-xs text-gray-500">Total</div>
            </div>
            <div className="bg-yellow-50 rounded-xl p-3 text-center border border-yellow-100">
              <div className="text-xl font-bold text-yellow-700">{stats.enAttente}</div>
              <div className="text-xs text-yellow-600">En attente</div>
            </div>
            <div className="bg-green-50 rounded-xl p-3 text-center border border-green-100">
              <div className="text-xl font-bold text-green-700">{stats.confirmees}</div>
              <div className="text-xs text-green-600">Confirmées</div>
            </div>
            <div className="bg-blue-50 rounded-xl p-3 text-center border border-blue-100">
              <div className="text-xl font-bold text-blue-700">{stats.terminees}</div>
              <div className="text-xs text-blue-600">Terminées</div>
            </div>
            <div className="bg-red-50 rounded-xl p-3 text-center border border-red-100">
              <div className="text-xl font-bold text-red-700">{stats.annulees}</div>
              <div className="text-xs text-red-600">Annulées</div>
            </div>
          </div>
        )}

        {/* Filtres */}
        {reservations.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {[
              { key: "all", label: "Toutes" },
              { key: "en_attente", label: "En attente" },
              { key: "confirmee", label: "Confirmées" },
              { key: "terminee", label: "Terminées" },
              { key: "annulee", label: "Annulées" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  filter === tab.key
                    ? "bg-amber-500 text-white shadow-md"
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Liste des réservations */}
        {filteredReservations.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Aucune réservation</h3>
            <p className="text-gray-500 mb-6">
              {filter !== "all" 
                ? "Vous n'avez pas de réservation dans cette catégorie" 
                : "Vous n'avez pas encore effectué de réservation"}
            </p>
            <button
              onClick={() => navigate("/hotels")}
              className="inline-flex items-center gap-2 bg-amber-500 text-white px-6 py-2.5 rounded-lg hover:bg-amber-600 transition"
            >
              <Home size={18} />
              Découvrir les hôtels
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReservations.map((reservation: any) => {
              const status = getStatusConfig(reservation.statut);
              const StatusIcon = status.icon;
              
              return (
                <div
                  key={reservation.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all"
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Image */}
                    <div className="md:w-48 h-48 md:h-auto relative">
                      <img
                        src={reservation.hotelImage}
                        alt={reservation.hotelName}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3">
                        <div className={`${status.badgeColor} text-white text-xs font-semibold px-2.5 py-1 rounded-full`}>
                          {status.label}
                        </div>
                      </div>
                    </div>

                    {/* Détails */}
                    <div className="flex-1 p-5">
                      <div className="flex flex-wrap justify-between items-start gap-3 mb-3">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1">{reservation.hotelName}</h3>
                          <div className="flex items-center gap-2 text-gray-500 text-sm">
                            <MapPin size={14} />
                            <span>{reservation.hotelLocation}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-amber-600">{formatPrice(reservation.prixTotal)}</div>
                          <div className="text-xs text-gray-400">{reservation.nuits} nuits</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar size={14} className="text-amber-500" />
                          <span className="text-gray-600">
                            {formatDate(reservation.dateArrivee)} → {formatDate(reservation.dateDepart)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CreditCard size={14} className="text-amber-500" />
                          <span className="text-gray-600">Réf: {reservation.id}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                          <StatusIcon size={14} className={status.textColor} />
                          <span className={`text-sm font-semibold ${status.textColor}`}>{status.label}</span>
                        </div>
                        
                        <div className="flex gap-2">
                          {/* Bouton Détails - visible pour tous */}
                          <button
                            onClick={() => setSelectedReservation(reservation)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-amber-600 hover:bg-amber-50 rounded-lg transition"
                          >
                            <Eye size={14} />
                            Détails
                          </button>
                          
                          {/* Bouton Supprimer - visible pour TOUTES les réservations (y compris annulées) */}
                          <button
                            onClick={() => handleDeleteReservation(reservation.id, reservation.hotelName)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition"
                          >
                            <Trash2 size={14} />
                            Supprimer
                          </button>
                          
                          {/* Bouton Annuler - visible seulement pour les réservations en attente/confirmée */}
                          {(reservation.statut === "en_attente" || reservation.statut === "confirmee") && (
                            <button
                              onClick={() => handleCancelReservation(reservation.id, reservation.hotelName)}
                              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-orange-600 hover:bg-orange-50 rounded-lg transition"
                            >
                              <XCircle size={14} />
                              Annuler
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal Détails */}
      {selectedReservation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Détails de la réservation</h2>
              <button
                onClick={() => setSelectedReservation(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <img
                  src={selectedReservation.hotelImage}
                  alt={selectedReservation.hotelName}
                  className="w-full h-48 object-cover rounded-xl"
                />
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{selectedReservation.hotelName}</h3>
                  <div className="flex items-center gap-2 text-gray-500 mt-1">
                    <MapPin size={14} />
                    <span>{selectedReservation.hotelLocation}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Référence</div>
                    <div className="font-semibold">{selectedReservation.id}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Date de réservation</div>
                    <div className="font-semibold">{formatDate(selectedReservation.dateReservation)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Type de chambre</div>
                    <div className="font-semibold">{selectedReservation.chambre}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Statut</div>
                    <div className={`font-semibold ${getStatusConfig(selectedReservation.statut).textColor}`}>
                      {getStatusConfig(selectedReservation.statut).label}
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-gray-800 mb-3">Informations client</h4>
                  <div className="space-y-2">
                    <p><span className="text-gray-500">Nom:</span> {selectedReservation.clientName}</p>
                    <p><span className="text-gray-500">Email:</span> {selectedReservation.clientEmail}</p>
                    <p><span className="text-gray-500">Téléphone:</span> {selectedReservation.clientPhone}</p>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-gray-800 mb-3">Détails du séjour</h4>
                  <div className="space-y-2">
                    <p><span className="text-gray-500">Arrivée:</span> {formatDate(selectedReservation.dateArrivee)}</p>
                    <p><span className="text-gray-500">Départ:</span> {formatDate(selectedReservation.dateDepart)}</p>
                    <p><span className="text-gray-500">Nombre de nuits:</span> {selectedReservation.nuits}</p>
                  </div>
                </div>
                
                <div className="bg-amber-50 p-4 rounded-xl">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-800">Montant total</span>
                    <span className="text-2xl font-bold text-amber-600">
                      {formatPrice(selectedReservation.prixTotal)}
                    </span>
                  </div>
                </div>

                {/* Boutons d'action dans le modal */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => {
                      handleDeleteReservation(selectedReservation.id, selectedReservation.hotelName);
                      setSelectedReservation(null);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  >
                    <Trash2 size={16} />
                    Supprimer définitivement
                  </button>
                  
                  {(selectedReservation.statut === "en_attente" || selectedReservation.statut === "confirmee") && (
                    <button
                      onClick={() => {
                        handleCancelReservation(selectedReservation.id, selectedReservation.hotelName);
                        setSelectedReservation(null);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
                    >
                      <XCircle size={16} />
                      Annuler
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}