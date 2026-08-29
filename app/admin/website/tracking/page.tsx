"use client";

import React, { useEffect, useState } from 'react';
import {
  Code,
  ShieldCheck,
  Save,
  CheckCircle2,
  AlertCircle,
  Activity,
  Check,
  X,
  Lock,
} from 'lucide-react';
import { CMSData, TrackingCodes } from '@/lib/types';
import { validateTrackingFormat } from '@/lib/validation';

export default function TrackingManagerPage() {
  const [data, setData] = useState<CMSData | null>(null);
  const [tracking, setTracking] = useState<TrackingCodes | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [errors, setErrors] = useState<{ ga?: string; gtm?: string; pixel?: string }>({});

  useEffect(() => {
    fetchTracking();
  }, []);

  const fetchTracking = async () => {
    try {
      const res = await fetch('/api/cms/content?mode=draft');
      if (res.ok) {
        const json = await res.json();
        setData(json.data);
        setTracking(json.data.trackingCodes);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const validateAll = (): boolean => {
    if (!tracking) return false;
    const newErr: { ga?: string; gtm?: string; pixel?: string } = {};

    if (tracking.gaMeasurementId && !validateTrackingFormat('ga', tracking.gaMeasurementId)) {
      newErr.ga = 'Định dạng ID không hợp lệ. Phải có dạng G-XXXXXXXXXX';
    }
    if (tracking.gtmContainerId && !validateTrackingFormat('gtm', tracking.gtmContainerId)) {
      newErr.gtm = 'Định dạng Container ID không hợp lệ. Phải có dạng GTM-XXXXXXX';
    }
    if (tracking.metaPixelId && !validateTrackingFormat('pixel', tracking.metaPixelId)) {
      newErr.pixel = 'Meta Pixel ID chỉ được phép chứa các chữ số.';
    }

    setErrors(newErr);
    return Object.keys(newErr).length === 0;
  };

  const handleSaveTracking = async () => {
    if (!data || !tracking) return;

    if (!validateAll()) {
      setMsg('❌ Vui lòng sửa các lỗi định dạng ID trước khi lưu.');
      return;
    }

    setSaving(true);
    setMsg('');

    const updatedData: CMSData = {
      ...data,
      trackingCodes: tracking,
    };

    try {
      const res = await fetch('/api/cms/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: updatedData }),
      });
      if (res.ok) {
        setMsg('✅ Đã lưu cấu hình Mã Theo Dõi!');
        setTimeout(() => setMsg(''), 3000);
      }
    } catch (e) {
      setMsg('❌ Lỗi lưu mã theo dõi.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-6 rounded-2xl">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">
            <Code className="w-3.5 h-3.5" /> QUẢN LÝ MÃ THEO DÕI & ANALYTICS
          </div>
          <h1 className="text-xl font-extrabold text-white">Cấu Hình Google Analytics, GTM & Meta Pixel</h1>
          <p className="text-xs text-slate-400 mt-1">
            Nhập trực tiếp ID công cụ có kiểm tra định dạng an toàn. Tuyệt đối không chèn mã JavaScript tùy ý để đảm bảo bảo mật.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {msg && <span className="text-xs font-semibold text-amber-300 animate-fade-in">{msg}</span>}
          <button
            onClick={handleSaveTracking}
            disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold text-xs shadow-lg shadow-blue-600/20 flex items-center gap-2 transition cursor-pointer"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Đang lưu...' : 'Lưu Mã Theo Dõi'}
          </button>
        </div>
      </div>

      {/* Controlled ID Forms */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Google Analytics */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4 flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-bold text-white">Google Analytics 4</span>
              </div>
              <button
                onClick={() => tracking && setTracking({ ...tracking, gaEnabled: !tracking.gaEnabled })}
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition ${
                  tracking?.gaEnabled
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                    : 'bg-slate-800 border-slate-700 text-slate-500'
                }`}
              >
                {tracking?.gaEnabled ? 'Đang Bật' : 'Đang Tắt'}
              </button>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-300">Measurement ID (*)</label>
              <input
                type="text"
                value={tracking?.gaMeasurementId || ''}
                onChange={(e) => tracking && setTracking({ ...tracking, gaMeasurementId: e.target.value.toUpperCase().trim() })}
                placeholder="G-XXXXXXXXXX"
                className={`w-full px-4 py-2.5 rounded-xl bg-slate-950 border text-xs font-mono text-slate-100 ${
                  errors.ga ? 'border-rose-500' : 'border-slate-800'
                }`}
              />
              {errors.ga && <span className="text-[10px] text-rose-400 block font-medium">{errors.ga}</span>}
              <span className="text-[10px] text-slate-500 block">Ví dụ: G-A1B2C3D4E5</span>
            </div>
          </div>

          <div className="border-t border-slate-800/80 pt-3 text-[11px] text-slate-500 flex items-center gap-1.5">
            {tracking?.gaMeasurementId ? (
              <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                <Check className="w-3.5 h-3.5" /> Đã cấu hình
              </span>
            ) : (
              <span className="text-slate-500 flex items-center gap-1">
                <X className="w-3.5 h-3.5" /> Chưa cấu hình
              </span>
            )}
          </div>
        </div>

        {/* Google Tag Manager */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4 flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-bold text-white">Google Tag Manager</span>
              </div>
              <button
                onClick={() => tracking && setTracking({ ...tracking, gtmEnabled: !tracking.gtmEnabled })}
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition ${
                  tracking?.gtmEnabled
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                    : 'bg-slate-800 border-slate-700 text-slate-500'
                }`}
              >
                {tracking?.gtmEnabled ? 'Đang Bật' : 'Đang Tắt'}
              </button>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-300">Container ID (*)</label>
              <input
                type="text"
                value={tracking?.gtmContainerId || ''}
                onChange={(e) => tracking && setTracking({ ...tracking, gtmContainerId: e.target.value.toUpperCase().trim() })}
                placeholder="GTM-XXXXXXX"
                className={`w-full px-4 py-2.5 rounded-xl bg-slate-950 border text-xs font-mono text-slate-100 ${
                  errors.gtm ? 'border-rose-500' : 'border-slate-800'
                }`}
              />
              {errors.gtm && <span className="text-[10px] text-rose-400 block font-medium">{errors.gtm}</span>}
              <span className="text-[10px] text-slate-500 block">Ví dụ: GTM-N123456</span>
            </div>
          </div>

          <div className="border-t border-slate-800/80 pt-3 text-[11px] text-slate-500 flex items-center gap-1.5">
            {tracking?.gtmContainerId ? (
              <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                <Check className="w-3.5 h-3.5" /> Đã cấu hình
              </span>
            ) : (
              <span className="text-slate-500 flex items-center gap-1">
                <X className="w-3.5 h-3.5" /> Chưa cấu hình
              </span>
            )}
          </div>
        </div>

        {/* Meta Pixel */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4 flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-bold text-white">Meta (Facebook) Pixel</span>
              </div>
              <button
                onClick={() => tracking && setTracking({ ...tracking, metaPixelEnabled: !tracking.metaPixelEnabled })}
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition ${
                  tracking?.metaPixelEnabled
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                    : 'bg-slate-800 border-slate-700 text-slate-500'
                }`}
              >
                {tracking?.metaPixelEnabled ? 'Đang Bật' : 'Đang Tắt'}
              </button>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-300">Pixel ID (*)</label>
              <input
                type="text"
                value={tracking?.metaPixelId || ''}
                onChange={(e) => tracking && setTracking({ ...tracking, metaPixelId: e.target.value.trim() })}
                placeholder="123456789012345"
                className={`w-full px-4 py-2.5 rounded-xl bg-slate-950 border text-xs font-mono text-slate-100 ${
                  errors.pixel ? 'border-rose-500' : 'border-slate-800'
                }`}
              />
              {errors.pixel && <span className="text-[10px] text-rose-400 block font-medium">{errors.pixel}</span>}
              <span className="text-[10px] text-slate-500 block">Ví dụ: 123456789012345</span>
            </div>
          </div>

          <div className="border-t border-slate-800/80 pt-3 text-[11px] text-slate-500 flex items-center gap-1.5">
            {tracking?.metaPixelId ? (
              <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                <Check className="w-3.5 h-3.5" /> Đã cấu hình
              </span>
            ) : (
              <span className="text-slate-500 flex items-center gap-1">
                <X className="w-3.5 h-3.5" /> Chưa cấu hình
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
