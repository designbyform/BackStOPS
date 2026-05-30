"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { FileText, ExternalLink, Search, Upload, CheckCircle2, AlertTriangle, Clock } from "lucide-react";
import { useStore } from "@/lib/store";
import { Input, Select } from "@/components/ui/input";
import { DocStatusBadge, PriorityBadge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDate, isMissingDocument, cn } from "@/lib/utils";
import { DocumentStatus } from "@/lib/types";

const DOC_STATUS_LABELS: Record<DocumentStatus, string> = {
  missing: "Missing",
  uploaded: "On File",
  expired: "Expired",
  not_required: "Not Required",
};

export default function DocumentsPage() {
  const { state, updateComplianceItem } = useStore();
  const { complianceItems, businesses } = state;
  const bizMap = Object.fromEntries(businesses.map((b) => [b.id, b]));

  const [search, setSearch] = useState("");
  const [bizFilter, setBizFilter] = useState("all");
  const [docStatusFilter, setDocStatusFilter] = useState<string>("all");

  const docItems = useMemo(() => {
    return complianceItems.filter((ci) => {
      if (!ci.requires_document) return false;
      if (bizFilter !== "all" && ci.business_id !== bizFilter) return false;
      if (docStatusFilter !== "all" && ci.document_status !== docStatusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          ci.title.toLowerCase().includes(q) ||
          (bizMap[ci.business_id]?.name ?? "").toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [complianceItems, bizFilter, docStatusFilter, search, bizMap]);

  const sorted = useMemo(() => {
    const order: Record<DocumentStatus, number> = {
      missing: 0,
      expired: 1,
      uploaded: 2,
      not_required: 3,
    };
    return [...docItems].sort(
      (a, b) => order[a.document_status] - order[b.document_status]
    );
  }, [docItems]);

  const stats = {
    missing: docItems.filter((ci) => ci.document_status === "missing").length,
    expired: docItems.filter((ci) => ci.document_status === "expired").length,
    onFile: docItems.filter((ci) => ci.document_status === "uploaded").length,
    total: docItems.length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Documents</h1>
        <p className="text-sm text-slate-500 mt-1">
          Track certificates, permits, and required filings across all businesses.
        </p>
      </div>

      {/* Summary tiles */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Missing",
            value: stats.missing,
            color: "text-red-700",
            bg: "bg-red-50 border-red-200",
            icon: AlertTriangle,
            iconColor: "text-red-500",
          },
          {
            label: "Expired",
            value: stats.expired,
            color: "text-amber-700",
            bg: "bg-amber-50 border-amber-200",
            icon: Clock,
            iconColor: "text-amber-500",
          },
          {
            label: "On File",
            value: stats.onFile,
            color: "text-green-700",
            bg: "bg-green-50 border-green-200",
            icon: CheckCircle2,
            iconColor: "text-green-500",
          },
          {
            label: "Total Required",
            value: stats.total,
            color: "text-slate-700",
            bg: "bg-slate-50 border-slate-200",
            icon: FileText,
            iconColor: "text-slate-500",
          },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className={cn("rounded-xl border p-4", s.bg)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                    {s.label}
                  </p>
                  <p className={cn("text-3xl font-bold", s.color)}>{s.value}</p>
                </div>
                <Icon size={20} className={s.iconColor} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search documents…"
              className="pl-8"
            />
          </div>
          <Select value={bizFilter} onChange={(e) => setBizFilter(e.target.value)}>
            <option value="all">All Businesses</option>
            {businesses.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </Select>
          <Select
            value={docStatusFilter}
            onChange={(e) => setDocStatusFilter(e.target.value)}
          >
            <option value="all">All Document Statuses</option>
            <option value="missing">Missing</option>
            <option value="expired">Expired</option>
            <option value="uploaded">On File</option>
          </Select>
        </div>
      </div>

      {/* Table */}
      {sorted.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No documents found."
          description="Compliance items that require documents will appear here."
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
                  Due / Renewal
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Document Status
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">
                  Document
                </th>
                <th className="px-4 py-3 w-10" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sorted.map((ci) => {
                const biz = bizMap[ci.business_id];
                return (
                  <tr
                    key={ci.id}
                    className={cn(
                      "group hover:bg-slate-50 transition-colors",
                      ci.document_status === "missing" && "bg-red-50/30",
                      ci.document_status === "expired" && "bg-amber-50/30"
                    )}
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/compliance/${ci.id}`}
                        className="text-sm font-medium text-slate-900 group-hover:text-blue-700 hover:underline block"
                      >
                        {ci.title}
                      </Link>
                      <span className="text-xs text-slate-400">{ci.category}</span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-sm text-slate-600">{biz?.name ?? "—"}</span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="text-sm text-slate-600">
                        {formatDate(ci.renewal_date ?? ci.due_date)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <DocStatusBadge status={ci.document_status} />
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      {ci.document_url ? (
                        <a
                          href={ci.document_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700"
                        >
                          View
                          <ExternalLink size={10} />
                        </a>
                      ) : (
                        <span className="text-xs text-slate-400">No file</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/compliance/${ci.id}`}
                        className="text-xs text-blue-600 hover:text-blue-700 font-medium whitespace-nowrap"
                      >
                        {ci.document_status === "missing" || ci.document_status === "expired"
                          ? "Update"
                          : "View"}
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
        <p className="text-xs text-slate-500">
          <strong>Note:</strong> Document upload functionality will be connected to Supabase Storage in a future release.
          For now, paste a document URL or filename to track document status.
          Click any item to add a document link.
        </p>
      </div>
    </div>
  );
}
