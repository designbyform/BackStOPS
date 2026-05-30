"use client";

import { useState } from "react";
import { BookTemplate, CheckCircle2, ChevronDown, ChevronUp, Plus, ArrowRight } from "lucide-react";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Select, FormField } from "@/components/ui/input";
import { PriorityBadge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { MOCK_TEMPLATES } from "@/lib/mock-data";
import { generateId, today, addDaysToDate } from "@/lib/utils";
import { ComplianceItem } from "@/lib/types";

export default function TemplatesPage() {
  const { state, addComplianceItem } = useStore();
  const [expandedTemplate, setExpandedTemplate] = useState<string | null>(null);
  const [applyModal, setApplyModal] = useState<string | null>(null);
  const [selectedBiz, setSelectedBiz] = useState("");
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState<string | null>(null);

  const { businesses, currentUser } = state;

  const template = MOCK_TEMPLATES.find((t) => t.id === applyModal);

  const handleApply = () => {
    if (!selectedBiz || !template) return;
    setApplying(true);

    const todayStr = today();

    template.items.forEach((ti) => {
      const dueDate = addDaysToDate(todayStr, 90);
      const newItem: Omit<ComplianceItem, "id" | "created_at" | "updated_at"> = {
        business_id: selectedBiz,
        title: ti.title,
        category: ti.category,
        status: "Not Started",
        priority: ti.priority,
        due_date: dueDate,
        renewal_date: addDaysToDate(dueDate, 365),
        frequency: ti.frequency,
        assigned_owner:
          businesses.find((b) => b.id === selectedBiz)
            ?.responsible_contact_name ?? "",
        agency: ti.agency,
        jurisdiction: ti.jurisdiction,
        requires_document: ti.requires_document,
        document_url: "",
        document_status: ti.requires_document ? "missing" : "not_required",
        reminder_days_before: ti.default_reminder_days_before,
        last_completed_date: null,
        notes: ti.notes,
        completion_notes: "",
      };
      addComplianceItem(newItem);
    });

    setApplied(selectedBiz);
    setApplying(false);
    setApplyModal(null);
    setSelectedBiz("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Compliance Templates</h1>
        <p className="text-sm text-slate-500 mt-1">
          Pre-built compliance checklists by business type. Apply to a business to create compliance items instantly.
        </p>
      </div>

      {applied && (
        <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 flex items-center gap-3">
          <CheckCircle2 size={16} className="text-green-600" />
          <p className="text-sm text-green-800">
            Template applied successfully to{" "}
            <strong>
              {businesses.find((b) => b.id === applied)?.name}
            </strong>
            .{" "}
            <a href="/compliance" className="underline text-green-700">
              View compliance items
            </a>
          </p>
          <button
            onClick={() => setApplied(null)}
            className="ml-auto text-green-600 hover:text-green-800 text-xs"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="grid gap-4">
        {MOCK_TEMPLATES.map((tmpl) => {
          const expanded = expandedTemplate === tmpl.id;
          const bizOfType = businesses.filter(
            (b) => b.business_type === tmpl.business_type
          );

          return (
            <div key={tmpl.id} className="card">
              <div
                className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-slate-50 transition-colors rounded-xl"
                onClick={() =>
                  setExpandedTemplate(expanded ? null : tmpl.id)
                }
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <BookTemplate size={18} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{tmpl.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{tmpl.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="badge bg-slate-100 text-slate-600">
                    {tmpl.items.length} items
                  </span>
                  {bizOfType.length > 0 && (
                    <span className="badge bg-blue-50 text-blue-600 border border-blue-200">
                      {bizOfType.length} matching biz
                    </span>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      setApplyModal(tmpl.id);
                    }}
                  >
                    <Plus size={13} />
                    Apply to Business
                  </Button>
                  {expanded ? (
                    <ChevronUp size={16} className="text-slate-400" />
                  ) : (
                    <ChevronDown size={16} className="text-slate-400" />
                  )}
                </div>
              </div>

              {expanded && (
                <div className="border-t border-slate-100">
                  <div className="px-5 py-3 bg-slate-50/50">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Template Items
                    </p>
                  </div>
                  <div className="divide-y divide-slate-50">
                    {tmpl.items.map((ti, idx) => (
                      <div
                        key={ti.id}
                        className="flex items-start gap-4 px-5 py-3"
                      >
                        <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-semibold flex-shrink-0 mt-0.5">
                          {idx + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900">
                            {ti.title}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            <span className="text-xs text-slate-400">
                              {ti.category}
                            </span>
                            <span className="text-slate-300 text-xs">·</span>
                            <span className="text-xs text-slate-400">
                              {ti.frequency}
                            </span>
                            {ti.agency && (
                              <>
                                <span className="text-slate-300 text-xs">·</span>
                                <span className="text-xs text-slate-400">
                                  {ti.agency}
                                </span>
                              </>
                            )}
                            {ti.requires_document && (
                              <span className="badge bg-orange-50 text-orange-600 text-[10px]">
                                Doc required
                              </span>
                            )}
                          </div>
                          {ti.notes && (
                            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                              {ti.notes}
                            </p>
                          )}
                        </div>
                        <PriorityBadge priority={ti.priority} />
                      </div>
                    ))}
                  </div>
                  <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between rounded-b-xl">
                    <p className="text-xs text-slate-400">
                      Applying this template creates {tmpl.items.length} compliance items with 90-day placeholder due dates.
                    </p>
                    <Button
                      size="sm"
                      onClick={() => setApplyModal(tmpl.id)}
                    >
                      Apply to Business
                      <ArrowRight size={13} />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Apply Modal */}
      <Modal
        open={!!applyModal}
        onClose={() => {
          setApplyModal(null);
          setSelectedBiz("");
        }}
        title={`Apply Template: ${template?.name ?? ""}`}
        size="sm"
      >
        <div className="p-6 space-y-4">
          <p className="text-sm text-slate-600">
            This will create <strong>{template?.items.length} compliance items</strong> for the selected business with 90-day placeholder due dates. You can edit each item after applying.
          </p>

          <FormField label="Select Business" required>
            <Select
              value={selectedBiz}
              onChange={(e) => setSelectedBiz(e.target.value)}
              required
            >
              <option value="">Choose a business…</option>
              {businesses.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.business_type})
                </option>
              ))}
            </Select>
          </FormField>

          {businesses.length === 0 && (
            <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              You need to add a business first before applying a template.
            </p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="secondary"
              onClick={() => {
                setApplyModal(null);
                setSelectedBiz("");
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleApply}
              disabled={!selectedBiz}
              loading={applying}
            >
              Apply Template
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
