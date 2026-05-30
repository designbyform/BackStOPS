"use client";

import { useState } from "react";
import { ComplianceItem, Business, CATEGORIES, STATUSES, PRIORITIES, FREQUENCIES, DocumentStatus } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Select, FormField, Checkbox } from "@/components/ui/input";

type FormData = Omit<ComplianceItem, "id" | "created_at" | "updated_at">;

interface ComplianceFormProps {
  initialData?: Partial<FormData>;
  businesses: Business[];
  defaultBusinessId?: string;
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const defaults: FormData = {
  business_id: "",
  title: "",
  category: "Business License",
  status: "Not Started",
  priority: "Medium",
  due_date: null,
  renewal_date: null,
  frequency: "Annual",
  assigned_owner: "",
  agency: "",
  jurisdiction: "",
  requires_document: false,
  document_url: "",
  document_status: "not_required",
  reminder_days_before: 30,
  last_completed_date: null,
  notes: "",
  completion_notes: "",
};

export function ComplianceForm({
  initialData,
  businesses,
  defaultBusinessId,
  onSubmit,
  onCancel,
  isLoading,
}: ComplianceFormProps) {
  const [form, setForm] = useState<FormData>({
    ...defaults,
    business_id: defaultBusinessId ?? "",
    ...initialData,
  });

  const set = (field: keyof FormData, value: unknown) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-5">
      {/* Row 1 */}
      <FormField label="Title" required>
        <Input
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
          placeholder="e.g. Annual Liquor License Renewal"
          required
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Business" required>
          <Select
            value={form.business_id}
            onChange={(e) => set("business_id", e.target.value)}
            required
          >
            <option value="">Select business…</option>
            {businesses.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField label="Category" required>
          <Select
            value={form.category}
            onChange={(e) => set("category", e.target.value as FormData["category"])}
            required
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </FormField>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <FormField label="Status">
          <Select
            value={form.status}
            onChange={(e) => set("status", e.target.value as FormData["status"])}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField label="Priority" required>
          <Select
            value={form.priority}
            onChange={(e) => set("priority", e.target.value as FormData["priority"])}
            required
          >
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField label="Frequency">
          <Select
            value={form.frequency}
            onChange={(e) => set("frequency", e.target.value as FormData["frequency"])}
          >
            {FREQUENCIES.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </Select>
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Due Date">
          <Input
            type="date"
            value={form.due_date ?? ""}
            onChange={(e) => set("due_date", e.target.value || null)}
          />
        </FormField>
        <FormField label="Renewal Date">
          <Input
            type="date"
            value={form.renewal_date ?? ""}
            onChange={(e) => set("renewal_date", e.target.value || null)}
          />
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Agency / Issuing Body">
          <Input
            value={form.agency}
            onChange={(e) => set("agency", e.target.value)}
            placeholder="e.g. DC ABRA"
          />
        </FormField>
        <FormField label="Jurisdiction">
          <Input
            value={form.jurisdiction}
            onChange={(e) => set("jurisdiction", e.target.value)}
            placeholder="e.g. District of Columbia"
          />
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Assigned Owner">
          <Input
            value={form.assigned_owner}
            onChange={(e) => set("assigned_owner", e.target.value)}
            placeholder="e.g. Sarah Chen"
          />
        </FormField>
        <FormField label="Reminder (days before due)">
          <Input
            type="number"
            min={0}
            value={form.reminder_days_before}
            onChange={(e) => set("reminder_days_before", parseInt(e.target.value) || 30)}
          />
        </FormField>
      </div>

      <div className="space-y-3">
        <Checkbox
          label="Requires a document (certificate, permit, etc.)"
          checked={form.requires_document}
          onChange={(e) => {
            set("requires_document", e.target.checked);
            if (!e.target.checked) {
              set("document_status", "not_required");
            } else {
              set("document_status", "missing");
            }
          }}
        />

        {form.requires_document && (
          <div className="pl-6 space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Document Status">
                <Select
                  value={form.document_status}
                  onChange={(e) => set("document_status", e.target.value as DocumentStatus)}
                >
                  <option value="missing">Missing</option>
                  <option value="uploaded">Uploaded / On File</option>
                  <option value="expired">Expired</option>
                  <option value="not_required">Not Required</option>
                </Select>
              </FormField>
              <FormField label="Document URL or Filename">
                <Input
                  value={form.document_url}
                  onChange={(e) => set("document_url", e.target.value)}
                  placeholder="https://… or filename"
                />
              </FormField>
            </div>
          </div>
        )}
      </div>

      <FormField label="Notes">
        <Textarea
          value={form.notes}
          onChange={(e) => set("notes", e.target.value)}
          placeholder="Requirements, instructions, contacts, links…"
          rows={3}
        />
      </FormField>

      {/* Footer */}
      <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={isLoading}>
          Save Item
        </Button>
      </div>
    </form>
  );
}
