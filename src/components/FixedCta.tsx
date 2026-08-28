"use client";
import { MessageCircle,Phone,Send } from "lucide-react"; import { contact } from "@/config/contact";
export function FixedCta(){return <aside className="fixedCta" aria-label="Liên hệ nhanh"><div className="fixedIn">{contact.zalo&&<a className="btn secondary" href={contact.zalo} target="_blank" rel="noreferrer"><MessageCircle/>Kết nối Zalo</a>}<a className="btn" href="#dang-ky"><Send/>Đăng ký tư vấn</a>{contact.phone&&<a className="btn gold" href={`tel:${contact.phone}`}><Phone/>Gọi Nguyễn Minh Thức</a>}</div></aside>}
