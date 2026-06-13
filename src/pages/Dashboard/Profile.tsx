// src/pages/Dashboard/Profile.tsx
import { useState, useEffect } from "react";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Save, 
  X,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { authService } from "../../services/auth";

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    adresse: "",
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setFormData({
        nom: currentUser.nom || "",
        prenom: currentUser.prenom || "",
        email: currentUser.email || "",
        telephone: localStorage.getItem(`user_phone_${currentUser.id}`) || "",
        adresse: localStorage.getItem(`user_address_${currentUser.id}`) || "",
      });
    }
  }, []);

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    localStorage.setItem(`user_phone_${user.id}`, formData.telephone);
    localStorage.setItem(`user_address_${user.id}`, formData.adresse);
    
    const updatedUser = { ...user, nom: formData.nom, prenom: formData.prenom };
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    
    setMessage({ type: "success", text: "Profil mis à jour" });
    setLoading(false);
    setIsEditing(false);
    setTimeout(() => setMessage(null), 3000);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: "error", text: "Les mots de passe ne correspondent pas" });
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      setMessage({ type: "error", text: "Mot de passe trop court (min 6 caractères)" });
      return;
    }
    
    const users = JSON.parse(localStorage.getItem("hotel_users") || "[]");
    const currentUser = users.find((u: any) => u.id === user.id);
    
    if (currentUser && currentUser.password !== passwordData.currentPassword) {
      setMessage({ type: "error", text: "Mot de passe actuel incorrect" });
      return;
    }
    
    const updatedUsers = users.map((u: any) => 
      u.id === user.id ? { ...u, password: passwordData.newPassword } : u
    );
    localStorage.setItem("hotel_users", JSON.stringify(updatedUsers));
    
    setMessage({ type: "success", text: "Mot de passe modifié" });
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setShowPasswordModal(false);
    setTimeout(() => setMessage(null), 3000);
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Message */}
      {message && (
        <div className={`mb-4 flex items-center gap-2 p-3 rounded-lg ${
          message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
        }`}>
          {message.type === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          <span className="text-sm">{message.text}</span>
        </div>
      )}

      {/* Carte profil */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Mon profil</h2>
            <p className="text-sm text-gray-500">Gérez vos informations personnelles</p>
          </div>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="text-sm text-amber-600 hover:text-amber-700"
            >
              Modifier
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(false)}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Annuler
            </button>
          )}
        </div>
        
        <form onSubmit={handleProfileSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Prénom</label>
              <input
                type="text"
                value={formData.prenom}
                onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                disabled={!isEditing}
                className={`w-full px-3 py-2 border rounded-lg text-sm ${
                  !isEditing ? "bg-gray-50 border-gray-100" : "border-gray-200 focus:ring-1 focus:ring-amber-500"
                }`}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Nom</label>
              <input
                type="text"
                value={formData.nom}
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                disabled={!isEditing}
                className={`w-full px-3 py-2 border rounded-lg text-sm ${
                  !isEditing ? "bg-gray-50 border-gray-100" : "border-gray-200 focus:ring-1 focus:ring-amber-500"
                }`}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={formData.email}
                disabled
                className="w-full pl-9 pr-3 py-2 border border-gray-100 rounded-lg text-sm bg-gray-50 text-gray-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Téléphone</label>
            <div className="relative">
              <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="tel"
                value={formData.telephone}
                onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                disabled={!isEditing}
                placeholder="+221 77 000 00 00"
                className={`w-full pl-9 pr-3 py-2 border rounded-lg text-sm ${
                  !isEditing ? "bg-gray-50 border-gray-100" : "border-gray-200 focus:ring-1 focus:ring-amber-500"
                }`}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Adresse</label>
            <div className="relative">
              <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={formData.adresse}
                onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                disabled={!isEditing}
                placeholder="Votre adresse"
                className={`w-full pl-9 pr-3 py-2 border rounded-lg text-sm ${
                  !isEditing ? "bg-gray-50 border-gray-100" : "border-gray-200 focus:ring-1 focus:ring-amber-500"
                }`}
              />
            </div>
          </div>
          
          {isEditing && (
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 text-sm bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition"
              >
                {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={14} />}
                Enregistrer
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Carte mot de passe */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mt-4">
        <div className="border-b px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-800">Sécurité</h2>
          <p className="text-sm text-gray-500">Modifiez votre mot de passe</p>
        </div>
        
        <div className="p-6">
          <button
            onClick={() => setShowPasswordModal(true)}
            className="flex items-center gap-2 text-sm text-amber-600 hover:text-amber-700"
          >
            <Lock size={16} />
            Changer le mot de passe
          </button>
        </div>
      </div>

      {/* Modal mot de passe */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">Changer le mot de passe</h2>
              <button onClick={() => setShowPasswordModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handlePasswordSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Mot de passe actuel</label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    required
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="w-full pr-10 py-2 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-amber-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Nouveau mot de passe</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    required
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...formData, newPassword: e.target.value })}
                    className="w-full pr-10 py-2 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-amber-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Confirmer</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="w-full pr-10 py-2 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-amber-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-amber-500 text-white rounded-lg hover:bg-amber-600"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}