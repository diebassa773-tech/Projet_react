import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface NavLink {
  label: string;
  path: string;
}

const navLinks: NavLink[] = [
  { label: "Accueil", path: "/" },
  { label: "Hôtels", path: "/booking" },
  { label: "Dashboard", path: "/dashboard" },
];

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const handleNavClick = (path: string) => {
    navigate(path);
    setMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-md shadow-md" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => handleNavClick("/")}
        >
          <div className="w-9 h-9 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-md transition-transform group-hover:scale-105">
            <span className="text-white font-bold text-sm">H</span>
          </div>
          <span
            className={`font-bold text-xl transition-colors ${
              scrolled ? "text-gray-900" : "text-white"
            }`}
          >
            HôtelSénégal
          </span>
        </div>

        {/* Liens desktop */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => navigate(link.path)}
              className={`relative text-sm font-medium transition-colors hover:text-amber-500 ${
                scrolled ? "text-gray-700" : "text-white/90"
              } ${isActive(link.path) ? "text-amber-500" : ""}`}
            >
              {link.label}
              {isActive(link.path) && (
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-amber-500 rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Boutons auth desktop */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => navigate("/login")}
            className={`text-sm font-medium px-4 py-2 rounded-xl transition-all ${
              scrolled
                ? "text-gray-700 hover:bg-gray-100"
                : "text-white/90 hover:bg-white/10"
            }`}
          >
            Connexion
          </button>
          <button
            onClick={() => navigate("/register")}
            className="text-sm font-semibold px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl transition-all shadow-md hover:shadow-amber-200"
          >
            S'inscrire
          </button>
        </div>

        {/* Burger mobile */}
        <button
          className="md:hidden p-2 rounded-xl hover:bg-white/10 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <svg
            className={`w-6 h-6 ${scrolled ? "text-gray-700" : "text-white"}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Menu mobile */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 flex flex-col gap-3 shadow-lg">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNavClick(link.path)}
              className={`text-sm font-medium py-2 text-left transition-colors hover:text-amber-500 ${
                isActive(link.path) ? "text-amber-500" : "text-gray-600"
              }`}
            >
              {link.label}
            </button>
          ))}
          <div className="flex gap-3 pt-2 border-t border-gray-100">
            <button
              onClick={() => handleNavClick("/login")}
              className="flex-1 text-sm font-medium py-2 text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
            >
              Connexion
            </button>
            <button
              onClick={() => handleNavClick("/register")}
              className="flex-1 text-sm font-semibold py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl transition-all"
            >
              S'inscrire
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}