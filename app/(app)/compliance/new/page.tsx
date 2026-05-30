"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useStore } from "@/lib/store";
import { ComplianceForm } from "@/components/compliance/compliance-form";

export default function NewComplianceItemPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultBiz = searchParams.get("business") ?? undefined;

  const { state, addComplianceItem } = useStore();

  const handleSubmit = (data: Parameters<typeof addComplianceItem>[0]) => {
    const item = addComplianceItem(data);
    router.push(`/compliance/${item.id}`);
  };

  return (
    <div className="max-w-3xl space-y-6">
      <Link
        href="/compliance"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700"
      >
        <ArrowLeft size={14} />
        Back to compliance items
      </Link>

      <div>
        <h1 className="page-title">Add Compliance Item</h1>
        <p className="text-sm text-slate-500 mt-1">
          Add a new permit, license, insurance, filing, or deadline to track.
        </p>
      </div>

      <div className="card">
        <ComplianceForm
          businesses={state.businesses}
          defaultBusinessId={defaultBiz}
          onSubmit={handleSubmit}
          onCancel={() => router.push("/compliance")}
        />
      </div>
    </div>
  );
}
