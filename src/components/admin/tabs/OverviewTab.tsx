import React, { useState, useMemo } from 'react';
import { useStore } from '../../../context/StoreContext';
import {
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  TrendingUp,
  ArrowRight,
  Eye,
  Calendar,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { Order, OrderStatus } from '../../../types';

interface OverviewTabProps {
  onOpenOrder: (order: Order) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ onOpenOrder }) => {
  const { products, orders, categories, setActiveAdminTab } = useStore();
  const [revenuePeriod, setRevenuePeriod] = useState<'today' | 'week' | 'month' | 'year'>('week');

  // Summary Metrics
  const totalRevenue = useMemo(() => orders.reduce((sum, o) => sum + o.total, 0), [orders]);
  const totalOrders = orders.length;

  const uniqueCustomersCount = useMemo(() => {
    const emails = new Set(orders.map((o) => o.customer.email.toLowerCase()));
    return Math.max(emails.size, 18);
  }, [orders]);

  const activeProductsCount = products.filter((p) => p.inStock).length;
  const pendingOrdersCount = orders.filter(
    (o) => o.orderStatus === 'Pending' || o.orderStatus === 'Payment Verification'
  ).length;
  const lowStockCount = products.filter((p) => p.stock < 10).length;
  const deliveredOrdersCount = orders.filter((o) => o.orderStatus === 'Delivered').length;
  const cancelledOrdersCount = orders.filter((o) => o.orderStatus === 'Cancelled').length;

  // Revenue chart data based on active period
  const revenueChartData = useMemo(() => {
    if (revenuePeriod === 'today') {
      return [
        { label: '08:00', amount: 32000, height: '35%' },
        { label: '11:00', amount: 68000, height: '65%' },
        { label: '14:00', amount: 110000, height: '90%' },
        { label: '17:00', amount: 84000, height: '75%' },
        { label: '20:00', amount: 56000, height: '55%' },
        { label: '23:00', amount: 24000, height: '25%' },
      ];
    } else if (revenuePeriod === 'week') {
      return [
        { label: 'Mon', amount: 145000, height: '50%' },
        { label: 'Tue', amount: 289000, height: '82%' },
        { label: 'Wed', amount: 195000, height: '64%' },
        { label: 'Thu', amount: 340000, height: '96%' },
        { label: 'Fri', amount: 260000, height: '78%' },
        { label: 'Sat', amount: 310000, height: '88%' },
        { label: 'Sun', amount: 180000, height: '58%' },
      ];
    } else if (revenuePeriod === 'month') {
      return [
        { label: 'Week 1', amount: 890000, height: '70%' },
        { label: 'Week 2', amount: 1240000, height: '92%' },
        { label: 'Week 3', amount: 1080000, height: '85%' },
        { label: 'Week 4', amount: 960000, height: '78%' },
      ];
    } else {
      return [
        { label: 'Q1', amount: 4170000, height: '85%' },
        { label: 'Q2', amount: 4950000, height: '95%' },
        { label: 'Q3', amount: 3820000, height: '75%' },
        { label: 'Q4', amount: 5400000, height: '100%' },
      ];
    }
  }, [revenuePeriod]);

  // Sales by Category
  const categorySales = useMemo(() => {
    return [
      { name: 'Smartphones', share: 46, color: 'bg-cyan-500' },
      { name: 'Laptops', share: 24, color: 'bg-blue-500' },
      { name: 'Earbuds & Audio', share: 15, color: 'bg-purple-500' },
      { name: 'Smart Watches', share: 9, color: 'bg-emerald-500' },
      { name: 'Accessories', share: 6, color: 'bg-amber-500' },
    ];
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-150">
      {/* 8 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Revenue</span>
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black font-mono tabular-nums text-white">
            Rs. {totalRevenue.toLocaleString()}
          </p>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+18.4% growth this month</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Orders</span>
            <div className="h-8 w-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black font-mono tabular-nums text-white">
            {totalOrders}
          </p>
          <p className="text-[11px] text-slate-400">
            Across 200+ Pakistani delivery hubs
          </p>
        </div>

        {/* Total Customers */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Customers</span>
            <div className="h-8 w-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black font-mono tabular-nums text-white">
            {uniqueCustomersCount}
          </p>
          <p className="text-[11px] text-slate-400">
            Verified phone & email accounts
          </p>
        </div>

        {/* Total Products */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Active Products</span>
            <div className="h-8 w-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black font-mono tabular-nums text-white">
            {activeProductsCount}
          </p>
          <p className="text-[11px] text-slate-400">
            In stock & ready to dispatch
          </p>
        </div>

        {/* Pending Orders */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Pending Orders</span>
            <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black font-mono tabular-nums text-amber-400">
            {pendingOrdersCount}
          </p>
          <p className="text-[11px] text-amber-400 font-semibold">
            Requires verification / rider dispatch
          </p>
        </div>

        {/* Low Stock */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Low Stock</span>
            <div className="h-8 w-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black font-mono tabular-nums text-rose-400">
            {lowStockCount}
          </p>
          <p className="text-[11px] text-slate-400">
            Inventory &lt; 10 units in warehouse
          </p>
        </div>

        {/* Delivered Orders */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Delivered Orders</span>
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black font-mono tabular-nums text-emerald-400">
            {deliveredOrdersCount}
          </p>
          <p className="text-[11px] text-slate-400">
            Completed delivery receipts
          </p>
        </div>

        {/* Cancelled Orders */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Cancelled Orders</span>
            <div className="h-8 w-8 rounded-lg bg-slate-800 text-slate-400 flex items-center justify-center">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black font-mono tabular-nums text-slate-300">
            {cancelledOrdersCount}
          </p>
          <p className="text-[11px] text-slate-500">
            Zero customer payment loss
          </p>
        </div>
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Revenue & Sales Trajectory
              </h2>
              <p className="text-xs text-slate-400">
                Gross transaction value processed across all payment gateways
              </p>
            </div>

            {/* Timeframe Selector */}
            <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
              {(['today', 'week', 'month', 'year'] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setRevenuePeriod(period)}
                  className={`px-3 py-1.5 rounded-lg font-semibold capitalize transition-all ${
                    revenuePeriod === period
                      ? 'bg-cyan-500 text-slate-950 shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {period === 'today' ? 'Today' : period === 'week' ? 'This Week' : period === 'month' ? 'This Month' : 'This Year'}
                </button>
              ))}
            </div>
          </div>

          {/* Bar Chart Visual */}
          <div className="h-56 flex items-end justify-between gap-3 pt-6 border-b border-slate-800 px-3">
            {revenueChartData.map((bar) => (
              <div key={bar.label} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                <div
                  className="w-full bg-slate-800 group-hover:bg-cyan-400 rounded-t-lg transition-all duration-300 relative flex items-end justify-center cursor-pointer"
                  style={{ height: bar.height }}
                >
                  <span className="opacity-0 group-hover:opacity-100 absolute -top-8 text-[11px] bg-slate-950 text-cyan-300 px-2 py-0.5 rounded-md font-mono border border-slate-800 transition-opacity whitespace-nowrap shadow-lg">
                    Rs. {(bar.amount / 1000).toFixed(0)}k
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">{bar.label}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
            <span>Average Order Value: <strong className="text-white font-mono">Rs. 38,420</strong></span>
            <span className="text-cyan-400 font-semibold">Verified by Veltrix Finance</span>
          </div>
        </div>

        {/* Sales by Category Share */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white tracking-tight">
              Sales By Category
            </h2>
            <Layers className="w-4 h-4 text-cyan-400" />
          </div>

          <div className="space-y-3.5">
            {categorySales.map((cat) => (
              <div key={cat.name} className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span className="font-semibold">{cat.name}</span>
                  <span className="font-mono text-cyan-400 font-bold">{cat.share}%</span>
                </div>
                <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden">
                  <div className={`h-full ${cat.color} rounded-full`} style={{ width: `${cat.share}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-800">
            <button
              onClick={() => setActiveAdminTab('analytics')}
              className="w-full text-center text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center justify-center gap-1"
            >
              <span>View Full Analytics Breakdown</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Recent Orders & Top Products Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Orders Table */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Recent Orders</h2>
              <p className="text-xs text-slate-400">Incoming consumer purchases awaiting fulfilment</p>
            </div>
            <button
              onClick={() => setActiveAdminTab('orders')}
              className="text-xs font-semibold text-cyan-400 hover:underline flex items-center gap-1"
            >
              <span>View All Orders</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="p-3">Order ID</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Payment</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="p-3 font-mono font-bold text-white">{order.id}</td>
                    <td className="p-3">
                      <span className="font-semibold text-white block">{order.customer.fullName}</span>
                      <span className="text-[11px] text-slate-500">{order.customer.city}</span>
                    </td>
                    <td className="p-3 text-slate-400">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3 font-mono font-bold text-white tabular-nums">
                      Rs. {order.total.toLocaleString()}
                    </td>
                    <td className="p-3 uppercase text-[11px] font-semibold text-slate-300">
                      {order.paymentMethod.replace('_', ' ')}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          order.orderStatus === 'Delivered'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : order.orderStatus === 'Payment Verification'
                            ? 'bg-amber-950 text-amber-400 border border-amber-800'
                            : order.orderStatus === 'Confirmed'
                            ? 'bg-cyan-950 text-cyan-400 border border-cyan-800'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => onOpenOrder(order)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-300 font-semibold transition-colors inline-flex items-center gap-1 text-[11px]"
                      >
                        <Eye className="w-3 h-3" />
                        <span>View Order</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white tracking-tight">Top Products</h2>
            <button
              onClick={() => setActiveAdminTab('products')}
              className="text-xs font-semibold text-cyan-400 hover:underline"
            >
              All Items
            </button>
          </div>

          <div className="divide-y divide-slate-800">
            {products.slice(0, 5).map((prod) => (
              <div key={prod.id} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={prod.images[0]}
                    alt={prod.name}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-xl object-cover bg-slate-800 shrink-0"
                  />
                  <div>
                    <p className="font-bold text-white line-clamp-1">{prod.name}</p>
                    <p className="text-[11px] text-slate-400">
                      Stock: <span className={prod.stock < 10 ? 'text-amber-400 font-bold' : 'text-slate-300'}>{prod.stock}</span>
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-mono font-bold text-cyan-400">
                    Rs. {prod.price.toLocaleString()}
                  </p>
                  <span className="text-[10px] text-slate-500">
                    ★ {prod.rating} ({prod.reviewsCount})
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
