import { cn } from "@/lib/utils";
import {
  Status,
  Priority,
  DocumentStatus,
  BusinessType,
} from "@/lib/types";
import {
  STATUS_COLORS,
  PRIORITY_COLORS,
  DOC_STATUS_COLORS,
} from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export function Badge({ children, className }: BadgeProps) {
  return (
    <span className={cn("badge", className)}>{children}</span>
  );
}

export function StatusBadge({ status }: { status: Status }) {
  const colors = STATUS_COLORS[status];
  return (
    <span
      className={cn(
        "badge border",
        colors.bg,
        colors.text,
        colors.border
      )}
    >
      {status}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  const colors = PRIORITY_COLORS[priority];
  return (
    <span className={cn("badge", colors.bg, colors.text)}>
      <span className={cn("w-1.5 h-1.5 rounded-full mr-1.5 inline-block", colors.dot)} />
      {priority}
    </span>
  );
}

export function DocStatusBadge({ status }: { status: DocumentStatus }) {
  const colors = DOC_STATUS_COLORS[status];
  const labels: Record<DocumentStatus, string> = {
    missing: "Missing",
    uploaded: "On File",
    expired: "Expired",
    not_required: "Not Required",
  };
  return (
    <span className={cn("badge", colors.bg, colors.text)}>
      {labels[status]}
    </span>
  );
}

export function BusinessTypeBadge({ type }: { type: BusinessType }) {
  return (
    <span className="badge bg-slate-100 text-slate-600 border border-slate-200">
      {type}
    </span>
  );
}
