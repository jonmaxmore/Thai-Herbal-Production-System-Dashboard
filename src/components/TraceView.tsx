
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search, QrCode } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import QRCode from "react-qr-code";
import { Trace } from "@/utils/herbData";

interface TraceViewProps {
  traces: Trace[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const TraceView: React.FC<TraceViewProps> = ({ traces, searchTerm, setSearchTerm }) => {
  const [selectedTrace, setSelectedTrace] = useState<Trace | null>(null);

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold hidden md:block text-green-800">Seed-to-Sale Traceability</h2>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600" />
        <Input
          className="pl-10 border-green-200 focus:border-green-500"
          placeholder="Search by herb, event, or reference code..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Card className="bg-white shadow-md hover:shadow-lg transition-all duration-300">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Herb</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead>Reference Code</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>QR Code</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {traces.map(trace => (
                  <TableRow key={trace.id} className="hover:bg-green-50">
                    <TableCell>{trace.id}</TableCell>
                    <TableCell>{trace.herb}</TableCell>
                    <TableCell>{trace.event}</TableCell>
                    <TableCell>
                      {trace.referenceCode || `HERB-${trace.id}-${trace.event.substring(0, 3).toUpperCase()}`}
                    </TableCell>
                    <TableCell>{new Date(trace.timestamp).toLocaleString()}</TableCell>
                    <TableCell>{trace.location.lat.toFixed(3)}, {trace.location.lng.toFixed(3)}</TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="flex items-center gap-1 text-green-700 border-green-200 hover:bg-green-50"
                            onClick={() => setSelectedTrace(trace)}
                          >
                            <QrCode className="h-4 w-4" /> View
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle>Trace QR Code</DialogTitle>
                          </DialogHeader>
                          <div className="flex flex-col items-center justify-center p-6">
                            <QRCode 
                              value={JSON.stringify({
                                id: trace.id,
                                herb: trace.herb,
                                event: trace.event,
                                timestamp: trace.timestamp,
                                referenceCode: trace.referenceCode || `HERB-${trace.id}-${trace.event.substring(0, 3).toUpperCase()}`,
                                location: trace.location
                              })} 
                              size={200}
                            />
                            <p className="mt-4 text-center font-medium">
                              {trace.referenceCode || `HERB-${trace.id}-${trace.event.substring(0, 3).toUpperCase()}`}
                            </p>
                            <p className="text-sm text-gray-500 mt-2">
                              {trace.herb} - {trace.event}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(trace.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TraceView;
