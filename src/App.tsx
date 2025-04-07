
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import KidsLogin from "./pages/KidsLogin";
import ParentsLogin from "./pages/ParentsLogin";
import KidsDashboard from "./pages/KidsDashboard";
import ParentsDashboard from "./pages/ParentsDashboard";
import VitalsTracker from "./pages/VitalsTracker";
import PhysioAssistant from "./pages/PhysioAssistant";
import Community from "./pages/Community";
import NotFound from "./pages/NotFound";
import { UserProvider } from "./context/UserContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/kids-login" element={<KidsLogin />} />
            <Route path="/parents-login" element={<ParentsLogin />} />
            <Route path="/kids-dashboard" element={<KidsDashboard />} />
            <Route path="/parents-dashboard" element={<ParentsDashboard />} />
            <Route path="/vitals-tracker" element={<VitalsTracker />} />
            <Route path="/physio-assistant" element={<PhysioAssistant />} />
            <Route path="/community" element={<Community />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </UserProvider>
  </QueryClientProvider>
);

export default App;
