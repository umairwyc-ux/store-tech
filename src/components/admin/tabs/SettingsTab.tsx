import React, { useState } from 'react';
import { useStore } from '../../../context/StoreContext';
import {
  Save,
  Building2,
  Phone,
  Mail,
  MapPin,
  Truck,
  CreditCard,
  Smartphone,
  Globe,
  Sparkles,
  CheckCircle2,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react';
import { StoreSettings } from '../../../types';

export const SettingsTab: React.FC = () => {
  const { settings, updateSettings, showToast } = useStore();
  const [formData, setFormData] = useState<StoreSettings>({ ...settings });
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setIsSaved(true);
    showToast('Store settings updated successfully!', 'success');
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl animate-in fade-in duration-150">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">Website & Enterprise Store Settings</h2>
          <p className="text-xs text-slate-400">
            Configure store contact details, Pakistani banking credentials, courier delivery tariffs, and social channels.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
        >
          {isSaved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          <span>{isSaved ? 'Changes Saved!' : 'Save Store Settings'}</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        {/* Section 1: Business Identity & Helpline */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-4">
          <div className="flex items-center gap-2 text-cyan-400 font-bold border-b border-slate-800 pb-3">
            <Building2 className="w-4 h-4" />
            <h3 className="text-sm text-white">Brand Identity & Customer Support</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Store Brand Name</label>
              <input
                type="text"
                required
                value={formData.storeName}
                onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-hidden focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Tagline / Mission</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-hidden focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Official WhatsApp Helpline</label>
              <input
                type="text"
                required
                value={formData.whatsappNumber}
                onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                placeholder="+92 302 8472911"
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-hidden focus:border-cyan-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Helpline Phone (UAN)</label>
              <input
                type="text"
                required
                value={formData.contactNumber}
                onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                placeholder="+92 42 35879201"
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-hidden focus:border-cyan-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Corporate Support Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="support@veltrix.pk"
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-hidden focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Business Operating Hours</label>
              <input
                type="text"
                value={formData.businessHours}
                onChange={(e) => setFormData({ ...formData, businessHours: e.target.value })}
                placeholder="Monday – Saturday (10:00 AM – 9:00 PM PKT)"
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-hidden focus:border-cyan-500"
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-3">
              <label className="block text-slate-300 font-semibold mb-1.5">Physical Experience Store Address</label>
              <input
                type="text"
                value={formData.storeAddress}
                onChange={(e) => setFormData({ ...formData, storeAddress: e.target.value })}
                placeholder="Shop #14, Ground Floor, Hafeez Centre, Main Boulevard, Gulberg III, Lahore, Pakistan"
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-hidden focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Courier & Shipping Rates */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-4">
          <div className="flex items-center gap-2 text-cyan-400 font-bold border-b border-slate-800 pb-3">
            <Truck className="w-4 h-4" />
            <h3 className="text-sm text-white">Shipping & Delivery Rates (PKR)</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Standard Delivery Fee</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-mono">Rs.</span>
                <input
                  type="number"
                  min="0"
                  value={formData.standardDeliveryFee}
                  onChange={(e) => setFormData({ ...formData, standardDeliveryFee: Number(e.target.value) })}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                />
              </div>
              <p className="text-[10px] text-slate-500 mt-1">2-4 business days across Pakistan</p>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Express Air Delivery Fee</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-mono">Rs.</span>
                <input
                  type="number"
                  min="0"
                  value={formData.expressDeliveryFee}
                  onChange={(e) => setFormData({ ...formData, expressDeliveryFee: Number(e.target.value) })}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                />
              </div>
              <p className="text-[10px] text-slate-500 mt-1">Next-day Lahore, KHI, ISB / RWP</p>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Free Delivery Threshold</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-mono">Rs.</span>
                <input
                  type="number"
                  min="0"
                  value={formData.freeDeliveryThreshold}
                  onChange={(e) => setFormData({ ...formData, freeDeliveryThreshold: Number(e.target.value) })}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                />
              </div>
              <p className="text-[10px] text-slate-500 mt-1">Orders above this get free shipping</p>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Default Delivery Timeframe</label>
              <input
                type="text"
                value={formData.estimatedDeliveryTime}
                onChange={(e) => setFormData({ ...formData, estimatedDeliveryTime: e.target.value })}
                placeholder="2-4 Business Days"
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
              />
              <p className="text-[10px] text-slate-500 mt-1">Displayed in checkout & order emails</p>
            </div>
          </div>
        </div>

        {/* Section 3: Pakistani Payment Gateways & Banking */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-6">
          <div className="flex items-center gap-2 text-cyan-400 font-bold border-b border-slate-800 pb-3">
            <CreditCard className="w-4 h-4" />
            <h3 className="text-sm text-white">Payment Gateway Accounts & Bank Credentials</h3>
          </div>

          {/* Bank Transfer Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" />
              <span>Direct Bank Wire Details (Meezan / HBL / Alfalah)</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-400 mb-1">Bank Name</label>
                <input
                  type="text"
                  value={formData.bankDetails.bankName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      bankDetails: { ...formData.bankDetails, bankName: e.target.value },
                    })
                  }
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Account Title</label>
                <input
                  type="text"
                  value={formData.bankDetails.accountTitle}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      bankDetails: { ...formData.bankDetails, accountTitle: e.target.value },
                    })
                  }
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Account Number</label>
                <input
                  type="text"
                  value={formData.bankDetails.accountNumber}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      bankDetails: { ...formData.bankDetails, accountNumber: e.target.value },
                    })
                  }
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-400 mb-1">IBAN (International Bank Account Number)</label>
                <input
                  type="text"
                  value={formData.bankDetails.iban}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      bankDetails: { ...formData.bankDetails, iban: e.target.value },
                    })
                  }
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Branch Code / City</label>
                <input
                  type="text"
                  value={formData.bankDetails.branchCode}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      bankDetails: { ...formData.bankDetails, branchCode: e.target.value },
                    })
                  }
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>
            </div>
          </div>

          {/* Mobile Wallets: JazzCash & Easypaisa */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800">
            {/* JazzCash */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5" />
                <span>JazzCash Merchant Account</span>
              </h4>
              <div>
                <label className="block text-slate-400 mb-1">Account Title</label>
                <input
                  type="text"
                  value={formData.jazzCashDetails.accountTitle}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      jazzCashDetails: { ...formData.jazzCashDetails, accountTitle: e.target.value },
                    })
                  }
                  className="w-full p-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Mobile / Account Number</label>
                <input
                  type="text"
                  value={formData.jazzCashDetails.mobileNumber}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      jazzCashDetails: { ...formData.jazzCashDetails, mobileNumber: e.target.value },
                    })
                  }
                  className="w-full p-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Till Number (Optional)</label>
                <input
                  type="text"
                  value={formData.jazzCashDetails.tillNumber}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      jazzCashDetails: { ...formData.jazzCashDetails, tillNumber: e.target.value },
                    })
                  }
                  className="w-full p-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono"
                />
              </div>
            </div>

            {/* Easypaisa */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5" />
                <span>Easypaisa Merchant Account</span>
              </h4>
              <div>
                <label className="block text-slate-400 mb-1">Account Title</label>
                <input
                  type="text"
                  value={formData.easyPaisaDetails.accountTitle}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      easyPaisaDetails: { ...formData.easyPaisaDetails, accountTitle: e.target.value },
                    })
                  }
                  className="w-full p-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Mobile Account Number</label>
                <input
                  type="text"
                  value={formData.easyPaisaDetails.mobileNumber}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      easyPaisaDetails: { ...formData.easyPaisaDetails, mobileNumber: e.target.value },
                    })
                  }
                  className="w-full p-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Social Media Links */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-4">
          <div className="flex items-center gap-2 text-cyan-400 font-bold border-b border-slate-800 pb-3">
            <Globe className="w-4 h-4" />
            <h3 className="text-sm text-white">Social Media Channels</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Facebook URL</label>
              <input
                type="text"
                value={formData.socialLinks.facebook}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    socialLinks: { ...formData.socialLinks, facebook: e.target.value },
                  })
                }
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Instagram Handle</label>
              <input
                type="text"
                value={formData.socialLinks.instagram}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    socialLinks: { ...formData.socialLinks, instagram: e.target.value },
                  })
                }
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">TikTok Channel</label>
              <input
                type="text"
                value={formData.socialLinks.tiktok}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    socialLinks: { ...formData.socialLinks, tiktok: e.target.value },
                  })
                }
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">YouTube Channel</label>
              <input
                type="text"
                value={formData.socialLinks.youtube}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    socialLinks: { ...formData.socialLinks, youtube: e.target.value },
                  })
                }
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
              />
            </div>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save All Configurations</span>
          </button>
        </div>
      </form>
    </div>
  );
};
