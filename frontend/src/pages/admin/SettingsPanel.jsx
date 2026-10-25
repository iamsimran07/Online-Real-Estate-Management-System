import React, { useState, useEffect } from 'react';
import { Settings, Save, CheckCircle2, Sliders, Shield, AlertCircle, X } from 'lucide-react';
import api from '../../api/axios';

const SettingsPanel = () => {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState(null);
  const [feedback, setFeedback] = useState({ type: '', text: '' });

  const fetchSettings = async () => {
    try {
      const res = await api.get('/settings');
      setSettings(res.data);
    } catch (err) {
      console.error('Failed to load settings', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChangeValue = (key, newValue) => {
    setSettings((prev) =>
      prev.map((s) => (s.settingKey === key ? { ...s, settingValue: newValue } : s))
    );
  };

  const handleSaveSetting = async (setting) => {
    setSavingKey(setting.settingKey);
    setFeedback({ type: '', text: '' });

    try {
      await api.put('/settings', {
        settingKey: setting.settingKey,
        settingValue: setting.settingValue,
        description: setting.description,
      });
      setFeedback({ type: 'success', text: `Saved setting: ${setting.settingKey}` });
    } catch (err) {
      setFeedback({ type: 'error', text: err.response?.data?.message || 'Failed to update setting.' });
    } finally {
      setSavingKey(null);
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-5xl mx-auto">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          System Settings Panel
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Configure platform defaults, operational parameters, and administrative controls.
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

      {/* Settings Form Cards */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden divide-y divide-slate-100">
        {loading ? (
          <div className="py-12 text-center text-slate-400">Loading settings...</div>
        ) : settings.length === 0 ? (
          <div className="py-12 text-center text-slate-400">No settings available.</div>
        ) : (
          settings.map((setting) => (
            <div key={setting.settingKey} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="max-w-md">
                <h4 className="text-sm font-bold text-slate-900 capitalize">
                  {setting.settingKey.replace(/_/g, ' ')}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  {setting.description || 'System setting configuration parameter.'}
                </p>
                <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                  key: {setting.settingKey}
                </span>
              </div>

              <div className="flex items-center space-x-3 sm:w-80">
                {setting.settingKey.includes('mode') || setting.settingKey.includes('approve') ? (
                  <select
                    value={setting.settingValue}
                    onChange={(e) => handleChangeValue(setting.settingKey, e.target.value)}
                    className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-brand-500"
                  >
                    <option value="true">Enabled (True)</option>
                    <option value="false">Disabled (False)</option>
                  </select>
                ) : (
                  <input
                    type="text"
                    value={setting.settingValue || ''}
                    onChange={(e) => handleChangeValue(setting.settingKey, e.target.value)}
                    className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-brand-500"
                  />
                )}

                <button
                  onClick={() => handleSaveSetting(setting)}
                  disabled={savingKey === setting.settingKey}
                  className="py-2 px-3.5 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-sm transition-all disabled:opacity-50 flex items-center space-x-1.5 shrink-0"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{savingKey === setting.settingKey ? 'Saving...' : 'Save'}</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};

export default SettingsPanel;
