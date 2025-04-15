
import { Badge } from "@/components/ui/badge";
import { statusColors, CertificationStatus } from "@/utils/herbData";

interface StatusBadgeProps {
  status: CertificationStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusEmoji = (status: CertificationStatus) => {
    switch (status) {
      case "Passed": return "✅ ";
      case "Failed": return "❌ ";
      case "Pending": return "⏳ ";
      default: return "ℹ️ ";
    }
  };

  return (
    <Badge className={`${statusColors[status]} font-medium animate-fade-in`}>
      {getStatusEmoji(status)}{status}
    </Badge>
  );
}
