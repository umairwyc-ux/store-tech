import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  Category,
  CategoryId,
  Review,
  Order,
  Coupon,
  StoreSettings,
  User,
  AdminUser,
  CartItem,
  ProductVariant,
  ActivePage,
  OrderStatus,
  PaymentProof,
  AdminTab,
  AdminNotification,
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_REVIEWS,
  INITIAL_ORDERS,
  INITIAL_COUPONS,
  INITIAL_SETTINGS,
  INITIAL_NOTIFICATIONS,
  STORE_GALLERY_ASSETS,
  GalleryAsset,
  sanitizeImageUrl,
  PHONE_IMAGE,
} from '../data/mockData';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface StoreContextType {
  // Storefront & shared state
  products: Product[];
  categories: Category[];
  reviews: Review[];
  orders: Order[];
  coupons: Coupon[];
  settings: StoreSettings;
  activeUser: User | null;
  adminUser: AdminUser | null;
  isAdminAuthenticated: boolean;
  activeAdminTab: AdminTab;
  adminNotifications: AdminNotification[];
  cart: CartItem[];
  wishlist: string[];
  activePage: ActivePage;
  selectedProductId: string | null;
  selectedCategoryId: CategoryId | null;
  quickViewProduct: Product | null;
  isCartOpen: boolean;
  isSearchOpen: boolean;
  isAccountModalOpen: boolean;
  lastCreatedOrderId: string | null;
  appliedCoupon: Coupon | null;
  toasts: Toast[];

  // Computed
  cartCount: number;
  cartSubtotal: number;
  wishlistCount: number;
  unreadNotificationsCount: number;

  // Actions
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;
  navigateTo: (page: ActivePage, opts?: { productId?: string; categoryId?: CategoryId | null; adminTab?: AdminTab }) => void;
  setActiveAdminTab: (tab: AdminTab) => void;
  setQuickViewProduct: (product: Product | null) => void;
  setIsCartOpen: (open: boolean) => void;
  setIsSearchOpen: (open: boolean) => void;
  setIsAccountModalOpen: (open: boolean) => void;

  // Cart
  addToCart: (product: Product, variant?: ProductVariant, quantity?: number) => void;
  removeFromCart: (productId: string, variantId?: string) => void;
  updateCartQuantity: (productId: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;

  // Wishlist
  toggleWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  moveWishlistToCart: (productId: string) => void;

  // Coupon
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;

  // Order
  createOrder: (orderData: Omit<Order, 'id' | 'createdAt'>) => Order;
  getOrderById: (orderId: string) => Order | undefined;
  updateOrderStatus: (orderId: string, status: OrderStatus, trackingNumber?: string) => void;
  verifyOrderPaymentProof: (orderId: string, isApproved: boolean, rejectionReason?: string) => void;

  // Reviews
  addReview: (review: Omit<Review, 'id' | 'date'>) => void;
  getProductReviews: (productId: string) => Review[];
  updateReviewStatus: (reviewId: string, status: 'approved' | 'hidden' | 'deleted') => void;

  // Auth
  customerLogin: (email: string) => boolean;
  customerRegister: (name: string, email: string, phone: string) => boolean;
  customerLogout: () => void;
  adminLogin: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  adminLoginWithGoogle: (googleUser?: { name?: string; email?: string; avatar?: string; idToken?: string }) => Promise<{ success: boolean; message?: string }>;
  adminLogout: () => void;
  updateAdminProfile: (updates: { name?: string; email?: string; password?: string; avatar?: string }) => { success: boolean; message: string };

  // Admin Management CRUD
  addProduct: (product: Omit<Product, 'id' | 'slug'>) => void;
  updateProduct: (productId: string, updates: Partial<Product>) => void;
  duplicateProduct: (productId: string) => void;
  deleteProduct: (productId: string, softDelete?: boolean) => void;
  quickUpdateStock: (productId: string, newStock: number) => void;

  addCategory: (category: Category) => void;
  updateCategory: (categoryId: CategoryId, updates: Partial<Category>) => void;
  deleteCategory: (categoryId: CategoryId) => void;

  addCoupon: (coupon: Omit<Coupon, 'id' | 'usedCount'>) => void;
  updateCoupon: (couponId: string, updates: Partial<Coupon>) => void;
  deleteCoupon: (couponId: string) => void;

  approvePayment: (orderId: string) => void;
  rejectPayment: (orderId: string, reason?: string) => void;

  toggleBlockCustomer: (customerEmail: string) => void;
  updateHomepageCMS: (cms: Partial<StoreSettings>) => void;

  // Settings & Logo Persistence
  isSettingsLoading: boolean;
  isSettingsSaving: boolean;
  settingsSaveError: string | null;
  lastSavedTimestamp: string | null;
  updateSettings: (updates: Partial<StoreSettings>) => Promise<{ success: boolean; message?: string }>;
  uploadLogo: (fileData: string, fileName: string, mimeType: string) => Promise<{ success: boolean; logoUrl?: string; message?: string }>;
  removeLogo: () => Promise<{ success: boolean; message?: string }>;
  refetchSettings: () => Promise<void>;

  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
  galleryAssets: GalleryAsset[];
  addGalleryAsset: (asset: Omit<GalleryAsset, 'id'>) => GalleryAsset;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PRODUCTS: 'storetech_products_v3',
  CATEGORIES: 'storetech_categories_v3',
  REVIEWS: 'storetech_reviews_v2',
  ORDERS: 'storetech_orders_v2',
  COUPONS: 'storetech_coupons_v2',
  SETTINGS: 'storetech_settings_v2',
  CART: 'storetech_cart_v2',
  WISHLIST: 'storetech_wishlist_v2',
  USER: 'storetech_user_v2',
  ADMIN_AUTH: 'storetech_admin_auth_v2',
  ADMIN_USER: 'storetech_admin_user_v2',
  NOTIFICATIONS: 'storetech_admin_notifs_v2',
  GALLERY: 'storetech_gallery_v3',
};

function getStoredItem<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error(`Failed to load ${key}`, e);
    return fallback;
  }
}

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Primary datasets - sanitized for production Vite asset bundling
  const [products, setProducts] = useState<Product[]>(() => {
    const stored = getStoredItem<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    return stored.map((p) => {
      const initial = INITIAL_PRODUCTS.find((init) => init.id === p.id);
      const rawImages = p.images && p.images.length > 0 ? p.images : initial?.images || [PHONE_IMAGE];
      return {
        ...p,
        images: rawImages.map(sanitizeImageUrl),
      };
    });
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const stored = getStoredItem<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    return stored.map((cat) => {
      const initial = INITIAL_CATEGORIES.find((c) => c.id === cat.id);
      return {
        ...cat,
        image: sanitizeImageUrl(cat.image || initial?.image),
      };
    });
  });

  const [reviews, setReviews] = useState<Review[]>(() =>
    getStoredItem(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS)
  );
  const [orders, setOrders] = useState<Order[]>(() =>
    getStoredItem(STORAGE_KEYS.ORDERS, INITIAL_ORDERS)
  );
  const [coupons, setCoupons] = useState<Coupon[]>(() =>
    getStoredItem(STORAGE_KEYS.COUPONS, INITIAL_COUPONS)
  );
  const [settings, setSettings] = useState<StoreSettings>(() => {
    const stored = getStoredItem<StoreSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
    if (!stored || stored.storeName === 'Store Tech' || !stored.storeName) {
      const upgraded: StoreSettings = {
        ...INITIAL_SETTINGS,
        ...(stored || {}),
        storeName: 'Veltrix',
        email: stored?.email === 'support@storetech.pk' ? 'support@veltrix.pk' : (stored?.email || 'support@veltrix.pk'),
        heroSubtitle: stored?.heroSubtitle?.replace(/Store Tech/g, 'Veltrix') || INITIAL_SETTINGS.heroSubtitle,
        whatsappMessage: stored?.whatsappMessage?.includes('Store Tech')
          ? 'Hello Veltrix! I need assistance with product availability and orders.'
          : (stored?.whatsappMessage || INITIAL_SETTINGS.whatsappMessage),
        bankDetails: {
          ...INITIAL_SETTINGS.bankDetails,
          ...(stored?.bankDetails || {}),
          accountTitle: 'VELTRIX PRIVATE LIMITED',
        },
        jazzCashDetails: {
          ...INITIAL_SETTINGS.jazzCashDetails,
          ...(stored?.jazzCashDetails || {}),
          accountTitle: 'Veltrix Official',
        },
        easyPaisaDetails: {
          ...INITIAL_SETTINGS.easyPaisaDetails,
          ...(stored?.easyPaisaDetails || {}),
          accountTitle: 'Veltrix Digital',
        },
      };
      try {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(upgraded));
      } catch {}
      return upgraded;
    }
    return stored;
  });
  const [adminNotifications, setAdminNotifications] = useState<AdminNotification[]>(() =>
    getStoredItem(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS)
  );

  const [galleryAssets, setGalleryAssets] = useState<GalleryAsset[]>(() => {
    const stored = getStoredItem<GalleryAsset[]>(STORAGE_KEYS.GALLERY, STORE_GALLERY_ASSETS);
    return stored.map((asset) => ({
      ...asset,
      url: sanitizeImageUrl(asset.url),
    }));
  });

  const addGalleryAsset = (asset: Omit<GalleryAsset, 'id'>): GalleryAsset => {
    const newAsset: GalleryAsset = {
      ...asset,
      id: `g-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    };
    setGalleryAssets((prev) => {
      const next = [newAsset, ...prev];
      try {
        localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(next));
      } catch {}
      return next;
    });
    return newAsset;
  };

  // User & Sessions
  const [activeUser, setActiveUser] = useState<User | null>(() =>
    getStoredItem(STORAGE_KEYS.USER, {
      id: 'usr-demo-1',
      name: 'Muhammad Usman',
      email: 'usman.tech@gmail.com',
      phone: '0302-8472911',
      role: 'customer',
      savedAddresses: [
        {
          id: 'addr-1',
          label: 'Home',
          address: 'House #42, Street 8, Phase 5 DHA',
          city: 'Lahore',
          province: 'Punjab',
          postalCode: '54792',
        },
      ],
    })
  );

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() =>
    getStoredItem(STORAGE_KEYS.ADMIN_AUTH, false)
  );

  const [adminUser, setAdminUser] = useState<AdminUser | null>(() =>
    getStoredItem(STORAGE_KEYS.ADMIN_USER, null)
  );

  const [adminToken, setAdminToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem('storetech_admin_token');
    } catch {
      return null;
    }
  });

  const [isSettingsLoading, setIsSettingsLoading] = useState<boolean>(true);
  const [isSettingsSaving, setIsSettingsSaving] = useState<boolean>(false);
  const [settingsSaveError, setSettingsSaveError] = useState<string | null>(null);
  const [lastSavedTimestamp, setLastSavedTimestamp] = useState<string | null>(null);

  const [activeAdminTab, setActiveAdminTab] = useState<AdminTab>('dashboard');

  // Cart & Wishlist
  const [cart, setCart] = useState<CartItem[]>(() => {
    const stored = getStoredItem<CartItem[]>(STORAGE_KEYS.CART, []);
    return stored.map((item) => ({
      ...item,
      product: {
        ...item.product,
        images: (item.product?.images || []).map(sanitizeImageUrl),
      },
    }));
  });
  const [wishlist, setWishlist] = useState<string[]>(() =>
    getStoredItem(STORAGE_KEYS.WISHLIST, ['prod-1', 'prod-2'])
  );

  // URL route detection
  const checkInitialRoute = (): ActivePage => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path.startsWith('/admin') || hash.startsWith('#admin') || hash === '#/admin') {
        return 'admin';
      }
    }
    return 'home';
  };

  const [activePage, setActivePage] = useState<ActivePage>(checkInitialRoute);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<CategoryId | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [lastCreatedOrderId, setLastCreatedOrderId] = useState<string | null>('ST-2026-9281');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Listen to popstate / hash changes
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path.startsWith('/admin') || hash.startsWith('#admin') || hash === '#/admin') {
        setActivePage('admin');
        // Extract sub tab if present e.g. #admin/products
        const parts = (hash || path).split('/');
        if (parts.length > 2 && parts[2]) {
          const tabName = parts[2] as AdminTab;
          setActiveAdminTab(tabName);
        }
      }
    };
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  // Refetch settings from backend shared database
  const refetchSettings = async () => {
    try {
      setIsSettingsLoading(true);
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.settings) {
          setSettings(data.settings);
          setLastSavedTimestamp(data.lastSaved || data.settings.updatedAt || null);
          try {
            localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(data.settings));
          } catch {}
        }
      }
    } catch (err) {
      console.warn('Backend settings fetch failed, retaining existing settings:', err);
    } finally {
      setIsSettingsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    refetchSettings();

    // Verify existing token with backend
    const savedToken = localStorage.getItem('storetech_admin_token');
    if (savedToken) {
      fetch('/api/auth/verify', {
        headers: { Authorization: `Bearer ${savedToken}` },
      })
        .then((r) => r.json())
        .then((data) => {
          if (isMounted) {
            if (data.success && data.admin) {
              setAdminToken(savedToken);
              setIsAdminAuthenticated(true);
              setAdminUser(data.admin);
            } else {
              setAdminToken(null);
              setIsAdminAuthenticated(false);
              setAdminUser(null);
              localStorage.removeItem('storetech_admin_token');
            }
          }
        })
        .catch(() => {
          // Keep existing state if network transient
        });
    }

    return () => {
      isMounted = false;
    };
  }, []);

  // LocalStorage synchronizers
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(adminNotifications));
  }, [adminNotifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(activeUser));
  }, [activeUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, JSON.stringify(isAdminAuthenticated));
  }, [isAdminAuthenticated]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ADMIN_USER, JSON.stringify(adminUser));
  }, [adminUser]);

  // Toast handler
  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Navigation
  const navigateTo = (
    page: ActivePage,
    opts?: { productId?: string; categoryId?: CategoryId | null; adminTab?: AdminTab }
  ) => {
    if (opts?.productId) {
      setSelectedProductId(opts.productId);
    }
    if (opts?.categoryId !== undefined) {
      setSelectedCategoryId(opts.categoryId);
    }
    if (opts?.adminTab) {
      setActiveAdminTab(opts.adminTab);
    }

    setActivePage(page);

    // Update URL hash without reload for deep-linking
    if (page === 'admin') {
      const targetHash = opts?.adminTab ? `#admin/${opts.adminTab}` : '#admin';
      if (window.location.hash !== targetHash) {
        window.history.pushState(null, '', targetHash);
      }
    } else {
      if (window.location.hash.startsWith('#admin')) {
        window.history.pushState(null, '', '#');
      }
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cart logic
  const addToCart = (product: Product, variant?: ProductVariant, quantity: number = 1) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          (item.selectedVariant?.id || '') === (variant?.id || '')
      );

      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
        };
        return next;
      } else {
        return [...prev, { product, selectedVariant: variant, quantity }];
      }
    });
    showToast(`Added ${product.name} to your shopping bag.`);
  };

  const removeFromCart = (productId: string, variantId?: string) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(item.product.id === productId && (item.selectedVariant?.id || '') === (variantId || ''))
      )
    );
    showToast('Item removed from cart', 'info');
  };

  const updateCartQuantity = (productId: string, quantity: number, variantId?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, variantId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (
          item.product.id === productId &&
          (item.selectedVariant?.id || '') === (variantId || '')
        ) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const cartSubtotal = cart.reduce((total, item) => {
    const unitPrice = item.product.price + (item.selectedVariant?.priceDelta || 0);
    return total + unitPrice * item.quantity;
  }, 0);

  // Wishlist logic
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        showToast('Removed from wishlist', 'info');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Added to wishlist');
        return [...prev, productId];
      }
    });
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist((prev) => prev.filter((id) => id !== productId));
    showToast('Removed from wishlist', 'info');
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const moveWishlistToCart = (productId: string) => {
    const prod = products.find((p) => p.id === productId);
    if (prod) {
      addToCart(prod, prod.variants[0] || undefined, 1);
      setWishlist((prev) => prev.filter((id) => id !== productId));
    }
  };

  const wishlistCount = wishlist.length;

  // Coupon logic
  const applyCoupon = (code: string) => {
    const found = coupons.find(
      (c) => c.code.toUpperCase() === code.trim().toUpperCase() && c.isActive
    );
    if (!found) {
      return { success: false, message: 'Invalid or expired coupon code.' };
    }
    if (cartSubtotal < found.minOrderAmount) {
      return {
        success: false,
        message: `Requires minimum order of Rs. ${found.minOrderAmount.toLocaleString()}.`,
      };
    }
    setAppliedCoupon(found);
    showToast(`Coupon "${found.code}" applied successfully!`);
    return { success: true, message: 'Coupon applied successfully!' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed.', 'info');
  };

  // Orders
  const createOrder = (orderData: Omit<Order, 'id' | 'createdAt'>): Order => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newOrderId = `ST-2026-${randomNum}`;
    const newOrder: Order = {
      ...orderData,
      id: newOrderId,
      createdAt: new Date().toISOString(),
    };

    setOrders((prev) => [newOrder, ...prev]);
    setLastCreatedOrderId(newOrderId);
    clearCart();
    setAppliedCoupon(null);

    // If coupon used, increment count
    if (orderData.couponCode) {
      setCoupons((prev) =>
        prev.map((c) =>
          c.code === orderData.couponCode ? { ...c, usedCount: c.usedCount + 1 } : c
        )
      );
    }

    // Trigger Admin Notification
    const newNotif: AdminNotification = {
      id: `notif-${Date.now()}`,
      title: 'New Order Received',
      message: `Order #${newOrderId} received from ${orderData.customer.fullName} for Rs. ${orderData.total.toLocaleString()}`,
      type: 'order',
      timestamp: 'Just now',
      isRead: false,
      orderId: newOrderId,
      linkTab: 'orders',
    };
    setAdminNotifications((prev) => [newNotif, ...prev]);

    return newOrder;
  };

  const getOrderById = (orderId: string) => {
    return orders.find(
      (o) => o.id.toLowerCase() === orderId.trim().toLowerCase()
    );
  };

  const updateOrderStatus = (
    orderId: string,
    status: OrderStatus,
    trackingNumber?: string
  ) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            orderStatus: status,
            paymentStatus:
              status === 'Confirmed' || status === 'Processing' || status === 'Shipped' || status === 'Delivered'
                ? 'Verified'
                : o.paymentStatus,
            trackingNumber: trackingNumber || o.trackingNumber,
          };
        }
        return o;
      })
    );
    showToast(`Order #${orderId} status updated to ${status}.`);
  };

  const verifyOrderPaymentProof = (
    orderId: string,
    isApproved: boolean,
    rejectionReason?: string
  ) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId && o.paymentProof) {
          const updatedProof: PaymentProof = {
            ...o.paymentProof,
            adminVerified: isApproved,
            rejectionReason: isApproved ? undefined : rejectionReason || 'Payment slip not legible or mismatch in transaction ID.',
          };
          return {
            ...o,
            paymentProof: updatedProof,
            paymentStatus: isApproved ? 'Verified' : 'Failed',
            orderStatus: isApproved ? 'Confirmed' : 'Pending',
          };
        }
        return o;
      })
    );
    showToast(
      isApproved
        ? `Payment verified for Order #${orderId}. Order confirmed!`
        : `Payment proof rejected for Order #${orderId}.`,
      isApproved ? 'success' : 'error'
    );
  };

  const approvePayment = (orderId: string) => {
    verifyOrderPaymentProof(orderId, true);
  };

  const rejectPayment = (orderId: string, reason?: string) => {
    verifyOrderPaymentProof(orderId, false, reason);
  };

  // Reviews
  const addReview = (review: Omit<Review, 'id' | 'date'>) => {
    const newReview: Review = {
      ...review,
      id: `rev-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
      isApproved: true,
      status: 'approved',
    };
    setReviews((prev) => [newReview, ...prev]);

    // Recalculate product rating
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === review.productId) {
          const prodReviews = [...reviews.filter((r) => r.productId === p.id), newReview];
          const avg =
            prodReviews.reduce((sum, r) => sum + r.rating, 0) / prodReviews.length;
          return {
            ...p,
            rating: Number(avg.toFixed(1)),
            reviewsCount: prodReviews.length,
          };
        }
        return p;
      })
    );

    // Notify admin
    setAdminNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: 'New Customer Review',
        message: `${review.userName} reviewed a product with ${review.rating} stars.`,
        type: 'review',
        timestamp: 'Just now',
        isRead: false,
        linkTab: 'reviews',
      },
      ...prev,
    ]);

    showToast('Thank you! Your review has been submitted.');
  };

  const getProductReviews = (productId: string) => {
    return reviews.filter((r) => r.productId === productId && (r.status !== 'hidden'));
  };

  const updateReviewStatus = (reviewId: string, status: 'approved' | 'hidden' | 'deleted') => {
    if (status === 'deleted') {
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
      showToast('Review deleted permanently.');
    } else {
      setReviews((prev) =>
        prev.map((r) => (r.id === reviewId ? { ...r, status, isApproved: status === 'approved' } : r))
      );
      showToast(`Review marked as ${status}.`);
    }
  };

  // Auth - Customer
  const customerLogin = (email: string) => {
    setActiveUser({
      id: `usr-${Date.now()}`,
      name: email.split('@')[0].toUpperCase(),
      email,
      phone: '0300-1234567',
      role: 'customer',
      savedAddresses: [
        {
          id: 'addr-1',
          label: 'Default Address',
          address: 'Gulberg III',
          city: 'Lahore',
          province: 'Punjab',
          postalCode: '54000',
        },
      ],
    });
    showToast(`Welcome back, ${email.split('@')[0]}!`);
    return true;
  };

  const customerRegister = (name: string, email: string, phone: string) => {
    setActiveUser({
      id: `usr-${Date.now()}`,
      name,
      email,
      phone,
      role: 'customer',
    });
    showToast(`Account created successfully! Welcome to Veltrix, ${name}.`);
    return true;
  };

  const customerLogout = () => {
    setActiveUser(null);
    showToast('Signed out of customer account.', 'info');
  };

  // Auth - Admin
  const adminLogin = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        const errMsg = data.message || 'Access Denied: Invalid administrator credentials.';
        showToast(errMsg, 'error');
        return { success: false, message: errMsg };
      }

      setAdminToken(data.token);
      try {
        localStorage.setItem('storetech_admin_token', data.token);
      } catch {}

      setIsAdminAuthenticated(true);
      setAdminUser(data.admin);
      showToast(data.message || 'Admin session authorized. Welcome to Veltrix Admin Console!', 'success');
      navigateTo('admin', { adminTab: 'dashboard' });
      return { success: true };
    } catch (err: any) {
      console.error('Login error:', err);
      const errMsg = err?.message || 'Network error: Failed to connect to authentication server.';
      showToast(errMsg, 'error');
      return { success: false, message: errMsg };
    }
  };

  const adminLoginWithGoogle = async (googleUser?: { name?: string; email?: string; avatar?: string; idToken?: string }): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: googleUser?.email,
          name: googleUser?.name,
          avatar: googleUser?.avatar,
          idToken: googleUser?.idToken,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        const errMsg = data.message || `Google Authentication rejected (HTTP ${res.status})`;
        showToast(errMsg, 'error');
        return { success: false, message: errMsg };
      }

      setAdminToken(data.token);
      try {
        localStorage.setItem('storetech_admin_token', data.token);
      } catch {}

      setIsAdminAuthenticated(true);
      setAdminUser(data.admin);
      showToast(data.message || `Signed in as ${data.admin.name}!`, 'success');
      navigateTo('admin', { adminTab: 'dashboard' });
      return { success: true };
    } catch (err: any) {
      const errMsg = err?.message || 'Network error: Failed to connect to authentication server.';
      showToast(errMsg, 'error');
      return { success: false, message: errMsg };
    }
  };

  const adminLogout = () => {
    const token = adminToken || localStorage.getItem('storetech_admin_token');
    if (token) {
      fetch('/api/auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    }
    setAdminToken(null);
    try {
      localStorage.removeItem('storetech_admin_token');
    } catch {}
    setIsAdminAuthenticated(false);
    setAdminUser(null);
    showToast('Admin session terminated safely.', 'info');
    navigateTo('home');
  };

  const updateAdminProfile = (updates: { name?: string; email?: string; password?: string; avatar?: string }) => {
    if (adminUser) {
      setAdminUser({
        ...adminUser,
        name: updates.name || adminUser.name,
        email: updates.email || adminUser.email,
        avatar: updates.avatar || adminUser.avatar,
      });
      showToast('Admin profile updated successfully.');
      return { success: true, message: 'Admin profile updated.' };
    }
    return { success: false, message: 'No active admin session.' };
  };

  // Admin Management CRUD
  const addProduct = (productData: Omit<Product, 'id' | 'slug'>) => {
    const id = `prod-${Date.now()}`;
    const slug = productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newProduct: Product = {
      ...productData,
      id,
      slug,
      isActive: true,
      inStock: (productData.stock || 0) > 0,
    };
    setProducts((prev) => [newProduct, ...prev]);
    showToast(`Product "${newProduct.name}" added to catalog.`);
  };

  const updateProduct = (productId: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const nextStock = updates.stock !== undefined ? updates.stock : p.stock;
          return {
            ...p,
            ...updates,
            inStock: nextStock > 0,
          };
        }
        return p;
      })
    );
    showToast('Product updated successfully.');
  };

  const duplicateProduct = (productId: string) => {
    const orig = products.find((p) => p.id === productId);
    if (!orig) return;
    const newId = `prod-${Date.now()}`;
    const duplicated: Product = {
      ...orig,
      id: newId,
      name: `${orig.name} (Copy)`,
      sku: `${orig.sku}-COPY`,
      slug: `${orig.slug}-copy-${Date.now().toString().slice(-4)}`,
    };
    setProducts((prev) => [duplicated, ...prev]);
    showToast(`Duplicated "${orig.name}".`);
  };

  const deleteProduct = (productId: string, softDelete: boolean = true) => {
    if (softDelete) {
      // Soft-delete: mark isArchived so historical orders remain completely intact
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, isArchived: true, inStock: false } : p))
      );
      showToast('Product archived safely to preserve order records.', 'info');
    } else {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      showToast('Product deleted from catalog.', 'info');
    }
  };

  const quickUpdateStock = (productId: string, newStock: number) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? { ...p, stock: Math.max(0, newStock), inStock: newStock > 0 }
          : p
      )
    );
    showToast(`Stock updated to ${newStock} units.`);
  };

  const addCategory = (category: Category) => {
    setCategories((prev) => [...prev, category]);
    showToast(`Category "${category.name}" created.`);
  };

  const updateCategory = (categoryId: CategoryId, updates: Partial<Category>) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === categoryId ? { ...c, ...updates } : c))
    );
    showToast('Category updated.');
  };

  const deleteCategory = (categoryId: CategoryId) => {
    setCategories((prev) => prev.filter((c) => c.id !== categoryId));
    showToast('Category removed.', 'info');
  };

  const addCoupon = (coupon: Omit<Coupon, 'id' | 'usedCount'>) => {
    const newCoupon: Coupon = {
      ...coupon,
      id: `cp-${Date.now()}`,
      usedCount: 0,
      isActive: true,
    };
    setCoupons((prev) => [...prev, newCoupon]);
    showToast(`Coupon "${coupon.code}" activated.`);
  };

  const updateCoupon = (couponId: string, updates: Partial<Coupon>) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === couponId ? { ...c, ...updates } : c))
    );
    showToast('Coupon updated.');
  };

  const deleteCoupon = (couponId: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== couponId));
    showToast('Coupon removed.', 'info');
  };

  const toggleBlockCustomer = (customerEmail: string) => {
    // Updates customer status across context
    showToast(`Customer ${customerEmail} account status toggled.`);
  };

  const updateHomepageCMS = (cms: Partial<StoreSettings>) => {
    setSettings((prev) => ({ ...prev, ...cms }));
    showToast('Homepage CMS settings updated and live on storefront.');
  };

  const updateSettings = async (updates: Partial<StoreSettings>): Promise<{ success: boolean; message?: string }> => {
    setIsSettingsSaving(true);
    setSettingsSaveError(null);
    try {
      const token = adminToken || localStorage.getItem('storetech_admin_token') || '';
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        const errMsg = data.message || `Failed to save settings (HTTP ${res.status})`;
        setSettingsSaveError(errMsg);
        showToast(errMsg, 'error');
        return { success: false, message: errMsg };
      }

      setSettings(data.settings);
      setLastSavedTimestamp(data.lastSaved || new Date().toISOString());
      try {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(data.settings));
      } catch {}

      showToast('Website settings saved to database and live across all devices!', 'success');
      return { success: true };
    } catch (err: any) {
      const errMsg = err?.message || 'Network error: Unable to connect to backend database.';
      setSettingsSaveError(errMsg);
      showToast(errMsg, 'error');
      return { success: false, message: errMsg };
    } finally {
      setIsSettingsSaving(false);
    }
  };

  const uploadLogo = async (fileData: string, fileName: string, mimeType: string): Promise<{ success: boolean; logoUrl?: string; message?: string }> => {
    setIsSettingsSaving(true);
    setSettingsSaveError(null);
    try {
      const token = adminToken || localStorage.getItem('storetech_admin_token') || '';
      const res = await fetch('/api/logo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ fileData, fileName, mimeType }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        const errMsg = data.message || `Failed to upload logo (HTTP ${res.status})`;
        setSettingsSaveError(errMsg);
        showToast(errMsg, 'error');
        return { success: false, message: errMsg };
      }

      setSettings(data.settings);
      setLastSavedTimestamp(data.settings.updatedAt || new Date().toISOString());
      try {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(data.settings));
      } catch {}

      showToast('Website logo uploaded and saved to shared database!', 'success');
      return { success: true, logoUrl: data.logoUrl };
    } catch (err: any) {
      const errMsg = err?.message || 'Network error: Failed to upload logo to server.';
      setSettingsSaveError(errMsg);
      showToast(errMsg, 'error');
      return { success: false, message: errMsg };
    } finally {
      setIsSettingsSaving(false);
    }
  };

  const removeLogo = async (): Promise<{ success: boolean; message?: string }> => {
    setIsSettingsSaving(true);
    setSettingsSaveError(null);
    try {
      const token = adminToken || localStorage.getItem('storetech_admin_token') || '';
      const res = await fetch('/api/logo', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        const errMsg = data.message || `Failed to remove logo (HTTP ${res.status})`;
        setSettingsSaveError(errMsg);
        showToast(errMsg, 'error');
        return { success: false, message: errMsg };
      }

      setSettings(data.settings);
      setLastSavedTimestamp(data.settings.updatedAt || new Date().toISOString());
      try {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(data.settings));
      } catch {}

      showToast('Custom logo removed. Website reverted to default brand mark.', 'info');
      return { success: true };
    } catch (err: any) {
      const errMsg = err?.message || 'Network error: Failed to remove logo from server.';
      setSettingsSaveError(errMsg);
      showToast(errMsg, 'error');
      return { success: false, message: errMsg };
    } finally {
      setIsSettingsSaving(false);
    }
  };

  const markNotificationRead = (id: string) => {
    setAdminNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const clearAllNotifications = () => {
    setAdminNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    showToast('All notifications marked as read.');
  };

  const unreadNotificationsCount = adminNotifications.filter((n) => !n.isRead).length;

  return (
    <StoreContext.Provider
      value={{
        products: products.filter((p) => !p.isArchived),
        categories,
        reviews,
        orders,
        coupons,
        settings,
        activeUser,
        adminUser,
        isAdminAuthenticated,
        activeAdminTab,
        adminNotifications,
        cart,
        wishlist,
        activePage,
        selectedProductId,
        selectedCategoryId,
        quickViewProduct,
        isCartOpen,
        isSearchOpen,
        isAccountModalOpen,
        lastCreatedOrderId,
        appliedCoupon,
        toasts,
        cartCount,
        cartSubtotal,
        wishlistCount,
        unreadNotificationsCount,
        showToast,
        removeToast,
        navigateTo,
        setActiveAdminTab,
        setQuickViewProduct,
        setIsCartOpen,
        setIsSearchOpen,
        setIsAccountModalOpen,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        toggleWishlist,
        removeFromWishlist,
        isInWishlist,
        moveWishlistToCart,
        applyCoupon,
        removeCoupon,
        createOrder,
        getOrderById,
        updateOrderStatus,
        verifyOrderPaymentProof,
        addReview,
        getProductReviews,
        updateReviewStatus,
        customerLogin,
        customerRegister,
        customerLogout,
        adminLogin,
        adminLoginWithGoogle,
        adminLogout,
        updateAdminProfile,
        addProduct,
        updateProduct,
        duplicateProduct,
        deleteProduct,
        quickUpdateStock,
        addCategory,
        updateCategory,
        deleteCategory,
        addCoupon,
        updateCoupon,
        deleteCoupon,
        approvePayment,
        rejectPayment,
        toggleBlockCustomer,
        updateHomepageCMS,
        isSettingsLoading,
        isSettingsSaving,
        settingsSaveError,
        lastSavedTimestamp,
        updateSettings,
        uploadLogo,
        removeLogo,
        refetchSettings,
        markNotificationRead,
        clearAllNotifications,
        galleryAssets,
        addGalleryAsset,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
