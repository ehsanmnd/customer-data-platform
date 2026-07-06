import React, { useState, useMemo } from 'react';
import { 
  Users, 
  PieChart as PieChartIcon, 
  Activity, 
  LogOut,
  Database,
  Search,
  Bell,
  Menu,
  X,
  Info
} from 'lucide-react';
import { mockDashboardStats, mockCustomers } from './data/mockData';
import { toPersianNumber } from './lib/utils';
import SegmentationView from './views/SegmentationView';
import ChurnView from './views/ChurnView';
import ProfilingView from './views/ProfilingView';

type ViewType = 'segmentation' | 'churn' | 'profiling';

export default function App() {
  const [activeView, setActiveView] = useState<ViewType>('segmentation');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedCustomerIdForProfile, setSelectedCustomerIdForProfile] = useState<string | undefined>(undefined);
  
  const [globalDepartment, setGlobalDepartment] = useState<string>('all');
  const [globalCustomerType, setGlobalCustomerType] = useState<string>('all');

  const navigateToProfile = (id: string) => {
    setSelectedCustomerIdForProfile(id);
    setActiveView('profiling');
  };

  const filteredCustomers = useMemo(() => {
    return mockCustomers.filter(c => {
      const matchDept = globalDepartment === 'all' || c.department === globalDepartment;
      const matchType = globalDepartment !== 'فروش' || globalCustomerType === 'all' || c.customerType === globalCustomerType;
      return matchDept && matchType;
    });
  }, [globalDepartment, globalCustomerType]);

  const stats = useMemo(() => {
    if (globalDepartment === 'all') return mockDashboardStats;
    const total = filteredCustomers.length;
    const clvSum = filteredCustomers.reduce((acc, c) => acc + c.clv, 0);
    const avgClv = total > 0 ? clvSum / total : 0;
    const atRisk = filteredCustomers.filter(c => c.churnProbability > 0.4).length;
    return {
      totalCustomers: total,
      averageCLV: avgClv,
      atRiskCustomers: atRisk,
      monthlyGrowth: 2.1 // Mocked static
    };
  }, [filteredCustomers, globalDepartment]);

  return (
    <div className="min-h-screen flex bg-[#0a0a0b] text-slate-200 font-sans" dir="rtl">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 right-0 z-50 w-64 bg-[#0f0f12] text-slate-300 border-l border-white/10 transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-20 flex items-center px-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded justify-center shadow-lg shadow-indigo-500/20 text-white">
              <Database size={24} />
            </div>
            <div>
              <h1 className="text-white font-semibold text-lg tracking-tight">هوایار صنعتی</h1>
              <span className="text-[10px] text-indigo-400 font-bold tracking-widest uppercase mb-4">داشبورد تحلیلی</span>
            </div>
          </div>
          <button 
            className="mr-auto lg:hidden text-slate-400 hover:text-white"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          <button
            onClick={() => { setActiveView('segmentation'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${activeView === 'segmentation' ? 'bg-white/5 border border-white/10 text-white' : 'hover:bg-white/5 text-slate-400'}`}
          >
            <div className={`w-2 h-2 rounded-full ${activeView === 'segmentation' ? 'bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.6)]' : 'bg-transparent border border-slate-600'}`}></div>
            <span className="font-medium text-sm">بخش‌بندی مشتریان</span>
          </button>
          
          <button
            onClick={() => { setActiveView('churn'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${activeView === 'churn' ? 'bg-white/5 border border-white/10 text-white' : 'hover:bg-white/5 text-slate-400'}`}
          >
            <div className={`w-2 h-2 rounded-full ${activeView === 'churn' ? 'bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.6)]' : 'bg-transparent border border-slate-600'}`}></div>
            <span className="font-medium text-sm">پیش‌بینی ریزش</span>
          </button>

          <button
            onClick={() => { setActiveView('profiling'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${activeView === 'profiling' ? 'bg-white/5 border border-white/10 text-white' : 'hover:bg-white/5 text-slate-400'}`}
          >
            <div className={`w-2 h-2 rounded-full ${activeView === 'profiling' ? 'bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.6)]' : 'bg-transparent border border-slate-600'}`}></div>
            <span className="font-medium text-sm">پروفایل جامع مشتری</span>
          </button>
        </nav>

        <div className="absolute bottom-0 w-full p-6 border-t border-white/5">
          <div className="flex items-center gap-3 p-3 bg-indigo-500/5 rounded-xl border border-indigo-500/10">
            <div className="flex-1">
              <p className="text-[10px] text-indigo-300 mb-1">وضعیت سرویس پایتون</p>
              <p className="text-xs font-mono text-indigo-400 uppercase">Live Sync Active</p>
            </div>
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-[#0a0a0b]/80 backdrop-blur border-b border-white/5 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden text-slate-400 hover:text-slate-200"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <div className="relative hidden md:flex items-center gap-4">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="text" 
                placeholder="جستجوی مشتری، سگمنت یا شناسه..." 
                className="pl-4 pr-10 py-2 w-80 bg-white/5 border border-white/10 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              />
              <span className="text-xs px-2 py-1 bg-white/5 rounded text-indigo-300 border border-white/10 hidden xl:block">نسخه 2.4.0</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <select 
              className="bg-[#111114] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              value={globalDepartment}
              onChange={(e) => {
                setGlobalDepartment(e.target.value);
                if (e.target.value !== 'فروش') setGlobalCustomerType('all');
              }}
            >
              <option value="all">همه واحدها</option>
              <option value="فروش">واحد فروش</option>
              <option value="خدمات پس از فروش">خدمات پس از فروش</option>
            </select>

            {globalDepartment === 'فروش' && (
              <select 
                className="bg-[#111114] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                value={globalCustomerType}
                onChange={(e) => setGlobalCustomerType(e.target.value)}
              >
                <option value="all">همه مشتریان فروش</option>
                <option value="پروژه‌ای">مشتریان پروژه‌ای</option>
                <option value="غیر پروژه‌ای">مشتریان غیرپروژه‌ای (تجهیزات)</option>
              </select>
            )}

            <div className="text-left hidden sm:block mr-4">
              <p className="text-xs font-bold text-white">ادمین هوایار</p>
              <p className="text-[10px] text-slate-500">واحد هوش تجاری</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-slate-700 to-slate-800 border border-white/10 relative">
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full border-2 border-[#0a0a0b]"></span>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-auto p-6">
          
          {/* Quick Stats (Always visible) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-[#111114] border border-white/5 p-5 rounded-2xl flex flex-col justify-between relative">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-slate-500">کل مشتریان B2B</p>
                <button type="button" className="group relative focus:outline-none">
                  <Info size={14} className="text-slate-600 cursor-help transition-colors group-hover:text-slate-300 group-focus:text-slate-300" />
                  <div className="opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2.5 bg-[#1e1e24] text-xs text-slate-300 rounded-lg shadow-xl z-50 text-center pointer-events-none border border-white/10 leading-relaxed">
                    تعداد کل مشتریان تجاری (B2B) فعال در سیستم بر اساس فیلترهای انتخابی.
                  </div>
                </button>
              </div>
              <p className="text-2xl font-bold text-white tracking-tight">{toPersianNumber(stats.totalCustomers)}</p>
            </div>
            
            <div className="bg-[#111114] border border-white/5 p-5 rounded-2xl flex flex-col justify-between relative">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-slate-500">متوسط ارزش حیات (CLV)</p>
                <button type="button" className="group relative focus:outline-none">
                  <Info size={14} className="text-slate-600 cursor-help transition-colors group-hover:text-slate-300 group-focus:text-slate-300" />
                  <div className="opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2.5 bg-[#1e1e24] text-xs text-slate-300 rounded-lg shadow-xl z-50 text-center pointer-events-none border border-white/10 leading-relaxed">
                    میانگین ارزش کل طول عمر (Customer Lifetime Value) برای مشتریان فعلی.
                  </div>
                </button>
              </div>
              <p className="text-2xl font-bold text-white tracking-tight">{toPersianNumber(stats.averageCLV / 10000000)} <span className="text-[10px] font-normal text-slate-500">میلیون تومان</span></p>
            </div>
            
            <div className="bg-[#111114] border border-white/5 p-5 rounded-2xl flex flex-col justify-between relative">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-slate-500">مشتریان در معرض ریزش</p>
                <button type="button" className="group relative focus:outline-none">
                  <Info size={14} className="text-slate-600 cursor-help transition-colors group-hover:text-slate-300 group-focus:text-slate-300" />
                  <div className="opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2.5 bg-[#1e1e24] text-xs text-slate-300 rounded-lg shadow-xl z-50 text-center pointer-events-none border border-white/10 leading-relaxed">
                    تعداد مشتریانی که احتمال ریزش (Churn) آنها بیش از ۴۰ درصد پیش‌بینی شده است.
                  </div>
                </button>
              </div>
              <p className="text-2xl font-bold text-white tracking-tight">{toPersianNumber(stats.atRiskCustomers)} <span className="text-xs text-rose-400 font-normal">مورد</span></p>
            </div>
            
            <div className="bg-[#111114] border border-white/5 p-5 rounded-2xl flex flex-col justify-between relative">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-slate-500">رشد ماهانه</p>
                <button type="button" className="group relative focus:outline-none">
                  <Info size={14} className="text-slate-600 cursor-help transition-colors group-hover:text-slate-300 group-focus:text-slate-300" />
                  <div className="opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2.5 bg-[#1e1e24] text-xs text-slate-300 rounded-lg shadow-xl z-50 text-center pointer-events-none border border-white/10 leading-relaxed">
                    درصد رشد تعداد مشتریان فعال نسبت به ماه گذشته در همین بازه زمانی.
                  </div>
                </button>
              </div>
              <p className="text-2xl font-bold text-white tracking-tight">+{toPersianNumber(stats.monthlyGrowth)}٪ <span className="text-xs text-emerald-400 font-normal">فعال</span></p>
            </div>
          </div>

          {/* Active View */}
          <div className="pb-8">
            {activeView === 'segmentation' && <SegmentationView customers={filteredCustomers} onNavigateToProfile={navigateToProfile} />}
            {activeView === 'churn' && <ChurnView customers={filteredCustomers} onNavigateToProfile={navigateToProfile} />}
            {activeView === 'profiling' && <ProfilingView customers={filteredCustomers} initialCustomerId={selectedCustomerIdForProfile} />}
          </div>

        </div>
      </main>
    </div>
  );
}
