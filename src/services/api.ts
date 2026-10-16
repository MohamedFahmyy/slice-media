import type {
  CreateLeadPayload,
  DashboardResponse,
  Lead,
  LeadFilters,
  LeadNote,
  MediaAsset,
  Page,
  PortfolioProject,
  Role,
  Service,
  SiteConfig,
  UpdateLeadPayload,
  User,
  Video,
  AuditLogItem,
  Language,
} from '../types/api';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8001/api/v1';

class ApiService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('slice_admin_token');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('slice_admin_token', token);
    } else {
      localStorage.removeItem('slice_admin_token');
    }
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('slice_admin_token');
    }
    return this.token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<{ success: boolean; data?: T; message?: string; [key: string]: any }> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers: Record<string, string> = {
      Accept: 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const json = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (response.status === 401 && endpoint.startsWith('/admin')) {
          this.setToken(null);
          // dispatch unauthorized event or redirect
        }
        const errorMsg =
          json.message ||
          (json.errors ? Object.values(json.errors).flat().join(', ') : null) ||
          `Request failed with status ${response.status}`;
        throw new Error(errorMsg);
      }

      return json;
    } catch (err: any) {
      console.warn(`[API] ${endpoint} error:`, err.message);
      throw err;
    }
  }

  // ==========================================
  // PUBLIC CLIENT ENDPOINTS
  // ==========================================

  async getSiteConfig(locale: Language = 'en'): Promise<SiteConfig> {
    const res = await this.request<SiteConfig>(`/site-config?locale=${locale}`);
    return res.data!;
  }

  async getPage(
    slug: string,
    locale: Language = 'en',
    previewToken?: string
  ): Promise<Page> {
    let query = `?locale=${locale}`;
    if (previewToken) query += `&preview_token=${previewToken}`;
    const res = await this.request<Page>(`/pages/${slug}${query}`);
    return res.data!;
  }

  async getServices(locale: Language = 'en'): Promise<Service[]> {
    const res = await this.request<Service[]>(`/services?locale=${locale}`);
    return res.data || [];
  }

  async getPortfolio(locale: Language = 'en'): Promise<PortfolioProject[]> {
    const res = await this.request<PortfolioProject[]>(`/portfolio?locale=${locale}`);
    return res.data || [];
  }

  async getVideos(locale: Language = 'en'): Promise<Video[]> {
    const res = await this.request<Video[]>(`/videos?locale=${locale}`);
    return res.data || [];
  }

  async submitLead(payload: CreateLeadPayload): Promise<{
    success: boolean;
    reference_code: string;
    message: string;
    message_ar?: string;
  }> {
    const res = await this.request<{ reference_code: string; message: string }>(
      '/leads',
      {
        method: 'POST',
        body: JSON.stringify(payload),
      }
    );
    return res as any;
  }

  // ==========================================
  // ADMIN AUTHENTICATION
  // ==========================================

  async login(credentials: { email: string; password: string }): Promise<{
    token: string;
    user: User;
  }> {
    const res = await this.request<{ token: string; user: User }>(
      '/admin/auth/login',
      {
        method: 'POST',
        body: JSON.stringify(credentials),
      }
    );
    if (res.token) {
      this.setToken(res.token);
    }
    return { token: res.token, user: res.user };
  }

  async logout(): Promise<void> {
    try {
      await this.request('/admin/auth/logout', { method: 'POST' });
    } finally {
      this.setToken(null);
    }
  }

  async getMe(): Promise<User> {
    const res = await this.request<{ user: User }>('/admin/auth/me');
    return res.user;
  }

  async updateProfile(data: {
    name: string;
    phone?: string;
    avatar?: string;
    current_password?: string;
    new_password?: string;
  }): Promise<{ message: string; user: User }> {
    const res = await this.request<{ message: string; user: User }>(
      '/admin/auth/profile',
      {
        method: 'PUT',
        body: JSON.stringify(data),
      }
    );
    return res as any;
  }

  // ==========================================
  // ADMIN DASHBOARD & CRM
  // ==========================================

  async getDashboard(): Promise<DashboardResponse> {
    const res = await this.request<DashboardResponse>('/admin/dashboard');
    return res.data!;
  }

  async getLeads(filters: LeadFilters = {}): Promise<{
    data: Lead[];
    current_page: number;
    last_page: number;
    total: number;
  }> {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.status) params.append('status', filters.status);
    if (filters.priority) params.append('priority', filters.priority);
    if (filters.service) params.append('service', filters.service);
    if (filters.assigned_to) params.append('assigned_to', String(filters.assigned_to));
    if (filters.date_from) params.append('date_from', filters.date_from);
    if (filters.date_to) params.append('date_to', filters.date_to);
    if (filters.page) params.append('page', String(filters.page));
    if (filters.per_page) params.append('per_page', String(filters.per_page));

    const res = await this.request<any>(`/admin/leads?${params.toString()}`);
    return res.data;
  }

  async getLead(id: number): Promise<Lead> {
    const res = await this.request<Lead>(`/admin/leads/${id}`);
    return res.data!;
  }

  async updateLead(id: number, data: UpdateLeadPayload): Promise<Lead> {
    const res = await this.request<Lead>(`/admin/leads/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    return res.data!;
  }

  async assignLead(id: number, assignedTo: number | null): Promise<Lead> {
    const res = await this.request<Lead>(`/admin/leads/${id}/assign`, {
      method: 'POST',
      body: JSON.stringify({ assigned_to: assignedTo }),
    });
    return res.data!;
  }

  async addLeadNote(id: number, content: string): Promise<LeadNote> {
    const res = await this.request<LeadNote>(`/admin/leads/${id}/notes`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
    return res.data!;
  }

  getExportCsvUrl(filters: LeadFilters = {}): string {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.status) params.append('status', filters.status);
    if (filters.priority) params.append('priority', filters.priority);
    if (filters.service) params.append('service', filters.service);
    if (filters.assigned_to) params.append('assigned_to', String(filters.assigned_to));
    return `${API_BASE_URL}/admin/leads/export/csv?${params.toString()}`;
  }

  // ==========================================
  // CMS PAGES & VISUAL BUILDER
  // ==========================================

  async getPages(): Promise<Page[]> {
    const res = await this.request<Page[]>('/admin/pages');
    return res.data || [];
  }

  async getPageAdmin(id: number): Promise<Page> {
    const res = await this.request<Page>(`/admin/pages/${id}`);
    return res.data!;
  }

  async createPage(data: {
    slug: string;
    title_en: string;
    title_ar: string;
    meta_description_en?: string;
    meta_description_ar?: string;
  }): Promise<Page> {
    const res = await this.request<Page>('/admin/pages', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.data!;
  }

  async updatePage(id: number, data: Partial<Page>): Promise<Page> {
    const res = await this.request<Page>(`/admin/pages/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return res.data!;
  }

  async savePageSections(
    id: number,
    sections: any[],
    revisionNotes?: string
  ): Promise<{ version: number; sections: any[] }> {
    const res = await this.request<any>(`/admin/pages/${id}/sections`, {
      method: 'PUT',
      body: JSON.stringify({
        sections,
        revision_notes: revisionNotes,
      }),
    });
    return (res.data || res) as any;
  }

  async publishPage(id: number): Promise<{ published_at: string }> {
    const res = await this.request<any>(`/admin/pages/${id}/publish`, {
      method: 'POST',
    });
    return (res.data || res) as any;
  }

  async unpublishPage(id: number): Promise<void> {
    await this.request(`/admin/pages/${id}/unpublish`, { method: 'POST' });
  }

  async restoreRevision(pageId: number, revisionId: number): Promise<Page> {
    const res = await this.request<Page>(
      `/admin/pages/${pageId}/restore/${revisionId}`,
      {
        method: 'POST',
      }
    );
    return res.data!;
  }

  // ==========================================
  // MEDIA LIBRARY
  // ==========================================

  async getMedia(params: { type?: string; search?: string; page?: number } = {}): Promise<{
    data: MediaAsset[];
    current_page: number;
    last_page: number;
    total: number;
  }> {
    const searchParams = new URLSearchParams();
    if (params.type) searchParams.append('type', params.type);
    if (params.search) searchParams.append('search', params.search);
    if (params.page) searchParams.append('page', String(params.page));

    const res = await this.request<any>(`/admin/media?${searchParams.toString()}`);
    return res.data;
  }

  async uploadMedia(formData: FormData): Promise<MediaAsset> {
    const res = await this.request<MediaAsset>('/admin/media', {
      method: 'POST',
      body: formData,
    });
    return res.data!;
  }

  async updateMedia(id: number, data: { title?: string; alt_en?: string; alt_ar?: string; tags?: string[] }): Promise<MediaAsset> {
    const res = await this.request<MediaAsset>(`/admin/media/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return res.data!;
  }

  async deleteMedia(id: number): Promise<void> {
    await this.request(`/admin/media/${id}`, { method: 'DELETE' });
  }

  // ==========================================
  // SERVICES CRUD
  // ==========================================

  async getAdminServices(): Promise<Service[]> {
    const res = await this.request<Service[]>('/admin/services');
    return res.data || [];
  }

  async createService(data: any): Promise<Service> {
    const res = await this.request<Service>('/admin/services', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.data!;
  }

  async updateService(id: number, data: any): Promise<Service> {
    const res = await this.request<Service>(`/admin/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return res.data!;
  }

  async deleteService(id: number): Promise<void> {
    await this.request(`/admin/services/${id}`, { method: 'DELETE' });
  }

  // ==========================================
  // PORTFOLIO CRUD
  // ==========================================

  async getAdminPortfolio(): Promise<PortfolioProject[]> {
    const res = await this.request<PortfolioProject[]>('/admin/portfolio');
    return res.data || [];
  }

  async createPortfolio(data: any): Promise<PortfolioProject> {
    const res = await this.request<PortfolioProject>('/admin/portfolio', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.data!;
  }

  async updatePortfolio(id: number, data: any): Promise<PortfolioProject> {
    const res = await this.request<PortfolioProject>(`/admin/portfolio/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return res.data!;
  }

  async deletePortfolio(id: number): Promise<void> {
    await this.request(`/admin/portfolio/${id}`, { method: 'DELETE' });
  }

  // ==========================================
  // VIDEOS CRUD
  // ==========================================

  async getAdminVideos(): Promise<Video[]> {
    const res = await this.request<Video[]>('/admin/videos');
    return res.data || [];
  }

  async createVideo(data: any): Promise<Video> {
    const res = await this.request<Video>('/admin/videos', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.data!;
  }

  async updateVideo(id: number, data: any): Promise<Video> {
    const res = await this.request<Video>(`/admin/videos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return res.data!;
  }

  async deleteVideo(id: number): Promise<void> {
    await this.request(`/admin/videos/${id}`, { method: 'DELETE' });
  }

  // ==========================================
  // STAFF USERS & ROLES
  // ==========================================

  async getUsers(): Promise<User[]> {
    const res = await this.request<User[]>('/admin/users');
    return res.data || [];
  }

  async createUser(data: any): Promise<User> {
    const res = await this.request<User>('/admin/users', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.data!;
  }

  async updateUser(id: number, data: any): Promise<User> {
    const res = await this.request<User>(`/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return res.data!;
  }

  async deleteUser(id: number): Promise<void> {
    await this.request(`/admin/users/${id}`, { method: 'DELETE' });
  }

  async getRoles(): Promise<{ roles: Role[]; available_permissions: Record<string, any[]> }> {
    const res = await this.request<any>('/admin/roles');
    return res.data;
  }

  async updateRole(id: number, data: { name: string; description?: string; permission_ids: number[] }): Promise<Role> {
    const res = await this.request<Role>(`/admin/roles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return res.data!;
  }

  // ==========================================
  // SETTINGS & AUDIT LOGS
  // ==========================================

  async getSettings(): Promise<{ settings: Record<string, any>; navigation: any }> {
    const res = await this.request<any>('/admin/settings');
    return res.data;
  }

  async updateSettings(data: any): Promise<void> {
    await this.request('/admin/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getActivityLogs(page = 1): Promise<{
    data: AuditLogItem[];
    current_page: number;
    last_page: number;
    total: number;
  }> {
    const res = await this.request<any>(`/admin/activity?page=${page}`);
    return res.data;
  }
}

export const api = new ApiService();
