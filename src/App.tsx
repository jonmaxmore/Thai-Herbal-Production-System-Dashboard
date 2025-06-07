
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
import InspectionView from "./pages/herb-trace/InspectionView";
import SeedToSaleView from "./pages/herb-trace/SeedToSaleView";
import RoleSelector from "./components/RoleSelector";

// New pages
import FarmManagement from "./pages/herb-trace/FarmManagement";
import ActivitiesView from "./pages/herb-trace/ActivitiesView";
import HarvestView from "./pages/herb-trace/HarvestView";
import WeatherView from "./pages/herb-trace/WeatherView";
import LicensesView from "./pages/herb-trace/LicensesView";
import LabSamplesView from "./pages/herb-trace/lab/LabSamplesView";
import LabTestingView from "./pages/herb-trace/lab/LabTestingView";
import LabMaterialsView from "./pages/herb-trace/lab/LabMaterialsView";
import QRCodeView from "./pages/herb-trace/QRCodeView";
import ProcurementView from "./pages/herb-trace/ProcurementView";
import ProductionView from "./pages/herb-trace/ProductionView";
import InventoryView from "./pages/herb-trace/InventoryView";
import LogisticsView from "./pages/herb-trace/LogisticsView";
import B2BMarketView from "./pages/herb-trace/B2BMarketView";
import ContractsView from "./pages/herb-trace/ContractsView";
import ReportsView from "./pages/herb-trace/ReportsView";
import ExportsView from "./pages/herb-trace/ExportsView";
import LearningView from "./pages/herb-trace/LearningView";
import SupportView from "./pages/herb-trace/SupportView";

import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/role-selector" element={<RoleSelector />} />
        
        {/* Main pages */}
        <Route path="/herb-trace/dashboard" element={<HerbTraceDashboard />} />
        <Route path="/herb-trace/overview" element={<PlatformOverview />} />
        <Route path="/herb-trace/herbs" element={<HerbCatalog />} />
        <Route path="/herb-trace/trace" element={<TraceabilityView />} />
        <Route path="/herb-trace/seed-to-sale" element={<SeedToSaleView />} />
        <Route path="/herb-trace/qrcode" element={<QRCodeView />} />
        <Route path="/herb-trace/map" element={<MapView />} />
        
        {/* Farm management */}
        <Route path="/herb-trace/farms" element={<FarmManagement />} />
        <Route path="/herb-trace/activities" element={<ActivitiesView />} />
        <Route path="/herb-trace/harvest" element={<HarvestView />} />
        <Route path="/herb-trace/weather" element={<WeatherView />} />
        
        {/* Certification */}
        <Route path="/herb-trace/certification" element={<CertificationView />} />
        <Route path="/herb-trace/inspection" element={<InspectionView />} />
        <Route path="/herb-trace/licenses" element={<LicensesView />} />
        <Route path="/herb-trace/gacp-applications" element={<GACPApplications />} />
        
        {/* Lab */}
        <Route path="/herb-trace/lab/samples" element={<LabSamplesView />} />
        <Route path="/herb-trace/lab/testing" element={<LabTestingView />} />
        <Route path="/herb-trace/lab/materials" element={<LabMaterialsView />} />
        
        {/* Market */}
        <Route path="/herb-trace/procurement" element={<ProcurementView />} />
        <Route path="/herb-trace/production" element={<ProductionView />} />
        <Route path="/herb-trace/inventory" element={<InventoryView />} />
        <Route path="/herb-trace/logistics" element={<LogisticsView />} />
        <Route path="/herb-trace/marketplace" element={<Marketplace />} />
        <Route path="/herb-trace/b2b" element={<B2BMarketView />} />
        <Route path="/herb-trace/contracts" element={<ContractsView />} />
        
        {/* Reports */}
        <Route path="/herb-trace/reports" element={<ReportsView />} />
        <Route path="/herb-trace/exports" element={<ExportsView />} />
        
        {/* Settings & Support */}
        <Route path="/herb-trace/learning" element={<LearningView />} />
        <Route path="/herb-trace/settings" element={<SettingsView />} />
        <Route path="/herb-trace/users" element={<UserManagement />} />
        <Route path="/herb-trace/support" element={<SupportView />} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
