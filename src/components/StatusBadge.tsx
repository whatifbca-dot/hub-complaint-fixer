import { Badge } from "@/components/ui/badge";
import { ComplaintStatus } from "@/lib/types";
import { Clock, AlertCircle, CheckCircle } from "lucide-react";

interface StatusBadgeProps {
  status: ComplaintStatus;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const getStatusConfig = (status: ComplaintStatus) => {
    switch (status) {
      case "Pending":
        return {
          icon: Clock,
          className: "bg-status-pending text-white",
          label: "Pending"
        };
      case "In Progress":
        return {
          icon: AlertCircle,
          className: "bg-status-in-progress text-white",
          label: "In Progress"
        };
      case "Resolved":
        return {
          icon: CheckCircle,
          className: "bg-status-resolved text-white",
          label: "Resolved"
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <Badge className={`${config.className} gap-1 font-medium`}>
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
};
