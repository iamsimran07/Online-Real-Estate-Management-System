import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2, Users, FileText, DollarSign, PlusCircle, ArrowUpRight,
  CheckCircle2, Clock, MessageSquare, BarChart3, ChevronRight
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';
import api from '../../api/axios';

const ManagerDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/analytics/manager');
        setAnalytics(res.data);
      } catch (err) {
        console.error('Failed to load manager analytics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-tealbrand-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Property Manager Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your real estate portfolio, rental agreements, applications, and tenant messages.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/manager/properties"
            className="px-4 py-2 bg-gradient-to-r from-tealbrand-600 to-brand-600 hover:from-tealbrand-700 hover:to-brand-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center space-x-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Listing</span>
          </Link>
          <Link
            to="/manager/messages"
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center space-x-1.5"
          >
            <MessageSquare className="w-4 h-4 text-brand-600" />
            <span>Tenant Messages</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Properties Managed */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">My Listings</span>
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-black text-slate-900">{analytics?.totalProperties || 0}</span>
            <div className="flex items-center space-x-2 text-[11px] text-slate-500 mt-1">
              <span className="text-emerald-600 font-bold">{analytics?.approvedProperties || 0} Live</span>
              <span>•</span>
              <span className="text-amber-600 font-bold">{analytics?.pendingProperties || 0} In Review</span>
            </div>
          </div>
        </div>

        {/* Rental Applications */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Applications</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-black text-slate-900">{analytics?.totalApplications || 0}</span>
            <div className="flex items-center space-x-2 text-[11px] text-slate-500 mt-1">
              <span className="text-amber-600 font-bold">{analytics?.pendingApplications || 0} Pending</span>
              <span>•</span>
              <span className="text-emerald-600 font-bold">{analytics?.approvedApplications || 0} Approved</span>
            </div>
          </div>
        </div>

        {/* Active Agreements */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Leases</span>
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-black text-slate-900">{analytics?.activeAgreements || 0}</span>
            <div className="flex items-center space-x-1 text-[11px] text-slate-500 mt-1">
              <span>{analytics?.totalAgreements || 0} Total Agreements</span>
            </div>
          </div>
        </div>

        {/* Monthly Rental Income */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Rental Revenue</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-black text-slate-900">
              ${Number(analytics?.monthlyRentalVolume || 14200).toLocaleString()}
            </span>
            <div className="text-[11px] text-emerald-600 font-bold mt-1">
              Monthly Active Inflow
            </div>
          </div>
        </div>

      </div>

      {/* Chart & Quick Action Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Performance Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Monthly Revenue & Occupancy Trends</h3>
              <p className="text-xs text-slate-400 mt-0.5">Performance tracking across current active properties</p>
            </div>
            <Link to="/manager/analytics" className="text-xs font-bold text-tealbrand-600 hover:text-tealbrand-800 flex items-center space-x-1">
              <span>Detailed Analytics</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics?.monthlyRevenueTrends || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorMgr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                  itemStyle={{ color: '#2dd4bf' }}
                  formatter={(val) => [`$${Number(val).toLocaleString()}`, 'Estimated Inflow']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#0d9488" strokeWidth={3} fillOpacity={1} fill="url(#colorMgr)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Management Shortcuts */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">Manager Actions</h3>
            <p className="text-xs text-slate-400 mt-0.5">Quick access to essential landlord workflows</p>
          </div>

          <div className="space-y-3">
            <Link
              to="/manager/properties"
              className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 flex items-center justify-between text-xs font-bold text-slate-700 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
                  <Building2 className="w-4 h-4" />
                </div>
                <span>Manage Property Portfolio</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </Link>

            <Link
              to="/manager/applications"
              className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 flex items-center justify-between text-xs font-bold text-slate-700 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <span>Review Rental Applications</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </Link>

            <Link
              to="/manager/agreements"
              className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 flex items-center justify-between text-xs font-bold text-slate-700 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <span>Issue & Update Agreements</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </Link>

            <Link
              to="/manager/messages"
              className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 flex items-center justify-between text-xs font-bold text-slate-700 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <span>Open Tenant Chat Thread</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </Link>
          </div>

          <div className="pt-2 text-[11px] text-slate-400 text-center">
            EstateSphere Property Manager Platform
          </div>
        </div>

      </div>

    </div>
  );
};

export default ManagerDashboard;
