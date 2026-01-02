'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Heart, Flag, AlertTriangle, Check, X, Ban, Loader2, Search, Shield, ShieldOff, Trash2, ChevronLeft, ChevronRight, Settings, CreditCard, MessageSquare, Plus, Edit2, ToggleLeft, ToggleRight, Save } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';

interface Stats {
  totalUsers: number;
  newUsersToday: number;
  totalMatches: number;
  matchesToday: number;
  openReports: number;
  reportsToday: number;
}

interface AppSettings {
  plusMonthlyPrice: number;
  plusYearlyPrice: number;
  premiumMonthlyPrice: number;
  premiumYearlyPrice: number;
  freeDailyLikes: number;
  freeUndosPerDay: number;
  plusDailyLikes: number;
  plusUndosPerDay: number;
  premiumDailyLikes: number;
  premiumUndosPerDay: number;
  maxDiscoveryDistance: number;
  minAge: number;
  maxAge: number;
  minPhotos: number;
  maxPhotos: number;
  minPrompts: number;
  maxPrompts: number;
  maxBioLength: number;
  maxPromptAnswerLength: number;
  autoFlagKeywords: string;
  maxReportsBeforeReview: number;
  enablePhoneAuth: boolean;
  enableSocialAuth: boolean;
  enableImageMessages: boolean;
  maintenanceMode: boolean;
}

interface SubscriptionTier {
  id: string;
  name: string;
  displayName: string;
  description: string | null;
  monthlyPrice: number;
  yearlyPrice: number;
  dailyLikes: number;
  dailyUndos: number;
  seeWhoLikesYou: boolean;
  advancedFilters: boolean;
  readReceipts: boolean;
  prioritySupport: boolean;
  profileBoost: boolean;
  noAds: boolean;
  badgeColor: string | null;
  badgeIcon: string | null;
  isActive: boolean;
  sortOrder: number;
}

interface Prompt {
  id: string;
  text: string;
  category: string;
  isActive: boolean;
  _count: { answers: number };
}

interface Report {
  id: string;
  reason: string;
  notes?: string;
  status: string;
  createdAt: string;
  reporter: {
    email: string;
    profile?: { name: string };
  };
  reported: {
    id: string;
    email: string;
    profile?: { name: string };
    photos?: { url: string }[];
  };
}

interface User {
  id: string;
  email: string;
  isAdmin: boolean;
  isBanned: boolean;
  createdAt: string;
  lastActive: string;
  profile: {
    name: string;
    city: string;
    photo?: string;
  } | null;
  reportsCount: number;
  likesCount: number;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'reports' | 'pricing' | 'prompts' | 'settings'>('overview');
  const [stats, setStats] = useState<Stats | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [processing, setProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Settings state
  const [appSettings, setAppSettings] = useState<AppSettings | null>(null);
  const [tiers, setTiers] = useState<SubscriptionTier[]>([]);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [editingTier, setEditingTier] = useState<SubscriptionTier | null>(null);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  const [newPrompt, setNewPrompt] = useState({ text: '', category: 'fun' });
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers(1);
    }
    if (activeTab === 'pricing' || activeTab === 'settings') {
      fetchSettings();
    }
    if (activeTab === 'prompts') {
      fetchPrompts();
    }
  }, [activeTab, statusFilter]);

  const fetchSettings = async () => {
    setSettingsLoading(true);
    try {
      const res = await fetch('/api/admin/settings');
      if (res.ok) {
        const data = await res.json();
        setAppSettings(data.settings);
        setTiers(data.tiers);
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setSettingsLoading(false);
    }
  };

  const fetchPrompts = async () => {
    setSettingsLoading(true);
    try {
      const res = await fetch('/api/admin/prompts');
      if (res.ok) {
        const data = await res.json();
        setPrompts(data.prompts);
      }
    } catch (error) {
      console.error('Failed to fetch prompts:', error);
    } finally {
      setSettingsLoading(false);
    }
  };

  const saveSettings = async (data: Partial<AppSettings>) => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'settings', data }),
      });
      if (res.ok) {
        const result = await res.json();
        setAppSettings(result.settings);
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const saveTier = async (tier: SubscriptionTier) => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'tier', data: tier }),
      });
      if (res.ok) {
        const result = await res.json();
        setTiers(tiers.map(t => t.id === result.tier.id ? result.tier : t));
        setEditingTier(null);
      }
    } catch (error) {
      console.error('Failed to save tier:', error);
    } finally {
      setSaving(false);
    }
  };

  const createPrompt = async () => {
    if (!newPrompt.text.trim()) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/prompts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPrompt),
      });
      if (res.ok) {
        const result = await res.json();
        setPrompts([...prompts, { ...result.prompt, _count: { answers: 0 } }]);
        setNewPrompt({ text: '', category: 'fun' });
      }
    } catch (error) {
      console.error('Failed to create prompt:', error);
    } finally {
      setSaving(false);
    }
  };

  const updatePrompt = async (prompt: Prompt) => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/prompts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prompt),
      });
      if (res.ok) {
        const result = await res.json();
        setPrompts(prompts.map(p => p.id === result.prompt.id ? { ...result.prompt, _count: p._count } : p));
        setEditingPrompt(null);
      }
    } catch (error) {
      console.error('Failed to update prompt:', error);
    } finally {
      setSaving(false);
    }
  };

  const deletePrompt = async (id: string) => {
    if (!confirm('Are you sure you want to delete this prompt?')) return;
    try {
      const res = await fetch(`/api/admin/prompts?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setPrompts(prompts.filter(p => p.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete prompt:', error);
    }
  };

  const fetchData = async () => {
    try {
      const [statsRes, reportsRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/reports'),
      ]);

      if (statsRes.status === 401 || reportsRes.status === 401) {
        router.push('/login');
        return;
      }

      const statsData = await statsRes.json();
      const reportsData = await reportsRes.json();

      setStats(statsData.stats);
      setReports(reportsData.reports || []);
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async (page: number) => {
    setUsersLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        status: statusFilter,
        ...(searchQuery && { search: searchQuery }),
      });
      
      const res = await fetch(`/api/admin/users?${params}`);
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setUsersLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers(1);
  };

  const handleUserAction = async (userId: string, action: string) => {
    setProcessing(true);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action }),
      });

      if (res.ok) {
        const data = await res.json();
        setUsers(users.map(u => u.id === userId ? { ...u, ...data.user } : u));
        setSelectedUser(null);
        // Refresh stats
        fetchData();
      }
    } catch (error) {
      console.error('Failed to update user:', error);
    } finally {
      setProcessing(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to permanently delete this user? This cannot be undone.')) {
      return;
    }
    
    setProcessing(true);
    try {
      const res = await fetch(`/api/admin/users?userId=${userId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setUsers(users.filter(u => u.id !== userId));
        setSelectedUser(null);
        fetchData();
      }
    } catch (error) {
      console.error('Failed to delete user:', error);
    } finally {
      setProcessing(false);
    }
  };

  const handleReportAction = async (reportId: string, status: string, action?: string) => {
    setProcessing(true);
    try {
      await fetch('/api/admin/reports', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportId, status, action }),
      });
      
      setReports(reports.map(r => 
        r.id === reportId ? { ...r, status } : r
      ));
      setSelectedReport(null);
    } catch (error) {
      console.error('Failed to update report:', error);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-coral-500" />
      </div>
    );
  }

  const openReports = reports.filter(r => r.status === 'open');
  const reviewedReports = reports.filter(r => r.status !== 'open');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-coral-400 to-coral-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">L</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-500">LinkUp Moderation</p>
              </div>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="flex gap-1 mt-6 flex-wrap">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'overview'
                  ? 'bg-coral-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'users'
                  ? 'bg-coral-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Users
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'reports'
                  ? 'bg-coral-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Reports {openReports.length > 0 && (
                <span className="ml-1 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                  {openReports.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('pricing')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'pricing'
                  ? 'bg-coral-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              Pricing
            </button>
            <button
              onClick={() => setActiveTab('prompts')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'prompts'
                  ? 'bg-coral-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Prompts
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'settings'
                  ? 'bg-coral-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Settings className="w-4 h-4" />
              Settings
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-sm text-gray-500">Total Users</span>
                </div>
                <p className="text-3xl font-bold text-gray-900">{stats?.totalUsers || 0}</p>
                <p className="text-sm text-green-600">+{stats?.newUsersToday || 0} today</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center">
                    <Heart className="w-5 h-5 text-pink-600" />
                  </div>
                  <span className="text-sm text-gray-500">Total Matches</span>
                </div>
                <p className="text-3xl font-bold text-gray-900">{stats?.totalMatches || 0}</p>
                <p className="text-sm text-green-600">+{stats?.matchesToday || 0} today</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                    <Flag className="w-5 h-5 text-red-600" />
                  </div>
                  <span className="text-sm text-gray-500">Open Reports</span>
                </div>
                <p className="text-3xl font-bold text-gray-900">{stats?.openReports || 0}</p>
                <p className="text-sm text-gray-500">+{stats?.reportsToday || 0} today</p>
              </div>
            </div>

            {/* Quick Reports Preview */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Reports Queue</h2>
                {openReports.length > 0 && (
                  <button
                    onClick={() => setActiveTab('reports')}
                    className="text-sm text-coral-500 font-medium hover:text-coral-600"
                  >
                    View all →
                  </button>
                )}
              </div>

              {openReports.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">All caught up!</h3>
                  <p className="text-gray-500">No open reports to review</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {openReports.slice(0, 3).map((report) => (
                    <div
                      key={report.id}
                      className="p-4 hover:bg-gray-50 cursor-pointer"
                      onClick={() => { setSelectedReport(report); setActiveTab('reports'); }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100">
                          {report.reported.photos?.[0]?.url ? (
                            <img src={report.reported.photos[0].url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-lg">👤</div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="font-medium text-gray-900">
                            {report.reported.profile?.name || report.reported.email}
                          </span>
                          <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-600 text-xs font-medium rounded-full">
                            {report.reason}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <>
            {/* Search and Filters */}
            <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <form onSubmit={handleSearch} className="flex-1 flex gap-2">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by name or email..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:border-coral-500 focus:ring-2 focus:ring-coral-500/20 outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-coral-500 text-white rounded-xl font-medium hover:bg-coral-600 transition-colors"
                  >
                    Search
                  </button>
                </form>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-xl focus:border-coral-500 outline-none"
                >
                  <option value="all">All Users</option>
                  <option value="active">Active</option>
                  <option value="banned">Banned</option>
                </select>
              </div>
            </div>

            {/* Users List */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              {usersLoading ? (
                <div className="p-12 text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-coral-500 mx-auto" />
                </div>
              ) : users.length === 0 ? (
                <div className="p-12 text-center">
                  <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No users found</p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                          <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">User</th>
                          <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                          <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Joined</th>
                          <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Last Active</th>
                          <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Reports</th>
                          <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {users.map((user) => (
                          <tr key={user.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                                  {user.profile?.photo ? (
                                    <img src={user.profile.photo} alt="" className="w-full h-full object-cover" />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-lg">👤</div>
                                  )}
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {user.profile?.name || 'No profile'}
                                    {user.isAdmin && (
                                      <span className="ml-2 px-2 py-0.5 bg-purple-100 text-purple-600 text-xs font-medium rounded-full">
                                        Admin
                                      </span>
                                    )}
                                  </p>
                                  <p className="text-sm text-gray-500">{user.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              {user.isBanned ? (
                                <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-medium rounded-full">
                                  Banned
                                </span>
                              ) : (
                                <span className="px-2 py-1 bg-green-100 text-green-600 text-xs font-medium rounded-full">
                                  Active
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              {format(new Date(user.createdAt), 'MMM d, yyyy')}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              {formatDistanceToNow(new Date(user.lastActive), { addSuffix: true })}
                            </td>
                            <td className="px-6 py-4">
                              {user.reportsCount > 0 ? (
                                <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-medium rounded-full">
                                  {user.reportsCount}
                                </span>
                              ) : (
                                <span className="text-sm text-gray-400">0</span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button
                                onClick={() => setSelectedUser(user)}
                                className="text-coral-500 hover:text-coral-600 font-medium text-sm"
                              >
                                Manage
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {pagination && pagination.totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                      <p className="text-sm text-gray-500">
                        Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} users
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => fetchUsers(pagination.page - 1)}
                          disabled={pagination.page === 1}
                          className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => fetchUsers(pagination.page + 1)}
                          disabled={pagination.page === pagination.totalPages}
                          className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <>
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Open Reports ({openReports.length})</h2>
              </div>

              {openReports.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">All caught up!</h3>
                  <p className="text-gray-500">No open reports to review</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {openReports.map((report) => (
                    <div
                      key={report.id}
                      className="p-4 hover:bg-gray-50 cursor-pointer"
                      onClick={() => setSelectedReport(report)}
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-gray-100">
                          {report.reported.photos?.[0]?.url ? (
                            <img src={report.reported.photos[0].url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xl">👤</div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-gray-900">
                              {report.reported.profile?.name || report.reported.email}
                            </span>
                            <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs font-medium rounded-full">
                              {report.reason}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 truncate">
                            Reported by {report.reporter.profile?.name || report.reporter.email}
                          </p>
                          {report.notes && (
                            <p className="text-sm text-gray-600 mt-1 truncate">&quot;{report.notes}&quot;</p>
                          )}
                        </div>
                        <span className="text-xs text-gray-400">
                          {formatDistanceToNow(new Date(report.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Actions */}
            {reviewedReports.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Actions</h2>
                </div>
                <div className="divide-y divide-gray-100">
                  {reviewedReports.slice(0, 10).map((report) => (
                    <div key={report.id} className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          report.status === 'banned' ? 'bg-red-100' : 'bg-green-100'
                        }`}>
                          {report.status === 'banned' ? (
                            <Ban className="w-4 h-4 text-red-600" />
                          ) : (
                            <Check className="w-4 h-4 text-green-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">
                            <span className="font-medium">{report.reported.profile?.name || report.reported.email}</span>
                            {' '}was{' '}
                            <span className={report.status === 'banned' ? 'text-red-600' : 'text-green-600'}>
                              {report.status}
                            </span>
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDistanceToNow(new Date(report.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Pricing Tab */}
        {activeTab === 'pricing' && (
          <>
            {settingsLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-coral-500" />
              </div>
            ) : (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900">Subscription Tiers</h2>
                
                <div className="grid gap-6 md:grid-cols-3">
                  {tiers.map((tier) => (
                    <div key={tier.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                      <div className={`p-4 ${tier.name === 'premium' ? 'bg-gradient-to-r from-amber-400 to-orange-500' : tier.name === 'plus' ? 'bg-gradient-to-r from-blue-400 to-blue-600' : 'bg-gray-100'}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {tier.badgeIcon && <span className="text-2xl">{tier.badgeIcon}</span>}
                            <h3 className={`text-lg font-bold ${tier.name === 'free' ? 'text-gray-900' : 'text-white'}`}>
                              {tier.displayName}
                            </h3>
                          </div>
                          <button
                            onClick={() => setEditingTier(tier)}
                            className={`p-2 rounded-lg ${tier.name === 'free' ? 'hover:bg-gray-200' : 'hover:bg-white/20'}`}
                          >
                            <Edit2 className={`w-4 h-4 ${tier.name === 'free' ? 'text-gray-600' : 'text-white'}`} />
                          </button>
                        </div>
                      </div>
                      
                      <div className="p-4 space-y-4">
                        <div>
                          <p className="text-sm text-gray-500">Monthly Price</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {tier.monthlyPrice === 0 ? 'Free' : `£${(tier.monthlyPrice / 100).toFixed(2)}`}
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-500">Yearly Price</p>
                          <p className="text-lg font-semibold text-gray-700">
                            {tier.yearlyPrice === 0 ? 'Free' : `£${(tier.yearlyPrice / 100).toFixed(2)}/year`}
                          </p>
                        </div>
                        
                        <div className="border-t pt-4 space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Daily Likes</span>
                            <span className="font-medium">{tier.dailyLikes === -1 ? 'Unlimited' : tier.dailyLikes}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Daily Undos</span>
                            <span className="font-medium">{tier.dailyUndos === -1 ? 'Unlimited' : tier.dailyUndos}</span>
                          </div>
                        </div>
                        
                        <div className="border-t pt-4 space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            {tier.seeWhoLikesYou ? <Check className="w-4 h-4 text-green-500" /> : <X className="w-4 h-4 text-gray-300" />}
                            <span className={tier.seeWhoLikesYou ? 'text-gray-900' : 'text-gray-400'}>See who likes you</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            {tier.advancedFilters ? <Check className="w-4 h-4 text-green-500" /> : <X className="w-4 h-4 text-gray-300" />}
                            <span className={tier.advancedFilters ? 'text-gray-900' : 'text-gray-400'}>Advanced filters</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            {tier.readReceipts ? <Check className="w-4 h-4 text-green-500" /> : <X className="w-4 h-4 text-gray-300" />}
                            <span className={tier.readReceipts ? 'text-gray-900' : 'text-gray-400'}>Read receipts</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            {tier.profileBoost ? <Check className="w-4 h-4 text-green-500" /> : <X className="w-4 h-4 text-gray-300" />}
                            <span className={tier.profileBoost ? 'text-gray-900' : 'text-gray-400'}>Profile boost</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            {tier.noAds ? <Check className="w-4 h-4 text-green-500" /> : <X className="w-4 h-4 text-gray-300" />}
                            <span className={tier.noAds ? 'text-gray-900' : 'text-gray-400'}>No ads</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Prompts Tab */}
        {activeTab === 'prompts' && (
          <>
            {settingsLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-coral-500" />
              </div>
            ) : (
              <div className="space-y-6">
                {/* Add New Prompt */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Prompt</h3>
                  <div className="flex gap-4">
                    <input
                      type="text"
                      value={newPrompt.text}
                      onChange={(e) => setNewPrompt({ ...newPrompt, text: e.target.value })}
                      placeholder="Enter prompt text..."
                      className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:border-coral-500 focus:ring-2 focus:ring-coral-500/20 outline-none"
                    />
                    <select
                      value={newPrompt.category}
                      onChange={(e) => setNewPrompt({ ...newPrompt, category: e.target.value })}
                      className="px-4 py-2 border border-gray-200 rounded-xl focus:border-coral-500 outline-none"
                    >
                      <option value="fun">Fun</option>
                      <option value="values">Values</option>
                      <option value="lifestyle">Lifestyle</option>
                      <option value="relationship">Relationship</option>
                    </select>
                    <button
                      onClick={createPrompt}
                      disabled={saving || !newPrompt.text.trim()}
                      className="px-6 py-2 bg-coral-500 text-white rounded-xl font-medium hover:bg-coral-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                      Add
                    </button>
                  </div>
                </div>

                {/* Prompts List by Category */}
                {['fun', 'values', 'lifestyle', 'relationship'].map((category) => {
                  const categoryPrompts = prompts.filter(p => p.category === category);
                  if (categoryPrompts.length === 0) return null;
                  
                  return (
                    <div key={category} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                      <div className="p-4 border-b border-gray-100 bg-gray-50">
                        <h3 className="font-semibold text-gray-900 capitalize">{category} ({categoryPrompts.length})</h3>
                      </div>
                      <div className="divide-y divide-gray-100">
                        {categoryPrompts.map((prompt) => (
                          <div key={prompt.id} className="p-4 flex items-center gap-4">
                            <div className="flex-1">
                              <p className={`text-gray-900 ${!prompt.isActive ? 'line-through opacity-50' : ''}`}>
                                {prompt.text}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {prompt._count.answers} answers
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => updatePrompt({ ...prompt, isActive: !prompt.isActive })}
                                className={`p-2 rounded-lg ${prompt.isActive ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-100'}`}
                                title={prompt.isActive ? 'Deactivate' : 'Activate'}
                              >
                                {prompt.isActive ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                              </button>
                              <button
                                onClick={() => setEditingPrompt(prompt)}
                                className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => deletePrompt(prompt.id)}
                                className="p-2 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <>
            {settingsLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-coral-500" />
              </div>
            ) : appSettings && (
              <div className="space-y-6">
                {/* Profile Settings */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Settings</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm text-gray-500 mb-1">Min Photos</label>
                      <input
                        type="number"
                        value={appSettings.minPhotos}
                        onChange={(e) => setAppSettings({ ...appSettings, minPhotos: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-coral-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500 mb-1">Max Photos</label>
                      <input
                        type="number"
                        value={appSettings.maxPhotos}
                        onChange={(e) => setAppSettings({ ...appSettings, maxPhotos: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-coral-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500 mb-1">Min Prompts</label>
                      <input
                        type="number"
                        value={appSettings.minPrompts}
                        onChange={(e) => setAppSettings({ ...appSettings, minPrompts: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-coral-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500 mb-1">Max Prompts</label>
                      <input
                        type="number"
                        value={appSettings.maxPrompts}
                        onChange={(e) => setAppSettings({ ...appSettings, maxPrompts: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-coral-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500 mb-1">Max Bio Length</label>
                      <input
                        type="number"
                        value={appSettings.maxBioLength}
                        onChange={(e) => setAppSettings({ ...appSettings, maxBioLength: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-coral-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500 mb-1">Max Prompt Answer</label>
                      <input
                        type="number"
                        value={appSettings.maxPromptAnswerLength}
                        onChange={(e) => setAppSettings({ ...appSettings, maxPromptAnswerLength: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-coral-500 outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Discovery Settings */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Discovery Settings</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm text-gray-500 mb-1">Max Distance (km)</label>
                      <input
                        type="number"
                        value={appSettings.maxDiscoveryDistance}
                        onChange={(e) => setAppSettings({ ...appSettings, maxDiscoveryDistance: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-coral-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500 mb-1">Min Age</label>
                      <input
                        type="number"
                        value={appSettings.minAge}
                        onChange={(e) => setAppSettings({ ...appSettings, minAge: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-coral-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500 mb-1">Max Age</label>
                      <input
                        type="number"
                        value={appSettings.maxAge}
                        onChange={(e) => setAppSettings({ ...appSettings, maxAge: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-coral-500 outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Safety Settings */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Safety Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-500 mb-1">Auto-flag Keywords (comma-separated)</label>
                      <input
                        type="text"
                        value={appSettings.autoFlagKeywords}
                        onChange={(e) => setAppSettings({ ...appSettings, autoFlagKeywords: e.target.value })}
                        placeholder="spam, scam, inappropriate..."
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-coral-500 outline-none"
                      />
                    </div>
                    <div className="w-48">
                      <label className="block text-sm text-gray-500 mb-1">Reports Before Auto-Review</label>
                      <input
                        type="number"
                        value={appSettings.maxReportsBeforeReview}
                        onChange={(e) => setAppSettings({ ...appSettings, maxReportsBeforeReview: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-coral-500 outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Feature Flags */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Feature Flags</h3>
                  <div className="space-y-4">
                    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-xl cursor-pointer">
                      <div>
                        <p className="font-medium text-gray-900">Phone Authentication</p>
                        <p className="text-sm text-gray-500">Allow users to sign up with phone number</p>
                      </div>
                      <button
                        onClick={() => setAppSettings({ ...appSettings, enablePhoneAuth: !appSettings.enablePhoneAuth })}
                        className={`p-1 rounded-full ${appSettings.enablePhoneAuth ? 'bg-green-500' : 'bg-gray-300'}`}
                      >
                        {appSettings.enablePhoneAuth ? <ToggleRight className="w-6 h-6 text-white" /> : <ToggleLeft className="w-6 h-6 text-white" />}
                      </button>
                    </label>
                    
                    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-xl cursor-pointer">
                      <div>
                        <p className="font-medium text-gray-900">Social Login</p>
                        <p className="text-sm text-gray-500">Allow Google/Apple sign in</p>
                      </div>
                      <button
                        onClick={() => setAppSettings({ ...appSettings, enableSocialAuth: !appSettings.enableSocialAuth })}
                        className={`p-1 rounded-full ${appSettings.enableSocialAuth ? 'bg-green-500' : 'bg-gray-300'}`}
                      >
                        {appSettings.enableSocialAuth ? <ToggleRight className="w-6 h-6 text-white" /> : <ToggleLeft className="w-6 h-6 text-white" />}
                      </button>
                    </label>
                    
                    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-xl cursor-pointer">
                      <div>
                        <p className="font-medium text-gray-900">Image Messages</p>
                        <p className="text-sm text-gray-500">Allow sending images in chat</p>
                      </div>
                      <button
                        onClick={() => setAppSettings({ ...appSettings, enableImageMessages: !appSettings.enableImageMessages })}
                        className={`p-1 rounded-full ${appSettings.enableImageMessages ? 'bg-green-500' : 'bg-gray-300'}`}
                      >
                        {appSettings.enableImageMessages ? <ToggleRight className="w-6 h-6 text-white" /> : <ToggleLeft className="w-6 h-6 text-white" />}
                      </button>
                    </label>
                    
                    <label className="flex items-center justify-between p-3 bg-red-50 rounded-xl cursor-pointer">
                      <div>
                        <p className="font-medium text-red-900">Maintenance Mode</p>
                        <p className="text-sm text-red-600">Disable app for all users</p>
                      </div>
                      <button
                        onClick={() => setAppSettings({ ...appSettings, maintenanceMode: !appSettings.maintenanceMode })}
                        className={`p-1 rounded-full ${appSettings.maintenanceMode ? 'bg-red-500' : 'bg-gray-300'}`}
                      >
                        {appSettings.maintenanceMode ? <ToggleRight className="w-6 h-6 text-white" /> : <ToggleLeft className="w-6 h-6 text-white" />}
                      </button>
                    </label>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                  <button
                    onClick={() => saveSettings(appSettings)}
                    disabled={saving}
                    className="px-8 py-3 bg-coral-500 text-white rounded-xl font-medium hover:bg-coral-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    Save Settings
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Edit Tier Modal */}
      {editingTier && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Edit {editingTier.displayName}</h2>
              <button onClick={() => setEditingTier(null)} className="p-2">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
                <input
                  type="text"
                  value={editingTier.displayName}
                  onChange={(e) => setEditingTier({ ...editingTier, displayName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-coral-500 outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  value={editingTier.description || ''}
                  onChange={(e) => setEditingTier({ ...editingTier, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-coral-500 outline-none"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Price (pence)</label>
                  <input
                    type="number"
                    value={editingTier.monthlyPrice}
                    onChange={(e) => setEditingTier({ ...editingTier, monthlyPrice: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-coral-500 outline-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">= £{(editingTier.monthlyPrice / 100).toFixed(2)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Yearly Price (pence)</label>
                  <input
                    type="number"
                    value={editingTier.yearlyPrice}
                    onChange={(e) => setEditingTier({ ...editingTier, yearlyPrice: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-coral-500 outline-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">= £{(editingTier.yearlyPrice / 100).toFixed(2)}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Daily Likes (-1 = unlimited)</label>
                  <input
                    type="number"
                    value={editingTier.dailyLikes}
                    onChange={(e) => setEditingTier({ ...editingTier, dailyLikes: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-coral-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Daily Undos (-1 = unlimited)</label>
                  <input
                    type="number"
                    value={editingTier.dailyUndos}
                    onChange={(e) => setEditingTier({ ...editingTier, dailyUndos: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-coral-500 outline-none"
                  />
                </div>
              </div>
              
              <div className="border-t pt-4 space-y-3">
                <p className="text-sm font-medium text-gray-700">Features</p>
                {[
                  { key: 'seeWhoLikesYou', label: 'See who likes you' },
                  { key: 'advancedFilters', label: 'Advanced filters' },
                  { key: 'readReceipts', label: 'Read receipts' },
                  { key: 'prioritySupport', label: 'Priority support' },
                  { key: 'profileBoost', label: 'Profile boost' },
                  { key: 'noAds', label: 'No ads' },
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingTier[key as keyof SubscriptionTier] as boolean}
                      onChange={(e) => setEditingTier({ ...editingTier, [key]: e.target.checked })}
                      className="w-4 h-4 text-coral-500 rounded focus:ring-coral-500"
                    />
                    <span className="text-gray-700">{label}</span>
                  </label>
                ))}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Badge Icon (emoji)</label>
                  <input
                    type="text"
                    value={editingTier.badgeIcon || ''}
                    onChange={(e) => setEditingTier({ ...editingTier, badgeIcon: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-coral-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Badge Color (hex)</label>
                  <input
                    type="text"
                    value={editingTier.badgeColor || ''}
                    onChange={(e) => setEditingTier({ ...editingTier, badgeColor: e.target.value })}
                    placeholder="#F59E0B"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-coral-500 outline-none"
                  />
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button
                onClick={() => setEditingTier(null)}
                className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => saveTier(editingTier)}
                disabled={saving}
                className="flex-1 py-3 rounded-xl bg-coral-500 text-white font-medium hover:bg-coral-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Prompt Modal */}
      {editingPrompt && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Edit Prompt</h2>
              <button onClick={() => setEditingPrompt(null)} className="p-2">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prompt Text</label>
                <textarea
                  value={editingPrompt.text}
                  onChange={(e) => setEditingPrompt({ ...editingPrompt, text: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-coral-500 outline-none resize-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={editingPrompt.category}
                  onChange={(e) => setEditingPrompt({ ...editingPrompt, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-coral-500 outline-none"
                >
                  <option value="fun">Fun</option>
                  <option value="values">Values</option>
                  <option value="lifestyle">Lifestyle</option>
                  <option value="relationship">Relationship</option>
                </select>
              </div>
              
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingPrompt.isActive}
                  onChange={(e) => setEditingPrompt({ ...editingPrompt, isActive: e.target.checked })}
                  className="w-4 h-4 text-coral-500 rounded focus:ring-coral-500"
                />
                <span className="text-gray-700">Active</span>
              </label>
            </div>
            
            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button
                onClick={() => setEditingPrompt(null)}
                className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => updatePrompt(editingPrompt)}
                disabled={saving}
                className="flex-1 py-3 rounded-xl bg-coral-500 text-white font-medium hover:bg-coral-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Detail Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Review Report</h2>
              <button onClick={() => setSelectedReport(null)} className="p-2">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                  {selectedReport.reported.photos?.[0]?.url ? (
                    <img src={selectedReport.reported.photos[0].url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl">👤</div>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selectedReport.reported.profile?.name || 'Unknown'}
                  </h3>
                  <p className="text-sm text-gray-500">{selectedReport.reported.email}</p>
                  <p className="text-sm text-gray-500">ID: {selectedReport.reported.id}</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <span className="font-semibold text-gray-900">Report reason</span>
                </div>
                <p className="text-gray-700 mb-2">{selectedReport.reason}</p>
                {selectedReport.notes && (
                  <p className="text-gray-600 italic">&quot;{selectedReport.notes}&quot;</p>
                )}
                <p className="text-sm text-gray-500 mt-2">
                  Reported by {selectedReport.reporter.profile?.name || selectedReport.reporter.email}
                  {' • '}
                  {formatDistanceToNow(new Date(selectedReport.createdAt), { addSuffix: true })}
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => handleReportAction(selectedReport.id, 'reviewed')}
                  disabled={processing}
                  className="w-full py-3 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  Dismiss report
                </button>
                <button
                  onClick={() => handleReportAction(selectedReport.id, 'warned', 'warn')}
                  disabled={processing}
                  className="w-full py-3 rounded-xl bg-yellow-100 text-yellow-700 font-medium hover:bg-yellow-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <AlertTriangle className="w-5 h-5" />
                  Warn user
                </button>
                <button
                  onClick={() => handleReportAction(selectedReport.id, 'suspended', 'suspend')}
                  disabled={processing}
                  className="w-full py-3 rounded-xl bg-orange-100 text-orange-700 font-medium hover:bg-orange-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <AlertTriangle className="w-5 h-5" />
                  Suspend (7 days)
                </button>
                <button
                  onClick={() => handleReportAction(selectedReport.id, 'banned', 'ban')}
                  disabled={processing}
                  className="w-full py-3 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {processing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Ban className="w-5 h-5" />}
                  Ban user
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Management Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Manage User</h2>
              <button onClick={() => setSelectedUser(null)} className="p-2">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100">
                  {selectedUser.profile?.photo ? (
                    <img src={selectedUser.profile.photo} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">👤</div>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selectedUser.profile?.name || 'No profile'}
                  </h3>
                  <p className="text-sm text-gray-500">{selectedUser.email}</p>
                  <div className="flex gap-2 mt-1">
                    {selectedUser.isAdmin && (
                      <span className="px-2 py-0.5 bg-purple-100 text-purple-600 text-xs font-medium rounded-full">
                        Admin
                      </span>
                    )}
                    {selectedUser.isBanned ? (
                      <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs font-medium rounded-full">
                        Banned
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-green-100 text-green-600 text-xs font-medium rounded-full">
                        Active
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {selectedUser.isBanned ? (
                  <button
                    onClick={() => handleUserAction(selectedUser.id, 'unban')}
                    disabled={processing}
                    className="w-full py-3 rounded-xl bg-green-100 text-green-700 font-medium hover:bg-green-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Check className="w-5 h-5" />
                    Unban User
                  </button>
                ) : (
                  <button
                    onClick={() => handleUserAction(selectedUser.id, 'ban')}
                    disabled={processing}
                    className="w-full py-3 rounded-xl bg-red-100 text-red-700 font-medium hover:bg-red-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Ban className="w-5 h-5" />
                    Ban User
                  </button>
                )}

                {selectedUser.isAdmin ? (
                  <button
                    onClick={() => handleUserAction(selectedUser.id, 'removeAdmin')}
                    disabled={processing}
                    className="w-full py-3 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <ShieldOff className="w-5 h-5" />
                    Remove Admin
                  </button>
                ) : (
                  <button
                    onClick={() => handleUserAction(selectedUser.id, 'makeAdmin')}
                    disabled={processing}
                    className="w-full py-3 rounded-xl bg-purple-100 text-purple-700 font-medium hover:bg-purple-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Shield className="w-5 h-5" />
                    Make Admin
                  </button>
                )}

                <button
                  onClick={() => handleDeleteUser(selectedUser.id)}
                  disabled={processing}
                  className="w-full py-3 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {processing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                  Delete User Permanently
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
