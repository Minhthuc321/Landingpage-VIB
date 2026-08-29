import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getAuthenticatedUser } from '@/lib/auth';
import { rollbackCMSRevision, getCMSStore } from '@/lib/db';

export async function GET() {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: 'Chưa đăng nhập.' }, { status: 401 });
  }

  const store = getCMSStore();
  return NextResponse.json({
    success: true,
    revisions: store.revisions.map((r) => ({
      id: r.id,
      timestamp: r.timestamp,
      modifiedBy: r.modifiedBy,
      note: r.note,
    })),
    auditLogs: store.auditLogs.slice(0, 50),
  });
}

export async function POST(req: NextRequest) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: 'Chưa đăng nhập.' }, { status: 401 });
  }

  if (user.role !== 'admin') {
    return NextResponse.json({ error: 'Chỉ tài khoản Admin mới có quyền khôi phục phiên bản.' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { revisionId } = body;

    if (!revisionId) {
      return NextResponse.json({ error: 'Thiếu ID phiên bản cần khôi phục.' }, { status: 400 });
    }

    const success = rollbackCMSRevision(revisionId, `${user.name} (${user.role})`);
    if (!success) {
      return NextResponse.json({ error: 'Không tìm thấy phiên bản lịch sử yêu cầu.' }, { status: 404 });
    }

    try {
      revalidatePath('/');
    } catch (e) {}

    return NextResponse.json({
      success: true,
      message: 'Đã khôi phục giao diện & nội dung về phiên bản đã chọn!',
    });
  } catch (err: any) {
    console.error('Error rolling back CMS:', err);
    return NextResponse.json({ error: 'Đã xảy ra lỗi khi khôi phục phiên bản.' }, { status: 500 });
  }
}
