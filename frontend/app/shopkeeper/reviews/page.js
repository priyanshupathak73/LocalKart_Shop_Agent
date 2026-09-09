"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, 
  MessageSquare, 
  CornerDownRight, 
  Send, 
  Check, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  ThumbsUp, 
  Clock,
  User
} from 'lucide-react';

export default function ReviewsPage() {
  // Mock Reviews State
  const [reviews, setReviews] = useState([
    {
      id: 'rev-1',
      customerName: 'Priya Sharma',
      rating: 5,
      comment: 'Super fast delivery of organic grains and fresh tomatoes. Very satisfied with the quality of basmati rice! Everything arrived neatly packed in eco-friendly paper bags.',
      date: 'July 4, 2026',
      reply: 'Thank you Priya! We try our best to source the finest quality grains directly from verified regional mandis.',
    },
    {
      id: 'rev-2',
      customerName: 'Aarav Mehta',
      rating: 4,
      comment: 'Milk and curd were fresh and delivered cold. The whole wheat bread was a bit crushed at the edges though, but still good.',
      date: 'July 2, 2026',
      reply: null,
    },
    {
      id: 'rev-3',
      customerName: 'Kabir Singh',
      rating: 5,
      comment: 'Excellent California almonds and cashew nuts! Premium air-sealed packaging. Highly recommended neighborhood kirana.',
      date: 'June 29, 2026',
      reply: 'Thanks for the feedback Kabir! Glad you liked the packaging and freshness.',
    },
    {
      id: 'rev-4',
      customerName: 'Sanjana Roy',
      rating: 4,
      comment: 'Great selection of pulses and spices. Quick 20-minute delivery to my apartment.',
      date: 'June 25, 2026',
      reply: null,
    }
  ]);

  // Reply Drafts State
  const [replyDrafts, setReplyDrafts] = useState({});
  const [activeFilter, setActiveFilter] = useState('all');

  // Submit Reply
  const handleSendReply = (reviewId) => {
    const draft = replyDrafts[reviewId];
    if (!draft || !draft.trim()) return;

    setReviews(reviews.map(r => r.id === reviewId ? { ...r, reply: draft.trim() } : r));
    setReplyDrafts({ ...replyDrafts, [reviewId]: '' });
  };

  // Filter Reviews
  const filteredReviews = activeFilter === 'all'
    ? reviews
    : reviews.filter(r => r.rating === parseInt(activeFilter));

  const averageRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);

  // Distribution
  const distribution = [
    { stars: 5, pct: 75, count: 96 },
    { stars: 4, pct: 20, count: 26 },
    { stars: 3, pct: 4, count: 5 },
    { stars: 2, pct: 1, count: 1 },
    { stars: 1, pct: 0, count: 0 },
  ];

  return (
    <div className="space-y-6 text-left">
      
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/70 shadow-card flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black font-heading text-slate-900 tracking-tight">
              Customer Feedback & Reviews
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
              ★ 4.8 Top Tier
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Browse buyer testimonials, monitor customer satisfaction, and build neighborhood trust by replying.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>100% Verified Buyer Reviews</span>
        </div>
      </div>

      {/* Ratings Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Score & Distribution Card */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200/70 shadow-card flex flex-col justify-between space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Overall Store Score</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-4xl font-black font-heading text-slate-900">{averageRating}</span>
                <span className="text-sm font-bold text-slate-400">/ 5.0</span>
              </div>
              <div className="flex gap-1 mt-1.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>
            </div>

            <div className="text-right">
              <span className="text-2xl font-black font-heading text-[#105634]">96%</span>
              <p className="text-[11px] text-slate-400 font-medium">Positive Sentiment</p>
              <div className="mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 inline-block border border-emerald-200">
                Excellent Store
              </div>
            </div>
          </div>

          {/* Histogram distribution */}
          <div className="space-y-2 border-t border-slate-100 pt-4">
            {distribution.map(d => (
              <div key={d.stars} className="flex items-center gap-2.5 text-xs">
                <span className="w-6 font-bold text-slate-600 flex items-center gap-0.5">
                  {d.stars} <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                </span>
                <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#105634] rounded-full transition-all duration-500" 
                    style={{ width: `${d.pct}%` }} 
                  />
                </div>
                <span className="w-8 text-right text-[11px] font-bold text-slate-400">{d.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Insights Cards */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200/70 shadow-card flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Received</span>
              <div className="p-2.5 bg-blue-50 text-blue-700 rounded-2xl">
                <MessageSquare className="w-4 h-4" />
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-black font-heading text-slate-900">{reviews.length + 124}</h3>
              <p className="text-[11px] text-slate-400 mt-1">Verified local checkouts</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/70 shadow-card flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Merchant Reply Rate</span>
              <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-2xl">
                <Check className="w-4 h-4" />
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-black font-heading text-[#105634]">
                {Math.round((reviews.filter(r => r.reply).length / reviews.length) * 100)}%
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">Prompt customer resolutions</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/70 shadow-card sm:col-span-2 flex items-center gap-3 bg-gradient-to-r from-emerald-50/50 to-white">
            <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-800 shrink-0">
              <Sparkles className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800 font-heading">Pro Merchant Tip</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Replying to customer comments within 24 hours increases store repeat orders by up to 28% in your neighborhood.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Review List & Filter Bar */}
      <div className="bg-white border border-slate-200/70 rounded-3xl shadow-card overflow-hidden">
        
        {/* Filters Header */}
        <div className="p-5 border-b border-slate-100 flex flex-wrap gap-2 items-center justify-between">
          <h3 className="text-base font-bold font-heading text-slate-900">Recent Buyer Feedback</h3>
          <div className="flex gap-1 bg-slate-100 p-1 rounded-2xl">
            {['all', '5', '4', '3'].map((filt) => (
              <button
                key={filt}
                onClick={() => setActiveFilter(filt)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeFilter === filt
                    ? 'bg-[#0e3e26] text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {filt === 'all' ? 'All Ratings' : `${filt} Stars`}
              </button>
            ))}
          </div>
        </div>

        {/* Reviews Feed */}
        <div className="divide-y divide-slate-100">
          {filteredReviews.length === 0 ? (
            <div className="p-14 text-center text-slate-400 text-xs">
              No reviews found matching the selected star filter.
            </div>
          ) : (
            filteredReviews.map((rev) => (
              <div key={rev.id} className="p-6 space-y-3.5 hover:bg-slate-50/40 transition-colors text-left">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-xs">
                      {rev.customerName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-xs text-slate-900 font-heading">{rev.customerName}</h4>
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.2 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-2.5 h-2.5" /> Verified
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">{rev.date}</span>
                    </div>
                  </div>

                  {/* Star rating icons */}
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < rev.rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Comment Text */}
                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  "{rev.comment}"
                </p>

                {/* Reply section */}
                {rev.reply ? (
                  <div className="flex items-start gap-2.5 bg-emerald-50/60 border border-emerald-100 p-4 rounded-2xl ml-4">
                    <CornerDownRight className="w-4 h-4 text-[#105634] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] font-bold text-[#105634] uppercase tracking-wider">
                        Store Owner Response
                      </span>
                      <p className="text-xs text-slate-700 mt-0.5 font-medium leading-relaxed">
                        {rev.reply}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2 items-center ml-4 pt-1">
                    <input
                      type="text"
                      placeholder="Write a courteous public reply to this customer..."
                      value={replyDrafts[rev.id] || ''}
                      onChange={(e) => setReplyDrafts({ ...replyDrafts, [rev.id]: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSendReply(rev.id);
                      }}
                      className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 rounded-xl text-xs text-slate-800 outline-none transition-all"
                    />
                    <button
                      onClick={() => handleSendReply(rev.id)}
                      className="px-4 py-2 bg-[#105634] hover:bg-[#0e3e26] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 active:scale-95"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Post Reply</span>
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

      </div>

    </div>
  );
}
