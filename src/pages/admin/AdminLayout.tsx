import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, FileText, Users, DollarSign,
  FileSignature, BarChart3, Globe, LogOut, Menu, X, ChevronLeft, Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const sidebarItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/admin" },
  { label: "Yêu cầu", icon: FileText, path: "/admin/yeu-cau" },
  { label: "Người dùng", icon: Users, path: "/admin/nguoi-dung" },
  { label: "Nội dung", icon: Globe, path: "/admin/noi-dung" },
  { label: "Hợp đồng", icon: FileSignature, path: "/admin/hop-dong" },
  { label: "Tài chính", icon: DollarSign, path: "/admin/tai-chinh" },
  { label: "Thống kê", icon: BarChart3, path: "/admin/bao-cao" },
];

type Notification = { id: number; text: string; time: string; read: boolean; };

const initialNotifications: Notification[] = [
  { id: 1, text: "Yêu cầu mới từ Nguyễn Thị Mai - Tiệc cưới", time: "5 phút trước", read: false },
  { id: 2, text: "Thanh toán đặt cọc 75tr đã xác nhận", time: "30 phút trước", read: false },
  { id: 3, text: "Task 'Xác nhận venue' sắp hết hạn", time: "1 giờ trước", read: false },
  { id: 4, text: "Đánh giá mới từ khách hàng Trần Minh Đức", time: "2 giờ trước", read: true },
  { id: 5, text: "Hợp đồng HD-2026-002 đã được gửi", time: "3 giờ trước", read: true },
];

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);
  const location = useLocation();

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.success("Đã đánh dấu tất cả là đã đọc");
  };

  const handleLogout = () => {
    toast.success("Đã đăng xuất thành công");
    window.location.href = "/dang-nhap";
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 flex items-center gap-2">
        <Link to="/admin" className="flex items-center gap-2">
          <span className="font-serif text-headline-md text-primary font-bold">E</span>
          {!collapsed && <span className="font-serif text-headline-md text-foreground font-light">Admin</span>}
        </Link>
        <button onClick={() => setCollapsed(!collapsed)} className="ml-auto hidden lg:block text-muted-foreground hover:text-foreground">
          <ChevronLeft size={18} className={`transition-transform ${collapsed ? "rotate-180" : ""}`} />
        </button>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {sidebarItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== "/admin" && location.pathname.startsWith(item.path));
          return (
            <Link key={item.path} to={item.path} onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-body text-sm transition-all ${isActive ? "gradient-primary text-primary-foreground font-semibold shadow-ambient" : "text-muted-foreground hover:text-foreground hover:bg-surface-low"}`}
            >
              <item.icon size={18} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 space-y-1">
        <Link to="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-body text-sm text-muted-foreground hover:text-foreground hover:bg-surface-low transition-all">
          <Globe size={18} />{!collapsed && <span>Xem website</span>}
        </Link>
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-body text-sm text-destructive hover:bg-destructive/10 transition-all">
          <LogOut size={18} />{!collapsed && <span>Đăng xuất</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-surface-low">
      <aside className={`hidden lg:flex flex-col bg-surface-lowest shadow-ambient-lg transition-all duration-300 ${collapsed ? "w-16" : "w-64"}`}>
        <SidebarContent />
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-foreground/30 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
            <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} className="fixed left-0 top-0 bottom-0 w-64 bg-surface-lowest shadow-ambient-lg z-50 lg:hidden">
              <div className="flex items-center justify-end p-4">
                <button onClick={() => setMobileOpen(false)}><X size={20} /></button>
              </div>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-surface-lowest shadow-ambient flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen(true)} className="lg:hidden text-foreground"><Menu size={22} /></button>
            <h2 className="font-serif text-foreground font-semibold text-lg hidden md:block">
              {sidebarItems.find(i => location.pathname === i.path || (i.path !== "/admin" && location.pathname.startsWith(i.path)))?.label || "Admin"}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            {/* Notification Bell */}
            <div className="relative">
              <button onClick={() => setNotifOpen(!notifOpen)} className="relative text-muted-foreground hover:text-foreground">
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full gradient-primary text-primary-foreground text-[10px] flex items-center justify-center font-bold">{unreadCount}</span>
                )}
              </button>

              <AnimatePresence>
                {notifOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 top-full mt-2 w-80 bg-surface-lowest rounded-xl shadow-ambient-lg z-50 overflow-hidden"
                    >
                      <div className="flex items-center justify-between p-4 bg-surface-low">
                        <h3 className="font-serif font-semibold text-foreground text-sm">Thông báo</h3>
                        {unreadCount > 0 && (
                          <button onClick={markAllRead} className="font-body text-xs text-primary hover:underline">Đánh dấu tất cả</button>
                        )}
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.map(n => (
                          <button key={n.id} onClick={() => markAsRead(n.id)}
                            className={`w-full text-left p-4 border-b border-border hover:bg-surface-low transition-colors ${!n.read ? "bg-primary/5" : ""}`}
                          >
                            <div className="flex items-start gap-3">
                              {!n.read && <span className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />}
                              <div className={!n.read ? "" : "ml-5"}>
                                <p className={`font-body text-sm ${!n.read ? "text-foreground font-semibold" : "text-muted-foreground"}`}>{n.text}</p>
                                <p className="font-body text-xs text-muted-foreground mt-1">{n.time}</p>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-body font-bold text-sm">A</div>
          </div>
        </header>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
