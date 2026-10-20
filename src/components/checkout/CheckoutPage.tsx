import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  PAKISTAN_CITIES,
  PAKISTAN_PROVINCES,
  sanitizeImageUrl,
  PHONE_IMAGE,
} from '../../data/mockData';
import {
  CreditCard,
  Truck,
  Upload,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Building2,
  Smartphone,
  ArrowRight,
  ArrowLeft,
  FileText,
} from 'lucide-react';
import { PaymentMethodType, OrderStatus } from '../../types';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    appliedCoupon,
    settings,
    createOrder,
    navigateTo,
    showToast,
    activeUser,
  } = useStore();

  // Form Fields
  const [fullName, setFullName] = useState(activeUser?.name || 'Muhammad Usman');
  const [phone, setPhone] = useState(activeUser?.phone || '0302-8472911');
  const [email, setEmail] = useState(activeUser?.email || 'usman.tech@gmail.com');
  const [address, setAddress] = useState('House #42, Street 8, Phase 5 DHA');
  const [city, setCity] = useState('Lahore');
  const [province, setProvince] = useState('Punjab');
  const [postalCode, setPostalCode] = useState('54792');
  const [notes, setNotes] = useState('');

  // Delivery Choice
  const [deliveryType, setDeliveryType] = useState<'standard' | 'express'>('standard');

  // Payment Choice
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('cod');

  // Payment proof details for online payment
  const [transactionId, setTransactionId] = useState('');
  const [accountSender, setAccountSender] = useState('');
  const [proofReceiptName, setProofReceiptName] = useState<string>('');
  const [proofReceiptDataUrl, setProofReceiptDataUrl] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 text-center">
        <h2 className="text-xl font-bold text-slate-900 mb-2">No items to checkout</h2>
        <p className="text-xs text-slate-500 mb-4">Your bag is empty. Please add products first.</p>
        <button
          onClick={() => navigateTo('shop')}
          className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold"
        >
          Browse Shop
        </button>
      </div>
    );
  }

  const isFreeDelivery = cartSubtotal >= settings.freeDeliveryThreshold;
  const deliveryFee =
    deliveryType === 'express'
      ? settings.expressDeliveryFee
      : isFreeDelivery
      ? 0
      : settings.standardDeliveryFee;

  const discountAmount = appliedCoupon
    ? appliedCoupon.discountType === 'percentage'
      ? Math.min(
          Math.round((cartSubtotal * appliedCoupon.discountValue) / 100),
          appliedCoupon.maxDiscount || Infinity
        )
      : appliedCoupon.discountValue
    : 0;

  const totalAmount = Math.max(0, cartSubtotal - discountAmount + deliveryFee);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('Image size exceeds 5MB limit. Please upload a smaller screenshot.', 'error');
        return;
      }
      setProofReceiptName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        setProofReceiptDataUrl(reader.result as string);
        showToast('Payment proof uploaded successfully.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || !phone.trim() || !email.trim() || !address.trim()) {
      showToast('Please fill in all required customer fields.', 'error');
      return;
    }

    // Phone validation warning
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      showToast('Please provide a valid Pakistani contact number.', 'error');
      return;
    }

    // Online payment check
    if (paymentMethod !== 'cod') {
      if (!transactionId.trim() && !proofReceiptDataUrl) {
        showToast(
          'For online payments, please provide a Transaction ID (TID) or upload the transfer slip.',
          'error'
        );
        return;
      }
    }

    setIsSubmitting(true);

    const initialOrderStatus: OrderStatus =
      paymentMethod === 'cod' ? 'Processing' : 'Payment Verification';

    const orderItems = cart.map((item) => ({
      productId: item.product.id,
      productName: item.product.name,
      variantName: item.selectedVariant?.name,
      price: item.product.price + (item.selectedVariant?.priceDelta || 0),
      quantity: item.quantity,
      image: item.product.images[0],
    }));

    const paymentProof =
      paymentMethod !== 'cod'
        ? {
            transactionId: transactionId.trim() || 'TID-' + Math.floor(10000000 + Math.random() * 90000000),
            accountSender: accountSender.trim() || fullName,
            receiptUrl: proofReceiptDataUrl || undefined,
            submittedAt: new Date().toISOString(),
            adminVerified: false,
          }
        : undefined;

    const newOrder = createOrder({
      customer: {
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        address: address.trim(),
        city,
        province,
        postalCode: postalCode.trim(),
        notes: notes.trim() || undefined,
      },
      items: orderItems,
      subtotal: cartSubtotal,
      discount: discountAmount,
      couponCode: appliedCoupon?.code,
      deliveryType,
      deliveryFee,
      total: totalAmount,
      paymentMethod,
      paymentProof,
      orderStatus: initialOrderStatus,
      paymentStatus: 'Pending',
      estimatedDeliveryDate:
        deliveryType === 'express'
          ? 'Within 24–48 Hours'
          : '2–3 Business Days',
    });

    setIsSubmitting(false);
    showToast(`Order #${newOrder.id} successfully created!`);
    navigateTo('order-success');
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
              Secure Checkout
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Guaranteed genuine products delivered safely to your doorstep.
            </p>
          </div>
          <button
            onClick={() => navigateTo('cart')}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-cyan-600"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Bag</span>
          </button>
        </div>

        <form onSubmit={handlePlaceOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Steps: Information, Delivery, Payment */}
            <div className="lg:col-span-7 space-y-6">
              {/* 1. Customer Information */}
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-4 shadow-xs">
                <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                  <div className="h-7 w-7 rounded-lg bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                    1
                  </div>
                  <h2 className="text-sm font-bold text-slate-900">
                    Customer Information & Address
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Muhammad Usman"
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:outline-hidden focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Phone Number (for Courier SMS) *
                    </label>
                    <input
                      type="text"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0300-1234567"
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:outline-hidden focus:border-cyan-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-slate-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="usman@example.com"
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:outline-hidden focus:border-cyan-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-slate-700 mb-1">
                      Complete Street Address / House / Flat *
                    </label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="House #, Street #, Sector / Phase / Area"
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:outline-hidden focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">City *</label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:outline-hidden focus:border-cyan-500 cursor-pointer"
                    >
                      {PAKISTAN_CITIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Province *
                    </label>
                    <select
                      value={province}
                      onChange={(e) => setProvince(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:outline-hidden focus:border-cyan-500 cursor-pointer"
                    >
                      {PAKISTAN_PROVINCES.map((pr) => (
                        <option key={pr} value={pr}>
                          {pr}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="e.g. 54000"
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:outline-hidden focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Order Notes (Optional)
                    </label>
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. Ring doorbell, call before arrival"
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:outline-hidden focus:border-cyan-500"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Delivery Options */}
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-4 shadow-xs">
                <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                  <div className="h-7 w-7 rounded-lg bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                    2
                  </div>
                  <h2 className="text-sm font-bold text-slate-900">
                    Delivery Speed & Carrier
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <label
                    onClick={() => setDeliveryType('standard')}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                      deliveryType === 'standard'
                        ? 'border-cyan-600 bg-cyan-50/40 ring-1 ring-cyan-500/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="deliveryType"
                      checked={deliveryType === 'standard'}
                      onChange={() => setDeliveryType('standard')}
                      className="mt-0.5 text-cyan-600"
                    />
                    <div>
                      <p className="font-bold text-slate-900 flex items-center justify-between">
                        <span>Standard Delivery</span>
                        <span className="font-mono tabular-nums text-cyan-700">
                          {isFreeDelivery ? 'FREE' : `Rs. ${settings.standardDeliveryFee}`}
                        </span>
                      </p>
                      <p className="text-slate-500 text-[11px] mt-1">
                        2–3 business days via TCS / Leopard Express across Pakistan.
                      </p>
                    </div>
                  </label>

                  <label
                    onClick={() => setDeliveryType('express')}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                      deliveryType === 'express'
                        ? 'border-cyan-600 bg-cyan-50/40 ring-1 ring-cyan-500/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="deliveryType"
                      checked={deliveryType === 'express'}
                      onChange={() => setDeliveryType('express')}
                      className="mt-0.5 text-cyan-600"
                    />
                    <div>
                      <p className="font-bold text-slate-900 flex items-center justify-between">
                        <span>Express Priority</span>
                        <span className="font-mono tabular-nums text-cyan-700">
                          Rs. {settings.expressDeliveryFee}
                        </span>
                      </p>
                      <p className="text-slate-500 text-[11px] mt-1">
                        Same-day dispatch; 24h arrival in major metropolitan hubs.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* 3. Payment Method */}
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-5 shadow-xs">
                <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                  <div className="h-7 w-7 rounded-lg bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                    3
                  </div>
                  <h2 className="text-sm font-bold text-slate-900">
                    Payment Method
                  </h2>
                </div>

                {/* Method Radios */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* COD */}
                  <label
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                      paymentMethod === 'cod'
                        ? 'border-cyan-600 bg-cyan-50/40 ring-1 ring-cyan-500/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="mt-0.5 text-cyan-600"
                    />
                    <div>
                      <p className="font-bold text-slate-900">Cash on Delivery (COD)</p>
                      <p className="text-slate-500 text-[11px] mt-0.5">
                        Pay cash directly to rider upon product delivery.
                      </p>
                    </div>
                  </label>

                  {/* Bank Transfer */}
                  <label
                    onClick={() => setPaymentMethod('bank_transfer')}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                      paymentMethod === 'bank_transfer'
                        ? 'border-cyan-600 bg-cyan-50/40 ring-1 ring-cyan-500/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'bank_transfer'}
                      onChange={() => setPaymentMethod('bank_transfer')}
                      className="mt-0.5 text-cyan-600"
                    />
                    <div>
                      <p className="font-bold text-slate-900">Direct Bank Transfer</p>
                      <p className="text-slate-500 text-[11px] mt-0.5">
                        Meezan Bank, HBL or Bank Alfalah IBFT transfer.
                      </p>
                    </div>
                  </label>

                  {/* JazzCash */}
                  <label
                    onClick={() => setPaymentMethod('jazzcash')}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                      paymentMethod === 'jazzcash'
                        ? 'border-cyan-600 bg-cyan-50/40 ring-1 ring-cyan-500/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'jazzcash'}
                      onChange={() => setPaymentMethod('jazzcash')}
                      className="mt-0.5 text-cyan-600"
                    />
                    <div>
                      <p className="font-bold text-slate-900">JazzCash Mobile Account</p>
                      <p className="text-slate-500 text-[11px] mt-0.5">
                        Instant transfer to Veltrix Till / Mobile Wallet.
                      </p>
                    </div>
                  </label>

                  {/* Easypaisa */}
                  <label
                    onClick={() => setPaymentMethod('easypaisa')}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                      paymentMethod === 'easypaisa'
                        ? 'border-cyan-600 bg-cyan-50/40 ring-1 ring-cyan-500/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'easypaisa'}
                      onChange={() => setPaymentMethod('easypaisa')}
                      className="mt-0.5 text-cyan-600"
                    />
                    <div>
                      <p className="font-bold text-slate-900">Easypaisa Wallet</p>
                      <p className="text-slate-500 text-[11px] mt-0.5">
                        Direct transfer to official Veltrix account.
                      </p>
                    </div>
                  </label>
                </div>

                {/* Online Payment Instructions & Upload Proof Area */}
                {paymentMethod !== 'cod' && (
                  <div className="bg-slate-900 text-white rounded-2xl p-5 space-y-4 animate-in fade-in duration-200">
                    <div className="flex items-start gap-2.5">
                      <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div className="text-xs">
                        <p className="font-bold text-white">Payment Instructions:</p>
                        <p className="text-slate-300 mt-0.5">
                          Please transfer{' '}
                          <strong className="text-cyan-400 font-mono">
                            Rs. {totalAmount.toLocaleString()}
                          </strong>{' '}
                          to the credentials below, then submit your transaction receipt.
                        </p>
                      </div>
                    </div>

                    {/* Bank / Wallet Details */}
                    {paymentMethod === 'bank_transfer' && (
                      <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs space-y-1.5 font-mono">
                        <p className="text-slate-400">
                          Bank Name:{' '}
                          <span className="text-white font-bold">
                            {settings.bankDetails.bankName}
                          </span>
                        </p>
                        <p className="text-slate-400">
                          Account Title:{' '}
                          <span className="text-white font-bold">
                            {settings.bankDetails.accountTitle}
                          </span>
                        </p>
                        <p className="text-slate-400">
                          Account Number:{' '}
                          <span className="text-cyan-400 font-bold">
                            {settings.bankDetails.accountNumber}
                          </span>
                        </p>
                        <p className="text-slate-400">
                          IBAN:{' '}
                          <span className="text-white font-bold">
                            {settings.bankDetails.iban}
                          </span>
                        </p>
                        <p className="text-slate-400">
                          Branch:{' '}
                          <span className="text-white">
                            {settings.bankDetails.branchCode}
                          </span>
                        </p>
                      </div>
                    )}

                    {paymentMethod === 'jazzcash' && (
                      <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs space-y-1.5 font-mono">
                        <p className="text-slate-400">
                          JazzCash Account:{' '}
                          <span className="text-white font-bold">
                            {settings.jazzCashDetails.accountTitle}
                          </span>
                        </p>
                        <p className="text-slate-400">
                          Mobile Number:{' '}
                          <span className="text-cyan-400 font-bold">
                            {settings.jazzCashDetails.mobileNumber}
                          </span>
                        </p>
                        <p className="text-slate-400">
                          Till ID:{' '}
                          <span className="text-white font-bold">
                            {settings.jazzCashDetails.tillNumber}
                          </span>
                        </p>
                      </div>
                    )}

                    {paymentMethod === 'easypaisa' && (
                      <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs space-y-1.5 font-mono">
                        <p className="text-slate-400">
                          Easypaisa Account:{' '}
                          <span className="text-white font-bold">
                            {settings.easyPaisaDetails.accountTitle}
                          </span>
                        </p>
                        <p className="text-slate-400">
                          Mobile Number:{' '}
                          <span className="text-cyan-400 font-bold">
                            {settings.easyPaisaDetails.mobileNumber}
                          </span>
                        </p>
                      </div>
                    )}

                    {/* Proof Inputs */}
                    <div className="space-y-3 pt-2 border-t border-slate-800">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div>
                          <label className="block text-slate-300 font-medium mb-1">
                            Transaction ID / Ref # *
                          </label>
                          <input
                            type="text"
                            value={transactionId}
                            onChange={(e) => setTransactionId(e.target.value)}
                            placeholder="e.g. TID-9821428"
                            className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-hidden focus:border-cyan-500"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-300 font-medium mb-1">
                            Sender Account Name / Number
                          </label>
                          <input
                            type="text"
                            value={accountSender}
                            onChange={(e) => setAccountSender(e.target.value)}
                            placeholder="e.g. Asad (0300...)"
                            className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-hidden focus:border-cyan-500"
                          />
                        </div>
                      </div>

                      {/* File Upload Attachment */}
                      <div>
                        <label className="block text-slate-300 text-xs font-medium mb-1">
                          Upload Transfer Receipt / Screenshot
                        </label>
                        <div className="flex items-center gap-3">
                          <label className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-semibold transition-colors border border-slate-700">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Select Screenshot</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleFileUpload}
                              className="hidden"
                            />
                          </label>
                          {proofReceiptName && (
                            <span className="text-xs text-slate-300 flex items-center gap-1.5 truncate max-w-xs">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              <span className="truncate">{proofReceiptName}</span>
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="p-2.5 rounded-lg bg-amber-950/40 border border-amber-800/60 text-[11px] text-amber-300">
                        Notice: Online payment orders enter <strong>Payment Verification</strong> status until verified by the Veltrix finance admin.
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Order Summary Sidebar */}
            <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-xs sticky top-24">
              <h2 className="text-base font-extrabold text-slate-950 tracking-tight">
                Order Items ({cart.length})
              </h2>

              {/* Items List */}
              <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto pr-1">
                {cart.map((item) => {
                  const unitPrice =
                    item.product.price + (item.selectedVariant?.priceDelta || 0);
                  const lineTotal = unitPrice * item.quantity;
                  return (
                    <div
                      key={`${item.product.id}-${item.selectedVariant?.id || 'def'}`}
                      className="py-3 flex items-center gap-3 text-xs"
                    >
                      <img
                        src={sanitizeImageUrl(item.product?.images?.[0]) || PHONE_IMAGE}
                        alt={item.product?.name || 'Product'}
                        onError={(e) => {
                          if (e.currentTarget.src !== PHONE_IMAGE) {
                            e.currentTarget.src = PHONE_IMAGE;
                          }
                        }}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-xl object-cover bg-slate-100 shrink-0 border border-slate-200/60"
                      />
                      <div className="grow min-w-0">
                        <p className="font-bold text-slate-900 truncate">
                          {item.product.name}
                        </p>
                        {item.selectedVariant && (
                          <p className="text-[11px] text-slate-500 truncate">
                            {item.selectedVariant.name}
                          </p>
                        )}
                        <p className="text-[11px] text-slate-400">
                          Qty: {item.quantity} × Rs. {unitPrice.toLocaleString()}
                        </p>
                      </div>
                      <span className="font-mono tabular-nums font-bold text-slate-900 shrink-0">
                        Rs. {lineTotal.toLocaleString()}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Bill Details */}
              <div className="space-y-2 text-xs text-slate-600 pt-4 border-t border-slate-100">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono tabular-nums text-slate-900 font-semibold">
                    Rs. {cartSubtotal.toLocaleString()}
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Coupon ({appliedCoupon?.code})</span>
                    <span className="font-mono tabular-nums font-semibold">
                      - Rs. {discountAmount.toLocaleString()}
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Delivery ({deliveryType.toUpperCase()})</span>
                  <span className="font-mono tabular-nums text-slate-900 font-semibold">
                    {deliveryFee === 0 ? 'FREE' : `Rs. ${deliveryFee}`}
                  </span>
                </div>

                <div className="flex justify-between text-base font-black text-slate-950 pt-3 border-t border-slate-100">
                  <span>Total Amount</span>
                  <span className="font-mono tabular-nums text-cyan-700">
                    Rs. {totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-slate-900 hover:bg-cyan-600 text-white font-bold py-4 px-6 rounded-2xl text-xs flex items-center justify-center gap-2 transition-all shadow-xl shadow-slate-900/10 active:scale-[0.99] disabled:opacity-50"
              >
                <span>Place Order (Rs. {totalAmount.toLocaleString()})</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="space-y-1.5 text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>100% genuine brand warranty certified</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                  <span>Dispatched via official insured air logistics</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
