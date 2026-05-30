"use client";

import { useState } from "react";
import { Business, BUSINESS_TYPES } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Select, FormField, Checkbox } from "@/components/ui/input";

type FormData = Omit<Business, "id" | "created_at" | "updated_at" | "user_id">;

interface BusinessFormProps {
  initialData?: Partial<FormData>;
  userId: string;
  onSubmit: (data: Omit<Business, "id" | "created_at" | "updated_at">) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const defaults: FormData = {
  name: "",
  business_type: "Restaurant",
  address: "",
  city: "",
  county: "",
  state: "",
  zip: "",
  federal_requirements: false,
  responsible_contact_name: "",
  responsible_contact_email: "",
  notes: "",
};

export function BusinessForm({
  initialData,
  userId,
  onSubmit,
  onCancel,
  isLoading,
}: BusinessFormProps) {
  const [form, setForm] = useState<FormData>({ ...defaults, ...initialData });

  const set = (field: keyof FormData, value: unknown) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...form, user_id: userId });
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Business Name" required>
          <Input
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="e.g. Light Sleeper Wine Bar"
            required
          />
        </FormField>
        <FormField label="Business Type" required>
          <Select
            value={form.business_type}
            onChange={(e) => set("business_type", e.target.value as FormData["business_type"])}
            required
          >
            {BUSINESS_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>
        </FormField>
      </div>

      <FormField label="Street Address">
        <Input
          value={form.address}
          onChange={(e) => set("address", e.target.value)}
          placeholder="1412 14th St NW"
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="City">
          <Input
            value={form.city}
            onChange={(e) => set("city", e.target.value)}
            placeholder="Washington"
          />
        </FormField>
        <FormField label="County">
          <Input
            value={form.county}
            onChange={(e) => set("county", e.target.value)}
            placeholder="District of Columbia"
          />
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="State">
          <Input
            value={form.state}
            onChange={(e) => set("state", e.target.value)}
            placeholder="DC"
          />
        </FormField>
        <FormField label="ZIP Code">
          <Input
            value={form.zip}
            onChange={(e) => set("zip", e.target.value)}
            placeholder="20005"
          />
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Primary Contact Name">
          <Input
            value={form.responsible_contact_name}
            onChange={(e) => set("responsible_contact_name", e.target.value)}
            placeholder="Sarah Chen"
          />
        </FormField>
        <FormField label="Contact Email">
          <Input
            type="email"
            value={form.responsible_contact_email}
            onChange={(e) => set("responsible_contact_email", e.target.value)}
            placeholder="sarah@business.com"
          />
        </FormField>
      </div>

      <Checkbox
        label="Has federal regulatory requirements (TTB, FDA, USDA, etc.)"
        checked={form.federal_requirements}
        onChange={(e) => set("federal_requirements", e.target.checked)}
      />

      <FormField label="Notes">
        <Textarea
          value={form.notes}
          onChange={(e) => set("notes", e.target.value)}
          placeholder="Business description, operating details, special circumstances…"
          rows={3}
        />
      </FormField>

      <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={isLoading}>
          Save Business
        </Button>
      </div>
    </form>
  );
}
