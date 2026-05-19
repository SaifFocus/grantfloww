import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index.tsx";
import About from "./pages/About.tsx";
import Auth from "./pages/Auth.tsx";
import NotFound from "./pages/NotFound.tsx";
import DashboardLayout from "@/layouts/DashboardLayout";
import Overview from "@/pages/dashboard/Overview";
import FindGrants from "@/pages/dashboard/FindGrants";
import Applications from "@/pages/dashboard/Applications";
import ApplicationEditor from "@/pages/dashboard/ApplicationEditor";
import CookieConsent from "@/components/grantflow/CookieConsent";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
              <Route index element={<Overview />} />
              <Route path="grants" element={<FindGrants />} />
              <Route path="applications" element={<Applications />} />
              <Route path="applications/:id" element={<ApplicationEditor />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
          <CookieConsent />
        </AuthProvider>
      </Routes>
    </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
