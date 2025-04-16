
import { Card, CardContent } from "@/components/ui/card";
import HerbTraceLayout from "@/components/layouts/HerbTraceLayout";

export default function SettingsView() {
  return (
    <HerbTraceLayout activeTab="settings">
      <div className="space-y-6 animate-fade-in">
        <h2 className="text-2xl font-bold hidden md:block text-green-800">Settings</h2>
        <Card className="bg-white shadow-md hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <p className="text-gray-600">Settings panel will be available in the future version.</p>
          </CardContent>
        </Card>
      </div>
    </HerbTraceLayout>
  );
}
