import React, { useState, useMemo } from 'react';
import { useStore } from '../../../context/StoreContext';
import {
  Star,
  CheckCircle2,
  XCircle,
  EyeOff,
  Trash2,
  Search,
  Filter,
  Check,
  ShieldCheck,
  MessageSquare,
  AlertCircle,
  ArrowUpDown,
  ExternalLink,
} from 'lucide-react';
import { Review } from '../../../types';

export const ReviewsTab: React.FC = () => {
  const { reviews, products, updateReviewStatus, showToast } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'pending' | 'hidden'>('all');
  const [ratingFilter, setRatingFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'rating_high' | 'rating_low'>('newest');
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  // Products lookup map
  const productMap = useMemo(() => {
    const map = new Map<string, { name: string; image: string }>();
    products.forEach((p) => {
      map.set(p.id, { name: p.name, image: p.images[0] || '' });
    });
    return map;
  }, [products]);

  // Aggregate Metrics
  const totalReviews = reviews.length;
  const approvedReviews = reviews.filter((r) => r.isApproved || r.status === 'approved').length;
  const pendingReviews = reviews.filter((r) => r.status === 'pending' || (!r.isApproved && r.status !== 'hidden')).length;
  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 5.0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return (sum / reviews.length).toFixed(1);
  }, [reviews]);
  const verifiedCount = reviews.filter((r) => r.verifiedPurchase).length;

  // Filtered reviews
  const filteredReviews = useMemo(() => {
    return reviews
      .filter((r) => {
        const status = r.status || (r.isApproved ? 'approved' : 'pending');
        if (statusFilter !== 'all' && status !== statusFilter) return false;
        if (ratingFilter !== 'all' && r.rating !== Number(ratingFilter)) return false;

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const prodInfo = productMap.get(r.productId);
          const matchUser = r.userName.toLowerCase().includes(q);
          const matchComment = r.comment.toLowerCase().includes(q);
          const matchCity = (r.city || '').toLowerCase().includes(q);
          const matchProd = (prodInfo?.name || '').toLowerCase().includes(q);
          if (!matchUser && !matchComment && !matchCity && !matchProd) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'rating_high') return b.rating - a.rating;
        if (sortBy === 'rating_low') return a.rating - b.rating;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
  }, [reviews, statusFilter, ratingFilter, searchQuery, sortBy, productMap]);

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-white tracking-tight">Review & Customer Feedback Moderation</h2>
        <p className="text-xs text-slate-400">
          Moderate verified buyer reviews, approve genuine product feedback, and maintain Veltrix quality reputation.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-1.5">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Reviews</span>
            <MessageSquare className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-black font-mono text-white">{totalReviews}</p>
          <p className="text-[11px] text-slate-400">Across all catalog products</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-1.5">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Average Rating</span>
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          </div>
          <p className="text-2xl font-black font-mono text-white flex items-center gap-1.5">
            <span>{averageRating}</span>
            <span className="text-xs font-normal text-slate-400">/ 5.0</span>
          </p>
          <p className="text-[11px] text-emerald-400 font-semibold">High customer satisfaction</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-1.5">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Pending Moderation</span>
            <AlertCircle className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black font-mono text-amber-400">{pendingReviews}</p>
          <p className="text-[11px] text-slate-400">Awaiting admin review</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-1.5">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Verified Buyers</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black font-mono text-emerald-400">
            {totalReviews > 0 ? Math.round((verifiedCount / totalReviews) * 100) : 100}%
          </p>
          <p className="text-[11px] text-slate-400">{verifiedCount} confirmed purchases</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by reviewer name, comment text, city, product..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-hidden focus:border-cyan-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-800">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-transparent text-slate-300 focus:outline-hidden"
            >
              <option value="all" className="bg-slate-900">All Statuses</option>
              <option value="approved" className="bg-slate-900">Approved Only</option>
              <option value="pending" className="bg-slate-900">Pending Review</option>
              <option value="hidden" className="bg-slate-900">Hidden / Flagged</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-800">
            <Star className="w-3.5 h-3.5 text-amber-400" />
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="bg-transparent text-slate-300 focus:outline-hidden"
            >
              <option value="all" className="bg-slate-900">All Ratings</option>
              <option value="5" className="bg-slate-900">5 Stars ★★★★★</option>
              <option value="4" className="bg-slate-900">4 Stars ★★★★☆</option>
              <option value="3" className="bg-slate-900">3 Stars ★★★☆☆</option>
              <option value="2" className="bg-slate-900">2 Stars ★★☆☆☆</option>
              <option value="1" className="bg-slate-900">1 Star ★☆☆☆☆</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-800">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-slate-300 focus:outline-hidden"
            >
              <option value="newest" className="bg-slate-900">Sort: Newest First</option>
              <option value="rating_high" className="bg-slate-900">Highest Rating</option>
              <option value="rating_low" className="bg-slate-900">Lowest Rating</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 text-[11px] uppercase tracking-wider">
            <tr>
              <th className="p-3.5">Reviewer & City</th>
              <th className="p-3.5">Target Product</th>
              <th className="p-3.5">Rating & Review Text</th>
              <th className="p-3.5">Date</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5 text-right">Moderation Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-300">
            {filteredReviews.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500">
                  No customer reviews match your criteria.
                </td>
              </tr>
            ) : (
              filteredReviews.map((r) => {
                const prod = productMap.get(r.productId);
                const status = r.status || (r.isApproved ? 'approved' : 'pending');

                return (
                  <tr key={r.id} className="hover:bg-slate-800/40 transition-colors">
                    {/* Reviewer */}
                    <td className="p-3.5">
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <span>{r.userName}</span>
                        {r.verifiedPurchase && (
                          <span
                            className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-1.5 py-0.2 rounded font-semibold inline-flex items-center gap-0.5"
                            title="Verified Order Purchase in Pakistan"
                          >
                            <ShieldCheck className="w-3 h-3" />
                            Verified
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 block mt-0.5">
                        {r.city || 'Pakistan'}
                      </span>
                    </td>

                    {/* Product */}
                    <td className="p-3.5">
                      <div className="flex items-center gap-2 max-w-xs">
                        {prod?.image && (
                          <img
                            src={prod.image}
                            alt=""
                            referrerPolicy="no-referrer"
                            className="w-9 h-9 rounded-lg object-cover bg-slate-800 shrink-0"
                          />
                        )}
                        <span className="font-semibold text-slate-200 truncate block">
                          {prod?.name || 'Veltrix Gadget'}
                        </span>
                      </div>
                    </td>

                    {/* Rating & Review */}
                    <td className="p-3.5 max-w-md">
                      <div className="flex items-center gap-1 mb-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < r.rating
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-slate-600'
                            }`}
                          />
                        ))}
                        <span className="text-slate-400 font-mono font-bold ml-1">
                          {r.rating}.0
                        </span>
                      </div>
                      <p className="text-slate-300 line-clamp-2 leading-relaxed">
                        "{r.comment}"
                      </p>
                    </td>

                    {/* Date */}
                    <td className="p-3.5 text-slate-400 whitespace-nowrap">
                      {r.date}
                    </td>

                    {/* Status Badge */}
                    <td className="p-3.5 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          status === 'approved'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : status === 'pending'
                            ? 'bg-amber-950 text-amber-400 border border-amber-800'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}
                      >
                        {status.toUpperCase()}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {status !== 'approved' && (
                          <button
                            onClick={() => updateReviewStatus(r.id, 'approved')}
                            className="p-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-400 border border-emerald-800 transition-colors"
                            title="Approve Review"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {status !== 'hidden' && (
                          <button
                            onClick={() => updateReviewStatus(r.id, 'hidden')}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 transition-colors"
                            title="Hide Review from Product Page"
                          >
                            <EyeOff className="w-3.5 h-3.5" />
                          </button>
                        )}

                        <button
                          onClick={() => {
                            if (confirm(`Permanently delete review by ${r.userName}?`)) {
                              updateReviewStatus(r.id, 'deleted');
                            }
                          }}
                          className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-400 transition-colors"
                          title="Delete Review"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
