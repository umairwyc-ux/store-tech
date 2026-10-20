import React from 'react';
import { useStore } from '../../context/StoreContext';
import { CheckCircle2, Package, ArrowRight, Clock, ShieldCheck, MapPin } from 'lucide-react';

export const OrderSuccessPage: React.FC = () => {
  const { lastCreatedOrderId, getOrderById, navigateTo } = useStore();

  const order = lastCreatedOrderId ? getOrderById(lastCreatedOrderId) : undefined;

  return (
    <div className="bg-slate-50 min-h-screen py-16 flex items-center justify-center">
      <div className="max-w-2xl w-full mx-4 bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-12 shadow-xs text-center space-y-6">
        {/* Success Icon */}
        <div className="h-20 w-20 rounded-full bg-emerald-50 text-emerald-500 mx-auto flex items-center justify-center ring-8 ring-emerald-50/50">
          <CheckCircle2 className="w-10 h-10 stroke-[2.2]" />
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 block mb-1">
            Order Confirmed & Logged
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
            Order Placed Successfully!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-2 leading-relaxed">
            Thank you for shopping with Veltrix. We have sent a confirmation receipt to your email and SMS dispatch update.
          </p>
        </div>

        {/* Order Details Card */}
        {order ? (
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 text-left text-xs space-y-3">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200">
              <span className="text-slate-500 font-semibold">Order Number:</span>
              <span className="font-mono font-bold text-slate-900 bg-white px-2.5 py-1 rounded-md border border-slate-200">
                {order.id}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Customer Name:</span>
              <span className="font-bold text-slate-900">{order.customer.fullName}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Destination:</span>
              <span className="font-medium text-slate-700">
                {order.customer.city}, {order.customer.province}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Payment Method:</span>
              <span className="font-bold uppercase text-slate-800">
                {order.paymentMethod.replace('_', ' ')}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Initial Status:</span>
              <span className="font-bold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded-md">
                {order.orderStatus}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Estimated Delivery:</span>
              <span className="font-bold text-slate-900">{order.estimatedDeliveryDate}</span>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-slate-200 text-sm">
              <span className="font-bold text-slate-900">Total Amount:</span>
              <span className="font-mono font-black text-slate-950">
                Rs. {order.total.toLocaleString()}
              </span>
            </div>
          </div>
        ) : (
          <div className="bg-slate-50 p-4 rounded-xl text-xs text-slate-600">
            Order Reference: <strong>ST-2026-9281</strong>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() => navigateTo('order-tracking')}
            className="w-full sm:w-1/2 bg-slate-900 hover:bg-cyan-600 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
          >
            <Package className="w-4 h-4" />
            <span>Track Order Pipeline</span>
          </button>

          <button
            onClick={() => navigateTo('shop')}
            className="w-full sm:w-1/2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
