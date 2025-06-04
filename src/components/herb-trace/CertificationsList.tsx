
import React, { useState } from "react";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import StatusBadge from "@/components/StatusBadge";
import { CertificationStatus } from "@/utils/herbData";
import { EnhancedFarm } from "@/utils/database";

interface CertificationsListProps {
  farmers: EnhancedFarm[];
}

export default function CertificationsList({ farmers }: CertificationsListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<CertificationStatus | "All">("All");
  
  // Filter farmers based on search term and status filter
  const filteredFarmers = farmers.filter(farmer => {
    const matchesSearch = searchTerm 
      ? farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        farmer.herb.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    
    const matchesStatus = statusFilter !== "All" 
      ? farmer.gacp?.status === statusFilter || 
        farmer.euGmp === statusFilter || 
        farmer.dttm === statusFilter || 
        farmer.tis === statusFilter
      : true;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold hidden md:block text-green-800">Certified Farmers</h2>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600" />
          <Input
            className="pl-10 border-green-200 focus:border-green-500"
            placeholder="Search farmers by name or herb..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-green-600" />
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value as CertificationStatus | "All")}
          >
            <SelectTrigger className="w-[180px] border-green-200">
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

      <Card className="bg-white shadow-md hover:shadow-lg transition-all duration-300">
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
                  <TableRow key={farmer.id} className="hover:bg-green-50">
                    <TableCell>{farmer.id}</TableCell>
                    <TableCell>{farmer.name}</TableCell>
                    <TableCell>{farmer.herb}</TableCell>
                    <TableCell><StatusBadge status={farmer.gacp?.status || "Pending"} /></TableCell>
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
  );
}
