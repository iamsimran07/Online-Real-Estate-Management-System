import React, { useState, useEffect } from 'react';
import {
  Users, CheckCircle2, XCircle, Clock, Calendar, DollarSign,
  FileText, MessageSquare, AlertCircle, X, ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const ManagerApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [feedback, setFeedback] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  const fetchApplications = async () => {
    try {
      const res = await api.get('/applications/manager');
      setApplications(res.data);
    } catch (err) {
      console.error('Failed to load applications', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleUpdateStatus = async (appId, newStatus) => {
    try {
      await api.patch(`/applications/manager/${appId}/status`, { status: newStatus });
      setFeedback({
        type: 'success',
        text: `Application #${appId} set to ${newStatus}.`,
      });
      fetchApplications();
    } catch (err) {
      setFeedback({
        type: 'error',
        text: err.response?.data?.message || 'Failed to update application status.',
      });
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPROVED':
        return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-2.5 py-1 rounded-lg">Approved</span>;
      case 'PENDING':
        return <span className="bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold px-2.5 py-1 rounded-lg">Pending Review</span>;
      case 'REJECTED':
        return <span className="bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold px-2.5 py-1 rounded-lg">Rejected</span>;
      default:
        return <span>{status}</span>;
    }
  };

  const filtered = statusFilter
    ? applications.filter((a) => a.status === statusFilter)
    : applications;

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Rental Applications Overview
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Review tenant applications, financial qualifications, and issue approval decisions.
        </p>
      </div>

      {feedback.text && (
        <div
          className={`p-3.5 rounded-2xl text-xs font-semibold flex items-center justify-between ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <span>{feedback.text}</span>
          <button onClick={() => setFeedback({ type: '', text: '' })}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <button
          onClick={() => setStatusFilter('')}
          className={`px-3.5 py-1.5 rounded-xl font-bold transition-colors ${
            !statusFilter ? 'bg-tealbrand-600 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          All Applications ({applications.length})
        </button>
        <button
          onClick={() => setStatusFilter('PENDING')}
          className={`px-3.5 py-1.5 rounded-xl font-bold transition-colors ${
            statusFilter === 'PENDING' ? 'bg-tealbrand-600 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Pending Review
        </button>
        <button
          onClick={() => setStatusFilter('APPROVED')}
          className={`px-3.5 py-1.5 rounded-xl font-bold transition-colors ${
            statusFilter === 'APPROVED' ? 'bg-tealbrand-600 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Approved
        </button>
        <button
          onClick={() => setStatusFilter('REJECTED')}
          className={`px-3.5 py-1.5 rounded-xl font-bold transition-colors ${
            statusFilter === 'REJECTED' ? 'bg-tealbrand-600 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Rejected
        </button>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-12 text-center text-slate-400">Loading applications...</div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No applications found</h3>
            <p className="text-xs text-slate-500 mt-1">Tenant rental applications will appear here when submitted.</p>
          </div>
        ) : (
          filtered.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:border-tealbrand-300 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6"
            >
              {/* Applicant & Property Info */}
              <div className="flex-1 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-slate-400">Application #{app.id}</span>
                  {getStatusBadge(app.status)}
                  <span className="text-slate-300">•</span>
                  <span className="text-xs text-slate-400">
                    Submitted {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'recently'}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-sm shrink-0">
                      {app.tenantName ? app.tenantName.charAt(0) : 'T'}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{app.tenantName}</h4>
                      <p className="text-xs text-slate-500">{app.tenantEmail} • {app.tenantPhone || 'No phone'}</p>
                    </div>
                  </div>

                  <div className="sm:border-l sm:border-slate-200 sm:pl-4">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Target Property</span>
                    <p className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-1">{app.propertyTitle}</p>
                    <span className="text-xs text-tealbrand-600 font-extrabold">
                      ${Number(app.propertyRent || 0).toLocaleString()} / month
                    </span>
                  </div>
                </div>

                {/* Qualification details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-slate-400 font-medium block text-[11px]">Employment & Income</span>
                    <span className="font-bold text-slate-800">{app.employmentInfo || 'Not specified'}</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-slate-400 font-medium block text-[11px]">Desired Move-In</span>
                    <span className="font-bold text-slate-800">
                      {app.moveInDate ? new Date(app.moveInDate).toLocaleDateString() : 'Immediate'}
                    </span>
                  </div>
                </div>

                {app.notes && (
                  <p className="text-xs text-slate-600 bg-slate-50/60 p-2.5 rounded-xl italic">
                    "{app.notes}"
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end justify-center gap-2 shrink-0 border-t lg:border-t-0 pt-4 lg:pt-0">
                {app.status === 'PENDING' && (
                  <>
                    <button
                      onClick={() => handleUpdateStatus(app.id, 'APPROVED')}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center justify-center space-x-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(app.id, 'REJECTED')}
                      className="px-4 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject</span>
                    </button>
                  </>
                )}

                {app.status === 'APPROVED' && (
                  <button
                    onClick={() => navigate('/manager/agreements')}
                    className="px-4 py-2 bg-tealbrand-50 text-tealbrand-700 border border-tealbrand-200 hover:bg-tealbrand-100 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Issue Agreement</span>
                  </button>
                )}

                <button
                  onClick={() => navigate('/manager/messages')}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5"
                >
                  <MessageSquare className="w-4 h-4 text-brand-600" />
                  <span>Chat with Tenant</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};

export default ManagerApplications;
