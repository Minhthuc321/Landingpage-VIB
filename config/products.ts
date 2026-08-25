export type Product = { title:string; shortTitle:string; description:string; benefits:string[]; eligibilityNotes:null; interestRate:null; maxLoanRatio:null; maxLoanAmount:null; loanTenor:null; promotion:null; lastUpdated:null; disclaimer:string };
const policy = { eligibilityNotes:null, interestRate:null, maxLoanRatio:null, maxLoanAmount:null, loanTenor:null, promotion:null, lastUpdated:null, disclaimer:"Liên hệ để cập nhật chính sách hiện hành." } as const;
export const products: Record<"creditCard"|"homeLoan"|"mortgage"|"autoLoan", Product> = {
 creditCard:{...policy,title:"THẺ TÍN DỤNG VIB",shortTitle:"Thẻ tín dụng",description:"Tìm hiểu dòng thẻ phù hợp với nhu cầu chi tiêu, hoàn tiền, tích điểm, du lịch và phong cách sống.",benefits:["Chi tiêu","Hoàn tiền","Tích điểm","Du lịch"]},
 homeLoan:{...policy,title:"VAY MUA NHÀ",shortTitle:"Vay mua nhà",description:"Trao đổi phương án tài chính cho nhu cầu mua nhà hoặc vay có tài sản bảo đảm.",benefits:["Ước tính khoản vay","Phân tích dòng tiền","Hỗ trợ hồ sơ","Theo dõi phương án"]},
 mortgage:{...policy,title:"VAY THẾ CHẤP",shortTitle:"Vay thế chấp",description:"Trao đổi phương án tài chính cho nhu cầu vay có tài sản bảo đảm.",benefits:["Phân tích nhu cầu","Dòng tiền dự kiến","Hỗ trợ hồ sơ","Theo dõi phương án"]},
 autoLoan:{...policy,title:"VAY MUA Ô TÔ",shortTitle:"Vay mua ô tô",description:"Ước tính vốn ban đầu, khoản vay và khoản thanh toán dự kiến cho kế hoạch mua xe.",benefits:["Xe mới","Xe đã qua sử dụng","Vốn tự có","Khoản trả hàng tháng"]}
};
