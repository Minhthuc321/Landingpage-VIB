const fallbackUrl = "https://vib.minhthucmkt.vn";

function getSiteUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!configuredUrl) return fallbackUrl;

  try {
    return new URL(configuredUrl).origin;
  } catch {
    return fallbackUrl;
  }
}

export const siteConfig = {
  url: getSiteUrl(),
  title: "Tư Vấn Giải Pháp Tài Chính - Mở Thẻ Tín Dụng & Vay Vốn Hạn Mức Cao 2026",
  description:
    "Chuyên tư vấn mở thẻ tín dụng hạn mức cao, vay tiêu dùng, vay mua nhà/xe và đáo hạn thẻ tín dụng uy tín, duyệt nhanh trong 15 phút.",
};
