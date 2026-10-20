import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  Truck,
  ArrowRight,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigateTo, settings, showToast } = useStore();
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }
    showToast('Subscribed! You will receive VIP tech deals and launch updates.');
    setNewsletterEmail('');
  };

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Feature Badges Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Nationwide Shipping</h4>
              <p className="text-xs text-slate-400">TCS & Leopard Express 1-3 Days</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">100% Genuine Tech</h4>
              <p className="text-xs text-slate-400">Authentic & PTA Approved</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-blue-400 shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Flexible Payments</h4>
              <p className="text-xs text-slate-400">COD, JazzCash, Easypaisa & IBFT</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-400 shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Official Warranty</h4>
              <p className="text-xs text-slate-400">7-Day Replacement Support</p>
            </div>
          </div>
        </div>

        {/* 4-Column Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-12 border-b border-slate-800/80">
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-cyan-500 text-slate-950 font-black flex items-center justify-center text-base">
                VX
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                {settings.storeName || 'Veltrix'}
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Pakistan's premium electronics retail destination. We source genuine, factory-sealed gadgets, flagship smartphones, ultrabooks, and high-fidelity audio equipment with transparent PTA compliance and nationwide warranty.
            </p>
            <div className="space-y-2 pt-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>{settings.storeAddress}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>{settings.contactNumber} / UAN 111-VELTRIX</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>{settings.email}</span>
              </div>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Categories
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
              <li>
                <button
                  onClick={() => navigateTo('shop', { categoryId: 'smartphones' })}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Flagship Smartphones
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('shop', { categoryId: 'laptops' })}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Ultrabooks & Laptops
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('shop', { categoryId: 'smart-watches' })}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Smart Watches & Fitness
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('shop', { categoryId: 'earbuds' })}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Wireless ANC Earbuds
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('shop', { categoryId: 'headphones' })}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Studio Headphones
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('shop', { categoryId: 'gaming' })}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Gaming Gear & Keyboards
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('shop', { categoryId: 'chargers-cables' })}
                  className="hover:text-cyan-400 transition-colors"
                >
                  GaN Chargers & Cables
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Support */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Support & Policies
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
              <li>
                <button
                  onClick={() => navigateTo('order-tracking')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Track Your Order
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('about')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Our Story & Promise
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('contact')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Contact & Store Location
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('contact')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Shipping & Return Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('contact')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Warranty Claim Procedure
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('admin')}
                  className="text-cyan-400 hover:underline"
                >
                  Admin Portal Login
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase">
              Stay Connected
            </h4>
            <p className="text-xs text-slate-400">
              Get notified of flash discount drops, flash sales, and new gadget releases in Pakistan.
            </p>
            <form onSubmit={handleNewsletter} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-cyan-500"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 bottom-1 px-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-md text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <span>Join</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </form>
            <div className="pt-2">
              <p className="text-[11px] text-slate-500">
                Payment Partners: JazzCash, Easypaisa, Meezan Bank, HBL, Bank Alfalah & Cash on Delivery.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 {settings.storeName || 'Veltrix'} Pakistan. All Rights Reserved. Reg. No. 0184920.</p>
          <div className="flex items-center gap-4">
            <span>Karachi & Lahore Fulfillment Centers</span>
            <span aria-hidden="true">·</span>
            <span>PTA Compliance Certified</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
