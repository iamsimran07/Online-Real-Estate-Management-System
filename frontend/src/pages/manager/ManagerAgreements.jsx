import React, { useState, useEffect } from 'react';
import {
  FileText, PlusCircle, CheckCircle2, AlertCircle, X, Calendar,
  DollarSign, Shield, Download, Clock
} from 'lucide-react';
import Modal from '../../components/common/Modal';
import api from '../../api/axios';

const ManagerAgreements = () => {
  const [agreements, setAgreements] = useState([]);
  const [properties, setProperties] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Create Agreement Modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    propertyId: '',
    tenantId: '',
    startDate: '',
    endDate: '',
    monthlyRent: '',
    depositAmount: '',
    terms: 'Standard residential lease agreement. Rent due on the 1st of every calendar month. Utilities and high-speed internet included.',
    status: 'ACTIVE',
  });

  const [feedback, setFeedback] = useState({ type: '', text: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      const [agrRes, propRes] = await Promise.all([
        api.get('/agreements/manager'),
        api.get('/properties/manager'),
      ]);
      setAgreements(agrRes.data);
      setProperties(propRes.data);
    } catch (err) {
      console.error('Failed to load agreements', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenCreate = () => {
    setFormData({
      propertyId: properties[0]?.id || '',
      tenantId: '3', // Default to David Miller or first tenant
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      monthlyRent: properties[0]?.rent || 2500,
      depositAmount: properties[0]?.rent || 2500,
      terms: 'Standard residential lease agreement. Rent due on the 1st of every calendar month. Utilities and high-speed internet included.',
      status: 'ACTIVE',
    });
    setCreateModalOpen(true);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback({ type: '', text: '' });

    try {
      await api.post('/agreements/manager', formData);
      setFeedback({ type: 'success', text: 'Rental agreement created and activated!' });
      setCreateModalOpen(false);
      fetchData();
    } catch (err) {
      setFeedback({ type: 'error', text: err.response?.data?.message || 'Failed to create agreement.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await api.patch(`/agreements/${id}/status`, { status: newStatus });
      setFeedback({ type: 'success', text: `Agreement #${id} updated to ${newStatus}.` });
      fetchData();
    } catch (err) {
      setFeedback({ type: 'error', text: err.response?.data?.message || 'Failed to update agreement status.' });
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ACTIVE':
        return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-2.5 py-1 rounded-lg">Active Lease</span>;
      case 'PENDING':
        return <span className="bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold px-2.5 py-1 rounded-lg">Pending Signatures</span>;
      case 'COMPLETED':
        return <span className="bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold px-2.5 py-1 rounded-lg">Completed</span>;
      case 'TERMINATED':
        return <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2.5 py-1 rounded-lg">Terminated</span>;
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Rental Agreements
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage legal lease contracts, payment terms, and agreement lifecycles.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-tealbrand-600 to-brand-600 hover:from-tealbrand-700 hover:to-brand-700 text-white rounded-xl text-xs font-bold shadow-md transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Draft New Agreement</span>
        </button>
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

      {/* Agreements Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-2 py-12 text-center text-slate-400">Loading agreements...</div>
        ) : agreements.length === 0 ? (
          <div className="col-span-2 bg-white rounded-3xl p-12 text-center border border-slate-200/80">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No agreements generated yet</h3>
            <p className="text-xs text-slate-500 mt-1">
              Click "Draft New Agreement" to issue a lease to an approved tenant.
            </p>
          </div>
        ) : (
          agreements.map((agr) => (
            <div
              key={agr.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-5"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-black text-slate-900">Lease Agreement #{agr.id}</span>
                  </div>
                  {getStatusBadge(agr.status)}
                </div>

                <div className="mt-4 space-y-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Property</span>
                    <h4 className="font-extrabold text-slate-900 text-sm">{agr.propertyTitle}</h4>
                    <p className="text-slate-400 text-xs truncate">{agr.propertyAddress}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Tenant</span>
                      <span className="font-bold text-slate-900">{agr.tenantName}</span>
                      <span className="text-slate-500 text-[10px] block truncate">{agr.tenantEmail}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Monthly Rent</span>
                      <span className="font-extrabold text-tealbrand-600 text-sm">
                        ${Number(agr.monthlyRent || 0).toLocaleString()}
                      </span>
                      <span className="text-slate-400 text-[10px] block">
                        Deposit: ${Number(agr.depositAmount || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-600 bg-slate-50/50 p-2.5 rounded-xl">
                    <div className="flex items-center space-x-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{agr.startDate} to {agr.endDate}</span>
                    </div>
                  </div>

                  {agr.terms && (
                    <div className="text-[11px] text-slate-500 bg-slate-50/40 p-2.5 rounded-xl line-clamp-2">
                      <span className="font-semibold text-slate-700">Terms: </span>
                      {agr.terms}
                    </div>
                  )}
                </div>
              </div>

              {/* Status Update Controls */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400">Update Status:</span>
                <div className="flex space-x-1.5">
                  {agr.status !== 'ACTIVE' && (
                    <button
                      onClick={() => handleUpdateStatus(agr.id, 'ACTIVE')}
                      className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-bold transition-colors"
                    >
                      Activate
                    </button>
                  )}
                  {agr.status !== 'COMPLETED' && (
                    <button
                      onClick={() => handleUpdateStatus(agr.id, 'COMPLETED')}
                      className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold transition-colors"
                    >
                      Mark Completed
                    </button>
                  )}
                  {agr.status !== 'TERMINATED' && (
                    <button
                      onClick={() => handleUpdateStatus(agr.id, 'TERMINATED')}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 text-xs font-bold transition-colors"
                    >
                      Terminate
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Agreement Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Draft New Rental Agreement"
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Select Property</label>
            <select
              value={formData.propertyId}
              onChange={(e) => setFormData({ ...formData, propertyId: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-brand-500"
            >
              {properties.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} (${Number(p.rent).toLocaleString()}/mo)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Tenant User ID</label>
            <input
              type="number"
              required
              placeholder="e.g. 3 (David Miller)"
              value={formData.tenantId}
              onChange={(e) => setFormData({ ...formData, tenantId: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Lease Start Date</label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Lease End Date</label>
              <input
                type="date"
                required
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Monthly Rent ($)</label>
              <input
                type="number"
                required
                value={formData.monthlyRent}
                onChange={(e) => setFormData({ ...formData, monthlyRent: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Security Deposit ($)</label>
              <input
                type="number"
                required
                value={formData.depositAmount}
                onChange={(e) => setFormData({ ...formData, depositAmount: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Agreement Terms & Conditions</label>
            <textarea
              rows={3}
              value={formData.terms}
              onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-brand-500 resize-none"
            />
          </div>

          <div className="pt-2 flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setCreateModalOpen(false)}
              className="py-2.5 px-4 rounded-xl font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="py-2.5 px-5 rounded-xl font-bold text-white bg-gradient-to-r from-tealbrand-600 to-brand-600 hover:from-tealbrand-700 hover:to-brand-700 shadow-md transition-all disabled:opacity-50"
            >
              {submitting ? 'Creating...' : 'Activate Agreement'}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default ManagerAgreements;
