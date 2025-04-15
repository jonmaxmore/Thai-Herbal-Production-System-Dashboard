
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { herbTranslations } from "@/utils/herbData";

interface HerbModalProps {
  herbName: string;
  herbId: number;
  herbImage: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function HerbModal({ 
  herbName, 
  herbId, 
  herbImage, 
  isOpen, 
  onClose 
}: HerbModalProps) {
  const englishName = herbTranslations[herbName] || herbName;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">{herbName}</DialogTitle>
          <DialogDescription>
            {englishName} (ID: {herbId} | UID: HERB-{1000 + herbId})
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col space-y-4">
          <img 
            src={herbImage} 
            alt={herbName} 
            className="w-full h-48 object-cover rounded-md" 
          />
          
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="font-semibold">Thai Name:</div>
            <div>{herbName}</div>
            
            <div className="font-semibold">English Name:</div>
            <div>{englishName}</div>
            
            <div className="font-semibold">Family:</div>
            <div>Sample Plant Family</div>
            
            <div className="font-semibold">Properties:</div>
            <div>Traditional medicinal herb</div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
          <Button>View Full Details</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
