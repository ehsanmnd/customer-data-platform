import React, { useState, useMemo } from 'react';
import { Customer } from '../types';
import { AlertCircle, TrendingDown, ShieldAlert, Filter } from 'lucide-react';
import { toPersianNumber } from '../lib/utils';

interface Props {
  customers: Customer[];
  onNavigateToProfile?: (id: string) => void;
}

export default function ChurnView({ customers, onNavigateToProfile }: Props) {
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');

  const industries = useMemo(() => {
    const list = new Set(customers.map(c => c.industry));
    return Array.from(list);
  }, [customers]);

  // Sort customers by churn probability
  const sortedByRisk = useMemo(() => {
    let filtered = [...customers];
    if (selectedIndustry !== 'all') {
      filtered = filtered.filter(c => c.industry === selectedIndustry);
    }
    return filtered.sort((a, b) => b.churnProbability - a.churnProbability);
  }, [customers, selectedIndustry]);

  const highRiskCount = sortedByRisk.filter(c => c.churnProbability > 0.6).length;
  const urgentCount = sortedByRisk.filter(c => c.churnProbability > 0.8).length;
  const riskClv = sortedByRisk.filter(c => c.churnProbability > 0.6).reduce((sum, c) => sum + c.clv, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-white">پیش‌بینی ریزش مشتریان (Churn Prediction)</h2>
          <p className="text-xs text-slate-500 mt-1">مدیریت و اقدام برای مشتریان در معرض خطر ترک</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#111114] p-6 rounded-2xl border border-white/5 flex items-center gap-4">
          <div className="p-3 bg-rose-500/10 text-rose-400 rounded-xl">
            <ShieldAlert size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">مشتریان پر ریسک</p>
            <p className="text-2xl font-bold text-white">{toPersianNumber(highRiskCount)} <span className="text-[10px] font-normal text-slate-500">مشتری</span></p>
          </div>
        </div>
        <div className="bg-[#111114] p-6 rounded-2xl border border-white/5 flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl">
            <AlertCircle size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">نیاز به تماس فوری</p>
            <p className="text-2xl font-bold text-white">{toPersianNumber(urgentCount)} <span className="text-[10px] font-normal text-slate-500">مورد ثبت شده</span></p>
          </div>
        </div>
        <div className="bg-[#111114] p-6 rounded-2xl border border-white/5 flex items-center gap-4">
          <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">
            <TrendingDown size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">ارزش در معرض خطر (CLV)</p>
            <p className="text-2xl font-bold text-white">{toPersianNumber(riskClv / 1000000000, { maximumFractionDigits: 1 })} <span className="text-[10px] font-normal text-slate-500">میلیارد تومان</span></p>
          </div>
        </div>
      </div>

      <div className="bg-[#111114] rounded-2xl border border-white/5 overflow-hidden flex flex-col">
        <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-lg font-semibold text-white">لیست هشدار ریزش (مرتب‌شده بر اساس درصد خطر)</h3>

          <div className="flex items-center gap-3">
            <Filter size={16} className="text-slate-500" />
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
                <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">صنعت</th>
                <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">سگمنت فعلی</th>
                <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">احتمال ریزش مدل</th>
                <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">ارزش حیات (CLV)</th>
                <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">عملیات پیشنهادی</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {sortedByRisk.length > 0 ? sortedByRisk.map((customer) => (
                <tr 
                  key={customer.id} 
                  className="hover:bg-white/5 transition-colors cursor-pointer"
                  onClick={() => onNavigateToProfile && onNavigateToProfile(customer.id)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-white">{customer.name}</div>
                    <div className="text-[10px] text-slate-500">آخرین تماس: <span dir="rtl">{new Date(customer.lastInteraction).toLocaleDateString('fa-IR')}</span></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">{customer.industry}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-[10px] leading-5 font-semibold rounded-lg border
                        ${['در آستانه ریزش', 'پرریسک', 'از دست رفته'].includes(customer.segment) ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-white/5 text-slate-400 border-white/10'}
                      `}>
                        {customer.segment}
                      </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-24 bg-white/10 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${customer.churnProbability > 0.7 ? 'bg-rose-500' : customer.churnProbability > 0.4 ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                          style={{ width: `${customer.churnProbability * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-[10px] font-mono text-white w-8">
                        {toPersianNumber(Math.round(customer.churnProbability * 100))}٪
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">{toPersianNumber(customer.clv / 10000000)} <span className="text-[10px]">میلیون تومان</span></td>
                  <td className="px-6 py-4 whitespace-nowrap text-[10px] font-bold">
                    <button className="text-indigo-400 hover:text-indigo-300 ml-4 transition-colors" onClick={(e) => e.stopPropagation()}>ثبت تیکت پیگیری</button>
                    <button 
                      className="text-slate-500 hover:text-white transition-colors" 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        if(onNavigateToProfile) onNavigateToProfile(customer.id);
                      }}
                    >جزئیات</button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500 text-sm">
                    هیچ مشتری با این فیلتر یافت نشد.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

