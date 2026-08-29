import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getAuthenticatedUser } from '@/lib/auth';
import { publishCMSData } from '@/lib/db';

export async function POST(req: NextRequest) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: 'Chưa đăng nhập hoặc phiên làm việc hết hạn.' }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const note = body?.note || 'Xuất bản bản nháp từ Admin Panel';

    publishCMSData(`${user.name} (${user.role})`, note);

    // Revalidate public landing page cache
    try {
      revalidatePath('/');
    } catch (e) {
      console.warn('Revalidation notice:', e);
    }

    return NextResponse.json({
      success: true,
      message: 'Đã xuất bản thành công nội dung ra website công khai!',
      publishedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('Error publishing CMS:', err);
    return NextResponse.json({ error: 'Đã xảy ra lỗi khi xuất bản website.' }, { status: 500 });
  }
}
