import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, FileText, FolderCheck, Bell, User, Building, ArrowRight,
  CheckCircle2, Clock, Calendar, DollarSign
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

const TenantDashboard = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [agreements, setAgreements] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTenantData = async () => {
      try {
        const [appRes, agrRes, notifRes] = await Promise.all([
          api.get('/applications/tenant'),
          api.get('/agreements/tenant'),
          api.get('/notifications'),
        ]);
        setApplications(appRes.data);
        setAgreements(agrRes.data);
        setNotifications(notifRes.data.notifications || []);
      } catch (err) {
        console.error('Failed to load tenant dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTenantData();
  }, []);

  const activeAgreement = agreements.find((a) => a.status === 'ACTIVE') || agreements[0];

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 block mb-1">
            Tenant Hub
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome back, {user?.name || 'Tenant'}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track your rental applications, manage lease agreements, and discover new homes.
          </p>
        </div>

        <Link
          to="/properties"
          className="inline-flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-brand-600 to-tealbrand-500 hover:from-brand-700 hover:to-tealbrand-600 text-white rounded-xl text-xs font-bold shadow-md transition-all self-start sm:self-auto"
        >
          <Search className="w-4 h-4" />
          <span>Browse Available Properties</span>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        
        {/* Active Applications */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Submitted Applications</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <FolderCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-black text-slate-900">{applications.length}</span>
            <div className="text-[11px] text-slate-500 mt-1">
              {applications.filter((a) => a.status === 'APPROVED').length} Approved • {applications.filter((a) => a.status === 'PENDING').length} In Review
            </div>
          </div>
        </div>

        {/* Active Agreements */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Lease Agreements</span>
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-black text-slate-900">{agreements.length}</span>
            <div className="text-[11px] text-slate-500 mt-1">
              {agreements.filter((a) => a.status === 'ACTIVE').length} Active lease on file
            </div>
          </div>
        </div>

        {/* Notifications Alert */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Notifications</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-black text-slate-900">{notifications.length}</span>
            <div className="text-[11px] text-slate-500 mt-1">
              Alerts & landlord updates
            </div>
          </div>
        </div>

      </div>

      {/* Active Lease Spotlight */}
      {activeAgreement && (
        <div className="bg-gradient-to-r from-brand-900 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Current Active Lease</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                {activeAgreement.propertyTitle}
              </h3>
              <p className="text-xs text-slate-300">{activeAgreement.propertyAddress}</p>
              
              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-300">
                <div className="flex items-center space-x-1">
                  <DollarSign className="w-4 h-4 text-brand-400" />
                  <span className="font-bold text-white">${Number(activeAgreement.monthlyRent || 0).toLocaleString()}</span>
                  <span>/mo</span>
                </div>
                <span>•</span>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4 text-brand-400" />
                  <span>Lease ends {activeAgreement.endDate}</span>
                </div>
              </div>
            </div>

            <Link
              to="/tenant/agreements"
              className="py-3 px-5 rounded-xl bg-white text-slate-900 hover:bg-slate-100 text-xs font-extrabold transition-all shadow-md shrink-0 self-start md:self-center"
            >
              View Lease Agreement
            </Link>
          </div>
        </div>
      )}

      {/* Grid: Recent Applications & Recent Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Applications Tracker */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">My Rental Applications</h3>
              <p className="text-xs text-slate-400 mt-0.5">Status of your submitted housing applications</p>
            </div>
            <Link to="/tenant/applications" className="text-xs font-bold text-brand-600 hover:text-brand-800 flex items-center space-x-1">
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {loading ? (
              <p className="text-xs text-slate-400 py-6 text-center">Loading applications...</p>
            ) : applications.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No applications submitted yet.</p>
            ) : (
              applications.slice(0, 3).map((app) => (
                <div key={app.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-slate-900 text-xs line-clamp-1">{app.propertyTitle}</h5>
                    <span className="text-[11px] text-slate-500 block mt-0.5">${Number(app.propertyRent).toLocaleString()}/mo</span>
                  </div>
                  <span
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-lg ${
                      app.status === 'APPROVED'
                        ? 'bg-emerald-50 text-emerald-700'
                        : app.status === 'PENDING'
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-rose-50 text-rose-700'
                    }`}
                  >
                    {app.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Notifications Panel */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Notifications & Alerts</h3>
              <p className="text-xs text-slate-400 mt-0.5">Updates on applications and signed contracts</p>
            </div>
            <Bell className="w-4 h-4 text-slate-400" />
          </div>

          <div className="space-y-3">
            {notifications.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No notifications.</p>
            ) : (
              notifications.slice(0, 3).map((notif) => (
                <div key={notif.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <p className="font-bold text-xs text-slate-800">{notif.title}</p>
                  <p className="text-xs text-slate-600 line-clamp-2">{notif.message}</p>
                  <span className="text-[10px] text-slate-400 block pt-1">
                    {new Date(notif.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

export default TenantDashboard;
