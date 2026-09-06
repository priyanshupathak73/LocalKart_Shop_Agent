"use client";

import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import API from '../../api/api';
import { MapPin, Navigation, Compass, CheckCircle } from 'lucide-react';

export const Deliveries = () => {
  const orders = useStore((state) => state.orders);
  const storeActions = useStore();

  const [activeSegment, setActiveSegment] = useState('active');
  const [gpsCoords, setGpsCoords] = useState({ lat: 28.6273, lng: 77.3725 });
  const [courierPosPercent, setCourierPosPercent] = useState(25);

  const activeDeliveries = orders.filter((o) => o.status !== 'Delivered');
  const completedDeliveries = orders.filter((o) => o.status === 'Delivered');

  const handleSimulateGPS = () => {
    setGpsCoords({
      lat: +(gpsCoords.lat + (Math.random() - 0.5) * 0.005).toFixed(4),
      lng: +(gpsCoords.lng + (Math.random() - 0.5) * 0.005).toFixed(4),
    });
    setCourierPosPercent(prev => (prev >= 95 ? 15 : prev + 15));
  };

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
        console.error('Error updating status:', err);
        storeActions.updateOrderStatus(id, nextStatus);
      }
    }
  };

  const courierX = 80 + (courierPosPercent / 100) * 380;
  const courierY = 140 - (courierPosPercent / 100) * 90;

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
        <div>
          <h1 className="text-xl font-bold font-heading text-slate-800">Trip Navigator</h1>
          <p className="text-xs text-slate-400">Track active routes and log drop-offs.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Deliveries List */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex gap-2 p-1 bg-slate-100 rounded-xl border border-slate-200/40">
            <button
              onClick={() => setActiveSegment('active')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                activeSegment === 'active' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Active ({activeDeliveries.length})
            </button>
            <button
              onClick={() => setActiveSegment('completed')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                activeSegment === 'completed' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Completed ({completedDeliveries.length})
            </button>
          </div>

          <div className="space-y-3">
            {activeSegment === 'active' ? (
              activeDeliveries.length === 0 ? (
                <div className="bg-white p-6 text-center border border-slate-200/60 rounded-2xl">
                  <p className="text-slate-400 text-xs font-semibold">No active deliveries currently.</p>
                </div>
              ) : (
                activeDeliveries.map((delivery) => (
                  <div key={delivery.id} className="bg-white p-4 border border-slate-200/60 rounded-xl space-y-3 text-xs shadow-sm hover:shadow-md transition-all">
                    <div className="flex justify-between items-center font-bold text-slate-800">
                      <span>Order #{delivery.id}</span>
                      <span className="text-[#10B981]">₹{delivery.deliveryFee}</span>
                    </div>

                    <div className="space-y-1.5 text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#166534]" />
                        <span className="truncate"><b>{delivery.shopName}</b>: {delivery.shopAddress}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-rose-500" />
                        <span className="truncate"><b>{delivery.customerName}</b>: {delivery.address}</span>
                      </div>
                    </div>

                    <div className="pt-2 flex justify-between items-center border-t border-slate-100">
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-100">
                        {delivery.status}
                      </span>

                      {(delivery.status === 'Preparing' || delivery.status === 'Confirmed') && (
                        <button
                          onClick={() => handleUpdateStatus(delivery.id, delivery.status)}
                          className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-3 py-1 rounded-lg text-[10px] transition-all"
                        >
                          Confirm Pickup
                        </button>
                      )}
                      {delivery.status === 'Out for Delivery' && (
                        <button
                          onClick={() => handleUpdateStatus(delivery.id, delivery.status)}
                          className="bg-[#10B981] hover:bg-[#059669] text-white font-bold px-3 py-1 rounded-lg text-[10px] transition-all"
                        >
                          Complete Drop
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )
            ) : (
              completedDeliveries.length === 0 ? (
                <div className="bg-white p-6 text-center border border-slate-200/60 rounded-2xl">
                  <p className="text-slate-400 text-xs font-semibold">No completed trips logged yet today.</p>
                </div>
              ) : (
                completedDeliveries.map((delivery) => (
                  <div key={delivery.id} className="bg-white p-4 border border-slate-200/60 rounded-xl space-y-2 text-xs shadow-sm">
                    <div className="flex justify-between items-center font-bold text-slate-800">
                      <span>Trip #{delivery.id}</span>
                      <span className="text-emerald-600 font-extrabold">₹{delivery.deliveryFee}</span>
                    </div>
                    <p className="text-slate-500">Delivered to <b>{delivery.customerName}</b></p>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                      <CheckCircle className="w-3.5 h-3.5" /> Successful Drop-off
                    </div>
                  </div>
                ))
              )
            )}
          </div>
        </div>

        {/* Mock GPS Map Panel */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm lg:col-span-2 space-y-4 flex flex-col justify-between">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-1.5">
                <Compass className="w-5 h-5 text-[#166534]" /> GPS Route Tracker
              </h3>
              <p className="text-xs text-slate-400">Simulation of live waypoint progress</p>
            </div>
            
            <button
              onClick={handleSimulateGPS}
              className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <Navigation className="w-3.5 h-3.5 text-[#10B981]" /> Update Location
            </button>
          </div>

          {/* Coordinate Readout */}
          <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl text-xs border border-slate-200/50">
            <div>
              <span className="block text-slate-400 font-bold uppercase tracking-wider text-[9px]">Waypoint Lat</span>
              <span className="font-mono font-bold text-slate-700">{gpsCoords.lat} °N</span>
            </div>
            <div>
              <span className="block text-slate-400 font-bold uppercase tracking-wider text-[9px]">Waypoint Lng</span>
              <span className="font-mono font-bold text-slate-700">{gpsCoords.lng} °E</span>
            </div>
          </div>

          {/* SVG Map Illustration */}
          <div className="relative w-full h-[220px] bg-sky-50/50 border border-sky-100 rounded-2xl overflow-hidden shadow-inner">
            <svg className="w-full h-full" viewBox="0 0 540 220" preserveAspectRatio="none">
              <rect width="100%" height="100%" fill="#f8fafc" />
              <path d="M 0,90 Q 250,110 540,80" fill="none" stroke="#e2e8f0" strokeWidth="20" />
              <path d="M 80,0 L 80,220" fill="none" stroke="#e2e8f0" strokeWidth="16" />
              <path d="M 460,0 L 460,220" fill="none" stroke="#e2e8f0" strokeWidth="16" />
              <path d="M 0,160 C 180,180 360,120 540,160" fill="none" stroke="#e2e8f0" strokeWidth="14" />
              
              <path d="M 80,140 Q 270,110 460,50" fill="none" stroke="#93c5fd" strokeWidth="6" strokeDasharray="6,4" />

              <circle cx="80" cy="140" r="14" fill="#dcfce7" />
              <circle cx="80" cy="140" r="8" fill="#166534" />
              <text x="80" y="170" textAnchor="middle" className="text-[9px] font-bold fill-slate-600 font-heading">Store Pickup</text>

              <circle cx="460" cy="50" r="14" fill="#ffe4e6" />
              <circle cx="460" cy="50" r="8" fill="#e11d48" />
              <text x="460" y="80" textAnchor="middle" className="text-[9px] font-bold fill-slate-600 font-heading">Drop Address</text>

              <g>
                <circle cx={courierX} cy={courierY} r="12" fill="#10B981" stroke="#ffffff" strokeWidth="2" className="shadow-md" />
                <polygon points={`${courierX-3},${courierY-3} ${courierX+4},${courierY} ${courierX-3},${courierY+3}`} fill="#ffffff" />
              </g>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
