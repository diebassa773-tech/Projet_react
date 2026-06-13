// src/services/reservationService.ts
export interface Reservation {
  id: string;
  hotelId: number;
  hotelName: string;
  hotelImage: string;
  hotelLocation: string;
  chambre: string;
  dateArrivee: string;
  dateDepart: string;
  nuits: number;
  prixTotal: number;
  statut: "en_attente" | "confirmee" | "terminee" | "annulee";
  dateReservation: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
}

const STORAGE_KEY = "hotel_reservations";

// Initialiser avec un tableau vide
const initReservations = () => {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  }
};

initReservations();

export const reservationService = {
  createReservation: (data: any): Reservation => {
    const reservations: Reservation[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    const newReservation: Reservation = {
      ...data,
      id: `RES-${Date.now()}`,
      dateReservation: new Date().toISOString(),
      statut: "en_attente",
    };
    reservations.push(newReservation);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reservations));
    return newReservation;
  },

  getUserReservations: (userEmail: string): Reservation[] => {
    const reservations: Reservation[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return reservations.filter(r => r.clientEmail === userEmail);
  },

  getAllReservations: (): Reservation[] => {
    const reservations: Reservation[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return reservations.sort((a, b) => 
      new Date(b.dateReservation).getTime() - new Date(a.dateReservation).getTime()
    );
  },

  cancelReservation: (id: string): boolean => {
    const reservations: Reservation[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    const index = reservations.findIndex(r => r.id === id);
    if (index !== -1 && (reservations[index].statut === "en_attente" || reservations[index].statut === "confirmee")) {
      reservations[index].statut = "annulee";
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reservations));
      return true;
    }
    return false;
  },

  confirmReservation: (id: string): boolean => {
    const reservations: Reservation[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    const index = reservations.findIndex(r => r.id === id);
    if (index !== -1 && reservations[index].statut === "en_attente") {
      reservations[index].statut = "confirmee";
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reservations));
      return true;
    }
    return false;
  },

  completeReservation: (id: string): boolean => {
    const reservations: Reservation[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    const index = reservations.findIndex(r => r.id === id);
    if (index !== -1 && reservations[index].statut === "confirmee") {
      reservations[index].statut = "terminee";
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reservations));
      return true;
    }
    return false;
  },

  deleteReservation: (id: string): boolean => {
    const reservations: Reservation[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    const index = reservations.findIndex(r => r.id === id);
    if (index !== -1) {
      reservations.splice(index, 1);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reservations));
      return true;
    }
    return false;
  },
};