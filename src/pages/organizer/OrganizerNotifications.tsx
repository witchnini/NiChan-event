import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Check, CheckCheck, Trash2, Search, MailOpen, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

type NotificationItem = {
  id: number; title: string; text: string; time: string; read: boolean;
  category: "task" | "vendor" | "budget" | "staff" | "project";
};

const categoryLabels: Record<string, string> = {
  task: "Công việc", vendor: "Nhà cung cấp", budget: "Ngân sách", staff: "Nhân sự", project: "Dự án",
};

const categoryColors: Record<string, string> = {
  task: "bg-primary/10 text-primary",
  vendor: "bg-secondary/10 text-secondary",
  budget: "bg-destructive/10 text-destructive",
  staff: "bg-accent/20 text-accent-foreground",
  project: "bg-muted text-muted-foreground",
};

const initialNotifications: NotificationItem[] = [
  { id: 1, title: "Task hoàn thành", text: "Task 'Đặt venue GEM Center' đã hoàn thành bởi Nguyễn Thị Lan", time: "10 phút trước", read: false, category: "task" },
  { id: 2, title: "Xác nhận đơn hàng", text: "Nhà cung cấp ABC Catering xác nhận đơn hàng cho tiệc cưới Minh & Hà", time: "1 giờ trước", read: false, category: "vendor" },
  { id: 3, title: "Cảnh báo ngân sách", text: "Chi phí dự án 'Tiệc cưới Minh & Hà' vượt 5% dự toán mục Catering", time: "2 giờ trước", read: false, category: "budget" },
  { id: 4, title: "Phân công ca mới", text: "Nhân viên Trần Văn Đức đã được phân công ca sáng T5", time: "3 giờ trước", read: true, category: "staff" },
  { id: 5, title: "Dự án mới", text: "Dự án 'Hội nghị CNTT 2026' đã được tạo và phân công cho bạn", time: "5 giờ trước", read: true, category: "project" },
  { id: 6, title: "Task quá hạn", text: "Task 'Thiết kế thiệp mời' đã quá hạn 1 ngày - cần xử lý ngay", time: "1 ngày trước", read: true, category: "task" },
  { id: 7, title: "Vendor mới", text: "Nhà cung cấp 'LightPro VN' đã được thêm vào hệ thống", time: "2 ngày trước", read: true, category: "vendor" },
];

const OrganizerNotifications = () => {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  const filtered = notifications.filter(n => {
    const matchSearch = n.title.toLowerCase().includes(search.toLowerCase()) || n.text.toLowerCase().includes(search.toLowerCase());
    const matchCategory = filterCategory === "all" || n.category === filterCategory;
    return matchSearch && matchCategory;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: number) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const markAllRead = () => { setNotifications(prev => prev.map(n => ({ ...n, read: true }))); toast.success("Đã đánh dấu tất cả đã đọc"); };
  const deleteNotification = (id: number) => { setNotifications(prev => prev.filter(n => n.id !== id)); toast.success("Đã xóa thông báo"); };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-headline-lg text-foreground">Thông báo</h1>
          <p className="font-body text-sm text-muted-foreground mt-1">{unreadCount} thông báo chưa đọc</p>
        </div>
        <Button variant="outline" size="sm" onClick={markAllRead} disabled={unreadCount === 0}>
          <CheckCheck size={14} /> Đọc tất cả
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Tìm kiếm..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
          className="rounded-xl border border-border bg-surface-lowest px-3 py-2 font-body text-sm text-foreground">
          <option value="all">Tất cả</option>
          {Object.entries(categoryLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-surface-lowest rounded-xl shadow-ambient">
            <Bell size={40} className="mx-auto text-muted-foreground mb-4" />
            <p className="font-body text-muted-foreground">Không có thông báo nào</p>
          </div>
        ) : (
          filtered.map((n, i) => (
            <motion.div key={n.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
              className={`flex items-start gap-4 p-4 rounded-xl transition-all ${!n.read ? "bg-secondary/5 shadow-ambient" : "bg-surface-lowest hover:bg-surface-low"}`}>
              <div className="mt-1 shrink-0">
                {!n.read ? <Mail size={18} className="text-secondary" /> : <MailOpen size={18} className="text-muted-foreground" />}
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
                  <button onClick={() => markAsRead(n.id)} className="p-1.5 rounded-lg hover:bg-surface-low text-muted-foreground hover:text-foreground transition-colors">
                    <Check size={14} />
                  </button>
                )}
                <button onClick={() => deleteNotification(n.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
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

export default OrganizerNotifications;
