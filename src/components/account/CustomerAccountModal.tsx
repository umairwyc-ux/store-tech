import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { X, Lock, Mail, User, Phone, ArrowRight, ShieldCheck } from 'lucide-react';

export const CustomerAccountModal: React.FC = () => {
  const {
    isAccountModalOpen,
    setIsAccountModalOpen,
    customerLogin,
    customerRegister,
    navigateTo,
    showToast,
  } = useStore();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('usman.tech@gmail.com');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('Muhammad Usman');
  const [phone, setPhone] = useState('0302-8472911');

  if (!isAccountModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
      if (!email.trim()) {
        showToast('Please enter your email.', 'error');
        return;
      }
      customerLogin(email.trim());
      setIsAccountModalOpen(false);
      navigateTo('account');
    } else {
      if (!name.trim() || !email.trim() || !phone.trim()) {
        showToast('Please fill in all fields.', 'error');
        return;
      }
      customerRegister(name.trim(), email.trim(), phone.trim());
      setIsAccountModalOpen(false);
      navigateTo('account');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
        onClick={() => setIsAccountModalOpen(false)}
      />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl z-10 border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={() => setIsAccountModalOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Close Account Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 mb-6 pb-2">
          <button
            onClick={() => setMode('login')}
            className={`pb-2 px-3 text-sm font-bold border-b-2 transition-colors ${
              mode === 'login'
                ? 'border-cyan-600 text-cyan-600'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode('register')}
            className={`pb-2 px-3 text-sm font-bold border-b-2 transition-colors ${
              mode === 'register'
                ? 'border-cyan-600 text-cyan-600'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            Create Account
          </button>
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-1">
            {mode === 'login' ? 'Welcome Back' : 'Join Veltrix'}
          </h2>
          <p className="text-xs text-slate-500 mb-6">
            {mode === 'login'
              ? 'Access your orders, track shipments, and manage saved addresses.'
              : 'Sign up to track orders across Pakistan and get exclusive discounts.'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {mode === 'register' && (
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Full Name:
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Muhammad Usman"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-hidden focus:border-cyan-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Email Address:
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usman@example.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-hidden focus:border-cyan-500"
                />
              </div>
            </div>

            {mode === 'register' && (
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Mobile Number:
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0300-1234567"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-hidden focus:border-cyan-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Password:
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-hidden focus:border-cyan-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-cyan-600 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              <span>{mode === 'login' ? 'Sign In to Account' : 'Create My Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Customer Button */}
          <div className="mt-4 pt-3 border-t border-slate-100 text-center space-y-2">
            <button
              onClick={() => {
                customerLogin('usman.tech@gmail.com');
                setIsAccountModalOpen(false);
                navigateTo('account');
              }}
              className="text-xs font-semibold text-cyan-600 hover:text-cyan-700 block mx-auto"
            >
              1-Click Demo Login as "Muhammad Usman"
            </button>
            <div className="pt-1">
              <button
                onClick={() => {
                  setIsAccountModalOpen(false);
                  navigateTo('admin');
                }}
                className="text-[11px] text-slate-500 hover:text-slate-800 font-medium inline-flex items-center gap-1 transition-colors"
              >
                <ShieldCheck className="w-3 h-3 text-cyan-600" />
                <span>Veltrix Operations? Go to Admin Portal</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
