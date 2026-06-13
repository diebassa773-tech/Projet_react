// src/routes/AppRoutes.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Landing from "../pages/Landing";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import ResetPassword from "../pages/Auth/ResetPassword";
import Hotels from "../pages/Hotels";
import Booking from "../pages/Booking";
import MyReservations from "../pages/MyReservations";

// Layout du dashboard
import DashboardLayout from "../layouts/DashboardLayout";
// Pages du dashboard
import DashboardIndex from "../pages/Dashboard/Index";
import DashboardReservations from "../pages/Dashboard/Reservations";
import DashboardHotels from "../pages/Dashboard/Hotels";
import DashboardProfile from "../pages/Dashboard/Profile";

import { authService } from "../services/auth";

// Protection des routes dashboard (admin uniquement)
const AdminRoute = ({ children }: { children: JSX.Element }) => {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  if (!authService.isAdmin()) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Routes publiques avec navbar/footer */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/hotels" element={<Hotels />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/my-reservations" element={<MyReservations />} />
        </Route>

        {/* Routes d'authentification (sans navbar/footer) */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        {/* Routes dashboard protégées (admin uniquement) */}
        <Route
          path="/dashboard"
          element={
            <AdminRoute>
              <DashboardLayout />
            </AdminRoute>
          }
        >
          <Route index element={<DashboardIndex />} />
          <Route path="reservations" element={<DashboardReservations />} />
          <Route path="hotels" element={<DashboardHotels />} />
          <Route path="profile" element={<DashboardProfile />} />
        </Route>

        {/* Redirection pour les routes inexistantes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}