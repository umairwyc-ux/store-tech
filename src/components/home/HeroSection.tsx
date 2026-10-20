import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ArrowRight, Sparkles, ShieldCheck, Zap, Laptop, Smartphone, Headphones } from 'lucide-react';
import { HERO_IMAGE } from '../../data/mockData';

export const HeroSection: React.FC = () => {
  const { navigateTo, settings } = useStore();

  return (
    <section className="relative overflow-hidden bg-slate-950 text-white pt-12 pb-20 lg:pt-18 lg:pb-28">
      {/* Subtle Background Glows */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Text & CTA */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-cyan-400">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Official PTA Approved Tech & 100% Genuine</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1] text-balance">
              Smart Technology. <br />
              <span className="bg-linear-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">
                Better Shopping.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              {settings.heroSubtitle || `Discover the latest gadgets, electronics and accessories at ${settings.storeName || 'Veltrix'}. From flagship titanium smartphones to high-performance ultrabooks and studio audio.`}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                onClick={() => navigateTo('shop')}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm tracking-tight flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/20 active:scale-95"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => navigateTo('shop', { categoryId: 'earbuds' })}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-white font-semibold text-sm tracking-tight flex items-center justify-center gap-2 transition-all hover:border-slate-500 active:scale-95"
              >
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Explore Deals</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-4 text-left">
              <div>
                <p className="text-xs text-slate-400 font-medium">Nationwide Delivery</p>
                <p className="text-sm font-bold text-white mt-0.5">200+ Cities</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Warranty</p>
                <p className="text-sm font-bold text-white mt-0.5">Brand Verified</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Payment</p>
                <p className="text-sm font-bold text-white mt-0.5">COD Available</p>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Asset Showcase */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden border border-slate-800/80 bg-slate-900 shadow-2xl shadow-cyan-950/20 group">
              <img
                src={HERO_IMAGE}
                alt="Veltrix Ecosystem - Flagship Smartphone, Laptop, Smartwatch and Earbuds"
                referrerPolicy="no-referrer"
                className="w-full h-auto object-cover group-hover:scale-102 transition-transform duration-700"
              />

              {/* Scrim Overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

              {/* Floating Highlight Card */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-800 flex items-center justify-between text-white">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                    <Laptop className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Flagship Tech Collection 2026</p>
                    <p className="text-[11px] text-slate-400">Laptops, Phones & Studio Gear</p>
                  </div>
                </div>
                <button
                  onClick={() => navigateTo('shop')}
                  className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
                >
                  <span>Explore</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
