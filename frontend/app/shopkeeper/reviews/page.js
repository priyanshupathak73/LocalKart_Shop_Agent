"use client";

import React, { useState } from 'react';
import { Star, MessageSquare, CornerDownRight, Send, Check } from 'lucide-react';

export default function ReviewsPage() {
  // Mock Reviews State
  const [reviews, setReviews] = useState([
    {
      id: 'rev-1',
      customerName: 'Priya Sharma',
      rating: 5,
      comment: 'Super fast delivery of grains and fresh tomatoes. Very satisfied with the quality of basmati rice!',
      date: '2026-07-04',
      reply: 'Thank you Priya! We try our best to source the finest quality grains.',
    },
    {
      id: 'rev-2',
      customerName: 'Aarav Mehta',
      rating: 4,
      comment: 'Milk was fresh and delivered cold. The whole wheat bread was a bit crushed at the edges though.',
      date: '2026-07-02',
      reply: null,
    },
    {
      id: 'rev-3',
      customerName: 'Kabir Singh',
      rating: 5,
      comment: 'Excellent almonds! Premium quality packaging. Highly recommended store.',
      date: '2026-06-29',
      reply: 'Thanks for the feedback Kabir! Glad you liked the packaging.',
    },
    {
      id: 'rev-4',
      customerName: 'Sanjana Roy',
      rating: 3,
      comment: 'Tomatoes were slightly overripe. Delivery took longer than expected.',
      date: '2026-06-25',
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

    setReviews(reviews.map(r => r.id === reviewId ? { ...r, reply: draft } : r));
    setReplyDrafts({ ...replyDrafts, [reviewId]: '' });
  };

  // Filter Reviews
  const filteredReviews = activeFilter === 'all'
    ? reviews
    : reviews.filter(r => r.rating === parseInt(activeFilter));

  // Averages
  const averageRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-heading text-slate-800">Feedback Panel</h1>
        <p className="text-slate-500 text-sm">Browse customer ratings, review order feedback, and publish replies.</p>
      </div>

      {/* Ratings Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Average Rating</p>
            <h3 className="text-3xl font-bold font-heading text-slate-800 mt-2 flex items-baseline gap-2">
              {averageRating} <span className="text-sm font-semibold text-slate-400">/ 5.0</span>
            </h3>
          </div>
          <div className="bg-yellow-50 p-4 rounded-xl text-yellow-600">
            <Star className="w-8 h-8 fill-current" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Reviews</p>
            <h3 className="text-3xl font-bold font-heading text-slate-800 mt-2">{reviews.length}</h3>
          </div>
          <div className="bg-blue-50 p-4 rounded-xl text-blue-600">
            <MessageSquare className="w-8 h-8" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Reply Ratio</p>
            <h3 className="text-3xl font-bold font-heading text-slate-800 mt-2">
              {Math.round((reviews.filter(r => r.reply).length / reviews.length) * 100)}%
            </h3>
          </div>
          <div className="bg-emerald-50 p-4 rounded-xl text-emerald-600">
            <Check className="w-8 h-8" />
          </div>
        </div>
      </div>

      {/* Review List & Filter Layout */}
      <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden">
        {/* Filters bar */}
        <div className="p-5 border-b border-slate-200/60 flex flex-wrap gap-2 items-center justify-between">
          <h3 className="text-base font-bold text-slate-800">User Comments</h3>
          <div className="flex gap-1.5 bg-slate-50 p-1 rounded-xl">
            {['all', '5', '4', '3'].map((filt) => (
              <button
                key={filt}
                onClick={() => setActiveFilter(filt)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeFilter === filt
                    ? 'bg-[#10B981] text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {filt === 'all' ? 'All Ratings' : `${filt} Stars`}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        <div className="divide-y divide-slate-100">
          {filteredReviews.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-sm">
              No reviews matching the selected filter.
            </div>
          ) : (
            filteredReviews.map((rev) => (
              <div key={rev.id} className="p-6 space-y-4 hover:bg-slate-50/20 transition-colors">
                {/* User Row */}
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h4 className="font-bold text-sm text-slate-800">{rev.customerName}</h4>
                    <span className="text-[10px] text-slate-400 font-semibold">{rev.date}</span>
                  </div>
                  {/* Stars */}
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < rev.rating
                            ? 'text-yellow-400 fill-current'
                            : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Comment Text */}
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/50 p-3.5 rounded-xl border border-slate-100/50">
                  "{rev.comment}"
                </p>

                {/* Reply display / reply field */}
                {rev.reply ? (
                  <div className="flex items-start gap-2 bg-emerald-50/30 border border-emerald-100/40 p-4 rounded-xl ml-4">
                    <CornerDownRight className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Your Reply</span>
                      <p className="text-xs text-emerald-800 mt-1 font-medium">
                        {rev.reply}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2 items-center ml-4 pl-1 border-l-2 border-slate-100">
                    <input
                      type="text"
                      placeholder="Write response to this customer..."
                      value={replyDrafts[rev.id] || ''}
                      onChange={(e) => setReplyDrafts({ ...replyDrafts, [rev.id]: e.target.value })}
                      className="flex-1 px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-[#10B981] text-xs"
                    />
                    <button
                      onClick={() => handleSendReply(rev.id)}
                      className="p-2 bg-[#10B981] hover:bg-emerald-600 text-white rounded-xl shadow-sm transition-all"
                    >
                      <Send className="w-3.5 h-3.5" />
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
