import React, { useState, useEffect } from 'react';
import {
  Building2, PlusCircle, Edit2, Trash2, Tag, MapPin, DollarSign,
  CheckCircle2, AlertCircle, X, Bed, Bath, Maximize2
} from 'lucide-react';
import Modal from '../../components/common/Modal';
import api from '../../api/axios';

const ManagerProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add / Edit Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    address: '',
    city: 'New York',
    description: '',
    rent: '',
    bedrooms: 2,
    bathrooms: 2,
    areaSqft: 1100,
    propertyType: 'Apartment',
    imageUrl: '',
  });

  const [feedback, setFeedback] = useState({ type: '', text: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchProperties = async () => {
    try {
      const res = await api.get('/properties/manager');
      setProperties(res.data);
    } catch (err) {
      console.error('Failed to load manager listings', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleOpenAdd = () => {
    setIsEditing(false);
    setFormData({
      title: '',
      address: '',
      city: 'New York',
      description: '',
      rent: '',
      bedrooms: 2,
      bathrooms: 2,
      areaSqft: 1100,
      propertyType: 'Apartment',
      imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (prop) => {
    setIsEditing(true);
    setFormData({
      id: prop.id,
      title: prop.title,
      address: prop.address,
      city: prop.city || 'New York',
      description: prop.description,
      rent: prop.rent,
      bedrooms: prop.bedrooms || 2,
      bathrooms: prop.bathrooms || 2,
      areaSqft: prop.areaSqft || 1000,
      propertyType: prop.propertyType || 'Apartment',
      imageUrl: prop.imageUrl || '',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback({ type: '', text: '' });

    try {
      if (isEditing) {
        await api.put(`/properties/manager/${formData.id}`, formData);
        setFeedback({ type: 'success', text: 'Property updated successfully!' });
      } else {
        await api.post('/properties/manager', formData);
        setFeedback({ type: 'success', text: 'Property submitted for admin review!' });
      }
      setModalOpen(false);
      fetchProperties();
    } catch (err) {
      setFeedback({ type: 'error', text: err.response?.data?.message || 'Failed to save property.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete listing "${title}"?`)) return;
    try {
      await api.delete(`/properties/manager/${id}`);
      setFeedback({ type: 'success', text: `Deleted listing: ${title}` });
      fetchProperties();
    } catch (err) {
      setFeedback({ type: 'error', text: err.response?.data?.message || 'Cannot delete property.' });
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPROVED':
        return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-2.5 py-1 rounded-lg">Active (Approved)</span>;
      case 'PENDING':
        return <span className="bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold px-2.5 py-1 rounded-lg">Pending Review</span>;
      case 'REJECTED':
        return <span className="bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold px-2.5 py-1 rounded-lg">Rejected</span>;
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
            My Managed Properties
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Create, update, and monitor status of your real estate listings.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-tealbrand-600 to-brand-600 hover:from-tealbrand-700 hover:to-brand-700 text-white rounded-xl text-xs font-bold shadow-md transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Property</span>
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

      {/* Properties Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-6">Property Details</th>
                <th className="py-3.5 px-6">Type & Specs</th>
                <th className="py-3.5 px-6">Monthly Rent</th>
                <th className="py-3.5 px-6">Review Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">Loading your listings...</td>
                </tr>
              ) : properties.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    No properties listed yet. Click "Add New Property" to publish your first listing!
                  </td>
                </tr>
              ) : (
                properties.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3.5">
                        <img
                          src={p.imageUrl || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=200&q=80"}
                          alt={p.title}
                          className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 text-sm line-clamp-1">{p.title}</p>
                          <p className="text-slate-400 text-xs mt-0.5 truncate">{p.address}, {p.city}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <span className="font-semibold text-slate-800 block">{p.propertyType || 'Apartment'}</span>
                      <span className="text-slate-400 text-[11px]">
                        {p.bedrooms} Beds • {p.bathrooms} Baths • {p.areaSqft} sqft
                      </span>
                    </td>

                    <td className="py-4 px-6 font-extrabold text-slate-900 text-sm">
                      ${Number(p.rent).toLocaleString()}
                      <span className="text-slate-400 font-normal text-[11px] block">/ month</span>
                    </td>

                    <td className="py-4 px-6">
                      {getStatusBadge(p.status)}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-2 rounded-xl text-slate-500 hover:text-tealbrand-600 hover:bg-slate-100 transition-colors"
                          title="Edit Property"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id, p.title)}
                          className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete Property"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={isEditing ? 'Edit Property Listing' : 'Add New Property Listing'}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Property Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Modern Sunset Blvd Luxury Apartment"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Street Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 120 E 34th Street"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
              <select
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-brand-500"
              >
                <option value="New York">New York</option>
                <option value="Miami">Miami</option>
                <option value="San Francisco">San Francisco</option>
                <option value="Los Angeles">Los Angeles</option>
                <option value="Chicago">Chicago</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Monthly Rent ($) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                required
                min="100"
                placeholder="e.g. 2800"
                value={formData.rent}
                onChange={(e) => setFormData({ ...formData, rent: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Property Type</label>
              <select
                value={formData.propertyType}
                onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-brand-500"
              >
                <option value="Apartment">Apartment</option>
                <option value="Studio">Studio</option>
                <option value="Penthouse">Penthouse</option>
                <option value="Villa">Villa</option>
                <option value="Townhouse">Townhouse</option>
                <option value="House">House</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Bedrooms</label>
              <input
                type="number"
                min="1"
                value={formData.bedrooms}
                onChange={(e) => setFormData({ ...formData, bedrooms: parseInt(e.target.value) || 1 })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Bathrooms</label>
              <input
                type="number"
                min="1"
                value={formData.bathrooms}
                onChange={(e) => setFormData({ ...formData, bathrooms: parseInt(e.target.value) || 1 })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Cover Image URL</label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
              <textarea
                rows={3}
                required
                placeholder="Highlight floor plan, natural lighting, finishes, building amenities..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-brand-500 resize-none"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="py-2.5 px-5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-tealbrand-600 to-brand-600 hover:from-tealbrand-700 hover:to-brand-700 shadow-md transition-all disabled:opacity-50"
            >
              {submitting ? 'Saving...' : isEditing ? 'Update Property' : 'Submit Property'}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default ManagerProperties;
