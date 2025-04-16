
import HerbTraceLayout from "@/components/layouts/HerbTraceLayout";
import MapViewComponent from "@/components/MapView";

export default function MapViewPage() {
  return (
    <HerbTraceLayout activeTab="map">
      <MapViewComponent />
    </HerbTraceLayout>
  );
}
