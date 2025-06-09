
import { Badge } from "@/components/ui/badge";
import { ProcessStatus, OptionalCertificationStatus } from "@/utils/database/types";

export type CertificationStatus = "Passed" | "Failed" | "Pending" | "Expired" | "In Progress" | "Other" | "Not Applied" | "Applied" | "Approved" | "Rejected";

const statusColors: Record<CertificationStatus, string> = {
  "Passed": "bg-green-600 text-white",
  "Failed": "bg-red-600 text-white", 
  "Pending": "bg-yellow-600 text-white",
  "In Progress": "bg-blue-600 text-white",
  "Expired": "bg-gray-600 text-white",
  "Other": "bg-gray-400 text-white",
  "Not Applied": "bg-gray-300 text-gray-700",
  "Applied": "bg-blue-500 text-white",
  "Approved": "bg-green-600 text-white",
  "Rejected": "bg-red-600 text-white"
};

interface StatusBadgeProps {
  status: CertificationStatus | ProcessStatus | OptionalCertificationStatus;
  isPrimary?: boolean; // To distinguish GACP from optional certs
}

export default function StatusBadge({ status, isPrimary = false }: StatusBadgeProps) {
  // Convert ProcessStatus to CertificationStatus
  const displayStatus = status as CertificationStatus;
  
  const getStatusEmoji = (status: CertificationStatus) => {
    switch (status) {
      case "Passed": 
      case "Approved": return "✅ ";
      case "Failed": 
      case "Rejected": return "❌ ";
      case "Pending": 
      case "Applied": return "⏳ ";
      case "In Progress": return "🔄 ";
      case "Expired": return "⏰ ";
      case "Not Applied": return "➖ ";
      case "Other": return "ℹ️ ";
      default: return "ℹ️ ";
    }
  };

  const badgeClassName = `${statusColors[displayStatus] || statusColors["Other"]} font-medium animate-fade-in ${
    isPrimary ? 'ring-2 ring-green-300' : ''
  }`;

  return (
    <Badge className={badgeClassName}>
      {getStatusEmoji(displayStatus)}{displayStatus}
      {isPrimary && <span className="ml-1 text-xs">★</span>}
    </Badge>
  );
}

export { statusColors };
