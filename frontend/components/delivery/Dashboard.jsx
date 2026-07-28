import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { Truck, MapPin, IndianRupee, ShieldCheck, Clock, CheckCircle } from 'lucide-react';

export const DeliveryDashboard = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [isOnline, setIsOnline] = useState(true);
  
  const [jobs, setJobs] = useState([
    {
      id: '101',
      shopName: 'Gupta Kirana Store',
      shopAddress: 'Sector 4, Main Market, Noida',
      deliveryAddress: 'Apt 402, Block C, Green View Society, Noida',
      items: 'Basmati Rice (5kg), Tur Dal (1kg)',
      amount: 80,
      status: 'pending',
    },
    {
      id: '102',
      shopName: 'Aggarwal Sweets & Dairy',
      shopAddress: 'Block F, Sector 18, Noida',
      deliveryAddress: 'House No. 12, Gali 3, Harola, Noida',
      items: 'Fresh Milk (2L), Paneer (500g)',
      amount: 60,
      status: 'pending',
    },
  ]);

  const updateJobStatus = (id, newStatus) => {
    setJobs(jobs.map(j => j.id === id ? { ...j, status: newStatus } : j));
  };

  const activeJobs = jobs.filter(j => j.status !== 'delivered');
  const completedJobs = jobs.filter(j => j.status === 'delivered');
  const todayEarnings = completedJobs.reduce((sum, j) => sum + j.amount, 120);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Delivery Dashboard</h1>
            <p className="text-slate-500 text-sm">Welcome back, {user?.name || 'Driver'}!</p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          {/* Status Toggle */}
          <button
            onClick={() => setIsOnline(!isOnline)}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all border ${
              isOnline
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-slate-100 text-slate-500 border-slate-200'
            }`}
          >
            ● {isOnline ? 'Online & Duty' : 'Offline'}
          </button>
          
          <button
            onClick={logout}
            className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <IndianRupee className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Today's Earnings</p>
            <p className="text-xl font-bold text-slate-800">₹{todayEarnings}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Completed Deliveries</p>
            <p className="text-xl font-bold text-slate-800">{completedJobs.length + 3} Orders</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Pending Pickups</p>
            <p className="text-xl font-bold text-slate-800">{activeJobs.filter(j => j.status === 'accepted').length} Jobs</p>
          </div>
        </div>
      </div>

      {/* Main Jobs Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Jobs */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Truck className="w-5 h-5 text-purple-600" />
            Active Delivery Requests
          </h2>

          {!isOnline ? (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center">
              <p className="text-slate-500 text-sm">You are currently offline. Toggle online status to view and accept delivery orders.</p>
            </div>
          ) : activeJobs.length === 0 ? (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center">
              <p className="text-slate-500 text-sm">No new requests at the moment. We will notify you when a store lists a pickup.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeJobs.map((job) => (
                <div key={job.id} className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                        Job #{job.id}
                      </span>
                      <h3 className="font-bold text-slate-800 mt-1">{job.shopName}</h3>
                    </div>
                    <span className="text-emerald-600 font-extrabold text-lg">
                      +₹{job.amount}
                    </span>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-slate-400">PICKUP ADDRESS</p>
                        <p className="text-slate-700">{job.shopAddress}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-slate-400">DELIVERY ADDRESS</p>
                        <p className="text-slate-700">{job.deliveryAddress}</p>
                      </div>
                    </div>

                    <div className="pt-2">
                      <p className="text-xs font-semibold text-slate-400">ITEMS TO PICK UP</p>
                      <p className="text-slate-700 font-medium">{job.items}</p>
                    </div>
                  </div>

                  {/* Actions depending on state */}
                  <div className="pt-4 border-t border-slate-100 flex justify-end">
                    {job.status === 'pending' && (
                      <button
                        onClick={() => updateJobStatus(job.id, 'accepted')}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-2 rounded-xl text-sm transition-all shadow-sm shadow-emerald-600/10"
                      >
                        Accept Request
                      </button>
                    )}
                    {job.status === 'accepted' && (
                      <button
                        onClick={() => updateJobStatus(job.id, 'picked_up')}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-5 py-2 rounded-xl text-sm transition-all"
                      >
                        Confirm Picked Up
                      </button>
                    )}
                    {job.status === 'picked_up' && (
                      <button
                        onClick={() => updateJobStatus(job.id, 'delivered')}
                        className="bg-sky-600 hover:bg-sky-700 text-white font-semibold px-5 py-2 rounded-xl text-sm transition-all"
                      >
                        Confirm Delivered
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Earning History Summary */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            Today's Activity
          </h2>

          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-500 font-medium">Standard Base Pay</span>
              <span className="text-slate-800 font-bold">₹120</span>
            </div>

            {completedJobs.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">No completed orders yet today.</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {completedJobs.map((job) => (
                  <div key={job.id} className="py-3 flex justify-between items-center text-sm">
                    <div>
                      <p className="font-semibold text-slate-700">{job.shopName}</p>
                      <p className="text-xs text-slate-400">Order #{job.id} • Completed</p>
                    </div>
                    <span className="font-bold text-emerald-600">+₹{job.amount}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
