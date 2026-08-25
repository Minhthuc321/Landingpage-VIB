const fallbackUrl = "http://localhost:3000";

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
  title: "Nguyễn Minh Thức | Tư vấn tài chính cá nhân",
  description:
    "Nguyễn Minh Thức hỗ trợ tư vấn thẻ tín dụng, vay mua nhà, vay thế chấp và vay mua ô tô.",
};
