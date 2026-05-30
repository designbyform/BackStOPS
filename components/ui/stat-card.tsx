import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number | string;
  icon?: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  subtitle?: string;
  alert?: boolean;
  warning?: boolean;
  success?: boolean;
  onClick?: () => void;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  iconColor = "text-slate-500",
  iconBg = "bg-slate-100",
  subtitle,
  alert,
  warning,
  success,
  onClick,
}: StatCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "stat-card",
        onClick && "cursor-pointer hover:shadow-md hover:border-slate-300 transition-all",
        alert && "border-red-200 bg-red-50",
        warning && "border-amber-200 bg-amber-50",
        success && "border-green-200 bg-green-50"
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p
            className={cn(
              "text-xs font-medium uppercase tracking-wider mb-1",
              alert ? "text-red-600" : warning ? "text-amber-700" : success ? "text-green-700" : "text-slate-500"
            )}
          >
            {title}
          </p>
          <p
            className={cn(
              "text-3xl font-bold",
              alert ? "text-red-700" : warning ? "text-amber-800" : success ? "text-green-700" : "text-slate-900"
            )}
          >
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0", iconBg)}>
            <Icon size={20} className={iconColor} />
          </div>
        )}
      </div>
    </div>
  );
}
