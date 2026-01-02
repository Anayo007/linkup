'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Heart, Flag, AlertTriangle, Check, X, Ban, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Stats {
  totalUsers: number;
  newUsersToday: number;
  totalMatches: number;
  matchesToday: number;
  openReports: number;
  reportsToday: number;
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

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

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
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
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

        {/* Reports Queue */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Reports Queue</h2>
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
                        <img
                          src={report.reported.photos[0].url}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-xl">👤</span>
                        </div>
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
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden mt-6">
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
      </div>

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
              {/* Reported User */}
              <div className="flex items-start gap-4 mb-6">
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                  {selectedReport.reported.photos?.[0]?.url ? (
                    <img
                      src={selectedReport.reported.photos[0].url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-3xl">👤</span>
                    </div>
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

              {/* Report Details */}
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

              {/* Actions */}
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
                  {processing ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Ban className="w-5 h-5" />
                  )}
                  Ban user
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
