import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Check, CheckCheck, Trash2, Filter, Search, MailOpen, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

type NotificationItem = {
  id: number;
  title: string;
  text: string;
  time: string;
  read: boolean;
  category: "yeu-cau" | "thanh-toan" | "hop-dong" | "he-thong" | "task";
};

const categoryLabels: Record<string, string> = {
  "yeu-cau": "Yêu cầu",
  "thanh-toan": "Thanh toán",
  "hop-dong": "Hợp đồng",
  "he-thong": "Hệ thống",
  "task": "Công việc",
};

const categoryColors: Record<string, string> = {
  "yeu-cau": "bg-primary/10 text-primary",
  "thanh-toan": "bg-secondary/10 text-secondary",
  "hop-dong": "bg-accent/20 text-accent-foreground",
  "he-thong": "bg-muted text-muted-foreground",
  "task": "bg-destructive/10 text-destructive",
};

const initialNotifications: NotificationItem[] = [
  { id: 1, title: "Yêu cầu mới", text: "Nguyễn Thị Mai gửi yêu cầu tổ chức tiệc cưới 300 khách tại TP.HCM", time: "5 phút trước", read: false, category: "yeu-cau" },
  { id: 2, title: "Thanh toán đặt cọc", text: "Thanh toán đặt cọc 75,000,000đ cho sự kiện 'Tiệc cưới Minh & Hà' đã được xác nhận qua VNPay", time: "30 phút trước", read: false, category: "thanh-toan" },
  { id: 3, title: "Task sắp hết hạn", text: "Task 'Xác nhận venue GEM Center' cho dự án Tiệc cưới Minh & Hà sắp hết hạn (còn 2 ngày)", time: "1 giờ trước", read: false, category: "task" },
  { id: 4, title: "Đánh giá mới", text: "Trần Minh Đức đã gửi đánh giá 5 sao cho sự kiện 'Khai trương XYZ Corp'", time: "2 giờ trước", read: true, category: "yeu-cau" },
  { id: 5, title: "Hợp đồng đã gửi", text: "Hợp đồng HD-2026-002 đã được gửi cho khách hàng Trần Văn Bình qua email", time: "3 giờ trước", read: true, category: "hop-dong" },
  { id: 6, title: "Nhân viên mới", text: "Tài khoản Event Manager cho Nguyễn Hoàng Long đã được tạo thành công", time: "5 giờ trước", read: true, category: "he-thong" },
  { id: 7, title: "Cảnh báo ngân sách", text: "Chi phí dự án 'Gala cuối năm 2025' đã vượt 85% ngân sách dự kiến", time: "6 giờ trước", read: true, category: "thanh-toan" },
  { id: 8, title: "Hợp đồng cần ký", text: "Hợp đồng HD-2026-003 cho Hội nghị CNTT 2026 cần được phê duyệt và gửi cho khách", time: "1 ngày trước", read: true, category: "hop-dong" },
  { id: 9, title: "Backup hệ thống", text: "Backup dữ liệu hệ thống hoàn thành lúc 02:00 AM - Tất cả dữ liệu an toàn", time: "1 ngày trước", read: true, category: "he-thong" },
  { id: 10, title: "Task hoàn thành", text: "Phạm Thị Hoa đã hoàn thành task 'Thiết kế décor sân khấu' cho Tiệc cưới Minh & Hà", time: "2 ngày trước", read: true, category: "task" },
];

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterRead, setFilterRead] = useState<string>("all");

  const filtered = notifications.filter(n => {
    const matchSearch = n.title.toLowerCase().includes(search.toLowerCase()) || n.text.toLowerCase().includes(search.toLowerCase());
    const matchCategory = filterCategory === "all" || n.category === filterCategory;
    const matchRead = filterRead === "all" || (filterRead === "unread" ? !n.read : n.read);
    return matchSearch && matchCategory && matchRead;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.success("Đã đánh dấu tất cả là đã đọc");
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast.success("Đã xóa thông báo");
  };

  const deleteAllRead = () => {
    setNotifications(prev => prev.filter(n => !n.read));
    toast.success("Đã xóa tất cả thông báo đã đọc");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-headline-lg text-foreground">Quản lý thông báo</h1>
          <p className="font-body text-sm text-muted-foreground mt-1">{unreadCount} thông báo chưa đọc</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={markAllRead} disabled={unreadCount === 0}>
            <CheckCheck size={14} /> Đọc tất cả
          </Button>
          <Button variant="outline" size="sm" onClick={deleteAllRead} className="text-destructive hover:text-destructive">
            <Trash2 size={14} /> Xóa đã đọc
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Tìm kiếm thông báo..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <div className="flex gap-2 flex-wrap">
          <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
            className="rounded-xl border border-border bg-surface-lowest px-3 py-2 font-body text-sm text-foreground">
            <option value="all">Tất cả danh mục</option>
            {Object.entries(categoryLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <select value={filterRead} onChange={e => setFilterRead(e.target.value)}
            className="rounded-xl border border-border bg-surface-lowest px-3 py-2 font-body text-sm text-foreground">
            <option value="all">Tất cả</option>
            <option value="unread">Chưa đọc</option>
            <option value="read">Đã đọc</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {Object.entries(categoryLabels).map(([key, label]) => {
          const count = notifications.filter(n => n.category === key).length;
          const unread = notifications.filter(n => n.category === key && !n.read).length;
          return (
            <button key={key} onClick={() => setFilterCategory(filterCategory === key ? "all" : key)}
              className={`rounded-xl p-3 text-center transition-all ${filterCategory === key ? "ring-2 ring-primary bg-primary/5" : "bg-surface-lowest shadow-ambient hover:shadow-ambient-lg"}`}>
              <p className="font-serif text-headline-md text-foreground">{count}</p>
              <p className="font-body text-xs text-muted-foreground">{label}</p>
              {unread > 0 && <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary">{unread} mới</span>}
            </button>
          );
        })}
      </div>

      {/* Notification List */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-surface-lowest rounded-xl shadow-ambient">
            <Bell size={40} className="mx-auto text-muted-foreground mb-4" />
            <p className="font-body text-muted-foreground">Không có thông báo nào</p>
          </div>
        ) : (
          filtered.map((n, i) => (
            <motion.div key={n.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
              className={`flex items-start gap-4 p-4 rounded-xl transition-all ${!n.read ? "bg-primary/5 shadow-ambient" : "bg-surface-lowest hover:bg-surface-low"}`}>
              <div className="mt-1 shrink-0">
                {!n.read ? <Mail size={18} className="text-primary" /> : <MailOpen size={18} className="text-muted-foreground" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className={`font-body text-sm ${!n.read ? "font-semibold text-foreground" : "text-foreground"}`}>{n.title}</h4>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${categoryColors[n.category]}`}>{categoryLabels[n.category]}</span>
                </div>
                <p className={`font-body text-sm ${!n.read ? "text-foreground" : "text-muted-foreground"}`}>{n.text}</p>
                <p className="font-body text-xs text-muted-foreground mt-1">{n.time}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {!n.read && (
                  <button onClick={() => markAsRead(n.id)} className="p-1.5 rounded-lg hover:bg-surface-low text-muted-foreground hover:text-foreground transition-colors" title="Đánh dấu đã đọc">
                    <Check size={14} />
                  </button>
                )}
                <button onClick={() => deleteNotification(n.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors" title="Xóa">
                  <Trash2 size={14} />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminNotifications;
