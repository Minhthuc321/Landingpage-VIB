"use client";

import React, { useEffect, useState } from 'react';
import {
  Image as ImageIcon,
  Upload,
  Video,
  Search,
  Trash2,
  AlertTriangle,
  Film,
  CheckCircle2,
  Copy,
  Plus,
  RefreshCw,
  Eye,
  FileCheck,
} from 'lucide-react';
import { MediaAsset } from '@/lib/types';

export default function MediaLibraryPage() {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video'>('all');
  const [videoUrlInput, setVideoUrlInput] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/cms/media');
      if (res.ok) {
        const data = await res.json();
        setAssets(data.mediaAssets || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setMsg('');

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('altText', file.name);

      try {
        const res = await fetch('/api/cms/media', {
          method: 'POST',
          body: formData,
        });
        const json = await res.json();
        if (!res.ok || !json.success) {
          setMsg(`❌ Lỗi tải tệp ${file.name}: ${json.error || 'Thất bại'}`);
        }
      } catch (err) {
        setMsg(`❌ Lỗi kết nối khi tải ${file.name}`);
      }
    }

    setUploading(false);
    fetchMedia();
  };

  const handleAddExternalVideo = async () => {
    if (!videoUrlInput.trim()) return;
    setUploading(true);

    const formData = new FormData();
    formData.append('videoUrl', videoUrlInput.trim());
    formData.append('altText', 'Video ngoài');

    try {
      const res = await fetch('/api/cms/media', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        setVideoUrlInput('');
        setMsg('✅ Đã thêm video thành công!');
        fetchMedia();
      }
    } catch (e) {} finally {
      setUploading(false);
    }
  };

  const handleDeleteMedia = async (id: string, action: 'soft_delete' | 'restore') => {
    try {
      const res = await fetch(`/api/cms/media?id=${id}&action=${action}`, { method: 'DELETE' });
      if (res.ok) {
        fetchMedia();
      }
    } catch (e) {}
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setMsg('📋 Đã sao chép đường dẫn URL!');
    setTimeout(() => setMsg(''), 2500);
  };

  const filteredAssets = assets.filter((a) => {
    const matchesSearch = a.originalName.toLowerCase().includes(searchTerm.toLowerCase()) || a.altText.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || a.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header & Upload Box */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-6 rounded-2xl">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
            <ImageIcon className="w-3.5 h-3.5" /> THƯ VIỆN MEDIA DÙNG CHUNG
          </div>
          <h1 className="text-xl font-extrabold text-white">Quản Lý Tệp Ảnh WebP/AVIF & Video</h1>
          <p className="text-xs text-slate-400 mt-1">Upload kéo thả, kiểm tra MIME type, alt text và phân tích tệp đang được sử dụng.</p>
        </div>

        <div className="flex items-center gap-3">
          {msg && <span className="text-xs font-semibold text-amber-300 animate-fade-in">{msg}</span>}

          <label className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold text-xs shadow-lg shadow-blue-600/20 flex items-center gap-2 transition cursor-pointer">
            <Upload className="w-4 h-4" />
            {uploading ? 'Đang Tải Lên...' : 'Tải Ảnh/Video Lên'}
            <input type="file" multiple accept="image/*,video/*" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>
      </div>

      {/* External Video Add Bar */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-300 shrink-0">
          <Film className="w-4 h-4 text-purple-400" /> Thêm Video YouTube / Vimeo / URL:
        </div>
        <input
          type="text"
          value={videoUrlInput}
          onChange={(e) => setVideoUrlInput(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=... hoặc https://.../video.mp4"
          className="flex-1 px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={handleAddExternalVideo}
          disabled={uploading || !videoUrlInput.trim()}
          className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 transition shrink-0"
        >
          <Plus className="w-4 h-4" /> Thêm Video
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm theo tên hoặc alt text..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100"
          />
        </div>

        <div className="flex items-center gap-2">
          {(['all', 'image', 'video'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
                filterType === t ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
              }`}
            >
              {t === 'all' ? 'Tất Cả' : t === 'image' ? 'Hình Ảnh' : 'Video'}
            </button>
          ))}
        </div>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="text-center py-12 text-slate-500 text-xs flex items-center justify-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin text-amber-400" /> Đang tải thư viện media...
        </div>
      ) : filteredAssets.length === 0 ? (
        <div className="text-center py-12 bg-slate-900/40 border border-slate-800 rounded-2xl text-slate-500 text-xs">
          Không tìm thấy tệp media phù hợp.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredAssets.map((asset) => (
            <div
              key={asset.id}
              className={`group bg-slate-900/90 border rounded-2xl p-2.5 flex flex-col justify-between transition ${
                asset.isDeleted ? 'border-rose-900/50 opacity-40' : 'border-slate-800 hover:border-blue-500/50'
              }`}
            >
              <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-950 border border-slate-800 mb-2">
                {asset.type === 'image' ? (
                  <img src={asset.url} alt={asset.altText} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-purple-950/40 text-purple-400">
                    <Video className="w-8 h-8" />
                  </div>
                )}

                {asset.isDeleted && (
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-rose-600 text-[10px] font-bold text-white">
                    Đã Xóa Mềm
                  </span>
                )}
              </div>

              <div className="space-y-1">
                <div className="text-xs font-bold text-slate-200 truncate">{asset.originalName}</div>
                <div className="text-[10px] text-slate-500 flex items-center justify-between">
                  <span>{(asset.size / 1024).toFixed(0)} KB</span>
                  <span className="uppercase font-mono">{asset.mimeType.split('/')[1]}</span>
                </div>
              </div>

              <div className="mt-3 border-t border-slate-800/80 pt-2 flex items-center justify-between">
                <button
                  onClick={() => copyToClipboard(asset.url)}
                  title="Sao chép URL"
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>

                {asset.isDeleted ? (
                  <button
                    onClick={() => handleDeleteMedia(asset.id, 'restore')}
                    title="Khôi phục"
                    className="p-1.5 text-emerald-400 hover:bg-slate-800 rounded-lg text-[10px] font-bold"
                  >
                    Khôi Phục
                  </button>
                ) : (
                  <button
                    onClick={() => handleDeleteMedia(asset.id, 'soft_delete')}
                    title="Xóa mềm"
                    className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
