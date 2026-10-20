import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  Search,
  Heart,
  User as UserIcon,
  ShoppingBag,
  Menu,
  X,
  ChevronRight,
  ShieldCheck,
  Package,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    activePage,
    navigateTo,
    cartCount,
    wishlistCount,
    setIsCartOpen,
    setIsSearchOpen,
    setIsAccountModalOpen,
    activeUser,
    isAdminAuthenticated,
    settings,
  } = useStore();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', page: 'home' as const },
    { label: 'Shop', page: 'shop' as const },
    { label: 'Deals', page: 'shop' as const, filter: 'deals' },
    { label: 'New Arrivals', page: 'shop' as const, filter: 'new' },
    { label: 'Track Order', page: 'order-tracking' as const },
    { label: 'About Us', page: 'about' as const },
    { label: 'Contact', page: 'contact' as const },
  ];

  return (
    <>
      {/* Top Notification Trust Micro-Bar */}
      <div className="bg-slate-950 text-slate-300 text-[11px] font-medium tracking-wide py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-slate-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
              Free Express Delivery on orders above Rs. 15,000 across Pakistan
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-5 text-slate-400">
            <span>UAN: +92 42 35879201</span>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => navigateTo('order-tracking')}
              className="hover:text-white transition-colors"
            >
              Order Tracking
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => navigateTo('admin')}
              className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              {isAdminAuthenticated ? 'Admin Console (Live)' : 'Admin Portal'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-200 border-b ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md border-slate-200/90 shadow-xs'
            : 'bg-white border-slate-200/70'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigateTo('home')}
              className="group flex items-center gap-2.5 text-left focus-visible:outline-hidden"
              aria-label="Veltrix Home"
            >
              <div className="h-9 w-9 rounded-lg bg-slate-900 flex items-center justify-center text-white font-black text-lg tracking-tighter shadow-xs group-hover:bg-cyan-600 transition-colors">
                VX
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-cyan-600 transition-colors block leading-tight">
                  {settings.storeName || 'Veltrix'}
                </span>
                <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase block">
                  Pakistan
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => {
              const isActive = activePage === link.page && !link.filter;
              return (
                <button
                  key={link.label}
                  onClick={() => {
                    if (link.filter === 'deals') {
                      navigateTo('shop');
                    } else if (link.filter === 'new') {
                      navigateTo('shop');
                    } else {
                      navigateTo(link.page);
                    }
                  }}
                  className={`text-sm font-semibold tracking-tight transition-colors py-1 relative ${
                    isActive
                      ? 'text-cyan-600'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-600 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Interactive Action Affordances */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 sm:px-3 sm:py-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center gap-2 text-sm"
              aria-label="Search tech catalog"
            >
              <Search className="w-5 h-5 text-slate-600" />
              <span className="hidden xl:inline text-xs text-slate-400 font-medium">
                Search products...
              </span>
            </button>

            {/* Wishlist */}
            <button
              onClick={() => navigateTo('wishlist')}
              className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 h-4 min-w-4 px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center tabular-nums">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Account */}
            <button
              onClick={() => {
                if (activeUser) {
                  navigateTo('account');
                } else {
                  setIsAccountModalOpen(true);
                }
              }}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center gap-1.5"
              aria-label="User Account"
            >
              <UserIcon className="w-5 h-5" />
              {activeUser && (
                <span className="hidden md:inline text-xs font-semibold text-slate-800 max-w-[90px] truncate">
                  {activeUser.name.split(' ')[0]}
                </span>
              )}
            </button>

            {/* Cart Drawer Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 bg-slate-900 hover:bg-cyan-600 text-white px-3.5 py-2 rounded-lg text-xs font-semibold tracking-tight transition-all shadow-xs"
              aria-label="Shopping Bag"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Bag</span>
              <span className="h-4.5 min-w-4.5 px-1 rounded-full bg-cyan-400 text-slate-950 text-[10px] font-black flex items-center justify-center tabular-nums">
                {cartCount}
              </span>
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Open navigation menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Slide-out Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer content */}
          <div className="relative ml-auto w-full max-w-xs bg-white h-full shadow-2xl flex flex-col z-10 overflow-y-auto">
            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-slate-900 flex items-center justify-center text-white font-extrabold text-sm">
                  VX
                </div>
                <span className="font-bold text-slate-900">{settings.storeName || 'Veltrix'}</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Links */}
            <div className="p-4 space-y-1">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigateTo(link.page);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:text-cyan-600 hover:bg-slate-50 transition-colors"
                >
                  <span>{link.label}</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              ))}

              <div className="pt-4 border-t border-slate-100 mt-4 space-y-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigateTo('wishlist');
                  }}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  <span className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-rose-500" />
                    Wishlist
                  </span>
                  <span className="text-xs font-bold text-slate-700 tabular-nums">
                    {wishlistCount}
                  </span>
                </button>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigateTo('order-tracking');
                  }}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  <span className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-slate-500" />
                    Track Order
                  </span>
                </button>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigateTo('admin');
                  }}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold text-cyan-700 bg-cyan-50/70 hover:bg-cyan-100"
                >
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-cyan-600" />
                    Admin Console
                  </span>
                  <span className="text-[11px] font-bold text-cyan-700">Protected</span>
                </button>
              </div>
            </div>

            {/* Bottom contact info */}
            <div className="mt-auto p-4 border-t border-slate-100 bg-slate-50 text-xs text-slate-500 space-y-1">
              <p className="font-semibold text-slate-800">{settings.storeName || 'Veltrix'} Pakistan</p>
              <p>Helpline: +92 42 35879201</p>
              <p>WhatsApp: +92 300 1234567</p>
              <p className="text-[11px] text-slate-400 pt-1">
                Cash on Delivery & Bank Transfer nationwide
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
