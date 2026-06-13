// src/pages/Dashboard/Reservations.tsx
import { useState, useEffect } from "react";
import { 
  Calendar, 
  MapPin, 
  CreditCard, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye,
  RefreshCw,
  Search,
  ChevronLeft,
  ChevronRight,
  Trash2,
  User,
  Mail,
  Phone
} from "lucide-react";
import { reservationService } from "../../services/reservationService";

export default function Reservations() {
  const [reservations, setReservations] = useState<any[]>([]);
  const [filteredReservations, setFilteredReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedReservation, setSelectedReservation] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const itemsPerPage = 10;

  useEffect(() => {
    loadReservations();
  }, []);

  useEffect(() => {
    filterReservations();
  }, [reservations, searchTerm, statusFilter]);

  const loadReservations = () => {
    setLoading(true);
    const allReservations = reservationService.getAllReservations();
    console.log("Réservations chargées:", allReservations);
    setReservations(allReservations);
    setLoading(false);
  };

  const filterReservations = () => {
    let filtered = [...reservations];

    if (searchTerm) {
      filtered = filtered.filter(r => 
        r.hotelName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.clientEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.id?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(r => r.statut === statusFilter);
    }

    filtered.sort((a, b) => 
      new Date(b.dateReservation).getTime() - new Date(a.dateReservation).getTime()
    );

    setFilteredReservations(filtered);
    setCurrentPage(1);
  };

  const handleConfirmReservation = async (id: string) => {
    setActionLoading(id);
    try {
      const success = reservationService.confirmReservation(id);
      if (success) {
        loadReservations();
        if (selectedReservation?.id === id) {
          setSelectedReservation(null);
        }
      }
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancelReservation = async (id: string) => {
    setActionLoading(id);
    try {
      const success = reservationService.cancelReservation(id);
      if (success) {
        loadReservations();
        if (selectedReservation?.id === id) {
          setSelectedReservation(null);
        }
      }
    } finally {
      setActionLoading(null);
    }
  };

  const handleCompleteReservation = async (id: string) => {
    setActionLoading(id);
    try {
      const success = reservationService.completeReservation(id);
      if (success) {
        loadReservations();
        if (selectedReservation?.id === id) {
          setSelectedReservation(null);
        }
      }
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteReservation = (id: string, hotelName: string) => {
    if (confirm(`⚠️ Êtes-vous sûr de vouloir supprimer définitivement la réservation pour "${hotelName}" ?\n\nCette action est irréversible.`)) {
      reservationService.deleteReservation(id);
      loadReservations();
      if (selectedReservation?.id === id) {
        setSelectedReservation(null);
      }
    }
  };

  const getStatusConfig = (status: string) => {
    const config: Record<string, any> = {
      en_attente: {
        label: "En attente",
        icon: Clock,
        bgColor: "bg-yellow-50",
        textColor: "text-yellow-700",
        badgeColor: "bg-yellow-500",
        actions: [
          { label: "Confirmer", action: "confirm", color: "green" },
          { label: "Annuler", action: "cancel", color: "red" }
        ],
      },
      confirmee: {
        label: "Confirmée",
        icon: CheckCircle,
        bgColor: "bg-green-50",
        textColor: "text-green-700",
        badgeColor: "bg-green-500",
        actions: [
          { label: "Terminer", action: "complete", color: "blue" },
          { label: "Annuler", action: "cancel", color: "red" }
        ],
      },
      terminee: {
        label: "Terminée",
        icon: CheckCircle,
        bgColor: "bg-blue-50",
        textColor: "text-blue-700",
        badgeColor: "bg-blue-500",
        actions: [],
      },
      annulee: {
        label: "Annulée",
        icon: XCircle,
        bgColor: "bg-red-50",
        textColor: "text-red-700",
        badgeColor: "bg-red-500",
        actions: [],
      },
    };
    return config[status] || config.en_attente;
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatDateTime = (dateStr: string) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price: number) => {
    return (price || 0).toLocaleString("fr-FR") + " FCFA";
  };

  const getStats = () => {
    return {
      total: reservations.length,
      enAttente: reservations.filter((r: any) => r.statut === "en_attente").length,
      confirmees: reservations.filter((r: any) => r.statut === "confirmee").length,
      terminees: reservations.filter((r: any) => r.statut === "terminee").length,
      annulees: reservations.filter((r: any) => r.statut === "annulee").length,
      chiffreAffaires: reservations.reduce((sum: number, r: any) => sum + (r.prixTotal || 0), 0),
    };
  };

  const stats = getStats();
  const totalPages = Math.ceil(filteredReservations.length / itemsPerPage);
  const paginatedReservations = filteredReservations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Chargement des réservations...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Gestion des réservations</h1>
        <p className="text-gray-500 mt-1">Gérez, confirmez ou annulez les réservations des clients</p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-500">Total</div>
        </div>
        <div className="bg-yellow-50 rounded-xl p-4 shadow-sm border border-yellow-100 cursor-pointer hover:bg-yellow-100 transition" onClick={() => setStatusFilter("en_attente")}>
          <div className="text-2xl font-bold text-yellow-700">{stats.enAttente}</div>
          <div className="text-sm text-yellow-600">En attente</div>
        </div>
        <div className="bg-green-50 rounded-xl p-4 shadow-sm border border-green-100 cursor-pointer hover:bg-green-100 transition" onClick={() => setStatusFilter("confirmee")}>
          <div className="text-2xl font-bold text-green-700">{stats.confirmees}</div>
          <div className="text-sm text-green-600">Confirmées</div>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 shadow-sm border border-blue-100 cursor-pointer hover:bg-blue-100 transition" onClick={() => setStatusFilter("terminee")}>
          <div className="text-2xl font-bold text-blue-700">{stats.terminees}</div>
          <div className="text-sm text-blue-600">Terminées</div>
        </div>
        <div className="bg-red-50 rounded-xl p-4 shadow-sm border border-red-100 cursor-pointer hover:bg-red-100 transition" onClick={() => setStatusFilter("annulee")}>
          <div className="text-2xl font-bold text-red-700">{stats.annulees}</div>
          <div className="text-sm text-red-600">Annulées</div>
        </div>
        <div className="bg-amber-50 rounded-xl p-4 shadow-sm border border-amber-100">
          <div className="text-lg font-bold text-amber-700">{stats.chiffreAffaires.toLocaleString()} FCFA</div>
          <div className="text-sm text-amber-600">Chiffre d'affaires</div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par hôtel, client, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="en_attente">En attente</option>
              <option value="confirmee">Confirmées</option>
              <option value="terminee">Terminées</option>
              <option value="annulee">Annulées</option>
            </select>
          </div>
          <button
            onClick={loadReservations}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
          >
            <RefreshCw size={18} />
            Actualiser
          </button>
        </div>
      </div>

      {/* Tableau des réservations */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Hôtel</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Dates</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Montant</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedReservations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    Aucune réservation trouvée
                  </td>
                </tr>
              ) : (
                paginatedReservations.map((reservation: any) => {
                  const status = getStatusConfig(reservation.statut);
                  const StatusIcon = status.icon;
                  const isActionLoading = actionLoading === reservation.id;
                  
                  return (
                    <tr key={reservation.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                            <User size={14} className="text-amber-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{reservation.clientName}</div>
                            <div className="text-xs text-gray-500">{reservation.clientEmail}</div>
                          </div>
                        </div>
                       </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={reservation.hotelImage}
                            alt={reservation.hotelName}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                          <div>
                            <div className="font-medium text-gray-900">{reservation.hotelName}</div>
                            <div className="text-xs text-gray-500 flex items-center gap-1">
                              <MapPin size={10} />
                              {reservation.hotelLocation}
                            </div>
                          </div>
                        </div>
                       </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">{formatDate(reservation.dateArrivee)}</div>
                        <div className="text-xs text-gray-500">→ {formatDate(reservation.dateDepart)}</div>
                        <div className="text-xs text-gray-400">{reservation.nuits} nuits</div>
                       </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-amber-600">{formatPrice(reservation.prixTotal)}</div>
                        <div className="text-xs text-gray-400">{reservation.chambre}</div>
                       </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${status.bgColor} ${status.textColor}`}>
                          <StatusIcon size={12} />
                          {status.label}
                        </span>
                       </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setSelectedReservation(reservation)}
                            className="p-1.5 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition"
                            title="Voir détails"
                          >
                            <Eye size={18} />
                          </button>
                          
                          {reservation.statut === "en_attente" && (
                            <button
                              onClick={() => handleConfirmReservation(reservation.id)}
                              disabled={isActionLoading}
                              className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition disabled:opacity-50"
                              title="Confirmer la réservation"
                            >
                              {isActionLoading ? (
                                <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <CheckCircle size={18} />
                              )}
                            </button>
                          )}
                          
                          {reservation.statut === "confirmee" && (
                            <button
                              onClick={() => handleCompleteReservation(reservation.id)}
                              disabled={isActionLoading}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition disabled:opacity-50"
                              title="Marquer comme terminée"
                            >
                              {isActionLoading ? (
                                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <Clock size={18} />
                              )}
                            </button>
                          )}
                          
                          {(reservation.statut === "en_attente" || reservation.statut === "confirmee") && (
                            <button
                              onClick={() => handleCancelReservation(reservation.id)}
                              disabled={isActionLoading}
                              className="p-1.5 text-orange-600 hover:bg-orange-50 rounded-lg transition disabled:opacity-50"
                              title="Annuler la réservation"
                            >
                              <XCircle size={18} />
                            </button>
                          )}
                          
                          <button
                            onClick={() => handleDeleteReservation(reservation.id, reservation.hotelName)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Supprimer définitivement"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                       </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
            <div className="text-sm text-gray-500">
              {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredReservations.length)} sur {filteredReservations.length}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-2 text-gray-500 hover:text-amber-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="p-2 text-gray-500 hover:text-amber-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal Détails */}
      {selectedReservation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
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
                  className="w-full h-56 object-cover rounded-xl"
                />
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-3">🏨 Informations hôtel</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-500">Nom:</span> <span className="font-medium">{selectedReservation.hotelName}</span></p>
                    <p><span className="text-gray-500">Localisation:</span> {selectedReservation.hotelLocation}</p>
                    <p><span className="text-gray-500">Chambre:</span> {selectedReservation.chambre}</p>
                    <p><span className="text-gray-500">Référence:</span> <span className="font-mono text-xs">{selectedReservation.id}</span></p>
                    <p><span className="text-gray-500">Date réservation:</span> {formatDateTime(selectedReservation.dateReservation)}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-3">👤 Informations client</h3>
                  <div className="space-y-2 text-sm">
                    <p className="flex items-center gap-2"><Mail size={14} className="text-gray-400" /> {selectedReservation.clientEmail}</p>
                    <p className="flex items-center gap-2"><Phone size={14} className="text-gray-400" /> {selectedReservation.clientPhone}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                <h3 className="font-semibold text-gray-800 mb-3">📅 Détails du séjour</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Arrivée</p>
                    <p className="font-semibold">{formatDate(selectedReservation.dateArrivee)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Départ</p>
                    <p className="font-semibold">{formatDate(selectedReservation.dateDepart)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Nuits</p>
                    <p className="font-semibold">{selectedReservation.nuits}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Montant total</p>
                    <p className="font-semibold text-amber-600 text-lg">{formatPrice(selectedReservation.prixTotal)}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3 pt-4 border-t">
                {selectedReservation.statut === "en_attente" && (
                  <>
                    <button
                      onClick={() => {
                        handleConfirmReservation(selectedReservation.id);
                        setSelectedReservation(null);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                      <CheckCircle size={16} />
                      Confirmer la réservation
                    </button>
                    <button
                      onClick={() => {
                        handleCancelReservation(selectedReservation.id);
                        setSelectedReservation(null);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                      <XCircle size={16} />
                      Annuler la réservation
                    </button>
                  </>
                )}
                
                {selectedReservation.statut === "confirmee" && (
                  <>
                    <button
                      onClick={() => {
                        handleCompleteReservation(selectedReservation.id);
                        setSelectedReservation(null);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      <Clock size={16} />
                      Marquer comme terminée
                    </button>
                    <button
                      onClick={() => {
                        handleCancelReservation(selectedReservation.id);
                        setSelectedReservation(null);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                      <XCircle size={16} />
                      Annuler la réservation
                    </button>
                  </>
                )}
                
                <button
                  onClick={() => {
                    handleDeleteReservation(selectedReservation.id, selectedReservation.hotelName);
                    setSelectedReservation(null);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                >
                  <Trash2 size={16} />
                  Supprimer définitivement
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}