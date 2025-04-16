
import { useState } from "react";
import HerbTraceLayout from "@/components/layouts/HerbTraceLayout";
import TraceView from "@/components/TraceView";
import { generateTraces } from "@/utils/herbData";

export default function TraceabilityView() {
  const [searchTerm, setSearchTerm] = useState("");
  const [traces] = useState(generateTraces(100));
  
  // Filter traces based on search term
  const filteredTraces = traces.filter(trace => {
    return searchTerm 
      ? trace.herb.toLowerCase().includes(searchTerm.toLowerCase()) || 
        trace.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trace.referenceCode?.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
  });

  return (
    <HerbTraceLayout activeTab="trace">
      <TraceView 
        traces={filteredTraces}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
    </HerbTraceLayout>
  );
}
