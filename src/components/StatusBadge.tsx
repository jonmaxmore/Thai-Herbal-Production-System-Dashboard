
import { Badge } from "@/components/ui/badge";
import { statusColors, CertificationStatus } from "@/utils/herbData";

interface StatusBadgeProps {
  status: CertificationStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge className={statusColors[status]}>
      {status}
    </Badge>
  );
}
