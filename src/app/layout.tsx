import type { Metadata } from "next"; import "./globals.css"; import { site } from "@/config/site";
export const metadata:Metadata={metadataBase:new URL(site.url),title:site.title,description:site.description,alternates:{canonical:"/"},openGraph:{title:site.title,description:site.description,url:"/",siteName:site.name,locale:"vi_VN",type:"website"},twitter:{card:"summary_large_image",title:site.title,description:site.description},icons:{icon:"/brand/favicon.svg"}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="vi"><body>{children}</body></html>}
