"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Package,
  Image as ImageIcon,
  Palette,
  Link as LinkIcon,
  Search,
  Code,
  History,
  LogOut,
  Globe,
  CheckCircle,
  Clock,
  ShieldAlert,
} from 'lucide-react';

interface AdminSidebarProps {
  user: { name: string; role: string; email: string } | null;
  statusInfo?: { status: 'draft' | 'published'; lastSavedAt: string; lastPublishedAt: string };
  onPublish?: () => void;
  publishing?: boolean;
}

export default function AdminSidebar({ user, statusInfo, onPublish, publishing }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  const navItems = [
    { label: 'Tổng quan', href: '/admin', icon: LayoutDashboard },
    { label: 'Nội dung trang', href: '/admin/website/content', icon: FileText },
    { label: 'Quản lý sản phẩm', href: '/admin/website/products', icon: Package },
    { label: 'Thư viện ảnh & video', href: '/admin/website/media', icon: ImageIcon },
    { label: 'Giao diện website', href: '/admin/website/theme', icon: Palette },
    { label: 'Menu & Liên kết', href: '/admin/website/navigation', icon: LinkIcon },
    { label: 'Quản lý SEO', href: '/admin/website/seo', icon: Search },
    { label: 'Mã theo dõi', href: '/admin/website/tracking', icon: Code },
    { label: 'Lịch sử & Xuất bản', href: '/admin/website/revisions', icon: History },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 text-slate-100 flex flex-col justify-between h-screen sticky top-0 z-40 select-none">
      {/* Brand Header */}
      <div>
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 to-blue-500 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-blue-500/20">
              V
            </div>
            <div>
              <div className="font-bold text-sm text-slate-100 leading-tight">Admin Portal</div>
              <div className="text-[11px] text-amber-400 font-medium">QUẢN LÝ WEBSITE</div>
            </div>
          </div>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            title="Xem website công khai"
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition"
          >
            <Globe className="w-4 h-4" />
          </a>
        </div>

        {/* Status Badge & Fast Publish */}
        {statusInfo && (
          <div className="m-3 p-3 rounded-xl bg-slate-850 border border-slate-800/80 text-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 font-medium">Trạng thái:</span>
              {statusInfo.status === 'draft' ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Clock className="w-3 h-3" /> Bản Nháp
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <CheckCircle className="w-3 h-3" /> Đã Xuất Bản
                </span>
              )}
            </div>

            {onPublish && (
              <button
                onClick={onPublish}
                disabled={publishing || statusInfo.status === 'published'}
                className={`w-full py-1.5 px-3 rounded-lg font-semibold text-xs transition shadow-sm flex items-center justify-center gap-1.5 ${
                  statusInfo.status === 'published'
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 shadow-amber-500/10'
                }`}
              >
                {publishing ? 'Đang xuất bản...' : statusInfo.status === 'published' ? 'Đã công bố mới nhất' : '🚀 Xuất Bản Website'}
              </button>
            )}
          </div>
        )}

        {/* Navigation Menu */}
        <nav className="p-2 space-y-1 overflow-y-auto max-h-[calc(100vh-280px)]">
          <div className="px-3 py-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            QUẢN LÝ WEBSITE
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Info & Logout */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-amber-400">
              {user?.name?.[0] || 'A'}
            </div>
            <div className="truncate">
              <div className="text-xs font-semibold text-slate-200 truncate">{user?.name || 'Tài khoản'}</div>
              <div className="text-[10px] text-slate-400 flex items-center gap-1 capitalize">
                <ShieldAlert className="w-2.5 h-2.5 text-amber-400" />
                {user?.role === 'admin' ? 'Quyền Admin' : 'Biên Tập Viên'}
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Đăng xuất"
            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
