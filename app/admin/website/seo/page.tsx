"use client";

import React, { useEffect, useState } from 'react';
import {
  Search,
  Lock,
  Globe,
  Share2,
  ShieldCheck,
  Save,
  CheckCircle2,
  AlertOctagon,
  Image as ImageIcon,
} from 'lucide-react';
import { CMSData, SeoSettings } from '@/lib/types';

export default function SeoManagerPage() {
  const [data, setData] = useState<CMSData | null>(null);
  const [seo, setSeo] = useState<SeoSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetchSeo();
  }, []);

  const fetchSeo = async () => {
    try {
      const res = await fetch('/api/cms/content?mode=draft');
      if (res.ok) {
        const json = await res.json();
        setData(json.data);
        setSeo(json.data.seoSettings);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveSeo = async () => {
    if (!data || !seo) return;
    setSaving(true);
    setMsg('');

    const updatedData: CMSData = {
      ...data,
      seoSettings: seo,
    };

    try {
      const res = await fetch('/api/cms/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: updatedData }),
      });
      if (res.ok) {
        setMsg('✅ Đã lưu cấu hình SEO & Tuyên bố Pháp lý!');
        setTimeout(() => setMsg(''), 3000);
      }
    } catch (e) {
      setMsg('❌ Lỗi lưu SEO.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-6 rounded-2xl">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
            <Search className="w-3.5 h-3.5" /> QUẢN LÝ SEO & PHÁP LÝ VIB
          </div>
          <h1 className="text-xl font-extrabold text-white">Cấu Hình Meta Tags, OpenGraph & Tuyên Bố Miễn Trừ</h1>
          <p className="text-xs text-slate-400 mt-1">Bảo vệ tính tuân thủ pháp lý ngân hàng VIB và tối ưu hóa thứ tự tìm kiếm Google.</p>
        </div>

        <div className="flex items-center gap-3">
          {msg && <span className="text-xs font-semibold text-amber-300 animate-fade-in">{msg}</span>}
          <button
            onClick={handleSaveSeo}
            disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold text-xs shadow-lg shadow-blue-600/20 flex items-center gap-2 transition cursor-pointer"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Đang lưu...' : 'Lưu Cấu Hình SEO'}
          </button>
        </div>
      </div>

      {/* Immutable VIB Disclaimer Box (LOCKED) */}
      <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/30 rounded-2xl p-6 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" /> TUYÊN BỐ PHÁP LÝ BẤT BIẾN (LOCKED LEGAL DISCLAIMER)
          </div>
          <span className="px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-[10px] font-bold text-amber-300 flex items-center gap-1">
            <Lock className="w-3 h-3" /> Khóa bảo vệ hệ thống
          </span>
        </div>

        <p className="text-xs text-slate-300 bg-slate-950/80 p-4 rounded-xl border border-slate-800 leading-relaxed font-mono">
          {seo?.immutableDisclaimer}
        </p>

        <div className="pt-2">
          <label className="block text-xs font-semibold text-slate-300 mb-1">Ghi Chú Bổ Sung Của Quản Trị Viên (Tùy Chọn)</label>
          <input
            type="text"
            value={seo?.customDisclaimerNote || ''}
            onChange={(e) => seo && setSeo({ ...seo, customDisclaimerNote: e.target.value })}
            placeholder="VD: Mọi thông tin tư vấn trực tiếp bởi chuyên viên Nguyễn Minh Thức..."
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200"
          />
        </div>
      </div>

      {/* Meta Tags & Open Graph Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: General SEO */}
        <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-400" /> Thẻ SEO Cơ Bản (Meta Tags)
          </h3>

          {seo && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">SEO Title (Tiêu Đề Trang) (*)</label>
                <input
                  type="text"
                  value={seo.seoTitle}
                  onChange={(e) => setSeo({ ...seo, seoTitle: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-slate-100"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">Khuyên dùng 50-60 ký tự. Đang dùng: {seo.seoTitle.length} ký tự.</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Meta Description (Mô Tả SEO) (*)</label>
                <textarea
                  rows={3}
                  value={seo.metaDescription}
                  onChange={(e) => setSeo({ ...seo, metaDescription: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 leading-relaxed"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">Khuyên dùng 150-160 ký tự. Đang dùng: {seo.metaDescription.length} ký tự.</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Canonical URL</label>
                <input
                  type="text"
                  value={seo.canonicalUrl}
                  onChange={(e) => setSeo({ ...seo, canonicalUrl: e.target.value })}
                  placeholder="https://vib.minhthucmkt.vn"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Robots Indexing</label>
                <select
                  value={seo.robots}
                  onChange={(e) => setSeo({ ...seo, robots: e.target.value as any })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 font-medium"
                >
                  <option value="index, follow">Cho phép Google Lập chỉ mục (index, follow)</option>
                  <option value="noindex, nofollow">Chặn Google Lập chỉ mục (noindex, nofollow)</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Right: Open Graph Social Sharing */}
        <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
            <Share2 className="w-4 h-4 text-amber-400" /> Thẻ Mạng Xã Hội Open Graph (Facebook / Zalo)
          </h3>

          {seo && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">OG Title (Tiêu Đề Chia Sẻ)</label>
                <input
                  type="text"
                  value={seo.ogTitle}
                  onChange={(e) => setSeo({ ...seo, ogTitle: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">OG Description (Mô Tả Chia Sẻ)</label>
                <textarea
                  rows={3}
                  value={seo.ogDescription}
                  onChange={(e) => setSeo({ ...seo, ogDescription: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">OG Image URL (Ảnh Đại Diện Chia Sẻ)</label>
                <div className="relative">
                  <ImageIcon className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={seo.ogImage}
                    onChange={(e) => setSeo({ ...seo, ogImage: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-100"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
