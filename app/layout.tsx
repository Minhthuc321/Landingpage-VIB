import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Be_Vietnam_Pro } from "next/font/google";
import { siteConfig } from "@/config/site";
import "./globals.css";
const font=Be_Vietnam_Pro({subsets:["vietnamese"],weight:["400","500","600","700","800","900"],variable:"--font-be-vietnam",display:"swap"});
export const metadata:Metadata={metadataBase:new URL(siteConfig.url),title:siteConfig.title,description:siteConfig.description,openGraph:{title:siteConfig.title,description:"Đồng hành tìm hiểu giải pháp tài chính phù hợp với nhu cầu thực tế.",type:"website",locale:"vi_VN",url:"/"},alternates:{canonical:"/"}};
export default function RootLayout({children}:{children:ReactNode}){return <html lang="vi" className={font.variable}><body>{children}</body></html>}
