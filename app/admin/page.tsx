"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  Package,
  Image as ImageIcon,
  Palette,
  Search,
  History,
  Rocket,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import { CMSData, AuditLog } from '@/lib/types';

export default function AdminDashboardPage() {
  const [data, setData] = useState<CMSData | null>(null);
  const [status, setStatus] = useState<'draft' | 'published'>('published');
  const [lastSavedAt, setLastSavedAt] = useState('');
  const [lastPublishedAt, setLastPublishedAt] = useState('');
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/cms/content?mode=draft');
      if (res.ok) {
        const json = await res.json();
        setData(json.data);
        setStatus(json.status);
        setLastSavedAt(json.lastSavedAt);
        setLastPublishedAt(json.lastPublishedAt);
      }

      const revRes = await fetch('/api/cms/rollback');
      if (revRes.ok) {
        const revJson = await revRes.json();
        setAuditLogs(revJson.auditLogs || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Trạng Thái CMS',
      value: status === 'draft' ? 'Bản Nháp' : 'Đã Xuất Bản',
      subtitle: lastPublishedAt ? `Xuất bản gần nhất: ${new Date(lastPublishedAt).toLocaleTimeString('vi-VN')} (${new Date(lastPublishedAt).toLocaleDateString('vi-VN')})` : 'Chưa xuất bản',
      icon: status === 'draft' ? Clock : CheckCircle2,
      color: status === 'draft' ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    },
    {
      title: 'Section Trang Web',
      value: `${data?.sections?.length || 0} Khu Vực`,
      subtitle: 'Header, Hero, Services, Calculator, Form, FAQ, Footer...',
      icon: FileText,
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
      href: '/admin/website/content',
    },
    {
      title: 'Sản Phẩm Tài Chính',
      value: `${data?.products?.filter((p) => !p.isDeleted).length || 0} Sản Phẩm`,
      subtitle: 'Thẻ tín dụng, Vay mua nhà, Vay mua xe',
      icon: Package,
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
      href: '/admin/website/products',
    },
    {
      title: 'Thư Viện Media',
      value: `${data?.mediaAssets?.filter((m) => !m.isDeleted).length || 0} Tệp`,
      subtitle: 'Ảnh WebP/AVIF, PNG, SVG & Video MP4/External',
      icon: ImageIcon,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      href: '/admin/website/media',
    },
  ];

  const quickLinks = [
    { title: 'Nội dung trang', desc: 'Chỉnh sửa tiêu đề, mô tả, bật/tắt 16+ khu vực', icon: FileText, href: '/admin/website/content', color: 'from-blue-600/20 to-blue-800/10 border-blue-500/30' },
    { title: 'Quản lý sản phẩm', desc: 'Thêm/sửa sản phẩm Thẻ tín dụng, Vay nhà, Vay xe', icon: Package, href: '/admin/website/products', color: 'from-purple-600/20 to-purple-800/10 border-purple-500/30' },
    { title: 'Thư viện ảnh & video', desc: 'Tải lên kéo thả, alt text, WebP/AVIF & Video player', icon: ImageIcon, href: '/admin/website/media', color: 'from-amber-600/20 to-amber-800/10 border-amber-500/30' },
    { title: 'Giao diện & Token', desc: 'Hệ màu Navy, Gold, Font chữ & Design Tokens', icon: Palette, href: '/admin/website/theme', color: 'from-pink-600/20 to-pink-800/10 border-pink-500/30' },
    { title: 'SEO & Tuyên bố VIB', desc: 'Meta tags, OG Image & Tuyên bố VIB khóa bảo vệ', icon: Search, href: '/admin/website/seo', color: 'from-emerald-600/20 to-emerald-800/10 border-emerald-500/30' },
    { title: 'Lịch sử & Xuất bản', desc: 'So sánh bản nháp, xuất bản & khôi phục lịch sử', icon: History, href: '/admin/website/revisions', color: 'from-indigo-600/20 to-indigo-800/10 border-indigo-500/30' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-slate-800 p-8 shadow-2xl">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold mb-3 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Chào mừng quay trở lại Admin Portal
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Quản Trị Website Dịch Vụ Tài Chính
            </h1>
            <p className="text-xs md:text-sm text-slate-400 mt-2 max-w-2xl leading-relaxed">
              Hệ thống CMS toàn diện cho phép chỉnh sửa nội dung, sản phẩm, thư viện media, giao diện và cấu hình SEO trực tiếp mà không cần can thiệp mã nguồn.
            </p>
          </div>

          <a
            href="https://vib.minhthucmkt.vn"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 flex items-center gap-2 transition shrink-0"
          >
            <span>Xem Website Công Khai</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-400">{card.title}</span>
                <div className={`p-2 rounded-xl border ${card.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-xl font-extrabold text-white mb-1">{card.value}</div>
                <div className="text-[11px] text-slate-500 truncate">{card.subtitle}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Links Grid */}
      <div>
        <h2 className="text-base font-bold text-slate-200 mb-4 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-amber-400" /> Danh Mục Quản Lý Trọng Điểm
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickLinks.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Link
                key={idx}
                href={item.href}
                className={`group p-5 rounded-2xl bg-gradient-to-br ${item.color} bg-slate-900/60 border hover:border-blue-500/50 transition-all shadow-md hover:shadow-xl hover:-translate-y-0.5 flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-200 group-hover:text-blue-400 transition">
                      <Icon className="w-5 h-5" />
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-slate-200 transition" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-100 group-hover:text-amber-400 transition">{item.title}</h3>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{item.desc}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Audit Logs Timeline */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2">
          <History className="w-4 h-4 text-blue-400" /> Lịch Sử Thao Tác Hệ Thống (Audit Logs)
        </h3>

        <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
          {auditLogs.length === 0 ? (
            <div className="text-xs text-slate-500 py-4 text-center">Chưa có lịch sử thao tác.</div>
          ) : (
            auditLogs.map((log) => (
              <div key={log.id} className="p-3 rounded-xl bg-slate-950/60 border border-slate-850 text-xs flex items-start justify-between gap-4">
                <div>
                  <div className="font-semibold text-slate-200">{log.details}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Thực hiện bởi: {log.userName}</div>
                </div>
                <div className="text-[10px] text-slate-500 font-mono shrink-0">
                  {new Date(log.timestamp).toLocaleString('vi-VN')}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
