import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Plus, Shield, MoreHorizontal, Mail, Phone, Clock, UserCheck, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const users = [
  { id: 1, name: "Admin Chính", email: "admin@eternal.vn", phone: "0901111111", role: "Admin", status: "Hoạt động", lastLogin: "24/03/2026 10:30", events: "—" },
  { id: 2, name: "Nguyễn Thị Lan", email: "lan@eternal.vn", phone: "0901234567", role: "Event Manager", status: "Hoạt động", lastLogin: "24/03/2026 09:15", events: "12" },
  { id: 3, name: "Trần Văn Đức", email: "duc@eternal.vn", phone: "0912345678", role: "Event Manager", status: "Hoạt động", lastLogin: "23/03/2026 17:45", events: "8" },
  { id: 4, name: "Phạm Thị Hoa", email: "hoa@eternal.vn", phone: "0923456789", role: "Staff", status: "Hoạt động", lastLogin: "24/03/2026 08:00", events: "15" },
  { id: 5, name: "Nguyễn Thanh Hà", email: "ha@gmail.com", phone: "0934567890", role: "Customer", status: "Hoạt động", lastLogin: "22/03/2026 14:30", events: "2" },
  { id: 6, name: "Trần Minh Đức", email: "minhduc@corp.vn", phone: "0945678901", role: "Customer", status: "Hoạt động", lastLogin: "20/03/2026 11:00", events: "1" },
  { id: 7, name: "Lê Văn Tùng", email: "tung@eternal.vn", phone: "0956789012", role: "Staff", status: "Vô hiệu hóa", lastLogin: "01/02/2026", events: "5" },
];

const roleColors: Record<string, string> = {
  "Admin": "bg-primary/10 text-primary",
  "Event Manager": "bg-secondary/10 text-secondary",
  "Staff": "bg-muted text-muted-foreground",
  "Customer": "bg-surface-high text-foreground",
};

const AdminUsers = () => {
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("Tất cả");

  const filtered = users.filter((u) =>
    (filterRole === "Tất cả" || u.role === filterRole) &&
    (u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-headline-lg text-foreground">Quản lý người dùng</h1>
          <p className="font-body text-sm text-muted-foreground">{users.length} người dùng</p>
        </div>
        <Button variant="hero" size="sm"><Plus size={16} /> Tạo tài khoản</Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Tìm người dùng..." className="pl-10 rounded-xl bg-surface-lowest font-body border-none" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["Tất cả", "Admin", "Event Manager", "Staff", "Customer"].map((role) => (
            <button key={role} onClick={() => setFilterRole(role)}
              className={`px-3 py-2 rounded-xl font-body text-sm transition-all ${filterRole === role ? "gradient-primary text-primary-foreground" : "bg-surface-lowest text-muted-foreground hover:text-foreground"}`}
            >{role}</button>
          ))}
        </div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-surface-lowest rounded-xl shadow-ambient overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-surface-low">
              <TableHead className="font-body font-semibold">Người dùng</TableHead>
              <TableHead className="font-body font-semibold">Liên hệ</TableHead>
              <TableHead className="font-body font-semibold">Vai trò</TableHead>
              <TableHead className="font-body font-semibold">Trạng thái</TableHead>
              <TableHead className="font-body font-semibold">Đăng nhập cuối</TableHead>
              <TableHead className="font-body font-semibold"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((user) => (
              <TableRow key={user.id} className="hover:bg-surface-low/50">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-body font-bold text-xs">{user.name[0]}</div>
                    <div>
                      <p className="font-body text-sm font-semibold text-foreground">{user.name}</p>
                      <p className="font-body text-xs text-muted-foreground">{user.events !== "—" ? `${user.events} sự kiện` : ""}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="font-body text-xs text-muted-foreground flex items-center gap-1"><Mail size={10} /> {user.email}</p>
                  <p className="font-body text-xs text-muted-foreground flex items-center gap-1"><Phone size={10} /> {user.phone}</p>
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-body font-semibold ${roleColors[user.role]}`}>
                    <Shield size={10} className="inline mr-1" />{user.role}
                  </span>
                </TableCell>
                <TableCell>
                  <span className={`flex items-center gap-1 text-xs font-body font-semibold ${user.status === "Hoạt động" ? "text-secondary" : "text-destructive"}`}>
                    {user.status === "Hoạt động" ? <UserCheck size={12} /> : <UserX size={12} />}
                    {user.status}
                  </span>
                </TableCell>
                <TableCell className="font-body text-xs text-muted-foreground flex items-center gap-1">
                  <Clock size={10} /> {user.lastLogin}
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal size={14} /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </motion.div>
    </div>
  );
};

export default AdminUsers;
