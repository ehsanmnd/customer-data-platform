import React, { useState, useEffect } from 'react';
import { Customer } from '../types';
import { UserCircle, Phone, Mail, Building2, Calendar, FileText, BadgeDollarSign, Activity, TrendingUp, AlertCircle, Target } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toPersianNumber } from '../lib/utils';

// Mock trend data generator based on customer CLV
const generateTrendData = (clv: number) => {
  const baseValue = clv / 20; // Some base for monthly representation
  const months = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];
  return months.map((month, i) => {
    // Add some random variation
    const variation = (Math.random() - 0.3) * (baseValue * 0.4);
    const value = Math.max(0, baseValue + variation + (i * baseValue * 0.05)); // slight upward trend
    return {
      month,
      value: Math.round(value / 1000000) // In millions
    };
  });
};

const generatePredictiveAnalytics = (customer: Customer | undefined) => {
  if (!customer) return null;
  const isHighValue = customer.clv > 50000000000;
  const isProject = customer.customerType === 'پروژه‌ای';
  
  const nextPurchaseProb = Math.min(98, Math.max(12, customer.lrfm.frequency * 1.5 + (isHighValue ? 20 : 0) - (customer.churnProbability * 40)));
  
  const upSellPotential = ['قهرمانان', 'مستعد توسعه', 'کلیدی'].includes(customer.segment) ? 'بسیار بالا' : 
                          ['وفاداران'].includes(customer.segment) ? 'بالا' : 
                          customer.churnProbability > 0.5 ? 'پایین' : 'متوسط';
  
  let recommendedProduct = '';
  if (['نفت و گاز', 'پتروشیمی'].includes(customer.industry)) {
    recommendedProduct = isProject ? 'پکیج‌های نیتروژن ساز' : 'قطعات یدکی کمپرسورهای فرآیندی';
  } else if (['فولاد', 'معدن'].includes(customer.industry)) {
    recommendedProduct = isProject ? 'کمپرسورهای اسکرو دور متغیر' : 'سرویس‌های اورهال سالانه';
  } else {
    recommendedProduct = isProject ? 'سیستم‌های هوای فشرده ابزار دقیق' : 'قرارداد نگهداری پیشگیرانه (PM)';
  }

  let nextBestAction = '';
  if (customer.churnProbability > 0.5) {
    nextBestAction = 'تماس فوری جهت عارضه‌یابی و ارائه خدمات ویژه برای جلوگیری از ریزش مشتری.';
  } else if (isProject) {
    if (['قهرمانان', 'کلیدی', 'مستعد توسعه'].includes(customer.segment)) {
      nextBestAction = 'تنظیم جلسه حضوری برای معرفی محصولات جدید و بررسی نیازهای پروژه‌های آتی.';
    } else {
      nextBestAction = 'ارسال رزومه پروژه‌های موفق اخیر و پیگیری تلفنی وضعیت مشتری.';
    }
  } else {
    if (['قهرمانان', 'کلیدی'].includes(customer.segment)) {
      nextBestAction = 'ارسال کاتالوگ قطعات مصرفی با پیشنهاد پیش‌خرید ۶ ماهه و تخفیف ویژه.';
    } else if (customer.lrfm.recency > 90) {
      nextBestAction = 'تماس جهت یادآوری زمان سرویس دوره‌ای و بررسی عملکرد تجهیزات فعلی.';
    } else {
      nextBestAction = 'پیگیری میزان رضایت از آخرین خرید و اطلاع‌رسانی در خصوص خدمات پس از فروش.';
    }
  }

  return {
    nextPurchaseProb: Math.round(nextPurchaseProb),
    upSellPotential,
    recommendedProduct,
    nextBestAction,
  };
};

interface Props {
  customers: Customer[];
  initialCustomerId?: string;
}

export default function ProfilingView({ customers, initialCustomerId }: Props) {
  const [selectedCustomerId, setSelectedCustomerId] = useState(initialCustomerId || (customers.length > 0 ? customers[0].id : ''));
  const selectedCustomer = customers.find(c => c.id === selectedCustomerId) || customers[0];

  // Update selected customer if initialCustomerId prop changes
  useEffect(() => {
    if (initialCustomerId && customers.find(c => c.id === initialCustomerId)) {
      setSelectedCustomerId(initialCustomerId);
    }
  }, [initialCustomerId, customers]);

  const trendData = React.useMemo(() => selectedCustomer ? generateTrendData(selectedCustomer.clv) : [], [selectedCustomer?.id]);
  const predictiveData = React.useMemo(() => generatePredictiveAnalytics(selectedCustomer), [selectedCustomer?.id]);

  if (!selectedCustomer) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-500">
        هیچ مشتری با این فیلترها یافت نشد.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white">پروفایلینگ و رفتار مشتری</h2>
          <p className="text-xs text-slate-500 mt-1">نمای ۳۶۰ درجه از حساب مشتری و تاریخچه تعاملات</p>
        </div>
        <div className="w-full md:w-72">
          <select 
            className="w-full border border-white/10 rounded-lg px-4 py-2 bg-white/5 text-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
            value={selectedCustomerId}
            onChange={(e) => setSelectedCustomerId(e.target.value)}
          >
            {customers.map(c => (
              <option key={c.id} value={c.id} className="bg-[#111114]">{c.name} - {c.companyName}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Core Profile */}
        <div className="space-y-6">
          <div className="bg-[#111114] p-6 rounded-2xl border border-white/5 relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-full h-2 
              ${['قهرمانان', 'کلیدی'].includes(selectedCustomer.segment) ? 'bg-emerald-500' : ''}
              ${['وفاداران', 'مستعد توسعه'].includes(selectedCustomer.segment) ? 'bg-blue-500' : ''}
              ${selectedCustomer.segment === 'در حال رشد' ? 'bg-indigo-500' : ''}
              ${selectedCustomer.segment === 'نیاز به توجه' ? 'bg-amber-500' : ''}
              ${['در آستانه ریزش', 'پرریسک'].includes(selectedCustomer.segment) ? 'bg-rose-500' : ''}
              ${selectedCustomer.segment === 'از دست رفته' ? 'bg-slate-600' : ''}
            `}></div>
            <div className="flex items-start gap-4">
              <div className="bg-white/5 rounded-xl p-4 border border-white/5 shrink-0">
                <Building2 size={32} className="text-slate-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{selectedCustomer.companyName}</h3>
                <p className="text-xs text-slate-500 mt-1">{selectedCustomer.industry}</p>
                <div className="mt-3 inline-flex items-center px-2.5 py-0.5 rounded-lg text-[10px] font-medium bg-white/5 border border-white/10 text-slate-300">
                  سگمنت: {selectedCustomer.segment}
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <UserCircle size={18} className="text-slate-500" />
                <span>رابط: {selectedCustomer.contactPerson}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <Phone size={18} className="text-slate-500" />
                <span>۰۲۱-۸۸۸۸XXXX</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <Mail size={18} className="text-slate-500" />
                <span dir="ltr">info@{selectedCustomer.id.toLowerCase()}.com</span>
              </div>
            </div>
          </div>

          <div className="bg-[#111114] p-6 rounded-2xl border border-white/5">
            <h4 className="font-semibold text-white mb-6 flex items-center gap-2">
              <BadgeDollarSign size={18} className="text-indigo-400"/> 
              شاخص‌های ارزشی
            </h4>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-400">ارزش کل حیات (CLV)</span>
                  <span className="font-medium text-white">{toPersianNumber(selectedCustomer.clv / 10000000)} میلیون تومان</span>
                </div>
              </div>
              <div className="pt-6 border-t border-white/5">
                <p className="text-[10px] text-slate-500 mb-3 uppercase tracking-widest text-center">امتیازات LRFM</p>
                <div className="grid grid-cols-4 gap-2 text-sm text-center">
                  <div className="bg-[#0a0a0b] border border-white/5 py-3 rounded-xl"><span className="text-slate-500 text-[10px] block mb-1">L</span><span className="text-white font-mono">{toPersianNumber(selectedCustomer.lrfm.length)}</span></div>
                  <div className="bg-[#0a0a0b] border border-white/5 py-3 rounded-xl"><span className="text-slate-500 text-[10px] block mb-1">R</span><span className="text-white font-mono">{toPersianNumber(selectedCustomer.lrfm.recency)}</span></div>
                  <div className="bg-[#0a0a0b] border border-white/5 py-3 rounded-xl"><span className="text-slate-500 text-[10px] block mb-1">F</span><span className="text-white font-mono">{toPersianNumber(selectedCustomer.lrfm.frequency)}</span></div>
                  <div className="bg-[#0a0a0b] border border-white/5 py-3 rounded-xl"><span className="text-slate-500 text-[10px] block mb-1">M</span><span className="text-white font-mono">{toPersianNumber(selectedCustomer.lrfm.monetary / 10000000)}</span></div>
                </div>
              </div>
            </div>
          </div>

          {predictiveData && (
            <div className="bg-[#111114] p-6 rounded-2xl border border-white/5">
              <h4 className="font-semibold text-white mb-6 flex items-center gap-2">
                <Target size={18} className="text-emerald-400"/> 
                پیش‌بینی رفتار مشتری
              </h4>
              <div className="space-y-5">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-400">احتمال خرید بعدی</span>
                    <span className="font-medium text-white">{toPersianNumber(predictiveData.nextPurchaseProb)}٪</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-1.5" dir="ltr">
                    <div className={`h-1.5 rounded-full float-right ${predictiveData.nextPurchaseProb > 70 ? 'bg-emerald-500' : predictiveData.nextPurchaseProb > 40 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${predictiveData.nextPurchaseProb}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-400">پتانسیل بیش‌فروشی (Up-sell)</span>
                    <span className={`font-medium ${predictiveData.upSellPotential.includes('بالا') ? 'text-emerald-400' : predictiveData.upSellPotential === 'متوسط' ? 'text-amber-400' : 'text-rose-400'}`}>{predictiveData.upSellPotential}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5">
                  <span className="text-xs text-slate-500 block mb-2">پیشنهاد محصول/خدمت بعدی (Next Best Offer):</span>
                  <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium p-3 rounded-xl text-center leading-relaxed">
                    {predictiveData.recommendedProduct}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5">
                  <span className="text-xs text-slate-500 block mb-2">پیشنهاد اقدام (Next Best Action):</span>
                  <div className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium p-3 rounded-xl leading-relaxed text-justify relative overflow-hidden">
                     <span className="absolute right-0 top-0 bottom-0 w-1 bg-indigo-500"></span>
                     {predictiveData.nextBestAction}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Interaction History & Insights */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#111114] p-6 rounded-2xl border border-white/5">
            <h4 className="font-semibold text-white mb-6 flex items-center gap-2">
              <TrendingUp size={18} className="text-indigo-400"/> 
              روند ارزش خرید (۱۲ ماه گذشته)
            </h4>
            <div className="h-64 mt-4 w-full" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                  <XAxis 
                    dataKey="month" 
                    stroke="#94a3b8" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    padding={{ left: 20, right: 20 }}
                  />
                  <YAxis 
                    stroke="#94a3b8" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(value) => `${value}M`}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px' }}
                    itemStyle={{ color: '#818cf8', fontFamily: 'Vazirmatn' }}
                    labelStyle={{ color: '#cbd5e1', marginBottom: '4px', fontFamily: 'Vazirmatn' }}
                    formatter={(value) => [`${toPersianNumber(value as number)} میلیون تومان`, 'ارزش خرید']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#818cf8" 
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#818cf8', strokeWidth: 0 }}
                    activeDot={{ r: 6, fill: '#6366f1', stroke: '#fff', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#111114] p-6 rounded-2xl border border-white/5">
              <h4 className="font-semibold text-white mb-6 flex items-center gap-2">
                <Activity size={18} className="text-indigo-400"/> 
                بینش هوشمند (AI Insights)
              </h4>
              <div className="p-5 bg-indigo-600/5 rounded-xl border border-indigo-500/10">
                <p className="text-sm text-indigo-100/70 leading-relaxed text-justify">
                  بر اساس الگوی خرید گذشته، این مشتری در حال تغییر چرخه تعمیراتی تجهیزات خود می‌باشد. با توجه به گذشت {toPersianNumber(selectedCustomer.lrfm.recency)} روز از آخرین خرید، 
                  احتمال نیاز به قطعات مصرفی کمپرسورهای سری X بسیار بالاست. همچنین با توجه به سطح CLV، پیشنهاد می‌شود استراتژی "تماس مستقیم مهندسی فروش" در دستور کار قرار گیرد.
                </p>
              </div>
              {selectedCustomer.churnProbability > 0.4 && (
                 <div className="mt-4 p-5 bg-rose-500/10 rounded-xl border border-rose-500/20">
                   <p className="text-sm text-rose-300 flex items-center gap-2">
                     <AlertCircle size={16}/>
                     <span>هشدار: ریسک ترک مشتری بالا ارزیابی شده است ({toPersianNumber(Math.round(selectedCustomer.churnProbability * 100))}٪). لطفاً در اسرع وقت پیگیری کنید.</span>
                   </p>
                 </div>
              )}
            </div>

            <div className="bg-[#111114] p-6 rounded-2xl border border-white/5">
              <h4 className="font-semibold text-white mb-6 flex items-center gap-2">
                <Calendar size={18} className="text-indigo-400"/> 
                تاریخچه تعاملات (CRM)
              </h4>
              
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-[1px] before:bg-white/10 pr-4 py-2">
                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group pr-8 pb-4">
                    <div className="absolute right-0 w-2.5 h-2.5 bg-indigo-500 rounded-full border-4 border-[#111114] box-content mr-[-5px]"></div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5 w-full hover:border-indigo-500/30 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-semibold text-white text-xs">ارسال پیش‌فاکتور</div>
                        <div className="text-[9px] text-slate-500 border border-white/5 px-1.5 py-0.5 rounded-md">۱۴۰۲/۰۷/۲۳</div>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">پیش فاکتور اقلام مصرفی صادر شد.</p>
                    </div>
                  </div>
                  
                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group pr-8 pb-4">
                    <div className="absolute right-0 w-2.5 h-2.5 bg-slate-500 rounded-full border-4 border-[#111114] box-content mr-[-5px]"></div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5 w-full hover:border-slate-500/30 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-semibold text-white text-xs">تماس پیگیری فنی</div>
                        <div className="text-[9px] text-slate-500 border border-white/5 px-1.5 py-0.5 rounded-md">۱۴۰۲/۰۶/۱۵</div>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">درخواست بازدید دوره‌ای.</p>
                    </div>
                  </div>

                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group pr-8">
                    <div className="absolute right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-4 border-[#111114] box-content mr-[-5px]"></div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5 w-full hover:border-emerald-500/30 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-semibold text-white text-xs">پروژه جدید</div>
                        <div className="text-[9px] text-slate-500 border border-white/5 px-1.5 py-0.5 rounded-md">۱۴۰۱/۱۱/۰۵</div>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">فاز دوم کارخانه.</p>
                    </div>
                  </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
