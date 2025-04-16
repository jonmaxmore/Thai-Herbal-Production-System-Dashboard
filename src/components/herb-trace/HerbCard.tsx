
import { Card, CardContent } from "@/components/ui/card";
import { herbTranslations } from "@/utils/herbData";

interface HerbCardProps {
  id: number;
  name: string;
  image: string;
  onClick?: () => void;
}

export default function HerbCard({ id, name, image, onClick }: HerbCardProps) {
  // Get the English translation or use the Thai name if not available
  const englishName = herbTranslations[name] || name;
  
  return (
    <Card 
      className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="relative h-32">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover" 
        />
      </div>
      <CardContent className="p-4 text-center">
        <div className="text-xs text-gray-500">ID: {id} | UID: HERB-{1000 + id}</div>
        <div className="font-bold text-lg mt-1 line-clamp-1">{name}</div>
        <div className="text-sm italic text-gray-700 line-clamp-1">{englishName}</div>
      </CardContent>
    </Card>
  );
}
