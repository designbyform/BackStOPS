"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useStore } from "@/lib/store";
import { BusinessForm } from "@/components/businesses/business-form";

export default function NewBusinessPage() {
  const router = useRouter();
  const { state, addBusiness } = useStore();

  const handleSubmit = (data: Parameters<typeof addBusiness>[0]) => {
    const biz = addBusiness(data);
    router.push(`/businesses/${biz.id}`);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <Link
        href="/businesses"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700"
      >
        <ArrowLeft size={14} />
        Back to businesses
      </Link>

      <div>
        <h1 className="page-title">Add New Business</h1>
        <p className="text-sm text-slate-500 mt-1">
          Add a business to start tracking compliance items.
        </p>
      </div>

      <div className="card">
        <BusinessForm
          userId={state.currentUser?.id ?? "user_1"}
          onSubmit={handleSubmit}
          onCancel={() => router.push("/businesses")}
        />
      </div>
    </div>
  );
}
