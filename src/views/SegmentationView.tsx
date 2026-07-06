import React, { useState, useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Customer } from '../types';
import { Filter } from 'lucide-react';
import { toPersianNumber } from '../lib/utils';

const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#9ca3af'];

interface Props {
  customers: Customer[];
  onNavigateToProfile?: (id: string) => void;
}

export default function SegmentationView({ customers, onNavigateToProfile }: Props) {
  const [selectedSegment, setSelectedSegment] = useState<string>('all');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');

  const segmentsList = useMemo(() => {
    const list = new Set(customers.map(c => c.segment));
    return Array.from(list);
  }, [customers]);

  const industries = useMemo(() => {
    const list = new Set(customers.map(c => c.industry));
    return Array.from(list);
  }, [customers]);

  const filteredCustomers = useMemo(() => {
    return customers.filter(c => {
      const matchSegment = selectedSegment === 'all' || c.segment === selectedSegment;
      const matchIndustry = selectedIndustry === 'all' || c.industry === selectedIndustry;
      return matchSegment && matchIndustry;
    });
  }, [customers, selectedSegment, selectedIndustry]);

  const segmentDistributionComputed = useMemo(() => {
    const total = customers.length;
    if (total === 0) return [];
    
    const counts: Record<string, number> = {};
    customers.forEach(c => {
      counts[c.segment] = (counts[c.segment] || 0) + 1;
    });

    return Object.entries(counts).map(([name, count]) => ({
      name,
      value: Math.round((count / total) * 100)
    }));
  }, [customers]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white">بخش‌بندی مشتریان (Segmentation)</h2>
          <p className="text-xs text-slate-500 mt-1">نمایش وضعیت توزیع مشتریان بر اساس مدل LRFM محاسباتی</p>
        </div>
        <button className="px-4 py-2 bg-indigo-600/10 text-indigo-400 border border-indigo-600/20 rounded-lg text-xs hover:bg-indigo-600/20 transition-colors">
          همگام‌سازی با سرویس پایتون
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pie Chart */}
        <div className="bg-[#111114] p-6 rounded-2xl border border-white/5 col-span-1">
          <h3 className="text-lg font-semibold text-white mb-4">توزیع بخش‌ها (سگمنت‌ها)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={segmentDistributionComputed}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {segmentDistributionComputed.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => `${toPersianNumber(value as number)}٪`}
                  contentStyle={{ textAlign: 'right', direction: 'rtl', fontFamily: 'Vazirmatn' }} 
                />
                <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontFamily: 'Vazirmatn' }}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* LRFM Table */}
        <div className="bg-[#111114] rounded-2xl border border-white/5 col-span-1 lg:col-span-2 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-lg font-semibold text-white">لیست مشتریان و پارامترهای LRFM</h3>
            
            <div className="flex items-center gap-3">
              <Filter size={16} className="text-slate-500" />
              <select 
                className="bg-[#0a0a0b] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                value={selectedSegment}
                onChange={(e) => setSelectedSegment(e.target.value)}
              >
                <option value="all">همه سگمنت‌ها</option>
                {segmentsList.map(seg => (
                  <option key={seg} value={seg}>{seg}</option>
                ))}
              </select>

              <select 
                className="bg-[#0a0a0b] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
              >
                <option value="all">همه صنایع</option>
                {industries.map(ind => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
            </div>

          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-right divide-y divide-white/5">
              <thead className="bg-[#0a0a0b]">
                <tr>
                  <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">مشتری</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">L (طول عمر)</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">R (تازگی)</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">F (تکرار)</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">M (ارزش مالی)</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">سگمنت</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredCustomers.length > 0 ? filteredCustomers.map((customer) => (
                  <tr 
                    key={customer.id} 
                    className="hover:bg-white/5 transition-colors cursor-pointer"
                    onClick={() => onNavigateToProfile && onNavigateToProfile(customer.id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-white">{customer.name}</div>
                      <div className="text-[10px] text-slate-500">{customer.industry}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">{toPersianNumber(customer.lrfm.length)} <span className="text-[10px]">روز</span></td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">{toPersianNumber(customer.lrfm.recency)} <span className="text-[10px]">روز</span></td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">{toPersianNumber(customer.lrfm.frequency)} <span className="text-[10px]">بار</span></td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">{toPersianNumber(customer.lrfm.monetary / 10000000)} <span className="text-[10px]">میلیون تومان</span></td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-lg border
                        ${['قهرمانان', 'کلیدی'].includes(customer.segment) ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : ''}
                        ${['وفاداران', 'مستعد توسعه'].includes(customer.segment) ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : ''}
                        ${customer.segment === 'در حال رشد' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : ''}
                        ${customer.segment === 'نیاز به توجه' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : ''}
                        ${['در آستانه ریزش', 'پرریسک'].includes(customer.segment) ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : ''}
                        ${customer.segment === 'از دست رفته' ? 'bg-slate-500/10 text-slate-400 border-slate-500/20' : ''}
                      `}>
                        {customer.segment}
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500 text-sm">
                      هیچ مشتری با این مشخصات یافت نشد.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
