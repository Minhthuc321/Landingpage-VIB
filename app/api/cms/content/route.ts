import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { getPublishedCMSData, getDraftCMSData, saveDraftCMSData, getCMSStore } from '@/lib/db';
import { validateTrackingFormat, validateSafeUrl } from '@/lib/validation';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get('mode');

  if (mode === 'draft') {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: 'Yêu cầu đăng nhập để truy cập bản nháp.' }, { status: 401 });
    }
    const store = getCMSStore();
    return NextResponse.json({
      success: true,
      status: store.status,
      lastSavedAt: store.lastSavedAt,
      lastPublishedAt: store.lastPublishedAt,
      lastModifiedBy: store.lastModifiedBy,
      data: getDraftCMSData(),
    });
  }

  // Default: Public published data
  const published = getPublishedCMSData();
  return NextResponse.json({
    success: true,
    data: published,
  });
}

export async function POST(req: NextRequest) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: 'Chưa đăng nhập hoặc phiên làm việc hết hạn.' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { data } = body;

    if (!data) {
      return NextResponse.json({ error: 'Thiếu dữ liệu CMS.' }, { status: 400 });
    }

    // Validate Tracking Code format if provided
    if (data.trackingCodes) {
      if (data.trackingCodes.gaMeasurementId && !validateTrackingFormat('ga', data.trackingCodes.gaMeasurementId)) {
        return NextResponse.json({ error: 'Google Analytics Measurement ID không đúng định dạng (VD: G-XXXXXXXXXX).' }, { status: 400 });
      }
      if (data.trackingCodes.gtmContainerId && !validateTrackingFormat('gtm', data.trackingCodes.gtmContainerId)) {
        return NextResponse.json({ error: 'Google Tag Manager Container ID không đúng định dạng (VD: GTM-XXXXXXX).' }, { status: 400 });
      }
      if (data.trackingCodes.metaPixelId && !validateTrackingFormat('pixel', data.trackingCodes.metaPixelId)) {
        return NextResponse.json({ error: 'Meta Pixel ID phải là chuỗi chữ số.' }, { status: 400 });
      }
    }

    // Validate Canonical & Links
    if (data.seoSettings?.canonicalUrl && !validateSafeUrl(data.seoSettings.canonicalUrl)) {
      return NextResponse.json({ error: 'Canonical URL không hợp lệ.' }, { status: 400 });
    }

    saveDraftCMSData(data, `${user.name} (${user.role})`);

    return NextResponse.json({
      success: true,
      message: 'Đã lưu bản nháp thành công.',
      savedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('Error saving CMS draft:', err);
    return NextResponse.json({ error: 'Đã xảy ra lỗi khi lưu bản nháp.' }, { status: 500 });
  }
}
