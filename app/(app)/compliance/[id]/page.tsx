"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Edit2,
  Trash2,
  CheckCircle2,
  Copy,
  ExternalLink,
  AlertTriangle,
  Calendar,
  Building2,
  User,
  FileText,
  Bell,
  RefreshCw,
  MessageSquare,
  Plus,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import {
  StatusBadge,
  PriorityBadge,
  DocStatusBadge,
  BusinessTypeBadge,
} from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { ComplianceForm } from "@/components/compliance/compliance-form";
import { Textarea, FormField, Input } from "@/components/ui/input";
import {
  isOverdue,
  isDueSoon,
  isMissingDocument,
  formatDate,
  computedStatus,
  daysUntilDue,
} from "@/lib/utils";

function InfoRow({
  label,
  value,
  children,
}: {
  label: string;
  value?: string | null;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex gap-4 py-3 border-b border-slate-100 last:border-0">
      <dt className="w-44 flex-shrink-0 text-xs font-medium text-slate-500 uppercase tracking-wider pt-0.5">
        {label}
      </dt>
      <dd className="flex-1 text-sm text-slate-800">
        {children ?? (value || <span className="text-slate-400">—</span>)}
      </dd>
    </div>
  );
}

export default function ComplianceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const {
    state,
    updateComplianceItem,
    deleteComplianceItem,
    markComplete,
    duplicateItem,
    addActivityLog,
  } = useStore();

  const [showEdit, setShowEdit] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const [showNote, setShowNote] = useState(false);
  const [showRenewal, setShowRenewal] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [completeNotes, setCompleteNotes] = useState("");
  const [noteText, setNoteText] = useState("");
  const [newRenewalDate, setNewRenewalDate] = useState("");
  const [newDocUrl, setNewDocUrl] = useState("");

  const item = state.complianceItems.find((ci) => ci.id === id);
  const business = item
    ? state.businesses.find((b) => b.id === item.business_id)
    : null;
  const logs = state.activityLogs.filter((l) => l.compliance_item_id === id);

  if (!item) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500">Compliance item not found.</p>
        <Link href="/compliance" className="text-blue-600 text-sm mt-2 block">
          Back to compliance items
        </Link>
      </div>
    );
  }

  const effStatus = computedStatus(item);
  const overdue = isOverdue(item);
  const dueSoon = isDueSoon(item, 30);
  const days = daysUntilDue(item);
  const missingDoc = isMissingDocument(item);

  const handleMarkComplete = () => {
    markComplete(id, completeNotes);
    addActivityLog({
      business_id: item.business_id,
      compliance_item_id: id,
      user_id: state.currentUser?.id ?? "user_1",
      action: "Marked complete",
      notes: completeNotes,
    });
    setShowComplete(false);
    setCompleteNotes("");
  };

  const handleAddNote = () => {
    if (!noteText.trim()) return;
    updateComplianceItem(id, {
      notes: item.notes ? `${item.notes}\n\n[${new Date().toLocaleDateString()}] ${noteText}` : `[${new Date().toLocaleDateString()}] ${noteText}`,
    });
    addActivityLog({
      business_id: item.business_id,
      compliance_item_id: id,
      user_id: state.currentUser?.id ?? "user_1",
      action: "Note added",
      notes: noteText,
    });
    setNoteText("");
    setShowNote(false);
  };

  const handleSetRenewal = () => {
    const updates: Partial<typeof item> = {
      renewal_date: newRenewalDate || item.renewal_date,
      due_date: newRenewalDate || item.due_date,
    };
    if (newDocUrl) updates.document_url = newDocUrl;
    updateComplianceItem(id, updates);
    setShowRenewal(false);
  };

  const handleDuplicate = () => {
    const dup = duplicateItem(id);
    router.push(`/compliance/${dup.id}`);
  };

  const handleDelete = () => {
    deleteComplianceItem(id);
    router.push("/compliance");
  };

  const handleEditSave = (data: Parameters<typeof updateComplianceItem>[1]) => {
    updateComplianceItem(id, data);
    setShowEdit(false);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Back */}
      <div className="flex items-center gap-3">
        <Link
          href="/compliance"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft size={14} />
          Compliance items
        </Link>
        {business && (
          <>
            <span className="text-slate-300">/</span>
            <Link
              href={`/businesses/${business.id}`}
              className="text-sm text-slate-500 hover:text-slate-700"
            >
              {business.name}
            </Link>
          </>
        )}
      </div>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">{item.title}</h1>
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={effStatus} />
            <PriorityBadge priority={item.priority} />
            <span className="badge bg-slate-100 text-slate-600">{item.category}</span>
            <span className="badge bg-slate-100 text-slate-600">{item.frequency}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 flex-wrap justify-end">
          {item.status !== "Completed" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowComplete(true)}
            >
              <CheckCircle2 size={14} />
              Mark Complete
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={() => setShowEdit(true)}>
            <Edit2 size={14} />
            Edit
          </Button>
          <Button variant="ghost" size="sm" onClick={handleDuplicate}>
            <Copy size={14} />
            Duplicate
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDelete(true)}
            className="text-red-600 hover:bg-red-50"
          >
            <Trash2 size={14} />
          </Button>
        </div>
      </div>

      {/* Alert Banner */}
      {overdue && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-3">
          <AlertTriangle size={16} className="text-red-600" />
          <p className="text-sm text-red-800 font-medium">
            This item is {Math.abs(days ?? 0)} days overdue. Immediate action required.
          </p>
        </div>
      )}
      {dueSoon && !overdue && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-center gap-3">
          <Bell size={16} className="text-amber-600" />
          <p className="text-sm text-amber-800">
            Due in {days} day{days !== 1 ? "s" : ""} — {formatDate(item.due_date)}
          </p>
        </div>
      )}
      {missingDoc && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 flex items-center gap-3">
          <FileText size={16} className="text-orange-600" />
          <p className="text-sm text-orange-800">
            A document is required but missing for this item.
          </p>
          <button
            onClick={() => setShowRenewal(true)}
            className="ml-auto text-xs font-medium text-orange-700 underline"
          >
            Add document
          </button>
        </div>
      )}

      {/* Main content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Details */}
        <div className="lg:col-span-2 space-y-4">
          <div className="card">
            <div className="px-5 py-3 border-b border-slate-100 bg-slate-50 rounded-t-xl">
              <h2 className="text-sm font-semibold text-slate-700">Item Details</h2>
            </div>
            <dl className="px-5">
              <InfoRow label="Business">
                {business && (
                  <Link
                    href={`/businesses/${business.id}`}
                    className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <Building2 size={14} />
                    {business.name}
                  </Link>
                )}
              </InfoRow>
              <InfoRow label="Agency / Body" value={item.agency} />
              <InfoRow label="Jurisdiction" value={item.jurisdiction} />
              <InfoRow label="Assigned To" value={item.assigned_owner} />
              <InfoRow label="Frequency" value={item.frequency} />
              <InfoRow label="Reminder">
                {item.reminder_days_before} days before due
              </InfoRow>
            </dl>
          </div>

          <div className="card">
            <div className="px-5 py-3 border-b border-slate-100 bg-slate-50 rounded-t-xl">
              <h2 className="text-sm font-semibold text-slate-700">Dates</h2>
            </div>
            <dl className="px-5">
              <InfoRow label="Due Date">
                <span className={overdue ? "text-red-700 font-semibold" : ""}>
                  {formatDate(item.due_date)}
                </span>
              </InfoRow>
              <InfoRow label="Renewal Date" value={formatDate(item.renewal_date)} />
              <InfoRow
                label="Last Completed"
                value={formatDate(item.last_completed_date)}
              />
            </dl>
          </div>

          {item.requires_document && (
            <div className="card">
              <div className="px-5 py-3 border-b border-slate-100 bg-slate-50 rounded-t-xl flex items-center justify-between rounded-t-xl">
                <h2 className="text-sm font-semibold text-slate-700">Document</h2>
                <button
                  onClick={() => setShowRenewal(true)}
                  className="text-xs text-blue-600 hover:text-blue-700"
                >
                  Update
                </button>
              </div>
              <dl className="px-5">
                <InfoRow label="Doc Status">
                  <DocStatusBadge status={item.document_status} />
                </InfoRow>
                <InfoRow label="Document">
                  {item.document_url ? (
                    <a
                      href={item.document_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      View Document
                      <ExternalLink size={12} />
                    </a>
                  ) : (
                    <span className="text-slate-400">No document uploaded</span>
                  )}
                </InfoRow>
              </dl>
            </div>
          )}

          {item.notes && (
            <div className="card px-5 py-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-semibold text-slate-700">Notes</h2>
                <button
                  onClick={() => setShowNote(true)}
                  className="text-xs text-blue-600 hover:text-blue-700"
                >
                  Add note
                </button>
              </div>
              <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                {item.notes}
              </p>
            </div>
          )}

          {item.completion_notes && (
            <div className="card px-5 py-4 border-green-200 bg-green-50">
              <h2 className="text-sm font-semibold text-green-700 mb-1">
                Completion Notes
              </h2>
              <p className="text-sm text-green-800">{item.completion_notes}</p>
            </div>
          )}

          {/* Add note if no notes */}
          {!item.notes && (
            <button
              onClick={() => setShowNote(true)}
              className="w-full flex items-center gap-2 px-4 py-3 border border-dashed border-slate-300 rounded-xl text-sm text-slate-400 hover:border-blue-400 hover:text-blue-600 transition-colors"
            >
              <Plus size={14} />
              Add a note
            </button>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Quick actions */}
          <div className="card p-4">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Quick Actions</h3>
            <div className="space-y-2">
              {item.status !== "Completed" && (
                <button
                  onClick={() => setShowComplete(true)}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100 border border-green-200 transition-colors"
                >
                  <CheckCircle2 size={15} />
                  Mark Complete
                </button>
              )}
              <button
                onClick={() => setShowRenewal(true)}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors"
              >
                <RefreshCw size={15} />
                Set Next Renewal Date
              </button>
              <button
                onClick={() => setShowNote(true)}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors"
              >
                <MessageSquare size={15} />
                Add Note
              </button>
              <button
                onClick={() => setShowEdit(true)}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors"
              >
                <Edit2 size={15} />
                Edit Item
              </button>
              <button
                onClick={handleDuplicate}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors"
              >
                <Copy size={15} />
                Duplicate
              </button>
            </div>
          </div>

          {/* Activity Log */}
          {logs.length > 0 && (
            <div className="card p-4">
              <h3 className="text-sm font-semibold text-slate-700 mb-3">Activity</h3>
              <div className="space-y-3">
                {logs.slice(0, 5).map((log) => (
                  <div key={log.id} className="flex gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <User size={12} className="text-slate-500" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-700">
                        {log.action}
                      </p>
                      {log.notes && (
                        <p className="text-xs text-slate-500 mt-0.5">{log.notes}</p>
                      )}
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {new Date(log.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mark Complete Modal */}
      <Modal
        open={showComplete}
        onClose={() => setShowComplete(false)}
        title="Mark as Complete"
        size="sm"
      >
        <div className="p-6 space-y-4">
          <p className="text-sm text-slate-700">
            Mark <strong>{item.title}</strong> as completed?
          </p>
          <FormField label="Completion notes (optional)">
            <Textarea
              value={completeNotes}
              onChange={(e) => setCompleteNotes(e.target.value)}
              placeholder="What was done, reference numbers, etc."
              rows={3}
            />
          </FormField>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setShowComplete(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleMarkComplete}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle2 size={14} />
              Mark Complete
            </Button>
          </div>
        </div>
      </Modal>

      {/* Add Note Modal */}
      <Modal
        open={showNote}
        onClose={() => setShowNote(false)}
        title="Add Note"
        size="sm"
      >
        <div className="p-6 space-y-4">
          <FormField label="Note">
            <Textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Add context, follow-up actions, contacts, references…"
              rows={4}
              autoFocus
            />
          </FormField>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setShowNote(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddNote} disabled={!noteText.trim()}>
              Add Note
            </Button>
          </div>
        </div>
      </Modal>

      {/* Set Renewal Modal */}
      <Modal
        open={showRenewal}
        onClose={() => setShowRenewal(false)}
        title="Set Next Renewal / Document"
        size="sm"
      >
        <div className="p-6 space-y-4">
          <FormField label="Next Due / Renewal Date">
            <Input
              type="date"
              value={newRenewalDate}
              onChange={(e) => setNewRenewalDate(e.target.value)}
            />
          </FormField>
          <FormField label="Document URL or filename">
            <Input
              value={newDocUrl}
              onChange={(e) => setNewDocUrl(e.target.value)}
              placeholder="https://… or filename.pdf"
            />
          </FormField>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setShowRenewal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSetRenewal}>
              <RefreshCw size={14} />
              Update
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        open={showEdit}
        onClose={() => setShowEdit(false)}
        title="Edit Compliance Item"
        size="xl"
      >
        <ComplianceForm
          initialData={item}
          businesses={state.businesses}
          onSubmit={handleEditSave}
          onCancel={() => setShowEdit(false)}
        />
      </Modal>

      {/* Delete Modal */}
      <Modal
        open={showDelete}
        onClose={() => setShowDelete(false)}
        title="Delete Item"
        size="sm"
      >
        <div className="p-6">
          <p className="text-sm text-slate-700 mb-1">
            Delete <strong>{item.title}</strong>?
          </p>
          <p className="text-sm text-red-600 mb-6">This cannot be undone.</p>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setShowDelete(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
