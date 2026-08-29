"use client";

import React, { useEffect, useState } from 'react';
import {
  History,
  Rocket,
  RotateCcw,
  CheckCircle2,
  Clock,
  User,
  Sparkles,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { RevisionSnapshot } from '@/lib/types';

export default function RevisionsManagerPage() {
  const [revisions, setRevisions] = useState<RevisionSnapshot[]>([]);
  const [status, setStatus] = useState<'draft' | 'published'>('published');
  const [lastSavedAt, setLastSavedAt] = useState('');
  const [lastPublishedAt, setLastPublishedAt] = useState('');
  const [lastModifiedBy, setLastModifiedBy] = useState('');
  const [publishing, setPublishing] = useState(false);
  const [msg, setMsg] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    fetchRevisions();
  }, []);

  const fetchRevisions = async () => {
    try {
      const res = await fetch('/api/cms/rollback');
      if (res.ok) {
        const json = await res.json();
        setRevisions(json.revisions || []);
      }

      const contentRes = await fetch('/api/cms/content?mode=draft');
      if (contentRes.ok) {
        const json = await contentRes.json();
        setStatus(json.status);
        setLastSavedAt(json.lastSavedAt);
        setLastPublishedAt(json.lastPublishedAt);
        setLastModifiedBy(json.lastModifiedBy);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handlePublishNow = async () => {
    setPublishing(true);
    setMsg('');

    try {
      const res = await fetch('/api/cms/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note: note.trim() || 'Xuất bản bản nháp mới' }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setMsg('🚀 Đã xuất bản nội dung mới ra website công khai!');
        setNote('');
        fetchRevisions();
      } else {
        setMsg(`❌ Lỗi: ${json.error || 'Xuất bản thất bại.'}`);
      }
    } catch (e) {
      setMsg('❌ Lỗi kết nối máy chủ.');
    } finally {
      setPublishing(false);
    }
  };

  const handleRollback = async (revId: string) => {
    if (!confirm('Bạn có chắc chắn muốn khôi phục giao diện & nội dung về phiên bản lịch sử này?')) return;

    try {
      const res = await fetch('/api/cms/rollback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ revisionId: revId }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setMsg('✅ Đã khôi phục phiên bản thành công!');
        fetchRevisions();
      } else {
        setMsg(`❌ Lỗi: ${json.error || 'Khôi phục thất bại.'}`);
      }
    } catch (e) {
      setMsg('❌ Lỗi kết nối.');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-6 rounded-2xl">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">
            <History className="w-3.5 h-3.5" /> LỊCH SỬ CHỈNH SỬA & XUẤT BẢN WEBSITE
          </div>
          <h1 className="text-xl font-extrabold text-white">Quản Lý Bản Nháp, Xuất Bản & Khôi Phục Phiên Bản</h1>
          <p className="text-xs text-slate-400 mt-1">
            Đảm bảo website công khai không bị ảnh hưởng khi đang nhập liệu dở dang. Mọi phiên bản xuất bản đều được sao lưu tự động.
          </p>
        </div>

        {msg && <span className="text-xs font-semibold text-amber-300 animate-fade-in">{msg}</span>}
      </div>

      {/* Status & Publish Action Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">TRẠNG THÁI HIỆN TẠI</span>
            <div className="flex items-center gap-3 mt-1">
              {status === 'draft' ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Clock className="w-4 h-4" /> Đang Có Bản Nháp Chưa Xuất Bản
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <CheckCircle2 className="w-4 h-4" /> Tất Cả Đã Xuất Bản Mới Nhất
                </span>
              )}
            </div>
          </div>

          <div className="text-xs text-slate-400 space-y-1 sm:text-right">
            <div>Lưu bản nháp lần cuối: <span className="text-slate-200 font-mono">{lastSavedAt ? new Date(lastSavedAt).toLocaleString('vi-VN') : 'N/A'}</span></div>
            <div>Xuất bản lần cuối: <span className="text-amber-400 font-mono">{lastPublishedAt ? new Date(lastPublishedAt).toLocaleString('vi-VN') : 'N/A'}</span></div>
            <div>Người chỉnh sửa: <span className="text-slate-200">{lastModifiedBy || 'Quản trị viên'}</span></div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Nhập ghi chú cho bản xuất bản này (Ví dụ: Cập nhật banner Tết 2026)..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={handlePublishNow}
            disabled={publishing}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/20 flex items-center gap-2 transition shrink-0 cursor-pointer"
          >
            <Rocket className="w-4 h-4" />
            {publishing ? 'Đang Xuất Bản...' : '🚀 XUẤT BẢN NGAY RA WEBSITE'}
          </button>
        </div>
      </div>

      {/* Revision History List */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
          <History className="w-4 h-4 text-blue-400" /> Danh Sách Các Phiên Bản Lịch Sử ({revisions.length})
        </h3>

        {revisions.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs">Chưa có phiên bản lịch sử nào được lưu trữ.</div>
        ) : (
          <div className="space-y-3">
            {revisions.map((rev, idx) => (
              <div
                key={rev.id}
                className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[10px] font-bold border border-blue-500/20">
                      REVISION #{revisions.length - idx}
                    </span>
                    <span className="text-xs font-bold text-slate-200">{rev.note || 'Xuất bản định kỳ'}</span>
                  </div>

                  <div className="text-[11px] text-slate-400 flex items-center gap-4">
                    <span>Thời gian: <span className="font-mono text-slate-300">{new Date(rev.timestamp).toLocaleString('vi-VN')}</span></span>
                    <span>Thực hiện: <span className="text-amber-400">{rev.modifiedBy}</span></span>
                  </div>
                </div>

                <button
                  onClick={() => handleRollback(rev.id)}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-700 text-slate-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-amber-400" /> Khôi Phục Phiên Bản Này
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
