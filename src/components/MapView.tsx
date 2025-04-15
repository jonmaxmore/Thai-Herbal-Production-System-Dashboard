
import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";

export default function MapView() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Herb Farms Map</h2>
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="h-[calc(100vh-200px)] bg-green-50 flex flex-col items-center justify-center text-gray-600">
            <MapPin className="h-12 w-12 text-herb mb-4" />
            <p className="text-lg font-medium">Interactive Map Coming Soon</p>
            <p className="text-sm text-gray-500 max-w-md text-center mt-2">
              In the production version, this will be an interactive map showing herb farms, 
              processing facilities, and real-time IoT data from farms across Thailand.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
