
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Trace } from "@/utils/herbData";

interface TraceEventsTableProps {
  traces: Trace[];
}

export function TraceEventsTable({ traces }: TraceEventsTableProps) {
  return (
    <Card className="bg-white shadow-md hover:shadow-lg transition-all duration-300">
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-4 text-green-800">Recent Traceability Events</h3>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Herb</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Ref. Code</TableHead>
                <TableHead>Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {traces.map(trace => (
                <TableRow key={trace.id} className="hover:bg-green-50">
                  <TableCell>{trace.id}</TableCell>
                  <TableCell>{trace.herb}</TableCell>
                  <TableCell>{trace.event}</TableCell>
                  <TableCell>{trace.referenceCode || "N/A"}</TableCell>
                  <TableCell>{new Date(trace.timestamp).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
