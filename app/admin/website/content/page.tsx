"use client";

import React, { useEffect, useState } from 'react';
import {
  FileText,
  Eye,
  EyeOff,
  Save,
  Rocket,
  MoveUp,
  MoveDown,
  Plus,
  Trash2,
  HelpCircle,
  Sparkles,
  Layers,
  Image as ImageIcon,
  Link as LinkIcon,
  CheckCircle2,
} from 'lucide-react';
import { CMSData, PageSection, CtaButton } from '@/lib/types';

export default function PageContentManager() {
  const [data, setData] = useState<CMSData | null>(null);
  const [activeSectionId, setActiveSectionId] = useState<string>('sec_hero');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const res = await fetch('/api/cms/content?mode=draft');
      if (res.ok) {
        const json = await res.json();
        setData(json.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const activeSection = data?.sections?.find((s) => s.id === activeSectionId);

  const updateActiveSection = (field: keyof PageSection, value: any) => {
    if (!data) return;
    const updatedSections = data.sections.map((sec) => {
      if (sec.id === activeSectionId) {
        return { ...sec, [field]: value };
      }
      return sec;
    });
    setData({ ...data, sections: updatedSections });
  };

  const toggleSectionEnabled = (id: string) => {
    if (!data) return;
    const updatedSections = data.sections.map((sec) => {
      if (sec.id === id) {
        return { ...sec, enabled: !sec.enabled };
      }
      return sec;
    });
    setData({ ...data, sections: updatedSections });
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    if (!data) return;
    const newSections = [...data.sections];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;

    if (targetIdx < 0 || targetIdx >= newSections.length) return;

    const temp = newSections[index];
    newSections[index] = newSections[targetIdx];
    newSections[targetIdx] = temp;

    // Update order numbers
    newSections.forEach((s, idx) => {
      s.order = idx + 1;
    });

    setData({ ...data, sections: newSections });
  };

  const handleSaveDraft = async () => {
    if (!data) return;
    setSaving(true);
    setMsg('');

    try {
      const res = await fetch('/api/cms/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setMsg('✅ Đã lưu bản nháp thành công!');
        setTimeout(() => setMsg(''), 3000);
      } else {
        setMsg(`❌ Lỗi: ${json.error || 'Không thể lưu bản nháp.'}`);
      }
    } catch (e) {
      setMsg('❌ Lỗi kết nối máy chủ.');
    } finally {
      setSaving(false);
    }
  };

  const addCtaButton = () => {
    if (!activeSection) return;
    const btns = activeSection.ctaButtons || [];
    const newBtn: CtaButton = {
      text: 'NÚT CTA MỚI',
      link: '#register',
      style: 'blue',
      action: 'scroll',
    };
    updateActiveSection('ctaButtons', [...btns, newBtn]);
  };

  const removeCtaButton = (idx: number) => {
    if (!activeSection || !activeSection.ctaButtons) return;
    const btns = [...activeSection.ctaButtons];
    btns.splice(idx, 1);
    updateActiveSection('ctaButtons', btns);
  };

  const updateCtaButton = (idx: number, field: keyof CtaButton, val: any) => {
    if (!activeSection || !activeSection.ctaButtons) return;
    const btns = [...activeSection.ctaButtons];
    btns[idx] = { ...btns[idx], [field]: val };
    updateActiveSection('ctaButtons', btns);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-6 rounded-2xl">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
            <Layers className="w-3.5 h-3.5" /> QUẢN LÝ NỘI DUNG TRANG (PAGE SECTIONS)
          </div>
          <h1 className="text-xl font-extrabold text-white">Chỉnh Sửa Toàn Bộ Khu Vực Landing Page</h1>
          <p className="text-xs text-slate-400 mt-1">Bật/tắt, sắp xếp thứ tự, sửa văn bản rich-text, hình ảnh & các nút bấm CTA cho từng phần.</p>
        </div>

        <div className="flex items-center gap-3">
          {msg && <span className="text-xs font-semibold text-amber-300 animate-fade-in">{msg}</span>}

          <button
            onClick={handleSaveDraft}
            disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold text-xs shadow-lg shadow-blue-600/20 flex items-center gap-2 transition cursor-pointer"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Đang lưu...' : 'Lưu Bản Nháp'}
          </button>
        </div>
      </div>

      {/* Main Grid Layout: Section List on Left, Editor on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Sections List */}
        <div className="lg:col-span-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-2 max-h-[750px] overflow-y-auto">
          <div className="text-xs font-bold text-slate-400 px-2 py-1 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Danh Sách Section ({data?.sections?.length || 0})</span>
            <span className="text-[10px] text-slate-500 font-normal">Kéo/di chuyển thứ tự</span>
          </div>

          {data?.sections?.map((sec, idx) => {
            const isSelected = sec.id === activeSectionId;
            return (
              <div
                key={sec.id}
                onClick={() => setActiveSectionId(sec.id)}
                className={`p-3 rounded-xl border cursor-pointer transition flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'bg-blue-600/20 border-blue-500 text-white shadow-md'
                    : 'bg-slate-950/60 border-slate-850 text-slate-300 hover:bg-slate-850/80'
                }`}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSectionEnabled(sec.id);
                    }}
                    title={sec.enabled ? 'Đang hiển thị' : 'Đang ẩn'}
                    className={`p-1.5 rounded-lg border transition ${
                      sec.enabled
                        ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                        : 'bg-slate-800 border-slate-700 text-slate-500'
                    }`}
                  >
                    {sec.enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>

                  <div className="truncate">
                    <div className="text-xs font-bold truncate">{sec.name}</div>
                    <div className="text-[10px] text-slate-500 truncate">{sec.title || 'Chưa có tiêu đề'}</div>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      moveSection(idx, 'up');
                    }}
                    disabled={idx === 0}
                    className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
                  >
                    <MoveUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      moveSection(idx, 'down');
                    }}
                    disabled={idx === (data.sections.length - 1)}
                    className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
                  >
                    <MoveDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Active Section Form Editor */}
        <div className="lg:col-span-8 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
          {activeSection ? (
            <>
              <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                    ĐANG CHỈNH SỬA SECTION #{activeSection.order}
                  </span>
                  <h2 className="text-lg font-bold text-white mt-0.5">{activeSection.name}</h2>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Hiển thị ngoài website:</span>
                  <button
                    onClick={() => updateActiveSection('enabled', !activeSection.enabled)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 ${
                      activeSection.enabled
                        ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                        : 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                    }`}
                  >
                    {activeSection.enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    {activeSection.enabled ? 'Đang Bật' : 'Đang Ẩn'}
                  </button>
                </div>
              </div>

              {/* Section Form Fields */}
              <div className="space-y-4">
                {/* Badge Text if applicable */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Nhãn nhỏ phía trên tiêu đề (Badge Pill)
                  </label>
                  <input
                    type="text"
                    value={activeSection.badgeText || ''}
                    onChange={(e) => updateActiveSection('badgeText', e.target.value)}
                    placeholder="VD: GIẢI PHÁP TÀI CHÍNH..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Main Title */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Tiêu Đề Chính Section (*)
                  </label>
                  <input
                    type="text"
                    value={activeSection.title || ''}
                    onChange={(e) => updateActiveSection('title', e.target.value)}
                    placeholder="Nhập tiêu đề section..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-xs font-bold focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Subtitle */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Tiêu Đề Phụ (Subtitle)
                  </label>
                  <input
                    type="text"
                    value={activeSection.subtitle || ''}
                    onChange={(e) => updateActiveSection('subtitle', e.target.value)}
                    placeholder="Nhập tiêu đề phụ..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Rich Description */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Mô Tả / Nội Dung Chi Tiết (An Toàn Rich-Text)
                  </label>
                  <textarea
                    rows={4}
                    value={activeSection.description || ''}
                    onChange={(e) => updateActiveSection('description', e.target.value)}
                    placeholder="Nhập mô tả chi tiết..."
                    className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-xs leading-relaxed focus:outline-none focus:border-blue-500 font-mono"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    *Tất cả thẻ HTML sẽ được tự động làm sạch (sanitize) trước khi hiển thị để chống XSS.
                  </span>
                </div>

                {/* Image or Video URL */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Đường Dẫn Ảnh / Video Media
                    </label>
                    <div className="relative">
                      <ImageIcon className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={activeSection.mediaUrl || ''}
                        onChange={(e) => updateActiveSection('mediaUrl', e.target.value)}
                        placeholder="https://images.unsplash.com/... hoặc /uploads/..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Loại Media
                    </label>
                    <select
                      value={activeSection.mediaType || 'none'}
                      onChange={(e) => updateActiveSection('mediaType', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-blue-500"
                    >
                      <option value="none">Không dùng Media</option>
                      <option value="image">Hình Ảnh (Image)</option>
                      <option value="video">Video MP4 / YouTube</option>
                    </select>
                  </div>
                </div>

                {/* CTA Buttons Manager */}
                <div className="border-t border-slate-800 pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                      <LinkIcon className="w-3.5 h-3.5" /> Quản Lý Các Nút Nút Bấm CTA ({activeSection.ctaButtons?.length || 0})
                    </label>
                    <button
                      onClick={addCtaButton}
                      className="px-3 py-1.5 rounded-lg bg-blue-600/20 border border-blue-500/40 text-blue-300 text-xs font-semibold hover:bg-blue-600/30 flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Thêm Nút CTA
                    </button>
                  </div>

                  <div className="space-y-3">
                    {activeSection.ctaButtons?.map((btn, bIdx) => (
                      <div key={bIdx} className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-slate-400">NÚT #{bIdx + 1}</span>
                          <button
                            onClick={() => removeCtaButton(bIdx)}
                            className="text-rose-400 hover:text-rose-300 p-1 text-xs flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Xóa nút
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <span className="text-[10px] text-slate-400 block mb-1">Tên hiển thị</span>
                            <input
                              type="text"
                              value={btn.text}
                              onChange={(e) => updateCtaButton(bIdx, 'text', e.target.value)}
                              className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-100"
                            />
                          </div>

                          <div>
                            <span className="text-[10px] text-slate-400 block mb-1">Liên kết / Section</span>
                            <input
                              type="text"
                              value={btn.link}
                              onChange={(e) => updateCtaButton(bIdx, 'link', e.target.value)}
                              className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-100"
                            />
                          </div>

                          <div>
                            <span className="text-[10px] text-slate-400 block mb-1">Màu sắc Nút</span>
                            <select
                              value={btn.style}
                              onChange={(e) => updateCtaButton(bIdx, 'style', e.target.value)}
                              className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-100"
                            >
                              <option value="blue">Xanh Dương (Blue)</option>
                              <option value="gold">Vàng Gold</option>
                              <option value="outline">Khung Viền (Outline)</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-slate-500">Vui lòng chọn một section bên trái để chỉnh sửa.</div>
          )}
        </div>
      </div>
    </div>
  );
}
