import { Badge } from "@/components/ui/badge";
import { ComplaintPriority } from "@/lib/types";

interface PriorityBadgeProps {
  priority: ComplaintPriority;
}

export const PriorityBadge = ({ priority }: PriorityBadgeProps) => {
  const getPriorityConfig = (priority: ComplaintPriority) => {
    switch (priority) {
      case "Low":
        return {
          emoji: "⚪",
          className: "bg-priority-low text-white",
          label: "Low"
        };
      case "Medium":
        return {
          emoji: "🟡",
          className: "bg-priority-medium text-white",
          label: "Medium"
        };
      case "High":
        return {
          emoji: "🔴",
          className: "bg-priority-high text-white",
          label: "High"
        };
    }
  };

  const config = getPriorityConfig(priority);

  return (
    <Badge className={`${config.className} gap-1 font-medium`}>
      <span>{config.emoji}</span>
      {config.label}
    </Badge>
  );
};
