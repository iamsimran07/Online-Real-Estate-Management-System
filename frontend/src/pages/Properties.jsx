import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, Filter, RotateCcw, Building2, SlidersHorizontal, CheckCircle2, AlertCircle } from 'lucide-react';
import PropertyCard from '../components/common/PropertyCard';
import Modal from '../components/common/Modal';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const Properties = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [query, setQuery] = useState(searchParams.get('query') || '');
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [propertyType, setPropertyType] = useState(searchParams.get('propertyType') || '');
  const [minRent, setMinRent] = useState(searchParams.get('minRent') || '');
  const [maxRent, setMaxRent] = useState(searchParams.get('maxRent') || '');
  const [bedrooms, setBedrooms] = useState(searchParams.get('bedrooms') || '');

  // Application Modal state
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [moveInDate, setMoveInDate] = useState('');
  const [employmentInfo, setEmploymentInfo] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const params = {};
      if (query) params.query = query;
      if (city) params.city = city;
      if (propertyType) params.propertyType = propertyType;
      if (minRent) params.minRent = minRent;
      if (maxRent) params.maxRent = maxRent;
      if (bedrooms) params.bedrooms = bedrooms;

      const res = await api.get('/properties/public', { params });
      setProperties(res.data);
    } catch (err) {
      console.error('Error fetching properties', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [city, propertyType, bedrooms]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProperties();
  };

  const handleResetFilters = () => {
    setQuery('');
    setCity('');
    setPropertyType('');
    setMinRent('');
    setMaxRent('');
    setBedrooms('');
    setSearchParams({});
    setTimeout(() => {
      api.get('/properties/public').then((res) => setProperties(res.data));
    }, 50);
  };

  const handleOpenApply = (property) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { message: 'Please sign in as a Tenant to apply for this property' } });
      return;
    }
    if (user?.role !== 'TENANT') {
      alert('Only registered Tenants can submit rental applications. You are logged in as ' + user?.role);
      return;
    }
    setSelectedProperty(property);
    setSubmitSuccess(false);
    setSubmitError('');
    setApplyModalOpen(true);
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');

    try {
      await api.post('/applications/tenant', {
        propertyId: selectedProperty.id,
        moveInDate: moveInDate || null,
        employmentInfo,
        notes,
      });
      setSubmitSuccess(true);
      setTimeout(() => {
        setApplyModalOpen(false);
        setSubmitSuccess(false);
      }, 2000);
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Failed to submit application. You may have already applied.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Browse Rental Properties
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Discover verified apartments, studios, penthouses and family residences available for lease.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm mb-8">
          <form onSubmit={handleSearchSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {/* Keyword Search */}
              <div className="relative md:col-span-2">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search by title, street address..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-500"
                />
              </div>

              {/* City */}
              <div>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-brand-500"
                >
                  <option value="">All Locations</option>
                  <option value="New York">New York</option>
                  <option value="Miami">Miami</option>
                  <option value="San Francisco">San Francisco</option>
                  <option value="Los Angeles">Los Angeles</option>
                  <option value="Chicago">Chicago</option>
                </select>
              </div>

              {/* Property Type */}
              <div>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-brand-500"
                >
                  <option value="">All Types</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Studio">Studio</option>
                  <option value="Penthouse">Penthouse</option>
                  <option value="Villa">Villa</option>
                  <option value="Townhouse">Townhouse</option>
                  <option value="House">House</option>
                </select>
              </div>
            </div>

            {/* Price & Bedroom Row */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-2 border-t border-slate-100">
              <div>
                <label className="text-[11px] font-bold text-slate-500 block mb-1">Min Rent ($)</label>
                <input
                  type="number"
                  placeholder="e.g. 1500"
                  value={minRent}
                  onChange={(e) => setMinRent(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 block mb-1">Max Rent ($)</label>
                <input
                  type="number"
                  placeholder="e.g. 6000"
                  value={maxRent}
                  onChange={(e) => setMaxRent(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 block mb-1">Min Bedrooms</label>
                <select
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-brand-500"
                >
                  <option value="">Any Beds</option>
                  <option value="1">1+ Bedroom</option>
                  <option value="2">2+ Bedrooms</option>
                  <option value="3">3+ Bedrooms</option>
                  <option value="4">4+ Bedrooms</option>
                </select>
              </div>

              <div className="col-span-2 flex items-end space-x-2">
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 transition-colors shadow-sm"
                >
                  Apply Filters
                </button>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="py-2 px-3 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center space-x-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Results Info */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Showing {properties.length} Available {properties.length === 1 ? 'Property' : 'Properties'}
          </p>
        </div>

        {/* Property Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-96 rounded-2xl bg-slate-200 animate-pulse"></div>
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 max-w-xl mx-auto my-12">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900">No properties matched your filters</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Try adjusting your price range, location, or clear keyword search filters to see more listings.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-6 py-2 px-5 rounded-xl text-xs font-bold text-brand-600 bg-brand-50 hover:bg-brand-100 transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((prop) => (
              <PropertyCard
                key={prop.id}
                property={prop}
                onApplyClick={handleOpenApply}
              />
            ))}
          </div>
        )}
      </div>

      {/* Rental Application Modal */}
      <Modal
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        title={selectedProperty ? `Rental Application: ${selectedProperty.title}` : 'Rental Application'}
      >
        {submitSuccess ? (
          <div className="text-center py-6 space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900">Application Submitted!</h4>
            <p className="text-xs text-slate-600 max-w-xs mx-auto">
              Your rental application has been routed directly to the property manager for verification.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmitApplication} className="space-y-4">
            {submitError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{submitError}</span>
              </div>
            )}

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Monthly Rent</span>
                <span className="font-extrabold text-slate-900 text-sm">
                  ${selectedProperty?.rent ? Number(selectedProperty.rent).toLocaleString() : '0'}/mo
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Property Location</span>
                <span className="font-bold text-slate-800">{selectedProperty?.city || 'New York'}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Intended Move-In Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={moveInDate}
                onChange={(e) => setMoveInDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Current Employment & Annual Income <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Senior Software Engineer at Tech Corp ($140,000/yr)"
                value={employmentInfo}
                onChange={(e) => setEmploymentInfo(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Personal Note to Property Manager
              </label>
              <textarea
                rows={3}
                placeholder="Share relevant details, number of occupants, lease duration preference, pets..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-brand-500 resize-none"
              />
            </div>

            <div className="pt-2 flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setApplyModalOpen(false)}
                className="py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="py-2.5 px-5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-brand-600 to-tealbrand-500 hover:from-brand-700 hover:to-tealbrand-600 shadow-md transition-all disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default Properties;
