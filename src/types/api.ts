// ==========================================
// SLICE API TYPES & SCHEMAS
// ==========================================

export type Language = 'en' | 'ar';

export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string | null;
  phone?: string | null;
  status?: 'active' | 'inactive' | 'suspended';
  role?: {
    id: number;
    name: string;
    slug: string;
  } | null;
  permissions?: string[];
  last_login_at?: string | null;
}

export interface Permission {
  id: number;
  name: string;
  slug: string;
  group: string;
  description?: string | null;
}

export interface Role {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  permissions?: Permission[];
  users_count?: number;
}

// CRM Leads
export type LeadStatus =
  | 'new'
  | 'contacted'
  | 'qualified'
  | 'proposal_sent'
  | 'negotiation'
  | 'won'
  | 'lost'
  | 'archived';

export type LeadPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface LeadNote {
  id: number;
  lead_id: number;
  user_id?: number | null;
  content: string;
  created_at: string;
  author?: {
    id: number;
    name: string;
    avatar?: string | null;
  } | null;
}

export interface LeadActivity {
  id: number;
  lead_id: number;
  user_id?: number | null;
  action_type: string;
  description: string;
  metadata?: Record<string, unknown> | null;
  created_at: string;
  user?: {
    id: number;
    name: string;
    avatar?: string | null;
  } | null;
}

export interface Lead {
  id: number;
  reference_code: string; // SLC-XXXXX
  full_name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  requested_service?: string | null;
  budget_range?: string | null;
  project_description?: string | null;
  preferred_language: 'en' | 'ar';
  status: LeadStatus;
  priority: LeadPriority;
  estimated_deal_value?: number | null;
  assigned_to?: number | null;
  assignedAgent?: {
    id: number;
    name: string;
    email: string;
    avatar?: string | null;
  } | null;
  source: string;
  referring_page?: string | null;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  utm_term?: string | null;
  utm_content?: string | null;
  ip_address?: string | null;
  user_agent?: string | null;
  won_at?: string | null;
  lost_at?: string | null;
  lost_reason?: string | null;
  last_contacted_at?: string | null;
  created_at: string;
  updated_at: string;
  notes?: LeadNote[];
  activities?: LeadActivity[];
}

export interface LeadFilters {
  search?: string;
  status?: LeadStatus | '';
  priority?: LeadPriority | '';
  service?: string;
  assigned_to?: number | '';
  date_from?: string;
  date_to?: string;
  per_page?: number;
  page?: number;
}

export interface CreateLeadPayload {
  full_name: string;
  email: string;
  phone?: string;
  company?: string;
  requested_service?: string;
  budget_range?: string;
  project_description: string;
  preferred_language?: 'en' | 'ar';
  referring_page?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
}

export interface UpdateLeadPayload {
  status?: LeadStatus;
  priority?: LeadPriority;
  estimated_deal_value?: number;
  full_name?: string;
  email?: string;
  phone?: string;
  company?: string;
  requested_service?: string;
  budget_range?: string;
  project_description?: string;
  lost_reason?: string;
}

// Media Assets
export interface MediaAsset {
  id: number;
  filename: string;
  disk: string;
  path: string;
  url: string;
  original_name: string;
  mime_type: string;
  file_size: number;
  width?: number | null;
  height?: number | null;
  alt_en?: string | null;
  alt_ar?: string | null;
  title?: string | null;
  tags?: string[] | null;
  uploaded_by?: number | null;
  uploadedBy?: {
    id: number;
    name: string;
  } | null;
  created_at: string;
}

// CMS Pages & Sections
export interface PageSection {
  id?: number;
  page_id?: number;
  section_type: string; // hero, brand_intro, services, video_strip, portfolio, why_slice, etc.
  order: number;
  is_enabled: boolean;
  layout_variant?: string | null;
  content: Record<string, any>;
  background_settings?: Record<string, any> | null;
}

export interface PageTranslation {
  id?: number;
  page_id?: number;
  locale: 'en' | 'ar';
  title: string;
  meta_title?: string | null;
  meta_description?: string | null;
  og_image?: string | null;
}

export interface PageRevision {
  id: number;
  page_id: number;
  version: number;
  snapshot: {
    page: Partial<Page>;
    translations: PageTranslation[];
    sections: PageSection[];
  };
  creator_id?: number | null;
  notes?: string | null;
  created_at: string;
}

export interface Page {
  id: number;
  slug: string;
  is_published: boolean;
  published_at?: string | null;
  author_id?: number | null;
  last_editor_id?: number | null;
  settings?: Record<string, any> | null;
  title?: string;
  meta_title?: string | null;
  meta_description?: string | null;
  og_image?: string | null;
  translations?: PageTranslation[];
  sections?: PageSection[];
  revisions?: PageRevision[];
  sections_count?: number;
  author?: { id: number; name: string } | null;
  lastEditor?: { id: number; name: string } | null;
  created_at: string;
  updated_at: string;
}

// Content Entities
export interface ServiceTranslation {
  id?: number;
  service_id?: number;
  locale: 'en' | 'ar';
  title: string;
  description: string;
  details?: string | null;
}

export interface Service {
  id: number;
  slug: string;
  icon?: string | null;
  featured_image?: string | null;
  order: number;
  is_visible: boolean;
  deliverables?: string[] | null;
  process?: string[] | null;
  duration_en?: string | null;
  duration_ar?: string | null;
  cta_label_en?: string | null;
  cta_label_ar?: string | null;
  cta_link?: string | null;
  translations?: ServiceTranslation[];
  title?: string;
  description?: string;
  details?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PortfolioTranslation {
  id?: number;
  portfolio_project_id?: number;
  locale: 'en' | 'ar';
  title: string;
  summary: string;
  challenge?: string | null;
  strategy?: string | null;
  execution?: string | null;
  outcomes?: string | null;
}

export interface PortfolioProject {
  id: number;
  slug: string;
  client_name: string;
  industry?: string | null;
  order: number;
  is_featured: boolean;
  is_published: boolean;
  published_at?: string | null;
  featured_image?: string | null;
  gallery?: string[] | null;
  translations?: PortfolioTranslation[];
  title?: string;
  summary?: string;
  challenge?: string;
  strategy?: string;
  execution?: string;
  outcomes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface VideoTranslation {
  id?: number;
  video_id?: number;
  locale: 'en' | 'ar';
  title: string;
  description?: string | null;
  tagline?: string | null;
  badge?: string | null;
}

export interface Video {
  id: number;
  provider: 'vimeo' | 'youtube' | 'self_hosted';
  provider_id: string;
  external_url?: string | null;
  video_path?: string | null;
  thumbnail_path?: string | null;
  aspect_ratio: string;
  duration?: string | null;
  category?: string | null;
  format_type: string;
  order: number;
  is_featured: boolean;
  is_published: boolean;
  translations?: VideoTranslation[];
  title?: string;
  description?: string;
  tagline?: string;
  badge?: string;
  created_at?: string;
  updated_at?: string;
}

// Global Settings & Navigation
export interface NavigationItem {
  id?: string;
  label_en: string;
  label_ar: string;
  href: string;
  target?: string;
}

export interface SiteConfig {
  branding: {
    agency_name: string;
    tagline_en: string;
    tagline_ar: string;
    primary_color: string;
    background_color: string;
    surface_color: string;
    logo_white_url: string;
    logo_dark_url: string;
    favicon_url: string;
  };
  contact: {
    email: string;
    phone: string;
    whatsapp: string;
    cairo_office: string;
    dubai_office: string;
    riyadh_office: string;
  };
  social: {
    instagram?: string;
    tiktok?: string;
    linkedin?: string;
    youtube?: string;
  };
  seo: {
    meta_title_en: string;
    meta_title_ar: string;
    meta_description_en: string;
    meta_description_ar: string;
    og_image: string;
  };
  navigation: {
    header: NavigationItem[];
    footer: {
      columns: Array<{
        title_en: string;
        title_ar: string;
        links: Array<{
          label_en: string;
          label_ar: string;
          href: string;
        }>;
      }>;
    };
  };
  locale: 'en' | 'ar';
}

// Dashboard Aggregate Response
export interface DashboardMetrics {
  total_leads: number;
  new_leads: number;
  contacted_leads: number;
  qualified_leads: number;
  proposal_sent: number;
  won_leads: number;
  lost_leads: number;
  conversion_rate_percentage: number;
  pipeline_value: number;
  won_revenue: number;
}

export interface DashboardResponse {
  metrics: DashboardMetrics;
  leads_by_status: Record<string, number>;
  leads_by_service: Record<string, number>;
  leads_timeline: Array<{ date: string; count: number }>;
  recent_activities: Array<{
    id: number;
    action: string;
    user?: { id: number; name: string; avatar?: string | null };
    created_at: string;
  }>;
  cms_stats: {
    pages_count: number;
    published_pages: number;
    services_count: number;
    portfolio_count: number;
    videos_count: number;
    media_assets_count: number;
  };
}

// Audit Log
export interface AuditLogItem {
  id: number;
  action: string;
  auditable_type?: string | null;
  auditable_id?: number | null;
  old_values?: Record<string, any> | null;
  new_values?: Record<string, any> | null;
  ip_address?: string | null;
  user_agent?: string | null;
  created_at: string;
  user?: {
    id: number;
    name: string;
    email: string;
    avatar?: string | null;
  } | null;
}
