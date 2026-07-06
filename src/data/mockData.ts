import { Customer, DashboardStats } from '../types';

export const mockCustomers: Customer[] = [
  {
    id: "CUST-1001",
    name: "پتروشیمی مارون",
    companyName: "پتروشیمی مارون",
    contactPerson: "آقای رضایی",
    industry: "نفت و گاز",
    department: "فروش",
    customerType: "پروژه‌ای",
    lrfm: { length: 1850, recency: 12, frequency: 4, monetary: 15000000000 },
    clv: 85000000000,
    segment: "کلیدی",
    churnProbability: 0.05,
    lastInteraction: "2023-10-15T10:00:00Z"
  },
  {
    id: "CUST-1002",
    name: "فولاد خوزستان",
    companyName: "صنایع فولاد خوزستان",
    contactPerson: "مهندس احمدی",
    industry: "فولاد",
    department: "خدمات پس از فروش",
    customerType: null,
    lrfm: { length: 1200, recency: 45, frequency: 28, monetary: 8500000000 },
    clv: 42000000000,
    segment: "وفاداران",
    churnProbability: 0.12,
    lastInteraction: "2023-09-20T14:30:00Z"
  },
  {
    id: "CUST-1003",
    name: "سیمان هرمزگان",
    companyName: "سیمان هرمزگان",
    contactPerson: "خانم محمدی",
    industry: "سیمان",
    department: "فروش",
    customerType: "غیر پروژه‌ای",
    lrfm: { length: 450, recency: 180, frequency: 5, monetary: 1200000000 },
    clv: 3500000000,
    segment: "در آستانه ریزش",
    churnProbability: 0.85,
    lastInteraction: "2023-05-10T08:15:00Z"
  },
  {
    id: "CUST-1004",
    name: "داروسازی عبیدی",
    companyName: "داروسازی عبیدی",
    contactPerson: "دکتر حسینی",
    industry: "دارویی",
    department: "خدمات پس از فروش",
    customerType: null,
    lrfm: { length: 730, recency: 5, frequency: 12, monetary: 3400000000 },
    clv: 15000000000,
    segment: "در حال رشد",
    churnProbability: 0.08,
    lastInteraction: "2023-10-25T11:45:00Z"
  },
  {
    id: "CUST-1005",
    name: "مس سرچشمه",
    companyName: "صنایع ملی مس ایران",
    contactPerson: "مهندس جلالی",
    industry: "معدن",
    department: "فروش",
    customerType: "پروژه‌ای",
    lrfm: { length: 3200, recency: 90, frequency: 6, monetary: 25000000000 },
    clv: 120000000000,
    segment: "پرریسک",
    churnProbability: 0.45,
    lastInteraction: "2023-08-01T09:00:00Z"
  },
  {
    id: "CUST-1006",
    name: "ایران خودرو",
    companyName: "ایران خودرو",
    contactPerson: "آقای کاظمی",
    industry: "خودروسازی",
    department: "فروش",
    customerType: "غیر پروژه‌ای",
    lrfm: { length: 800, recency: 250, frequency: 8, monetary: 4500000000 },
    clv: 8000000000,
    segment: "از دست رفته",
    churnProbability: 0.95,
    lastInteraction: "2023-02-15T16:20:00Z"
  },
  {
    id: "CUST-1007",
    name: "ذوب آهن اصفهان",
    companyName: "ذوب آهن اصفهان",
    contactPerson: "مهندس نوری",
    industry: "فولاد",
    department: "خدمات پس از فروش",
    customerType: null,
    lrfm: { length: 1500, recency: 30, frequency: 35, monetary: 12000000000 },
    clv: 60000000000,
    segment: "قهرمانان",
    churnProbability: 0.15,
    lastInteraction: "2023-10-05T13:10:00Z"
  },
  {
    id: "CUST-1008",
    name: "مترو تهران",
    companyName: "شرکت بهره‌برداری راه‌آهن شهری",
    contactPerson: "مهندس سعیدی",
    industry: "حمل و نقل",
    department: "فروش",
    customerType: "پروژه‌ای",
    lrfm: { length: 2100, recency: 25, frequency: 3, monetary: 45000000000 },
    clv: 110000000000,
    segment: "مستعد توسعه",
    churnProbability: 0.20,
    lastInteraction: "2023-09-10T10:00:00Z"
  },
  {
    id: "CUST-1009",
    name: "سدسازی خاتم",
    companyName: "قرارگاه خاتم",
    contactPerson: "سردار باقری",
    industry: "عمران",
    department: "فروش",
    customerType: "پروژه‌ای",
    lrfm: { length: 4200, recency: 400, frequency: 5, monetary: 88000000000 },
    clv: 10000000000,
    segment: "از دست رفته",
    churnProbability: 0.99,
    lastInteraction: "2021-11-20T14:30:00Z"
  }
];

export const mockDashboardStats: DashboardStats = {
  totalCustomers: 854,
  averageCLV: 4500000000,
  atRiskCustomers: 124,
  monthlyGrowth: 3.5
};

export const segmentDistribution = [
  { name: 'قهرمانان', value: 15 },
  { name: 'وفاداران', value: 30 },
  { name: 'در حال رشد', value: 20 },
  { name: 'نیاز به توجه', value: 15 },
  { name: 'در آستانه ریزش', value: 10 },
  { name: 'از دست رفته', value: 10 },
];
