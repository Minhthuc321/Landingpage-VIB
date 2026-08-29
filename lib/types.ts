export type UserRole = 'admin' | 'editor';

export interface User {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  role: UserRole;
  createdAt: string;
}

export interface SiteContact {
  phone: string;
  zalo: string;
  facebook: string;
  tiktok: string;
  email: string;
  address: string;
  workingHours: string;
}

export interface SiteSettings {
  siteName: string;
  logoUrl: string;
  faviconUrl: string;
  defaultOgImage: string;
  contact: SiteContact;
}

export interface SeoSettings {
  seoTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  robots: 'index, follow' | 'noindex, nofollow';
  immutableDisclaimer: string;
  customDisclaimerNote: string;
}

export interface TrackingCodes {
  gaMeasurementId: string;
  gaEnabled: boolean;
  gtmContainerId: string;
  gtmEnabled: boolean;
  metaPixelId: string;
  metaPixelEnabled: boolean;
}

export interface ThemeColors {
  bgMain: string;
  navy: string;
  primaryBlue: string;
  gold: string;
  textMain: string;
  textMuted: string;
  cta: string;
  ctaHover: string;
  border: string;
  cardBg: string;
}

export interface ThemeTypography {
  headingFont: string;
  bodyFont: string;
  baseFontSize: string;
  headingWeight: string;
  lineHeight: string;
}

export interface ThemeComponents {
  buttonBorderRadius: string;
  cardBorderRadius: string;
  shadowLevel: string;
  sectionSpacing: string;
  containerWidth: string;
  ctaStyle: 'solid' | 'gradient' | 'glass';
  productCardStyle: 'classic' | 'modern_glass' | 'bordered';
  stickyHeader: boolean;
  showTopBar: boolean;
  showFloatingContact: boolean;
}

export interface ThemeSettings {
  colors: ThemeColors;
  typography: ThemeTypography;
  components: ThemeComponents;
}

export interface CtaButton {
  text: string;
  link: string;
  style: 'blue' | 'gold' | 'outline';
  action: 'link' | 'scroll' | 'call' | 'zalo';
}

export interface PageSection {
  id: string;
  key: string;
  name: string;
  title: string;
  subtitle?: string;
  description: string;
  badgeText?: string;
  enabled: boolean;
  order: number;
  icon?: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'none';
  ctaButtons?: CtaButton[];
  customData?: Record<string, any>;
}

export type ProductCategory = 'credit_card' | 'home_loan' | 'car_loan';

export interface ProductItem {
  id: string;
  category: ProductCategory;
  title: string;
  shortDescription: string;
  fullDescription: string;
  icon: string;
  imageUrl: string;
  benefits: string[];
  featured: boolean;
  enabled: boolean;
  order: number;
  ctaText: string;
  ctaAction: 'form' | 'phone' | 'zalo' | 'link';
  ctaLink?: string;
  seoTitle?: string;
  seoDescription?: string;
  isDeleted: boolean;
}

export interface MediaAsset {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  type: 'image' | 'video';
  altText: string;
  caption: string;
  videoConfig?: {
    autoplay: boolean;
    muted: boolean;
    loop: boolean;
    controls: boolean;
    videoUrl?: string;
    thumbnailUrl?: string;
  };
  isDeleted: boolean;
  createdAt: string;
}

export interface NavigationItem {
  id: string;
  location: 'header' | 'footer';
  title: string;
  target: string;
  isExternal: boolean;
  openInNewTab: boolean;
  enabled: boolean;
  order: number;
}

export interface CMSData {
  siteSettings: SiteSettings;
  seoSettings: SeoSettings;
  trackingCodes: TrackingCodes;
  themeSettings: ThemeSettings;
  sections: PageSection[];
  products: ProductItem[];
  mediaAssets: MediaAsset[];
  navigationItems: NavigationItem[];
}

export interface RevisionSnapshot {
  id: string;
  timestamp: string;
  modifiedBy: string;
  note: string;
  snapshot: CMSData;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
}

export interface CMSStore {
  status: 'draft' | 'published';
  lastSavedAt: string;
  lastPublishedAt: string;
  lastModifiedBy: string;
  published: CMSData;
  draft: CMSData;
  revisions: RevisionSnapshot[];
  users: User[];
  auditLogs: AuditLog[];
}
