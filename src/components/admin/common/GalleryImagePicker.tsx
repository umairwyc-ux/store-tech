import React, { useState, useRef } from 'react';
import { useStore } from '../../../context/StoreContext';
import {
  ImagePlus,
  Upload,
  Check,
  X,
  Search,
  Sparkles,
  Layers,
  Star,
  CheckCircle2,
  FolderOpen,
} from 'lucide-react';
import { GalleryAsset, sanitizeImageUrl, PHONE_IMAGE } from '../../../data/mockData';

interface GalleryImagePickerProps {
  /** Array of current image URLs (base64 or local paths) */
  images?: string[];
  /** Callback when images array is updated (for multi-image like Products) */
  onImagesChange?: (images: string[]) => void;
  /** Single image mode (for Categories or single picture) */
  single?: boolean;
  /** Single image value when in single mode */
  image?: string;
  /** Callback for single image value */
  onImageChange?: (image: string) => void;
  /** Maximum number of images allowed */
  maxImages?: number;
  /** Field title label */
  label?: string;
  /** Helper text description */
  helperText?: string;
}

export const GalleryImagePicker: React.FC<GalleryImagePickerProps> = ({
  images = [],
  onImagesChange,
  single = false,
  image = '',
  onImageChange,
  maxImages = 8,
  label = 'Product Images',
  helperText = 'Select photos directly from your phone/device gallery or browse the Veltrix media library. No image URLs required.',
}) => {
  const { galleryAssets, addGalleryAsset, showToast } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [selectedGalleryCategory, setSelectedGalleryCategory] = useState<string>('all');
  const [gallerySearch, setGallerySearch] = useState<string>('');
  const [tempSelectedModalImages, setTempSelectedModalImages] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  // Normalize current images list
  const currentImages: string[] = single ? (image ? [image] : []) : images;

  // Process files from device / phone gallery
  const processFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileList = Array.from(files);
    let countAdded = 0;

    fileList.forEach((file) => {
      if (!file.type.startsWith('image/')) {
        showToast('Please select valid image files (JPG, PNG, WEBP).', 'error');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          // Also save into persistent gallery assets for reuse
          addGalleryAsset({
            title: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
            url: result,
            category: 'Uploaded',
          });

          if (single) {
            onImageChange?.(result);
            countAdded++;
            showToast('Image uploaded successfully from device gallery.', 'success');
          } else {
            const next = [...currentImages, result];
            if (next.length <= maxImages) {
              onImagesChange?.(next);
              countAdded++;
            }
          }
        }
      };
      reader.readAsDataURL(file);
    });

    if (!single && fileList.length > 0) {
      showToast(`${fileList.length} photo(s) selected from gallery.`, 'success');
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  };

  // Remove image
  const handleRemove = (index: number) => {
    if (single) {
      onImageChange?.('');
    } else {
      const next = currentImages.filter((_, i) => i !== index);
      onImagesChange?.(next);
    }
  };

  // Set as primary/cover image
  const handleSetPrimary = (index: number) => {
    if (single || index === 0) return;
    const selected = currentImages[index];
    const filtered = currentImages.filter((_, i) => i !== index);
    onImagesChange?.([selected, ...filtered]);
    showToast('Cover photo updated.', 'success');
  };

  // Open modal for gallery selection
  const handleOpenGalleryModal = () => {
    setTempSelectedModalImages(currentImages);
    setIsGalleryModalOpen(true);
  };

  // Toggle selection inside modal
  const handleToggleModalImage = (url: string) => {
    if (single) {
      setTempSelectedModalImages([url]);
    } else {
      setTempSelectedModalImages((prev) =>
        prev.includes(url) ? prev.filter((u) => u !== url) : [...prev, url].slice(0, maxImages)
      );
    }
  };

  // Confirm selection from modal
  const handleConfirmModalSelection = () => {
    if (single) {
      onImageChange?.(tempSelectedModalImages[0] || '');
    } else {
      onImagesChange?.(tempSelectedModalImages);
    }
    setIsGalleryModalOpen(false);
    showToast('Gallery images updated successfully.', 'success');
  };

  // Gallery categories list for filter
  const galleryCategories = [
    'all',
    ...Array.from(new Set(galleryAssets.map((a) => a.category))),
  ];

  const filteredGalleryAssets = galleryAssets.filter((asset) => {
    if (selectedGalleryCategory !== 'all' && asset.category !== selectedGalleryCategory) {
      return false;
    }
    if (gallerySearch.trim()) {
      const q = gallerySearch.toLowerCase();
      return (
        asset.title.toLowerCase().includes(q) || asset.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-3">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple={!single}
        onChange={handleFileInputChange}
        className="hidden"
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <label className="block text-slate-200 font-semibold text-xs">{label}</label>
          {helperText && <p className="text-[11px] text-slate-400 mt-0.5">{helperText}</p>}
        </div>

        {/* Action Buttons: Phone Gallery & Store Library */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload from Gallery / Files</span>
          </button>

          <button
            type="button"
            onClick={handleOpenGalleryModal}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-1.5 transition-colors border border-slate-700"
          >
            <FolderOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span>Browse Media Library</span>
          </button>
        </div>
      </div>

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-cyan-400 bg-cyan-950/30'
            : 'border-slate-800 hover:border-slate-700 bg-slate-950/60'
        }`}
      >
        <div className="flex flex-col items-center justify-center gap-1.5 pointer-events-none">
          <div className="h-9 w-9 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400">
            <ImagePlus className="w-4 h-4" />
          </div>
          <p className="text-xs font-semibold text-slate-300">
            Tap to open <span className="text-cyan-400 font-bold">Device Gallery / Camera Roll</span> or drag images here
          </p>
          <p className="text-[10px] text-slate-500">
            Supports direct phone upload (JPG, PNG, WebP) · No image link needed
          </p>
        </div>
      </div>

      {/* Selected Images Grid */}
      {currentImages.length > 0 ? (
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>
              Selected Photos ({currentImages.length}
              {!single && ` / max ${maxImages}`})
            </span>
            {!single && (
              <span className="text-slate-500 text-[10px]">
                The first photo will be used as the primary storefront image
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
            {currentImages.map((imgUrl, idx) => {
              const isCover = idx === 0 && !single;

              return (
                <div
                  key={idx}
                  className={`group relative aspect-square rounded-xl bg-slate-950 border overflow-hidden ${
                    isCover ? 'border-cyan-500 shadow-md shadow-cyan-950/50' : 'border-slate-800'
                  }`}
                >
                  <img
                    src={sanitizeImageUrl(imgUrl) || PHONE_IMAGE}
                    alt={`Preview ${idx + 1}`}
                    onError={(e) => {
                      if (e.currentTarget.src !== PHONE_IMAGE) {
                        e.currentTarget.src = PHONE_IMAGE;
                      }
                    }}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Cover Badge */}
                  {isCover && (
                    <div className="absolute top-1.5 left-1.5 bg-cyan-500 text-slate-950 font-black text-[9px] px-1.5 py-0.5 rounded-md flex items-center gap-0.5 shadow-xs">
                      <Star className="w-2.5 h-2.5 fill-current" />
                      <span>COVER</span>
                    </div>
                  )}

                  {/* Actions Overlay */}
                  <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-1">
                    {!single && !isCover && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSetPrimary(idx);
                        }}
                        className="px-2 py-1 rounded-lg bg-cyan-500 text-slate-950 text-[10px] font-bold hover:bg-cyan-400 transition-colors shadow-xs"
                        title="Set as primary cover"
                      >
                        Set Cover
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(idx);
                      }}
                      className="p-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white transition-colors shadow-xs"
                      title="Remove image"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-center text-xs text-slate-500">
          No image selected yet. Tap above to pick from device gallery or select from media library.
        </div>
      )}

      {/* Media Library Modal */}
      {isGalleryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs"
            onClick={() => setIsGalleryModalOpen(false)}
          />

          <div className="relative bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-6 shadow-2xl z-10 text-white space-y-4 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <FolderOpen className="w-5 h-5 text-cyan-400" />
                  <h3 className="font-bold text-sm text-white">Veltrix Media Library</h3>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Choose authentic product and category photos stored in the platform gallery.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsGalleryModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Filters & Search */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs">
                {galleryCategories.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setSelectedGalleryCategory(c)}
                    className={`px-2.5 py-1 rounded-lg font-medium capitalize whitespace-nowrap transition-colors ${
                      selectedGalleryCategory === c
                        ? 'bg-cyan-500 text-slate-950 font-bold'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="relative shrink-0 sm:w-56">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={gallerySearch}
                  onChange={(e) => setGallerySearch(e.target.value)}
                  placeholder="Search gallery..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Gallery Grid */}
            <div className="overflow-y-auto grow pr-1">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {filteredGalleryAssets.map((asset) => {
                  const isSelected = tempSelectedModalImages.includes(asset.url);

                  return (
                    <div
                      key={asset.id}
                      onClick={() => handleToggleModalImage(asset.url)}
                      className={`group relative rounded-2xl border overflow-hidden cursor-pointer transition-all bg-slate-950 ${
                        isSelected
                          ? 'border-cyan-400 ring-2 ring-cyan-500/50 shadow-lg shadow-cyan-950/50'
                          : 'border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="aspect-square w-full bg-slate-950 overflow-hidden relative">
                        <img
                          src={sanitizeImageUrl(asset.url) || PHONE_IMAGE}
                          alt={asset.title}
                          onError={(e) => {
                            if (e.currentTarget.src !== PHONE_IMAGE) {
                              e.currentTarget.src = PHONE_IMAGE;
                            }
                          }}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />

                        {/* Selected Checkmark Badge */}
                        {isSelected && (
                          <div className="absolute top-2 right-2 h-6 w-6 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center font-bold shadow-md">
                            <Check className="w-3.5 h-3.5 stroke-3" />
                          </div>
                        )}
                      </div>

                      <div className="p-2.5">
                        <p className="font-bold text-[11px] text-white truncate">{asset.title}</p>
                        <p className="text-[10px] text-slate-400 truncate">{asset.category}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {filteredGalleryAssets.length === 0 && (
                <div className="text-center py-12 text-slate-500 text-xs">
                  No images found matching your search.
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <div className="text-xs text-slate-400">
                {tempSelectedModalImages.length} image(s) selected
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsGalleryModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 text-xs hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmModalSelection}
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Insert Selected Photos</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
