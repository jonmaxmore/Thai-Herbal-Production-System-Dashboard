
import { 
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, 
  Tooltip as RechartsTooltip, ResponsiveContainer 
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";

interface ChartSectionProps {
  gapcStatus: Record<string, number>;
  euGmpStatus: Record<string, number>;
  dttmStatus: Record<string, number>;
}

export function ChartSection({ gapcStatus, euGmpStatus, dttmStatus }: ChartSectionProps) {
  // Format data for charts
  const certificationStatusData = Object.entries(gapcStatus).map(
    ([status, count]) => ({ name: status, value: count })
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="bg-white shadow-md hover:shadow-lg transition-all duration-300">
        <CardContent className="p-4 h-64">
          <h3 className="text-lg font-semibold mb-2 text-green-800">GACP Status Overview</h3>
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
      
      <Card className="bg-white shadow-md hover:shadow-lg transition-all duration-300">
        <CardContent className="p-4 h-64">
          <h3 className="text-lg font-semibold mb-2 text-green-800">Certification by Type</h3>
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
  );
}
