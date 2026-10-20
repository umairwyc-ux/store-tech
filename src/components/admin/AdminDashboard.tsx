import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Layers,
  CreditCard,
  MessageSquare,
  Tag,
  Boxes,
  TrendingUp,
  Settings,
  UserCheck,
  LogOut,
  Menu,
  X,
  Search,
  Bell,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  ChevronDown,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Check,
} from 'lucide-react';
import { AdminTab, Order } from '../../types';

// Tab Components
import { OverviewTab } from './tabs/OverviewTab';
import { ProductsTab } from './tabs/ProductsTab';
import { OrdersTab } from './tabs/OrdersTab';
import { CustomersTab } from './tabs/CustomersTab';
import { CategoriesTab } from './tabs/CategoriesTab';
import { PaymentsTab } from './tabs/PaymentsTab';
import { ReviewsTab } from './tabs/ReviewsTab';
import { CouponsTab } from './tabs/CouponsTab';
import { InventoryTab } from './tabs/InventoryTab';
import { AnalyticsTab } from './tabs/AnalyticsTab';
import { SettingsTab } from './tabs/SettingsTab';
import { ProfileTab } from './tabs/ProfileTab';

export const AdminDashboard: React.FC = () => {
  const {
    adminUser,
    adminLogout,
    activeAdminTab,
    setActiveAdminTab,
    navigateTo,
    adminNotifications,
    unreadNotificationsCount,
    markNotificationRead,
    clearAllNotifications,
    orders,
    products,
    reviews,
  } = useStore();

  // Sidebar states
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Top Bar Dropdowns
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // Cross-tab selected order
  const [selectedOrderForAudit, setSelectedOrderForAudit] = useState<Order | null>(null);

  // Top bar search state
  const [globalSearch, setGlobalSearch] = useState('');

  // Badges calculation
  const pendingOrdersCount = orders.filter(
    (o) => o.orderStatus === 'Pending' || o.orderStatus === 'Payment Verification'
  ).length;

  const lowStockCount = products.filter(
    (p) => p.stock < 10
  ).length;

  const pendingReviewsCount = reviews.filter(
    (r) => r.status === 'pending' || (!r.isApproved && r.status !== 'hidden')
  ).length;

  // Sidebar nav items
  const navItems = [
    {
      id: 'dashboard' as AdminTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'products' as AdminTab,
      label: 'Products',
      icon: Package,
      badge: products.length,
      badgeColor: 'bg-slate-800 text-slate-400',
    },
    {
      id: 'orders' as AdminTab,
      label: 'Orders',
      icon: ShoppingBag,
      badge: pendingOrdersCount > 0 ? pendingOrdersCount : null,
      badgeColor: 'bg-amber-500 text-slate-950 font-bold',
    },
    {
      id: 'customers' as AdminTab,
      label: 'Customers',
      icon: Users,
      badge: null,
    },
    {
      id: 'categories' as AdminTab,
      label: 'Categories',
      icon: Layers,
      badge: null,
    },
    {
      id: 'payments' as AdminTab,
      label: 'Payments',
      icon: CreditCard,
      badge: null,
    },
    {
      id: 'reviews' as AdminTab,
      label: 'Reviews',
      icon: MessageSquare,
      badge: pendingReviewsCount > 0 ? pendingReviewsCount : null,
      badgeColor: 'bg-cyan-500 text-slate-950 font-bold',
    },
    {
      id: 'coupons' as AdminTab,
      label: 'Coupons',
      icon: Tag,
      badge: null,
    },
    {
      id: 'inventory' as AdminTab,
      label: 'Inventory',
      icon: Boxes,
      badge: lowStockCount > 0 ? lowStockCount : null,
      badgeColor: 'bg-rose-500 text-white font-bold',
    },
    {
      id: 'analytics' as AdminTab,
      label: 'Analytics',
      icon: TrendingUp,
      badge: null,
    },
    {
      id: 'settings' as AdminTab,
      label: 'Website Settings',
      icon: Settings,
      badge: null,
    },
    {
      id: 'profile' as AdminTab,
      label: 'Admin Profile',
      icon: UserCheck,
      badge: null,
    },
  ];

  // Title & breadcrumb helper
  const getCurrentTitle = () => {
    const item = navItems.find((n) => n.id === activeAdminTab);
    return item ? item.label : 'Dashboard';
  };

  const handleSelectTab = (tab: AdminTab) => {
    setActiveAdminTab(tab);
    setIsMobileMenuOpen(false);
  };

  const handleOpenOrderFromOverview = (order: Order) => {
    setSelectedOrderForAudit(order);
    setActiveAdminTab('orders');
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* 1. TOP BAR */}
      <header className="h-16 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40">
        {/* Left Side: Mobile Menu Button + Breadcrumbs & Title */}
        <div className="flex items-center gap-3">
          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Desktop Toggle Button */}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="hidden md:flex p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
            title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          <div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
              <span className="hover:text-slate-400 cursor-pointer" onClick={() => setActiveAdminTab('dashboard')}>
                Admin
              </span>
              <span>/</span>
              <span className="text-cyan-400 font-semibold capitalize">{getCurrentTitle()}</span>
            </div>
            <h1 className="text-sm sm:text-base font-bold text-white tracking-tight leading-tight">
              {getCurrentTitle()}
            </h1>
          </div>
        </div>

        {/* Right Side: Global Search + Notifications + Profile Menu + Storefront Link */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Live Store Front Button */}
          <button
            onClick={() => navigateTo('home')}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700/80 hover:border-cyan-500/80 bg-slate-800/40 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
            <span>Customer Store</span>
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setIsNotificationsOpen(!isNotificationsOpen);
                setIsProfileMenuOpen(false);
              }}
              className="relative p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              aria-label="Admin Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 min-w-4 px-1 rounded-full bg-cyan-500 text-slate-950 text-[10px] font-black flex items-center justify-center animate-pulse">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {isNotificationsOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setIsNotificationsOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-40 p-3 space-y-2 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800 px-1">
                    <span className="font-bold text-white">Notifications</span>
                    {adminNotifications.length > 0 && (
                      <button
                        onClick={clearAllNotifications}
                        className="text-[11px] text-cyan-400 hover:underline"
                      >
                        Clear All
                      </button>
                    )}
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/60">
                    {adminNotifications.length === 0 ? (
                      <div className="py-6 text-center text-slate-500">
                        No new notifications.
                      </div>
                    ) : (
                      adminNotifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => {
                            markNotificationRead(n.id);
                            if (n.linkTab) setActiveAdminTab(n.linkTab);
                            setIsNotificationsOpen(false);
                          }}
                          className={`p-2.5 rounded-xl cursor-pointer transition-colors ${
                            n.isRead ? 'opacity-60 hover:bg-slate-800/30' : 'bg-slate-800/60 hover:bg-slate-800'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-bold text-white block text-[11px]">{n.title}</span>
                            <span className="text-[10px] text-slate-500 whitespace-nowrap">{n.timestamp}</span>
                          </div>
                          <p className="text-[11px] text-slate-300 mt-0.5 line-clamp-2">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Admin Profile Dropdown Menu */}
          <div className="relative">
            <button
              onClick={() => {
                setIsProfileMenuOpen(!isProfileMenuOpen);
                setIsNotificationsOpen(false);
              }}
              className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 transition-colors text-left"
            >
              <div className="h-7 w-7 rounded-lg bg-cyan-500 text-slate-950 font-black flex items-center justify-center text-xs shadow-xs">
                ST
              </div>
              <div className="hidden sm:block">
                <span className="text-xs font-bold text-white block leading-tight">
                  Super Admin
                </span>
                <span className="text-[10px] text-cyan-400 font-semibold block leading-tight">
                  Verified Ops
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            {isProfileMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setIsProfileMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-52 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-40 py-1.5 text-xs">
                  <div className="px-3.5 py-2 border-b border-slate-800">
                    <p className="font-bold text-white">{adminUser?.name || 'Administrator'}</p>
                    <p className="text-[11px] text-slate-400 truncate">{adminUser?.email || 'admin@veltrix.pk'}</p>
                  </div>

                  <button
                    onClick={() => {
                      setActiveAdminTab('profile');
                      setIsProfileMenuOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center gap-2 transition-colors"
                  >
                    <UserCheck className="w-4 h-4 text-cyan-400" />
                    <span>My Admin Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveAdminTab('settings');
                      setIsProfileMenuOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center gap-2 transition-colors"
                  >
                    <Settings className="w-4 h-4 text-slate-400" />
                    <span>Website Settings</span>
                  </button>

                  <button
                    onClick={() => {
                      navigateTo('home');
                      setIsProfileMenuOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center gap-2 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 text-slate-400" />
                    <span>Customer Store Front</span>
                  </button>

                  <div className="border-t border-slate-800 my-1" />

                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      adminLogout();
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-rose-950/60 text-rose-400 flex items-center gap-2 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 2. BODY LAYOUT: COLLAPSIBLE SIDEBAR + MAIN WORKSPACE */}
      <div className="flex-1 flex overflow-hidden">
        {/* DESKTOP SIDEBAR */}
        <aside
          className={`hidden md:flex flex-col border-r border-slate-800 bg-slate-900/60 transition-all duration-200 shrink-0 ${
            isSidebarCollapsed ? 'w-20' : 'w-64'
          }`}
        >
          {/* Veltrix Logo Lockup */}
          <div className="p-4 border-b border-slate-800 flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-cyan-500 text-slate-950 font-black flex items-center justify-center text-sm shadow-md shadow-cyan-500/20 shrink-0">
              VX
            </div>
            {!isSidebarCollapsed && (
              <div className="overflow-hidden">
                <span className="font-extrabold text-sm text-white tracking-tight block truncate">
                  Veltrix
                </span>
                <span className="text-[10px] text-cyan-400 font-semibold tracking-wider uppercase block truncate">
                  Admin Console
                </span>
              </div>
            )}
          </div>

          {/* Nav List */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeAdminTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  title={isSidebarCollapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all group ${
                    isActive
                      ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-slate-950' : 'group-hover:text-cyan-400'}`} />
                  {!isSidebarCollapsed && <span className="truncate">{item.label}</span>}

                  {!isSidebarCollapsed && item.badge !== null && (
                    <span
                      className={`ml-auto text-[10px] px-1.5 py-0.2 rounded-full tabular-nums ${
                        item.badgeColor || 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Bottom Logout */}
          <div className="p-3 border-t border-slate-800">
            <button
              onClick={adminLogout}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-950/60 hover:text-rose-300 transition-colors ${
                isSidebarCollapsed ? 'justify-center' : ''
              }`}
              title="Sign Out"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              {!isSidebarCollapsed && <span>Sign Out</span>}
            </button>
          </div>
        </aside>

        {/* MOBILE SLIDE-OUT DRAWER */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Menu Content */}
            <div className="relative w-72 max-w-[80vw] bg-slate-900 border-r border-slate-800 h-full flex flex-col p-4 z-10 shadow-2xl animate-in slide-in-from-left duration-200">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-cyan-500 text-slate-950 font-black flex items-center justify-center text-sm">
                    VX
                  </div>
                  <div>
                    <span className="font-bold text-white text-sm block">Veltrix Admin</span>
                    <span className="text-[10px] text-cyan-400">Mobile Console</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 py-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeAdminTab === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectTab(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-cyan-500 text-slate-950 font-black'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                      {item.badge !== null && (
                        <span className={`ml-auto text-[10px] px-1.5 py-0.2 rounded-full ${item.badgeColor || 'bg-slate-800 text-slate-400'}`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-slate-800 space-y-2">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigateTo('home');
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-2"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Go to Store Front</span>
                </button>

                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    adminLogout();
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-rose-950/80 text-rose-300 text-xs font-bold flex items-center gap-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 3. MAIN WORKSPACE */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-950">
          <div className="max-w-7xl mx-auto pb-16">
            {activeAdminTab === 'dashboard' && (
              <OverviewTab onOpenOrder={handleOpenOrderFromOverview} />
            )}

            {activeAdminTab === 'products' && <ProductsTab />}

            {activeAdminTab === 'orders' && (
              <OrdersTab initialSelectedOrder={selectedOrderForAudit} />
            )}

            {activeAdminTab === 'customers' && <CustomersTab />}

            {activeAdminTab === 'categories' && <CategoriesTab />}

            {activeAdminTab === 'payments' && <PaymentsTab />}

            {activeAdminTab === 'reviews' && <ReviewsTab />}

            {activeAdminTab === 'coupons' && <CouponsTab />}

            {activeAdminTab === 'inventory' && <InventoryTab />}

            {activeAdminTab === 'analytics' && <AnalyticsTab />}

            {activeAdminTab === 'settings' && <SettingsTab />}

            {activeAdminTab === 'profile' && <ProfileTab />}
          </div>
        </main>
      </div>
    </div>
  );
};
