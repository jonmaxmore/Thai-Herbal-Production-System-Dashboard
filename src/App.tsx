
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Import pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/shared/Login";

// Herb Trace pages
import HerbTraceDashboard from "./pages/herb-trace/HerbTraceDashboard";
import HerbCatalog from "./pages/herb-trace/HerbCatalog";
import TraceabilityView from "./pages/herb-trace/TraceabilityView";
import CertificationView from "./pages/herb-trace/CertificationView";
import MapViewPage from "./pages/herb-trace/MapView";
import SettingsView from "./pages/herb-trace/SettingsView";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/index" element={<Index />} />
          
          {/* Herb Trace Routes */}
          <Route path="/herb-trace/dashboard" element={<HerbTraceDashboard />} />
          <Route path="/herb-trace/herbs" element={<HerbCatalog />} />
          <Route path="/herb-trace/trace" element={<TraceabilityView />} />
          <Route path="/herb-trace/certification" element={<CertificationView />} />
          <Route path="/herb-trace/map" element={<MapViewPage />} />
          <Route path="/herb-trace/settings" element={<SettingsView />} />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
