import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ComplianceItem, Status, Priority, DocumentStatus } from "./types";
import {
  isAfter,
  isBefore,
  addDays,
  format,
  parseISO,
  differenceInDays,
} from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  try {
    return format(parseISO(dateStr), "MMM d, yyyy");
  } catch {
    return dateStr;
  }
}

export function formatDateShort(dateStr: string | null): string {
  if (!dateStr) return "—";
  try {
    return format(parseISO(dateStr), "MM/dd/yyyy");
  } catch {
    return dateStr;
  }
}

export function isOverdue(item: ComplianceItem): boolean {
  if (item.status === "Completed" || item.status === "Not Applicable") return false;
  if (!item.due_date) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return isBefore(parseISO(item.due_date), today);
}

export function isDueSoon(item: ComplianceItem, days = 30): boolean {
  if (item.status === "Completed" || item.status === "Not Applicable") return false;
  if (!item.due_date) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDate = parseISO(item.due_date);
  const threshold = addDays(today, days);
  return (
    !isBefore(dueDate, today) && (isBefore(dueDate, threshold) || +dueDate === +threshold)
  );
}

export function daysUntilDue(item: ComplianceItem): number | null {
  if (!item.due_date) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return differenceInDays(parseISO(item.due_date), today);
}

export function computedStatus(item: ComplianceItem): Status {
  if (item.status === "Completed" || item.status === "Not Applicable") {
    return item.status;
  }
  if (isOverdue(item)) return "Overdue";
  if (isDueSoon(item, 7)) return "Due Soon";
  return item.status;
}

export function isMissingDocument(item: ComplianceItem): boolean {
  return item.requires_document && item.document_status === "missing";
}

export function isCriticalItem(item: ComplianceItem): boolean {
  if (item.priority === "Critical") return true;
  if (item.priority === "High" && isOverdue(item)) return true;
  return false;
}

export const STATUS_COLORS: Record<Status, { bg: string; text: string; border: string }> = {
  "Not Started": {
    bg: "bg-slate-100",
    text: "text-slate-600",
    border: "border-slate-200",
  },
  "In Progress": {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
  },
  "Waiting on Agency": {
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-200",
  },
  "Waiting on Client": {
    bg: "bg-orange-50",
    text: "text-orange-700",
    border: "border-orange-200",
  },
  "Due Soon": {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
  },
  Overdue: {
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
  },
  Completed: {
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
  },
  "Not Applicable": {
    bg: "bg-slate-50",
    text: "text-slate-400",
    border: "border-slate-200",
  },
};

export const PRIORITY_COLORS: Record<Priority, { bg: string; text: string; dot: string }> = {
  Critical: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
  High: { bg: "bg-orange-50", text: "text-orange-700", dot: "bg-orange-500" },
  Medium: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-400" },
  Low: { bg: "bg-slate-50", text: "text-slate-500", dot: "bg-slate-300" },
};

export const DOC_STATUS_COLORS: Record<DocumentStatus, { bg: string; text: string }> = {
  missing: { bg: "bg-red-50", text: "text-red-700" },
  uploaded: { bg: "bg-green-50", text: "text-green-700" },
  expired: { bg: "bg-amber-50", text: "text-amber-700" },
  not_required: { bg: "bg-slate-50", text: "text-slate-500" },
};

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

export function today(): string {
  return format(new Date(), "yyyy-MM-dd");
}

export function addDaysToDate(dateStr: string, days: number): string {
  return format(addDays(parseISO(dateStr), days), "yyyy-MM-dd");
}
