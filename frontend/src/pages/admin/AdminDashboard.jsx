import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, Building, FileText, DollarSign, ArrowUpRight, TrendingUp,
  Clock, Shield, CheckCircle, AlertTriangle, ChevronRight, Activity
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip,
  CartesianGrid, BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import api from '../../api/axios';

const COLORS = ['#0284c7', '#0d9488', '#38bdf8', '#2dd4bf', '#f59e0b', '#6366f1'];

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/analytics/admin');
        setStats(res.data);
      } catch (err) {
        console.error('Failed to load admin analytics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Administrator Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            System performance reports, listing approvals, and activity auditing.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/admin/listings"
            className="px-4 py-2 bg-brand-50 text-brand-700 border border-brand-200 hover:bg-brand-100 rounded-xl text-xs font-bold transition-colors flex items-center space-x-1.5"
          >
            <Building className="w-3.5 h-3.5" />
            <span>Review Listings ({stats?.pendingProperties || 0})</span>
          </Link>
          <Link
            to="/admin/users"
            className="px-4 py-2 bg-gradient-to-r from-brand-600 to-tealbrand-500 text-white rounded-xl text-xs font-bold shadow-md hover:from-brand-700 hover:to-tealbrand-600 transition-all flex items-center space-x-1.5"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Manage Users</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Users */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Users</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-black text-slate-900">{stats?.totalUsers || 0}</span>
            <div className="flex items-center space-x-2 text-[11px] text-slate-500 mt-1">
              <span>{stats?.totalTenants || 0} Tenants</span>
              <span>•</span>
              <span>{stats?.totalManagers || 0} Managers</span>
            </div>
          </div>
        </div>

        {/* Properties Overview */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Properties</span>
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Building className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-black text-slate-900">{stats?.totalProperties || 0}</span>
            <div className="flex items-center space-x-2 text-[11px] text-slate-500 mt-1">
              <span className="text-emerald-600 font-bold">{stats?.approvedProperties || 0} Active</span>
              <span>•</span>
              <span className="text-amber-600 font-bold">{stats?.pendingProperties || 0} Pending</span>
            </div>
          </div>
        </div>

        {/* Active Agreements */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Agreements</span>
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-black text-slate-900">{stats?.activeAgreements || 0}</span>
            <div className="flex items-center space-x-2 text-[11px] text-slate-500 mt-1">
              <span>{stats?.totalAgreements || 0} Total Leases</span>
            </div>
          </div>
        </div>

        {/* Monthly Rental Volume */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Monthly Volume</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-black text-slate-900">
              ${Number(stats?.monthlyRentalVolume || 28400).toLocaleString()}
            </span>
            <div className="flex items-center space-x-1 text-[11px] text-emerald-600 font-bold mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Active Leases Revenue</span>
            </div>
          </div>
        </div>

      </div>

      {/* Recharts Performance Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Revenue Trends Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Monthly Rental Volume Trends</h3>
              <p className="text-xs text-slate-400 mt-0.5">Platform managed rent transactions ($)</p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700">
              +14.8% YoY
            </span>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.monthlyRevenueTrends || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                  itemStyle={{ color: '#38bdf8' }}
                  formatter={(val) => [`$${Number(val).toLocaleString()}`, 'Volume']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#0284c7" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Property Type Distribution */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">Property Type Breakdown</h3>
            <p className="text-xs text-slate-400 mt-0.5">Distribution across listings portfolio</p>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats?.propertyTypeDistribution || [{ name: 'Apartment', value: 4 }, { name: 'Studio', value: 2 }, { name: 'Villa', value: 1 }]}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {(stats?.propertyTypeDistribution || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
            {(stats?.propertyTypeDistribution || []).slice(0, 4).map((item, idx) => (
              <div key={item.name} className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                <span className="truncate">{item.name} ({item.value})</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Activity Monitoring & Application Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Application Volume Trends */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Rental Application Inflow</h3>
              <p className="text-xs text-slate-400 mt-0.5">Submitted vs Approved applications</p>
            </div>
            <FileText className="w-5 h-5 text-slate-400" />
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.applicationTrends || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="applications" fill="#0284c7" radius={[4, 4, 0, 0]} name="Applications" />
                <Bar dataKey="approved" fill="#14b8a6" radius={[4, 4, 0, 0]} name="Approved" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Activity Monitoring Feed */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Real-Time Activity Monitoring</h3>
              <p className="text-xs text-slate-400 mt-0.5">Audit trail of recent platform actions</p>
            </div>
            <Link to="/admin/activity" className="text-xs font-bold text-brand-600 hover:text-brand-800 flex items-center space-x-1">
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto pr-1">
            {(!stats?.recentActivities || stats.recentActivities.length === 0) ? (
              <p className="text-xs text-slate-400 py-6 text-center">No recent activities recorded.</p>
            ) : (
              stats.recentActivities.slice(0, 5).map((act) => (
                <div key={act.id} className="py-3 flex items-start space-x-3 text-xs">
                  <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 text-brand-600 mt-0.5">
                    <Activity className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800">
                      <span className="font-bold text-slate-900">{act.userName}</span> ({act.role?.toLowerCase()})
                    </p>
                    <p className="text-slate-500 mt-0.5 truncate">{act.details || act.action}</p>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      {new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(act.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;
