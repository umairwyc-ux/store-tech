export type CategoryId = 
  | 'smartphones'
  | 'laptops'
  | 'smart-watches'
  | 'earbuds'
  | 'headphones'
  | 'gaming'
  | 'mobile-accessories'
  | 'computer-accessories'
  | 'chargers-cables'
  | 'smart-home'
  | string;

export interface Category {
  id: CategoryId;
  name: string;
  description: string;
  productCount: number;
  iconName: string;
  image?: string;
  subcategories?: string[];
  isActive?: boolean;
}

export interface ProductVariant {
  id: string;
  name: string; // e.g. "Natural Titanium / 256GB"
  color?: string;
  colorHex?: string;
  storageOrSize?: string;
  ram?: string;
  priceDelta?: number;
  stock?: number;
  sku?: string;
  image?: string;
}

export interface ProductSpecification {
  group: string;
  items: { label: string; value: string }[];
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  city?: string;
  rating: number; // 1 to 5
  date: string;
  comment: string;
  verifiedPurchase: boolean;
  isApproved?: boolean;
  status?: 'pending' | 'approved' | 'hidden';
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  category: CategoryId;
  subcategory?: string;
  price: number; // in PKR
  originalPrice: number; // in PKR
  costPrice?: number;
  discountPercent: number;
  rating: number;
  reviewsCount: number;
  stock: number;
  lowStockThreshold?: number;
  sku: string;
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller?: boolean;
  isFlashDeal: boolean;
  flashDiscountPercent?: number;
  flashSoldPercent?: number;
  shortDescription: string;
  description: string;
  images: string[];
  variants: ProductVariant[];
  specifications: ProductSpecification[];
  warranty: string;
  inStock: boolean;
  isActive?: boolean;
  isArchived?: boolean;
}

export interface CartItem {
  product: Product;
  selectedVariant?: ProductVariant;
  quantity: number;
}

export type PaymentMethodType = 'cod' | 'bank_transfer' | 'jazzcash' | 'easypaisa';

export type OrderStatus =
  | 'Pending'
  | 'Payment Verification'
  | 'Confirmed'
  | 'Processing'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled'
  | 'Returned';

export interface PaymentProof {
  transactionId?: string;
  accountSender?: string;
  receiptUrl?: string; // base64 or url
  submittedAt: string;
  adminVerified?: boolean;
  rejectionReason?: string;
}

export interface OrderCustomerInfo {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  notes?: string;
}

export interface Order {
  id: string; // e.g. ST-2026-8492
  createdAt: string;
  customer: OrderCustomerInfo;
  items: {
    productId: string;
    productName: string;
    variantName?: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  deliveryType: 'standard' | 'express';
  deliveryFee: number;
  total: number;
  paymentMethod: PaymentMethodType;
  paymentProof?: PaymentProof;
  orderStatus: OrderStatus;
  paymentStatus: 'Pending' | 'Verified' | 'Paid' | 'Failed';
  trackingNumber?: string;
  estimatedDeliveryDate: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin';
  savedAddresses?: {
    id: string;
    label: string;
    address: string;
    city: string;
    province: string;
    postalCode: string;
  }[];
  isBlocked?: boolean;
  registeredDate?: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin';
  avatar?: string;
  lastLogin?: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number; // e.g. 10 for 10% or 1000 for Rs. 1000
  minOrderAmount: number;
  maxDiscount?: number;
  startDate?: string;
  expiryDate: string;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
}

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'payment' | 'stock' | 'review' | 'customer';
  timestamp: string;
  isRead: boolean;
  orderId?: string;
  linkTab?: AdminTab;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  contactNumber: string;
  email: string;
  whatsappNumber: string;
  whatsappMessage: string;
  storeAddress: string;
  businessHours: string;
  standardDeliveryFee: number;
  expressDeliveryFee: number;
  freeDeliveryThreshold: number;
  estimatedDeliveryTime: string;
  // CMS fields
  heroHeading: string;
  heroSubtitle: string;
  heroButtonText: string;
  heroImage: string;
  promoHeading: string;
  promoSubtitle: string;
  promoButtonText: string;
  promoImage: string;
  bankDetails: {
    bankName: string;
    accountTitle: string;
    accountNumber: string;
    iban: string;
    branchCode: string;
  };
  jazzCashDetails: {
    accountTitle: string;
    mobileNumber: string;
    tillNumber: string;
  };
  easyPaisaDetails: {
    accountTitle: string;
    mobileNumber: string;
  };
  socialLinks: {
    facebook: string;
    instagram: string;
    tiktok: string;
    youtube: string;
  };
  logoUrl?: string;
  updatedAt?: string;
  updatedBy?: string;
}

export type AdminTab =
  | 'dashboard'
  | 'products'
  | 'orders'
  | 'customers'
  | 'categories'
  | 'payments'
  | 'reviews'
  | 'coupons'
  | 'inventory'
  | 'analytics'
  | 'homepage'
  | 'settings'
  | 'profile';

export type ActivePage = 
  | 'home'
  | 'shop'
  | 'product'
  | 'cart'
  | 'checkout'
  | 'order-success'
  | 'order-tracking'
  | 'wishlist'
  | 'account'
  | 'about'
  | 'contact'
  | 'admin';
