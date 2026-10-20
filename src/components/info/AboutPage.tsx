import React from 'react';
import { useStore } from '../../context/StoreContext';
import {
  ShieldCheck,
  CheckCircle2,
  Award,
  Truck,
  Users,
  Target,
  ArrowRight,
} from 'lucide-react';
import { HERO_IMAGE, PROMO_IMAGE } from '../../data/mockData';

export const AboutPage: React.FC = () => {
  const { navigateTo } = useStore();

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Hero Section */}
        <div className="bg-slate-900 rounded-3xl p-8 sm:p-14 text-white relative overflow-hidden">
          <div className="max-w-2xl space-y-4 relative z-10">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              About Veltrix Pakistan
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Pioneering Genuine Technology Retail.
            </h1>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              Founded to eliminate counterfeit electronics and misleading grey-market imports in Pakistan. We deliver authentic, PTA-approved gadgets with official manufacturer backing.
            </p>
          </div>
        </div>

        {/* Story & Mission Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-4 text-slate-700 text-sm leading-relaxed">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-600 block">
              Our Story
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Built by Pakistani Tech Purists, For Discerning Customers
            </h2>
            <p>
              In 2022, acquiring a genuine flagship smartphone, audiophile headphone, or high-tier ultrabook in Pakistan meant dealing with unverified street sellers, duplicate cables, and PTA tax confusion.
            </p>
            <p>
              Veltrix was created to establish a gold standard in consumer electronics. Today, operating temperature-controlled fulfillment hubs in <strong>Gulberg Lahore</strong> and <strong>Clifton Karachi</strong>, we dispatch to over 200 cities across Pakistan with zero tolerance for counterfeit parts.
            </p>
          </div>

          <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200">
            <img
              src={PROMO_IMAGE}
              alt="Veltrix Quality Testing"
              referrerPolicy="no-referrer"
              className="w-full h-80 object-cover"
            />
          </div>
        </div>

        {/* Mission & Vision Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-3">
            <div className="h-10 w-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Our Mission</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              To make cutting-edge global technology instantly accessible, transparently priced, and reliably supported across all provinces of Pakistan.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Our Vision</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              To be recognized as Pakistan’s most trustworthy e-commerce brand for consumer electronics, distinguished by our customer-first warranty commitment.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-3">
            <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Customer First</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Dedicated customer care available over WhatsApp and phone. 7-day hassle-free replacement on any manufacturing irregularity.
            </p>
          </div>
        </div>

        {/* Quality Promise Banner */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-12 shadow-xs">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-600">
              The Veltrix Guarantee
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Our 4 Pillars of Quality
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 text-xs text-slate-600">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block mb-0.5">Dual IMEI PTA Cleared:</strong>
                  Every phone sold comes with customs duties pre-settled and active network compliance.
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block mb-0.5">Tamper-Proof Packaging:</strong>
                  Bubble-lined antistatic casing with numbered security hologram tape.
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block mb-0.5">Transparent Verification:</strong>
                  Verified IBFT, JazzCash and Easypaisa slip audits to safeguard against transaction errors.
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block mb-0.5">Fast Courier Network:</strong>
                  Daily direct flights connecting Lahore, Karachi, Islamabad, and all hub cities.
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                onClick={() => navigateTo('shop')}
                className="px-6 py-3 bg-slate-900 hover:bg-cyan-600 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition-colors shadow-xs"
              >
                <span>Browse Veltrix Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
