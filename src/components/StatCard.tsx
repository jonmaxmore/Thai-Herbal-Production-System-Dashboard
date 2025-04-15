
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
  className?: string;
}

export default function StatCard({ title, value, icon, className }: StatCardProps) {
  return (
    <Card className={cn(className)}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-gray-500">{title}</div>
            <div className="text-2xl font-bold mt-1">{value}</div>
          </div>
          {icon && (
            <div className="h-10 w-10 bg-herb-light rounded-full flex items-center justify-center">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
