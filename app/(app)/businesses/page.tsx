"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Plus, Search, Building2, ChevronRight, MapPin, Mail, Edit2, Trash2 } from "lucide-react";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BusinessTypeBadge, StatusBadge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { BusinessForm } from "@/components/businesses/business-form";
import { EmptyState } from "@/components/ui/empty-state";
import { isOverdue, isDueSoon, isMissingDocument } from "@/lib/utils";
import { Business } from "@/lib/types";

export default function BusinessesPage() {
  const { state, addBusiness, updateBusiness, deleteBusiness } = useStore();
  const [search, setSearch] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [editBiz, setEditBiz] = useState<Business | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Business | null>(null);

  const { businesses, complianceItems, currentUser } = state;

  const filtered = useMemo(
    () =>
      businesses.filter(
        (b) =>
          b.name.toLowerCase().includes(search.toLowerCase()) ||
          b.business_type.toLowerCase().includes(search.toLowerCase()) ||
          b.city.toLowerCase().includes(search.toLowerCase())
      ),
    [businesses, search]
  );

  const getBizStats = (bizId: string) => {
    const items = complianceItems.filter((ci) => ci.business_id === bizId);
    return {
      total: items.length,
      overdue: items.filter((ci) => isOverdue(ci)).length,
      dueSoon: items.filter((ci) => isDueSoon(ci, 30)).length,
      missingDocs: items.filter((ci) => isMissingDocument(ci)).length,
    };
  };

  const handleAdd = (data: Parameters<typeof addBusiness>[0]) => {
    addBusiness(data);
    setShowNew(false);
  };

  const handleEdit = (data: Parameters<typeof addBusiness>[0]) => {
    if (!editBiz) return;
    updateBusiness(editBiz.id, data);
    setEditBiz(null);
  };

  const handleDelete = () => {
    if (!confirmDelete) return;
    deleteBusiness(confirmDelete.id);
    setConfirmDelete(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Businesses</h1>
          <p className="text-sm text-slate-500 mt-1">
            {businesses.length} business{businesses.length !== 1 ? "es" : ""} under management
          </p>
        </div>
        <Button onClick={() => setShowNew(true)}>
          <Plus size={16} />
          Add Business
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search businesses…"
          className="pl-9"
        />
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Building2}
          title={search ? "No businesses match your search." : "No businesses yet."}
          description={
            search
              ? "Try a different search term."
              : "Add your first business to start tracking compliance items."
          }
          action={
            !search ? (
              <Button onClick={() => setShowNew(true)}>
                <Plus size={14} />
                Add Business
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((biz) => {
            const stats = getBizStats(biz.id);
            return (
              <div key={biz.id} className="card hover:shadow-md transition-shadow group">
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Building2 size={18} className="text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
                          {biz.name}
                        </h3>
                        <BusinessTypeBadge type={biz.business_type} />
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditBiz(biz)}
                        className="p-1.5 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => setConfirmDelete(biz)}
                        className="p-1.5 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Location */}
                  {(biz.city || biz.state) && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-3">
                      <MapPin size={12} />
                      <span>
                        {[biz.city, biz.state].filter(Boolean).join(", ")}
                      </span>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-slate-900">{stats.total}</div>
                      <div className="text-[10px] text-slate-400">Total</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-lg font-bold ${stats.overdue > 0 ? "text-red-600" : "text-slate-900"}`}>
                        {stats.overdue}
                      </div>
                      <div className="text-[10px] text-slate-400">Overdue</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-lg font-bold ${stats.dueSoon > 0 ? "text-amber-600" : "text-slate-900"}`}>
                        {stats.dueSoon}
                      </div>
                      <div className="text-[10px] text-slate-400">Due Soon</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-lg font-bold ${stats.missingDocs > 0 ? "text-orange-600" : "text-slate-900"}`}>
                        {stats.missingDocs}
                      </div>
                      <div className="text-[10px] text-slate-400">Docs</div>
                    </div>
                  </div>

                  {/* Alert badges */}
                  {(stats.overdue > 0 || stats.missingDocs > 0) && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {stats.overdue > 0 && (
                        <span className="badge bg-red-50 text-red-700 border border-red-200">
                          {stats.overdue} overdue
                        </span>
                      )}
                      {stats.missingDocs > 0 && (
                        <span className="badge bg-orange-50 text-orange-700 border border-orange-200">
                          {stats.missingDocs} missing docs
                        </span>
                      )}
                    </div>
                  )}

                  {biz.responsible_contact_name && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <Mail size={11} />
                      <span>{biz.responsible_contact_name}</span>
                    </div>
                  )}
                </div>

                <div className="border-t border-slate-100 px-4 py-3">
                  <Link
                    href={`/businesses/${biz.id}`}
                    className="flex items-center justify-between text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    <span>View compliance items</span>
                    <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* New Business Modal */}
      <Modal
        open={showNew}
        onClose={() => setShowNew(false)}
        title="Add New Business"
        size="lg"
      >
        <BusinessForm
          userId={currentUser?.id ?? "user_1"}
          onSubmit={handleAdd}
          onCancel={() => setShowNew(false)}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        open={!!editBiz}
        onClose={() => setEditBiz(null)}
        title="Edit Business"
        size="lg"
      >
        {editBiz && (
          <BusinessForm
            userId={currentUser?.id ?? "user_1"}
            initialData={editBiz}
            onSubmit={handleEdit}
            onCancel={() => setEditBiz(null)}
          />
        )}
      </Modal>

      {/* Delete Confirm */}
      <Modal
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        title="Delete Business"
        size="sm"
      >
        <div className="p-6">
          <p className="text-sm text-slate-700 mb-2">
            Are you sure you want to delete{" "}
            <strong>{confirmDelete?.name}</strong>?
          </p>
          <p className="text-sm text-red-600 mb-6">
            This will also delete all compliance items for this business. This
            action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setConfirmDelete(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete Business
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
