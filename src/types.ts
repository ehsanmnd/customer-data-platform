export type Segment = string;

export interface LRFM {
  length: number; // Days since first purchase
  recency: number; // Days since last purchase
  frequency: number; // Number of purchases
  monetary: number; // Total spent (in Tomans or whatever scale)
}

export type Department = 'فروش' | 'خدمات پس از فروش';
export type CustomerType = 'پروژه‌ای' | 'غیر پروژه‌ای' | null;

export interface Customer {
  id: string;
  name: string;
  companyName: string;
  contactPerson: string;
  department: Department;
  customerType: CustomerType;
  lrfm: LRFM;
  clv: number; // Customer Lifetime Value calculation
  segment: Segment;
  churnProbability: number; // 0 to 1
  lastInteraction: string;
  industry: string;
}

export interface DashboardStats {
  totalCustomers: number;
  averageCLV: number;
  atRiskCustomers: number;
  monthlyGrowth: number;
}
