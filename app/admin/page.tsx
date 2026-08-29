"use client";

import React, { useState, useEffect } from 'react';
import {
  SlidersHorizontal,
  BarChart3,
  Link as LinkIcon,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Sparkles,
  Award,
  RefreshCw,
  TrendingUp,
  Globe,
  DollarSign,
  Search,
  ExternalLink,
  Lock,
  Unlock,
  ShieldCheck,
  Save,
  X,
  Puzzle,
  LogOut,
  UserCheck,
  Palette,
  Type,
  Layout,
  Phone,
  Image as ImageIcon
} from 'lucide-react';

interface ToolItem {
  id: string;
  name: string;
  slug: string;
  category: string;
  official_url: string;
  affiliate_url: string;
  commission: string;
  status: 'active' | 'disabled';
  rating: number;
}

interface PluginItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon_url: string;
  badge_text: string;
  type: 'iframe' | 'affiliate_link' | 'script' | 'widget';
  external_url: string;
  status: 'active' | 'disabled';
}

interface ThemeConfig {
  brand_title: string;
  hotline: string;
  topbar_text: string;
  cta_header_text: string;
  primary_blue: string;
  primary_blue_light: string;
  accent_gold: string;
  dark_bg: string;
  hero_badge: string;
  hero_title: string;
  hero_subtitle: string;
  hero_cta_main: string;
  hero_cta_sub: string;
  hero_image: string;
  stat_1_val: string;
  stat_1_lbl: string;
  stat_2_val: string;
  stat_2_lbl: string;
  stat_3_val: string;
  stat_3_lbl: string;
  footer_copyright: string;
  footer_address: string;
}

const DEFAULT_THEME: ThemeConfig = {
  brand_title: 'TÀI CHÍNH SOLUTION VIB',
  hotline: '1900 6868 - 0988 999 888',
  topbar_text: '⚡ TƯ VẤN HỒ SƠ TÀI CHÍNH DUYỆT NHANH TRONG 15 PHÚT',
  cta_header_text: 'TƯ VẤN MIỄN PHÍ',
  primary_blue: '#1e40af',
  primary_blue_light: '#2563eb',
  accent_gold: '#f59e0b',
  dark_bg: '#0f172a',
  hero_badge: '🛡️ GIẢI PHÁP TÀI CHÍNH DÂN DỤNG & DOANH NGHIỆP',
  hero_title: 'MỞ THẺ TÍN DỤNG & VAY VỐN HẠN MỨC CAO VIB',
  hero_subtitle: 'Hỗ trợ mở thẻ tín dụng cashback hoàn tiền tới 15%, vay tiêu dùng, vay mua nhà/xe với lãi suất ưu đãi chỉ từ 0.6%/tháng. Thủ tục tối giản, giải ngân nhanh trong ngày.',
  hero_cta_main: 'ĐĂNG KÝ HỒ SƠ NGAY',
  hero_cta_sub: 'TÍNH LÃI SUẤT',
  hero_image: 'https://images.unsplash.com/photo-1556742049-0a67daf64f42?q=80&w=800&auto=format&fit=crop',
  stat_1_val: '10,000+',
  stat_1_lbl: 'Hồ Sơ Đã Duyệt',
  stat_2_val: '15 Phút',
  stat_2_lbl: 'Xử Lý Hồ Sơ',
  stat_3_val: '0 VNĐ',
  stat_3_lbl: 'Phí Tư Vấn ban đầu',
  footer_copyright: '© 2026 Tài Chính Solution VIB. Tất cả quyền được bảo lưu.',
  footer_address: 'Địa chỉ văn phòng: Tòa nhà Landmark Financial, Quận Cầu Giấy, Hà Nội. Hotline: 1900 6868'
};

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'analytics' | 'appearance' | 'tools' | 'plugins' | 'affiliate'>('appearance');

  // Auth State
  const [username, setUsername] = useState('admin@minhthucmkt.vn');
  const [password, setPassword] = useState('MinhThuc2026@Admin');
  const [loginError, setLoginError] = useState('');

  // Theme Config State
  const [theme, setTheme] = useState<ThemeConfig>(DEFAULT_THEME);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Sample Tools & Plugins
  const [tools, setTools] = useState<ToolItem[]>([
    { id: '1', name: 'Mở Thẻ Tín Dụng VIB Cashback', slug: 'vib-cashback', category: 'Credit Card', official_url: 'https://vib.com.vn', affiliate_url: 'https://vib.minhthucmkt.vn/go/vib-cashback', commission: '500,000 VNĐ / thẻ', status: 'active', rating: 4.9 },
    { id: '2', name: 'Vay Tiêu Dùng Hạn Mức 500Tr', slug: 'vay-tieu-dung', category: 'Personal Loan', official_url: 'https://vib.com.vn', affiliate_url: 'https://vib.minhthucmkt.vn/go/vay-tieu-dung', commission: '1.5% giải ngân', status: 'active', rating: 4.8 },
    { id: '3', name: 'Đáo Hạn & Rút Tiền Thẻ 24/7', slug: 'dao-han-the', category: 'Card Cashout', official_url: 'https://vib.minhthucmkt.vn', affiliate_url: 'https://vib.minhthucmkt.vn/go/dao-han-the', commission: '1.2% giao dịch', status: 'active', rating: 4.9 },
    { id: '4', name: 'Gói Vay Mua Nhà Lãi Suất 0.6%', slug: 'vay-mua-nha', category: 'Mortgage Loan', official_url: 'https://vib.com.vn', affiliate_url: 'https://vib.minhthucmkt.vn/go/vay-mua-nha', commission: '0.8% hợp đồng', status: 'active', rating: 4.7 }
  ]);

  const [plugins, setPlugins] = useState<PluginItem[]>([
    { id: 'p1', name: 'ChatGPT Plus Assistant Widget', slug: 'chatgpt-widget', description: 'Trợ lý AI tư vấn gói vay & thẻ tín dụng tự động', icon_url: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=128&auto=format&fit=crop&q=80', badge_text: 'HOT AI', type: 'iframe', external_url: 'https://chatgpt.com', status: 'active' },
    { id: 'p2', name: 'Remotion Financial Video Gen', slug: 'remotion-fin-video', description: 'Công cụ dựng video quảng cáo gói vay tài chính', icon_url: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=128&auto=format&fit=crop&q=80', badge_text: 'PRO TOOL', type: 'affiliate_link', external_url: 'https://remotion.dev', status: 'active' },
    { id: 'p3', name: 'OpenClaw Credit Checker', slug: 'openclaw-cic', description: 'Cổng kiểm tra điểm tín dụng CIC tự động', icon_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&auto=format&fit=crop&q=80', badge_text: 'GATEWAY', type: 'widget', external_url: 'https://vib.minhthucmkt.vn', status: 'active' }
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<ToolItem | null>(null);
  const [toolForm, setToolForm] = useState<Partial<ToolItem>>({
    name: '', slug: '', category: 'Credit Card', official_url: 'https://', affiliate_url: 'https://', commission: '20%', status: 'active', rating: 4.8
  });

  const [isAddPluginModalOpen, setIsAddPluginModalOpen] = useState(false);
  const [editingPlugin, setEditingPlugin] = useState<PluginItem | null>(null);
  const [pluginForm, setPluginForm] = useState<Partial<PluginItem>>({
    name: '', slug: '', description: '', icon_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&auto=format&fit=crop&q=80', badge_text: 'HOT AI', type: 'iframe', external_url: 'https://', status: 'active'
  });

  useEffect(() => {
    const token = localStorage.getItem('vib_admin_token');
    if (token === 'vib_admin_session_token_2026') {
      setIsAuthenticated(true);
    }
    const savedTheme = localStorage.getItem('vib_theme_settings');
    if (savedTheme) {
      try {
        setTheme(JSON.parse(savedTheme));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if ((username === 'admin@minhthucmkt.vn' || username === 'admin') && password === 'MinhThuc2026@Admin') {
      localStorage.setItem('vib_admin_token', 'vib_admin_session_token_2026');
      setIsAuthenticated(true);
    } else {
      setLoginError('Tên đăng nhập hoặc mật khẩu không chính xác');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('vib_admin_token');
    setIsAuthenticated(false);
  };

  const handleSaveTheme = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('vib_theme_settings', JSON.stringify(theme));
    setSaveSuccessMsg('🎉 Đã lưu và cập nhật cấu hình giao diện & màu sắc thành công!');
    setTimeout(() => setSaveSuccessMsg(''), 4000);
  };

  const handleResetTheme = () => {
    if (confirm('Khôi phục giao diện & màu sắc về mặc định ban đầu?')) {
      setTheme(DEFAULT_THEME);
      localStorage.removeItem('vib_theme_settings');
      setSaveSuccessMsg('Đã khôi phục giao diện về mặc định.');
      setTimeout(() => setSaveSuccessMsg(''), 4000);
    }
  };

  const handleSaveTool = (e: React.FormEvent) => {
    e.preventDefault();
    if (!toolForm.name || !toolForm.slug) return;
    if (editingTool) {
      setTools(tools.map(t => t.id === editingTool.id ? { ...t, ...toolForm } as ToolItem : t));
    } else {
      const newTool: ToolItem = {
        id: Date.now().toString(),
        name: toolForm.name || '',
        slug: toolForm.slug || '',
        category: toolForm.category || 'Credit Card',
        official_url: toolForm.official_url || 'https://',
        affiliate_url: toolForm.affiliate_url || 'https://',
        commission: toolForm.commission || '20%',
        status: toolForm.status || 'active',
        rating: toolForm.rating || 4.8
      };
      setTools([newTool, ...tools]);
    }
    setIsAddModalOpen(false);
    setEditingTool(null);
  };

  const handleDeleteTool = (id: string) => {
    if (confirm('Bạn có chắc muốn xóa sản phẩm dịch vụ này?')) {
      setTools(tools.filter(t => t.id !== id));
    }
  };

  const handleSavePlugin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pluginForm.name || !pluginForm.slug) return;
    if (editingPlugin) {
      setPlugins(plugins.map(p => p.id === editingPlugin.id ? { ...p, ...pluginForm } as PluginItem : p));
    } else {
      const newPlugin: PluginItem = {
        id: Date.now().toString(),
        name: pluginForm.name || '',
        slug: pluginForm.slug || '',
        description: pluginForm.description || '',
        icon_url: pluginForm.icon_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&auto=format&fit=crop&q=80',
        badge_text: pluginForm.badge_text || 'HOT AI',
        type: pluginForm.type || 'iframe',
        external_url: pluginForm.external_url || 'https://',
        status: pluginForm.status || 'active'
      };
      setPlugins([newPlugin, ...plugins]);
    }
    setIsAddPluginModalOpen(false);
    setEditingPlugin(null);
  };

  const handleDeletePlugin = (id: string) => {
    if (confirm('Bạn có chắc muốn xóa Plugin này?')) {
      setPlugins(plugins.filter(p => p.id !== id));
    }
  };

  // LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-200 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
            <Lock className="w-32 h-32 text-indigo-400" />
          </div>

          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 mb-4">
              <SlidersHorizontal className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black text-white">Đăng Nhập Admin VIB</h1>
            <p className="text-xs text-slate-400 mt-2">Trang Quản Trị Hệ Thống <code>vib.minhthucmkt.vn/admin</code></p>
          </div>

          <div className="bg-slate-950/80 border border-indigo-500/20 rounded-2xl p-4 mb-6">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs mb-2">
              <UserCheck className="w-4 h-4" />
              <span>Tài khoản Admin hệ thống:</span>
            </div>
            <p className="text-xs text-slate-300">Email: <strong className="text-white">admin@minhthucmkt.vn</strong> (hoặc <strong className="text-white">admin</strong>)</p>
            <p className="text-xs text-slate-300 mt-1">Mật khẩu: <strong className="text-amber-400">MinhThuc2026@Admin</strong></p>
          </div>

          {loginError && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold">
              ⚠️ {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Tên đăng nhập / Email Admin</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="admin@minhthucmkt.vn"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Mật khẩu</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
            >
              <Unlock className="w-4 h-4" />
              <span>Đăng Nhập Quản Trị</span>
            </button>
          </form>

          <div className="mt-6 text-center">
            <a href="/" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
              ← Về trang chủ vib.minhthucmkt.vn
            </a>
          </div>
        </div>
      </div>
    );
  }

  // DASHBOARD SCREEN
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 pb-24">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/90 sticky top-0 z-20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" target="_blank" rel="noreferrer" className="text-xs text-slate-400 hover:text-white px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 flex items-center gap-1">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Xem trang chủ</span>
            </a>
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-indigo-400" />
              <h1 className="text-lg font-bold text-white">Quản Trị vib.minhthucmkt.vn</h1>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-500/20 text-indigo-300 rounded border border-indigo-500/30">
                Admin Panel
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 text-xs font-semibold text-rose-400 hover:text-rose-300 bg-rose-500/10 border border-rose-500/20 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-4 mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('appearance')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'appearance' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Palette className="w-4 h-4 text-amber-400" />
            <span>🎨 Chỉnh Sửa Giao Diện, Text & Màu Sắc</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'analytics' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Thống kê & Click Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('tools')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'tools' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Quản lý Sản Phẩm ({tools.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('plugins')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'plugins' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Puzzle className="w-4 h-4 text-emerald-400" />
            <span>Plugins & Công Cụ Ngoài ({plugins.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('affiliate')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'affiliate' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <LinkIcon className="w-4 h-4" />
            <span>Quản lý Link Affiliate</span>
          </button>
        </div>

        {saveSuccessMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-sm font-semibold flex items-center justify-between">
            <span>{saveSuccessMsg}</span>
            <a href="/" target="_blank" className="px-3 py-1 bg-emerald-600 text-white text-xs font-bold rounded-lg flex items-center gap-1">
              <span>Xem Thay Đổi</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}

        {/* TAB 1: APPEARANCE & THEME EDITING */}
        {activeTab === 'appearance' && (
          <form onSubmit={handleSaveTheme} className="space-y-8">
            {/* Top Bar Actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Palette className="w-5 h-5 text-amber-400" />
                  <span>Trình Chỉnh Sửa Giao Diện & Màu Sắc</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">Thay đổi logo, màu sắc chủ đạo (hex/picker), tiêu đề, kịch bản văn bản & chân trang trực tiếp trên <code>vib.minhthucmkt.vn</code>.</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleResetTheme}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-all"
                >
                  Mặc Định
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>Lưu Giao Diện Mới</span>
                </button>
              </div>
            </div>

            {/* SECTION A: COLOR PALETTE */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2 text-indigo-400">
                <Palette className="w-4 h-4" />
                <span>1. Bảng Màu Chủ Đạo (Color Theme)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">Màu Xanh Đậm (Primary Blue)</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={theme.primary_blue}
                      onChange={(e) => setTheme({ ...theme, primary_blue: e.target.value })}
                      className="w-10 h-10 rounded-xl bg-transparent border-0 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={theme.primary_blue}
                      onChange={(e) => setTheme({ ...theme, primary_blue: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">Màu Xanh Sáng (Primary Light)</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={theme.primary_blue_light}
                      onChange={(e) => setTheme({ ...theme, primary_blue_light: e.target.value })}
                      className="w-10 h-10 rounded-xl bg-transparent border-0 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={theme.primary_blue_light}
                      onChange={(e) => setTheme({ ...theme, primary_blue_light: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">Màu Vàng Kim (Accent Gold)</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={theme.accent_gold}
                      onChange={(e) => setTheme({ ...theme, accent_gold: e.target.value })}
                      className="w-10 h-10 rounded-xl bg-transparent border-0 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={theme.accent_gold}
                      onChange={(e) => setTheme({ ...theme, accent_gold: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">Màu Nền Tối (Dark Slate)</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={theme.dark_bg}
                      onChange={(e) => setTheme({ ...theme, dark_bg: e.target.value })}
                      className="w-10 h-10 rounded-xl bg-transparent border-0 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={theme.dark_bg}
                      onChange={(e) => setTheme({ ...theme, dark_bg: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION B: BRANDING & HEADER */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2 text-indigo-400">
                <Type className="w-4 h-4" />
                <span>2. Thương Hiệu, Thanh Thông Báo & Header</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Tên Thương Hiệu Logo (Brand Title)</label>
                  <input
                    type="text"
                    value={theme.brand_title}
                    onChange={(e) => setTheme({ ...theme, brand_title: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Hotline Hỗ Trợ 24/7</label>
                  <input
                    type="text"
                    value={theme.hotline}
                    onChange={(e) => setTheme({ ...theme, hotline: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Thông Báo Trên Cùng (Topbar Bar)</label>
                  <input
                    type="text"
                    value={theme.topbar_text}
                    onChange={(e) => setTheme({ ...theme, topbar_text: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Nút Nút Tư Vấn Header CTA</label>
                  <input
                    type="text"
                    value={theme.cta_header_text}
                    onChange={(e) => setTheme({ ...theme, cta_header_text: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white"
                  />
                </div>
              </div>
            </div>

            {/* SECTION C: HERO BANNER CONTENT */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2 text-indigo-400">
                <Layout className="w-4 h-4" />
                <span>3. Tiêu Đề & Nội Dung Banner Hero (Hero Section)</span>
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Thẻ Nhãn Nổi Bật (Hero Badge)</label>
                  <input
                    type="text"
                    value={theme.hero_badge}
                    onChange={(e) => setTheme({ ...theme, hero_badge: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Tiêu Đề Lớn (Hero Main Title)</label>
                  <input
                    type="text"
                    value={theme.hero_title}
                    onChange={(e) => setTheme({ ...theme, hero_title: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Mô Tả Chi Tiết (Hero Subtitle)</label>
                  <textarea
                    rows={3}
                    value={theme.hero_subtitle}
                    onChange={(e) => setTheme({ ...theme, hero_subtitle: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Text Nút Đăng Ký (CTA 1)</label>
                    <input
                      type="text"
                      value={theme.hero_cta_main}
                      onChange={(e) => setTheme({ ...theme, hero_cta_main: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Text Nút Lãi Suất (CTA 2)</label>
                    <input
                      type="text"
                      value={theme.hero_cta_sub}
                      onChange={(e) => setTheme({ ...theme, hero_cta_sub: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">URL Hình Ảnh Thẻ Display</label>
                    <input
                      type="text"
                      value={theme.hero_image}
                      onChange={(e) => setTheme({ ...theme, hero_image: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION D: STATS & FOOTER */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2 text-indigo-400">
                <BarChart3 className="w-4 h-4" />
                <span>4. Thống Kê Counter & Chân Trang Footer</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Stat 1 (Số / Nhãn)</label>
                  <div className="flex gap-2">
                    <input type="text" value={theme.stat_1_val} onChange={(e) => setTheme({ ...theme, stat_1_val: e.target.value })} className="w-1/2 bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white" />
                    <input type="text" value={theme.stat_1_lbl} onChange={(e) => setTheme({ ...theme, stat_1_lbl: e.target.value })} className="w-1/2 bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Stat 2 (Số / Nhãn)</label>
                  <div className="flex gap-2">
                    <input type="text" value={theme.stat_2_val} onChange={(e) => setTheme({ ...theme, stat_2_val: e.target.value })} className="w-1/2 bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white" />
                    <input type="text" value={theme.stat_2_lbl} onChange={(e) => setTheme({ ...theme, stat_2_lbl: e.target.value })} className="w-1/2 bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Stat 3 (Số / Nhãn)</label>
                  <div className="flex gap-2">
                    <input type="text" value={theme.stat_3_val} onChange={(e) => setTheme({ ...theme, stat_3_val: e.target.value })} className="w-1/2 bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white" />
                    <input type="text" value={theme.stat_3_lbl} onChange={(e) => setTheme({ ...theme, stat_3_lbl: e.target.value })} className="w-1/2 bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Bản Quyền (Footer Copyright)</label>
                  <input type="text" value={theme.footer_copyright} onChange={(e) => setTheme({ ...theme, footer_copyright: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Địa Chỉ Văn Phòng (Footer Address)</label>
                  <input type="text" value={theme.footer_address} onChange={(e) => setTheme({ ...theme, footer_address: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white" />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all"
              >
                <Save className="w-5 h-5" />
                <span>Lưu Tất Cả Cấu Hình Giao Diện & Màu Sắc</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                <span className="text-xs text-slate-400 font-medium">Tổng sản phẩm & Thẻ</span>
                <p className="text-2xl sm:text-3xl font-extrabold text-white mt-1">{tools.length}</p>
                <span className="text-[11px] text-emerald-400 mt-1 block">Hoạt động: {tools.filter(t => t.status === 'active').length}</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                <span className="text-xs text-slate-400 font-medium">Plugins tích hợp</span>
                <p className="text-2xl sm:text-3xl font-extrabold text-indigo-400 mt-1">{plugins.length}</p>
                <span className="text-[11px] text-slate-400 mt-1 block">Widget & AI Assistant</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                <span className="text-xs text-slate-400 font-medium">Tổng lượt Clicks Tư vấn</span>
                <p className="text-2xl sm:text-3xl font-extrabold text-amber-400 mt-1">1,420</p>
                <span className="text-[11px] text-emerald-400 mt-1 block">Form & Zalo Conversion</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                <span className="text-xs text-slate-400 font-medium">Doanh thu hoa hồng dự kiến</span>
                <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mt-1">18,500,000 VNĐ</p>
                <span className="text-[11px] text-purple-300 mt-1 block">Tháng này</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: TOOLS MANAGEMENT */}
        {activeTab === 'tools' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
              <div>
                <h3 className="text-base font-bold text-white mb-1">Danh sách Sản phẩm & Dịch vụ Tài chính</h3>
                <p className="text-xs text-slate-400">Quản lý thẻ tín dụng, gói vay tiêu dùng, vay mua nhà và dịch vụ đáo hạn thẻ.</p>
              </div>

              <button
                onClick={() => { setEditingTool(null); setIsAddModalOpen(true); }}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg flex items-center gap-1.5 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm Sản Phẩm Mới</span>
              </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400">
                  <tr>
                    <th className="p-4 font-semibold">Tên Sản Phẩm</th>
                    <th className="p-4 font-semibold">Danh Mục</th>
                    <th className="p-4 font-semibold">Mức Hoa Hồng</th>
                    <th className="p-4 font-semibold">Trạng Thái</th>
                    <th className="p-4 font-semibold text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {tools.map(t => (
                    <tr key={t.id} className="hover:bg-slate-800/40">
                      <td className="p-4 font-bold text-white">{t.name}</td>
                      <td className="p-4 text-slate-300">{t.category}</td>
                      <td className="p-4 text-emerald-400 font-semibold">{t.commission}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${t.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                          {t.status === 'active' ? 'Hoạt động' : 'Tắt'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button onClick={() => { setEditingTool(t); setToolForm(t); setIsAddModalOpen(true); }} className="p-1.5 text-slate-400 hover:text-white mr-2">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeleteTool(t.id)} className="p-1.5 text-slate-400 hover:text-rose-400">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: PLUGINS MANAGEMENT */}
        {activeTab === 'plugins' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
              <div>
                <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
                  <Puzzle className="w-5 h-5 text-emerald-400" />
                  <span>Quản lý Plugins & Công Cụ Ngoài</span>
                </h3>
                <p className="text-xs text-slate-400">Tạo thêm và nhúng công cụ AI bên ngoài (ChatGPT, Remotion, CIC Gateway).</p>
              </div>

              <button
                onClick={() => { setEditingPlugin(null); setIsAddPluginModalOpen(true); }}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg flex items-center gap-1.5 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm Plugin Mới</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plugins.map(p => (
                <div key={p.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <img src={p.icon_url} alt={p.name} className="w-10 h-10 rounded-xl object-cover" />
                        <div>
                          <h4 className="font-bold text-white text-sm">{p.name}</h4>
                          <span className="text-[10px] text-slate-400 font-mono">/{p.slug}</span>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {p.badge_text}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mb-4">{p.description}</p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                    <span className="text-[10px] font-bold text-emerald-400">● {p.type}</span>
                    <div className="flex items-center gap-2">
                      <button onClick={() => { setEditingPlugin(p); setPluginForm(p); setIsAddPluginModalOpen(true); }} className="p-1.5 text-slate-400 hover:text-white">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeletePlugin(p.id)} className="p-1.5 text-slate-400 hover:text-rose-400">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: AFFILIATE LINKS */}
        {activeTab === 'affiliate' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-base font-bold text-white mb-2">Đường dẫn Affiliate Ngầm</h3>
            <p className="text-xs text-slate-400 mb-4">Tất cả các lượt chuyển hướng qua `/go/:slug` tự động ghi nhận hoa hồng chuẩn xác.</p>
          </div>
        )}
      </div>

      {/* ADD/EDIT TOOL MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl p-6 text-slate-200">
            <div className="flex justify-between items-center pb-4 border-b border-slate-800 mb-4">
              <h3 className="font-bold text-white">{editingTool ? 'Sửa Sản Phẩm' : 'Thêm Sản Phẩm Mới'}</h3>
              <button onClick={() => setIsAddModalOpen(false)}><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSaveTool} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Tên Sản Phẩm *</label>
                <input type="text" required value={toolForm.name || ''} onChange={e => setToolForm({ ...toolForm, name: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Slug URL *</label>
                <input type="text" required value={toolForm.slug || ''} onChange={e => setToolForm({ ...toolForm, slug: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono" />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Mức Hoa Hồng</label>
                <input type="text" value={toolForm.commission || ''} onChange={e => setToolForm({ ...toolForm, commission: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 bg-slate-800 rounded-xl">Hủy</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 rounded-xl font-bold text-white">Lưu</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD/EDIT PLUGIN MODAL */}
      {isAddPluginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl p-6 text-slate-200">
            <div className="flex justify-between items-center pb-4 border-b border-slate-800 mb-4">
              <h3 className="font-bold text-white">{editingPlugin ? 'Sửa Plugin' : 'Thêm Plugin Mới'}</h3>
              <button onClick={() => setIsAddPluginModalOpen(false)}><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSavePlugin} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Tên Plugin *</label>
                <input type="text" required value={pluginForm.name || ''} onChange={e => setPluginForm({ ...pluginForm, name: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Slug *</label>
                <input type="text" required value={pluginForm.slug || ''} onChange={e => setPluginForm({ ...pluginForm, slug: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono" />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Mô tả</label>
                <input type="text" value={pluginForm.description || ''} onChange={e => setPluginForm({ ...pluginForm, description: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">URL Liên Kết Ngoài</label>
                <input type="url" value={pluginForm.external_url || ''} onChange={e => setPluginForm({ ...pluginForm, external_url: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono" />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button type="button" onClick={() => setIsAddPluginModalOpen(false)} className="px-4 py-2 bg-slate-800 rounded-xl">Hủy</button>
                <button type="submit" className="px-4 py-2 bg-emerald-600 rounded-xl font-bold text-white">Lưu Plugin</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
