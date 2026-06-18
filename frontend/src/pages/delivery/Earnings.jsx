import React from 'react';
import { useStore } from '../../store/useStore';
import { IndianRupee, CreditCard, Award, Calendar } from 'lucide-react';

export const Earnings = () => {
  const orders = useStore((state) => state.orders);
  
  const completedJobs = orders.filter((o) => o.status === 'Delivered');
  const todayEarnings = completedJobs.reduce((sum, o) => sum + o.deliveryFee, 0) + 160;

  // Mock past week earnings: Mon (120), Tue (240), Wed (180), Thu (310), Fri (200), Sat (420), Sun (today: todayEarnings)
  const days = [
    { name: 'Mon', val: 120 },
    { name: 'Tue', val: 240 },
    { name: 'Wed', val: 180 },
    { name: 'Thu', val: 310 },
    { name: 'Fri', val: 200 },
    { name: 'Sat', val: 420 },
    { name: 'Sun', val: todayEarnings }
  ];

  // Map values to height (max height 120px, max val 500)
  const maxVal = 500;
  const mapHeight = (val) => Math.min(120, (val / maxVal) * 120);

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
        <div>
          <h1 className="text-xl font-bold font-heading text-slate-800">Earnings Ledger</h1>
          <p className="text-xs text-slate-400">Review payout breakdowns and trip rewards.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <IndianRupee className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-450 font-semibold uppercase tracking-wider">Total Earned Today</p>
            <p className="text-2xl font-bold text-slate-800 font-heading">₹{todayEarnings}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-450 font-semibold uppercase tracking-wider">Next Payout Date</p>
            <p className="text-lg font-bold text-slate-800 font-heading">Friday, 19th June</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-450 font-semibold uppercase tracking-wider">Completed Deliveries</p>
            <p className="text-2xl font-bold text-slate-800 font-heading">{completedJobs.length + 4} Trips</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Earning Bar Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm lg:col-span-2 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-800">Weekly Earnings Profile</h3>
            <p className="text-xs text-slate-400 mb-6">Bar compilation of daily trip payouts</p>
          </div>

          {/* SVG Bar Chart */}
          <div className="w-full h-[150px] flex items-end justify-between px-6 pt-4 border-b border-slate-100">
            {days.map((day, i) => {
              const h = mapHeight(day.val);
              return (
                <div key={i} className="flex flex-col items-center gap-2 group cursor-pointer">
                  {/* Tooltip on hover */}
                  <span className="text-[9px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-all transform translate-y-1">
                    ₹{day.val}
                  </span>
                  
                  {/* Bar */}
                  <div 
                    style={{ height: `${h}px` }} 
                    className={`w-8 rounded-t-lg transition-all duration-300 ${
                      day.name === 'Sun' ? 'bg-[#10B981]' : 'bg-[#166534]/30 group-hover:bg-[#166534]/50'
                    }`}
                  ></div>
                  
                  {/* Label */}
                  <span className="text-[10px] font-bold text-slate-400 mt-1">{day.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Earning History Table */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm lg:col-span-1 space-y-4">
          <h3 className="text-base font-bold text-slate-800">Recent Payout Logs</h3>
          
          <div className="space-y-3">
            {completedJobs.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">No payouts logged yet today.</p>
            ) : (
              completedJobs.map((job) => (
                <div key={job.id} className="flex justify-between items-center p-3 bg-slate-50 border border-slate-200/50 rounded-xl">
                  <div className="space-y-0.5">
                    <h5 className="text-xs font-bold text-slate-800">{job.shopName}</h5>
                    <p className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> Today • Completed
                    </p>
                  </div>
                  <span className="font-extrabold text-sm text-emerald-600">
                    +₹{job.deliveryFee}
                  </span>
                </div>
              ))
            )}
            
            {/* Mock previous entries */}
            <div className="flex justify-between items-center p-3 bg-slate-50/70 border border-slate-200/40 rounded-xl">
              <div className="space-y-0.5">
                <h5 className="text-xs font-bold text-slate-700">Verma Fresh Fruits</h5>
                <p className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> Yesterday • Completed
                </p>
              </div>
              <span className="font-bold text-slate-600">
                +₹80
              </span>
            </div>

            <div className="flex justify-between items-center p-3 bg-slate-50/70 border border-slate-200/40 rounded-xl">
              <div className="space-y-0.5">
                <h5 className="text-xs font-bold text-slate-700">Gupta Kirana Store</h5>
                <p className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> Yesterday • Completed
                </p>
              </div>
              <span className="font-bold text-slate-600">
                +₹80
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
