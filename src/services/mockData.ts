// ============================================================
// CENTRALIZED MOCK DATA — NiChan Event
// Khi có backend thật, chỉ cần thay đổi file api.ts
// ============================================================

import heroImg from "@/assets/hero-wedding.jpg";
import eventGala from "@/assets/event-gala.jpg";
import eventOpening from "@/assets/event-opening.jpg";
import eventConference from "@/assets/event-conference.jpg";
import portfolio1 from "@/assets/portfolio-1.jpg";
import portfolio2 from "@/assets/portfolio-2.jpg";
import portfolio3 from "@/assets/portfolio-3.jpg";

// ─── TYPES ───────────────────────────────────────────────────
export type ServiceItem = { title: string; desc: string; image: string; slug: string };
export type Stat = { number: string; label: string };
export type Testimonial = { name: string; role: string; text: string; rating: number };
export type PortfolioItem = { title: string; category: string; guests: number; image: string };

export type ServiceListing = {
  id: number; title: string; category: string; price: string; guests: string;
  location: string; image: string; desc: string;
};

export type CustomerEvent = {
  id: number; name: string; type: string; date: string; status: string;
  progress: number; manager: string; location?: string; guests?: number; budget?: string;
};

export type Contract = {
  id: number; event: string; number: string; date: string; value: string;
  status: string; version: string;
  details: { parties: string; scope: string; payment: string; terms: string };
};

export type Review = {
  id: number; event: string; date: string; rating: number; comment: string; submitted: boolean;
};

export type ReviewCriterion = { key: string; label: string };

export type Milestone = { id: number; title: string; date: string; status: string; desc: string };
export type ChatMessage = { id: number; sender: string; role: string; text: string; time: string; isManager: boolean };
export type Document = { name: string; type: string; date: string; status: string };
export type Transaction = { desc: string; amount: string; date: string; method: string; status: string };

export type KanbanTask = { id: number; title: string; assignee: string; due: string; priority: "high" | "medium" | "low" };
export type KanbanColumn = { id: string; title: string; color: string; tasks: KanbanTask[] };
export type GanttItem = { task: string; start: number; duration: number; project: string; color: string };

export type OrgStaff = {
  id: number; name: string; role: string; phone: string; email: string;
  status: "Đang làm" | "Nghỉ" | "Đang bận"; avatar: string; currentProject: string; shift: string;
};
export type ShiftDay = { day: string; slots: { name: string; time: string }[] };

export type Vendor = {
  id: number; name: string; category: string; contact: string; address: string;
  rating: number; projects: number; status: "Đang hợp tác" | "Tạm ngưng";
};

export type BudgetItem = { id: number; category: string; estimated: number; actual: number; note: string };
export type ProjectBudget = { project: string; items: BudgetItem[] };

export type CompletedEvent = {
  id: number; name: string; date: string; type: string; guests: number;
  budget: number; actual: number; rating: number; feedback: string;
  highlights: string[]; issues: string[]; photos: number;
};

export type Notification = { id: number; text: string; time: string; read: boolean };

export type OrganizerAccount = {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  avatar: string;
};

export const mockOrganizerAccounts: OrganizerAccount[] = [
  { id: "lan", name: "Nguyễn Thị Lan", role: "Event Manager", email: "lan@eternal.vn", phone: "0901 234 567", avatar: "L" },
  { id: "duc", name: "Trần Văn Đức", role: "Event Manager", email: "duc@eternal.vn", phone: "0912 345 678", avatar: "Đ" },
  { id: "hoa", name: "Phạm Thị Hoa", role: "Floral Designer", email: "hoa@eternal.vn", phone: "0923 456 789", avatar: "H" },
  { id: "tam", name: "Lê Minh Tâm", role: "Sound Engineer", email: "tam@eternal.vn", phone: "0934 567 890", avatar: "T" },
];

export type AdminRequest = {
  id: string; name: string; phone: string; email: string; event: string;
  date: string; guests: number; budget: string; status: string; created: string; manager: string; note: string;
};

export type AdminUser = {
  id: number; name: string; email: string; phone: string; role: string;
  status: string; lastLogin: string; events: string;
};

export type AdminContract = {
  id: string; event: string; customer: string; value: string; date: string; status: string; version: string;
};

export type ProjectFinance = {
  project: string; budget: number; spent: number; revenue: number; profit: number; status: string;
};

export type ContentPortfolioItem = { id: number; title: string; category: string; status: string; views: number };
export type ContentBlogPost = { id: number; title: string; category: string; status: string; date: string; views: number };
export type ContentReview = { id: number; customer: string; event: string; rating: number; comment: string; status: string };

export type RecentActivity = { text: string; time: string; iconName: string };

// ─── PUBLIC DATA ─────────────────────────────────────────────
export const mockPublicServices: ServiceItem[] = [
  { title: "Tiệc Cưới", desc: "Ngày trọng đại, kỷ niệm vĩnh cửu", image: heroImg, slug: "tiec-cuoi" },
  { title: "Gala Dinner", desc: "Đêm tiệc sang trọng & ấn tượng", image: eventGala, slug: "gala-dinner" },
  { title: "Khai Trương", desc: "Khởi đầu rực rỡ cho doanh nghiệp", image: eventOpening, slug: "khai-truong" },
  { title: "Hội Nghị", desc: "Chuyên nghiệp, đẳng cấp quốc tế", image: eventConference, slug: "hoi-nghi" },
];

export const mockStats: Stat[] = [
  { number: "500+", label: "Sự kiện thành công" },
  { number: "12+", label: "Năm kinh nghiệm" },
  { number: "98%", label: "Khách hàng hài lòng" },
  { number: "50+", label: "Đối tác tin cậy" },
];

export const mockTestimonials: Testimonial[] = [
  { name: "Nguyễn Thanh Hà", role: "CEO, Công ty ABC", text: "NiChan Events đã biến đám cưới của tôi thành một giấc mơ cổ tích. Mọi chi tiết đều hoàn hảo!", rating: 5 },
  { name: "Trần Minh Đức", role: "Giám đốc Marketing, XYZ Corp", text: "Sự kiện khai trương được tổ chức chuyên nghiệp, vượt ngoài mong đợi. Chắc chắn sẽ hợp tác lâu dài!", rating: 5 },
  { name: "Lê Thị Hương", role: "Phó TGĐ, Tập đoàn DEF", text: "Gala dinner cuối năm quá ấn tượng! Đội ngũ sáng tạo, tận tâm và luôn lắng nghe khách hàng.", rating: 5 },
];

export const mockPortfolioItems: PortfolioItem[] = [
  { title: "Tiệc Cưới Hoa Anh Đào", category: "Wedding", guests: 300, image: portfolio1 },
  { title: "Anniversary Gala Night", category: "Gala", guests: 500, image: portfolio2 },
  { title: "Festival Road Show 2025", category: "Road Show", guests: 2000, image: portfolio3 },
];

export const mockServiceCategories = ["Tất cả", "Tiệc cưới", "Khai trương", "Gala Dinner", "Hội nghị", "Road Show", "Kỷ niệm", "Online Event"];

export const mockAllServices: ServiceListing[] = [
  { id: 1, title: "Tiệc Cưới Truyền Thống", category: "Tiệc cưới", price: "150 - 300 triệu", guests: "100-300", location: "TP.HCM", image: heroImg, desc: "Tiệc cưới mang phong cách truyền thống Việt Nam kết hợp hiện đại, trang trọng và ấm cúng." },
  { id: 2, title: "Gala Dinner Doanh Nghiệp", category: "Gala Dinner", price: "200 - 500 triệu", guests: "200-500", location: "TP.HCM", image: eventGala, desc: "Đêm tiệc sang trọng với chương trình giải trí đặc sắc, phù hợp cho tiệc cuối năm." },
  { id: 3, title: "Lễ Khai Trương", category: "Khai trương", price: "50 - 150 triệu", guests: "50-200", location: "Hà Nội", image: eventOpening, desc: "Tổ chức lễ khai trương chuyên nghiệp, tạo ấn tượng mạnh mẽ cho ngày đầu tiên." },
  { id: 4, title: "Hội Nghị Quốc Tế", category: "Hội nghị", price: "300 - 800 triệu", guests: "100-1000", location: "Đà Nẵng", image: eventConference, desc: "Hội nghị đẳng cấp quốc tế với hệ thống âm thanh, ánh sáng hiện đại nhất." },
  { id: 5, title: "Tiệc Cưới Outdoor", category: "Tiệc cưới", price: "200 - 400 triệu", guests: "100-200", location: "Đà Lạt", image: portfolio1, desc: "Tiệc cưới ngoài trời lãng mạn với hoa tươi và ánh nến lung linh." },
  { id: 6, title: "Tiệc Kỷ Niệm Thành Lập", category: "Kỷ niệm", price: "100 - 300 triệu", guests: "100-500", location: "TP.HCM", image: portfolio2, desc: "Kỷ niệm ngày thành lập doanh nghiệp với chương trình ý nghĩa và ấn tượng." },
  { id: 7, title: "Road Show Activation", category: "Road Show", price: "100 - 250 triệu", guests: "500-2000", location: "Toàn quốc", image: portfolio3, desc: "Sự kiện roadshow quảng bá thương hiệu sôi động, thu hút khách hàng tiềm năng." },
  { id: 8, title: "Hội Thảo Chuyên Đề", category: "Hội nghị", price: "80 - 200 triệu", guests: "50-300", location: "TP.HCM", image: eventConference, desc: "Hội thảo chuyên sâu với hệ thống streaming trực tuyến tích hợp." },
];

// ─── CUSTOMER DATA ───────────────────────────────────────────
export const mockCustomerEvents: CustomerEvent[] = [
  { id: 1, name: "Tiệc cưới Minh & Hà", type: "Tiệc cưới", date: "2026-05-15", status: "Đang chuẩn bị", progress: 65, manager: "Nguyễn Thị Lan", location: "GEM Center, Q.1, TP.HCM", guests: 300, budget: "250,000,000đ" },
  { id: 2, name: "Khai trương Chi nhánh 3", type: "Khai trương", date: "2026-04-20", status: "Đã báo giá", progress: 25, manager: "Trần Văn Đức", location: "Quận 7, TP.HCM", guests: 150, budget: "80,000,000đ" },
  { id: 3, name: "Gala cuối năm 2025", type: "Gala Dinner", date: "2025-12-20", status: "Hoàn thành", progress: 100, manager: "Nguyễn Thị Lan", location: "Sheraton Saigon", guests: 500, budget: "450,000,000đ" },
];

export const mockRecentActivities: RecentActivity[] = [
  { text: "Báo giá cho 'Khai trương Chi nhánh 3' đã được gửi", time: "2 giờ trước", iconName: "FileText" },
  { text: "Task 'Đặt venue' đã hoàn thành cho tiệc cưới", time: "1 ngày trước", iconName: "CheckCircle" },
  { text: "Thanh toán đặt cọc 30% đã xác nhận", time: "3 ngày trước", iconName: "CreditCard" },
  { text: "Tin nhắn mới từ Event Manager Lan", time: "5 ngày trước", iconName: "MessageSquare" },
];

export const mockContracts: Contract[] = [
  { id: 1, event: "Tiệc cưới Minh & Hà", number: "HD-2026-001", date: "19/03/2026", value: "250,000,000đ", status: "Hiệu lực", version: "1.0",
    details: { parties: "NiChan Events & Nguyễn Thanh Hà", scope: "Tổ chức trọn gói tiệc cưới 300 khách tại GEM Center", payment: "Đặt cọc 30% → 40% trước 14 ngày → 30% sau sự kiện", terms: "Hủy trước 30 ngày: hoàn 50% cọc. Hủy trong 30 ngày: không hoàn." } },
  { id: 2, event: "Gala cuối năm 2025", number: "HD-2025-012", date: "15/11/2025", value: "450,000,000đ", status: "Thanh lý", version: "1.2",
    details: { parties: "NiChan Events & Lê Thị Hương", scope: "Tổ chức Gala Dinner 500 khách tại Sheraton Saigon", payment: "Đã thanh toán 100%", terms: "Hợp đồng đã thanh lý." } },
];

export const mockReviews: Review[] = [
  { id: 1, event: "Gala cuối năm 2025", date: "20/12/2025", rating: 5, comment: "Tổ chức rất chuyên nghiệp, khách mời hài lòng! Sân khấu đẹp, âm thanh tốt, menu ngon.", submitted: true },
  { id: 2, event: "Tiệc cưới Minh & Hà", date: "15/05/2026", rating: 0, comment: "", submitted: false },
];

export const mockReviewCriteria: ReviewCriterion[] = [
  { key: "venue", label: "Địa điểm & Không gian" },
  { key: "service", label: "Dịch vụ & Thái độ nhân viên" },
  { key: "food", label: "Ẩm thực & Tiệc" },
  { key: "decor", label: "Trang trí & Décor" },
  { key: "overall", label: "Hài lòng tổng thể" },
];

export const mockMilestones: Milestone[] = [
  { id: 1, title: "Xác nhận yêu cầu", date: "15/03/2026", status: "done", desc: "Yêu cầu đã được tiếp nhận và xác nhận" },
  { id: 2, title: "Báo giá & Thống nhất", date: "17/03/2026", status: "done", desc: "Báo giá đã được gửi và xác nhận bởi khách hàng" },
  { id: 3, title: "Ký hợp đồng & Đặt cọc", date: "19/03/2026", status: "done", desc: "Hợp đồng đã ký, đặt cọc 30% đã thanh toán" },
  { id: 4, title: "Lên kế hoạch chi tiết", date: "22/03/2026", status: "current", desc: "Đang lập kế hoạch chi tiết cho sự kiện" },
  { id: 5, title: "Đặt venue & Nhà cung cấp", date: "01/04/2026", status: "pending", desc: "Liên hệ và xác nhận venue, catering, décor" },
  { id: 6, title: "Tổng duyệt", date: "12/05/2026", status: "pending", desc: "Tổng duyệt toàn bộ chương trình" },
  { id: 7, title: "Ngày sự kiện", date: "15/05/2026", status: "pending", desc: "Ngày diễn ra sự kiện chính thức" },
];

export const mockChatMessages: ChatMessage[] = [
  { id: 1, sender: "Nguyễn Thị Lan", role: "Event Manager", text: "Chào chị Hà, em đã gửi 3 options cho venue, chị xem giúp em nhé!", time: "10:30 AM", isManager: true },
  { id: 2, sender: "Bạn", role: "", text: "Em ơi, chị thích option 2 - GEM Center nhé. Nhưng cần hỏi thêm về sức chứa.", time: "11:15 AM", isManager: false },
  { id: 3, sender: "Nguyễn Thị Lan", role: "Event Manager", text: "Dạ, GEM Center chứa tối đa 350 khách, phù hợp với yêu cầu 300 khách của chị ạ. Em sẽ liên hệ đặt ngay.", time: "11:45 AM", isManager: true },
];

export const mockDocuments: Document[] = [
  { name: "Hợp đồng tổ chức sự kiện v1.0", type: "PDF", date: "19/03/2026", status: "Đã ký" },
  { name: "Báo giá chi tiết", type: "PDF", date: "17/03/2026", status: "Đã xác nhận" },
  { name: "Layout sân khấu - Option 2", type: "PNG", date: "22/03/2026", status: "Chờ duyệt" },
  { name: "Menu tiệc cưới", type: "PDF", date: "22/03/2026", status: "Chờ duyệt" },
];

export const mockTransactions: Transaction[] = [
  { desc: "Đặt cọc 30%", amount: "75,000,000đ", date: "19/03/2026", method: "VNPay", status: "Thành công" },
  { desc: "Thanh toán đợt 2 (40%)", amount: "100,000,000đ", date: "01/05/2026", method: "—", status: "Chưa thanh toán" },
  { desc: "Thanh toán cuối (30%)", amount: "75,000,000đ", date: "20/05/2026", method: "—", status: "Chưa thanh toán" },
];

// ─── ORGANIZER DATA ──────────────────────────────────────────
export const mockKanbanColumns: KanbanColumn[] = [
  { id: "todo", title: "Chờ xử lý", color: "bg-muted", tasks: [
    { id: 1, title: "Liên hệ venue backup", assignee: "Trần Đức", due: "28/03", priority: "medium" },
    { id: 2, title: "Lên menu cho tiệc cưới", assignee: "Phạm Hoa", due: "30/03", priority: "high" },
    { id: 3, title: "Thiết kế thiệp mời", assignee: "Lê Mai", due: "02/04", priority: "low" },
  ]},
  { id: "progress", title: "Đang thực hiện", color: "bg-primary", tasks: [
    { id: 4, title: "Xác nhận GEM Center", assignee: "Nguyễn Lan", due: "25/03", priority: "high" },
    { id: 5, title: "Đặt hoa trang trí", assignee: "Phạm Hoa", due: "27/03", priority: "medium" },
  ]},
  { id: "review", title: "Chờ duyệt", color: "bg-accent", tasks: [
    { id: 6, title: "Layout sân khấu v2", assignee: "Trần Đức", due: "26/03", priority: "high" },
  ]},
  { id: "done", title: "Hoàn thành", color: "bg-secondary", tasks: [
    { id: 7, title: "Ký hợp đồng khách hàng", assignee: "Nguyễn Lan", due: "19/03", priority: "high" },
    { id: 8, title: "Thu đặt cọc 30%", assignee: "Nguyễn Lan", due: "19/03", priority: "high" },
  ]},
];

export const mockGanttData: GanttItem[] = [
  { task: "Lên kế hoạch", start: 0, duration: 15, project: "Tiệc cưới Minh & Hà", color: "bg-primary" },
  { task: "Đặt venue & NCC", start: 10, duration: 20, project: "Tiệc cưới Minh & Hà", color: "bg-primary/70" },
  { task: "Thiết kế & Décor", start: 20, duration: 25, project: "Tiệc cưới Minh & Hà", color: "bg-secondary" },
  { task: "Tổng duyệt", start: 42, duration: 5, project: "Tiệc cưới Minh & Hà", color: "bg-accent" },
  { task: "Ngày sự kiện", start: 48, duration: 2, project: "Tiệc cưới Minh & Hà", color: "bg-destructive" },
  { task: "Lên kế hoạch", start: 0, duration: 10, project: "Khai trương ABC", color: "bg-secondary" },
  { task: "Setup & Thi công", start: 8, duration: 15, project: "Khai trương ABC", color: "bg-secondary/70" },
  { task: "Event day", start: 22, duration: 2, project: "Khai trương ABC", color: "bg-destructive" },
];

export const mockOrgProjectProgress = [
  { name: "Tiệc cưới Minh & Hà", progress: 65, status: "Đang chạy", deadline: "15/05/2026", budget: "250tr", spent: "120tr" },
  { name: "Khai trương ABC Corp", progress: 30, status: "Đang chạy", deadline: "20/04/2026", budget: "80tr", spent: "25tr" },
  { name: "Hội nghị CNTT 2026", progress: 10, status: "Mới nhận", deadline: "10/07/2026", budget: "100tr", spent: "15tr" },
];

export const mockTasksByStatus = [
  { name: "Hoàn thành", value: 24, color: "hsl(113 33% 31%)" },
  { name: "Đang làm", value: 12, color: "hsl(355 63% 42%)" },
  { name: "Chờ xử lý", value: 8, color: "hsl(38 35% 70%)" },
  { name: "Quá hạn", value: 3, color: "hsl(355 55% 53%)" },
];

export const mockWeeklyWorkload = [
  { day: "T2", tasks: 5 }, { day: "T3", tasks: 8 }, { day: "T4", tasks: 6 },
  { day: "T5", tasks: 9 }, { day: "T6", tasks: 7 }, { day: "T7", tasks: 3 }, { day: "CN", tasks: 1 },
];

export const mockUpcomingTasks = [
  { task: "Xác nhận menu với nhà cung cấp", project: "Tiệc cưới Minh & Hà", due: "Hôm nay", urgent: true },
  { task: "Gửi layout sân khấu cho khách", project: "Tiệc cưới Minh & Hà", due: "Ngày mai", urgent: false },
  { task: "Đặt venue cho khai trương", project: "Khai trương ABC Corp", due: "27/03", urgent: false },
  { task: "Họp kickoff dự án CNTT", project: "Hội nghị CNTT 2026", due: "28/03", urgent: false },
  { task: "Duyệt báo giá décor", project: "Tiệc cưới Minh & Hà", due: "29/03", urgent: false },
];

export const mockOrgStaff: OrgStaff[] = [
  { id: 1, name: "Nguyễn Thị Lan", role: "Event Manager", phone: "0901234567", email: "lan@eternal.vn", status: "Đang làm", avatar: "L", currentProject: "Tiệc cưới Minh & Hà", shift: "08:00 - 17:00" },
  { id: 2, name: "Trần Văn Đức", role: "Stage Designer", phone: "0912345678", email: "duc@eternal.vn", status: "Đang làm", avatar: "Đ", currentProject: "Khai trương ABC", shift: "08:00 - 17:00" },
  { id: 3, name: "Phạm Thị Hoa", role: "Floral Designer", phone: "0923456789", email: "hoa@eternal.vn", status: "Đang bận", avatar: "H", currentProject: "Tiệc cưới Minh & Hà", shift: "09:00 - 18:00" },
  { id: 4, name: "Lê Minh Tâm", role: "Sound Engineer", phone: "0934567890", email: "tam@eternal.vn", status: "Đang làm", avatar: "T", currentProject: "Hội nghị CNTT", shift: "07:00 - 16:00" },
  { id: 5, name: "Hoàng Thị Mai", role: "MC / Host", phone: "0945678901", email: "mai@eternal.vn", status: "Nghỉ", avatar: "M", currentProject: "—", shift: "—" },
  { id: 6, name: "Võ Quốc Bảo", role: "Logistics", phone: "0956789012", email: "bao@eternal.vn", status: "Đang làm", avatar: "B", currentProject: "Khai trương ABC", shift: "06:00 - 15:00" },
];

export const mockShifts: ShiftDay[] = [
  { day: "T2", slots: [{ name: "Lan", time: "08-17" }, { name: "Đức", time: "08-17" }, { name: "Hoa", time: "09-18" }] },
  { day: "T3", slots: [{ name: "Lan", time: "08-17" }, { name: "Tâm", time: "07-16" }, { name: "Bảo", time: "06-15" }] },
  { day: "T4", slots: [{ name: "Đức", time: "08-17" }, { name: "Hoa", time: "09-18" }, { name: "Tâm", time: "07-16" }] },
  { day: "T5", slots: [{ name: "Lan", time: "08-17" }, { name: "Đức", time: "08-17" }, { name: "Bảo", time: "06-15" }] },
  { day: "T6", slots: [{ name: "Lan", time: "08-17" }, { name: "Hoa", time: "09-18" }, { name: "Tâm", time: "07-16" }, { name: "Bảo", time: "06-15" }] },
];

export const mockVendors: Vendor[] = [
  { id: 1, name: "ABC Catering", category: "Catering", contact: "0901111222", address: "Q.1, TP.HCM", rating: 4.8, projects: 15, status: "Đang hợp tác" },
  { id: 2, name: "GEM Center", category: "Venue", contact: "0902222333", address: "Q.1, TP.HCM", rating: 4.9, projects: 8, status: "Đang hợp tác" },
  { id: 3, name: "Flora Dream", category: "Décor & Hoa", contact: "0903333444", address: "Q.3, TP.HCM", rating: 4.7, projects: 20, status: "Đang hợp tác" },
  { id: 4, name: "SoundPro VN", category: "Âm thanh & AS", contact: "0904444555", address: "Q.7, TP.HCM", rating: 4.5, projects: 12, status: "Đang hợp tác" },
  { id: 5, name: "PhotoArt Studio", category: "Chụp ảnh & Quay phim", contact: "0905555666", address: "Bình Thạnh, TP.HCM", rating: 4.6, projects: 18, status: "Đang hợp tác" },
  { id: 6, name: "Print Express", category: "In ấn", contact: "0906666777", address: "Q.10, TP.HCM", rating: 4.2, projects: 5, status: "Tạm ngưng" },
];

export const mockVendorCategories = ["Tất cả", "Venue", "Catering", "Décor & Hoa", "Âm thanh & AS", "Chụp ảnh & Quay phim", "In ấn"];

export const mockProjectBudgets: ProjectBudget[] = [
  { project: "Tiệc cưới Minh & Hà", items: [
    { id: 1, category: "Venue (GEM Center)", estimated: 80, actual: 80, note: "Đã đặt cọc" },
    { id: 2, category: "Catering (300 khách)", estimated: 60, actual: 45, note: "Đang chốt menu" },
    { id: 3, category: "Décor & Hoa", estimated: 40, actual: 25, note: "Đã duyệt concept" },
    { id: 4, category: "Âm thanh & Ánh sáng", estimated: 25, actual: 0, note: "Chưa đặt" },
    { id: 5, category: "MC & Nghệ sĩ", estimated: 20, actual: 10, note: "Đã ký MC" },
    { id: 6, category: "Chụp ảnh & Quay phim", estimated: 15, actual: 0, note: "Đang chọn" },
    { id: 7, category: "Khác (in ấn, quà...)", estimated: 10, actual: 5, note: "" },
  ]},
  { project: "Khai trương ABC Corp", items: [
    { id: 8, category: "Venue", estimated: 25, actual: 25, note: "Đã xác nhận" },
    { id: 9, category: "Catering", estimated: 15, actual: 0, note: "Chờ duyệt" },
    { id: 10, category: "Décor", estimated: 20, actual: 10, note: "Đang thi công" },
    { id: 11, category: "Âm thanh", estimated: 10, actual: 0, note: "" },
    { id: 12, category: "Khác", estimated: 10, actual: 0, note: "" },
  ]},
];

export const mockBudgetComparison = [
  { category: "Venue", estimated: 105, actual: 105 },
  { category: "Catering", estimated: 75, actual: 45 },
  { category: "Décor", estimated: 60, actual: 35 },
  { category: "Âm thanh", estimated: 35, actual: 0 },
  { category: "Nhân sự", estimated: 20, actual: 10 },
  { category: "Khác", estimated: 20, actual: 5 },
];

export const mockCompletedEvents: CompletedEvent[] = [
  { id: 1, name: "Gala cuối năm 2025", date: "20/12/2025", type: "Gala Dinner", guests: 500, budget: 450, actual: 430, rating: 4.9, feedback: "Tổ chức rất chuyên nghiệp, khách mời hài lòng!", highlights: ["Sân khấu LED 12m ấn tượng", "Menu 8 món được khen ngợi", "Show nhạc live chất lượng"], issues: ["Bãi đỗ xe thiếu chỗ cho 20 khách"], photos: 245 },
  { id: 2, name: "Tiệc cưới Royal 2025", date: "15/11/2025", type: "Tiệc cưới", guests: 400, budget: 380, actual: 375, rating: 4.8, feedback: "Đẹp xuất sắc, cô dâu chú rể rất hạnh phúc!", highlights: ["Décor hoa tươi lãng mạn", "Bánh cưới 5 tầng", "Pháo hoa kết thúc chương trình"], issues: [], photos: 380 },
];

export const mockTaskCompletionData = [
  { month: "T10", onTime: 18, late: 2 }, { month: "T11", onTime: 22, late: 3 },
  { month: "T12", onTime: 28, late: 1 }, { month: "T1", onTime: 15, late: 4 },
  { month: "T2", onTime: 20, late: 2 }, { month: "T3", onTime: 12, late: 1 },
];

export const mockTeamKPIs = [
  { name: "Nguyễn Thị Lan", events: 12, onTimeRate: 95, satisfaction: 4.9 },
  { name: "Trần Văn Đức", events: 8, onTimeRate: 88, satisfaction: 4.7 },
  { name: "Phạm Thị Hoa", events: 15, onTimeRate: 92, satisfaction: 4.8 },
  { name: "Lê Minh Tâm", events: 6, onTimeRate: 97, satisfaction: 4.6 },
];

export const mockOrganizerNotifications: Notification[] = [
  { id: 1, text: "Task 'Đặt venue GEM Center' đã hoàn thành", time: "10 phút trước", read: false },
  { id: 2, text: "Nhà cung cấp ABC Catering xác nhận đơn hàng", time: "1 giờ trước", read: false },
  { id: 3, text: "Chi phí dự án 'Tiệc cưới Minh & Hà' vượt 5% dự toán", time: "2 giờ trước", read: false },
  { id: 4, text: "Nhân viên Trần Văn Đức đã được phân công ca mới", time: "3 giờ trước", read: true },
];

// ─── ADMIN DATA ──────────────────────────────────────────────
export const mockAdminNotifications: Notification[] = [
  { id: 1, text: "Yêu cầu mới từ Nguyễn Thị Mai - Tiệc cưới", time: "5 phút trước", read: false },
  { id: 2, text: "Thanh toán đặt cọc 75tr đã xác nhận", time: "30 phút trước", read: false },
  { id: 3, text: "Task 'Xác nhận venue' sắp hết hạn", time: "1 giờ trước", read: false },
  { id: 4, text: "Đánh giá mới từ khách hàng Trần Minh Đức", time: "2 giờ trước", read: true },
  { id: 5, text: "Hợp đồng HD-2026-002 đã được gửi", time: "3 giờ trước", read: true },
];

export const mockMonthlyRevenue = [
  { month: "T1", revenue: 120 }, { month: "T2", revenue: 180 }, { month: "T3", revenue: 250 },
  { month: "T4", revenue: 200 }, { month: "T5", revenue: 310 }, { month: "T6", revenue: 280 },
  { month: "T7", revenue: 350 }, { month: "T8", revenue: 290 }, { month: "T9", revenue: 420 },
  { month: "T10", revenue: 380 }, { month: "T11", revenue: 460 }, { month: "T12", revenue: 520 },
];

export const mockEventTypes = [
  { name: "Tiệc cưới", value: 35, color: "hsl(355 63% 42%)" },
  { name: "Khai trương", value: 25, color: "hsl(113 33% 31%)" },
  { name: "Gala Dinner", value: 20, color: "hsl(355 55% 53%)" },
  { name: "Hội nghị", value: 15, color: "hsl(38 35% 70%)" },
  { name: "Khác", value: 5, color: "hsl(38 20% 86%)" },
];

export const mockAdminRecentRequests = [
  { name: "Nguyễn Thị Mai", event: "Tiệc cưới", budget: "200-300tr", time: "30 phút trước", status: "Mới" },
  { name: "Trần Văn Bình", event: "Khai trương", budget: "100-200tr", time: "2 giờ trước", status: "Đang xem" },
  { name: "Lê Hoàng Nam", event: "Hội nghị", budget: "50-100tr", time: "5 giờ trước", status: "Đã báo giá" },
  { name: "Phạm Thị Hoa", event: "Gala Dinner", budget: "300-500tr", time: "1 ngày trước", status: "Đã xác nhận" },
];

export const mockAdminUpcomingEvents = [
  { name: "Tiệc cưới Minh & Hà", date: "15/05/2026", progress: 65, daysLeft: 52 },
  { name: "Khai trương ABC Corp", date: "20/04/2026", progress: 40, daysLeft: 27 },
  { name: "Hội nghị CNTT 2026", date: "10/06/2026", progress: 15, daysLeft: 78 },
];

export const mockAdminRequests: AdminRequest[] = [
  { id: "YC-001", name: "Nguyễn Thị Mai", phone: "0901234567", email: "mai@email.com", event: "Tiệc cưới", date: "2026-06-15", guests: 300, budget: "200-300tr", status: "Mới", created: "24/03/2026", manager: "", note: "" },
  { id: "YC-002", name: "Trần Văn Bình", phone: "0912345678", email: "binh@corp.vn", event: "Khai trương", date: "2026-05-10", guests: 150, budget: "100-200tr", status: "Đang xem", created: "23/03/2026", manager: "Lan Nguyễn", note: "Khách VIP" },
  { id: "YC-003", name: "Lê Hoàng Nam", phone: "0923456789", email: "nam@tech.io", event: "Hội nghị", date: "2026-07-20", guests: 200, budget: "50-100tr", status: "Đã báo giá", created: "22/03/2026", manager: "Đức Trần", note: "" },
  { id: "YC-004", name: "Phạm Thị Hoa", phone: "0934567890", email: "hoa@luxury.vn", event: "Gala Dinner", date: "2026-08-05", guests: 500, budget: "300-500tr", status: "Đã xác nhận", created: "20/03/2026", manager: "Lan Nguyễn", note: "Cần venue lớn" },
  { id: "YC-005", name: "Võ Minh Tuấn", phone: "0945678901", email: "tuan@startup.co", event: "Road Show", date: "2026-04-30", guests: 1000, budget: "100-200tr", status: "Từ chối", created: "18/03/2026", manager: "Đức Trần", note: "Ngân sách không phù hợp" },
];

export const mockAdminManagers = ["Lan Nguyễn", "Đức Trần", "Hoa Phạm", "Minh Lê"];

export const mockAdminUsers: AdminUser[] = [
  { id: 1, name: "Admin Chính", email: "admin@eternal.vn", phone: "0901111111", role: "Admin", status: "Hoạt động", lastLogin: "24/03/2026 10:30", events: "—" },
  { id: 2, name: "Nguyễn Thị Lan", email: "lan@eternal.vn", phone: "0901234567", role: "Event Manager", status: "Hoạt động", lastLogin: "24/03/2026 09:15", events: "12" },
  { id: 3, name: "Trần Văn Đức", email: "duc@eternal.vn", phone: "0912345678", role: "Event Manager", status: "Hoạt động", lastLogin: "23/03/2026 17:45", events: "8" },
  { id: 4, name: "Phạm Thị Hoa", email: "hoa@eternal.vn", phone: "0923456789", role: "Staff", status: "Hoạt động", lastLogin: "24/03/2026 08:00", events: "15" },
  { id: 5, name: "Nguyễn Thanh Hà", email: "ha@gmail.com", phone: "0934567890", role: "Customer", status: "Hoạt động", lastLogin: "22/03/2026 14:30", events: "2" },
  { id: 6, name: "Trần Minh Đức", email: "minhduc@corp.vn", phone: "0945678901", role: "Customer", status: "Hoạt động", lastLogin: "20/03/2026 11:00", events: "1" },
  { id: 7, name: "Lê Văn Tùng", email: "tung@eternal.vn", phone: "0956789012", role: "Staff", status: "Vô hiệu hóa", lastLogin: "01/02/2026", events: "5" },
];

export const mockAdminContracts: AdminContract[] = [
  { id: "HD-2026-001", event: "Tiệc cưới Minh & Hà", customer: "Nguyễn Thanh Hà", value: "250,000,000đ", date: "19/03/2026", status: "Hiệu lực", version: "1.0" },
  { id: "HD-2026-002", event: "Khai trương ABC Corp", customer: "Trần Văn Bình", value: "80,000,000đ", date: "23/03/2026", status: "Đã gửi khách", version: "1.0" },
  { id: "HD-2025-012", event: "Gala cuối năm 2025", customer: "Lê Thị Hương", value: "450,000,000đ", date: "15/11/2025", status: "Thanh lý", version: "1.2" },
  { id: "HD-2026-003", event: "Hội nghị CNTT 2026", customer: "Lê Hoàng Nam", value: "100,000,000đ", date: "—", status: "Nháp", version: "0.1" },
];

export const mockProjectFinance: ProjectFinance[] = [
  { project: "Tiệc cưới Minh & Hà", budget: 250, spent: 120, revenue: 250, profit: 130, status: "Đang chạy" },
  { project: "Khai trương ABC Corp", budget: 80, spent: 25, revenue: 80, profit: 55, status: "Đang chạy" },
  { project: "Gala cuối năm 2025", budget: 450, spent: 380, revenue: 450, profit: 70, status: "Hoàn thành" },
  { project: "Hội nghị CNTT 2026", budget: 100, spent: 15, revenue: 100, profit: 85, status: "Đang chạy" },
];

export const mockMonthlyPL = [
  { month: "T1", revenue: 120, expense: 85 }, { month: "T2", revenue: 180, expense: 130 },
  { month: "T3", revenue: 250, expense: 170 }, { month: "T4", revenue: 200, expense: 150 },
  { month: "T5", revenue: 310, expense: 210 }, { month: "T6", revenue: 280, expense: 200 },
];

export const mockExpenses = [
  { category: "Venue", amount: "45,000,000đ", percent: 30 },
  { category: "Catering", amount: "30,000,000đ", percent: 20 },
  { category: "Décor", amount: "22,500,000đ", percent: 15 },
  { category: "Âm thanh & AS", amount: "15,000,000đ", percent: 10 },
  { category: "Nhân sự", amount: "15,000,000đ", percent: 10 },
  { category: "Khác", amount: "22,500,000đ", percent: 15 },
];

export const mockContentPortfolio: ContentPortfolioItem[] = [
  { id: 1, title: "Tiệc cưới Hoa Anh Đào", category: "Wedding", status: "Hiển thị", views: 1250 },
  { id: 2, title: "Anniversary Gala Night", category: "Gala", status: "Hiển thị", views: 890 },
  { id: 3, title: "Festival Road Show 2025", category: "Road Show", status: "Ẩn", views: 560 },
];

export const mockContentBlogPosts: ContentBlogPost[] = [
  { id: 1, title: "10 xu hướng tổ chức sự kiện 2026", category: "Xu hướng", status: "Đã đăng", date: "20/03/2026", views: 2340 },
  { id: 2, title: "Cách chọn venue hoàn hảo cho đám cưới", category: "Hướng dẫn", status: "Đã đăng", date: "15/03/2026", views: 1560 },
  { id: 3, title: "Checklist tổ chức khai trương", category: "Hướng dẫn", status: "Nháp", date: "—", views: 0 },
  { id: 4, title: "Gala dinner: từ A đến Z", category: "Chia sẻ", status: "Lên lịch", date: "01/04/2026", views: 0 },
];

export const mockContentReviews: ContentReview[] = [
  { id: 1, customer: "Nguyễn Thanh Hà", event: "Tiệc cưới", rating: 5, comment: "Tuyệt vời! Mọi thứ hoàn hảo.", status: "Đã duyệt" },
  { id: 2, customer: "Trần Minh Đức", event: "Khai trương", rating: 5, comment: "Chuyên nghiệp, vượt mong đợi.", status: "Đã duyệt" },
  { id: 3, customer: "Phạm Văn Long", event: "Hội nghị", rating: 4, comment: "Tốt, nhưng cần cải thiện catering.", status: "Chờ duyệt" },
];

export const mockConversionData = [
  { month: "T1", requests: 20, contracts: 12 }, { month: "T2", requests: 25, contracts: 18 },
  { month: "T3", requests: 30, contracts: 22 }, { month: "T4", requests: 28, contracts: 20 },
  { month: "T5", requests: 35, contracts: 28 }, { month: "T6", requests: 32, contracts: 24 },
];

export const mockRevenueByType = [
  { name: "Tiệc cưới", value: 520, color: "hsl(355 63% 42%)" },
  { name: "Khai trương", value: 280, color: "hsl(113 33% 31%)" },
  { name: "Gala Dinner", value: 350, color: "hsl(355 55% 53%)" },
  { name: "Hội nghị", value: 150, color: "hsl(38 35% 70%)" },
  { name: "Road Show", value: 40, color: "hsl(38 20% 86%)" },
];

export const mockTopEvents = [
  { name: "Gala cuối năm 2025", revenue: "450tr", type: "Gala Dinner", guests: 500 },
  { name: "Tiệc cưới Royal 2025", revenue: "380tr", type: "Tiệc cưới", guests: 400 },
  { name: "Tiệc cưới Minh & Hà", revenue: "250tr", type: "Tiệc cưới", guests: 300 },
  { name: "Khai trương XYZ Corp", revenue: "180tr", type: "Khai trương", guests: 200 },
  { name: "Hội nghị ASEAN 2025", revenue: "150tr", type: "Hội nghị", guests: 250 },
];

export const mockStaffPerformance = [
  { name: "Nguyễn Thị Lan", events: 12, revenue: "1.2 tỷ", rating: 4.9 },
  { name: "Trần Văn Đức", events: 8, revenue: "780tr", rating: 4.7 },
  { name: "Phạm Thị Hoa", events: 15, revenue: "650tr", rating: 4.8 },
];
