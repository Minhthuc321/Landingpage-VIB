import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { getCMSStore, saveCMSStore, getDraftCMSData } from '@/lib/db';
import { validateMediaUpload, saveUploadedFile } from '@/lib/sanitize';
import { MediaAsset } from '@/lib/types';

export async function GET() {
  const store = getCMSStore();
  const draft = getDraftCMSData();

  // Annotate media assets with usage check
  const mediaList = draft.mediaAssets.map((asset) => {
    const isUsed =
      draft.sections.some((sec) => sec.mediaUrl === asset.url) ||
      draft.products.some((prod) => prod.imageUrl === asset.url) ||
      draft.siteSettings.logoUrl === asset.url ||
      draft.siteSettings.faviconUrl === asset.url ||
      draft.seoSettings.ogImage === asset.url;

    return {
      ...asset,
      inUse: isUsed,
    };
  });

  return NextResponse.json({ success: true, mediaAssets: mediaList });
}

export async function POST(req: NextRequest) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: 'Chưa đăng nhập.' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const videoUrl = formData.get('videoUrl') as string | null;
    const altText = (formData.get('altText') as string) || '';
    const caption = (formData.get('caption') as string) || '';

    const store = getCMSStore();

    // Handle external video URL entry
    if (videoUrl && videoUrl.trim() !== '') {
      const asset: MediaAsset = {
        id: `media_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        filename: 'external-video',
        originalName: videoUrl,
        mimeType: 'video/mp4',
        size: 0,
        url: videoUrl,
        type: 'video',
        altText: altText || 'Video bên ngoài',
        caption: caption || '',
        videoConfig: {
          autoplay: false,
          muted: true,
          loop: false,
          controls: true,
          videoUrl,
        },
        isDeleted: false,
        createdAt: new Date().toISOString(),
      };

      store.draft.mediaAssets.unshift(asset);
      saveCMSStore(store);
      return NextResponse.json({ success: true, asset, message: 'Đã thêm liên kết video thành công.' });
    }

    if (!file) {
      return NextResponse.json({ error: 'Vui lòng chọn tệp để tải lên.' }, { status: 400 });
    }

    const validation = validateMediaUpload(file.name, file.type, file.size);
    if (!validation.valid || !validation.safeName) {
      return NextResponse.json({ error: validation.error || 'Tệp không hợp lệ.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const publicUrl = await saveUploadedFile(buffer, validation.safeName);

    const asset: MediaAsset = {
      id: `media_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      filename: validation.safeName,
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
      url: publicUrl,
      type: validation.type || 'image',
      altText: altText || file.name,
      caption: caption || '',
      videoConfig: validation.type === 'video' ? {
        autoplay: false,
        muted: true,
        loop: false,
        controls: true,
      } : undefined,
      isDeleted: false,
      createdAt: new Date().toISOString(),
    };

    store.draft.mediaAssets.unshift(asset);
    saveCMSStore(store);

    return NextResponse.json({
      success: true,
      asset,
      message: 'Tải tệp lên thành công!',
    });
  } catch (err: any) {
    console.error('Error uploading media:', err);
    return NextResponse.json({ error: 'Đã xảy ra lỗi khi tải tệp lên.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: 'Chưa đăng nhập.' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const action = searchParams.get('action'); // 'soft_delete' | 'restore'

  if (!id) {
    return NextResponse.json({ error: 'Thiếu Media ID.' }, { status: 400 });
  }

  const store = getCMSStore();
  const asset = store.draft.mediaAssets.find((a) => a.id === id);

  if (!asset) {
    return NextResponse.json({ error: 'Không tìm thấy tệp media.' }, { status: 404 });
  }

  if (action === 'restore') {
    asset.isDeleted = false;
  } else {
    asset.isDeleted = true;
  }

  saveCMSStore(store);
  return NextResponse.json({
    success: true,
    message: action === 'restore' ? 'Đã khôi phục tệp media.' : 'Đã xóa tệp media.',
  });
}
