// src/data/mockData.ts
import type { User, Hotel, Reservation } from "../types";

export const mockUsers: User[] = [
  {
    id: "1",
    email: "admin@hotel.com",
    password: "admin123",
    nom: "Admin",
    prenom: "System",
    role: "admin",
  },
  {
    id: "2",
    email: "client@test.com",
    password: "client123",
    nom: "Diop",
    prenom: "Amina",
    role: "user",
  },
];

export const mockHotels: Hotel[] = [
  {
    id: "h1",
    nom: "Terrou-Bi Hôtel",
    ville: "Dakar",
    adresse: "Corniche Ouest, Dakar",
    prixNuit: 85000,
    note: 4.7,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
    description: "Hôtel de luxe en bord de mer",
    amenities: ["Piscine", "SPA", "Restaurant"],
    disponible: true,
  },
  {
    id: "h2",
    nom: "Radisson Blu",
    ville: "Dakar",
    adresse: "Route de la Corniche, Dakar",
    prixNuit: 120000,
    note: 4.9,
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800",
    description: "Hôtel 5 étoiles",
    amenities: ["Piscine", "SPA", "Restaurant", "Gym"],
    disponible: true,
  },
];

export const mockReservations: Reservation[] = [
  {
    id: "r1",
    userId: "2",
    userNom: "Amina Diop",
    hotelId: "h1",
    hotelNom: "Terrou-Bi Hôtel",
    hotelImage: mockHotels[0].image,
    ville: "Dakar",
    chambre: "Suite Vue Mer",
    dateArrivee: "2026-07-15",
    dateDepart: "2026-07-20",
    nuits: 5,
    prixTotal: 425000,
    statut: "en_attente",
    dateReservation: "2026-06-01T10:00:00Z",
  },
];