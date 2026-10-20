import React, { useState, useEffect, useRef } from 'react';
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
  CheckCircle2,
  AlertCircle,
  Clock,
  Upload,
  Trash2,
  Eye,
  Check,
  X,
  Loader2,
  Image as ImageIcon,
  RotateCcw,
} from 'lucide-react';
import { StoreSettings } from '../../../types';

export const SettingsTab: React.FC = () => {
  const {
    settings,
    updateSettings,
    uploadLogo,
    removeLogo,
    isSettingsLoading,
    isSettingsSaving,
    settingsSaveError,
    lastSavedTimestamp,
    showToast,
  } = useStore();

  const [formData, setFormData] = useState<StoreSettings>({ ...settings });
  const [isDirty, setIsDirty] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);

  // Logo upload state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedLogoFile, setSelectedLogoFile] = useState<File | null>(null);
  const [selectedLogoPreview, setSelectedLogoPreview] = useState<string | null>(null);
  const [isLogoUploading, setIsLogoUploading] = useState(false);
  const [logoError, setLogoError] = useState<string | null>(null);
  const [showRemoveLogoModal, setShowRemoveLogoModal] = useState(false);
  const [previewDarkBg, setPreviewDarkBg] = useState(true);

  // Sync formData with settings when updated from backend (unless user has unsaved edits)
  useEffect(() => {
    if (!isDirty) {
      setFormData({ ...settings });
    }
  }, [settings, isDirty]);

  // Handle Logo file selection
  const handleLogoFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLogoError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setLogoError('Invalid file format. Please upload a PNG, JPG, JPEG, SVG, or WebP image.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Validate size (max 5MB)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setLogoError(`File exceeds 5MB limit (${(file.size / (1024 * 1024)).toFixed(2)} MB). Please select a smaller image.`);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setSelectedLogoFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setSelectedLogoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const cancelLogoSelection = () => {
    setSelectedLogoFile(null);
    setSelectedLogoPreview(null);
    setLogoError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSaveLogo = async () => {
    if (!selectedLogoFile || !selectedLogoPreview) return;
    setIsLogoUploading(true);
    setLogoError(null);

    const res = await uploadLogo(selectedLogoPreview, selectedLogoFile.name, selectedLogoFile.type);
    setIsLogoUploading(false);

    if (res.success) {
      cancelLogoSelection();
    } else {
      setLogoError(res.message || 'Failed to upload and save logo.');
    }
  };

  const handleConfirmRemoveLogo = async () => {
    setShowRemoveLogoModal(false);
    setIsLogoUploading(true);
    await removeLogo();
    setIsLogoUploading(false);
  };

  // Handle Form Input Changes
  const handleInputChange = (field: keyof StoreSettings, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const handleNestedChange = (parent: 'bankDetails' | 'jazzCashDetails' | 'easyPaisaDetails' | 'socialLinks', field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...(prev[parent] as any),
        [field]: value,
      },
    }));
    setIsDirty(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await updateSettings(formData);
    if (res.success) {
      setIsDirty(false);
      setSaveSuccessMsg(true);
      setTimeout(() => setSaveSuccessMsg(false), 4000);
    }
  };

  const handleResetUnsaved = () => {
    setFormData({ ...settings });
    setIsDirty(false);
    showToast('Reverted unsaved edits back to database version.', 'info');
  };

  return (
    <div className="space-y-6 max-w-5xl animate-in fade-in duration-150">
      {/* Top Banner & Action Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white tracking-tight">Website & Store Settings</h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-950 text-cyan-400 border border-cyan-800">
              Shared Database
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Changes persist across all devices, browsers, and visitors in real-time.
          </p>
          {lastSavedTimestamp && (
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 pt-1">
              <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>
                Last synchronized: <strong className="text-slate-300 font-mono">{new Date(lastSavedTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</strong> ({new Date(lastSavedTimestamp).toLocaleDateString()})
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isDirty && (
            <button
              type="button"
              onClick={handleResetUnsaved}
              disabled={isSettingsSaving}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSettingsSaving}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer disabled:opacity-60"
          >
            {isSettingsSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving to Database...</span>
              </>
            ) : saveSuccessMsg ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-950" />
                <span>Saved & Published!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save All Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Unsaved changes alert */}
      {isDirty && (
        <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-800/80 text-amber-200 text-xs flex items-center justify-between animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>You have unsaved changes in your settings form. Click &quot;Save All Changes&quot; to push them live to all devices.</span>
          </div>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-[11px] shrink-0"
          >
            Save Now
          </button>
        </div>
      )}

      {/* Error Banner */}
      {settingsSaveError && (
        <div className="p-4 rounded-2xl bg-rose-950/70 border border-rose-800 text-rose-200 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          <div>
            <p className="font-bold">Database Save Error</p>
            <p className="text-[11px] text-rose-300 mt-0.5">{settingsSaveError}</p>
          </div>
        </div>
      )}

      {/* SECTION 1: LOGO MANAGEMENT */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-cyan-400 font-bold">
            <ImageIcon className="w-4 h-4" />
            <h3 className="text-sm text-white">Website Logo & Visual Branding</h3>
          </div>
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            PNG, JPG, JPEG, SVG, WebP (Max 5MB)
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Current Logo Display */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300">
                Active Logo on Storefront
              </label>
              {settings.logoUrl && (
                <button
                  type="button"
                  onClick={() => setPreviewDarkBg(!previewDarkBg)}
                  className="text-[10px] text-cyan-400 hover:underline"
                >
                  Toggle {previewDarkBg ? 'Light' : 'Dark'} Background
                </button>
              )}
            </div>

            <div
              className={`p-6 rounded-2xl border transition-colors flex flex-col items-center justify-center min-h-[160px] text-center relative ${
                previewDarkBg
                  ? 'bg-slate-950 border-slate-800 text-white'
                  : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              {settings.logoUrl ? (
                <div className="space-y-3 flex flex-col items-center">
                  <div className="p-3 rounded-xl max-w-[220px] flex items-center justify-center">
                    <img
                      src={settings.logoUrl}
                      alt="Active Website Logo"
                      className="max-h-16 w-auto max-w-[200px] object-contain drop-shadow-xs"
                    />
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Synchronized & Published</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 flex flex-col items-center">
                  <div className="h-14 w-14 rounded-2xl bg-cyan-500 text-slate-950 flex items-center justify-center font-black text-2xl shadow-lg shadow-cyan-500/20">
                    VX
                  </div>
                  <div>
                    <p className="text-xs font-bold">Default Vector Mark (VX)</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      No custom image uploaded yet.
                    </p>
                  </div>
                </div>
              )}

              {settings.logoUrl && (
                <button
                  type="button"
                  onClick={() => setShowRemoveLogoModal(true)}
                  disabled={isLogoUploading}
                  className="mt-4 text-[11px] text-rose-400 hover:text-rose-300 font-semibold inline-flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove Custom Logo</span>
                </button>
              )}
            </div>
          </div>

          {/* Upload / Replace Controls */}
          <div className="lg:col-span-7 space-y-4">
            <label className="text-xs font-semibold text-slate-300 block">
              {settings.logoUrl ? 'Replace Website Logo' : 'Upload New Logo Image'}
            </label>

            <div
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                selectedLogoPreview
                  ? 'border-cyan-500 bg-cyan-950/20'
                  : 'border-slate-800 hover:border-cyan-500/50 bg-slate-950/60 hover:bg-slate-950'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp"
                className="hidden"
                onChange={handleLogoFileSelect}
              />
              <Upload className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
              <p className="font-bold text-white text-xs">
                Click to browse photo from computer or phone
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Accepted: PNG, JPG, JPEG, SVG, WebP (Max 5MB)
              </p>
            </div>

            {/* Pending Save Preview */}
            {selectedLogoPreview && (
              <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-800/80 space-y-3 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5" />
                    <span>New Logo Preview (Ready to Save)</span>
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {selectedLogoFile ? `${(selectedLogoFile.size / 1024).toFixed(1)} KB` : ''}
                  </span>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl flex items-center justify-center max-w-xs mx-auto border border-slate-800">
                  <img
                    src={selectedLogoPreview}
                    alt="New Logo Preview"
                    className="max-h-14 w-auto max-w-[220px] object-contain"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={cancelLogoSelection}
                    disabled={isLogoUploading}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveLogo}
                    disabled={isLogoUploading}
                    className="px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-cyan-500/20 cursor-pointer disabled:opacity-60"
                  >
                    {isLogoUploading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Saving to Database...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Save & Publish Logo</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {logoError && (
              <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{logoError}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MAIN SETTINGS FORM */}
      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        {/* Section 2: Business Identity & Contact */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-4 shadow-xl">
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
                onChange={(e) => handleInputChange('storeName', e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-hidden focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Tagline / Mission</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => handleInputChange('tagline', e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-hidden focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Official WhatsApp Helpline</label>
              <input
                type="text"
                required
                value={formData.whatsappNumber}
                onChange={(e) => handleInputChange('whatsappNumber', e.target.value)}
                placeholder="+92 300 1234567"
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-hidden focus:border-cyan-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Helpline Phone (UAN)</label>
              <input
                type="text"
                required
                value={formData.contactNumber}
                onChange={(e) => handleInputChange('contactNumber', e.target.value)}
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
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="support@veltrix.pk"
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-hidden focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">WhatsApp Greeting Template</label>
              <input
                type="text"
                value={formData.whatsappMessage}
                onChange={(e) => handleInputChange('whatsappMessage', e.target.value)}
                placeholder="Hello Veltrix! I need assistance..."
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-hidden focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Business Operating Hours</label>
              <input
                type="text"
                value={formData.businessHours}
                onChange={(e) => handleInputChange('businessHours', e.target.value)}
                placeholder="Monday – Saturday: 10:00 AM – 9:00 PM PKT"
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-hidden focus:border-cyan-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-300 font-semibold mb-1.5">Physical Experience Store Address</label>
              <input
                type="text"
                value={formData.storeAddress}
                onChange={(e) => handleInputChange('storeAddress', e.target.value)}
                placeholder="Plaza 45, Main Boulevard, Gulberg III, Lahore, Pakistan"
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-hidden focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Courier Delivery Rates (PKR) */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-4 shadow-xl">
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
                  onChange={(e) => handleInputChange('standardDeliveryFee', Number(e.target.value))}
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
                  onChange={(e) => handleInputChange('expressDeliveryFee', Number(e.target.value))}
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
                  onChange={(e) => handleInputChange('freeDeliveryThreshold', Number(e.target.value))}
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
                onChange={(e) => handleInputChange('estimatedDeliveryTime', e.target.value)}
                placeholder="1-3 Business Days Across Pakistan"
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
              />
              <p className="text-[10px] text-slate-500 mt-1">Displayed in checkout & order tracking</p>
            </div>
          </div>
        </div>

        {/* Section 4: Banking & Payment Gateways */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-6 shadow-xl">
          <div className="flex items-center gap-2 text-cyan-400 font-bold border-b border-slate-800 pb-3">
            <CreditCard className="w-4 h-4" />
            <h3 className="text-sm text-white">Payment Gateway Accounts & Bank Credentials</h3>
          </div>

          {/* Bank Wire */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" />
              <span>Direct Bank Wire Details (Meezan Bank Limited)</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-400 mb-1">Bank Name</label>
                <input
                  type="text"
                  value={formData.bankDetails.bankName}
                  onChange={(e) => handleNestedChange('bankDetails', 'bankName', e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Account Title</label>
                <input
                  type="text"
                  value={formData.bankDetails.accountTitle}
                  onChange={(e) => handleNestedChange('bankDetails', 'accountTitle', e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Account Number</label>
                <input
                  type="text"
                  value={formData.bankDetails.accountNumber}
                  onChange={(e) => handleNestedChange('bankDetails', 'accountNumber', e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-400 mb-1">IBAN (International Bank Account Number)</label>
                <input
                  type="text"
                  value={formData.bankDetails.iban}
                  onChange={(e) => handleNestedChange('bankDetails', 'iban', e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Branch Code / City</label>
                <input
                  type="text"
                  value={formData.bankDetails.branchCode}
                  onChange={(e) => handleNestedChange('bankDetails', 'branchCode', e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>
            </div>
          </div>

          {/* Mobile Wallets */}
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
                  onChange={(e) => handleNestedChange('jazzCashDetails', 'accountTitle', e.target.value)}
                  className="w-full p-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Mobile / Account Number</label>
                <input
                  type="text"
                  value={formData.jazzCashDetails.mobileNumber}
                  onChange={(e) => handleNestedChange('jazzCashDetails', 'mobileNumber', e.target.value)}
                  className="w-full p-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Till Number (Optional)</label>
                <input
                  type="text"
                  value={formData.jazzCashDetails.tillNumber}
                  onChange={(e) => handleNestedChange('jazzCashDetails', 'tillNumber', e.target.value)}
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
                  onChange={(e) => handleNestedChange('easyPaisaDetails', 'accountTitle', e.target.value)}
                  className="w-full p-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Mobile Account Number</label>
                <input
                  type="text"
                  value={formData.easyPaisaDetails.mobileNumber}
                  onChange={(e) => handleNestedChange('easyPaisaDetails', 'mobileNumber', e.target.value)}
                  className="w-full p-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 5: Social Channels */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-4 shadow-xl">
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
                onChange={(e) => handleNestedChange('socialLinks', 'facebook', e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Instagram Handle</label>
              <input
                type="text"
                value={formData.socialLinks.instagram}
                onChange={(e) => handleNestedChange('socialLinks', 'instagram', e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">TikTok Channel</label>
              <input
                type="text"
                value={formData.socialLinks.tiktok}
                onChange={(e) => handleNestedChange('socialLinks', 'tiktok', e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">YouTube Channel</label>
              <input
                type="text"
                value={formData.socialLinks.youtube}
                onChange={(e) => handleNestedChange('socialLinks', 'youtube', e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
              />
            </div>
          </div>
        </div>

        {/* Sticky / Bottom Submit Bar */}
        <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-800">
          <p className="text-xs text-slate-500">
            {isDirty ? 'Unsaved edits present' : 'All settings up to date with database'}
          </p>

          <button
            type="submit"
            disabled={isSettingsSaving}
            className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer disabled:opacity-60"
          >
            {isSettingsSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving to Database...</span>
              </>
            ) : saveSuccessMsg ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-950" />
                <span>Saved & Published!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save All Changes</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Confirmation Modal for Removing Logo */}
      {showRemoveLogoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs"
            onClick={() => setShowRemoveLogoModal(false)}
          />
          <div className="relative bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-6 text-white space-y-4 z-10 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="font-bold text-sm text-white">Remove Website Logo?</h3>
              <button
                type="button"
                onClick={() => setShowRemoveLogoModal(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              This will remove the uploaded custom logo and revert all website headers, footers, and menus to the default Veltrix (VX) brand mark across all devices.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowRemoveLogoModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRemoveLogo}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
              >
                Yes, Remove Logo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
