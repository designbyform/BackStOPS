"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Clock,
  CheckCircle2,
  FileX,
  Calendar,
  TrendingUp,
  ChevronRight,
  Building2,
  Plus,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge, PriorityBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  isOverdue,
  isDueSoon,
  isMissingDocument,
  isCriticalItem,
  formatDate,
  daysUntilDue,
} from "@/lib/utils";
import { ComplianceItem } from "@/lib/types";

function ItemRow({ item, businessName }: { item: ComplianceItem; businessName: string }) {
  const days = daysUntilDue(item);
  const overdue = isOverdue(item);

  return (
    <Link
      href={`/compliance/${item.id}`}
      className="flex items-center gap-4 px-4 py-3 hover:bg-slate-50 transition-colors rounded-lg group"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-sm font-medium text-slate-900 truncate group-hover:text-blue-700">
            {item.title}
          </span>
          <PriorityBadge priority={item.priority} />
        </div>
        <span className="text-xs text-slate-400">{businessName}</span>
      </div>
      <div className="text-right flex-shrink-0">
        <StatusBadge
          status={
            overdue
              ? "Overdue"
              : isDueSoon(item, 7)
              ? "Due Soon"
              : item.status
          }
        />
        <div
          className={`text-xs mt-1 ${
            overdue ? "text-red-600 font-semibold" : "text-slate-400"
          }`}
        >
          {item.due_date
            ? overdue
              ? `${Math.abs(days ?? 0)}d overdue`
              : `Due ${formatDate(item.due_date)}`
            : "No date"}
        </div>
      </div>
      <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-500 flex-shrink-0" />
    </Link>
  );
}

export default function DashboardPage() {
  const { state } = useStore();
  const { complianceItems, businesses } = state;
  const [selectedBizId, setSelectedBizId] = useState<string>("all");

  const filteredItems = useMemo(() => {
    if (selectedBizId === "all") return complianceItems;
    return complianceItems.filter((ci) => ci.business_id === selectedBizId);
  }, [complianceItems, selectedBizId]);

  const bizMap = useMemo(
    () => Object.fromEntries(businesses.map((b) => [b.id, b])),
    [businesses]
  );

  const overdueItems = filteredItems.filter((ci) => isOverdue(ci));
  const dueSoon7 = filteredItems.filter((ci) => isDueSoon(ci, 7));
  const dueSoon30 = filteredItems.filter((ci) => isDueSoon(ci, 30));
  const missingDocs = filteredItems.filter((ci) => isMissingDocument(ci));
  const completedThisMonth = filteredItems.filter((ci) => {
    if (ci.status !== "Completed" || !ci.last_completed_date) return false;
    const d = new Date(ci.last_completed_date);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const criticalItems = filteredItems.filter((ci) => isCriticalItem(ci));
  const notCompleted = filteredItems.filter(
    (ci) => ci.status !== "Completed" && ci.status !== "Not Applicable"
  );

  // Category breakdown
  const categoryBreakdown = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredItems.forEach((ci) => {
      if (ci.status !== "Completed" && ci.status !== "Not Applicable") {
        counts[ci.category] = (counts[ci.category] ?? 0) + 1;
      }
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);
  }, [filteredItems]);

  // Upcoming 30 days
  const upcoming30 = useMemo(
    () =>
      filteredItems
        .filter(
          (ci) =>
            ci.due_date &&
            ci.status !== "Completed" &&
            ci.status !== "Not Applicable" &&
            isDueSoon(ci, 30)
        )
        .sort((a, b) =>
          (a.due_date ?? "").localeCompare(b.due_date ?? "")
        )
        .slice(0, 8),
    [filteredItems]
  );

  const needsAttention = useMemo(
    () =>
      filteredItems
        .filter(
          (ci) =>
            (isOverdue(ci) || isCriticalItem(ci) || isMissingDocument(ci)) &&
            ci.status !== "Completed"
        )
        .sort((a, b) => {
          const aScore =
            (isOverdue(a) ? 100 : 0) +
            (a.priority === "Critical" ? 50 : a.priority === "High" ? 25 : 0);
          const bScore =
            (isOverdue(b) ? 100 : 0) +
            (b.priority === "Critical" ? 50 : b.priority === "High" ? 25 : 0);
          return bScore - aScore;
        })
        .slice(0, 6),
    [filteredItems]
  );

  const recentlyCompleted = useMemo(
    () =>
      filteredItems
        .filter((ci) => ci.status === "Completed" && ci.last_completed_date)
        .sort(
          (a, b) =>
            (b.last_completed_date ?? "").localeCompare(
              a.last_completed_date ?? ""
            )
        )
        .slice(0, 5),
    [filteredItems]
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Compliance Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedBizId}
            onChange={(e) => setSelectedBizId(e.target.value)}
            className="text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Businesses</option>
            {businesses.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
          <Link href="/compliance/new">
            <Button size="sm">
              <Plus size={14} />
              Add Item
            </Button>
          </Link>
        </div>
      </div>

      {/* Critical alert bar */}
      {overdueItems.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-4 flex items-center gap-4">
          <AlertTriangle size={20} className="text-red-600 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-red-800">
              {overdueItems.length} overdue item
              {overdueItems.length !== 1 ? "s" : ""} require immediate attention
            </p>
            <p className="text-xs text-red-600 mt-0.5">
              {overdueItems.map((i) => i.title).slice(0, 3).join(", ")}
              {overdueItems.length > 3 ? ` +${overdueItems.length - 3} more` : ""}
            </p>
          </div>
          <Link href="/compliance?filter=overdue">
            <Button variant="danger" size="sm">
              View Overdue
            </Button>
          </Link>
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Overdue"
          value={overdueItems.length}
          icon={AlertTriangle}
          iconColor="text-red-500"
          iconBg="bg-red-100"
          alert={overdueItems.length > 0}
          subtitle="Require immediate action"
        />
        <StatCard
          title="Due in 7 Days"
          value={dueSoon7.length}
          icon={Clock}
          iconColor="text-amber-600"
          iconBg="bg-amber-100"
          warning={dueSoon7.length > 0}
          subtitle="Act this week"
        />
        <StatCard
          title="Due in 30 Days"
          value={dueSoon30.length}
          icon={Calendar}
          iconColor="text-blue-600"
          iconBg="bg-blue-100"
          subtitle="Upcoming deadlines"
        />
        <StatCard
          title="Missing Documents"
          value={missingDocs.length}
          icon={FileX}
          iconColor="text-orange-600"
          iconBg="bg-orange-100"
          warning={missingDocs.length > 0}
          subtitle="Need uploading"
        />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Active Items"
          value={notCompleted.length}
          icon={TrendingUp}
          iconColor="text-slate-600"
          iconBg="bg-slate-100"
          subtitle="Not completed"
        />
        <StatCard
          title="Completed This Month"
          value={completedThisMonth.length}
          icon={CheckCircle2}
          iconColor="text-green-600"
          iconBg="bg-green-100"
          success={completedThisMonth.length > 0}
          subtitle="Great progress"
        />
        <StatCard
          title="Critical / High Priority"
          value={criticalItems.length}
          icon={AlertTriangle}
          iconColor="text-red-500"
          iconBg="bg-red-50"
          alert={criticalItems.length > 0}
          subtitle="Critical items"
        />
        <StatCard
          title="Businesses"
          value={businesses.length}
          icon={Building2}
          iconColor="text-slate-600"
          iconBg="bg-slate-100"
          subtitle="Under management"
        />
      </div>

      {/* Main content grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Needs Attention */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 className="section-title flex items-center gap-2">
              <AlertTriangle size={16} className="text-red-500" />
              Needs Attention
            </h2>
            <Link
              href="/compliance?filter=attention"
              className="text-xs text-blue-600 hover:text-blue-700 font-medium"
            >
              View all
            </Link>
          </div>
          {needsAttention.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <CheckCircle2 size={32} className="text-green-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-600">All clear!</p>
              <p className="text-xs text-slate-400 mt-1">
                No items need immediate attention.
              </p>
            </div>
          ) : (
            <div className="p-2">
              {needsAttention.map((item) => (
                <ItemRow
                  key={item.id}
                  item={item}
                  businessName={bizMap[item.business_id]?.name ?? "Unknown"}
                />
              ))}
            </div>
          )}
        </div>

        {/* Category Breakdown */}
        <div className="card">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="section-title">By Category</h2>
            <p className="text-xs text-slate-400 mt-0.5">Active items only</p>
          </div>
          <div className="p-4 space-y-2">
            {categoryBreakdown.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-8">No active items</p>
            ) : (
              categoryBreakdown.map(([cat, count]) => {
                const maxCount = categoryBreakdown[0][1];
                return (
                  <div key={cat}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-slate-600 truncate">{cat}</span>
                      <span className="text-xs font-semibold text-slate-900 ml-2">
                        {count}
                      </span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${(count / maxCount) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Due Soon */}
        <div className="card">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 className="section-title flex items-center gap-2">
              <Calendar size={16} className="text-blue-500" />
              Due in 30 Days
            </h2>
            <Link
              href="/calendar"
              className="text-xs text-blue-600 hover:text-blue-700 font-medium"
            >
              View calendar
            </Link>
          </div>
          {upcoming30.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <p className="text-sm text-slate-400">Nothing due in the next 30 days.</p>
            </div>
          ) : (
            <div className="p-2">
              {upcoming30.map((item) => (
                <ItemRow
                  key={item.id}
                  item={item}
                  businessName={bizMap[item.business_id]?.name ?? "Unknown"}
                />
              ))}
            </div>
          )}
        </div>

        {/* Recently Completed */}
        <div className="card">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 className="section-title flex items-center gap-2">
              <CheckCircle2 size={16} className="text-green-500" />
              Recently Completed
            </h2>
          </div>
          {recentlyCompleted.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <p className="text-sm text-slate-400">No completed items yet.</p>
            </div>
          ) : (
            <div className="p-2">
              {recentlyCompleted.map((item) => (
                <Link
                  key={item.id}
                  href={`/compliance/${item.id}`}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 transition-colors group"
                >
                  <CheckCircle2 size={16} className="text-green-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {item.title}
                    </p>
                    <p className="text-xs text-slate-400">
                      {bizMap[item.business_id]?.name} ·{" "}
                      {formatDate(item.last_completed_date)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Missing Documents */}
      {missingDocs.length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 className="section-title flex items-center gap-2">
              <FileX size={16} className="text-orange-500" />
              Missing Documents ({missingDocs.length})
            </h2>
            <Link
              href="/documents"
              className="text-xs text-blue-600 hover:text-blue-700 font-medium"
            >
              View all documents
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {missingDocs.slice(0, 5).map((item) => (
              <Link
                key={item.id}
                href={`/compliance/${item.id}`}
                className="flex items-center gap-4 px-5 py-3 hover:bg-slate-50 transition-colors group"
              >
                <FileX size={16} className="text-orange-400 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900 group-hover:text-blue-700">
                    {item.title}
                  </p>
                  <p className="text-xs text-slate-400">
                    {bizMap[item.business_id]?.name} · Due{" "}
                    {formatDate(item.due_date)}
                  </p>
                </div>
                <PriorityBadge priority={item.priority} />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
