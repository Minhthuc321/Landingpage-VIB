const value = (v: string | undefined) => v?.trim() || null;
export const contact = { phone: value(process.env.NEXT_PUBLIC_PHONE), zalo: value(process.env.NEXT_PUBLIC_ZALO_URL), facebook: value(process.env.NEXT_PUBLIC_FACEBOOK_URL), tiktok: value(process.env.NEXT_PUBLIC_TIKTOK_URL), email: value(process.env.NEXT_PUBLIC_CONTACT_EMAIL) };
