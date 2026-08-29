"use client";

import React, { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    // Dynamic Theme Overrides
    const savedTheme = localStorage.getItem('vib_theme_settings');
    if (savedTheme) {
      try {
        const theme = JSON.parse(savedTheme);
        const root = document.documentElement;
        if (theme.primary_blue) root.style.setProperty('--primary-blue', theme.primary_blue);
        if (theme.primary_blue_light) root.style.setProperty('--primary-blue-light', theme.primary_blue_light);
        if (theme.accent_gold) root.style.setProperty('--accent-gold', theme.accent_gold);
        if (theme.dark_bg) root.style.setProperty('--dark-slate', theme.dark_bg);
      } catch (e) {
        console.error(e);
      }
    }

    const amountRange = document.getElementById('amountRange') as HTMLInputElement;
    const monthRange = document.getElementById('monthRange') as HTMLInputElement;
    const amountVal = document.getElementById('amountVal');
    const monthVal = document.getElementById('monthVal');
    const monthlyPay = document.getElementById('monthlyPay');

    function calculateLoan() {
      if (!amountRange || !monthRange || !amountVal || !monthVal || !monthlyPay) return;
      const amountMillion = parseInt(amountRange.value);
      const months = parseInt(monthRange.value);
      const totalAmount = amountMillion * 1000000;
      amountVal.innerText = totalAmount.toLocaleString('vi-VN') + ' VNĐ';
      monthVal.innerText = months + ' Tháng';

      const monthlyPrinciple = totalAmount / months;
      const avgInterest = totalAmount * 0.007;
      const totalMonthly = Math.round(monthlyPrinciple + avgInterest);

      monthlyPay.innerText = totalMonthly.toLocaleString('vi-VN') + ' VNĐ';
    }

    if (amountRange && monthRange) {
      amountRange.addEventListener('input', calculateLoan);
      monthRange.addEventListener('input', calculateLoan);
      calculateLoan();
    }

    const regForm = document.getElementById('regForm');
    if (regForm) {
      regForm.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('🎉 Đã gửi thông tin hồ sơ Mẫu 05 thành công! Chuyên viên tài chính sẽ liên hệ Zalo tư vấn cho anh trong vòng 15 phút.');
        (this as HTMLFormElement).reset();
      });
    }
  }, []);

  const rawHtml = `
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />

  <style>
    :root {
      --primary-blue: #1e40af;
      --primary-blue-light: #2563eb;
      --accent-gold: #f59e0b;
      --accent-gold-dark: #d97706;
      --dark-slate: #0f172a;
      --card-bg: rgba(30, 41, 59, 0.85);
      --card-bg-light: #ffffff;
      --light-gray: #f8fafc;
      --border-color: rgba(37, 99, 235, 0.25);
      --text-main: #f8fafc;
      --text-dark: #1e293b;
      --text-muted: #94a3b8;
      --font-heading: 'Montserrat', sans-serif;
      --font-body: 'Plus Jakarta Sans', sans-serif;
      --radius: 14px;
      --shadow-glow: 0 15px 35px rgba(37, 99, 235, 0.2);
      --gradient-blue: linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-blue-light) 100%);
      --gradient-gold: linear-gradient(135deg, var(--accent-gold) 0%, #d97706 100%);
    }

    * { box-sizing: border-box; margin: 0; padding: 0; scroll-behavior: smooth; }
    body { font-family: var(--font-body); background-color: var(--dark-slate); color: var(--text-main); line-height: 1.6; overflow-x: hidden; }
    h1, h2, h3, h4, h5, h6 { font-family: var(--font-heading); font-weight: 700; line-height: 1.2; }
    a { text-decoration: none; color: inherit; }
    .container { max-width: 1240px; margin: 0 auto; padding: 0 20px; }

    .badge-pill {
      display: inline-flex; align-items: center; gap: 8px; padding: 6px 18px; border-radius: 50px;
      background: rgba(37, 99, 235, 0.15); border: 1px solid var(--primary-blue-light); color: #60a5fa;
      font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 18px;
    }
    .btn {
      display: inline-flex; align-items: center; justify-content: center; gap: 10px; padding: 14px 32px;
      border-radius: 50px; font-family: var(--font-heading); font-size: 16px; font-weight: 700; cursor: pointer;
      transition: all 0.3s ease; border: none;
    }
    .btn-blue { background: var(--gradient-blue); color: #ffffff; box-shadow: 0 8px 25px rgba(37, 99, 235, 0.4); }
    .btn-blue:hover { transform: translateY(-3px); box-shadow: 0 12px 30px rgba(37, 99, 235, 0.6); }
    .btn-gold { background: var(--gradient-gold); color: #000000; box-shadow: 0 8px 25px rgba(245, 158, 11, 0.4); }
    .btn-gold:hover { transform: translateY(-3px); box-shadow: 0 12px 30px rgba(245, 158, 11, 0.6); }

    .top-bar { background: var(--gradient-gold); color: #000000; padding: 8px 0; font-size: 13px; font-weight: 700; }
    .top-flex { display: flex; justify-content: space-between; align-items: center; }

    header {
      position: sticky; top: 0; z-index: 1000; background: rgba(15, 23, 42, 0.95);
      backdrop-filter: blur(12px); border-bottom: 1px solid rgba(255, 255, 255, 0.08); padding: 16px 0;
    }
    .nav-wrapper { display: flex; justify-content: space-between; align-items: center; }
    .logo-brand { display: flex; align-items: center; gap: 10px; font-family: var(--font-heading); font-size: 22px; font-weight: 800; }
    .logo-icon { width: 42px; height: 42px; background: var(--gradient-blue); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 20px; }
    .nav-menu { display: flex; gap: 32px; list-style: none; }
    .nav-menu a { font-size: 15px; font-weight: 600; color: var(--text-muted); transition: color 0.3s ease; }
    .nav-menu a:hover { color: #60a5fa; }

    .hero-section {
      padding: 120px 0 90px;
      background: radial-gradient(circle at 80% 20%, rgba(37, 99, 235, 0.18) 0%, transparent 60%),
                  radial-gradient(circle at 20% 80%, rgba(245, 158, 11, 0.12) 0%, transparent 50%);
    }
    .hero-grid { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 60px; align-items: center; }
    .hero-text h1 { font-size: 46px; margin-bottom: 20px; letter-spacing: -1px; }
    .hero-text h1 span { color: #60a5fa; }
    .hero-text p { font-size: 18px; color: var(--text-muted); margin-bottom: 32px; }
    .hero-stats-flex { display: flex; gap: 36px; margin-bottom: 36px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.08); }
    .stat-item h3 { font-size: 30px; color: var(--accent-gold); font-weight: 800; }
    .stat-item p { font-size: 13px; color: var(--text-muted); }
    .hero-card-display { background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 24px; padding: 20px; box-shadow: var(--shadow-glow); position: relative; }
    .hero-card-display img { width: 100%; border-radius: 16px; display: block; }

    .section-padding { padding: 90px 0; }
    .title-center { text-align: center; max-width: 700px; margin: 0 auto 60px; }
    .title-center h2 { font-size: 36px; margin-bottom: 16px; }
    .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; }
    .service-card { background: var(--card-bg); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: var(--radius); padding: 36px 28px; transition: all 0.3s ease; position: relative; }
    .service-card:hover { border-color: var(--primary-blue-light); transform: translateY(-8px); box-shadow: var(--shadow-glow); }
    .service-icon { width: 56px; height: 56px; border-radius: 14px; background: rgba(37, 99, 235, 0.15); color: #60a5fa; display: flex; align-items: center; justify-content: center; font-size: 24px; margin-bottom: 24px; }
    .service-card h3 { font-size: 20px; margin-bottom: 12px; }
    .service-card p { font-size: 14px; color: var(--text-muted); margin-bottom: 20px; }
    .service-card ul { list-style: none; margin-bottom: 24px; }
    .service-card ul li { font-size: 13px; color: #cbd5e1; margin-bottom: 8px; display: flex; align-items: center; gap: 8px; }
    .service-card ul li i { color: var(--accent-gold); }

    .calculator-section { background: rgba(30, 41, 59, 0.5); border-y: 1px solid rgba(255, 255, 255, 0.08); }
    .calculator-card { background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 24px; padding: 40px; display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
    .calc-slider-group { margin-bottom: 24px; }
    .calc-label { display: flex; justify-content: space-between; font-weight: 600; font-size: 15px; margin-bottom: 10px; }
    .calc-label span.value { color: var(--accent-gold); font-size: 18px; font-weight: 800; }
    .range-input { width: 100%; height: 8px; border-radius: 5px; background: #334155; outline: none; accent-color: var(--primary-blue-light); }
    .calc-result-box { background: rgba(15, 23, 42, 0.8); border-radius: 16px; padding: 30px; display: flex; flex-direction: column; justify-content: space-between; border: 1px solid rgba(255, 255, 255, 0.05); }
    .result-item { margin-bottom: 20px; }
    .result-item div.title { font-size: 13px; color: var(--text-muted); }
    .result-item div.amount { font-family: var(--font-heading); font-size: 28px; font-weight: 800; color: #60a5fa; }

    .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
    .why-box { background: var(--card-bg); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: var(--radius); padding: 30px 20px; text-align: center; }
    .why-icon { font-size: 32px; color: var(--accent-gold); margin-bottom: 16px; }
    .why-box h4 { font-size: 17px; margin-bottom: 8px; }
    .why-box p { font-size: 13px; color: var(--text-muted); }

    .form-box { background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 24px; padding: 50px; box-shadow: var(--shadow-glow); }
    .form-group { margin-bottom: 20px; }
    .form-group label { display: block; font-size: 14px; font-weight: 600; margin-bottom: 8px; }
    .form-input { width: 100%; padding: 14px 16px; border-radius: var(--radius); background: rgba(15, 23, 42, 0.9); border: 1px solid rgba(255, 255, 255, 0.1); color: #fff; font-size: 15px; outline: none; }
    .form-input:focus { border-color: #60a5fa; }

    footer { background: #090d16; padding: 50px 0 24px; border-top: 1px solid rgba(255, 255, 255, 0.05); text-align: center; font-size: 14px; color: var(--text-muted); }

    @media (max-width: 992px) {
      .hero-grid, .calculator-card, .grid-3, .grid-4 { grid-template-columns: 1fr; }
      .hero-text h1 { font-size: 34px; }
      .nav-menu { display: none; }
    }
  </style>

  <!-- TOP BAR -->
  <div class="top-bar">
    <div class="container top-flex">
      <div><i class="fa-solid fa-bolt"></i> TƯ VẤN HỒ SƠ TÀI CHÍNH DUYỆT NHANH TRONG 15 PHÚT</div>
      <div>HOTLINE TƯ VẤN 24/7: <strong>1900 6868 - 0988 999 888</strong></div>
    </div>
  </div>

  <!-- HEADER -->
  <header>
    <div class="container nav-wrapper">
      <a href="#" class="logo-brand">
        <div class="logo-icon"><i class="fa-solid fa-credit-card"></i></div>
        <div>TÀI CHÍNH <span>SOLUTION VIB</span></div>
      </a>

      <ul class="nav-menu">
        <li><a href="#about">Giới Thiệu</a></li>
        <li><a href="#services">Dịch Vụ Thẻ & Vay</a></li>
        <li><a href="#calculator">Tính Lãi Suất</a></li>
        <li><a href="#why">Ưu Điểm</a></li>
        <li><a href="#register">Đăng Ký</a></li>
        <li><a href="/admin" style="color:#f59e0b; font-weight:bold;">⚙️ Admin</a></li>
      </ul>

      <a href="#register" class="btn btn-gold"><i class="fa-solid fa-headset"></i> TƯ VẤN MIỄN PHÍ</a>
    </div>
  </header>

  <!-- HERO SECTION -->
  <section class="hero-section" id="about">
    <div class="container hero-grid">
      <div class="hero-text">
        <div class="badge-pill"><i class="fa-solid fa-shield-check"></i> GIẢI PHÁP TÀI CHÍNH DÂN DỤNG & DOANH NGHIỆP</div>
        <h1>MỞ THẺ TÍN DỤNG & <span>VAY VỐN HẠN MỨC CAO VIB</span></h1>
        <p>Hỗ trợ mở thẻ tín dụng cashback hoàn tiền tới 15%, vay tiêu dùng, vay mua nhà/xe với lãi suất ưu đãi chỉ từ 0.6%/tháng. Thủ tục tối giản, giải ngân nhanh trong ngày.</p>

        <div class="hero-stats-flex">
          <div class="stat-item">
            <h3>10,000+</h3>
            <p>Hồ Sơ Đã Duyệt</p>
          </div>
          <div class="stat-item">
            <h3>15 Phút</h3>
            <p>Xử Lý Hồ Sơ</p>
          </div>
          <div class="stat-item">
            <h3>0 VNĐ</h3>
            <p>Phí Tư Vấn ban đầu</p>
          </div>
        </div>

        <div style="display:flex; gap:16px;">
          <a href="#register" class="btn btn-blue"><i class="fa-solid fa-paper-plane"></i> ĐĂNG KÝ HỒ SƠ NGAY</a>
          <a href="#calculator" class="btn btn-gold"><i class="fa-solid fa-calculator"></i> TÍNH LÃI SUẤT</a>
        </div>
      </div>

      <div class="hero-card-display">
        <img src="https://images.unsplash.com/photo-1556742049-0a67daf64f42?q=80&w=800&auto=format&fit=crop" alt="Thẻ tín dụng và tư vấn tài chính" />
      </div>
    </div>
  </section>

  <!-- DỊCH VỤ CỐT LÕI -->
  <section class="section-padding" id="services">
    <div class="container">
      <div class="title-center">
        <div class="badge-pill">SẢN PHẨM TÀI CHÍNH</div>
        <h2>DỊCH VỤ TƯ VẤN TRỌNG ĐIỂM</h2>
      </div>

      <div class="grid-3">
        <!-- CARD 1 -->
        <div class="service-card">
          <div class="service-icon"><i class="fa-solid fa-credit-card"></i></div>
          <h3>Mở Thẻ Tín Dụng Hạn Mức Cao</h3>
          <p>Mở thẻ các ngân hàng VIB, VPBank, Techcombank, Sacombank hạn mức từ 20 triệu - 500 triệu đ.</p>
          <ul>
            <li><i class="fa-solid fa-circle-check"></i> Miễn phí phí thường niên năm đầu</li>
            <li><i class="fa-solid fa-circle-check"></i> Hoàn tiền mua sắm tới 15%</li>
            <li><i class="fa-solid fa-circle-check"></i> Miễn lãi tối đa 55 ngày</li>
          </ul>
          <a href="#register" class="btn btn-blue" style="width:100%;">ĐĂNG KÝ MỞ THẺ</a>
        </div>

        <!-- CARD 2 -->
        <div class="service-card">
          <div class="service-icon"><i class="fa-solid fa-sack-dollar"></i></div>
          <h3>Vay Tiêu Dùng & Mua Nhà / Xe</h3>
          <p>Hỗ trợ gói vay chấp/thế chấp hạn mức lên đến 5 tỷ VNĐ với thời hạn linh hoạt tới 35 năm.</p>
          <ul>
            <li><i class="fa-solid fa-circle-check"></i> Lãi suất ưu đãi từ 0.6%/tháng</li>
            <li><i class="fa-solid fa-circle-check"></i> Không cần chứng minh thu nhập phức tạp</li>
            <li><i class="fa-solid fa-circle-check"></i> Đội ngũ hỗ trợ duyệt hồ sơ tận nơi</li>
          </ul>
          <a href="#register" class="btn btn-blue" style="width:100%;">ĐĂNG KÝ VAY VỐN</a>
        </div>

        <!-- CARD 3 -->
        <div class="service-card">
          <div class="service-icon"><i class="fa-solid fa-arrows-rotate"></i></div>
          <h3>Đáo Hạn & Rút Tiền Thẻ Tín Dụng</h3>
          <p>Dịch vụ giải chấp đáo hạn và rút tiền mặt từ thẻ tín dụng nhanh chóng 24/7 với phí cạnh tranh.</p>
          <ul>
            <li><i class="fa-solid fa-circle-check"></i> Phí rút/đáo chỉ từ 1.2%</li>
            <li><i class="fa-solid fa-circle-check"></i> Tránh nợ xấu và tăng điểm tín dụng</li>
            <li><i class="fa-solid fa-circle-check"></i> Nhận tiền ngay qua chuyển khoản</li>
          </ul>
          <a href="#register" class="btn btn-blue" style="width:100%;">ĐĂNG KÝ ĐÁO HẠN</a>
        </div>
      </div>
    </div>
  </section>

  <!-- CALCULATOR SECTION -->
  <section class="section-padding calculator-section" id="calculator">
    <div class="container">
      <div class="title-center">
        <div class="badge-pill">CÔNG CỤ TỰ ĐỘNG</div>
        <h2>TÍNH TOÁN KHOẢN VAY & TRẢ HÀNG THÁNG</h2>
      </div>

      <div class="calculator-card">
        <div>
          <div class="calc-slider-group">
            <div class="calc-label">
              <span>Số Tiền Vay Dự Kiến:</span>
              <span class="value" id="amountVal">100.000.000 VNĐ</span>
            </div>
            <input type="range" min="10" max="1000" defaultValue="100" class="range-input" id="amountRange" />
          </div>

          <div class="calc-slider-group">
            <div class="calc-label">
              <span>Thời Gian Vay:</span>
              <span class="value" id="monthVal">24 Tháng</span>
            </div>
            <input type="range" min="6" max="60" defaultValue="24" step="6" class="range-input" id="monthRange" />
          </div>

          <p style="font-size:12px; color:var(--text-muted); margin-top:16px;">*Lưu ý: Công cụ tính mang tính tham khảo. Lãi suất cụ thể phụ thuộc vào gói vay & điểm tín dụng CIC của bạn.</p>
        </div>

        <div class="calc-result-box">
          <div>
            <div class="result-item">
              <div class="title">Ước Tính Gốc + Lãi Trả Hàng Tháng:</div>
              <div class="amount" id="monthlyPay">4.766.666 VNĐ</div>
            </div>

            <div style="font-size:13px; color:var(--text-muted); line-height:1.8;">
              • Lãi suất giả định: 0.7%/tháng<br/>
              • Phương thức trả: Gốc chia đều + Lãi giảm dần<br/>
            </div>
          </div>

          <a href="#register" class="btn btn-gold" style="width:100%;"><i class="fa-solid fa-file-invoice-dollar"></i> NHẬN DỰ TOÁN BÁO GIÁ CHI TIẾT</a>
        </div>
      </div>
    </div>
  </section>

  <!-- UY TÍN & ƯU ĐIỂM -->
  <section class="section-padding" id="why">
    <div class="container">
      <div class="title-center">
        <div class="badge-pill">LÝ DO CHỌN CHÚNG TÔI</div>
        <h2>ƯU THẾ VƯỢT TRỘI KHÓ GIAO DỊCH</h2>
      </div>

      <div class="grid-4">
        <div class="why-box">
          <div class="why-icon"><i class="fa-solid fa-id-card"></i></div>
          <h4>Thủ Tục Đơn Giản</h4>
          <p>Chỉ cần CCCD/CMND, không yêu cầu chứng minh tài sản phức tạp.</p>
        </div>

        <div class="why-box">
          <div class="why-icon"><i class="fa-solid fa-bolt"></i></div>
          <h4>Duyệt Nhanh 15 Phút</h4>
          <p>Hệ thống hỗ trợ kiểm tra và thẩm định hồ sơ tự động siêu tốc.</p>
        </div>

        <div class="why-box">
          <div class="why-icon"><i class="fa-solid fa-lock"></i></div>
          <h4>Bảo Mật 100%</h4>
          <p>Mọi thông tin cá nhân và tài chính được mã hóa bảo mật tuyệt đối.</p>
        </div>

        <div class="why-box">
          <div class="why-icon"><i class="fa-solid fa-handshake-simple"></i></div>
          <h4>Hỗ Trợ Nợ Xấu CIC</h4>
          <p>Tư vấn giải pháp cơ cấu lại nợ và xử lý điểm tín dụng CIC xấu.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- FORM REGISTRATION -->
  <section class="section-padding" id="register">
    <div class="container" style="max-width:700px;">
      <div class="form-box">
        <div class="title-center" style="margin-bottom:30px;">
          <div class="badge-pill">TƯ VẤN 1:1 MIỄN PHÍ</div>
          <h2>ĐĂNG KÝ HỒ SƠ TÀI CHÍNH VIB</h2>
        </div>

        <form id="regForm">
          <div class="form-group">
            <label>Họ và Tên Khách Hàng (*)</label>
            <input type="text" class="form-input" placeholder="Nhập họ và tên của bạn" required />
          </div>

          <div class="form-group">
            <label>Số Điện Thoại Zalo (*)</label>
            <input type="tel" class="form-input" placeholder="Nhập số điện thoại Zalo" required />
          </div>

          <div class="form-group">
            <label>Nhu Cầu Của Bạn (*)</label>
            <select class="form-input">
              <option>Mở Thẻ Tín Dụng Hạn Mức Cao</option>
              <option>Vay Tiêu Dùng / Vay Mua Nhà, Xe</option>
              <option>Đáo Hạn & Rút Tiền Thẻ Tín Dụng</option>
            </select>
          </div>

          <div class="form-group">
            <label>Số Tiền Cần Hỗ Trợ Dự Kiến</label>
            <input type="text" class="form-input" placeholder="Ví dụ: 100.000.000 VNĐ" />
          </div>

          <button type="submit" class="btn btn-gold" style="width:100%;"><i class="fa-solid fa-paper-plane"></i> GỬI YÊU CẦU TƯ VẤN</button>
        </form>
      </div>
    </div>
  </section>

  <!-- FOOTER -->
  <footer>
    <div class="container">
      <p style="margin-bottom:10px;">&copy; 2026 Tài Chính Solution VIB. Tất cả quyền được bảo lưu.</p>
      <p style="font-size:12px;">Địa chỉ văn phòng: Tòa nhà Landmark Financial, Quận Cầu Giấy, Hà Nội. Hotline: 1900 6868</p>
    </div>
  </footer>
  `;

  return <div dangerouslySetInnerHTML={{ __html: rawHtml }} />;
}
