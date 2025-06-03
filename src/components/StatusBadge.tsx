
import { Badge } from "@/components/ui/badge";

export type CertificationStatus = "Passed" | "Failed" | "Pending" | "Expired";

const statusColors: Record<CertificationStatus, string> = {
  "Passed": "bg-green-600 text-white",
  "Failed": "bg-red-600 text-white", 
  "Pending": "bg-yellow-600 text-white",
  "Expired": "bg-gray-600 text-white"
};

interface StatusBadgeProps {
  status: CertificationStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusEmoji = (status: CertificationStatus) => {
    switch (status) {
      case "Passed": return "✅ ";
      case "Failed": return "❌ ";
      case "Pending": return "⏳ ";
      case "Expired": return "⏰ ";
      default: return "ℹ️ ";
    }
  };

  return (
    <Badge className={`${statusColors[status]} font-medium animate-fade-in`}>
      {getStatusEmoji(status)}{status}
    </Badge>
  );
}

export { statusColors };
