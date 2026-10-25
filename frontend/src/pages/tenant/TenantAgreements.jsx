import React, { useState, useEffect } from 'react';
import {
  FileText, Calendar, DollarSign, Shield, CheckCircle2, Clock,
  Download, Eye
} from 'lucide-react';
import Modal from '../../components/common/Modal';
import api from '../../api/axios';

const TenantAgreements = () => {
  const [agreements, setAgreements] = useState([]);
  const [loading, setLoading] = useState(true);

  // View Terms Modal
  const [selectedAgr, setSelectedAgr] = useState(null);
  const [termsModalOpen, setTermsModalOpen] = useState(false);

  useEffect(() => {
    const fetchAgreements = async () => {
      try {
        const res = await api.get('/agreements/tenant');
        setAgreements(res.data);
      } catch (err) {
        console.error('Failed to load tenant agreements', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAgreements();
  }, []);

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
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          My Lease Agreements
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Access your digital rental contracts, payment schedules, and signed legal terms.
        </p>
      </div>

      {/* Agreements Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-2 py-12 text-center text-slate-400">Loading your agreements...</div>
        ) : agreements.length === 0 ? (
          <div className="col-span-2 bg-white rounded-3xl p-12 text-center border border-slate-200/80">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No lease agreements found</h3>
            <p className="text-xs text-slate-500 mt-1">
              Once an application is approved, the property manager will issue your formal rental agreement here.
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
                  <span className="text-xs font-black text-slate-900">Rental Lease Agreement #{agr.id}</span>
                  {getStatusBadge(agr.status)}
                </div>

                <div className="mt-4 space-y-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Residence</span>
                    <h4 className="font-extrabold text-slate-900 text-base">{agr.propertyTitle}</h4>
                    <p className="text-slate-400 text-xs truncate">{agr.propertyAddress}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Monthly Rent</span>
                      <span className="font-extrabold text-brand-600 text-base">
                        ${Number(agr.monthlyRent || 0).toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Deposit Held</span>
                      <span className="font-bold text-slate-800 text-sm">
                        ${Number(agr.depositAmount || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-xs text-slate-600 bg-slate-50/60 p-2.5 rounded-xl">
                    <Calendar className="w-4 h-4 text-brand-600 shrink-0" />
                    <span>Duration: {agr.startDate} to {agr.endDate}</span>
                  </div>

                  <div className="text-xs text-slate-500">
                    <span className="font-semibold text-slate-700">Property Manager: </span>
                    {agr.managerName || 'Landlord'} ({agr.managerEmail})
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => {
                    setSelectedAgr(agr);
                    setTermsModalOpen(true);
                  }}
                  className="py-2 px-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors flex items-center space-x-1.5"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                  <span>View Full Agreement Terms</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Terms Modal */}
      <Modal
        isOpen={termsModalOpen}
        onClose={() => setTermsModalOpen(false)}
        title={selectedAgr ? `Lease Agreement #${selectedAgr.id} Terms` : 'Agreement Terms'}
        maxWidth="max-w-xl"
      >
        {selectedAgr && (
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Property:</span>
                <span className="font-bold text-slate-900">{selectedAgr.propertyTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Monthly Rent:</span>
                <span className="font-bold text-brand-600">${Number(selectedAgr.monthlyRent).toLocaleString()}/month</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Security Deposit:</span>
                <span className="font-bold text-slate-800">${Number(selectedAgr.depositAmount).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Validity:</span>
                <span className="font-medium text-slate-700">{selectedAgr.startDate} to {selectedAgr.endDate}</span>
              </div>
            </div>

            <div>
              <h5 className="font-bold text-slate-900 mb-1">Terms & Legal Conditions</h5>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-slate-700 leading-relaxed max-h-48 overflow-y-auto whitespace-pre-line font-mono text-[11px]">
                {selectedAgr.terms || 'Standard residential tenancy terms apply.'}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setTermsModalOpen(false)}
                className="py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700"
              >
                Close Terms
              </button>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
};

export default TenantAgreements;
