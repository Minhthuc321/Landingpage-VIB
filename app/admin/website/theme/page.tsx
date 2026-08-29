"use client";

import React, { useEffect, useState } from 'react';
import {
  Palette,
  Type,
  Maximize,
  Save,
  RotateCcw,
  Monitor,
  Tablet,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import { ThemeSettings, CMSData } from '@/lib/types';

export default function ThemeEditorPage() {
  const [data, setData] = useState<CMSData | null>(null);
  const [theme, setTheme] = useState<ThemeSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  useEffect(() => {
    fetchTheme();
  }, []);

  const fetchTheme = async () => {
    try {
      const res = await fetch('/api/cms/content?mode=draft');
      if (res.ok) {
        const json = await res.json();
        setData(json.data);
        setTheme(json.data.themeSettings);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const updateColor = (key: keyof ThemeSettings['colors'], val: string) => {
    if (!theme) return;
    setTheme({
      ...theme,
      colors: {
        ...theme.colors,
        [key]: val,
      },
    });
  };

  const updateTypography = (key: keyof ThemeSettings['typography'], val: string) => {
    if (!theme) return;
    setTheme({
      ...theme,
      typography: {
        ...theme.typography,
        [key]: val,
      },
    });
  };

  const updateComponentToken = (key: keyof ThemeSettings['components'], val: any) => {
    if (!theme) return;
    setTheme({
      ...theme,
      components: {
        ...theme.components,
        [key]: val,
      },
    });
  };

  const handleSaveTheme = async () => {
    if (!data || !theme) return;
    setSaving(true);
    setMsg('');

    const updatedData: CMSData = {
      ...data,
      themeSettings: theme,
    };

    try {
      const res = await fetch('/api/cms/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: updatedData }),
      });
      if (res.ok) {
        setMsg('✅ Đã lưu cấu hình Giao diện & Design Tokens!');
        setTimeout(() => setMsg(''), 3000);
      }
    } catch (e) {
      setMsg('❌ Lỗi lưu giao diện.');
    } finally {
      setSaving(false);
    }
  };

  const allowedHeadingFonts = ['Montserrat', 'Roboto', 'Outfit', 'Inter', 'Plus Jakarta Sans'];
  const allowedBodyFonts = ['Plus Jakarta Sans', 'Roboto', 'Inter', 'Open Sans'];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-6 rounded-2xl">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-pink-400 uppercase tracking-wider mb-1">
            <Palette className="w-3.5 h-3.5" /> GIAO DIỆN WEBSITE & DESIGN TOKENS
          </div>
          <h1 className="text-xl font-extrabold text-white">Tùy Chỉnh Màu Sắc, Kiểu Chữ & Bo Góc Card</h1>
          <p className="text-xs text-slate-400 mt-1">Sử dụng CSS Variables & Design Tokens có kiểm soát an toàn, xem trước Live Preview 3 thiết bị.</p>
        </div>

        <div className="flex items-center gap-3">
          {msg && <span className="text-xs font-semibold text-amber-300 animate-fade-in">{msg}</span>}
          <button
            onClick={handleSaveTheme}
            disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold text-xs shadow-lg shadow-blue-600/20 flex items-center gap-2 transition cursor-pointer"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Đang lưu...' : 'Lưu Giao Diện'}
          </button>
        </div>
      </div>

      {/* Main Grid: Theme Controls Left, Device Live Preview Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Controls */}
        <div className="lg:col-span-6 space-y-6">
          {/* Colors Card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Palette className="w-4 h-4 text-amber-400" /> Bảng Màu Sắc Chủ Đạo (Color Palette)
            </h3>

            {theme && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Màu Nền Chính (Background)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={theme.colors.bgMain}
                      onChange={(e) => updateColor('bgMain', e.target.value)}
                      className="w-8 h-8 rounded-lg bg-transparent border-0 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={theme.colors.bgMain}
                      onChange={(e) => updateColor('bgMain', e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Màu Navy Đậm</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={theme.colors.navy}
                      onChange={(e) => updateColor('navy', e.target.value)}
                      className="w-8 h-8 rounded-lg bg-transparent border-0 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={theme.colors.navy}
                      onChange={(e) => updateColor('navy', e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Màu Xanh Chủ Đạo (Primary Blue)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={theme.colors.primaryBlue}
                      onChange={(e) => updateColor('primaryBlue', e.target.value)}
                      className="w-8 h-8 rounded-lg bg-transparent border-0 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={theme.colors.primaryBlue}
                      onChange={(e) => updateColor('primaryBlue', e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Màu Vàng Gold (Accent Gold)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={theme.colors.gold}
                      onChange={(e) => updateColor('gold', e.target.value)}
                      className="w-8 h-8 rounded-lg bg-transparent border-0 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={theme.colors.gold}
                      onChange={(e) => updateColor('gold', e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Typography Card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Type className="w-4 h-4 text-blue-400" /> Kiểu Chữ & Typography Cho Phép
            </h3>

            {theme && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Font Tiêu Đề</label>
                  <select
                    value={theme.typography.headingFont}
                    onChange={(e) => updateTypography('headingFont', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 font-medium"
                  >
                    {allowedHeadingFonts.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Font Nội Dung</label>
                  <select
                    value={theme.typography.bodyFont}
                    onChange={(e) => updateTypography('bodyFont', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 font-medium"
                  >
                    {allowedBodyFonts.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Components Card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Maximize className="w-4 h-4 text-purple-400" /> Bo Góc & Thành Phần Giao Diện
            </h3>

            {theme && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Bo Góc Nút Bấm</label>
                  <select
                    value={theme.components.buttonBorderRadius}
                    onChange={(e) => updateComponentToken('buttonBorderRadius', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 font-medium"
                  >
                    <option value="50px">Tròn Pill (50px)</option>
                    <option value="14px">Bo Mềm (14px)</option>
                    <option value="8px">Bo Vừa (8px)</option>
                    <option value="0px">Vuông Vức (0px)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Bo Góc Card Sản Phẩm</label>
                  <select
                    value={theme.components.cardBorderRadius}
                    onChange={(e) => updateComponentToken('cardBorderRadius', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 font-medium"
                  >
                    <option value="24px">Rất Bo (24px)</option>
                    <option value="14px">Bo Chuẩn (14px)</option>
                    <option value="8px">Bo Nhẹ (8px)</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Live Device Preview */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between bg-slate-900/80 border border-slate-800 p-3 rounded-2xl">
            <span className="text-xs font-bold text-slate-300">Xem Trước Thiết Bị Live Preview</span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPreviewDevice('desktop')}
                className={`p-1.5 rounded-lg border transition ${
                  previewDevice === 'desktop' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPreviewDevice('tablet')}
                className={`p-1.5 rounded-lg border transition ${
                  previewDevice === 'tablet' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <Tablet className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPreviewDevice('mobile')}
                className={`p-1.5 rounded-lg border transition ${
                  previewDevice === 'mobile' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Iframe Viewport Container */}
          <div className="flex justify-center bg-slate-950 border border-slate-800 rounded-2xl p-4 overflow-hidden min-h-[600px]">
            <div
              className={`transition-all duration-300 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col ${
                previewDevice === 'desktop'
                  ? 'w-full h-[650px]'
                  : previewDevice === 'tablet'
                  ? 'w-[768px] h-[650px]'
                  : 'w-[390px] h-[650px]'
              }`}
            >
              <div className="bg-slate-950 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span className="font-mono truncate">https://vib.minhthucmkt.vn (Live Preview)</span>
                <span className="capitalize">{previewDevice}</span>
              </div>
              <iframe src="/" className="w-full flex-1 border-0" title="Live Preview" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
