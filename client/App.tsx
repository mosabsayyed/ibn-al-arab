import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AuthConfirm from "./pages/AuthConfirm";
import AuthTest from "./pages/AuthTest";
import Admin from "./pages/Admin";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { I18nProvider } from "@/context/i18n";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Profile from "./pages/Profile";
import { AuthProvider } from "@/context/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <I18nProvider>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Header />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-success" element={<OrderSuccess />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/auth/confirm" element={<AuthConfirm />} />
              <Route path="/auth-test" element={<AuthTest />} />
              <Route path="/admin" element={<Admin />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer />
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </I18nProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
