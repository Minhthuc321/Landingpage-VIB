export type ProductId = "card" | "home" | "car" | "other";
export type Product = { id: ProductId; anchor:string; title:string; description:string; benefits:string[]; cta:string; image:string; rate:null; limit:null; term:null; fee:null };
export const products: Product[] = [
 {id:"card",anchor:"the-tin-dung",title:"Thẻ tín dụng VIB",description:"Tiếp nhận nhu cầu và đồng hành lựa chọn dòng thẻ phù hợp cách chi tiêu.",benefits:["Lắng nghe nhu cầu","Thông tin dễ hiểu","Hỗ trợ chuẩn bị hồ sơ"],cta:"Tư vấn mở thẻ",image:"/images/products/card.svg",rate:null,limit:null,term:null,fee:null},
 {id:"home",anchor:"vay-the-chap",title:"Vay mua nhà / vay thế chấp",description:"Cùng bạn làm rõ mục tiêu nhà ở và chuẩn bị thông tin cho phương án tài chính.",benefits:["Trao đổi mục tiêu","Hướng dẫn giấy tờ","Theo dõi quá trình"],cta:"Tư vấn khoản vay",image:"/images/products/home.svg",rate:null,limit:null,term:null,fee:null},
 {id:"car",anchor:"vay-mua-o-to",title:"Vay mua ô tô",description:"Hỗ trợ tiếp nhận nhu cầu tài chính khi bạn đang lên kế hoạch sở hữu xe.",benefits:["Xác định nhu cầu","Danh mục hồ sơ rõ ràng","Chủ động kết nối"],cta:"Tư vấn mua xe",image:"/images/products/car.svg",rate:null,limit:null,term:null,fee:null}
];
