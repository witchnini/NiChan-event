import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, FileText, FolderKanban, Users, Building2, DollarSign,
  FileSignature, BarChart3, Globe, Settings, LogOut, Menu, X, ChevronLeft, Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";

const sidebarItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/admin" },
  { label: "Yêu cầu", icon: FileText, path: "/admin/yeu-cau" },
  { label: "Dự án", icon: FolderKanban, path: "/admin/du-an" },
  { label: "Nhân sự", icon: Users, path: "/admin/nhan-su" },
  { label: "Nhà cung cấp", icon: Building2, path: "/admin/nha-cung-cap" },
  { label: "Tài chính", icon: DollarSign, path: "/admin/tai-chinh" },
  { label: "Hợp đồng", icon: FileSignature, path: "/admin/hop-dong" },
  { label: "Báo cáo", icon: BarChart3, path: "/admin/bao-cao" },
  { label: "Nội dung", icon: Globe, path: "/admin/noi-dung" },
  { label: "Người dùng", icon: Settings, path: "/admin/nguoi-dung" },
];

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-4 flex items-center gap-2">
        <Link to="/admin" className="flex items-center gap-2">
          <span className="font-serif text-headline-md text-primary font-bold">E</span>
          {!collapsed && <span className="font-serif text-headline-md text-foreground font-light">Admin</span>}
        </Link>
        <button onClick={() => setCollapsed(!collapsed)} className="ml-auto hidden lg:block text-muted-foreground hover:text-foreground">
          <ChevronLeft size={18} className={`transition-transform ${collapsed ? "rotate-180" : ""}`} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {sidebarItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== "/admin" && location.pathname.startsWith(item.path));
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-body text-sm transition-all ${
                isActive
                  ? "gradient-primary text-primary-foreground font-semibold shadow-ambient"
                  : "text-muted-foreground hover:text-foreground hover:bg-surface-low"
              }`}
            >
              <item.icon size={18} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 space-y-1">
        <Link to="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-body text-sm text-muted-foreground hover:text-foreground hover:bg-surface-low transition-all">
          <Globe size={18} />
          {!collapsed && <span>Xem website</span>}
        </Link>
        <Link to="/dang-nhap" className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-body text-sm text-destructive hover:bg-destructive/10 transition-all">
          <LogOut size={18} />
          {!collapsed && <span>Đăng xuất</span>}
        </Link>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-surface-low">
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex flex-col bg-surface-lowest shadow-ambient-lg transition-all duration-300 ${collapsed ? "w-16" : "w-64"}`}>
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
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

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 bg-surface-lowest shadow-ambient flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen(true)} className="lg:hidden text-foreground">
              <Menu size={22} />
            </button>
            <h2 className="font-serif text-foreground font-semibold text-lg hidden md:block">
              {sidebarItems.find((i) => location.pathname === i.path || (i.path !== "/admin" && location.pathname.startsWith(i.path)))?.label || "Admin"}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative text-muted-foreground hover:text-foreground">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full gradient-primary text-primary-foreground text-[10px] flex items-center justify-center font-bold">3</span>
            </button>
            <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-body font-bold text-sm">A</div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
