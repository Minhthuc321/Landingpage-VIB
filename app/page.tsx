"use client";

import React, { useEffect, useState } from "react";
import { getPublishedCMSData } from "@/lib/db";
import { CMSData, PageSection, ProductItem } from "@/lib/types";

export default function Home() {
  const [cms, setCms] = useState<CMSData | null>(null);

  // Loan calculator state
  const [loanAmountMillion, setLoanAmountMillion] = useState(100);
  const [loanMonths, setLoanMonths] = useState(24);

  useEffect(() => {
    fetchPublicCMS();
  }, []);

  const fetchPublicCMS = async () => {
    try {
      const res = await fetch("/api/cms/content");
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setCms(json.data);
        }
      }
    } catch (e) {
      console.error("Error fetching CMS public data:", e);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("🎉 Đã gửi thông tin hồ sơ Dịch Vụ Tài Chính thành công! Chuyên viên tư vấn sẽ liên hệ Zalo cho bạn trong vòng 15 phút.");
    (e.target as HTMLFormElement).reset();
  };

  // Calculator math
  const totalLoan = loanAmountMillion * 1000000;
  const monthlyPrinciple = totalLoan / loanMonths;
  const avgInterest = totalLoan * 0.007;
  const totalMonthlyPay = Math.round(monthlyPrinciple + avgInterest);

  const theme = cms?.themeSettings;
  const site = cms?.siteSettings;
  const seo = cms?.seoSettings;
  const sections = cms?.sections || [];
  const products = (cms?.products || []).filter((p) => p.enabled && !p.isDeleted);
  const navItems = (cms?.navigationItems || []).filter((n) => n.enabled);

  const getSection = (key: string): PageSection | undefined => {
    return sections.find((s) => s.key === key && s.enabled);
  };

  const topbar = getSection("topbar");
  const header = getSection("header");
  const hero = getSection("hero");
  const services = getSection("services");
  const calculator = getSection("calculator");
  const whyUs = getSection("why_us");
  const processSec = getSection("process");
  const aboutThuc = getSection("about_nguyen_minh_thuc");
  const faqSec = getSection("faq");
  const registerForm = getSection("register_form");
  const footerSec = getSection("footer");

  return (
    <div
      style={{
        backgroundColor: theme?.colors?.bgMain || "#0f172a",
        color: theme?.colors?.textMain || "#f8fafc",
        fontFamily: theme?.typography?.bodyFont ? `'${theme.typography.bodyFont}', sans-serif` : "'Plus Jakarta Sans', sans-serif",
      }}
      className="min-h-screen text-slate-100 font-sans leading-relaxed selection:bg-amber-500 selection:text-slate-950"
    >
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />

      {/* TOP BAR */}
      {topbar && theme?.components?.showTopBar && (
        <div
          style={{ background: theme?.colors?.gold || "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)", color: "#000" }}
          className="py-2 px-4 text-xs font-extrabold"
        >
          <div className="max-w-[1240px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
            <div><i className={`fa-solid ${topbar.icon || "fa-bolt"} mr-2`}></i> {topbar.title}</div>
            <div>{topbar.description}</div>
          </div>
        </div>
      )}

      {/* HEADER */}
      {header && (
        <header
          className={`sticky top-0 z-40 py-4 px-4 border-b border-white/10 backdrop-blur-md bg-slate-950/90`}
        >
          <div className="max-w-[1240px] mx-auto flex items-center justify-between">
            <a href="#" className="flex items-center gap-3 font-extrabold text-xl tracking-tight">
              {site?.logoUrl ? (
                <img src={site.logoUrl} alt={site.siteName} className="h-10 w-auto" />
              ) : (
                <div
                  style={{ background: theme?.colors?.primaryBlue || "#2563eb" }}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-lg shadow-md"
                >
                  <i className={`fa-solid ${header.icon || "fa-credit-card"}`}></i>
                </div>
              )}
              <div>
                <span className="text-white">{header.title || "DỊCH VỤ"} </span>
                <span style={{ color: theme?.colors?.gold || "#f59e0b" }}>{header.subtitle || "TÀI CHÍNH"}</span>
              </div>
            </a>

            {/* Navigation Menu */}
            <ul className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-300">
              {navItems.map((nav) => (
                <li key={nav.id}>
                  <a href={nav.target} className="hover:text-amber-400 transition">
                    {nav.title}
                  </a>
                </li>
              ))}
            </ul>

            <a
              href="#register"
              style={{
                background: theme?.colors?.gold || "#f59e0b",
                borderRadius: theme?.components?.buttonBorderRadius || "50px",
                color: "#000",
              }}
              className="px-5 py-2.5 font-bold text-xs shadow-lg shadow-amber-500/20 hover:opacity-95 transition flex items-center gap-2"
            >
              <i className="fa-solid fa-headset"></i> TƯ VẤN MIỄN PHÍ
            </a>
          </div>
        </header>
      )}

      {/* HERO SECTION */}
      {hero && (
        <section id="about" className="py-20 px-4 relative overflow-hidden">
          <div className="max-w-[1240px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              {hero.badgeText && (
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider">
                  <i className="fa-solid fa-shield-check"></i> {hero.badgeText}
                </div>
              )}

              <h1 className="text-3xl md:text-5xl font-black text-white leading-tight tracking-tight">
                {hero.title}
              </h1>

              <p className="text-base text-slate-400 leading-relaxed max-w-2xl">
                {hero.description}
              </p>

              {/* Hero Stats */}
              {hero.customData?.stats && (
                <div className="grid grid-cols-3 gap-6 pt-4 border-t border-white/10">
                  {hero.customData.stats.map((st: any, idx: number) => (
                    <div key={idx}>
                      <div style={{ color: theme?.colors?.gold || "#f59e0b" }} className="text-2xl font-black">
                        {st.number}
                      </div>
                      <div className="text-xs text-slate-400 mt-1">{st.label}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 pt-2">
                {hero.ctaButtons?.map((btn, idx) => (
                  <a
                    key={idx}
                    href={btn.link}
                    style={{
                      background: btn.style === "gold" ? (theme?.colors?.gold || "#f59e0b") : (theme?.colors?.primaryBlue || "#2563eb"),
                      color: btn.style === "gold" ? "#000" : "#fff",
                      borderRadius: theme?.components?.buttonBorderRadius || "50px",
                    }}
                    className="px-7 py-3.5 font-bold text-sm shadow-xl flex items-center gap-2.5 transition hover:-translate-y-0.5"
                  >
                    <i className="fa-solid fa-paper-plane"></i> {btn.text}
                  </a>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative p-3 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl overflow-hidden">
                <img
                  src={hero.mediaUrl || "https://images.unsplash.com/photo-1556742049-0a67daf64f42?q=80&w=800&auto=format&fit=crop"}
                  alt={hero.title}
                  className="w-full rounded-2xl object-cover aspect-4/3"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* SERVICES / PRODUCTS SECTION */}
      {services && (
        <section id="services" className="py-20 px-4 bg-slate-950/60 border-y border-white/5">
          <div className="max-w-[1240px] mx-auto space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              {services.badgeText && (
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
                  {services.badgeText}
                </div>
              )}
              <h2 className="text-3xl font-extrabold text-white">{services.title}</h2>
              <p className="text-sm text-slate-400">{services.description}</p>
            </div>

            {/* Products Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {products.map((prod) => (
                <div
                  key={prod.id}
                  style={{
                    backgroundColor: theme?.colors?.cardBg || "rgba(30, 41, 59, 0.85)",
                    borderRadius: theme?.components?.cardBorderRadius || "14px",
                  }}
                  className="border border-white/10 p-6 flex flex-col justify-between space-y-6 hover:border-blue-500/50 transition-all shadow-xl hover:-translate-y-1"
                >
                  <div className="space-y-4">
                    <div className="w-14 h-14 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center text-2xl">
                      <i className={`fa-solid ${prod.icon || "fa-credit-card"}`}></i>
                    </div>

                    <h3 className="text-xl font-bold text-white">{prod.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{prod.shortDescription}</p>

                    <ul className="space-y-2.5 pt-2">
                      {prod.benefits?.map((b, i) => (
                        <li key={i} className="text-xs text-slate-300 flex items-center gap-2">
                          <i className="fa-solid fa-circle-check text-amber-400"></i>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <a
                    href="#register"
                    style={{
                      background: theme?.colors?.primaryBlue || "#2563eb",
                      borderRadius: theme?.components?.buttonBorderRadius || "50px",
                    }}
                    className="w-full py-3 text-center font-bold text-xs text-white shadow-lg shadow-blue-500/20 hover:opacity-95 transition"
                  >
                    {prod.ctaText || "ĐĂNG KÝ NGAY"}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CALCULATOR SECTION */}
      {calculator && (
        <section id="calculator" className="py-20 px-4">
          <div className="max-w-[1240px] mx-auto space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              {calculator.badgeText && (
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider">
                  {calculator.badgeText}
                </div>
              )}
              <h2 className="text-3xl font-extrabold text-white">{calculator.title}</h2>
              <p className="text-sm text-slate-400">{calculator.description}</p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center shadow-2xl">
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm font-semibold mb-2">
                    <span>Số Tiền Vay Dự Kiến:</span>
                    <span className="text-amber-400 font-extrabold text-lg">
                      {totalLoan.toLocaleString("vi-VN")} VNĐ
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="1000"
                    value={loanAmountMillion}
                    onChange={(e) => setLoanAmountMillion(Number(e.target.value))}
                    className="w-full accent-blue-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-sm font-semibold mb-2">
                    <span>Thời Gian Vay:</span>
                    <span className="text-amber-400 font-extrabold text-lg">{loanMonths} Tháng</span>
                  </div>
                  <input
                    type="range"
                    min="6"
                    max="60"
                    step="6"
                    value={loanMonths}
                    onChange={(e) => setLoanMonths(Number(e.target.value))}
                    className="w-full accent-blue-500 cursor-pointer"
                  />
                </div>

                <p className="text-[11px] text-slate-500 italic">
                  *Lưu ý: Công cụ tính mang tính tham khảo. Lãi suất cụ thể phụ thuộc gói vay & điểm tín dụng CIC của bạn.
                </p>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-6">
                <div>
                  <div className="text-xs text-slate-400 mb-1">Ước Tính Gốc + Lãi Trả Hàng Tháng:</div>
                  <div className="text-3xl font-black text-blue-400">
                    {totalMonthlyPay.toLocaleString("vi-VN")} VNĐ
                  </div>
                  <div className="text-xs text-slate-500 mt-3 space-y-1">
                    <div>• Lãi suất giả định: 0.7%/tháng</div>
                    <div>• Phương thức trả: Gốc chia đều + Lãi giảm dần</div>
                  </div>
                </div>

                <a
                  href="#register"
                  style={{
                    background: theme?.colors?.gold || "#f59e0b",
                    borderRadius: theme?.components?.buttonBorderRadius || "50px",
                    color: "#000",
                  }}
                  className="w-full py-3 text-center font-bold text-xs shadow-lg shadow-amber-500/20 hover:opacity-95 transition"
                >
                  <i className="fa-solid fa-file-invoice-dollar mr-2"></i> NHẬN DỰ TOÁN CHI TIẾT
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* WHY US SECTION */}
      {whyUs && whyUs.customData?.highlights && (
        <section id="why" className="py-20 px-4 bg-slate-950/40 border-t border-white/5">
          <div className="max-w-[1240px] mx-auto space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <h2 className="text-3xl font-extrabold text-white">{whyUs.title}</h2>
              <p className="text-sm text-slate-400">{whyUs.description}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {whyUs.customData.highlights.map((hl: any, idx: number) => (
                <div key={idx} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 text-center space-y-3">
                  <div className="text-3xl text-amber-400">
                    <i className={`fa-solid ${hl.icon}`}></i>
                  </div>
                  <h4 className="text-base font-bold text-white">{hl.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{hl.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ABOUT NGUYEN MINH THUC */}
      {aboutThuc && (
        <section className="py-20 px-4 bg-slate-900/40">
          <div className="max-w-[1240px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
            <div className="md:col-span-5">
              <img
                src={aboutThuc.mediaUrl || "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop"}
                alt={aboutThuc.title}
                className="rounded-3xl border border-slate-800 shadow-2xl object-cover w-full aspect-3/4"
              />
            </div>
            <div className="md:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
                {aboutThuc.badgeText}
              </div>
              <h2 className="text-3xl font-black text-white">{aboutThuc.title}</h2>
              <p className="text-sm text-slate-300 leading-relaxed font-sans">{aboutThuc.description}</p>
              <div className="pt-4 flex items-center gap-4">
                <a
                  href={`tel:${site?.contact?.phone}`}
                  style={{ background: theme?.colors?.gold || "#f59e0b", color: "#000", borderRadius: "50px" }}
                  className="px-6 py-3 font-extrabold text-xs shadow-lg shadow-amber-500/20"
                >
                  <i className="fa-solid fa-phone mr-2"></i> GỌI TƯ VẤN TRỰC TIẾP
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* REGISTER FORM SECTION */}
      {registerForm && (
        <section id="register" className="py-20 px-4">
          <div className="max-w-xl mx-auto bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
                {registerForm.badgeText}
              </div>
              <h2 className="text-2xl font-extrabold text-white">{registerForm.title}</h2>
              <p className="text-xs text-slate-400">{registerForm.description}</p>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Họ và Tên Khách Hàng (*)</label>
                <input
                  type="text"
                  required
                  placeholder="Nhập họ và tên của bạn"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Số Điện Thoại Zalo (*)</label>
                <input
                  type="tel"
                  required
                  placeholder="Nhập số điện thoại Zalo"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Nhu Cầu Của Bạn (*)</label>
                <select className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-amber-500">
                  <option>Mở Thẻ Tín Dụng Hạn Mức Cao</option>
                  <option>Vay Mua Nhà / Vay Thế Chấp</option>
                  <option>Vay Mua Ô Tô Ưu Đãi</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Số Tiền Cần Hỗ Trợ Dự Kiến</label>
                <input
                  type="text"
                  placeholder="Ví dụ: 100.000.000 VNĐ"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                style={{
                  background: theme?.colors?.gold || "#f59e0b",
                  borderRadius: theme?.components?.buttonBorderRadius || "50px",
                  color: "#000",
                }}
                className="w-full py-3.5 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 hover:opacity-95 transition cursor-pointer"
              >
                <i className="fa-solid fa-paper-plane mr-2"></i> GỬI YÊU CẦU TƯ VẤN
              </button>
            </form>
          </div>
        </section>
      )}

      {/* FOOTER & IMMUTABLE DISCLAIMER */}
      <footer className="bg-slate-950 border-t border-slate-900 py-10 px-4 text-center text-xs text-slate-500 space-y-4">
        <div className="max-w-[1240px] mx-auto space-y-3">
          {/* IMMUTABLE VIB DISCLAIMER (ALWAYS PRESENT) */}
          <div className="bg-slate-900/60 border border-slate-850 p-4 rounded-2xl text-[11px] text-slate-400 max-w-4xl mx-auto leading-relaxed">
            <div className="font-bold text-amber-400 mb-1">⚠️ TUYÊN BỐ MIỄN TRỪ TRÁCH NHIỆM:</div>
            <div>{seo?.immutableDisclaimer}</div>
            {seo?.customDisclaimerNote && <div className="mt-1 text-slate-500">{seo.customDisclaimerNote}</div>}
          </div>

          <p>&copy; 2026 {site?.siteName || "Dịch Vụ Tài Chính Solution"}. Tất cả quyền được bảo lưu.</p>
          <p>{site?.contact?.address}. Hotline: {site?.contact?.phone}</p>
        </div>
      </footer>
    </div>
  );
}
