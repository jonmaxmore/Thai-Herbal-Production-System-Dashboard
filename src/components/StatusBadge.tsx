
import { Badge } from "@/components/ui/badge";
import { ProcessStatus } from "@/utils/database/types";

export type CertificationStatus = "Passed" | "Failed" | "Pending" | "Expired" | "In Progress" | "Other";

const statusColors: Record<CertificationStatus, string> = {
  "Passed": "bg-green-600 text-white",
  "Failed": "bg-red-600 text-white", 
  "Pending": "bg-yellow-600 text-white",
  "In Progress": "bg-blue-600 text-white",
  "Expired": "bg-gray-600 text-white",
  "Other": "bg-gray-400 text-white"
};

interface StatusBadgeProps {
  status: CertificationStatus | ProcessStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  // Convert ProcessStatus to CertificationStatus
  const displayStatus = status as CertificationStatus;
  
  const getStatusEmoji = (status: CertificationStatus) => {
    switch (status) {
      case "Passed": return "✅ ";
      case "Failed": return "❌ ";
      case "Pending": return "⏳ ";
      case "In Progress": return "🔄 ";
      case "Expired": return "⏰ ";
      case "Other": return "ℹ️ ";
      default: return "ℹ️ ";
    }
  };

  return (
    <Badge className={`${statusColors[displayStatus] || statusColors["Other"]} font-medium animate-fade-in`}>
      {getStatusEmoji(displayStatus)}{displayStatus}
    </Badge>
  );
}

export { statusColors };
