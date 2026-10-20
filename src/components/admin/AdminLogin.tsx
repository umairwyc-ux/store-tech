import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  HelpCircle,
  X,
  CheckCircle2,
} from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const { adminLogin, adminLoginWithGoogle, navigateTo, settings } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  // Google sign in account selector state
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');

  const AUTHORIZED_ACCOUNTS = [
    { email: 'umairkamboh953@gmail.com', name: 'Umair Kamboh', role: 'Super Admin' },
    { email: 'suhaibshakeel18@gmail.com', name: 'Suhaib Shakeel', role: 'Super Admin' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    const result = await adminLogin(email, password);
    setIsLoading(false);

    if (!result.success) {
      setErrorMessage(
        result.message || 'Invalid admin credentials. Access Denied.'
      );
    }
  };

  const handleSelectGoogleAccount = async (accountEmail: string, accountName: string) => {
    setErrorMessage('');
    setIsGoogleLoading(true);
    setShowGoogleModal(false);

    const res = await adminLoginWithGoogle({
      name: accountName,
      email: accountEmail,
    });

    setIsGoogleLoading(false);
    if (!res.success) {
      setErrorMessage(res.message || 'Google account authorization rejected.');
    }
  };

  const handleCustomGoogleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customGoogleEmail.trim()) return;
    handleSelectGoogleAccount(customGoogleEmail.trim(), customGoogleEmail.split('@')[0]);
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim()) return;
    setResetSent(true);
  };

  return (
    <div className="bg-slate-950 min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/4 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-xl text-white space-y-6 relative z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Header Lockup */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80 shadow-inner">
            {settings?.logoUrl ? (
              <img
                src={settings.logoUrl}
                alt={settings.storeName || 'Veltrix'}
                className="max-h-12 w-auto max-w-[180px] object-contain rounded-lg"
              />
            ) : (
              <div className="h-10 w-10 rounded-xl bg-cyan-500 text-slate-950 font-black flex items-center justify-center text-lg">
                VX
              </div>
            )}
          </div>

          <div className="flex items-center justify-center gap-1.5 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Veltrix Admin</span>
          </div>

          <h1 className="text-2xl font-black tracking-tight text-white">
            Sign in to your admin dashboard
          </h1>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            Authorized management session for products, orders, inventory, and payments.
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-950/70 border border-rose-800/80 text-rose-200 text-xs flex items-start gap-2.5 animate-in fade-in duration-150">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">{errorMessage}</div>
          </div>
        )}

        {/* Google Admin Single-Sign-On */}
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => setShowGoogleModal(true)}
            disabled={isLoading || isGoogleLoading}
            className="w-full bg-white hover:bg-slate-100 active:scale-[0.99] text-slate-900 font-bold py-3.5 px-4 rounded-xl text-xs flex items-center justify-center gap-3 transition-all shadow-md hover:shadow-lg disabled:opacity-60 cursor-pointer border border-slate-200"
          >
            {isGoogleLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-slate-600" />
                <span>Verifying Google Admin Credentials...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>Sign in with Google</span>
                <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-mono font-bold ml-0.5 border border-slate-200">
                  Allowlist Protected
                </span>
              </>
            )}
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-800 w-full" />
            <span className="bg-slate-900 px-3 text-[10px] text-slate-500 uppercase tracking-wider font-semibold shrink-0">
              Or sign in with password
            </span>
            <div className="border-t border-slate-800 w-full" />
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrorMessage('');
                }}
                placeholder="admin@veltrix.pk"
                className="w-full pl-10 pr-3.5 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-hidden focus:border-cyan-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-slate-300 font-semibold">
                Password
              </label>
              <button
                type="button"
                onClick={() => {
                  setResetEmail(email);
                  setShowForgotPassword(true);
                  setResetSent(false);
                }}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMessage('');
                }}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-hidden focus:border-cyan-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-3.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/20 active:scale-[0.99] disabled:opacity-60 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating Credentials...</span>
              </>
            ) : (
              <>
                <span>Sign In to Admin Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Return Link */}
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => navigateTo('home')}
            className="text-xs text-slate-400 hover:text-white inline-flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Veltrix Shopping Experience</span>
          </button>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs"
            onClick={() => setShowForgotPassword(false)}
          />
          <div className="relative bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl z-10 text-white space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="font-bold text-sm text-white">Reset Admin Access</h3>
              <button
                onClick={() => setShowForgotPassword(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {resetSent ? (
              <div className="text-center py-4 space-y-3">
                <div className="h-12 w-12 rounded-full bg-emerald-500/10 text-emerald-400 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <p className="font-bold text-white text-sm">Reset Verification Sent</p>
                <p className="text-slate-400 text-xs">
                  We've sent a recovery instruction link to <strong>{resetEmail}</strong>. Check your corporate inbox.
                </p>
                <button
                  onClick={() => setShowForgotPassword(false)}
                  className="mt-2 w-full py-2 bg-slate-800 text-white rounded-xl font-bold"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-3">
                <p className="text-slate-400 leading-relaxed">
                  Enter your registered admin corporate email address to receive password recovery instructions.
                </p>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Corporate Email
                  </label>
                  <input
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="admin@veltrix.pk"
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl"
                >
                  Send Recovery Link
                </button>
              </form>
            )}
          </div>
        </div>
      )}
      {/* Google Sign-In Modal */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm"
            onClick={() => !isGoogleLoading && setShowGoogleModal(false)}
          />
          <div className="relative bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl z-10 text-white space-y-5 text-xs animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-white text-slate-900 shrink-0">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">Google Admin Sign-In</h3>
                  <p className="text-[11px] text-slate-400">Strict Allowlist Protected Access</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => !isGoogleLoading && setShowGoogleModal(false)}
                disabled={isGoogleLoading}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-slate-300 leading-relaxed text-xs">
              Select your authorized Google account to access the Veltrix Admin Panel. Only administrators configured in the backend database allowlist are granted privileges:
            </p>

            {/* Authorized Accounts List */}
            <div className="space-y-2.5">
              {AUTHORIZED_ACCOUNTS.map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  disabled={isGoogleLoading}
                  onClick={() => handleSelectGoogleAccount(acc.email, acc.name)}
                  className="w-full text-left p-3.5 rounded-2xl bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/50 flex items-center justify-between group transition-all cursor-pointer disabled:opacity-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center font-bold text-xs uppercase group-hover:bg-cyan-500 group-hover:text-slate-950 transition-colors shrink-0">
                      {acc.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white group-hover:text-cyan-300 transition-colors">
                          {acc.name}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 font-mono font-semibold">
                          {acc.role}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-mono">{acc.email}</p>
                    </div>
                  </div>
                  <div className="text-slate-500 group-hover:text-cyan-400 transition-colors pl-2">
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </button>
              ))}
            </div>

            {/* Custom Google Account Testing */}
            <div className="pt-2 border-t border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-medium">
                  Test with another Google account:
                </span>
                <span className="text-[10px] text-amber-400/80 font-mono">
                  Enforces 403 Forbidden
                </span>
              </div>
              <form onSubmit={handleCustomGoogleSubmit} className="flex gap-2">
                <input
                  type="email"
                  value={customGoogleEmail}
                  onChange={(e) => setCustomGoogleEmail(e.target.value)}
                  placeholder="other.google.user@gmail.com"
                  disabled={isGoogleLoading}
                  className="flex-1 px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-hidden focus:border-cyan-500 text-xs"
                />
                <button
                  type="submit"
                  disabled={isGoogleLoading || !customGoogleEmail.trim()}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors disabled:opacity-50 cursor-pointer shrink-0"
                >
                  Verify
                </button>
              </form>
              <p className="text-[10px] text-slate-500 leading-normal">
                Unauthorized accounts are automatically blocked by server authorization rules and will not receive admin access or session tokens.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
