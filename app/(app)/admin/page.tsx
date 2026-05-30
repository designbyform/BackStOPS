"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Users,
  AlertTriangle,
  Clock,
  FileX,
  ChevronRight,
  Bell,
  FileUp,
  CheckSquare,
  ArrowUpCircle,
  Building2,
  MessageSquare,
  Filter,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { StatusBadge, PriorityBadge, BusinessTypeBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Textarea, FormField } from "@/components/ui/input";
import {
  isOverdue,
  isDueSoon,
  isMissingDocument,
  isCriticalItem,
  formatDate,
  computedStatus,
  cn,
} from "@/lib/utils";
import { ComplianceItem } from "@/lib/types";

type ActionType = "reminder" | "request-doc" | "review" | "escalate";

const ACTION_LABELS: Record<ActionType, string> = {
  reminder: "Send Reminder",
  "request-doc": "Request Document",
  review: "Mark Reviewed",
  escalate: "Escalate",
};

const ACTION_COLORS: Record<ActionType, string> = {
  reminder: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
  "request-doc": "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100",
  review: "bg-green-50 text-green-700 border-green-200 hover:bg-green-100",
  escalate: "bg-red-50 text-red-700 border-red-200 hover:bg-red-100",
};

const ACTION_ICONS: Record<ActionType, React.ElementType> = {
  reminder: Bell,
  "request-doc": FileUp,
  review: CheckSquare,
  escalate: ArrowUpCircle,
};

function ActionButton({
  type,
  onClick,
}: {
  type: ActionType;
  onClick: () => void;
}) {
  const Icon = ACTION_ICONS[type];
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border transition-colors",
        ACTION_COLORS[type]
      )}
    >
      <Icon size={12} />
      {ACTION_LABELS[type]}
    </button>
  );
}

export default function AdminPage() {
  const { state, updateComplianceItem, addActivityLog } = useStore();
  const { complianceItems, businesses, activityLogs, currentUser } = state;

  const bizMap = Object.fromEntries(businesses.map((b) => [b.id, b]));
  const [bizFilter, setBizFilter] = useState("all");
  const [actionModal, setActionModal] = useState<{
    item: ComplianceItem;
    type: ActionType;
  } | null>(null);
  const [actionNote, setActionNote] = useState("");

  const filtered = useMemo(() => {
    if (bizFilter === "all") return complianceItems;
    return complianceItems.filter((ci) => ci.business_id === bizFilter);
  }, [complianceItems, bizFilter]);

  const overdueItems = useMemo(
    () =>
      filtered
        .filter((ci) => isOverdue(ci))
        .sort((a, b) =>
          (a.due_date ?? "").localeCompare(b.due_date ?? "")
        ),
    [filtered]
  );

  const dueSoon7 = useMemo(
    () => filtered.filter((ci) => isDueSoon(ci, 7)),
    [filtered]
  );

  const waitingOnClient = useMemo(
    () => filtered.filter((ci) => ci.status === "Waiting on Client"),
    [filtered]
  );

  const missingDocs = useMemo(
    () => filtered.filter((ci) => isMissingDocument(ci)),
    [filtered]
  );

  const criticalItems = useMemo(
    () =>
      filtered.filter(
        (ci) =>
          isCriticalItem(ci) &&
          ci.status !== "Completed" &&
          ci.status !== "Not Applicable"
      ),
    [filtered]
  );

  // Per-business summary
  const businessSummaries = useMemo(() => {
    return businesses.map((biz) => {
      const items = complianceItems.filter((ci) => ci.business_id === biz.id);
      return {
        biz,
        overdue: items.filter((ci) => isOverdue(ci)).length,
        dueSoon: items.filter((ci) => isDueSoon(ci, 7)).length,
        missingDocs: items.filter((ci) => isMissingDocument(ci)).length,
        critical: items.filter((ci) => isCriticalItem(ci) && ci.status !== "Completed").length,
        total: items.length,
      };
    });
  }, [businesses, complianceItems]);

  const handleAction = () => {
    if (!actionModal) return;
    const { item, type } = actionModal;

    const actionLabels = {
      reminder: "Reminder sent",
      "request-doc": "Document requested",
      review: "Reviewed",
      escalate: "Escalated",
    };

    if (type === "review") {
      updateComplianceItem(item.id, { status: "In Progress" });
    }

    addActivityLog({
      business_id: item.business_id,
      compliance_item_id: item.id,
      user_id: currentUser?.id ?? "user_concierge",
      action: actionLabels[type],
      notes: actionNote,
    });

    setActionModal(null);
    setActionNote("");
  };

  function ItemActionRow({
    item,
    showBiz = true,
  }: {
    item: ComplianceItem;
    showBiz?: boolean;
  }) {
    const effStatus = computedStatus(item);
    const overdue = isOverdue(item);
    const biz = bizMap[item.business_id];

    return (
      <div
        className={cn(
          "flex items-start gap-3 px-4 py-3 border-b border-slate-50 last:border-0",
          overdue && "bg-red-50/30"
        )}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href={`/compliance/${item.id}`}
              className="text-sm font-medium text-slate-900 hover:text-blue-700 hover:underline truncate"
            >
              {item.title}
            </Link>
            <StatusBadge status={effStatus} />
            <PriorityBadge priority={item.priority} />
          </div>
          {showBiz && biz && (
            <p className="text-xs text-slate-400 mt-0.5">
              {biz.name} · {item.category}
            </p>
          )}
          {item.due_date && (
            <p
              className={cn(
                "text-xs mt-0.5",
                overdue ? "text-red-600 font-medium" : "text-slate-400"
              )}
            >
              {overdue ? "Overdue · " : "Due "}
              {formatDate(item.due_date)}
            </p>
          )}
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0 flex-wrap justify-end">
          <ActionButton
            type="reminder"
            onClick={() => setActionModal({ item, type: "reminder" })}
          />
          {item.requires_document && item.document_status !== "uploaded" && (
            <ActionButton
              type="request-doc"
              onClick={() => setActionModal({ item, type: "request-doc" })}
            />
          )}
          <ActionButton
            type="review"
            onClick={() => setActionModal({ item, type: "review" })}
          />
          {overdue && item.priority === "Critical" && (
            <ActionButton
              type="escalate"
              onClick={() => setActionModal({ item, type: "escalate" })}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Users size={20} className="text-blue-600" />
            <h1 className="page-title">Concierge View</h1>
          </div>
          <p className="text-sm text-slate-500">
            Internal dashboard for compliance concierge team. Review, follow up, and escalate across all client businesses.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={bizFilter} onChange={(e) => setBizFilter(e.target.value)}>
            <option value="all">All Clients</option>
            {businesses.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {/* Client Overview */}
      <div className="card overflow-hidden">
        <div className="px-5 py-3 bg-slate-50 border-b border-slate-200">
          <h2 className="text-sm font-semibold text-slate-700">Client Overview</h2>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Business
              </th>
              <th className="text-center px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Overdue
              </th>
              <th className="text-center px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Due 7d
              </th>
              <th className="text-center px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Missing Docs
              </th>
              <th className="text-center px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Critical
              </th>
              <th className="px-4 py-2.5 w-8" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {businessSummaries.map(({ biz, overdue, dueSoon, missingDocs: md, critical }) => (
              <tr key={biz.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Building2 size={14} className="text-slate-400" />
                    <div>
                      <Link
                        href={`/businesses/${biz.id}`}
                        className="text-sm font-medium text-slate-900 group-hover:text-blue-700"
                      >
                        {biz.name}
                      </Link>
                      <BusinessTypeBadge type={biz.business_type} />
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={cn(
                      "text-sm font-semibold",
                      overdue > 0 ? "text-red-600" : "text-slate-400"
                    )}
                  >
                    {overdue}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={cn(
                      "text-sm font-semibold",
                      dueSoon > 0 ? "text-amber-600" : "text-slate-400"
                    )}
                  >
                    {dueSoon}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={cn(
                      "text-sm font-semibold",
                      md > 0 ? "text-orange-600" : "text-slate-400"
                    )}
                  >
                    {md}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={cn(
                      "text-sm font-semibold",
                      critical > 0 ? "text-red-700" : "text-slate-400"
                    )}
                  >
                    {critical}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/businesses/${biz.id}`}
                    className="text-slate-300 group-hover:text-slate-500"
                  >
                    <ChevronRight size={16} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Priority Sections */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Overdue */}
        <div className="card">
          <div className="flex items-center justify-between px-4 py-3 bg-red-50 border-b border-red-100 rounded-t-xl">
            <h2 className="text-sm font-semibold text-red-800 flex items-center gap-2">
              <AlertTriangle size={14} className="text-red-600" />
              Overdue ({overdueItems.length})
            </h2>
          </div>
          {overdueItems.length === 0 ? (
            <p className="px-4 py-8 text-sm text-slate-400 text-center">No overdue items.</p>
          ) : (
            <div>
              {overdueItems.slice(0, 8).map((item) => (
                <ItemActionRow key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* Due in 7 Days */}
        <div className="card">
          <div className="flex items-center justify-between px-4 py-3 bg-amber-50 border-b border-amber-100 rounded-t-xl">
            <h2 className="text-sm font-semibold text-amber-800 flex items-center gap-2">
              <Clock size={14} className="text-amber-600" />
              Due in 7 Days ({dueSoon7.length})
            </h2>
          </div>
          {dueSoon7.length === 0 ? (
            <p className="px-4 py-8 text-sm text-slate-400 text-center">Nothing due in 7 days.</p>
          ) : (
            <div>
              {dueSoon7.slice(0, 8).map((item) => (
                <ItemActionRow key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* Waiting on Client */}
        <div className="card">
          <div className="flex items-center justify-between px-4 py-3 bg-orange-50 border-b border-orange-100 rounded-t-xl">
            <h2 className="text-sm font-semibold text-orange-800 flex items-center gap-2">
              <MessageSquare size={14} className="text-orange-600" />
              Waiting on Client ({waitingOnClient.length})
            </h2>
          </div>
          {waitingOnClient.length === 0 ? (
            <p className="px-4 py-8 text-sm text-slate-400 text-center">No items waiting on client.</p>
          ) : (
            <div>
              {waitingOnClient.map((item) => (
                <ItemActionRow key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* Missing Documents */}
        <div className="card">
          <div className="flex items-center justify-between px-4 py-3 bg-orange-50 border-b border-orange-100 rounded-t-xl">
            <h2 className="text-sm font-semibold text-orange-800 flex items-center gap-2">
              <FileX size={14} className="text-orange-600" />
              Missing Documents ({missingDocs.length})
            </h2>
          </div>
          {missingDocs.length === 0 ? (
            <p className="px-4 py-8 text-sm text-slate-400 text-center">No missing documents.</p>
          ) : (
            <div>
              {missingDocs.slice(0, 8).map((item) => (
                <ItemActionRow key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <div className="px-5 py-3 border-b border-slate-100">
          <h2 className="text-sm font-semibold text-slate-700">Recent Concierge Activity</h2>
        </div>
        <div className="divide-y divide-slate-50">
          {activityLogs.slice(0, 10).map((log) => {
            const ci = complianceItems.find((ci) => ci.id === log.compliance_item_id);
            const biz = businesses.find((b) => b.id === log.business_id);
            return (
              <div key={log.id} className="flex items-start gap-3 px-5 py-3">
                <div className="w-7 h-7 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MessageSquare size={13} className="text-slate-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-700">
                    <span className="font-medium">{log.action}</span>
                    {ci && (
                      <>
                        {" "}—{" "}
                        <Link
                          href={`/compliance/${ci.id}`}
                          className="text-blue-600 hover:underline"
                        >
                          {ci.title}
                        </Link>
                      </>
                    )}
                  </p>
                  {log.notes && (
                    <p className="text-xs text-slate-400 mt-0.5">{log.notes}</p>
                  )}
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {biz?.name} ·{" "}
                    {new Date(log.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Modal */}
      <Modal
        open={!!actionModal}
        onClose={() => {
          setActionModal(null);
          setActionNote("");
        }}
        title={actionModal ? ACTION_LABELS[actionModal.type] : ""}
        size="sm"
      >
        {actionModal && (
          <div className="p-6 space-y-4">
            <p className="text-sm text-slate-700">
              <strong>{ACTION_LABELS[actionModal.type]}</strong> for:{" "}
              <span className="text-blue-700">{actionModal.item.title}</span>
            </p>
            <p className="text-xs text-slate-500">
              {bizMap[actionModal.item.business_id]?.name} ·{" "}
              {formatDate(actionModal.item.due_date)}
            </p>
            <FormField label="Note (optional)">
              <Textarea
                value={actionNote}
                onChange={(e) => setActionNote(e.target.value)}
                placeholder="Add context or instructions…"
                rows={3}
              />
            </FormField>
            <div className="flex justify-end gap-3">
              <Button
                variant="secondary"
                onClick={() => {
                  setActionModal(null);
                  setActionNote("");
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleAction}>
                Confirm {ACTION_LABELS[actionModal.type]}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
