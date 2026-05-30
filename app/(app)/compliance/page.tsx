"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Plus,
  Search,
  Filter,
  ClipboardList,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { StatusBadge, PriorityBadge, DocStatusBadge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { ComplianceForm } from "@/components/compliance/compliance-form";
import { EmptyState } from "@/components/ui/empty-state";
import {
  isOverdue,
  isDueSoon,
  isMissingDocument,
  formatDate,
  computedStatus,
  cn,
} from "@/lib/utils";
import { CATEGORIES, STATUSES, PRIORITIES, Status, Priority, Category } from "@/lib/types";

export default function CompliancePage() {
  const { state, addComplianceItem } = useStore();
  const searchParams = useSearchParams();
  const defaultBiz = searchParams.get("business") ?? "all";
  const defaultFilter = searchParams.get("filter");

  const [search, setSearch] = useState("");
  const [bizFilter, setBizFilter] = useState(defaultBiz);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>(
    defaultFilter === "overdue" ? "Overdue" : "all"
  );
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [showNew, setShowNew] = useState(false);

  const { businesses, complianceItems, currentUser } = state;
  const bizMap = Object.fromEntries(businesses.map((b) => [b.id, b]));

  const filtered = useMemo(() => {
    return complianceItems.filter((ci) => {
      const effStatus = computedStatus(ci);

      if (bizFilter !== "all" && ci.business_id !== bizFilter) return false;
      if (categoryFilter !== "all" && ci.category !== categoryFilter) return false;
      if (statusFilter !== "all" && effStatus !== statusFilter) return false;
      if (priorityFilter !== "all" && ci.priority !== priorityFilter) return false;
      if (defaultFilter === "attention") {
        if (!isOverdue(ci) && !isMissingDocument(ci) && ci.priority !== "Critical") return false;
      }

      if (search) {
        const q = search.toLowerCase();
        return (
          ci.title.toLowerCase().includes(q) ||
          ci.agency.toLowerCase().includes(q) ||
          ci.notes.toLowerCase().includes(q) ||
          (bizMap[ci.business_id]?.name ?? "").toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [complianceItems, search, bizFilter, categoryFilter, statusFilter, priorityFilter, defaultFilter, bizMap]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const aOverdue = isOverdue(a) ? 1 : 0;
      const bOverdue = isOverdue(b) ? 1 : 0;
      if (bOverdue !== aOverdue) return bOverdue - aOverdue;

      const priorityOrder = { Critical: 0, High: 1, Medium: 2, Low: 3 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }

      return (a.due_date ?? "z").localeCompare(b.due_date ?? "z");
    });
  }, [filtered]);

  const handleAdd = (data: Parameters<typeof addComplianceItem>[0]) => {
    addComplianceItem(data);
    setShowNew(false);
  };

  const clearFilters = () => {
    setSearch("");
    setBizFilter("all");
    setCategoryFilter("all");
    setStatusFilter("all");
    setPriorityFilter("all");
  };

  const hasFilters =
    search ||
    bizFilter !== "all" ||
    categoryFilter !== "all" ||
    statusFilter !== "all" ||
    priorityFilter !== "all";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Compliance Items</h1>
          <p className="text-sm text-slate-500 mt-1">
            {sorted.length} of {complianceItems.length} items
          </p>
        </div>
        <Button onClick={() => setShowNew(true)}>
          <Plus size={16} />
          Add Item
        </Button>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="relative md:col-span-2">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search items…"
              className="pl-8"
            />
          </div>
          <Select value={bizFilter} onChange={(e) => setBizFilter(e.target.value)}>
            <option value="all">All Businesses</option>
            {businesses.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </Select>
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
          <Select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
            <option value="all">All Priorities</option>
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </Select>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <Select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="max-w-xs">
            <option value="all">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="text-xs text-slate-500 hover:text-slate-700 underline"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      {sorted.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No compliance items found."
          description={
            hasFilters
              ? "Try clearing filters or adjusting your search."
              : "Add your first compliance item to start tracking."
          }
          action={
            !hasFilters ? (
              <Button onClick={() => setShowNew(true)}>
                <Plus size={14} />
                Add Compliance Item
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Item
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">
                  Business
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">
                  Category
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">
                  Priority
                </th>
                <th className="px-4 py-3 w-8" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sorted.map((item) => {
                const effStatus = computedStatus(item);
                const overdue = isOverdue(item);
                const biz = bizMap[item.business_id];

                return (
                  <tr
                    key={item.id}
                    className={cn(
                      "group hover:bg-slate-50 transition-colors",
                      overdue && "bg-red-50/50"
                    )}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {overdue && (
                          <AlertTriangle size={14} className="text-red-500 flex-shrink-0" />
                        )}
                        <div>
                          <Link
                            href={`/compliance/${item.id}`}
                            className="text-sm font-medium text-slate-900 group-hover:text-blue-700 hover:underline"
                          >
                            {item.title}
                          </Link>
                          {isMissingDocument(item) && (
                            <span className="block text-xs text-orange-600 mt-0.5">
                              Missing document
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <Link
                        href={`/businesses/${item.business_id}`}
                        className="text-sm text-slate-600 hover:text-blue-700"
                      >
                        {biz?.name ?? "—"}
                      </Link>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="text-xs text-slate-500">{item.category}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "text-sm",
                          overdue
                            ? "text-red-700 font-semibold"
                            : "text-slate-600"
                        )}
                      >
                        {formatDate(item.due_date)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={effStatus} />
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <PriorityBadge priority={item.priority} />
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/compliance/${item.id}`}
                        className="text-slate-300 group-hover:text-slate-500"
                      >
                        <ChevronRight size={16} />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Item Modal */}
      <Modal
        open={showNew}
        onClose={() => setShowNew(false)}
        title="Add Compliance Item"
        size="xl"
      >
        <ComplianceForm
          businesses={businesses}
          defaultBusinessId={bizFilter !== "all" ? bizFilter : undefined}
          onSubmit={handleAdd}
          onCancel={() => setShowNew(false)}
        />
      </Modal>
    </div>
  );
}
