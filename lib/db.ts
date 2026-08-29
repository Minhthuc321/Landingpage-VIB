import fs from 'fs';
import path from 'path';
import { CMSStore, CMSData, User, AuditLog, RevisionSnapshot } from './types';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'cms_store.json');

export const IMMUTABLE_VIB_DISCLAIMER =
  "Website này là trang giới thiệu và tiếp nhận nhu cầu tư vấn cá nhân, không phải website giao dịch chính thức của Ngân hàng Quốc tế VIB. Sản phẩm, điều kiện, lãi suất, hạn mức và quyết định phê duyệt phụ thuộc chính sách của ngân hàng tại từng thời kỳ.";

const DEFAULT_CMS_DATA: CMSData = {
  siteSettings: {
    siteName: "Dịch Vụ Tài Chính - Tư Vấn Hạn Mức Cao",
    logoUrl: "",
    faviconUrl: "",
    defaultOgImage: "https://images.unsplash.com/photo-1556742049-0a67daf64f42?q=80&w=800&auto=format&fit=crop",
    contact: {
      phone: "1900 6868",
      zalo: "0988999888",
      facebook: "https://facebook.com",
      tiktok: "https://tiktok.com",
      email: "cskh@minhthucmkt.vn",
      address: "Tòa nhà Landmark Financial, Quận Cầu Giấy, Hà Nội",
      workingHours: "24/7 (Cả Thứ 7, CN và Ngày lễ)",
    },
  },
  seoSettings: {
    seoTitle: "Tư Vấn Giải Pháp Tài Chính - Mở Thẻ Tín Dụng & Vay Vốn Hạn Mức Cao 2026",
    metaDescription: "Chuyên tư vấn mở thẻ tín dụng hạn mức cao, vay tiêu dùng, vay mua nhà/xe uy tín, duyệt nhanh trong 15 phút.",
    canonicalUrl: "https://vib.minhthucmkt.vn",
    ogTitle: "Tư Vấn Giải Pháp Tài Chính - Mở Thẻ Tín Dụng & Vay Vốn Hạn Mức Cao 2026",
    ogDescription: "Chuyên tư vấn mở thẻ tín dụng hạn mức cao, vay tiêu dùng, vay mua nhà/xe uy tín, duyệt nhanh trong 15 phút.",
    ogImage: "https://images.unsplash.com/photo-1556742049-0a67daf64f42?q=80&w=800&auto=format&fit=crop",
    robots: "index, follow",
    immutableDisclaimer: IMMUTABLE_VIB_DISCLAIMER,
    customDisclaimerNote: "Mọi thông tin trên trang được tổng hợp và tư vấn trực tiếp bởi chuyên viên Nguyễn Minh Thức.",
  },
  trackingCodes: {
    gaMeasurementId: "",
    gaEnabled: false,
    gtmContainerId: "",
    gtmEnabled: false,
    metaPixelId: "",
    metaPixelEnabled: false,
  },
  themeSettings: {
    colors: {
      bgMain: "#0f172a",
      navy: "#1e293b",
      primaryBlue: "#2563eb",
      gold: "#f59e0b",
      textMain: "#f8fafc",
      textMuted: "#94a3b8",
      cta: "#f59e0b",
      ctaHover: "#d97706",
      border: "rgba(37, 99, 235, 0.25)",
      cardBg: "rgba(30, 41, 59, 0.85)",
    },
    typography: {
      headingFont: "Montserrat",
      bodyFont: "Plus Jakarta Sans",
      baseFontSize: "16px",
      headingWeight: "700",
      lineHeight: "1.6",
    },
    components: {
      buttonBorderRadius: "50px",
      cardBorderRadius: "14px",
      shadowLevel: "0 15px 35px rgba(37, 99, 235, 0.2)",
      sectionSpacing: "90px",
      containerWidth: "1240px",
      ctaStyle: "solid",
      productCardStyle: "modern_glass",
      stickyHeader: true,
      showTopBar: true,
      showFloatingContact: true,
    },
  },
  sections: [
    {
      id: "sec_topbar",
      key: "topbar",
      name: "Thanh thông báo trên cùng (Top Bar)",
      title: "TƯ VẤN HỒ SƠ TÀI CHÍNH DUYỆT NHANH TRONG 15 PHÚT",
      description: "HOTLINE TƯ VẤN 24/7: 1900 6868 - 0988 999 888",
      enabled: true,
      order: 1,
      icon: "fa-bolt",
    },
    {
      id: "sec_header",
      key: "header",
      name: "Thanh điều hướng (Header)",
      title: "DỊCH VỤ TÀI CHÍNH",
      subtitle: "Giải Pháp Hạn Mức Cao",
      description: "Menu điều hướng chính của trang web",
      enabled: true,
      order: 2,
      icon: "fa-credit-card",
    },
    {
      id: "sec_hero",
      key: "hero",
      name: "Banner chính (Hero Banner)",
      badgeText: "GIẢI PHÁP TÀI CHÍNH DÂN DỤNG & DOANH NGHIỆP",
      title: "MỞ THẺ TÍN DỤNG & VAY VỐN HẠN MỨC CAO",
      description: "Hỗ trợ mở thẻ tín dụng cashback hoàn tiền tới 15%, vay tiêu dùng, vay mua nhà/xe với lãi suất ưu đãi chỉ từ 0.6%/tháng. Thủ tục tối giản, giải ngân nhanh trong ngày.",
      enabled: true,
      order: 3,
      mediaUrl: "https://images.unsplash.com/photo-1556742049-0a67daf64f42?q=80&w=800&auto=format&fit=crop",
      mediaType: "image",
      ctaButtons: [
        { text: "ĐĂNG KÝ HỒ SƠ NGAY", link: "#register", style: "blue", action: "scroll" },
        { text: "TÍNH LÃI SUẤT", link: "#calculator", style: "gold", action: "scroll" },
      ],
      customData: {
        stats: [
          { number: "10,000+", label: "Hồ Sơ Đã Duyệt" },
          { number: "15 Phút", label: "Xử Lý Hồ Sơ" },
          { number: "0 VNĐ", label: "Phí Tư Vấn Ban Đầu" },
        ],
      },
    },
    {
      id: "sec_services",
      key: "services",
      name: "Danh sách sản phẩm tài chính",
      badgeText: "SẢN PHẨM TÀI CHÍNH",
      title: "DỊCH VỤ TƯ VẤN TRỌNG ĐIỂM",
      description: "Các gói giải pháp tài chính hạn mức cao phù hợp từng nhu cầu cá nhân & doanh nghiệp.",
      enabled: true,
      order: 4,
    },
    {
      id: "sec_calculator",
      key: "calculator",
      name: "Công cụ tính khoản vay",
      badgeText: "CÔNG CỤ TỰ ĐỘNG",
      title: "TÍNH TOÁN KHOẢN VAY & TRẢ HÀNG THÁNG",
      description: "Công cụ dự toán giúp bạn biết chính xác số tiền cần trả hàng tháng dựa trên hạn mức vay.",
      enabled: true,
      order: 5,
    },
    {
      id: "sec_why",
      key: "why_us",
      name: "Ưu điểm nổi bật (Why Us)",
      badgeText: "LÝ DO CHỌN CHÚNG TÔI",
      title: "ƯU THẾ VƯỢT TRỘI KHÓ GIAO DỊCH",
      description: "Quy trình chuyên nghiệp, minh bạch và tối ưu điểm tín dụng.",
      enabled: true,
      order: 6,
      customData: {
        highlights: [
          { icon: "fa-id-card", title: "Thủ Tục Đơn Giản", desc: "Chỉ cần CCCD/CMND, không yêu cầu chứng minh tài sản phức tạp." },
          { icon: "fa-bolt", title: "Duyệt Nhanh 15 Phút", desc: "Hệ thống hỗ trợ kiểm tra và thẩm định hồ sơ tự động siêu tốc." },
          { icon: "fa-lock", title: "Bảo Mật 100%", desc: "Mọi thông tin cá nhân và tài chính được mã hóa bảo mật tuyệt đối." },
          { icon: "fa-handshake-simple", title: "Tư Vấn Tận Tâm", desc: "Tư vấn cấu trúc gói vay tối ưu chi phí và điểm tín dụng CIC." },
        ],
      },
    },
    {
      id: "sec_process",
      key: "process",
      name: "Quy trình tư vấn 4 bước",
      badgeText: "QUY TRÌNH LÀM VIỆC",
      title: "4 BƯỚC NHẬN HẠN MỨC VAY / THẺ TÍN DỤNG",
      description: "Đơn giản, minh bạch và nhanh chóng.",
      enabled: true,
      order: 7,
      customData: {
        steps: [
          { step: "01", title: "Đăng Ký Tư Vấn", desc: "Điền form hoặc gọi điện thoại/Zalo tư vấn viên." },
          { step: "02", title: "Thẩm Định Nhanh", desc: "Chuyên viên liên hệ kiểm tra hạn mức & hồ sơ trong 15 phút." },
          { step: "03", title: "Phê Duyệt Hạn Mức", desc: "Ngân hàng phê duyệt cấp thẻ/gói vay đúng điều kiện." },
          { step: "04", title: "Giải Ngân / Nhận Thẻ", desc: "Nhận tiền giải ngân hoặc thẻ tận tay hoàn toàn bảo mật." },
        ],
      },
    },
    {
      id: "sec_nguyen_minh_thuc",
      key: "about_nguyen_minh_thuc",
      name: "Giới thiệu chuyên viên Nguyễn Minh Thức",
      badgeText: "CHUYÊN VIÊN TƯ VẤN CAO CẤP",
      title: "NGUYỄN MINH THỨC - ĐỒNG HÀNH TÀI CHÍNH CỦA BẠN",
      description: "Với hơn 8 năm kinh nghiệm trong lĩnh vực tư vấn giải pháp tài chính ngân hàng và thẻ tín dụng cá nhân, tôi cam kết mang lại gói giải pháp an toàn, tối ưu hạn mức và minh bạch 100%.",
      enabled: true,
      order: 8,
      mediaUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop",
      mediaType: "image",
    },
    {
      id: "sec_faq",
      key: "faq",
      name: "Câu hỏi thường gặp (FAQ)",
      badgeText: "GIẢI ĐÁP THẮC MẮC",
      title: "CÂU HỎI THƯỜNG GẶP CỦA KHÁCH HÀNG",
      description: "Những câu hỏi phổ biến khi làm hồ sơ mở thẻ & vay vốn.",
      enabled: true,
      order: 9,
      customData: {
        faqs: [
          { question: "Mở thẻ tín dụng cần những thủ tục gì?", answer: "Bạn chỉ cần chuẩn bị CCCD gắn chip. Đội ngũ chuyên viên sẽ hỗ trợ kiểm tra hạn mức dựa trên điểm tín dụng cá nhân." },
          { question: "Thời gian duyệt hồ sơ vay mất bao lâu?", answer: "Hồ sơ được xử lý sơ bộ trong 15 phút và ngân hàng giải ngân trong vòng 24 giờ làm việc." },
          { question: "Có thu phí tư vấn ban đầu không?", answer: "Hoàn toàn MIỄN PHÍ 100% phí tư vấn sơ bộ và hỗ trợ lên hồ sơ." },
        ],
      },
    },
    {
      id: "sec_register",
      key: "register_form",
      name: "Form đăng ký tư vấn",
      badgeText: "TƯ VẤN 1:1 MIỄN PHÍ",
      title: "ĐĂNG KÝ HỒ SƠ TÀI CHÍNH",
      description: "Để lại thông tin để nhận hỗ trợ trực tiếp từ chuyên viên tư vấn trong 15 phút.",
      enabled: true,
      order: 10,
    },
    {
      id: "sec_footer",
      key: "footer",
      name: "Chân trang (Footer)",
      title: "Dịch Vụ Tài Chính Solution",
      description: "Tất cả quyền được bảo lưu. Địa chỉ văn phòng: Tòa nhà Landmark Financial, Quận Cầu Giấy, Hà Nội. Hotline: 1900 6868",
      enabled: true,
      order: 11,
    },
  ],
  products: [
    {
      id: "prod_1",
      category: "credit_card",
      title: "Mở Thẻ Tín Dụng Hạn Mức Cao",
      shortDescription: "Hạn mức từ 20 triệu - 500 triệu VNĐ với hạn mức ưu đãi.",
      fullDescription: "Mở thẻ tín dụng các ngân hàng uy tín VIB, VPBank, Techcombank, Sacombank với hạn mức linh hoạt, hỗ trợ duyệt nhanh.",
      icon: "fa-credit-card",
      imageUrl: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=800&auto=format&fit=crop",
      benefits: [
        "Miễn phí phí thường niên năm đầu",
        "Hoàn tiền mua sắm tới 15%",
        "Miễn lãi tối đa 55 ngày",
      ],
      featured: true,
      enabled: true,
      order: 1,
      ctaText: "ĐĂNG KÝ MỞ THẺ",
      ctaAction: "form",
      isDeleted: false,
    },
    {
      id: "prod_2",
      category: "home_loan",
      title: "Vay Mua Nhà / Vay Thế Chấp",
      shortDescription: "Hỗ trợ gói vay chấp/thế chấp hạn mức lên đến 5 tỷ VNĐ.",
      fullDescription: "Gói vay thế chấp tài sản / bất động sản với lãi suất cạnh tranh, thời gian vay tối đa lên tới 35 năm.",
      icon: "fa-house-user",
      imageUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=800&auto=format&fit=crop",
      benefits: [
        "Lãi suất ưu đãi cạnh tranh",
        "Thủ tục hồ sơ đơn giản, tư vấn tận nơi",
        "Hạn mức vay lên tới 85% giá trị tài sản",
      ],
      featured: true,
      enabled: true,
      order: 2,
      ctaText: "TƯ VẤN VAY MUA NHÀ",
      ctaAction: "form",
      isDeleted: false,
    },
    {
      id: "prod_3",
      category: "car_loan",
      title: "Vay Mua Ô Tô Ưu Đãi",
      shortDescription: "Hỗ trợ vay mua xe mới và xe cũ tới 80% giá trị xe.",
      fullDescription: "Giải pháp tài chính tối ưu cho ước mơ sở hữu ô tô cá nhân hoặc kinh doanh với thủ tục phê duyệt nhanh.",
      icon: "fa-car",
      imageUrl: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=800&auto=format&fit=crop",
      benefits: [
        "Duyệt thông báo nợ trong 4 giờ",
        "Thời hạn vay linh hoạt đến 8 năm",
        "Chấp nhận xe kinh doanh & xe cá nhân",
      ],
      featured: true,
      enabled: true,
      order: 3,
      ctaText: "TƯ VẤN VAY MUA XE",
      ctaAction: "form",
      isDeleted: false,
    },
  ],
  mediaAssets: [
    {
      id: "media_1",
      filename: "hero-card.jpg",
      originalName: "hero-card.jpg",
      mimeType: "image/jpeg",
      size: 154000,
      url: "https://images.unsplash.com/photo-1556742049-0a67daf64f42?q=80&w=800&auto=format&fit=crop",
      type: "image",
      altText: "Thẻ tín dụng và tư vấn tài chính",
      caption: "Hình ảnh banner dịch vụ tài chính",
      isDeleted: false,
      createdAt: new Date().toISOString(),
    },
  ],
  navigationItems: [
    { id: "nav_1", location: "header", title: "Giới Thiệu", target: "#about", isExternal: false, openInNewTab: false, enabled: true, order: 1 },
    { id: "nav_2", location: "header", title: "Dịch Vụ", target: "#services", isExternal: false, openInNewTab: false, enabled: true, order: 2 },
    { id: "nav_3", location: "header", title: "Tính Lãi Suất", target: "#calculator", isExternal: false, openInNewTab: false, enabled: true, order: 3 },
    { id: "nav_4", location: "header", title: "Ưu Điểm", target: "#why", isExternal: false, openInNewTab: false, enabled: true, order: 4 },
    { id: "nav_5", location: "header", title: "Đăng Ký", target: "#register", isExternal: false, openInNewTab: false, enabled: true, order: 5 },
  ],
};

function ensureDataDirExists() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export function getCMSStore(): CMSStore {
  ensureDataDirExists();
  if (!fs.existsSync(DB_FILE)) {
    const defaultStore: CMSStore = {
      status: "published",
      lastSavedAt: new Date().toISOString(),
      lastPublishedAt: new Date().toISOString(),
      lastModifiedBy: "System Administrator",
      published: DEFAULT_CMS_DATA,
      draft: DEFAULT_CMS_DATA,
      revisions: [],
      users: [
        {
          id: "usr_admin",
          email: "admin@minhthucmkt.vn",
          name: "Nguyễn Minh Thức (Admin)",
          // Password: MinhThuc2026@Admin
          passwordHash: "$2a$10$wO3K02p2Y3eM.dZ3Zg0Yg.jXb9Y4gN1s9d8f7e6d5c4b3a2f1e0d9", // Default fallback bcrypt hash
          role: "admin",
          createdAt: new Date().toISOString(),
        },
      ],
      auditLogs: [
        {
          id: "log_1",
          timestamp: new Date().toISOString(),
          userId: "usr_admin",
          userName: "System Administrator",
          action: "INITIALIZE_CMS",
          details: "Khởi tạo hệ thống dữ liệu CMS cho website vib.minhthucmkt.vn",
        },
      ],
    };
    saveCMSStore(defaultStore);
    return defaultStore;
  }

  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const store: CMSStore = JSON.parse(raw);

    // Enforce immutable disclaimer
    if (store.published?.seoSettings) {
      store.published.seoSettings.immutableDisclaimer = IMMUTABLE_VIB_DISCLAIMER;
    }
    if (store.draft?.seoSettings) {
      store.draft.seoSettings.immutableDisclaimer = IMMUTABLE_VIB_DISCLAIMER;
    }

    return store;
  } catch (err) {
    console.error("Error reading CMS store, restoring default:", err);
    const fallbackStore: CMSStore = {
      status: "published",
      lastSavedAt: new Date().toISOString(),
      lastPublishedAt: new Date().toISOString(),
      lastModifiedBy: "System Fallback",
      published: DEFAULT_CMS_DATA,
      draft: DEFAULT_CMS_DATA,
      revisions: [],
      users: [],
      auditLogs: [],
    };
    return fallbackStore;
  }
}

export function saveCMSStore(store: CMSStore): void {
  ensureDataDirExists();
  // Always lock immutable disclaimer before write
  if (store.published?.seoSettings) {
    store.published.seoSettings.immutableDisclaimer = IMMUTABLE_VIB_DISCLAIMER;
  }
  if (store.draft?.seoSettings) {
    store.draft.seoSettings.immutableDisclaimer = IMMUTABLE_VIB_DISCLAIMER;
  }

  fs.writeFileSync(DB_FILE, JSON.stringify(store, null, 2), 'utf-8');
}

export function getPublishedCMSData(): CMSData {
  const store = getCMSStore();
  return store.published || DEFAULT_CMS_DATA;
}

export function getDraftCMSData(): CMSData {
  const store = getCMSStore();
  return store.draft || store.published || DEFAULT_CMS_DATA;
}

export function saveDraftCMSData(data: CMSData, modifiedBy: string): void {
  const store = getCMSStore();
  store.draft = data;
  store.status = "draft";
  store.lastSavedAt = new Date().toISOString();
  store.lastModifiedBy = modifiedBy;

  store.auditLogs.unshift({
    id: `log_${Date.now()}`,
    timestamp: new Date().toISOString(),
    userId: modifiedBy,
    userName: modifiedBy,
    action: "SAVE_DRAFT",
    details: "Đã lưu bản nháp mới cho website",
  });

  saveCMSStore(store);
}

export function publishCMSData(modifiedBy: string, note?: string): void {
  const store = getCMSStore();
  const timestamp = new Date().toISOString();

  // Create revision snapshot of current published data before publishing new
  const revisionSnapshot: RevisionSnapshot = {
    id: `rev_${Date.now()}`,
    timestamp: store.lastPublishedAt || timestamp,
    modifiedBy: store.lastModifiedBy || modifiedBy,
    note: note || "Bản xuất bản tự động",
    snapshot: JSON.parse(JSON.stringify(store.published)),
  };

  store.revisions.unshift(revisionSnapshot);
  // Keep max 20 revisions
  if (store.revisions.length > 20) {
    store.revisions = store.revisions.slice(0, 20);
  }

  store.published = JSON.parse(JSON.stringify(store.draft));
  store.status = "published";
  store.lastPublishedAt = timestamp;
  store.lastModifiedBy = modifiedBy;

  store.auditLogs.unshift({
    id: `log_${Date.now()}`,
    timestamp,
    userId: modifiedBy,
    userName: modifiedBy,
    action: "PUBLISH_WEBSITE",
    details: note ? `Xuất bản website công khai. Ghi chú: ${note}` : "Xuất bản bản nháp mới ra website công khai",
  });

  saveCMSStore(store);
}

export function rollbackCMSRevision(revisionId: string, modifiedBy: string): boolean {
  const store = getCMSStore();
  const target = store.revisions.find((r) => r.id === revisionId);
  if (!target) return false;

  const timestamp = new Date().toISOString();

  // Save current published as revision before rollback
  store.revisions.unshift({
    id: `rev_${Date.now()}`,
    timestamp,
    modifiedBy,
    note: `Phiên bản trước khi khôi phục về ${revisionId}`,
    snapshot: JSON.parse(JSON.stringify(store.published)),
  });

  store.draft = JSON.parse(JSON.stringify(target.snapshot));
  store.published = JSON.parse(JSON.stringify(target.snapshot));
  store.status = "published";
  store.lastPublishedAt = timestamp;
  store.lastModifiedBy = modifiedBy;

  store.auditLogs.unshift({
    id: `log_${Date.now()}`,
    timestamp,
    userId: modifiedBy,
    userName: modifiedBy,
    action: "ROLLBACK_REVISION",
    details: `Đã khôi phục giao diện & nội dung về phiên bản [${revisionId}] (${target.timestamp})`,
  });

  saveCMSStore(store);
  return true;
}
