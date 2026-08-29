import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tư Vấn Giải Pháp Tài Chính - Mở Thẻ Tín Dụng & Vay Vốn Hạn Mức Cao 2026",
  description: "Chuyên tư vấn mở thẻ tín dụng hạn mức cao, vay tiêu dùng, vay mua nhà/xe và đáo hạn thẻ tín dụng uy tín, duyệt nhanh trong 15 phút.",
  openGraph: {
    title: "Tư Vấn Giải Pháp Tài Chính - Mở Thẻ Tín Dụng & Vay Vốn Hạn Mức Cao 2026",
    description: "Chuyên tư vấn mở thẻ tín dụng hạn mức cao, vay tiêu dùng, vay mua nhà/xe và đáo hạn thẻ tín dụng uy tín, duyệt nhanh trong 15 phút.",
    type: "website",
    locale: "vi_VN",
    url: "/",
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
