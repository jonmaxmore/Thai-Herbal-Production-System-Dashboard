
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/shared/Login";
import NotFound from "./pages/NotFound";
import HerbTraceDashboard from "./pages/herb-trace/HerbTraceDashboard";
import HerbCatalog from "./pages/herb-trace/HerbCatalog";
import TraceabilityView from "./pages/herb-trace/TraceabilityView";
import CertificationView from "./pages/herb-trace/CertificationView";
import MapView from "./pages/herb-trace/MapView";
import SettingsView from "./pages/herb-trace/SettingsView";
import Marketplace from "./pages/herb-trace/Marketplace";
import PlatformOverview from "./pages/herb-trace/PlatformOverview";
import GACPApplications from "./pages/herb-trace/GACPApplications";
import UserManagement from "./pages/herb-trace/UserManagement";
import RoleSelector from "./components/RoleSelector";

import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/role-selector" element={<RoleSelector />} />
        <Route path="/herb-trace/dashboard" element={<HerbTraceDashboard />} />
        <Route path="/herb-trace/herbs" element={<HerbCatalog />} />
        <Route path="/herb-trace/trace" element={<TraceabilityView />} />
        <Route path="/herb-trace/certification" element={<CertificationView />} />
        <Route path="/herb-trace/gacp-applications" element={<GACPApplications />} />
        <Route path="/herb-trace/map" element={<MapView />} />
        <Route path="/herb-trace/settings" element={<SettingsView />} />
        <Route path="/herb-trace/marketplace" element={<Marketplace />} />
        <Route path="/herb-trace/overview" element={<PlatformOverview />} />
        <Route path="/herb-trace/users" element={<UserManagement />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
