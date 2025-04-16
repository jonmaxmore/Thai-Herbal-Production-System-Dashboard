
import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import HerbCard from "@/components/herb-trace/HerbCard";
import HerbModal from "@/components/herb-trace/HerbModal";
import HerbTraceLayout from "@/components/layouts/HerbTraceLayout";
import { herbList, getHerbImage } from "@/utils/herbData";

export default function HerbCatalog() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedHerb, setSelectedHerb] = useState<{name: string, id: number} | null>(null);

  // Filter herbs based on search term
  const filteredHerbs = searchTerm
    ? herbList.filter(herb => herb.toLowerCase().includes(searchTerm.toLowerCase()))
    : herbList;

  return (
    <HerbTraceLayout activeTab="herbs">
      <div className="space-y-6 animate-fade-in">
        <h2 className="text-2xl font-bold hidden md:block text-green-800">Herbs Catalog</h2>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600" />
          <Input
            className="pl-10 border-green-200 focus:border-green-500"
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
    </HerbTraceLayout>
  );
}
