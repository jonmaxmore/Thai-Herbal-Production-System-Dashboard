
import React, { useState, useEffect } from "react";
import { 
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, 
  Tooltip as RechartsTooltip, ResponsiveContainer 
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Leaf, Users, ClipboardCheck, AlertTriangle, Search, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import HerbSidebar from "./HerbSidebar";
import StatusBadge from "./StatusBadge";
import StatCard from "./StatCard";
import HerbCard from "./HerbCard";
import HerbModal from "./HerbModal";
import MobileHeader from "./MobileHeader";
import MapView from "./MapView";

import { 
  herbList, getHerbImage, generateFarmers, generateTraces, 
  calculateStatusCounts, Farm, Trace, CertificationStatus
} from "@/utils/herbData";
import { useIsMobile } from "@/hooks/use-mobile";

export default function HerbDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedHerb, setSelectedHerb] = useState<{name: string, id: number} | null>(null);
  const [farmers] = useState<Farm[]>(generateFarmers(100));
  const [traces] = useState<Trace[]>(generateTraces(100));
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<CertificationStatus | "All">("All");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  // Filter herbs based on search term
  const filteredHerbs = searchTerm
    ? herbList.filter(herb => herb.toLowerCase().includes(searchTerm.toLowerCase()))
    : herbList;

  // Filter farmers based on search term and status filter
  const filteredFarmers = farmers.filter(farmer => {
    const matchesSearch = searchTerm 
      ? farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        farmer.herb.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    
    const matchesStatus = statusFilter !== "All" 
      ? farmer.gapc === statusFilter || 
        farmer.euGmp === statusFilter || 
        farmer.dttm === statusFilter || 
        farmer.tis === statusFilter
      : true;
    
    return matchesSearch && matchesStatus;
  });

  // Filter traces based on search term
  const filteredTraces = traces.filter(trace => {
    return searchTerm 
      ? trace.herb.toLowerCase().includes(searchTerm.toLowerCase()) || 
        trace.event.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
  });

  // Certification counts
  const gapcStatus = calculateStatusCounts(farmers, "gapc");
  const euGmpStatus = calculateStatusCounts(farmers, "euGmp");
  const dttmStatus = calculateStatusCounts(farmers, "dttm");
  
  // Format data for charts
  const certificationStatusData = Object.entries(gapcStatus).map(
    ([status, count]) => ({ name: status, value: count })
  );

  // Get appropriate title based on active tab
  const getTabTitle = () => {
    switch (activeTab) {
      case "dashboard": return "Dashboard";
      case "herbs": return "Herbs Catalog";
      case "trace": return "Traceability";
      case "certification": return "Certifications";
      case "map": return "Map View";
      case "settings": return "Settings";
      default: return "HerbTrace";
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Mobile menu overlay */}
      {isMobile && isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - desktop always visible, mobile conditional */}
      <div 
        className={`
          ${isMobile ? "fixed inset-y-0 left-0 z-50 transform transition-transform ease-in-out duration-300" : ""}
          ${isMobile && !isMobileMenuOpen ? "-translate-x-full" : "translate-x-0"}
        `}
      >
        <HerbSidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          isMobile={isMobile}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header */}
        <MobileHeader 
          title={getTabTitle()} 
          onMenuClick={() => setIsMobileMenuOpen(true)} 
        />

        {/* Main content scrollable area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {/* Dashboard View */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold hidden md:block">Herb Trace Dashboard</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard 
                  title="Total Farmers" 
                  value={farmers.length} 
                  icon={<Users className="h-5 w-5 text-herb" />} 
                />
                <StatCard 
                  title="GACP Passed" 
                  value={gapcStatus["Passed"] || 0} 
                  icon={<ClipboardCheck className="h-5 w-5 text-herb" />}
                />
                <StatCard 
                  title="EU-GMP Pending" 
                  value={euGmpStatus["Pending"] || 0} 
                  icon={<Leaf className="h-5 w-5 text-herb" />}
                />
                <StatCard 
                  title="DTTAM Failed" 
                  value={dttmStatus["Failed"] || 0} 
                  icon={<AlertTriangle className="h-5 w-5 text-herb" />}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="p-4 h-64">
                    <h3 className="text-lg font-semibold mb-2">GACP Status Overview</h3>
                    <ResponsiveContainer width="100%" height="90%">
                      <PieChart>
                        <Pie
                          data={certificationStatusData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={60}
                          fill="#8884d8"
                          label
                        >
                          {certificationStatusData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={
                                entry.name === 'Passed' ? '#22c55e' :
                                entry.name === 'Failed' ? '#ef4444' :
                                entry.name === 'Pending' ? '#eab308' : '#94a3b8'
                              }
                            />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4 h-64">
                    <h3 className="text-lg font-semibold mb-2">Certification by Type</h3>
                    <ResponsiveContainer width="100%" height="90%">
                      <BarChart
                        data={[
                          { name: 'GACP', passed: gapcStatus["Passed"] || 0, pending: gapcStatus["Pending"] || 0, failed: gapcStatus["Failed"] || 0 },
                          { name: 'EU-GMP', passed: euGmpStatus["Passed"] || 0, pending: euGmpStatus["Pending"] || 0, failed: euGmpStatus["Failed"] || 0 },
                          { name: 'DTTAM', passed: dttmStatus["Passed"] || 0, pending: dttmStatus["Pending"] || 0, failed: dttmStatus["Failed"] || 0 },
                        ]}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <XAxis dataKey="name" />
                        <YAxis />
                        <RechartsTooltip />
                        <Bar dataKey="passed" stackId="a" fill="#22c55e" />
                        <Bar dataKey="pending" stackId="a" fill="#eab308" />
                        <Bar dataKey="failed" stackId="a" fill="#ef4444" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold mb-4">Recent Traceability Events</h3>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Herb</TableHead>
                          <TableHead>Event</TableHead>
                          <TableHead>Timestamp</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {traces.slice(0, 5).map(trace => (
                          <TableRow key={trace.id}>
                            <TableCell>{trace.id}</TableCell>
                            <TableCell>{trace.herb}</TableCell>
                            <TableCell>{trace.event}</TableCell>
                            <TableCell>{new Date(trace.timestamp).toLocaleString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Herbs Catalog View */}
          {activeTab === "herbs" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold hidden md:block">Herbs Catalog</h2>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  className="pl-10"
                  placeholder="Search herbs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredHerbs.map((herb, index) => (
                  <HerbCard
                    key={index}
                    id={index + 1}
                    name={herb}
                    image={getHerbImage(herb)}
                    onClick={() => setSelectedHerb({ name: herb, id: index + 1 })}
                  />
                ))}
              </div>

              {/* Herb details modal */}
              {selectedHerb && (
                <HerbModal
                  herbName={selectedHerb.name}
                  herbId={selectedHerb.id}
                  herbImage={getHerbImage(selectedHerb.name)}
                  isOpen={!!selectedHerb}
                  onClose={() => setSelectedHerb(null)}
                />
              )}
            </div>
          )}

          {/* Trace View with Search */}
          {activeTab === "trace" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold hidden md:block">Traceability Records</h2>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  className="pl-10"
                  placeholder="Search traces by herb or event..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Herb</TableHead>
                          <TableHead>Event</TableHead>
                          <TableHead>Timestamp</TableHead>
                          <TableHead>Location</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredTraces.map(trace => (
                          <TableRow key={trace.id}>
                            <TableCell>{trace.id}</TableCell>
                            <TableCell>{trace.herb}</TableCell>
                            <TableCell>{trace.event}</TableCell>
                            <TableCell>{new Date(trace.timestamp).toLocaleString()}</TableCell>
                            <TableCell>{trace.location.lat.toFixed(3)}, {trace.location.lng.toFixed(3)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Certification View with Search and Filter */}
          {activeTab === "certification" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold hidden md:block">Certified Farmers</h2>
              
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    className="pl-10"
                    placeholder="Search farmers by name or herb..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <Filter className="h-5 w-5 text-gray-400" />
                  <Select
                    value={statusFilter}
                    onValueChange={(value) => setStatusFilter(value as CertificationStatus | "All")}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Statuses</SelectItem>
                      <SelectItem value="Passed">Passed</SelectItem>
                      <SelectItem value="Failed">Failed</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Herb</TableHead>
                          <TableHead>GACP</TableHead>
                          <TableHead>EU-GMP</TableHead>
                          <TableHead>DTTAM</TableHead>
                          <TableHead>TIS</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredFarmers.map(farmer => (
                          <TableRow key={farmer.id}>
                            <TableCell>{farmer.id}</TableCell>
                            <TableCell>{farmer.name}</TableCell>
                            <TableCell>{farmer.herb}</TableCell>
                            <TableCell><StatusBadge status={farmer.gapc} /></TableCell>
                            <TableCell><StatusBadge status={farmer.euGmp} /></TableCell>
                            <TableCell><StatusBadge status={farmer.dttm} /></TableCell>
                            <TableCell><StatusBadge status={farmer.tis} /></TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Map View */}
          {activeTab === "map" && <MapView />}

          {/* Settings View */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold hidden md:block">Settings</h2>
              <Card>
                <CardContent className="p-6">
                  <p className="text-gray-500">Settings panel will be available in the future version.</p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
