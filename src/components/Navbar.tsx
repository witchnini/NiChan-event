import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut, User, ChevronDown, Mail, Phone, Calendar, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { mockOrganizerAccounts } from "@/services/mockData";

const navLinks = [
  { label: "Trang chủ", path: "/" },
  { label: "Dịch vụ", path: "/dich-vu" },
  { label: "Portfolio", path: "/portfolio" },
  { label: "Blog", path: "/blog" },
  { label: "Giới thiệu", path: "/gioi-thieu" },
  { label: "Liên hệ", path: "/lien-he" },
];

const customerLinks = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Sự kiện", path: "/dashboard/su-kien" },
  { label: "Hợp đồng", path: "/dashboard/hop-dong" },
  { label: "Đánh giá", path: "/dashboard/danh-gia" },
];

const customerProfile = {
  name: "Nguyễn Thanh Hà",
  email: "ha@gmail.com",
  phone: "0934 567 890",
  memberSince: "01/2025",
  events: 2,
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const roleParam = searchParams.get("role");

  const isCustomer = location.pathname.startsWith("/dashboard");
  const isLoggedIn = isCustomer || roleParam === "admin" || roleParam === "organizer" || roleParam === "customer";

  const organizerParam = searchParams.get("organizer");
  const currentOrganizer = organizerParam ? mockOrganizerAccounts.find(o => o.id === organizerParam) ?? null : null;

  const roleLabel = isCustomer || roleParam === "customer" ? "Khách hàng" : roleParam === "admin" ? "Quản trị viên" : roleParam === "organizer" ? "Ban tổ chức" : "";
  const panelPath = isCustomer ? "/dashboard" : roleParam === "customer" ? "/dashboard" : roleParam === "admin" ? "/admin" : roleParam === "organizer" ? `/ban-to-chuc${organizerParam ? `?organizer=${organizerParam}` : ""}` : "";
  const isCustomerRole = isCustomer || roleParam === "customer";
  const isOrganizerRole = roleParam === "organizer";
  const currentRole = isCustomer ? "customer" : roleParam;
  const roleQuery = isLoggedIn && currentRole ? `?role=${currentRole}${organizerParam ? `&organizer=${organizerParam}` : ""}` : "";

  const handleLogout = () => {
    toast.success("Đã đăng xuất");
    window.location.href = "/dang-nhap";
  };

  const links = isCustomer ? customerLinks : navLinks;

  const appendRole = (path: string) => {
    if (!isLoggedIn || !currentRole) return path;
    if (path.startsWith("/dashboard") || path.startsWith("/admin") || path.startsWith("/ban-to-chuc")) return path;
    const separator = path.includes("?") ? "&" : "?";
    return `${path}${separator}role=${currentRole}${organizerParam ? `&organizer=${organizerParam}` : ""}`;
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link to={appendRole("/")} className="flex items-center gap-2">
          <span className="font-serif text-headline-md text-primary font-bold">NiChan</span>
          <span className="font-serif text-headline-md text-foreground font-light">Events</span>
        </Link>

        <div className="hidden lg:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.path}
              to={appendRole(link.path)}
              className={`font-body text-sm tracking-wide transition-colors duration-300 hover:text-primary ${location.pathname === link.path
                ? "text-primary font-semibold"
                : "text-muted-foreground"
                }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {isLoggedIn ? (
          <div className="hidden lg:flex items-center gap-3">
            {panelPath && !isCustomerRole && (
              <Link to={panelPath}>
                <Button variant="outline" size="lg" className="gap-2">
                  Quay lại Panel
                </Button>
              </Link>
            )}

            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-surface-low transition-all"
              >
                <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-body font-bold text-sm">
                  {isCustomerRole ? customerProfile.name[0] : (isOrganizerRole && currentOrganizer) ? currentOrganizer.avatar : <User size={16} />}
                </div>
                <div className="text-left hidden xl:block">
                  <p className="font-body text-sm font-semibold text-foreground leading-tight">
                    {isCustomerRole ? customerProfile.name : (isOrganizerRole && currentOrganizer) ? currentOrganizer.name : roleLabel}
                  </p>
                  <p className="font-body text-xs text-muted-foreground leading-tight">{roleLabel}</p>
                </div>
                <ChevronDown size={14} className={`text-muted-foreground transition-transform ${profileOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-72 bg-background rounded-2xl shadow-ambient-lg border border-border overflow-hidden z-50"
                  >
                    <div className="p-5 bg-surface-low">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-body font-bold text-lg">
                          {isCustomerRole ? customerProfile.name[0] : (isOrganizerRole && currentOrganizer) ? currentOrganizer.avatar : roleLabel[0]}
                        </div>
                        <div>
                          <p className="font-body text-sm font-semibold text-foreground">
                            {isCustomerRole ? customerProfile.name : (isOrganizerRole && currentOrganizer) ? currentOrganizer.name : roleLabel}
                          </p>
                          <span className="px-2 py-0.5 rounded-full text-xs font-body font-semibold bg-primary/10 text-primary">
                            {roleLabel}
                          </span>
                        </div>
                      </div>
                    </div>

                    {isCustomerRole && (
                      <div className="p-4 space-y-3 border-b border-border">
                        <div className="flex items-center gap-3 text-sm font-body">
                          <Mail size={14} className="text-muted-foreground shrink-0" />
                          <span className="text-foreground">{customerProfile.email}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm font-body">
                          <Phone size={14} className="text-muted-foreground shrink-0" />
                          <span className="text-foreground">{customerProfile.phone}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm font-body">
                          <Calendar size={14} className="text-muted-foreground shrink-0" />
                          <span className="text-muted-foreground">Thành viên từ {customerProfile.memberSince}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm font-body">
                          <Settings size={14} className="text-muted-foreground shrink-0" />
                          <span className="text-muted-foreground">{customerProfile.events} sự kiện</span>
                        </div>
                      </div>
                    )}

                    <div className="p-2">
                      {panelPath && !isCustomerRole && (
                        <Link to={panelPath} onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-body text-sm text-foreground hover:bg-surface-low transition-all w-full">
                          <Settings size={14} /> Quay lại Panel
                        </Link>
                      )}
                      {isCustomerRole && (
                        <>
                          <Link to="/dashboard/ho-so" onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-body text-sm text-foreground hover:bg-surface-low transition-all w-full">
                            <User size={14} /> Hồ sơ cá nhân
                          </Link>
                          <Link to="/dashboard" onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-body text-sm text-foreground hover:bg-surface-low transition-all w-full">
                            <Settings size={14} /> Dashboard
                          </Link>
                        </>
                      )}
                      <button onClick={() => { setProfileOpen(false); handleLogout(); }}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-body text-sm text-destructive hover:bg-destructive/10 transition-all w-full">
                        <LogOut size={14} /> Đăng xuất
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        ) : (
          <div className="hidden lg:flex items-center gap-3">
            <Link to="/dang-nhap">
              <Button variant="tertiary" size="lg">
                Đăng nhập
              </Button>
            </Link>
            <Link to="/lien-he">
              <Button variant="hero" size="lg">
                Yêu cầu báo giá
              </Button>
            </Link>
          </div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden text-foreground"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden glass overflow-hidden"
          >
            <div className="container mx-auto px-6 py-6 flex flex-col gap-4">
              {isLoggedIn && (
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-surface-low mb-2">
                  <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-body font-bold">
                    {isCustomerRole ? customerProfile.name[0] : (isOrganizerRole && currentOrganizer) ? currentOrganizer.avatar : <User size={18} />}
                  </div>
                  <div>
                    <p className="font-body text-sm font-semibold text-foreground">
                      {isCustomerRole ? customerProfile.name : (isOrganizerRole && currentOrganizer) ? currentOrganizer.name : roleLabel}
                    </p>
                    <p className="font-body text-xs text-muted-foreground">{roleLabel}</p>
                    {isCustomerRole && (
                      <p className="font-body text-xs text-muted-foreground">{customerProfile.email}</p>
                    )}
                  </div>
                </div>
              )}
              {links.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`font-body text-base py-2 transition-colors ${location.pathname === link.path
                    ? "text-primary font-semibold"
                    : "text-muted-foreground"
                    }`}
                >
                  {link.label}
                </Link>
              ))}
              {isLoggedIn ? (
                <>
                  {panelPath && !isCustomerRole && (
                    <Link to={panelPath} onClick={() => setIsOpen(false)}>
                      <Button variant="outline" size="lg" className="w-full mt-2">
                        Quay lại Panel
                      </Button>
                    </Link>
                  )}
                  {isCustomerRole && (
                    <>
                      <Link to="/dashboard/ho-so" onClick={() => setIsOpen(false)}>
                        <Button variant="outline" size="lg" className="w-full mt-2 gap-2">
                          <User size={16} /> Hồ sơ cá nhân
                        </Button>
                      </Link>
                      <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                        <Button variant="tertiary" size="lg" className="w-full gap-2">
                          <Settings size={16} /> Dashboard
                        </Button>
                      </Link>
                    </>
                  )}
                  <Button variant="tertiary" size="lg" className="w-full mt-2 gap-2" onClick={() => { setIsOpen(false); handleLogout(); }}>
                    <LogOut size={16} /> Đăng xuất
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/dang-nhap" onClick={() => setIsOpen(false)}>
                    <Button variant="tertiary" size="lg" className="w-full mt-2">
                      Đăng nhập
                    </Button>
                  </Link>
                  <Link to="/lien-he" onClick={() => setIsOpen(false)}>
                    <Button variant="hero" size="lg" className="w-full">
                      Yêu cầu báo giá
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
