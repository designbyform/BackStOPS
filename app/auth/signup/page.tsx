"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input, FormField } from "@/components/ui/input";

export default function SignupPage() {
  const router = useRouter();
  const { login, setCurrentUser } = useStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      setCurrentUser({
        id: `user_${Date.now()}`,
        name,
        email,
        role: "owner",
        created_at: new Date().toISOString(),
      });
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-2xl mb-4">
            <ShieldCheck size={24} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">Create your account</h1>
          <p className="text-sm text-slate-500 mt-1">
            Start tracking compliance for free
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="bg-green-50 border border-green-100 rounded-lg px-3 py-2.5 mb-5">
            <p className="text-xs text-green-700 font-medium">14-day free trial</p>
            <p className="text-xs text-green-600 mt-0.5">
              No credit card required. Full access to all features during trial.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField label="Your name" required>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Sarah Chen"
                required
              />
            </FormField>

            <FormField label="Work email" required>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sarah@yourbusiness.com"
                required
              />
            </FormField>

            <FormField label="Password" required>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                minLength={8}
                required
              />
            </FormField>

            <Button type="submit" className="w-full" loading={loading}>
              Create account
            </Button>

            <p className="text-[11px] text-slate-400 text-center leading-relaxed">
              By signing up, you acknowledge that BackStOPS helps organize
              compliance tasks and does not provide legal or regulatory advice.
            </p>
          </form>

          <div className="mt-4 pt-4 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-blue-600 hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-xs text-slate-400 hover:text-slate-600">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
