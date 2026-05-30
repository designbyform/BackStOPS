"use client";

import { useState } from "react";
import { User, Bell, CreditCard, Users, Save, Shield, CheckCircle2 } from "lucide-react";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input, FormField, Select, Textarea } from "@/components/ui/input";

const TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "subscription", label: "Subscription", icon: CreditCard },
  { id: "team", label: "Team", icon: Users },
];

export default function SettingsPage() {
  const { state, setCurrentUser } = useStore();
  const [activeTab, setActiveTab] = useState("profile");
  const [saved, setSaved] = useState(false);
  const [name, setName] = useState(state.currentUser?.name ?? "");
  const [email, setEmail] = useState(state.currentUser?.email ?? "");
  const [reminderDefault, setReminderDefault] = useState("30");
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [overdueAlert, setOverdueAlert] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);

  const handleSaveProfile = () => {
    if (state.currentUser) {
      setCurrentUser({ ...state.currentUser, name, email });
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="page-title">Settings</h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your account, notifications, and subscription.
        </p>
      </div>

      <div className="flex gap-6">
        {/* Tab nav */}
        <nav className="w-44 flex-shrink-0 space-y-0.5">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Icon size={15} />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Content */}
        <div className="flex-1">
          {activeTab === "profile" && (
            <div className="card p-6 space-y-5">
              <h2 className="text-base font-semibold text-slate-900">User Profile</h2>

              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center text-xl font-bold text-blue-700">
                  {name.charAt(0) || "U"}
                </div>
                <div>
                  <p className="font-medium text-slate-900">{name || "Your Name"}</p>
                  <p className="text-sm text-slate-500 capitalize">{state.currentUser?.role}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="Full Name">
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                  />
                </FormField>
                <FormField label="Email Address">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                  />
                </FormField>
              </div>

              <div className="flex items-center gap-3">
                <Button onClick={handleSaveProfile}>
                  <Save size={14} />
                  Save Profile
                </Button>
                {saved && (
                  <span className="flex items-center gap-1.5 text-sm text-green-700">
                    <CheckCircle2 size={14} />
                    Saved
                  </span>
                )}
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="card p-6 space-y-5">
              <h2 className="text-base font-semibold text-slate-900">Notification Preferences</h2>

              <FormField label="Default Reminder (days before due)">
                <Select
                  value={reminderDefault}
                  onChange={(e) => setReminderDefault(e.target.value)}
                  className="max-w-xs"
                >
                  <option value="7">7 days before</option>
                  <option value="14">14 days before</option>
                  <option value="30">30 days before</option>
                  <option value="45">45 days before</option>
                  <option value="60">60 days before</option>
                  <option value="90">90 days before</option>
                </Select>
              </FormField>

              <div className="space-y-3">
                {[
                  {
                    id: "email",
                    label: "Email Notifications",
                    desc: "Receive email reminders for upcoming deadlines",
                    value: emailNotifs,
                    setter: setEmailNotifs,
                  },
                  {
                    id: "overdue",
                    label: "Overdue Alerts",
                    desc: "Immediate alert when an item becomes overdue",
                    value: overdueAlert,
                    setter: setOverdueAlert,
                  },
                  {
                    id: "digest",
                    label: "Weekly Digest",
                    desc: "Weekly summary of upcoming and overdue items",
                    value: weeklyDigest,
                    setter: setWeeklyDigest,
                  },
                ].map((n) => (
                  <div
                    key={n.id}
                    className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-800">{n.label}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{n.desc}</p>
                    </div>
                    <button
                      onClick={() => n.setter(!n.value)}
                      className={`w-11 h-6 rounded-full transition-colors relative ${
                        n.value ? "bg-blue-600" : "bg-slate-200"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                          n.value ? "translate-x-5" : "translate-x-0.5"
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5">
                <p className="text-xs text-amber-700">
                  Email notifications will be activated when your Supabase backend is connected.
                </p>
              </div>

              <Button>
                <Save size={14} />
                Save Preferences
              </Button>
            </div>
          )}

          {activeTab === "subscription" && (
            <div className="card p-6 space-y-5">
              <h2 className="text-base font-semibold text-slate-900">Subscription</h2>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-blue-900">Free Trial</p>
                    <p className="text-xs text-blue-700 mt-0.5">14-day trial · Full access</p>
                  </div>
                  <span className="badge bg-blue-600 text-white">Active</span>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  {
                    name: "Basic Tracking",
                    price: "$199/mo",
                    features: ["Dashboard", "Reminders", "Templates", "Document tracking"],
                  },
                  {
                    name: "Managed Compliance",
                    price: "$399/mo",
                    features: ["Everything in Basic", "Monthly review", "Concierge follow-up"],
                    highlight: true,
                  },
                  {
                    name: "Premium Regulated Ops",
                    price: "$799/mo",
                    features: ["Everything in Managed", "Multi-location", "Priority support"],
                  },
                ].map((plan) => (
                  <div
                    key={plan.name}
                    className={`border rounded-xl p-4 ${
                      plan.highlight
                        ? "border-blue-300 bg-blue-50"
                        : "border-slate-200 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-semibold text-slate-900">{plan.name}</p>
                        <p className="text-sm text-blue-600 font-medium">{plan.price}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Select Plan
                      </Button>
                    </div>
                    <ul className="space-y-1">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-center gap-1.5 text-xs text-slate-500">
                          <CheckCircle2 size={12} className="text-green-500" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <p className="text-xs text-slate-400">
                Payment processing coming soon. Contact us to set up a subscription.
              </p>
            </div>
          )}

          {activeTab === "team" && (
            <div className="card p-6 space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-slate-900">Team Members</h2>
                <Button size="sm" variant="outline">
                  Invite Member
                </Button>
              </div>

              <div className="divide-y divide-slate-100">
                {[
                  {
                    name: state.currentUser?.name ?? "You",
                    email: state.currentUser?.email ?? "",
                    role: "Owner",
                    avatar: (state.currentUser?.name ?? "Y").charAt(0),
                  },
                  {
                    name: "Jordan Rivera",
                    email: "jordan@backstops.com",
                    role: "Concierge",
                    avatar: "J",
                  },
                ].map((member) => (
                  <div key={member.email} className="flex items-center gap-3 py-3">
                    <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center text-sm font-semibold text-slate-600 flex-shrink-0">
                      {member.avatar}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">{member.name}</p>
                      <p className="text-xs text-slate-400">{member.email}</p>
                    </div>
                    <span className="badge bg-slate-100 text-slate-600">{member.role}</span>
                  </div>
                ))}
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5">
                <p className="text-xs text-slate-500">
                  Full team management with role-based access will be available in a future update.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
        <div className="flex items-start gap-2">
          <Shield size={14} className="text-slate-400 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-slate-500 leading-relaxed">
            <strong>Disclaimer:</strong> BackStOPS helps organize compliance tasks and reminders.
            It does not provide legal, tax, or regulatory advice. Always verify requirements
            with the relevant agency or qualified professional.
          </p>
        </div>
      </div>
    </div>
  );
}
