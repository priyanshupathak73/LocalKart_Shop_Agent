"use client";

import React, { useState } from 'react';
import { HelpCircle, PhoneCall, AlertTriangle, ShieldAlert, MessageSquare, ChevronRight, CheckCircle2, Send } from 'lucide-react';
import { FormInput } from '../../../components/common/FormInput';

export default function DeliverySupportPage() {
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [sosTriggered, setSosTriggered] = useState(false);

  const handleSubmitTicket = (e) => {
    e.preventDefault();
    if (!ticketSubject || !ticketMessage) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setTicketSubject('');
      setTicketMessage('');
    }, 3000);
  };

  const handleSos = () => {
    setSosTriggered(true);
    setTimeout(() => setSosTriggered(false), 5000);
  };

  const supportTopics = [
    { title: 'Store Closed / Unreachable Merchant', text: 'How to mark store as closed and re-assign order', icon: AlertTriangle },
    { title: 'Customer Unavailable / Incorrect Address', text: 'Wait timer rules and return order procedure', icon: HelpCircle },
    { title: 'Order Item Damaged in Transit', text: 'Instant damage photo report and merchant compensation', icon: ShieldAlert },
    { title: 'Cash on Delivery Deposit Issues', text: 'Reconcile cash collected with daily wallet balance', icon: MessageSquare }
  ];

  return (
    <div className="space-y-6 relative text-left">
      <div>
        <h1 className="text-2xl font-black font-heading text-slate-800 dark:text-slate-100 tracking-tight flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-emerald-500" /> Rider Support & Emergency Helpdesk
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-xs font-medium mt-0.5">
          24/7 Logistics dispatch support, roadside emergency assistance, and instant rider help topics.
        </p>
      </div>

      {/* Emergency SOS Banner */}
      <div className="bg-gradient-to-r from-rose-900 to-red-950 text-white rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-red-600/30 border border-red-500/40 rounded-2xl shrink-0 text-red-300">
            <AlertTriangle className="w-7 h-7 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-black font-heading tracking-tight">Roadside Emergency / Safety SOS</h3>
            <p className="text-xs text-rose-200 mt-0.5">Accident, breakdown, or safety emergency on active trip</p>
          </div>
        </div>

        {sosTriggered ? (
          <div className="bg-red-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold font-heading flex items-center gap-2 animate-bounce">
            <ShieldAlert className="w-4 h-4" /> Dispatching Emergency Team...
          </div>
        ) : (
          <button
            type="button"
            onClick={handleSos}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-wider font-heading shadow-lg hover:shadow-red-600/40 transition-all shrink-0"
          >
            Trigger Emergency SOS
          </button>
        )}
      </div>

      {/* Support Hotline Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Dispatch Support Toll-Free</p>
              <p className="text-sm font-black text-emerald-600 font-mono mt-0.5">1800 562 2552</p>
            </div>
          </div>
          <a
            href="tel:18005622552"
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-bold font-heading transition-all"
          >
            Call Now
          </a>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Live Dispatcher Chat</p>
              <p className="text-xs text-slate-400 mt-0.5">Average response: &lt; 2 minutes</p>
            </div>
          </div>
          <button
            type="button"
            className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold font-heading transition-all"
          >
            Start Chat
          </button>
        </div>
      </div>

      {/* Frequently Asked Help Topics */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 font-heading">
          Common Rider Troubleshooting Guides
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {supportTopics.map((topic, i) => {
            const Icon = topic.icon;
            return (
              <div key={i} className="p-4 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200/60 dark:border-slate-800 flex items-start gap-3 hover:border-emerald-500/50 transition-all cursor-pointer group">
                <div className="p-2 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 rounded-lg group-hover:scale-105 transition-transform">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 transition-colors font-heading truncate">{topic.title}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{topic.text}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 transition-colors shrink-0 self-center" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Create Support Ticket Form */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 font-heading">
          Submit Rider Inquiry Ticket
        </h3>

        {submitted ? (
          <div className="p-4 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Support ticket submitted successfully! Dispatch agent will call back shortly.
          </div>
        ) : (
          <form onSubmit={handleSubmitTicket} className="space-y-4">
            <FormInput
              label="Ticket Subject"
              required
              value={ticketSubject}
              onChange={(e) => setTicketSubject(e.target.value)}
              placeholder="e.g. Earnings discrepancy for Trip #108"
            />

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 font-heading">
                Detailed Message / Explanation *
              </label>
              <textarea
                rows={3}
                required
                value={ticketMessage}
                onChange={(e) => setTicketMessage(e.target.value)}
                placeholder="Describe your issue or order ID details..."
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs outline-none focus:border-emerald-500 dark:text-slate-100"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold font-heading flex items-center gap-2 shadow-md transition-all"
              >
                <Send className="w-3.5 h-3.5" /> Submit Support Ticket
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
