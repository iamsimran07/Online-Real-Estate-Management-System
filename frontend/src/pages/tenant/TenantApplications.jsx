import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FolderCheck, Clock, CheckCircle2, XCircle, Building2, MapPin,
  Calendar, MessageSquare, ArrowRight, DollarSign
} from 'lucide-react';
import api from '../../api/axios';

const TenantApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await api.get('/applications/tenant');
        setApplications(res.data);
      } catch (err) {
        console.error('Failed to load applications', err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPROVED':
        return (
          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-3 py-1 rounded-full flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Approved by Landlord</span>
          </span>
        );
      case 'PENDING':
        return (
          <span className="bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold px-3 py-1 rounded-full flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Under Review</span>
          </span>
        );
      case 'REJECTED':
        return (
          <span className="bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold px-3 py-1 rounded-full flex items-center space-x-1">
            <XCircle className="w-3.5 h-3.5" />
            <span>Declined</span>
          </span>
        );
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
            My Rental Applications
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track real-time status and communications for your property applications.
          </p>
        </div>

        <Link
          to="/properties"
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md transition-all self-start sm:self-auto"
        >
          <span>Find More Properties</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-12 text-center text-slate-400">Loading applications...</div>
        ) : applications.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 max-w-lg mx-auto">
            <FolderCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No applications on record</h3>
            <p className="text-xs text-slate-500 mt-1">
              Browse available listings and submit an application to start your leasing process.
            </p>
            <Link
              to="/properties"
              className="mt-5 inline-block py-2.5 px-5 rounded-xl bg-brand-600 text-white text-xs font-bold"
            >
              Browse Properties
            </Link>
          </div>
        ) : (
          applications.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:border-brand-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="flex items-start space-x-4">
                <img
                  src={app.propertyImageUrl || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=200&q=80"}
                  alt={app.propertyTitle}
                  className="w-20 h-20 rounded-2xl object-cover border border-slate-200 shrink-0"
                />
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Application #{app.id}
                    </span>
                    <span>•</span>
                    <span className="text-xs text-slate-400">
                      Submitted {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'recently'}
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900 line-clamp-1">
                    {app.propertyTitle}
                  </h3>

                  <p className="text-xs text-slate-500 flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-brand-600" />
                    <span>{app.propertyAddress}, {app.propertyCity}</span>
                  </p>

                  <p className="text-xs text-brand-600 font-extrabold pt-1">
                    ${Number(app.propertyRent || 0).toLocaleString()} / month
                  </p>

                  {app.moveInDate && (
                    <span className="text-[11px] text-slate-500 block pt-0.5">
                      Target move-in: {new Date(app.moveInDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>

              {/* Status & Action */}
              <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-between gap-3 shrink-0 pt-4 md:pt-0 border-t md:border-t-0">
                {getStatusBadge(app.status)}

                <div className="flex space-x-2">
                  <Link
                    to={`/properties/${app.propertyId}`}
                    className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
                  >
                    View Property
                  </Link>
                  <button
                    onClick={() => navigate('/tenant/messages')}
                    className="py-2 px-3 bg-brand-50 hover:bg-brand-100 text-brand-700 text-xs font-bold rounded-xl transition-colors flex items-center space-x-1"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Chat Manager</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};

export default TenantApplications;
