"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import {
  User,
  Business,
  ComplianceItem,
  ActivityLog,
  AppState,
} from "./types";
import {
  MOCK_USERS,
  MOCK_BUSINESSES,
  MOCK_COMPLIANCE_ITEMS,
  MOCK_ACTIVITY_LOGS,
} from "./mock-data";
import { generateId } from "./utils";
import { format } from "date-fns";

const STORAGE_KEY = "backstops_data";

interface StoreContextValue {
  state: AppState;
  isLoaded: boolean;

  // Auth
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  setCurrentUser: (user: User) => void;

  // Businesses
  addBusiness: (biz: Omit<Business, "id" | "created_at" | "updated_at">) => Business;
  updateBusiness: (id: string, updates: Partial<Business>) => void;
  deleteBusiness: (id: string) => void;
  getBusinessById: (id: string) => Business | undefined;

  // Compliance Items
  addComplianceItem: (
    item: Omit<ComplianceItem, "id" | "created_at" | "updated_at">
  ) => ComplianceItem;
  updateComplianceItem: (id: string, updates: Partial<ComplianceItem>) => void;
  deleteComplianceItem: (id: string) => void;
  getComplianceItemById: (id: string) => ComplianceItem | undefined;
  getItemsByBusiness: (businessId: string) => ComplianceItem[];
  markComplete: (id: string, notes?: string) => void;
  duplicateItem: (id: string) => ComplianceItem;

  // Activity
  addActivityLog: (
    log: Omit<ActivityLog, "id" | "created_at">
  ) => void;
  getLogsByBusiness: (businessId: string) => ActivityLog[];
}

const StoreContext = createContext<StoreContextValue | null>(null);

function loadInitialState(): AppState {
  if (typeof window === "undefined") {
    return {
      currentUser: null,
      businesses: MOCK_BUSINESSES,
      complianceItems: MOCK_COMPLIANCE_ITEMS,
      activityLogs: MOCK_ACTIVITY_LOGS,
    };
  }
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as AppState;
      return parsed;
    }
  } catch {
    // ignore parse errors
  }
  return {
    currentUser: null,
    businesses: MOCK_BUSINESSES,
    complianceItems: MOCK_COMPLIANCE_ITEMS,
    activityLogs: MOCK_ACTIVITY_LOGS,
  };
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => ({
    currentUser: null,
    businesses: MOCK_BUSINESSES,
    complianceItems: MOCK_COMPLIANCE_ITEMS,
    activityLogs: MOCK_ACTIVITY_LOGS,
  }));
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loaded = loadInitialState();
    // Always keep demo data if the stored data is empty
    setState({
      currentUser: loaded.currentUser,
      businesses:
        loaded.businesses.length > 0 ? loaded.businesses : MOCK_BUSINESSES,
      complianceItems:
        loaded.complianceItems.length > 0
          ? loaded.complianceItems
          : MOCK_COMPLIANCE_ITEMS,
      activityLogs:
        loaded.activityLogs.length > 0
          ? loaded.activityLogs
          : MOCK_ACTIVITY_LOGS,
    });
    setIsLoaded(true);
  }, []);

  const persist = useCallback((newState: AppState) => {
    setState(newState);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    } catch {
      // ignore storage errors
    }
  }, []);

  // ── Auth ────────────────────────────────────────────────────────────────

  const login = useCallback(
    async (email: string, _password: string): Promise<boolean> => {
      const found = MOCK_USERS.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );
      const user = found ?? {
        id: "user_demo",
        name: email.split("@")[0],
        email,
        role: "owner" as const,
        created_at: new Date().toISOString(),
      };
      persist({ ...state, currentUser: user });
      return true;
    },
    [state, persist]
  );

  const logout = useCallback(() => {
    persist({ ...state, currentUser: null });
  }, [state, persist]);

  const setCurrentUser = useCallback(
    (user: User) => {
      persist({ ...state, currentUser: user });
    },
    [state, persist]
  );

  // ── Businesses ──────────────────────────────────────────────────────────

  const addBusiness = useCallback(
    (biz: Omit<Business, "id" | "created_at" | "updated_at">): Business => {
      const now = new Date().toISOString();
      const newBiz: Business = {
        ...biz,
        id: `biz_${generateId()}`,
        created_at: now,
        updated_at: now,
      };
      persist({
        ...state,
        businesses: [...state.businesses, newBiz],
      });
      return newBiz;
    },
    [state, persist]
  );

  const updateBusiness = useCallback(
    (id: string, updates: Partial<Business>) => {
      persist({
        ...state,
        businesses: state.businesses.map((b) =>
          b.id === id ? { ...b, ...updates, updated_at: new Date().toISOString() } : b
        ),
      });
    },
    [state, persist]
  );

  const deleteBusiness = useCallback(
    (id: string) => {
      persist({
        ...state,
        businesses: state.businesses.filter((b) => b.id !== id),
        complianceItems: state.complianceItems.filter(
          (ci) => ci.business_id !== id
        ),
      });
    },
    [state, persist]
  );

  const getBusinessById = useCallback(
    (id: string) => state.businesses.find((b) => b.id === id),
    [state.businesses]
  );

  // ── Compliance Items ────────────────────────────────────────────────────

  const addComplianceItem = useCallback(
    (
      item: Omit<ComplianceItem, "id" | "created_at" | "updated_at">
    ): ComplianceItem => {
      const now = new Date().toISOString();
      const newItem: ComplianceItem = {
        ...item,
        id: `ci_${generateId()}`,
        created_at: now,
        updated_at: now,
      };
      persist({
        ...state,
        complianceItems: [...state.complianceItems, newItem],
      });
      return newItem;
    },
    [state, persist]
  );

  const updateComplianceItem = useCallback(
    (id: string, updates: Partial<ComplianceItem>) => {
      persist({
        ...state,
        complianceItems: state.complianceItems.map((ci) =>
          ci.id === id
            ? { ...ci, ...updates, updated_at: new Date().toISOString() }
            : ci
        ),
      });
    },
    [state, persist]
  );

  const deleteComplianceItem = useCallback(
    (id: string) => {
      persist({
        ...state,
        complianceItems: state.complianceItems.filter((ci) => ci.id !== id),
      });
    },
    [state, persist]
  );

  const getComplianceItemById = useCallback(
    (id: string) => state.complianceItems.find((ci) => ci.id === id),
    [state.complianceItems]
  );

  const getItemsByBusiness = useCallback(
    (businessId: string) =>
      state.complianceItems.filter((ci) => ci.business_id === businessId),
    [state.complianceItems]
  );

  const markComplete = useCallback(
    (id: string, notes?: string) => {
      const now = new Date().toISOString();
      const today = format(new Date(), "yyyy-MM-dd");
      persist({
        ...state,
        complianceItems: state.complianceItems.map((ci) =>
          ci.id === id
            ? {
                ...ci,
                status: "Completed" as const,
                last_completed_date: today,
                completion_notes: notes ?? ci.completion_notes,
                updated_at: now,
              }
            : ci
        ),
      });
    },
    [state, persist]
  );

  const duplicateItem = useCallback(
    (id: string): ComplianceItem => {
      const original = state.complianceItems.find((ci) => ci.id === id);
      if (!original) throw new Error("Item not found");
      const now = new Date().toISOString();
      const dup: ComplianceItem = {
        ...original,
        id: `ci_${generateId()}`,
        title: `${original.title} (Copy)`,
        status: "Not Started",
        created_at: now,
        updated_at: now,
      };
      persist({
        ...state,
        complianceItems: [...state.complianceItems, dup],
      });
      return dup;
    },
    [state, persist]
  );

  // ── Activity ────────────────────────────────────────────────────────────

  const addActivityLog = useCallback(
    (log: Omit<ActivityLog, "id" | "created_at">) => {
      const newLog: ActivityLog = {
        ...log,
        id: `log_${generateId()}`,
        created_at: new Date().toISOString(),
      };
      persist({
        ...state,
        activityLogs: [newLog, ...state.activityLogs],
      });
    },
    [state, persist]
  );

  const getLogsByBusiness = useCallback(
    (businessId: string) =>
      state.activityLogs.filter((l) => l.business_id === businessId),
    [state.activityLogs]
  );

  const value: StoreContextValue = {
    state,
    isLoaded,
    login,
    logout,
    setCurrentUser,
    addBusiness,
    updateBusiness,
    deleteBusiness,
    getBusinessById,
    addComplianceItem,
    updateComplianceItem,
    deleteComplianceItem,
    getComplianceItemById,
    getItemsByBusiness,
    markComplete,
    duplicateItem,
    addActivityLog,
    getLogsByBusiness,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
