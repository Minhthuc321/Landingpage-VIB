"use client";

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import AdminSidebar from './components/AdminSidebar';
import { Sparkles, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ name: string; role: string; email: string } | null>(null);
  const [statusInfo, setStatusInfo] = useState<{ status: 'draft' | 'published'; lastSavedAt: string; lastPublishedAt: string }>({
    status: 'published',
    lastSavedAt: '',
    lastPublishedAt: '',
  });
  const [publishing, setPublishing] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const isLoginPage = pathname === '/admin/login';

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (!res.ok) {
        if (!isLoginPage) router.push('/admin/login');
        setLoading(false);
        return;
      }
      const data = await res.json();
      if (data.authenticated) {
        setUser(data.user);
        fetchStatus();
      } else if (!isLoginPage) {
        router.push('/admin/login');
      }
    } catch (err) {
      if (!isLoginPage) router.push('/admin/login');
    } finally {
      setLoading(false);
    }
  };

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/cms/content?mode=draft');
      if (res.ok) {
        const data = await res.json();
        setStatusInfo({
          status: data.status || 'published',
          lastSavedAt: data.lastSavedAt || '',
          lastPublishedAt: data.lastPublishedAt || '',
        });
      }
    } catch (e) {}
  };

  useEffect(() => {
    checkAuth();
  }, [pathname]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handlePublish = async () => {
    setPublishing(true);
    try {
      const res = await fetch('/api/cms/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note: 'Xuất bản nhanh từ Admin Sidebar' }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('🚀 Xuất bản nội dung ra website thành công!');
        fetchStatus();
      } else {
        showToast(data.error || 'Xuất bản thất bại.', 'error');
      }
    } catch (err) {
      showToast('Lỗi mạng khi xuất bản.', 'error');
    } finally {
      setPublishing(false);
    }
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 text-amber-400 animate-spin" />
          <div className="text-xs font-semibold text-slate-400">Đang kiểm tra quyền truy cập...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans antialiased">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 animate-bounce">
          <div
            className={`px-4 py-3 rounded-xl shadow-2xl border text-xs font-semibold flex items-center gap-2.5 backdrop-blur-md ${
              toast.type === 'success'
                ? 'bg-emerald-950/90 border-emerald-500/30 text-emerald-200'
                : 'bg-rose-950/90 border-rose-500/30 text-rose-200'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-rose-400" />}
            {toast.message}
          </div>
        </div>
      )}

      {/* Sidebar */}
      <AdminSidebar user={user} statusInfo={statusInfo} onPublish={handlePublish} publishing={publishing} />

      {/* Main Admin Area */}
      <main className="flex-1 min-w-0 bg-slate-950 overflow-y-auto min-h-screen p-6 md:p-8">
        {children}
      </main>
    </div>
  );
}
