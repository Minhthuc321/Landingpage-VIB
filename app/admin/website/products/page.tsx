"use client";

import React, { useEffect, useState } from 'react';
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Star,
  Save,
  Layers,
  Sparkles,
  CheckCircle2,
  Tag,
  Search,
} from 'lucide-react';
import { ProductItem, ProductCategory, CMSData } from '@/lib/types';

export default function ProductManagerPage() {
  const [data, setData] = useState<CMSData | null>(null);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/cms/content?mode=draft');
      if (res.ok) {
        const json = await res.json();
        setData(json.data);
        setProducts(json.data.products || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateNew = () => {
    const newProd: ProductItem = {
      id: '',
      category: 'credit_card',
      title: 'Sản Phẩm Mới',
      shortDescription: 'Mô tả ngắn...',
      fullDescription: 'Mô tả chi tiết...',
      icon: 'fa-credit-card',
      imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=800&auto=format&fit=crop',
      benefits: ['Miễn phí phí thường niên năm đầu', 'Duyệt hồ sơ siêu tốc'],
      featured: true,
      enabled: true,
      order: products.length + 1,
      ctaText: 'ĐĂNG KÝ NGAY',
      ctaAction: 'form',
      isDeleted: false,
    };
    setEditingProduct(newProd);
  };

  const handleSaveProduct = async () => {
    if (!editingProduct || !data) return;
    setSaving(true);
    setMsg('');

    try {
      const res = await fetch('/api/cms/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product: editingProduct }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setMsg('✅ Đã lưu sản phẩm thành công!');
        fetchProducts();
        setEditingProduct(null);
        setTimeout(() => setMsg(''), 3000);
      } else {
        setMsg(`❌ Lỗi: ${json.error || 'Không thể lưu.'}`);
      }
    } catch (e) {
      setMsg('❌ Lỗi kết nối.');
    } finally {
      setSaving(false);
    }
  };

  const handleSoftDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa mềm sản phẩm này?')) return;
    try {
      const res = await fetch(`/api/cms/products?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMsg('✅ Đã xóa mềm sản phẩm.');
        fetchProducts();
        setTimeout(() => setMsg(''), 3000);
      }
    } catch (e) {}
  };

  const categoryLabels: Record<ProductCategory, string> = {
    credit_card: 'Thẻ Tín Dụng',
    home_loan: 'Vay Mua Nhà / Thế Chấp',
    car_loan: 'Vay Mua Ô Tô',
  };

  const activeProducts = products.filter((p) => !p.isDeleted);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-6 rounded-2xl">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-wider mb-1">
            <Package className="w-3.5 h-3.5" /> QUẢN LÝ SẢN PHẨM TÀI CHÍNH
          </div>
          <h1 className="text-xl font-extrabold text-white">Danh Mục Thẻ Tín Dụng & Vay Vốn Cốt Lõi</h1>
          <p className="text-xs text-slate-400 mt-1">3 nhóm mặc định: Thẻ tín dụng, Vay mua nhà/thế chấp, Vay mua ô tô.</p>
        </div>

        <div className="flex items-center gap-3">
          {msg && <span className="text-xs font-semibold text-amber-300 animate-fade-in">{msg}</span>}
          <button
            onClick={handleCreateNew}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 flex items-center gap-2 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Thêm Sản Phẩm Mới
          </button>
        </div>
      </div>

      {/* Grid of Existing Products */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {activeProducts.map((prod) => (
          <div key={prod.id} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4">
            <div>
              <div className="relative rounded-xl overflow-hidden mb-3 h-40 bg-slate-950 border border-slate-800">
                <img src={prod.imageUrl} alt={prod.title} className="w-full h-full object-cover" />
                <span className="absolute top-2 left-2 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-800 text-[10px] font-bold text-amber-400">
                  {categoryLabels[prod.category]}
                </span>
                {prod.featured && (
                  <span className="absolute top-2 right-2 p-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                  </span>
                )}
              </div>

              <h3 className="text-base font-bold text-white mb-1">{prod.title}</h3>
              <p className="text-xs text-slate-400 line-clamp-2 mb-3">{prod.shortDescription}</p>

              <div className="space-y-1.5">
                {prod.benefits?.map((b, i) => (
                  <div key={i} className="text-[11px] text-slate-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-amber-400 shrink-0" />
                    <span className="truncate">{b}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-800 pt-3 flex items-center justify-between">
              <span className="text-[10px] text-slate-500 font-mono">ID: {prod.id}</span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditingProduct(prod)}
                  className="px-3 py-1.5 rounded-lg bg-blue-600/20 border border-blue-500/40 text-blue-300 text-xs font-semibold hover:bg-blue-600/30 flex items-center gap-1"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Sửa
                </button>
                <button
                  onClick={() => handleSoftDelete(prod.id)}
                  className="p-1.5 rounded-lg bg-rose-600/20 border border-rose-500/40 text-rose-300 text-xs hover:bg-rose-600/30"
                  title="Xóa mềm"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Product Modal Form */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Package className="w-4 h-4 text-amber-400" />
                {editingProduct.id ? 'Chỉnh Sửa Sản Phẩm' : 'Thêm Sản Phẩm Mới'}
              </h2>
              <button onClick={() => setEditingProduct(null)} className="text-slate-400 hover:text-white text-xs font-bold">
                ✕ Đóng
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nhóm Sản Phẩm (*)</label>
                <select
                  value={editingProduct.category}
                  onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value as ProductCategory })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
                >
                  <option value="credit_card">Thẻ Tín Dụng</option>
                  <option value="home_loan">Vay Mua Nhà / Vay Thế Chấp</option>
                  <option value="car_loan">Vay Mua Ô Tô</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Tên Sản Phẩm (*)</label>
                <input
                  type="text"
                  value={editingProduct.title}
                  onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Mô Tả Ngắn</label>
                <textarea
                  rows={2}
                  value={editingProduct.shortDescription}
                  onChange={(e) => setEditingProduct({ ...editingProduct, shortDescription: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Đường Dẫn Ảnh Đại Diện</label>
                <input
                  type="text"
                  value={editingProduct.imageUrl}
                  onChange={(e) => setEditingProduct({ ...editingProduct, imageUrl: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Danh Sách Lợi Ích (Mỗi dòng 1 điểm)
                </label>
                <textarea
                  rows={3}
                  value={editingProduct.benefits?.join('\n') || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, benefits: e.target.value.split('\n') })}
                  className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 leading-relaxed font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Nút Nút CTA</label>
                  <input
                    type="text"
                    value={editingProduct.ctaText}
                    onChange={(e) => setEditingProduct({ ...editingProduct, ctaText: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Hành Động CTA</label>
                  <select
                    value={editingProduct.ctaAction}
                    onChange={(e) => setEditingProduct({ ...editingProduct, ctaAction: e.target.value as any })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
                  >
                    <option value="form">Cuộn tới Form Đăng Ký</option>
                    <option value="phone">Gọi Điện Thoại Hotline</option>
                    <option value="zalo">Mở Nhắn Tin Zalo</option>
                    <option value="link">Mở Đường Dẫn Liên Kết</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-4 flex items-center justify-end gap-3">
              <button
                onClick={() => setEditingProduct(null)}
                className="px-4 py-2 rounded-xl border border-slate-800 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Hủy Bỏ
              </button>
              <button
                onClick={handleSaveProduct}
                disabled={saving}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20"
              >
                <Save className="w-4 h-4" /> {saving ? 'Đang lưu...' : 'Lưu Sản Phẩm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
