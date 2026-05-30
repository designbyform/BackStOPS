"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Filter,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { Select } from "@/components/ui/input";
import { StatusBadge, PriorityBadge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import {
  isOverdue,
  isDueSoon,
  computedStatus,
  cn,
} from "@/lib/utils";
import { CATEGORIES, PRIORITIES } from "@/lib/types";
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, getDay, isToday } from "date-fns";

export default function CalendarPage() {
  const { state } = useStore();
  const { complianceItems, businesses } = state;
  const bizMap = Object.fromEntries(businesses.map((b) => [b.id, b]));

  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 4, 1)); // May 2026
  const [view, setView] = useState<"calendar" | "list">("list");
  const [bizFilter, setBizFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [rangeFilter, setRangeFilter] = useState("all");

  const filtered = useMemo(() => {
    return complianceItems.filter((ci) => {
      if (ci.status === "Completed" || ci.status === "Not Applicable") return false;
      if (!ci.due_date) return false;
      if (bizFilter !== "all" && ci.business_id !== bizFilter) return false;
      if (categoryFilter !== "all" && ci.category !== categoryFilter) return false;
      if (priorityFilter !== "all" && ci.priority !== priorityFilter) return false;

      if (rangeFilter === "overdue") return isOverdue(ci);
      if (rangeFilter === "7days") return isDueSoon(ci, 7);
      if (rangeFilter === "30days") return isDueSoon(ci, 30);

      return true;
    });
  }, [complianceItems, bizFilter, categoryFilter, priorityFilter, rangeFilter]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) =>
      (a.due_date ?? "z").localeCompare(b.due_date ?? "z")
    );
  }, [filtered]);

  // Calendar grid
  const days = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const itemsByDate = useMemo(() => {
    const map: Record<string, typeof complianceItems> = {};
    filtered.forEach((ci) => {
      if (ci.due_date) {
        const key = ci.due_date;
        if (!map[key]) map[key] = [];
        map[key].push(ci);
      }
    });
    return map;
  }, [filtered]);

  const startPadding = getDay(startOfMonth(currentMonth));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Compliance Calendar</h1>
          <p className="text-sm text-slate-500 mt-1">
            {filtered.length} active item{filtered.length !== 1 ? "s" : ""} with due dates
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setView("list")}
            className={cn(
              "px-3 py-1.5 text-sm rounded-lg font-medium transition-colors",
              view === "list"
                ? "bg-blue-600 text-white"
                : "bg-white border border-slate-300 text-slate-600 hover:bg-slate-50"
            )}
          >
            List
          </button>
          <button
            onClick={() => setView("calendar")}
            className={cn(
              "px-3 py-1.5 text-sm rounded-lg font-medium transition-colors",
              view === "calendar"
                ? "bg-blue-600 text-white"
                : "bg-white border border-slate-300 text-slate-600 hover:bg-slate-50"
            )}
          >
            Calendar
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <Select value={bizFilter} onChange={(e) => setBizFilter(e.target.value)}>
            <option value="all">All Businesses</option>
            {businesses.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </Select>
          <Select value={rangeFilter} onChange={(e) => setRangeFilter(e.target.value)}>
            <option value="all">All Dates</option>
            <option value="overdue">Overdue</option>
            <option value="7days">Due in 7 Days</option>
            <option value="30days">Due in 30 Days</option>
          </Select>
          <Select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="all">All Categories</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </Select>
          <Select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
            <option value="all">All Priorities</option>
            {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
          </Select>
        </div>
      </div>

      {view === "calendar" ? (
        <div className="card">
          {/* Month Nav */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <button
              onClick={() => setCurrentMonth((m) => subMonths(m, 1))}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600"
            >
              <ChevronLeft size={18} />
            </button>
            <h2 className="font-semibold text-slate-900">
              {format(currentMonth, "MMMM yyyy")}
            </h2>
            <button
              onClick={() => setCurrentMonth((m) => addMonths(m, 1))}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 border-b border-slate-100">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} className="py-2 text-center text-xs font-semibold text-slate-400">
                {d}
              </div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7">
            {Array.from({ length: startPadding }).map((_, i) => (
              <div key={`pad-${i}`} className="min-h-[80px] border-b border-r border-slate-100 bg-slate-50/50" />
            ))}
            {days.map((day) => {
              const key = format(day, "yyyy-MM-dd");
              const dayItems = itemsByDate[key] ?? [];
              const today_ = isToday(day);

              return (
                <div
                  key={key}
                  className={cn(
                    "min-h-[80px] border-b border-r border-slate-100 p-1.5",
                    !isSameMonth(day, currentMonth) && "bg-slate-50"
                  )}
                >
                  <div
                    className={cn(
                      "w-6 h-6 rounded-full text-xs font-medium flex items-center justify-center mb-1",
                      today_ && "bg-blue-600 text-white",
                      !today_ && "text-slate-600"
                    )}
                  >
                    {format(day, "d")}
                  </div>
                  <div className="space-y-0.5">
                    {dayItems.slice(0, 2).map((ci) => (
                      <Link
                        key={ci.id}
                        href={`/compliance/${ci.id}`}
                        className={cn(
                          "block text-[10px] font-medium px-1.5 py-0.5 rounded truncate leading-tight",
                          isOverdue(ci)
                            ? "bg-red-100 text-red-700"
                            : isDueSoon(ci, 7)
                            ? "bg-amber-100 text-amber-700"
                            : "bg-blue-50 text-blue-700"
                        )}
                        title={ci.title}
                      >
                        {ci.title}
                      </Link>
                    ))}
                    {dayItems.length > 2 && (
                      <div className="text-[10px] text-slate-400 px-1">
                        +{dayItems.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* List View */
        <div>
          {sorted.length === 0 ? (
            <EmptyState
              icon={Calendar}
              title="No compliance items match your filters."
              description="Adjust filters above to see upcoming deadlines."
            />
          ) : (
            (() => {
              // Group by month
              const groups: Record<string, typeof sorted> = {};
              sorted.forEach((ci) => {
                const key = format(parseISO(ci.due_date!), "MMMM yyyy");
                if (!groups[key]) groups[key] = [];
                groups[key].push(ci);
              });

              return (
                <div className="space-y-4">
                  {Object.entries(groups).map(([month, items]) => (
                    <div key={month} className="card overflow-hidden">
                      <div className="px-4 py-3 bg-slate-50 border-b border-slate-100">
                        <h3 className="text-sm font-semibold text-slate-700">{month}</h3>
                      </div>
                      <div className="divide-y divide-slate-50">
                        {items.map((ci) => {
                          const effStatus = computedStatus(ci);
                          const overdue = isOverdue(ci);
                          const biz = bizMap[ci.business_id];

                          return (
                            <Link
                              key={ci.id}
                              href={`/compliance/${ci.id}`}
                              className="flex items-center gap-4 px-4 py-3 hover:bg-slate-50 transition-colors group"
                            >
                              <div
                                className={cn(
                                  "w-12 text-center flex-shrink-0",
                                )}
                              >
                                <div
                                  className={cn(
                                    "text-lg font-bold leading-tight",
                                    overdue ? "text-red-600" : "text-slate-900"
                                  )}
                                >
                                  {format(parseISO(ci.due_date!), "d")}
                                </div>
                                <div className="text-[10px] text-slate-400">
                                  {format(parseISO(ci.due_date!), "EEE")}
                                </div>
                              </div>

                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-900 group-hover:text-blue-700 truncate">
                                  {ci.title}
                                </p>
                                <p className="text-xs text-slate-400 mt-0.5">
                                  {biz?.name ?? "—"} · {ci.category}
                                </p>
                              </div>

                              <div className="flex items-center gap-2 flex-shrink-0">
                                <PriorityBadge priority={ci.priority} />
                                <StatusBadge status={effStatus} />
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()
          )}
        </div>
      )}
    </div>
  );
}
