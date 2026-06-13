// src/services/auth.ts
export interface User {
  id: string;
  email: string;
  password: string;
  nom: string;
  prenom: string;
  role: "admin" | "user";
}

const STORAGE_KEY = "hotel_users";
const CURRENT_USER_KEY = "currentUser";

// Initialiser avec un seul admin par défaut
const initUsers = () => {
  const users = localStorage.getItem(STORAGE_KEY);
  if (!users) {
    const defaultUsers: User[] = [
      {
        id: "1",
        email: "admin@hotel.com",
        password: "admin123",
        nom: "Admin",
        prenom: "System",
        role: "admin",
      },
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultUsers));
  }
};

initUsers();

export const authService = {
  // Inscription - uniquement pour les clients
  register: (nom: string, prenom: string, email: string, password: string): User | null => {
    const users: User[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    
    if (users.find(u => u.email === email)) {
      throw new Error("Cet email est déjà utilisé");
    }
    
    const newUser: User = {
      id: Date.now().toString(),
      email,
      password,
      nom,
      prenom,
      role: "user",
    };
    
    users.push(newUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    
    console.log("✅ Nouveau client créé:", newUser.email);
    return newUser;
  },

  // Connexion
  login: (email: string, password: string): User | null => {
    const users: User[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      return user;
    }
    return null;
  },

  // Déconnexion
  logout: () => {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  // Récupérer l'utilisateur courant
  getCurrentUser: (): User | null => {
    const stored = localStorage.getItem(CURRENT_USER_KEY);
    return stored ? JSON.parse(stored) : null;
  },

  // Vérifier si l'utilisateur est connecté
  isAuthenticated: (): boolean => {
    return !!authService.getCurrentUser();
  },

  // Vérifier si l'utilisateur est admin
  isAdmin: (): boolean => {
    const user = authService.getCurrentUser();
    return user?.role === "admin";
  },

  // Récupérer tous les clients (pour l'admin)
  getAllUsers: (): User[] => {
    const users: User[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return users.filter(u => u.role === "user");
  },
};