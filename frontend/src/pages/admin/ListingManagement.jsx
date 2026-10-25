import React, { useState, useEffect } from 'react';
import {
  Building, CheckCircle, XCircle, Search, Eye, Tag, MapPin, DollarSign,
  AlertCircle, X
} from 'lucide-react';
import Modal from '../../components/common/Modal';
import api from '../../api/axios';

const ListingManagement = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Preview Modal
  const [previewProperty, setPreviewProperty] = useState(null);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);

  const [feedback, setFeedback] = useState({ type: '', text: '' });

  const fetchProperties = async () => {
    try {
      const res = await api.get('/properties/admin');
      setProperties(res.data);
    } catch (err) {
      console.error('Failed to load listings', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleUpdateStatus = async (id, newStatus, title) => {
    try {
      await api.patch(`/properties/admin/${id}/status`, { status: newStatus });
      setFeedback({
        type: 'success',
        text: `Listing "${title}" set to ${newStatus}.`,
      });
      fetchProperties();
      if (previewProperty && previewProperty.id === id) {
        setPreviewProperty({ ...previewProperty, status: newStatus });
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        text: err.response?.data?.message || 'Failed to update status.',
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

  const filtered = properties.filter((p) => {
    const matchesQuery = p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         p.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         p.managerName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || p.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Property Listing Moderation
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Review, approve, or reject listings submitted by property managers.
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

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by listing title, address, or manager..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-brand-500"
        >
          <option value="">All Statuses ({properties.length})</option>
          <option value="PENDING">Pending Review</option>
          <option value="APPROVED">Approved Active</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-6">Property</th>
                <th className="py-3.5 px-6">Manager</th>
                <th className="py-3.5 px-6">Monthly Rent</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">Loading listings...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">No properties found.</td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3.5">
                        <img
                          src={p.imageUrl || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=200&q=80"}
                          alt={p.title}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 line-clamp-1">{p.title}</p>
                          <p className="text-slate-400 text-[11px] truncate">{p.address}, {p.city}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <p className="font-semibold text-slate-800">{p.managerName || 'Manager'}</p>
                      <p className="text-slate-400 text-[11px]">{p.managerEmail}</p>
                    </td>

                    <td className="py-4 px-6 font-extrabold text-slate-900">
                      ${Number(p.rent).toLocaleString()}
                    </td>

                    <td className="py-4 px-6">
                      {getStatusBadge(p.status)}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => {
                            setPreviewProperty(p);
                            setPreviewModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-brand-600 hover:bg-slate-100 transition-colors"
                          title="Preview Listing"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {p.status !== 'APPROVED' && (
                          <button
                            onClick={() => handleUpdateStatus(p.id, 'APPROVED', p.title)}
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-bold transition-colors flex items-center space-x-1"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Approve</span>
                          </button>
                        )}

                        {p.status !== 'REJECTED' && (
                          <button
                            onClick={() => handleUpdateStatus(p.id, 'REJECTED', p.title)}
                            className="px-2.5 py-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-bold transition-colors flex items-center space-x-1"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Preview Modal */}
      <Modal
        isOpen={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
        title={previewProperty?.title || 'Listing Preview'}
        maxWidth="max-w-2xl"
      >
        {previewProperty && (
          <div className="space-y-4 text-xs">
            <div className="h-56 rounded-2xl overflow-hidden bg-slate-100">
              <img
                src={previewProperty.imageUrl || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80"}
                alt={previewProperty.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-base font-extrabold text-slate-900">{previewProperty.title}</p>
                <p className="text-slate-500">{previewProperty.address}, {previewProperty.city}</p>
              </div>
              <div className="text-right">
                <span className="text-lg font-black text-brand-600">
                  ${Number(previewProperty.rent).toLocaleString()}
                </span>
                <span className="text-slate-400 block">/ month</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-slate-600">
              <p className="font-semibold text-slate-800">Description:</p>
              <p className="leading-relaxed">{previewProperty.description}</p>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-slate-700 py-2">
              <div className="bg-slate-50 p-2 rounded-xl font-bold">
                {previewProperty.bedrooms} Bedrooms
              </div>
              <div className="bg-slate-50 p-2 rounded-xl font-bold">
                {previewProperty.bathrooms} Bathrooms
              </div>
              <div className="bg-slate-50 p-2 rounded-xl font-bold">
                {previewProperty.areaSqft} sqft
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
              <div>
                <span className="text-slate-400">Current status: </span>
                {getStatusBadge(previewProperty.status)}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleUpdateStatus(previewProperty.id, 'APPROVED', previewProperty.title)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-sm transition-all"
                >
                  Approve Listing
                </button>
                <button
                  onClick={() => handleUpdateStatus(previewProperty.id, 'REJECTED', previewProperty.title)}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-sm transition-all"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
};

export default ListingManagement;
