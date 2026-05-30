export type UserRole = "owner" | "admin" | "concierge" | "team";

export type BusinessType =
  | "Restaurant"
  | "Wine Bar"
  | "Wine Importer"
  | "Wine Distributor"
  | "Specialty Retail"
  | "Food Truck"
  | "Salon"
  | "Contractor"
  | "Short-Term Rental"
  | "Other";

export type Category =
  | "Business License"
  | "Alcohol License"
  | "Health Permit"
  | "Food Handler / Safety"
  | "Insurance"
  | "Lease / Real Estate"
  | "Tax / Excise"
  | "Payroll / Employment"
  | "Corporate Filing"
  | "FDA / Federal"
  | "TTB / Alcohol Federal"
  | "State LCB / Liquor Board"
  | "Fire / Safety"
  | "Vendor Documents"
  | "Required Posting"
  | "Vehicle / Fleet"
  | "Contractor License"
  | "Other";

export type Status =
  | "Not Started"
  | "In Progress"
  | "Waiting on Agency"
  | "Waiting on Client"
  | "Due Soon"
  | "Overdue"
  | "Completed"
  | "Not Applicable";

export type Priority = "Low" | "Medium" | "High" | "Critical";

export type Frequency =
  | "One-time"
  | "Monthly"
  | "Quarterly"
  | "Semiannual"
  | "Annual"
  | "Biennial"
  | "Custom";

export type DocumentStatus = "missing" | "uploaded" | "expired" | "not_required";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  created_at: string;
}

export interface Business {
  id: string;
  user_id: string;
  name: string;
  business_type: BusinessType;
  address: string;
  city: string;
  county: string;
  state: string;
  zip: string;
  federal_requirements: boolean;
  responsible_contact_name: string;
  responsible_contact_email: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface ComplianceItem {
  id: string;
  business_id: string;
  title: string;
  category: Category;
  status: Status;
  priority: Priority;
  due_date: string | null;
  renewal_date: string | null;
  frequency: Frequency;
  assigned_owner: string;
  agency: string;
  jurisdiction: string;
  requires_document: boolean;
  document_url: string;
  document_status: DocumentStatus;
  reminder_days_before: number;
  last_completed_date: string | null;
  notes: string;
  completion_notes: string;
  created_at: string;
  updated_at: string;
}

export interface Template {
  id: string;
  name: string;
  business_type: BusinessType;
  description: string;
  items: TemplateItem[];
}

export interface TemplateItem {
  id: string;
  template_id: string;
  title: string;
  category: Category;
  priority: Priority;
  frequency: Frequency;
  agency: string;
  jurisdiction: string;
  requires_document: boolean;
  default_reminder_days_before: number;
  notes: string;
}

export interface ActivityLog {
  id: string;
  business_id: string;
  compliance_item_id: string | null;
  user_id: string;
  action: string;
  notes: string;
  created_at: string;
}

export interface AppState {
  currentUser: User | null;
  businesses: Business[];
  complianceItems: ComplianceItem[];
  activityLogs: ActivityLog[];
}

export const BUSINESS_TYPES: BusinessType[] = [
  "Restaurant",
  "Wine Bar",
  "Wine Importer",
  "Wine Distributor",
  "Specialty Retail",
  "Food Truck",
  "Salon",
  "Contractor",
  "Short-Term Rental",
  "Other",
];

export const CATEGORIES: Category[] = [
  "Business License",
  "Alcohol License",
  "Health Permit",
  "Food Handler / Safety",
  "Insurance",
  "Lease / Real Estate",
  "Tax / Excise",
  "Payroll / Employment",
  "Corporate Filing",
  "FDA / Federal",
  "TTB / Alcohol Federal",
  "State LCB / Liquor Board",
  "Fire / Safety",
  "Vendor Documents",
  "Required Posting",
  "Vehicle / Fleet",
  "Contractor License",
  "Other",
];

export const STATUSES: Status[] = [
  "Not Started",
  "In Progress",
  "Waiting on Agency",
  "Waiting on Client",
  "Due Soon",
  "Overdue",
  "Completed",
  "Not Applicable",
];

export const PRIORITIES: Priority[] = ["Low", "Medium", "High", "Critical"];

export const FREQUENCIES: Frequency[] = [
  "One-time",
  "Monthly",
  "Quarterly",
  "Semiannual",
  "Annual",
  "Biennial",
  "Custom",
];
