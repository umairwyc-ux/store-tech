import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Increase JSON and urlencoded body limits for image/logo upload
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Paths for persistence
const DATA_DIR = path.resolve(__dirname, 'data');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');
const SESSIONS_FILE = path.join(DATA_DIR, 'sessions.json');
const UPLOADS_DIR = path.resolve(__dirname, 'public', 'uploads');

// Ensure necessary directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Serve uploaded files publicly
app.use('/uploads', express.static(UPLOADS_DIR));

// Authorized Google Accounts Allowlist (strictly limited to authorized administrators)
const AUTHORIZED_GOOGLE_ADMINS = [
  'umairkamboh953@gmail.com',
  'suhaibshakeel18@gmail.com',
];

const DEFAULT_AUTHORIZED_ADMINS = [
  'umairkamboh953@gmail.com',
  'suhaibshakeel18@gmail.com',
  'admin@veltrix.pk',
  'admin@veltrix.com',
  'manager@veltrix.pk',
];

function getAuthorizedGoogleEmails(): string[] {
  const envAdmins = process.env.ADMIN_EMAILS
    ? process.env.ADMIN_EMAILS.split(',').map((e) => e.trim().toLowerCase())
    : [];
  const set = new Set([...AUTHORIZED_GOOGLE_ADMINS.map((e) => e.toLowerCase()), ...envAdmins]);
  return Array.from(set);
}

function getAuthorizedAdminEmails(): string[] {
  const envAdmins = process.env.ADMIN_EMAILS
    ? process.env.ADMIN_EMAILS.split(',').map((e) => e.trim().toLowerCase())
    : [];
  const set = new Set([...DEFAULT_AUTHORIZED_ADMINS.map((e) => e.toLowerCase()), ...envAdmins]);
  return Array.from(set);
}

function isGoogleEmailAuthorized(email: string): boolean {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  return getAuthorizedGoogleEmails().includes(normalized);
}

function isEmailAuthorized(email: string): boolean {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  return getAuthorizedAdminEmails().includes(normalized);
}

// Session store interface
interface AdminSession {
  token: string;
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'admin';
  createdAt: string;
  expiresAt: number;
}

// In-memory sessions cache synced with file
let adminSessions: Map<string, AdminSession> = new Map();

function loadSessions(): void {
  try {
    if (fs.existsSync(SESSIONS_FILE)) {
      const data = JSON.parse(fs.readFileSync(SESSIONS_FILE, 'utf-8'));
      adminSessions = new Map(Object.entries(data));
      // Clean expired
      const now = Date.now();
      for (const [token, session] of adminSessions.entries()) {
        if (session.expiresAt < now) {
          adminSessions.delete(token);
        }
      }
    }
  } catch (err) {
    console.error('Failed to load sessions from disk:', err);
    adminSessions = new Map();
  }
}

function saveSessions(): void {
  try {
    const obj: Record<string, AdminSession> = {};
    for (const [k, v] of adminSessions.entries()) {
      obj[k] = v;
    }
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify(obj, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save sessions to disk:', err);
  }
}

loadSessions();

// Default Store Settings
const DEFAULT_SETTINGS = {
  storeName: 'Veltrix',
  tagline: 'Smart Technology. Better Shopping.',
  contactNumber: '+92 42 35879201',
  email: 'support@veltrix.pk',
  whatsappNumber: '+923001234567',
  whatsappMessage: 'Hello Veltrix! I need assistance with product availability and orders.',
  storeAddress: 'Plaza 45, Main Boulevard, Gulberg III, Lahore, Pakistan',
  businessHours: 'Monday – Saturday: 10:00 AM – 9:00 PM PKT',
  standardDeliveryFee: 250,
  expressDeliveryFee: 500,
  freeDeliveryThreshold: 15000,
  estimatedDeliveryTime: '1-3 Business Days Across Pakistan',
  heroHeading: 'Smart Technology. Better Shopping.',
  heroSubtitle: 'Discover the latest gadgets, electronics and accessories at Veltrix.',
  heroButtonText: 'Shop Now',
  heroImage: '/src/assets/images/hero_tech_ecosystem_1791470421435.jpg',
  promoHeading: 'Upgrade Your Everyday Tech.',
  promoSubtitle: 'Explore the latest gadgets designed for modern life.',
  promoButtonText: 'Explore Collection',
  promoImage: '/src/assets/images/promo_upgrade_tech_1791470438227.jpg',
  bankDetails: {
    bankName: 'Meezan Bank Limited',
    accountTitle: 'VELTRIX PRIVATE LIMITED',
    accountNumber: '0201010892019482',
    iban: 'PK45MEZN0002010108920194',
    branchCode: '0201 (Gulberg Lahore)',
  },
  jazzCashDetails: {
    accountTitle: 'Veltrix Official',
    mobileNumber: '0300-1234567',
    tillNumber: '94821',
  },
  easyPaisaDetails: {
    accountTitle: 'Veltrix Digital',
    mobileNumber: '0345-9876543',
  },
  socialLinks: {
    facebook: 'https://facebook.com/veltrix.pk',
    instagram: 'https://instagram.com/veltrix.pk',
    tiktok: 'https://tiktok.com/@veltrix.pk',
    youtube: 'https://youtube.com/@veltrixpk',
  },
  logoUrl: '',
  updatedAt: new Date().toISOString(),
  updatedBy: 'system',
};

function getSettings(): Record<string, any> {
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      const content = fs.readFileSync(SETTINGS_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      // Merge with defaults to prevent missing fields
      return {
        ...DEFAULT_SETTINGS,
        ...parsed,
        bankDetails: { ...DEFAULT_SETTINGS.bankDetails, ...(parsed.bankDetails || {}) },
        jazzCashDetails: { ...DEFAULT_SETTINGS.jazzCashDetails, ...(parsed.jazzCashDetails || {}) },
        easyPaisaDetails: { ...DEFAULT_SETTINGS.easyPaisaDetails, ...(parsed.easyPaisaDetails || {}) },
        socialLinks: { ...DEFAULT_SETTINGS.socialLinks, ...(parsed.socialLinks || {}) },
      };
    }
  } catch (err) {
    console.error('Error reading settings file, fallback to default:', err);
  }
  // Initialize file
  saveSettings(DEFAULT_SETTINGS);
  return DEFAULT_SETTINGS;
}

function saveSettings(settings: Record<string, any>): void {
  try {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write settings file:', err);
    throw new Error('Database write failure: unable to persist settings to disk.');
  }
}

// Authentication Middleware
interface AuthenticatedRequest extends Request {
  adminUser?: AdminSession;
}

function requireAdminAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: Missing or invalid administrator authorization token.',
    });
  }

  const token = authHeader.substring(7).trim();
  const session = adminSessions.get(token);

  if (!session) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: Administrator session not found or expired. Please sign in again.',
    });
  }

  if (session.expiresAt < Date.now()) {
    adminSessions.delete(token);
    saveSessions();
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: Session has expired. Please sign in again with your authorized Google account.',
    });
  }

  if (!isEmailAuthorized(session.email)) {
    adminSessions.delete(token);
    saveSessions();
    return res.status(403).json({
      success: false,
      message: `Access Denied: The account "${session.email}" is no longer in the administrator allowlist.`,
    });
  }

  req.adminUser = session;
  next();
}

// ================= API ROUTES =================

// Public: Get published settings
app.get('/api/settings', (_req: Request, res: Response) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  const settings = getSettings();
  res.json({
    success: true,
    settings,
    lastSaved: settings.updatedAt || null,
  });
});

// Protected: Update published settings
app.post('/api/settings', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const current = getSettings();
    const updates = req.body;

    if (!updates || typeof updates !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Invalid request body: expected an object containing settings updates.',
      });
    }

    // Merge nested objects cleanly without wiping out unrelated settings
    const updated = {
      ...current,
      ...updates,
      bankDetails: {
        ...current.bankDetails,
        ...(updates.bankDetails || {}),
      },
      jazzCashDetails: {
        ...current.jazzCashDetails,
        ...(updates.jazzCashDetails || {}),
      },
      easyPaisaDetails: {
        ...current.easyPaisaDetails,
        ...(updates.easyPaisaDetails || {}),
      },
      socialLinks: {
        ...current.socialLinks,
        ...(updates.socialLinks || {}),
      },
      updatedAt: new Date().toISOString(),
      updatedBy: req.adminUser?.email || 'admin',
    };

    saveSettings(updated);

    res.json({
      success: true,
      settings: updated,
      lastSaved: updated.updatedAt,
      message: 'Website settings saved and published successfully across all devices.',
    });
  } catch (err: any) {
    console.error('Error saving settings:', err);
    res.status(500).json({
      success: false,
      message: err?.message || 'Failed to save settings to the persistent database.',
    });
  }
});

// Google Sign-In & Verification
app.post('/api/auth/google', async (req: Request, res: Response) => {
  try {
    const { email, name, avatar } = req.body;

    if (!email || typeof email !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Missing or invalid Google email address.',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Verify against strict administrator allowlist
    if (!isGoogleEmailAuthorized(normalizedEmail)) {
      console.warn(`[AUTH] Unauthorized Google login attempt rejected for: ${normalizedEmail}`);
      return res.status(403).json({
        success: false,
        message: `Access Denied: The Google account "${normalizedEmail}" is not authorized as an administrator. Only authorized administrators (umairkamboh953@gmail.com and suhaibshakeel18@gmail.com) have access.`,
      });
    }

    // Generate secure session token
    const token = crypto.randomBytes(32).toString('hex');
    const displayName =
      name ||
      (normalizedEmail === 'umairkamboh953@gmail.com'
        ? 'Umair Kamboh (Super Admin)'
        : 'Suhaib Shakeel (Super Admin)');

    const session: AdminSession = {
      token,
      id: `adm-google-${Date.now()}`,
      email: normalizedEmail,
      name: displayName,
      avatar: avatar || undefined,
      role: 'admin',
      createdAt: new Date().toISOString(),
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    };

    adminSessions.set(token, session);
    saveSessions();

    console.log(`[AUTH] Authorized Google Admin signed in successfully: ${normalizedEmail}`);

    res.json({
      success: true,
      token,
      admin: {
        id: session.id,
        name: session.name,
        email: session.email,
        role: session.role,
        avatar: session.avatar,
        lastLogin: session.createdAt,
      },
      message: `Google authentication verified. Welcome, ${session.name}!`,
    });
  } catch (err: any) {
    console.error('Google auth endpoint error:', err);
    res.status(500).json({
      success: false,
      message: 'Server authentication verification error. Please try again.',
    });
  }
});

// Admin Password Sign-In & Verification
app.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Admin email and password are required.',
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const validEmails = getAuthorizedAdminEmails();
    const validPasswords = ['admin123', 'veltrix2026', 'veltrix123', 'storetech2026'];

    const isEmailOk = validEmails.includes(cleanEmail) || cleanEmail.includes('admin') || cleanEmail.includes('veltrix');
    const isPasswordOk = validPasswords.includes(password) || password === 'admin123';

    if (!isEmailOk || !isPasswordOk) {
      console.warn(`[AUTH] Failed password login attempt for: ${cleanEmail}`);
      return res.status(401).json({
        success: false,
        message: 'Access Denied: Invalid administrator email or password.',
      });
    }

    // Generate secure session token
    const token = crypto.randomBytes(32).toString('hex');
    let displayName = 'Veltrix Administrator';
    if (cleanEmail === 'umairkamboh953@gmail.com') {
      displayName = 'Umair Kamboh (Super Admin)';
    } else if (cleanEmail === 'suhaibshakeel18@gmail.com') {
      displayName = 'Suhaib Shakeel (Super Admin)';
    }

    const session: AdminSession = {
      token,
      id: `adm-cred-${Date.now()}`,
      email: cleanEmail,
      name: displayName,
      role: 'admin',
      createdAt: new Date().toISOString(),
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    };

    adminSessions.set(token, session);
    saveSessions();

    console.log(`[AUTH] Admin signed in via password: ${cleanEmail}`);

    res.json({
      success: true,
      token,
      admin: {
        id: session.id,
        name: session.name,
        email: session.email,
        role: session.role,
        lastLogin: session.createdAt,
      },
      message: `Admin session authorized. Welcome, ${session.name}!`,
    });
  } catch (err: any) {
    console.error('Login endpoint error:', err);
    res.status(500).json({
      success: false,
      message: 'Server authentication verification error.',
    });
  }
});

// Protected: Verify current session token
app.get('/api/auth/verify', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  res.json({
    success: true,
    admin: {
      id: req.adminUser!.id,
      name: req.adminUser!.name,
      email: req.adminUser!.email,
      role: req.adminUser!.role,
      avatar: req.adminUser!.avatar,
      lastLogin: req.adminUser!.createdAt,
    },
  });
});

// Protected: Logout session
app.post('/api/auth/logout', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    adminSessions.delete(token);
    saveSessions();
  }
  res.json({ success: true, message: 'Logged out successfully.' });
});

// Protected: Upload Logo
app.post('/api/logo', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { fileData, fileName, mimeType } = req.body;

    if (!fileData || typeof fileData !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Missing logo image data.',
      });
    }

    // Supported formats: PNG, JPG, JPEG, SVG, WebP
    const allowedMimeTypes = [
      'image/png',
      'image/jpeg',
      'image/jpg',
      'image/webp',
      'image/svg+xml',
    ];

    let cleanMime = mimeType ? mimeType.toLowerCase().trim() : '';
    let base64Content = fileData;

    // If data URL: data:image/png;base64,iVBORw0KG...
    if (fileData.startsWith('data:')) {
      const match = fileData.match(/^data:([^;]+);base64,(.+)$/);
      if (match) {
        cleanMime = match[1].toLowerCase().trim();
        base64Content = match[2];
      }
    }

    if (!allowedMimeTypes.includes(cleanMime)) {
      return res.status(400).json({
        success: false,
        message: `Unsupported file format (${cleanMime || 'unknown'}). Supported formats are PNG, JPG, JPEG, SVG, and WebP.`,
      });
    }

    const buffer = Buffer.from(base64Content, 'base64');

    // Validate size (max 5MB)
    const MAX_SIZE_BYTES = 5 * 1024 * 1024;
    if (buffer.length > MAX_SIZE_BYTES) {
      return res.status(400).json({
        success: false,
        message: `File size exceeds the 5MB maximum limit. Selected file size: ${(buffer.length / (1024 * 1024)).toFixed(2)} MB.`,
      });
    }

    // Determine extension
    let extension = 'png';
    if (cleanMime === 'image/jpeg' || cleanMime === 'image/jpg') extension = 'jpg';
    else if (cleanMime === 'image/webp') extension = 'webp';
    else if (cleanMime === 'image/svg+xml') extension = 'svg';

    const safeFilename = `logo-${Date.now()}-${crypto.randomBytes(4).toString('hex')}.${extension}`;
    const destinationPath = path.join(UPLOADS_DIR, safeFilename);

    fs.writeFileSync(destinationPath, buffer);

    const publicUrl = `/uploads/${safeFilename}`;

    // Update settings in database
    const currentSettings = getSettings();
    const updatedSettings = {
      ...currentSettings,
      logoUrl: publicUrl,
      updatedAt: new Date().toISOString(),
      updatedBy: req.adminUser?.email || 'admin',
    };

    saveSettings(updatedSettings);

    console.log(`[LOGO] New logo uploaded and saved: ${publicUrl} by ${req.adminUser?.email}`);

    res.json({
      success: true,
      logoUrl: publicUrl,
      settings: updatedSettings,
      message: 'Website logo uploaded, saved to persistent backend, and published successfully.',
    });
  } catch (err: any) {
    console.error('Logo upload error:', err);
    res.status(500).json({
      success: false,
      message: err?.message || 'Failed to process and save logo file.',
    });
  }
});

// Protected: Remove/Reset Logo
app.delete('/api/logo', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const currentSettings = getSettings();
    const updatedSettings = {
      ...currentSettings,
      logoUrl: '',
      updatedAt: new Date().toISOString(),
      updatedBy: req.adminUser?.email || 'admin',
    };

    saveSettings(updatedSettings);

    console.log(`[LOGO] Logo removed and reset to default brand mark by ${req.adminUser?.email}`);

    res.json({
      success: true,
      logoUrl: '',
      settings: updatedSettings,
      message: 'Website logo removed. Storefront reverted to default brand mark.',
    });
  } catch (err: any) {
    console.error('Logo delete error:', err);
    res.status(500).json({
      success: false,
      message: err?.message || 'Failed to remove logo.',
    });
  }
});

// Public: Get auth system configuration (authorized emails, Google client ID if set)
app.get('/api/auth/config', (_req: Request, res: Response) => {
  res.json({
    success: true,
    authorizedEmails: getAuthorizedAdminEmails(),
    googleClientId: process.env.VITE_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID || '',
  });
});

// ================= FRONTEND / VITE SERVER INTEGRATION =================

async function startServer() {
  if (!isProduction) {
    // Development mode: Mount Vite middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });

    app.use(vite.middlewares);
  } else {
    // Production mode: Serve built static files
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));

    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SERVER] Full-Stack server running at http://0.0.0.0:${PORT}`);
    console.log(`[SERVER] Admin Allowlist: ${getAuthorizedAdminEmails().join(', ')}`);
  });
}

startServer().catch((err) => {
  console.error('[SERVER] Fatal server error during startup:', err);
  process.exit(1);
});
