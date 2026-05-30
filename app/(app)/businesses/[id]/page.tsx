"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  MapPin,
  Mail,
  Phone,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Edit2,
  FileText,
  ChevronRight,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { StatusBadge, PriorityBadge, BusinessTypeBadge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { BusinessForm } from "@/components/businesses/business-form";
import { ComplianceForm } from "@/components/compliance/compliance-form";
import { EmptyState } from "@/components/ui/empty-state";
import { isOverdue, isDueSoon, isMissingDocument, formatDate, computedStatus } from "@/lib/utils";
import { ComplianceItem } from "@/lib/types";

export default function BusinessDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { state, updateBusiness, getItemsByBusiness, addComplianceItem } = useStore();
  const [showEdit, setShowEdit] = useState(false);
  const [showNewItem, setShowNewItem] = useState(false);

  const business = state.businesses.find((b) => b.id === id);
  const items = getItemsByBusiness(id);

  if (!business) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500">Business not found.</p>
        <Link href="/businesses" className="text-blue-600 text-sm mt-2 block">
          Back to businesses
        </Link>
      </div>
    );
  }

  const overdueItems = items.filter((ci) => isOverdue(ci));
  const dueSoonItems = items.filter((ci) => isDueSoon(ci, 30));
  const missingDocs = items.filter((ci) => isMissingDocument(ci));
  const completedItems = items.filter((ci) => ci.status === "Completed");

  const handleEditSave = (data: Parameters<typeof updateBusiness>[1]) => {
    updateBusiness(id, data);
    setShowEdit(false);
  };

  const handleAddItem = (data: Parameters<typeof addComplianceItem>[0]) => {
    addComplianceItem({ ...data, business_id: id });
    setShowNewItem(false);
  };

  const groupedItems = useMemo(() => {
    const groups: Record<string, ComplianceItem[]> = {};
    items.forEach((ci) => {
      if (!groups[ci.category]) groups[ci.category] = [];
      groups[ci.category].push(ci);
    });
    return groups;
  }, [items]);

  return (
    <div className="space-y-6">
      {/* Back */}
      <Link
        href="/businesses"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700"
      >
        <ArrowLeft size={14} />
        All businesses
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center flex-shrink-0">
            <Building2 size={24} className="text-blue-600" />
          </div>
          <div>
            <h1 className="page-title">{business.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <BusinessTypeBadge type={business.business_type} />
              {business.federal_requirements && (
                <span className="badge bg-purple-50 text-purple-700 border border-purple-200">
                  Federal Requirements
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowEdit(true)}>
            <Edit2 size={14} />
            Edit
          </Button>
          <Button size="sm" onClick={() => setShowNewItem(true)}>
            <Plus size={14} />
            Add Item
          </Button>
        </div>
      </div>

      {/* Info cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="card p-4">
          <p className="text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider">
            Location
          </p>
          {business.address || business.city ? (
            <div className="flex items-start gap-2">
              <MapPin size={14} className="text-slate-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-slate-700">
                {business.address && <div>{business.address}</div>}
                {[business.city, business.state, business.zip]
                  .filter(Boolean)
                  .join(", ")}
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-400">No address set</p>
          )}
        </div>

        <div className="card p-4">
          <p className="text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider">
            Primary Contact
          </p>
          {business.responsible_contact_name ? (
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-800">
                {business.responsible_contact_name}
              </p>
              {business.responsible_contact_email && (
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Mail size={11} />
                  {business.responsible_contact_email}
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-slate-400">No contact set</p>
          )}
        </div>

        <div className="card p-4">
          <p className="text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider">
            Compliance Summary
          </p>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900">{items.length}</div>
              <div className="text-[10px] text-slate-400">Total</div>
            </div>
            {overdueItems.length > 0 && (
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{overdueItems.length}</div>
                <div className="text-[10px] text-slate-400">Overdue</div>
              </div>
            )}
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{completedItems.length}</div>
              <div className="text-[10px] text-slate-400">Done</div>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {(overdueItems.length > 0 || missingDocs.length > 0) && (
        <div className="space-y-3">
          {overdueItems.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-3">
              <AlertTriangle size={16} className="text-red-600" />
              <p className="text-sm text-red-800">
                <strong>{overdueItems.length} overdue</strong>:{" "}
                {overdueItems
                  .slice(0, 2)
                  .map((i) => i.title)
                  .join(", ")}
                {overdueItems.length > 2 ? ` +${overdueItems.length - 2} more` : ""}
              </p>
            </div>
          )}
          {missingDocs.length > 0 && (
            <div className="bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 flex items-center gap-3">
              <FileText size={16} className="text-orange-600" />
              <p className="text-sm text-orange-800">
                <strong>{missingDocs.length} missing document{missingDocs.length !== 1 ? "s" : ""}</strong>
              </p>
            </div>
          )}
        </div>
      )}

      {/* Notes */}
      {business.notes && (
        <div className="card px-5 py-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Notes</p>
          <p className="text-sm text-slate-700 leading-relaxed">{business.notes}</p>
        </div>
      )}

      {/* Compliance Items */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">Compliance Items ({items.length})</h2>
          <Link href={`/compliance?business=${id}`} className="text-sm text-blue-600 hover:text-blue-700">
            View all
          </Link>
        </div>

        {items.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No compliance items yet."
            description="Add compliance items to start tracking deadlines and documents."
            action={
              <Button onClick={() => setShowNewItem(true)}>
                <Plus size={14} />
                Add First Item
              </Button>
            }
          />
        ) : (
          <div className="space-y-4">
            {Object.entries(groupedItems).map(([category, catItems]) => (
              <div key={category} className="card">
                <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 rounded-t-xl">
                  <h3 className="text-sm font-semibold text-slate-700">{category}</h3>
                </div>
                <div className="divide-y divide-slate-50">
                  {catItems.map((item) => {
                    const effStatus = computedStatus(item);
                    return (
                      <Link
                        key={item.id}
                        href={`/compliance/${item.id}`}
                        className="flex items-center gap-4 px-4 py-3 hover:bg-slate-50 transition-colors group"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 group-hover:text-blue-700 truncate">
                            {item.title}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-slate-400">
                              {item.due_date ? `Due ${formatDate(item.due_date)}` : "No due date"}
                            </span>
                            {item.agency && (
                              <span className="text-xs text-slate-300">·</span>
                            )}
                            {item.agency && (
                              <span className="text-xs text-slate-400">{item.agency}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <PriorityBadge priority={item.priority} />
                          <StatusBadge status={effStatus} />
                        </div>
                        <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-400" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <Modal
        open={showEdit}
        onClose={() => setShowEdit(false)}
        title="Edit Business"
        size="lg"
      >
        <BusinessForm
          userId={state.currentUser?.id ?? "user_1"}
          initialData={business}
          onSubmit={handleEditSave}
          onCancel={() => setShowEdit(false)}
        />
      </Modal>

      {/* Add Item Modal */}
      <Modal
        open={showNewItem}
        onClose={() => setShowNewItem(false)}
        title="Add Compliance Item"
        size="xl"
      >
        <ComplianceForm
          businesses={state.businesses}
          defaultBusinessId={id}
          onSubmit={handleAddItem}
          onCancel={() => setShowNewItem(false)}
        />
      </Modal>
    </div>
  );
}
