// src/layouts/MainLayout.tsx
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar"; // ou votre composant nav
import Footer from "../components/footer"; // ou votre composant footer


export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />  {/* Votre navigation */}
      <main className="flex-grow">
        <Outlet />  {/* Ici s'affiche Landing ou Dashboard */}
 
      </main>
      <Footer />  {/* Votre footer */}
    </div>

  );
}