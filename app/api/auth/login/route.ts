import { NextRequest, NextResponse } from 'next/server';
import { loginUser, checkRateLimit } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const rateCheck = checkRateLimit(ip, 5, 15 * 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { success: false, error: 'Bạn đã đăng nhập quá nhiều lần thất bại. Vui lòng thử lại sau 15 phút.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Vui lòng nhập đầy đủ Email và Mật khẩu.' },
        { status: 400 }
      );
    }

    const result = await loginUser(email, password);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'Đăng nhập thất bại.' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Đăng nhập thành công',
      user: result.user,
    });
  } catch (err: any) {
    console.error('Login error:', err);
    return NextResponse.json(
      { success: false, error: 'Đã xảy ra lỗi hệ thống khi xử lý đăng nhập.' },
      { status: 500 }
    );
  }
}
