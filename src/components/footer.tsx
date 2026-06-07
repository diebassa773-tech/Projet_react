import { useNavigate } from "react-router-dom";

const footerLinks = {
  navigation: [
    { label: "Accueil", path: "/" },
    { label: "Hôtels", path: "/booking" },
    { label: "Offres", path: "/" },
    { label: "À propos", path: "/" },
  ],
  account: [
    { label: "Connexion", path: "/login" },
    { label: "Inscription", path: "/register" },
    { label: "Dashboard", path: "/dashboard" },
    { label: "Mes réservations", path: "/booking" },
  ],
  legal: ["Confidentialité", "CGU", "Cookies"],
  social: [
    { label: "Facebook", icon: "f", href: "#" },
    { label: "Instagram", icon: "ig", href: "#" },
    { label: "Twitter", icon: "tw", href: "#" },
  ],
};

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div
              className="flex items-center gap-2 mb-4 cursor-pointer group"
              onClick={() => navigate("/")}
            >
              <div className="w-9 h-9 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105">
                <span className="text-white font-bold text-sm">H</span>
              </div>
              <span className="font-bold text-xl">HôtelSénégal</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              La plateforme de référence pour réserver vos hôtels au Sénégal. Simple, rapide et sécurisé.
            </p>
            <div className="flex gap-3 mt-6">
              {footerLinks.social.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  className="w-10 h-10 bg-white/10 hover:bg-amber-500 rounded-xl flex items-center justify-center text-xs font-bold transition-all hover:scale-110"
                  aria-label={s.label}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-bold mb-4 text-sm tracking-wider uppercase text-amber-400">Navigation</h4>
            <ul className="space-y-3">
              {footerLinks.navigation.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => navigate(link.path)}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Compte */}
          <div>
            <h4 className="font-bold mb-4 text-sm tracking-wider uppercase text-amber-400">Compte</h4>
            <ul className="space-y-3">
              {footerLinks.account.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => navigate(link.path)}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} HôtelSénégal. Tous droits réservés.
          </p>
          <div className="flex gap-6">
            {footerLinks.legal.map((item) => (
              <a
                key={item}
                href="#"
                className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}