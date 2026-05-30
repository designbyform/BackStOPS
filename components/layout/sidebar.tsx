"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store";
import {
  LayoutDashboard,
  Building2,
  ClipboardList,
  BookTemplate,
  CalendarDays,
  FileText,
  Settings,
  ShieldCheck,
  LogOut,
  ChevronRight,
  Users,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/businesses", label: "Businesses", icon: Building2 },
  { href: "/compliance", label: "Compliance Items", icon: ClipboardList },
  { href: "/templates", label: "Templates", icon: BookTemplate },
  { href: "/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/documents", label: "Documents", icon: FileText },
];

const ADMIN_ITEMS = [
  { href: "/admin", label: "Concierge View", icon: Users },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { state, logout } = useStore();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-40 w-60 bg-white border-r border-slate-200 flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-slate-100">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <ShieldCheck className="w-4.5 h-4.5 text-white" size={18} />
        </div>
        <div>
          <div className="text-sm font-bold text-slate-900 leading-tight">BackStOPS</div>
          <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wider leading-tight">
            Compliance
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <div className="pb-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "sidebar-link",
                  active && "active"
                )}
              >
                <Icon size={16} className="flex-shrink-0" />
                <span>{item.label}</span>
                {active && (
                  <ChevronRight size={14} className="ml-auto text-blue-400" />
                )}
              </Link>
            );
          })}
        </div>

        <div className="pt-2 border-t border-slate-100">
          <p className="px-3 pb-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Admin
          </p>
          {ADMIN_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "sidebar-link",
                  active && "active"
                )}
              >
                <Icon size={16} className="flex-shrink-0" />
                <span>{item.label}</span>
                {active && (
                  <ChevronRight size={14} className="ml-auto text-blue-400" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User */}
      <div className="px-3 py-3 border-t border-slate-100">
        <div className="flex items-center gap-3 px-3 py-2 rounded-md">
          <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-xs font-semibold text-slate-600 flex-shrink-0">
            {state.currentUser?.name?.charAt(0) ?? "U"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-slate-900 truncate">
              {state.currentUser?.name ?? "User"}
            </div>
            <div className="text-xs text-slate-400 truncate capitalize">
              {state.currentUser?.role ?? "owner"}
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            title="Sign out"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
}
