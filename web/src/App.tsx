// App.tsx

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext"; 
import { ProtectedRoute } from "./components/auth/ProtectedRoute"; 
import WhatsAppButton from "./components/ui/whatsapp-button"; // Assuming this is correct
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Formations from "./pages/Formations";
import FormationsByCategory from "./pages/FormationsByCategory";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Quote from "./pages/Quote";
import Register from "./pages/register";
import Dashboard from "./components/dashboard/dashboard"; 
import Profile from "./pages/Profile"; 
import FormationDetail from "./pages/FormationDetail";
import Blog from "./pages/Blog";
import FAQ from "./pages/FAQ";
import Testimonials from "./pages/Testimonials";
import Resources from "./pages/Resources";
import Partnerships from "./pages/Partnerships";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Careers from "./pages/Careers";
import Events from "./pages/Events";
import "./App.css";
import Login from "./pages/Login";
import CertificationPage from "./pages/Certification";


const App = () => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider> 
        <TooltipProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/quote" element={<Quote />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/testimonials" element={<Testimonials />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/partnerships" element={<Partnerships />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/events" element={<Events />} />

              {/* === CHANGED PATH HERE === */}
              <Route path="/courses/:id" element={<FormationDetail />} />

              {/* Protected Routes */}
              <Route path="/formations" element={
                <ProtectedRoute> 
                  <Formations />
                </ProtectedRoute>
              } />
              <Route path="/certification" element={
                <ProtectedRoute> 
                  <CertificationPage />
                </ProtectedRoute>
              } />
              <Route path="/formations/:category" element={ // This might also need to be /courses/category/:category for consistency
                <ProtectedRoute>
                  <FormationsByCategory />
                </ProtectedRoute>
              } />
              <Route path="/dashboard" element={ 
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={ 
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              
              {/* Catch-all Not Found Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>

            <WhatsAppButton phoneNumber="+21670123456" />

            <Sonner />
            <Toaster />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
