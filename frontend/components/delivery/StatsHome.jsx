"use client";

import React, { useEffect } from 'react';
import { useStore } from '../../store/useStore';
import API from '../../api/api';
import { Truck, MapPin, IndianRupee, Clock, ArrowRight, ShieldCheck, PlayCircle } from 'lucide-react';

export const StatsHome = ({ setActiveTab }) => {
  const orders = useStore((state) => state.orders);
  const setOrders = useStore((state) => state.setOrders);
  const storeActions = useStore();

  useEffect(() => {
    const fetchDeliveryData = async () => {
      try {
        const [availableRes, myOrdersRes] = await Promise.all([
          API.get('/orders/delivery/available').catch(() => ({ data: [] })),
          API.get('/orders/delivery/my-orders').catch(() => ({ data: [] }))
        ]);
        
        const available = Array.isArray(availableRes.data) ? availableRes.data : [];
        const myOrders = Array.isArray(myOrdersRes.data) ? myOrdersRes.data : [];
        
        const combined = [...myOrders, ...available].map(o => ({
          id: o.id || o._id,
          customerName: o.customerName || 'Customer',
          address: o.customerAddress || o.address || 'Customer Address',
          shopName: o.shopName || 'Local Shop',
          shopAddress: o.shopAddress || 'Store Location',
          items: Array.isArray(o.items) ? o.items.map(i => `${i.name} (x${i.quantity})`).join(', ') : 'Items',
          total: o.totalAmount || o.total || 0,
          deliveryFee: o.deliveryFee || 30,
          status: o.status || 'Pending',
          assigned: !!o.deliveryPartnerId
        }));

        setOrders(combined);
      } catch (err) {
        console.error('Error fetching delivery data:', err);
      }
    };
    fetchDeliveryData();
  }, [setOrders]);

  // Filter jobs
  const completedJobs = orders.filter((o) => o.status === 'Delivered');
  const activeJobs = orders.filter((o) => o.status === 'Accepted' || o.status === 'Preparing' || o.status === 'Out for Delivery');
  const availableQueue = orders.filter((o) => !o.assigned && (o.status === 'Pending' || o.status === 'Confirmed' || o.status === 'Preparing'));

  // Real Math earnings
  const completedCount = completedJobs.length;
  const todayEarnings = completedJobs.reduce((sum, o) => sum + (o.deliveryFee || 0), 0);

  // Find active tracking order
  const ongoingOrder = orders.find((o) => o.status === 'Out for Delivery' || o.status === 'Preparing' || (o.status === 'Confirmed' && o.assigned));

  const handleUpdateStatus = async (id, currentStatus) => {
    let nextStatus = '';
    if (currentStatus === 'Confirmed' || currentStatus === 'Preparing') nextStatus = 'Out for Delivery';
    else if (currentStatus === 'Out for Delivery') nextStatus = 'Delivered';

    if (nextStatus) {
      try {
        if (nextStatus === 'Out for Delivery') {
          await API.put(`/orders/${id}/pickup`);
        } else {
          await API.put(`/orders/${id}/status`, { status: 'Delivered' });
        }
        storeActions.updateOrderStatus(id, nextStatus);
      } catch (err) {
        console.error('Failed to update status:', err);
        storeActions.updateOrderStatus(id, nextStatus);
      }
    }
  };

  const handleAcceptJob = async (id) => {
    try {
      await API.put(`/orders/${id}/accept`);
      storeActions.updateOrderStatus(id, 'Preparing');
    } catch (err) {
      console.error('Failed to accept job:', err);
      storeActions.updateOrderStatus(id, 'Preparing');
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-bold font-heading text-slate-800">Delivery Dashboard</h1>
        <p className="text-slate-500 text-sm">Review your active navigation queue and check today's payouts.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <IndianRupee className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Today's Earnings</p>
            <p className="text-2xl font-bold text-slate-800 font-heading">₹{todayEarnings}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Completed Trips</p>
            <p className="text-2xl font-bold text-slate-800 font-heading">{completedCount} Trips</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Active Trips</p>
            <p className="text-2xl font-bold text-slate-800 font-heading">{activeJobs.length} Active</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ongoing Order Tracking Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm lg:col-span-2 space-y-5">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
            <h3 className="text-base font-bold text-slate-800">Ongoing Delivery</h3>
            {ongoingOrder && (
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-100">
                In Progress
              </span>
            )}
          </div>

          {!ongoingOrder ? (
            <div className="text-center py-12 flex flex-col items-center justify-center space-y-2">
              <div className="p-3 bg-slate-50 rounded-full text-slate-400">
                <Truck className="w-6 h-6" />
              </div>
              <p className="text-slate-500 font-bold text-sm">No Active Shipments</p>
              <p className="text-slate-400 text-xs">Accept a job from the queue below to start delivering.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Job Details Banner */}
              <div className="p-4 bg-slate-50 border border-slate-200/60 rounded-xl space-y-3 text-sm">
                <div className="flex justify-between items-center font-bold text-slate-800">
                  <span>Order ID: {ongoingOrder.id}</span>
                  <span className="text-emerald-600">+₹{ongoingOrder.deliveryFee}</span>
                </div>
                
                <div className="h-px bg-slate-200"></div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="block text-slate-400 font-bold uppercase tracking-wider">Pickup From</span>
                    <span className="font-semibold text-slate-700">{ongoingOrder.shopName}</span>
                    <span className="block text-slate-500">{ongoingOrder.shopAddress}</span>
                  </div>
                  <div>
                    <span className="block text-slate-400 font-bold uppercase tracking-wider">Deliver To</span>
                    <span className="font-semibold text-slate-700">{ongoingOrder.customerName}</span>
                    <span className="block text-slate-500">{ongoingOrder.address}</span>
                  </div>
                </div>

                <div className="pt-2 text-xs">
                  <span className="block text-slate-400 font-bold uppercase tracking-wider">Items Ledger</span>
                  <span className="text-slate-600 font-semibold">{ongoingOrder.items}</span>
                </div>
              </div>

              {/* Milestones Stepper */}
              <div className="pt-4 space-y-3">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tracking Timeline</h4>
                
                <div className="relative pl-6 space-y-4">
                  {/* Stepper bar */}
                  <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-slate-200"></div>

                  {/* Step 1 */}
                  <div className="relative flex items-start gap-3">
                    <div className="absolute -left-[22px] w-4.5 h-4.5 rounded-full bg-emerald-500 border-4 border-white flex items-center justify-center shadow-sm"></div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">Order Placed & Confirmed</p>
                      <p className="text-[10px] text-slate-400">Store accepted and prepared items</p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="relative flex items-start gap-3">
                    <div className={`
                      absolute -left-[22px] w-4.5 h-4.5 rounded-full border-4 border-white flex items-center justify-center shadow-sm
                      ${(ongoingOrder.status === 'Preparing' || ongoingOrder.status === 'Confirmed') 
                        ? 'bg-slate-300' 
                        : 'bg-emerald-500'
                      }
                    `}></div>
                    <div>
                      <p className={`text-xs font-bold ${
                        (ongoingOrder.status === 'Preparing' || ongoingOrder.status === 'Confirmed') ? 'text-slate-400' : 'text-slate-800'
                      }`}>Picked Up from Store</p>
                      <p className="text-[10px] text-slate-400">Order handed over to courier</p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="relative flex items-start gap-3">
                    <div className={`
                      absolute -left-[22px] w-4.5 h-4.5 rounded-full border-4 border-white flex items-center justify-center shadow-sm
                      ${ongoingOrder.status === 'Out for Delivery' ? 'bg-[#10B981] animate-ping' : ''}
                      ${ongoingOrder.status === 'Out for Delivery' ? 'bg-[#10B981]' : 'bg-slate-300'}
                    `}></div>
                    <div>
                      <p className={`text-xs font-bold ${
                        ongoingOrder.status === 'Out for Delivery' ? 'text-slate-800' : 'text-slate-400'
                      }`}>On the Way (Out for Delivery)</p>
                      <p className="text-[10px] text-slate-400">Courier navigating to drop address</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex justify-end">
                {(ongoingOrder.status === 'Preparing' || ongoingOrder.status === 'Confirmed') && (
                  <button
                    onClick={() => handleUpdateStatus(ongoingOrder.id, ongoingOrder.status)}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition-all flex items-center gap-1.5"
                  >
                    Confirm Order Picked Up
                  </button>
                )}
                {ongoingOrder.status === 'Out for Delivery' && (
                  <button
                    onClick={() => handleUpdateStatus(ongoingOrder.id, ongoingOrder.status)}
                    className="bg-[#10B981] hover:bg-[#059669] text-white font-bold px-4 py-2 rounded-xl text-xs transition-all shadow-md shadow-emerald-500/10 flex items-center gap-1.5"
                  >
                    Complete Drop-off
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Available queue sidebar */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-800 mb-1">Incoming Jobs Queue</h3>
            <p className="text-xs text-slate-400 mb-4">Accept nearby deliveries and begin earning</p>

            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {availableQueue.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-8">No incoming shipments currently.</p>
              ) : (
                availableQueue.map((job) => (
                  <div key={job.id} className="p-3.5 bg-slate-50 border border-slate-200/50 hover:border-slate-300 rounded-xl transition-all space-y-2.5">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[9px] font-extrabold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded">
                          ₹{job.deliveryFee} Payout
                        </span>
                        <h4 className="font-bold text-slate-800 text-xs mt-1.5">{job.shopName}</h4>
                      </div>
                      <span className="text-[10px] text-slate-400 font-semibold">{job.id}</span>
                    </div>

                    <div className="text-[11px] text-slate-500 space-y-1">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span className="truncate">{job.shopAddress}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span className="truncate">{job.address}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleAcceptJob(job.id)}
                      className="w-full py-1.5 bg-[#166534] hover:bg-green-700 text-white font-bold rounded-lg text-[10px] transition-all flex items-center justify-center gap-1"
                    >
                      <PlayCircle className="w-3.5 h-3.5" /> Accept & Start
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <button
            onClick={() => setActiveTab('deliveries')}
            className="w-full mt-6 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1"
          >
            Go to Trips <ArrowRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>
    </div>
  );
};
