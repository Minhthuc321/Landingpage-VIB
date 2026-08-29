import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { getCMSStore, saveCMSStore } from '@/lib/db';
import { ProductItem } from '@/lib/types';

export async function GET() {
  const store = getCMSStore();
  return NextResponse.json({ success: true, products: store.draft.products });
}

export async function POST(req: NextRequest) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: 'Chưa đăng nhập.' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { product } = body;

    if (!product || !product.title || !product.category) {
      return NextResponse.json({ error: 'Vui lòng điền tiêu đề và phân loại sản phẩm.' }, { status: 400 });
    }

    const store = getCMSStore();

    if (product.id) {
      // Edit existing product
      const idx = store.draft.products.findIndex((p) => p.id === product.id);
      if (idx !== -1) {
        store.draft.products[idx] = {
          ...store.draft.products[idx],
          ...product,
        };
      }
    } else {
      // Create new product
      const newProduct: ProductItem = {
        id: `prod_${Date.now()}`,
        category: product.category,
        title: product.title,
        shortDescription: product.shortDescription || '',
        fullDescription: product.fullDescription || '',
        icon: product.icon || 'fa-tag',
        imageUrl: product.imageUrl || '',
        benefits: product.benefits || [],
        featured: !!product.featured,
        enabled: product.enabled !== false,
        order: store.draft.products.length + 1,
        ctaText: product.ctaText || 'ĐĂNG KÝ NGAY',
        ctaAction: product.ctaAction || 'form',
        ctaLink: product.ctaLink || '',
        seoTitle: product.seoTitle || '',
        seoDescription: product.seoDescription || '',
        isDeleted: false,
      };
      store.draft.products.push(newProduct);
    }

    saveCMSStore(store);
    return NextResponse.json({ success: true, message: 'Đã lưu sản phẩm thành công.' });
  } catch (err: any) {
    console.error('Error saving product:', err);
    return NextResponse.json({ error: 'Đã xảy ra lỗi khi lưu sản phẩm.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: 'Chưa đăng nhập.' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Thiếu Product ID.' }, { status: 400 });
  }

  const store = getCMSStore();
  const prod = store.draft.products.find((p) => p.id === id);

  if (!prod) {
    return NextResponse.json({ error: 'Không tìm thấy sản phẩm.' }, { status: 404 });
  }

  prod.isDeleted = true;
  saveCMSStore(store);

  return NextResponse.json({ success: true, message: 'Đã xóa mềm sản phẩm.' });
}
