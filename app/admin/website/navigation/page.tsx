"use client";

import React, { useEffect, useState } from 'react';
import {
  Link as LinkIcon,
  Phone,
  MessageCircle,
  Facebook,
  Video,
  Mail,
  Plus,
  Trash2,
  Save,
  Globe,
  CheckCircle2,
} from 'lucide-react';
import { CMSData, NavigationItem, SiteContact } from '@/lib/types';

export default function NavigationManagerPage() {
  const [data, setData] = useState<CMSData | null>(null);
  const [navItems, setNavItems] = useState<NavigationItem[]>([]);
  const [contact, setContact] = useState<SiteContact | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/cms/content?mode=draft');
      if (res.ok) {
        const json = await res.json();
        setData(json.data);
        setNavItems(json.data.navigationItems || []);
        setContact(json.data.siteSettings?.contact || null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddNavItem = (location: 'header' | 'footer') => {
    const newItem: NavigationItem = {
      id: `nav_${Date.now()}`,
      location,
      title: 'Mục Menu Mới',
      target: '#services',
      isExternal: false,
      openInNewTab: false,
      enabled: true,
      order: navItems.length + 1,
    };
    setNavItems([...navItems, newItem]);
  };

  const updateNavItem = (id: string, field: keyof NavigationItem, val: any) => {
    setNavItems(
      navItems.map((item) => {
        if (item.id === id) {
          return { ...item, [field]: val };
        }
        return item;
      })
    );
  };

  const removeNavItem = (id: string) => {
    setNavItems(navItems.filter((i) => i.id !== id));
  };

  const handleSaveAll = async () => {
    if (!data || !contact) return;
    setSaving(true);
    setMsg('');

    const updatedData: CMSData = {
      ...data,
      navigationItems: navItems,
      siteSettings: {
        ...data.siteSettings,
        contact,
      },
    };

    try {
      const res = await fetch('/api/cms/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: updatedData }),
      });
      if (res.ok) {
        setMsg('✅ Đã lưu cấu hình Menu & Liên kết Social!');
        setTimeout(() => setMsg(''), 3000);
      }
    } catch (e) {
      setMsg('❌ Lỗi lưu cấu hình.');
    } finally {
      setSaving(false);
    }
  };

  const headerNavs = navItems.filter((i) => i.location === 'header');

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-6 rounded-2xl">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">
            <LinkIcon className="w-3.5 h-3.5" /> QUẢN LÝ MENU & KÊNH LIÊN LẠC SOCIAL
          </div>
          <h1 className="text-xl font-extrabold text-white">Cấu Hình Menu Điều Hướng & Hotline Zalo</h1>
          <p className="text-xs text-slate-400 mt-1">Các kênh liên lạc chưa cấu hình sẽ tự động ẩn trên website công khai.</p>
        </div>

        <div className="flex items-center gap-3">
          {msg && <span className="text-xs font-semibold text-amber-300 animate-fade-in">{msg}</span>}
          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold text-xs shadow-lg shadow-blue-600/20 flex items-center gap-2 transition cursor-pointer"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Đang lưu...' : 'Lưu Menu & Liên Kết'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Contact Channels */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
              <Phone className="w-4 h-4 text-amber-400" /> Kênh Liên Lạc Trực Tuyến & Hotline
            </h3>

            {contact && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Hotline Điện Thoại (*)</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={contact.phone}
                      onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                      placeholder="1900 6868"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-slate-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Số Điện Thoại Zalo (*)</label>
                  <div className="relative">
                    <MessageCircle className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={contact.zalo}
                      onChange={(e) => setContact({ ...contact, zalo: e.target.value })}
                      placeholder="0988 999 888"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-slate-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Đường Dẫn Facebook Page</label>
                  <div className="relative">
                    <Facebook className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={contact.facebook}
                      onChange={(e) => setContact({ ...contact, facebook: e.target.value })}
                      placeholder="https://facebook.com/..."
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Đường Dẫn TikTok</label>
                  <div className="relative">
                    <Video className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={contact.tiktok}
                      onChange={(e) => setContact({ ...contact, tiktok: e.target.value })}
                      placeholder="https://tiktok.com/@..."
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Email Hỗ Trợ</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={contact.email}
                      onChange={(e) => setContact({ ...contact, email: e.target.value })}
                      placeholder="cskh@minhthucmkt.vn"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Header Menu Items */}
        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-400" /> Danh Sách Menu Điều Hướng Header ({headerNavs.length})
            </h3>

            <button
              onClick={() => handleAddNavItem('header')}
              className="px-3 py-1.5 rounded-lg bg-blue-600/20 border border-blue-500/40 text-blue-300 text-xs font-semibold hover:bg-blue-600/30 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Thêm Mục Menu
            </button>
          </div>

          <div className="space-y-3">
            {headerNavs.map((nav, idx) => (
              <div key={nav.id} className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-amber-400">MỤC #{idx + 1}</span>
                  <button
                    onClick={() => removeNavItem(nav.id)}
                    className="text-rose-400 hover:text-rose-300 text-xs p-1 flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Xóa
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-1">Tên mục hiển thị</span>
                    <input
                      type="text"
                      value={nav.title}
                      onChange={(e) => updateNavItem(nav.id, 'title', e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-bold text-slate-100"
                    />
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 block mb-1">Section Đích hoặc URL</span>
                    <input
                      type="text"
                      value={nav.target}
                      onChange={(e) => updateNavItem(nav.id, 'target', e.target.value)}
                      placeholder="#services hoặc https://..."
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-100"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
