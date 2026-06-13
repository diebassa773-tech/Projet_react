export interface User {
  id: string;
  email: string;
  password: string;
  nom: string;
  prenom: string;
  role: "admin" | "user";
}

export interface Hotel {
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

export interface Reservation {
  id: string;
  userId: string;
  userNom: string;
  hotelId: string;
  hotelNom: string;
  hotelImage: string;
  ville: string;
  chambre: string;
  dateArrivee: string;
  dateDepart: string;
  nuits: number;
  prixTotal: number;
  statut: "en_attente" | "confirmee" | "annulee" | "terminee";
  dateReservation: string;
}