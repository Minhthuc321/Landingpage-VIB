import { z } from "zod";
export const productIds = ["card","home","car","other"] as const;
export const normalizePhone = (v:string) => v.replace(/[^\d+]/g,"").replace(/^\+84/,"0");
export const leadSchema = z.object({product:z.enum(productIds),name:z.string().trim().min(2,"Vui lòng nhập họ tên").max(80),phone:z.string().transform(normalizePhone).pipe(z.string().regex(/^0(3|5|7|8|9)\d{8}$/,"Số điện thoại Việt Nam chưa hợp lệ")),city:z.string().trim().min(2,"Vui lòng nhập tỉnh/thành phố").max(80),time:z.string().trim().min(1,"Vui lòng chọn khung giờ"),note:z.string().trim().max(500).optional().default(""),consent:z.literal(true,{error:"Bạn cần đồng ý trước khi gửi"}),website:z.string().max(0).optional().default("")});
export type LeadInput = z.input<typeof leadSchema>;
