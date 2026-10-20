import React, { useState, useMemo } from 'react';
import { useStore } from '../../../context/StoreContext';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingBag,
  CreditCard,
  Layers,
  ArrowUpRight,
  Calendar,
  Package,
  Award,
  Truck,
  ShieldCheck,
  Smartphone,
} from 'lucide-react';

export const AnalyticsTab: React.FC = () => {
  const { orders, products, categories } = useStore();
  const [timeframe, setTimeframe] = useState<'today' | 'week' | 'month' | 'year'>('week');

  // Key Aggregations
  const totalRevenue = useMemo(() => orders.reduce((sum, o) => sum + o.total, 0), [orders]);
  const totalOrders = orders.length;
  const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  // Chart datasets based on timeframe
  const revenueChartData = useMemo(() => {
    switch (timeframe) {
      case 'today':
        return [
          { label: '06:00', revenue: 18000, orders: 1, height: '22%' },
          { label: '09:00', revenue: 45000, orders: 2, height: '45%' },
          { label: '12:00', revenue: 89000, orders: 4, height: '78%' },
          { label: '15:00', revenue: 120000, orders: 5, height: '95%' },
          { label: '18:00', revenue: 76000, orders: 3, height: '62%' },
          { label: '21:00', revenue: 52000, orders: 2, height: '48%' },
        ];
      case 'week':
        return [
          { label: 'Mon', revenue: 145000, orders: 5, height: '48%' },
          { label: 'Tue', revenue: 289000, orders: 9, height: '84%' },
          { label: 'Wed', revenue: 195000, orders: 6, height: '60%' },
          { label: 'Thu', revenue: 340000, orders: 11, height: '96%' },
          { label: 'Fri', revenue: 260000, orders: 8, height: '76%' },
          { label: 'Sat', revenue: 310000, orders: 10, height: '88%' },
          { label: 'Sun', revenue: 180000, orders: 6, height: '55%' },
        ];
      case 'month':
        return [
          { label: 'Week 1', revenue: 890000, orders: 28, height: '68%' },
          { label: 'Week 2', revenue: 1240000, orders: 39, height: '94%' },
          { label: 'Week 3', revenue: 1080000, orders: 34, height: '82%' },
          { label: 'Week 4', revenue: 960000, orders: 30, height: '74%' },
        ];
      case 'year':
        return [
          { label: 'Q1', revenue: 4170000, orders: 131, height: '82%' },
          { label: 'Q2', revenue: 4950000, orders: 154, height: '96%' },
          { label: 'Q3', revenue: 3820000, orders: 119, height: '75%' },
          { label: 'Q4', revenue: 5400000, orders: 168, height: '100%' },
        ];
    }
  }, [timeframe]);

  // Orders volume trajectory
  const ordersVolumeData = useMemo(() => {
    return [
      { day: 'Mon', count: 12, percent: 50 },
      { day: 'Tue', count: 24, percent: 85 },
      { day: 'Wed', count: 16, percent: 62 },
      { day: 'Thu', count: 28, percent: 96 },
      { day: 'Fri', count: 20, percent: 72 },
      { day: 'Sat', count: 26, percent: 88 },
      { day: 'Sun', count: 15, percent: 58 },
    ];
  }, []);

  // Sales by Category
  const categorySales = [
    { name: 'Smartphones', count: 48, percentage: 46, color: 'bg-cyan-500' },
    { name: 'Laptops', count: 25, percentage: 24, color: 'bg-blue-500' },
    { name: 'Earbuds & Audio', count: 16, percentage: 15, color: 'bg-purple-500' },
    { name: 'Smart Watches', count: 9, percentage: 9, color: 'bg-emerald-500' },
    { name: 'Accessories & Cables', count: 6, percentage: 6, color: 'bg-amber-500' },
  ];

  // Payment method breakdown
  const paymentMethodStats = useMemo(() => {
    const stats = { cod: 0, bank_transfer: 0, jazzcash: 0, easypaisa: 0 };
    orders.forEach((o) => {
      if (stats[o.paymentMethod] !== undefined) {
        stats[o.paymentMethod] += o.total;
      }
    });
    const total = Object.values(stats).reduce((a, b) => a + b, 0) || 1;
    return [
      { name: 'Cash on Delivery (COD)', total: stats.cod, percent: Math.round((stats.cod / total) * 100), color: 'text-amber-400' },
      { name: 'Direct Bank Transfer', total: stats.bank_transfer, percent: Math.round((stats.bank_transfer / total) * 100), color: 'text-cyan-400' },
      { name: 'JazzCash Wallet', total: stats.jazzcash, percent: Math.round((stats.jazzcash / total) * 100), color: 'text-rose-400' },
      { name: 'Easypaisa Digital', total: stats.easypaisa, percent: Math.round((stats.easypaisa / total) * 100), color: 'text-emerald-400' },
    ];
  }, [orders]);

  return (
    <div className="space-y-8 animate-in fade-in duration-150">
      {/* Top Bar with Timeframe Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">Sales & Commercial Analytics</h2>
          <p className="text-xs text-slate-400">
            Real-time financial performance, category share, customer acquisition and order metrics.
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-2xl text-xs">
          {(['today', 'week', 'month', 'year'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setTimeframe(period)}
              className={`px-3 py-1.5 rounded-xl font-bold capitalize transition-all ${
                timeframe === period
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {period === 'today' ? 'Today' : period === 'week' ? 'This Week' : period === 'month' ? 'This Month' : 'This Year'}
            </button>
          ))}
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Gross Revenue (GMV)</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black font-mono text-white tabular-nums">
            Rs. {totalRevenue.toLocaleString()}
          </p>
          <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+24.6% vs previous cycle</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Average Order Value</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-black font-mono text-white tabular-nums">
            Rs. {avgOrderValue.toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-400">Calculated over {totalOrders} shipments</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Delivery Success Rate</span>
            <Truck className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-black font-mono text-white">98.2%</p>
          <p className="text-[11px] text-indigo-400 font-semibold">TCS & Trax courier fulfilment</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Net Operating Margin</span>
            <ShieldCheck className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black font-mono text-white">26.4%</p>
          <p className="text-[11px] text-slate-400">Post delivery & packaging costs</p>
        </div>
      </div>

      {/* Main Charts Row: Revenue & Orders Volume */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Revenue Breakdown (PKR)</h3>
              <p className="text-xs text-slate-400">Income received by Veltrix platform</p>
            </div>
            <span className="text-xs bg-slate-800 text-cyan-400 font-mono px-2.5 py-1 rounded-lg">
              {timeframe.toUpperCase()}
            </span>
          </div>

          <div className="h-56 flex items-end justify-between gap-3 pt-6 border-b border-slate-800 px-2">
            {revenueChartData.map((bar) => (
              <div key={bar.label} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                <div
                  className="w-full bg-slate-800 group-hover:bg-cyan-400 rounded-t-lg transition-all duration-300 relative flex items-end justify-center cursor-pointer"
                  style={{ height: bar.height }}
                >
                  <span className="opacity-0 group-hover:opacity-100 absolute -top-8 text-[11px] bg-slate-950 text-cyan-300 px-2 py-0.5 rounded-md font-mono border border-slate-800 transition-opacity whitespace-nowrap shadow-lg">
                    Rs. {(bar.revenue / 1000).toFixed(0)}k
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">{bar.label}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
            <span>Peak processing time: 14:00 - 18:00 PKT</span>
            <span className="text-emerald-400 font-semibold">+18.2% vs last cycle</span>
          </div>
        </div>

        {/* Orders Volume Chart */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Order Volume Over Time</h3>
              <p className="text-xs text-slate-400">Total customer orders count</p>
            </div>
            <ShoppingBag className="w-4 h-4 text-cyan-400" />
          </div>

          <div className="h-56 flex items-end justify-between gap-2.5 pt-6 border-b border-slate-800 px-2">
            {ordersVolumeData.map((d) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                <div
                  className="w-full bg-slate-800 group-hover:bg-purple-500 rounded-t-lg transition-all duration-300 relative flex items-end justify-center cursor-pointer"
                  style={{ height: `${d.percent}%` }}
                >
                  <span className="opacity-0 group-hover:opacity-100 absolute -top-8 text-[11px] bg-slate-950 text-purple-300 px-2 py-0.5 rounded-md font-mono border border-slate-800 transition-opacity whitespace-nowrap shadow-lg">
                    {d.count} orders
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">{d.day}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
            <span>Average: 21 orders / day</span>
            <span className="text-purple-400 font-semibold">94% dispatch rate</span>
          </div>
        </div>
      </div>

      {/* Row 2: Sales by Category & Payment Gateways */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sales by Category */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white tracking-tight">Sales By Product Category</h3>
            <Layers className="w-4 h-4 text-cyan-400" />
          </div>

          <div className="space-y-4">
            {categorySales.map((cat) => (
              <div key={cat.name} className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span className="font-semibold">{cat.name}</span>
                  <span className="font-mono text-cyan-400 font-bold">{cat.percentage}%</span>
                </div>
                <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden">
                  <div className={`h-full ${cat.color} rounded-full transition-all`} style={{ width: `${cat.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Methods Breakdown */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white tracking-tight">Payment Channel Share</h3>
            <CreditCard className="w-4 h-4 text-emerald-400" />
          </div>

          <div className="space-y-3.5 divide-y divide-slate-800/80">
            {paymentMethodStats.map((pm) => (
              <div key={pm.name} className="pt-3 first:pt-0 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-white">{pm.name}</p>
                  <p className="text-[11px] text-slate-400 font-mono">
                    Rs. {pm.total.toLocaleString()} processed
                  </p>
                </div>
                <div className="text-right">
                  <span className={`text-base font-black font-mono ${pm.color}`}>
                    {pm.percent}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Best-Selling Products */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">Best-Selling Technology Products</h3>
            <p className="text-xs text-slate-400">Catalog items with highest conversion and customer velocity</p>
          </div>
          <Award className="w-5 h-5 text-amber-400" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 text-[11px] uppercase tracking-wider">
              <tr>
                <th className="p-3">Product Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Unit Price (PKR)</th>
                <th className="p-3">Stock Remaining</th>
                <th className="p-3">Rating</th>
                <th className="p-3 text-right">Performance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {products.slice(0, 5).map((p, index) => (
                <tr key={p.id} className="hover:bg-slate-800/40">
                  <td className="p-3 flex items-center gap-3">
                    <span className="font-mono text-cyan-400 font-bold w-4">#{index + 1}</span>
                    <img
                      src={p.images[0]}
                      alt=""
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-xl object-cover bg-slate-800 shrink-0"
                    />
                    <div>
                      <p className="font-bold text-white">{p.name}</p>
                      <p className="text-[11px] text-slate-400 font-mono">{p.sku}</p>
                    </div>
                  </td>
                  <td className="p-3 capitalize text-slate-400">
                    {p.category.replace('-', ' ')}
                  </td>
                  <td className="p-3 font-mono font-bold text-white tabular-nums">
                    Rs. {p.price.toLocaleString()}
                  </td>
                  <td className="p-3">
                    <span className={`font-mono font-bold ${p.stock < 10 ? 'text-amber-400' : 'text-slate-300'}`}>
                      {p.stock} units
                    </span>
                  </td>
                  <td className="p-3 font-mono">
                    ★ {p.rating} ({p.reviewsCount})
                  </td>
                  <td className="p-3 text-right">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-cyan-950 text-cyan-400 border border-cyan-800">
                      Top Performer
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
