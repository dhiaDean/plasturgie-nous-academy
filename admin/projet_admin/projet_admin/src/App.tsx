// src/App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext"; // Ensure correct path
import { ProtectedRoute } from './components/auth/ProtectedRoute'; // Ensure this is used correctly
import { Role } from "./services/api.types"; // Import Role enum

// Page Imports
import Index from "./pages/Index";
import Login from "./pages/Login";

import DashboardPage from "./pages/Dashboard"; // This is your main Dashboard component
import NotFoundPage from "./pages/NotFound";
import Register from "./pages/Register";
import EventDetailsPage from "./pages/EventDetailsPage"; // Import EventDetailsPage
import DashboardActualites from "./components/dashboard/Actualites"; // Import DashboardActualites
// Import other public pages like About, Contact, etc.
// import About from "./pages/About";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner richColors />

        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* Assuming these are public, adjust if they need protection */}
                  {/* <Route path="/about" element={<About />} /> */}


            {/* Protected Dashboard Route (main dashboard and nested routes handled within DashboardPage) */}
            <Route
              path="/dashboard/*"
              element={
                <ProtectedRoute requiredRoles={[Role.ADMIN, Role.INSTRUCTOR]} >
                  <DashboardPage />
                </ProtectedRoute>
              }
            >
              {/* Nested routes within /dashboard/* can be defined here or within DashboardPage */}
            </Route>

            {/* Protected Route for Event Details (separate from main dashboard nested routes) */}
             <Route
              path="/dashboard/events/:id"
              element={
                <ProtectedRoute> {/* Protect the event details page */}
                  <EventDetailsPage />
                </ProtectedRoute>
              }
            />

            {/* Catch-all Not Found Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
