import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Bed, Bath, Maximize2, MapPin, Tag, ShieldCheck, Mail, Phone,
  Calendar, CheckCircle, ArrowLeft, MessageSquare, AlertCircle
} from 'lucide-react';
import Modal from '../components/common/Modal';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const PropertyDetail = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  // Application Modal state
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [moveInDate, setMoveInDate] = useState('');
  const [employmentInfo, setEmploymentInfo] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Contact Manager Message modal
  const [msgModalOpen, setMsgModalOpen] = useState(false);
  const [messageContent, setMessageContent] = useState('');
  const [msgSending, setMsgSending] = useState(false);
  const [msgSuccess, setMsgSuccess] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await api.get(`/properties/public/${id}`);
        setProperty(res.data);
      } catch (err) {
        console.error('Failed to fetch property details', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  const handleOpenApply = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { message: 'Please sign in as a Tenant to apply' } });
      return;
    }
    if (user?.role !== 'TENANT') {
      alert('Only registered Tenants can submit rental applications.');
      return;
    }
    setSubmitSuccess(false);
    setSubmitError('');
    setApplyModalOpen(true);
  };

  const handleOpenMessage = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { message: 'Please sign in to contact the manager' } });
      return;
    }
    setMsgSuccess(false);
    setMsgModalOpen(true);
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');

    try {
      await api.post('/applications/tenant', {
        propertyId: property.id,
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
      setSubmitError(err.response?.data?.message || 'Failed to submit application.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!property?.managerId) return;
    setMsgSending(true);

    try {
      await api.post('/messages', {
        receiverId: property.managerId,
        propertyId: property.id,
        content: messageContent,
      });
      setMsgSuccess(true);
      setTimeout(() => {
        setMsgModalOpen(false);
        setMsgSuccess(false);
        setMessageContent('');
        if (user?.role === 'PROPERTY_MANAGER') {
          navigate('/manager/messages');
        } else if (user?.role === 'TENANT') {
          navigate('/tenant/messages');
        }
      }, 1500);
    } catch (err) {
      console.error('Failed to send message', err);
    } finally {
      setMsgSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4">
        <h2 className="text-xl font-bold text-slate-800">Property Not Found</h2>
        <p className="text-sm text-slate-500 mt-1">The listing you requested could not be located.</p>
        <Link to="/properties" className="mt-4 px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold">
          Back to Listings
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Breadcrumb / Back button */}
        <Link
          to="/properties"
          className="inline-flex items-center space-x-2 text-xs font-bold text-slate-500 hover:text-brand-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Listings</span>
        </Link>

        {/* Hero Gallery & Header */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Visuals & Details */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Image Banner */}
            <div className="relative rounded-3xl overflow-hidden shadow-lg border border-slate-200/80 bg-slate-900 h-96 sm:h-[480px]">
              <img
                src={property.imageUrl || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80"}
                alt={property.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none"></div>

              <div className="absolute top-4 left-4 flex space-x-2">
                <span className="bg-white/95 text-slate-900 text-xs font-bold px-3 py-1 rounded-xl shadow-md backdrop-blur-md">
                  {property.propertyType || 'Apartment'}
                </span>
                <span className="bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-xl shadow-md">
                  {property.status}
                </span>
              </div>

              <div className="absolute bottom-6 left-6 text-white">
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl sm:text-4xl font-black tracking-tight drop-shadow-md">
                    ${Number(property.rent).toLocaleString()}
                  </span>
                  <span className="text-sm font-medium text-slate-200">/ month</span>
                </div>
              </div>
            </div>

            {/* Title & Specs */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{property.title}</h1>
                <div className="flex items-center text-slate-500 text-sm mt-2 space-x-1.5">
                  <MapPin className="w-4 h-4 text-brand-600 shrink-0" />
                  <span>{property.address}, {property.city}</span>
                </div>
              </div>

              {/* Feature Pills */}
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 py-4 border-y border-slate-100 text-center">
                <div className="bg-slate-50 p-3 rounded-2xl">
                  <span className="text-xs text-slate-400 font-medium block">Bedrooms</span>
                  <span className="text-base font-extrabold text-slate-900">{property.bedrooms || 2}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl">
                  <span className="text-xs text-slate-400 font-medium block">Bathrooms</span>
                  <span className="text-base font-extrabold text-slate-900">{property.bathrooms || 2}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl">
                  <span className="text-xs text-slate-400 font-medium block">Square Feet</span>
                  <span className="text-base font-extrabold text-slate-900">{property.areaSqft || 1000}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl col-span-3 sm:col-span-1">
                  <span className="text-xs text-slate-400 font-medium block">Type</span>
                  <span className="text-base font-extrabold text-slate-900">{property.propertyType}</span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-2">About This Property</h3>
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                  {property.description}
                </p>
              </div>

              {/* Amenities */}
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-3">Key Features & Amenities</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-slate-700">
                  <div className="flex items-center space-x-2 bg-slate-50 p-2.5 rounded-xl">
                    <CheckCircle className="w-4 h-4 text-brand-600" />
                    <span>Air Conditioning & HVAC</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-slate-50 p-2.5 rounded-xl">
                    <CheckCircle className="w-4 h-4 text-brand-600" />
                    <span>High-Speed Fiber Ready</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-slate-50 p-2.5 rounded-xl">
                    <CheckCircle className="w-4 h-4 text-brand-600" />
                    <span>Covered Parking Space</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-slate-50 p-2.5 rounded-xl">
                    <CheckCircle className="w-4 h-4 text-brand-600" />
                    <span>In-Unit Washer / Dryer</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-slate-50 p-2.5 rounded-xl">
                    <CheckCircle className="w-4 h-4 text-brand-600" />
                    <span>Pet Friendly</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-slate-50 p-2.5 rounded-xl">
                    <CheckCircle className="w-4 h-4 text-brand-600" />
                    <span>24/7 Security Access</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Action / Manager Sidebar Card */}
          <div className="space-y-6">
            
            {/* Quick Action Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-5">
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Monthly Lease</span>
                <span className="text-2xl font-black text-brand-600">
                  ${Number(property.rent).toLocaleString()}
                </span>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleOpenApply}
                  className="w-full py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-brand-600 to-tealbrand-500 hover:from-brand-700 hover:to-tealbrand-600 shadow-lg shadow-brand-500/25 transition-all text-center flex items-center justify-center space-x-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Apply For Rental</span>
                </button>

                <button
                  onClick={handleOpenMessage}
                  className="w-full py-3 px-4 rounded-xl text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors text-center flex items-center justify-center space-x-2"
                >
                  <MessageSquare className="w-4 h-4 text-slate-500" />
                  <span>Send Message to Manager</span>
                </button>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-2 text-[11px] text-slate-500">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Verified listing & secure deposit terms</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Direct landlord/manager communication</span>
                </div>
              </div>
            </div>

            {/* Manager Profile Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Listed By Property Manager
              </h4>

              <div className="flex items-center space-x-3.5">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80"
                  alt={property.managerName}
                  className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
                />
                <div>
                  <h5 className="font-bold text-slate-900 text-sm">{property.managerName || 'Certified Manager'}</h5>
                  <p className="text-xs text-brand-600 font-semibold">Licensed Real Estate Agent</p>
                </div>
              </div>

              <div className="space-y-2 pt-2 text-xs text-slate-600">
                <div className="flex items-center space-x-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{property.managerEmail || 'manager@realestate.com'}</span>
                </div>
                {property.managerPhone && (
                  <div className="flex items-center space-x-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{property.managerPhone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Application Modal */}
      <Modal
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        title={`Apply for: ${property.title}`}
      >
        {submitSuccess ? (
          <div className="text-center py-6 space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900">Application Submitted!</h4>
            <p className="text-xs text-slate-600">
              The manager will review your submission and contact you via the messaging portal.
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

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Target Move-In Date <span className="text-rose-500">*</span>
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
                Employment Details & Annual Income <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Senior Product Designer, $130,000/yr"
                value={employmentInfo}
                onChange={(e) => setEmploymentInfo(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Applicant Statement / Notes
              </label>
              <textarea
                rows={3}
                placeholder="Tell the property manager about yourself, lease duration, etc."
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
                className="py-2.5 px-5 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-md transition-all disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Send Application'}
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Message Modal */}
      <Modal
        isOpen={msgModalOpen}
        onClose={() => setMsgModalOpen(false)}
        title={`Message ${property.managerName || 'Manager'}`}
      >
        {msgSuccess ? (
          <div className="text-center py-6 space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900">Message Delivered!</h4>
            <p className="text-xs text-slate-600">Redirecting you to the live message thread...</p>
          </div>
        ) : (
          <form onSubmit={handleSendMessage} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Your Message
              </label>
              <textarea
                rows={4}
                required
                placeholder="Hello, I would like to inquire about viewing this property..."
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-brand-500 resize-none"
              />
            </div>
            <div className="pt-2 flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setMsgModalOpen(false)}
                className="py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={msgSending || !messageContent.trim()}
                className="py-2.5 px-5 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-md transition-all disabled:opacity-50"
              >
                {msgSending ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </form>
        )}
      </Modal>

    </div>
  );
};

export default PropertyDetail;
