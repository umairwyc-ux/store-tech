import React, { useState } from 'react';
import { useStore } from '../../../context/StoreContext';
import {
  ShieldCheck,
  KeyRound,
  User,
  Mail,
  Lock,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  LogOut,
  Clock,
  Shield,
  Smartphone,
  Check,
} from 'lucide-react';

export const ProfileTab: React.FC = () => {
  const { adminUser, updateAdminProfile, adminLogout, showToast } = useStore();

  const [name, setName] = useState(adminUser?.name || 'Veltrix Super Administrator');
  const [email, setEmail] = useState(adminUser?.email || 'admin@veltrix.pk');

  // Change Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [pwMessage, setPwMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleUpdateInfo = (e: React.FormEvent) => {
    e.preventDefault();
    const result = updateAdminProfile({ name, email });
    if (result.success) {
      showToast('Admin profile details updated.', 'success');
    } else {
      showToast(result.message, 'error');
    }
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPwMessage(null);

    if (newPassword.length < 6) {
      setPwMessage({ text: 'New password must be at least 6 characters.', type: 'error' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPwMessage({ text: 'New passwords do not match.', type: 'error' });
      return;
    }

    const result = updateAdminProfile({ password: newPassword });
    if (result.success) {
      setPwMessage({ text: 'Password successfully updated!', type: 'success' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      showToast('Admin password changed successfully.', 'success');
    } else {
      setPwMessage({ text: result.message, type: 'error' });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-150">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-white tracking-tight">Admin Profile & Access Control</h2>
        <p className="text-xs text-slate-400">
          Manage system administrator credentials, security preferences, and authenticated session permissions.
        </p>
      </div>

      {/* Profile Overview Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-cyan-500 text-slate-950 font-black text-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
            VX
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">{adminUser?.name || 'Super Administrator'}</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-950 text-cyan-400 border border-cyan-800 inline-flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Super Admin
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">{adminUser?.email || 'admin@veltrix.pk'}</p>
            <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-0.5">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                Active Session: Pakistan PKT
              </span>
              <span>·</span>
              <span className="text-emerald-400 font-semibold">Security Clearance Level 5</span>
            </div>
          </div>
        </div>

        <button
          onClick={adminLogout}
          className="px-4 py-2 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-200 text-xs font-bold flex items-center gap-1.5 transition-colors self-start sm:self-auto cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Terminate Session</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Edit Profile Details */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 text-xs">
          <div className="flex items-center gap-2 text-cyan-400 font-bold border-b border-slate-800 pb-3">
            <User className="w-4 h-4" />
            <h4 className="text-sm text-white">Administrator Details</h4>
          </div>

          <form onSubmit={handleUpdateInfo} className="space-y-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Display Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-hidden focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Corporate Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-hidden focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Assigned System Role</label>
              <input
                type="text"
                disabled
                value="Enterprise Super Administrator (Full Write / Audit Access)"
                className="w-full p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/60 text-slate-500 font-mono text-[11px]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Update Details</span>
            </button>
          </form>
        </div>

        {/* Card 2: Security & Password */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 text-xs">
          <div className="flex items-center gap-2 text-cyan-400 font-bold border-b border-slate-800 pb-3">
            <KeyRound className="w-4 h-4" />
            <h4 className="text-sm text-white">Change Admin Password</h4>
          </div>

          {pwMessage && (
            <div
              className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                pwMessage.type === 'success'
                  ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
                  : 'bg-rose-950/60 border-rose-800 text-rose-300'
              }`}
            >
              {pwMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              )}
              <span>{pwMessage.text}</span>
            </div>
          )}

          <form onSubmit={handleUpdatePassword} className="space-y-3.5">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Current Password</label>
              <div className="relative">
                <input
                  type={showCurrentPw ? 'text' : 'password'}
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-2.5 pr-9 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-hidden focus:border-cyan-500"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPw(!showCurrentPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showCurrentPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">New Secure Password</label>
              <div className="relative">
                <input
                  type={showNewPw ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-2.5 pr-9 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-hidden focus:border-cyan-500"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPw(!showNewPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Confirm New Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-hidden focus:border-cyan-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Save New Password</span>
            </button>
          </form>
        </div>
      </div>

      {/* Card 3: Authorized Google Accounts Allowlist */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-4 text-xs">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-cyan-400 font-bold">
            <Shield className="w-4 h-4" />
            <h4 className="text-sm text-white">Authorized Google Administrator Accounts</h4>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
            Backend Enforced
          </span>
        </div>

        <p className="text-slate-400 leading-relaxed">
          The following Google accounts are permanently authorized with Super Administrator privileges. Both accounts have full permissions to access the admin panel, manage products, view orders, and publish website settings and logos across all devices.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-bold flex items-center justify-center text-xs">
                UK
              </div>
              <div>
                <p className="font-bold text-white">Umair Kamboh</p>
                <p className="text-[11px] text-slate-400 font-mono">umairkamboh953@gmail.com</p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1">
              <Check className="w-3 h-3" />
              Authorized
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-bold flex items-center justify-center text-xs">
                SS
              </div>
              <div>
                <p className="font-bold text-white">Suhaib Shakeel</p>
                <p className="text-[11px] text-slate-400 font-mono">suhaibshakeel18@gmail.com</p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1">
              <Check className="w-3 h-3" />
              Authorized
            </span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-start gap-2.5 text-[11px] text-slate-400">
          <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <span>
            Security Rule: Any Google account not in this allowlist is strictly rejected at the backend API (<code className="text-cyan-300 font-mono">/api/auth/google</code>) with HTTP 403 Forbidden.
          </span>
        </div>
      </div>
    </div>
  );
};
