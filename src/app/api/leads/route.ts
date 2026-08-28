import { NextRequest, NextResponse } from "next/server";
import { leadSchema } from "@/lib/lead";
const buckets = new Map<string,{count:number;reset:number}>();
export async function POST(request:NextRequest) {
 const ip=request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()||"unknown"; const now=Date.now(); const item=buckets.get(ip);
 if(item&&item.reset>now&&item.count>=5) return NextResponse.json({message:"Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau."},{status:429});
 buckets.set(ip,!item||item.reset<=now?{count:1,reset:now+600000}:{...item,count:item.count+1});
 let body:unknown; try{body=await request.json()}catch{return NextResponse.json({message:"Dữ liệu không hợp lệ."},{status:400})}
 const parsed=leadSchema.safeParse(body); if(!parsed.success) return NextResponse.json({message:"Vui lòng kiểm tra lại thông tin.",issues:parsed.error.flatten().fieldErrors},{status:400});
 if(parsed.data.website) return NextResponse.json({message:"Yêu cầu không hợp lệ."},{status:400});
 const url=process.env.LEAD_WEBHOOK_URL; if(!url) return NextResponse.json({message:process.env.NODE_ENV==="development"?"Webhook tiếp nhận chưa được cấu hình.":"Hệ thống tiếp nhận đang tạm thời chưa sẵn sàng."},{status:503});
 const controller=new AbortController(); const timer=setTimeout(()=>controller.abort(),8000);
 try { const response=await fetch(url,{method:"POST",headers:{"content-type":"application/json",...(process.env.LEAD_WEBHOOK_SECRET?{"x-webhook-secret":process.env.LEAD_WEBHOOK_SECRET}:{})},body:JSON.stringify({...parsed.data,website:undefined,source:"vib.minhthucmkt.vn",submittedAt:new Date().toISOString()}),signal:controller.signal}); if(!response.ok) throw new Error(); return NextResponse.json({message:"Đã ghi nhận yêu cầu. Nguyễn Minh Thức sẽ liên hệ theo thông tin bạn cung cấp."},{status:201}); } catch { return NextResponse.json({message:"Chưa thể gửi yêu cầu lúc này. Vui lòng thử lại hoặc dùng kênh liên hệ trực tiếp."},{status:502}); } finally {clearTimeout(timer)}
}
