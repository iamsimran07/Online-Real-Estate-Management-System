import React, { useState, useEffect } from 'react';
import { Activity, Clock, User, Shield, CheckCircle2, RotateCw, Filter } from 'lucide-react';
import api from '../../api/axios';

const ActivityMonitoring = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filterAction, setFilterAction] = useState('');

  const fetchActivities = async () => {
    try {
      const res = await api.get('/analytics/admin');
      setActivities(res.data.recentActivities || []);
    } catch (err) {
      console.error('Failed to load activities', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchActivities();
    const interval = setInterval(fetchActivities, 10000); // Live polling every 10s
    return () => clearInterval(interval);
  }, []);

  const handleManualRefresh = () => {
    setRefreshing(true);
    fetchActivities();
  };

  const getActionBadge = (action) => {
    if (action.includes('LOGIN')) {
      return <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold px-2 py-0.5 rounded-full">Login</span>;
    }
    if (action.includes('APPROVE') || action.includes('AGREEMENT')) {
      return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full">{action}</span>;
    }
    if (action.includes('REJECT') || action.includes('DELETE')) {
      return <span className="bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold px-2 py-0.5 rounded-full">{action}</span>;
    }
    return <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full">{action}</span>;
  };

  const filtered = filterAction
    ? activities.filter((a) => a.action?.toLowerCase().includes(filterAction.toLowerCase()))
    : activities;

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-brand-600 uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span>Live Audit Stream</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Activity Monitoring
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time feed of user authentication, property listing mutations, and contract state changes.
          </p>
        </div>

        <button
          onClick={handleManualRefresh}
          className="inline-flex items-center space-x-2 px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm self-start sm:self-auto"
        >
          <RotateCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-brand-600' : ''}`} />
          <span>Refresh Feed</span>
        </button>
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-slate-400 font-semibold mr-1">Filter by:</span>
        <button
          onClick={() => setFilterAction('')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
            !filterAction ? 'bg-brand-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          All Events
        </button>
        <button
          onClick={() => setFilterAction('PROPERTY')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
            filterAction === 'PROPERTY' ? 'bg-brand-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Property Changes
        </button>
        <button
          onClick={() => setFilterAction('AGREEMENT')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
            filterAction === 'AGREEMENT' ? 'bg-brand-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Agreements
        </button>
        <button
          onClick={() => setFilterAction('LOGIN')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
            filterAction === 'LOGIN' ? 'bg-brand-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Auth Sessions
        </button>
      </div>

      {/* Activity Timeline List */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8">
        {loading ? (
          <div className="py-12 text-center text-slate-400">Loading audit feed...</div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center text-slate-400">No activities match this filter.</div>
        ) : (
          <div className="space-y-6 relative before:absolute before:inset-0 before:left-5 before:w-0.5 before:bg-slate-100">
            {filtered.map((item) => (
              <div key={item.id} className="relative flex items-start space-x-4 pl-1">
                {/* Timeline node */}
                <div className="w-9 h-9 rounded-xl bg-slate-50 border-2 border-white shadow-sm text-brand-600 flex items-center justify-center shrink-0 z-10">
                  <Activity className="w-4 h-4" />
                </div>

                <div className="flex-1 bg-slate-50/80 rounded-2xl p-4 border border-slate-100 hover:bg-slate-100/60 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900 text-xs sm:text-sm">
                        {item.userName || 'System'}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-500 uppercase px-1.5 py-0.5 rounded bg-slate-200/80">
                        {item.role || 'USER'}
                      </span>
                    </div>
                    {getActionBadge(item.action)}
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    {item.details || item.action}
                  </p>

                  <div className="flex items-center space-x-1.5 text-[10px] text-slate-400 mt-2 font-medium">
                    <Clock className="w-3 h-3" />
                    <span>
                      {new Date(item.createdAt).toLocaleDateString()} at{' '}
                      {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default ActivityMonitoring;
