# Landing page Nguyễn Minh Thức

Landing page Next.js tiếp nhận nhu cầu tư vấn các sản phẩm liên quan đến VIB tại Hải Phòng.

## Chạy local

Yêu cầu Node.js 20+. Sao chép `.env.example` thành `.env.local`, điền các kênh liên hệ thật rồi chạy:

```bash
npm install
npm run dev
```

## Tiếp nhận lead / n8n

Đặt URL Production Webhook của node **Webhook** n8n vào `LEAD_WEBHOOK_URL`. Nếu cần xác thực, đặt cùng secret tại `LEAD_WEBHOOK_SECRET` và kiểm tra header `x-webhook-secret` trong workflow. Endpoint `/api/leads` gửi JSON đã chuẩn hóa với `source` và `submittedAt`. Apps Script, dịch vụ email hoặc CRM có thể dùng cùng hợp đồng webhook.

Khi webhook chưa được cấu hình, API trả lỗi an toàn và không báo thành công giả.

## Triển khai

Import repository vào Vercel, khai báo biến môi trường, deploy, sau đó thêm domain `vib.minhthucmkt.vn` và cấu hình bản ghi DNS theo hướng dẫn Vercel. Thay ảnh placeholder tại `public/images/profile/nguyen-minh-thuc-placeholder.svg` bằng ảnh được phép sử dụng (giữ tên hoặc cập nhật đường dẫn).
