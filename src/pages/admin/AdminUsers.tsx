import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Plus, Shield, MoreHorizontal, Mail, Phone, Clock, UserCheck, UserX, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

type User = { id: number; name: string; email: string; phone: string; role: string; status: string; lastLogin: string; events: string; };

const roleList = ["Admin", "Event Manager", "Staff", "Customer"];
const roleColors: Record<string, string> = {
  "Admin": "bg-primary/10 text-primary",
  "Event Manager": "bg-secondary/10 text-secondary",
  "Staff": "bg-muted text-muted-foreground",
  "Customer": "bg-surface-high text-foreground",
};

const initialUsers: User[] = [
  { id: 1, name: "Admin Chính", email: "admin@eternal.vn", phone: "0901111111", role: "Admin", status: "Hoạt động", lastLogin: "24/03/2026 10:30", events: "—" },
  { id: 2, name: "Nguyễn Thị Lan", email: "lan@eternal.vn", phone: "0901234567", role: "Event Manager", status: "Hoạt động", lastLogin: "24/03/2026 09:15", events: "12" },
  { id: 3, name: "Trần Văn Đức", email: "duc@eternal.vn", phone: "0912345678", role: "Event Manager", status: "Hoạt động", lastLogin: "23/03/2026 17:45", events: "8" },
  { id: 4, name: "Phạm Thị Hoa", email: "hoa@eternal.vn", phone: "0923456789", role: "Staff", status: "Hoạt động", lastLogin: "24/03/2026 08:00", events: "15" },
  { id: 5, name: "Nguyễn Thanh Hà", email: "ha@gmail.com", phone: "0934567890", role: "Customer", status: "Hoạt động", lastLogin: "22/03/2026 14:30", events: "2" },
  { id: 6, name: "Trần Minh Đức", email: "minhduc@corp.vn", phone: "0945678901", role: "Customer", status: "Hoạt động", lastLogin: "20/03/2026 11:00", events: "1" },
  { id: 7, name: "Lê Văn Tùng", email: "tung@eternal.vn", phone: "0956789012", role: "Staff", status: "Vô hiệu hóa", lastLogin: "01/02/2026", events: "5" },
];

const emptyUser = { name: "", email: "", phone: "", role: "Customer", status: "Hoạt động", lastLogin: "", events: "0" };

const AdminUsers = () => {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("Tất cả");
  const [createOpen, setCreateOpen] = useState(false);
  const [editItem, setEditItem] = useState<User | null>(null);
  const [form, setForm] = useState(emptyUser);

  const filtered = users.filter(u =>
    (filterRole === "Tất cả" || u.role === filterRole) &&
    (u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
  );

  const handleCreate = () => {
    if (!form.name || !form.email) { toast.error("Vui lòng nhập tên và email"); return; }
    setUsers(prev => [...prev, { ...form, id: Date.now() }]);
    toast.success(`Đã tạo tài khoản cho ${form.name}`);
    setCreateOpen(false);
  };

  const handleEdit = () => {
    if (!editItem) return;
    setUsers(prev => prev.map(u => u.id === editItem.id ? { ...u, ...form } : u));
    toast.success("Đã cập nhật người dùng");
    setEditItem(null);
  };

  const handleDelete = (id: number) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    toast.success("Đã xóa người dùng");
  };

  const toggleStatus = (id: number) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === "Hoạt động" ? "Vô hiệu hóa" : "Hoạt động" } : u));
    toast.success("Đã cập nhật trạng thái");
  };

  const UserForm = () => (
    <div className="space-y-4">
      <div><label className="font-body text-sm text-foreground mb-1 block">Họ và tên *</label>
        <Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="rounded-xl bg-surface-lowest font-body border-none" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className="font-body text-sm text-foreground mb-1 block">Email *</label>
          <Input value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className="rounded-xl bg-surface-lowest font-body border-none" />
        </div>
        <div><label className="font-body text-sm text-foreground mb-1 block">Điện thoại</label>
          <Input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className="rounded-xl bg-surface-lowest font-body border-none" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className="font-body text-sm text-foreground mb-1 block">Vai trò</label>
          <Select value={form.role} onValueChange={v => setForm(p => ({ ...p, role: v }))}>
            <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
            <SelectContent>{roleList.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div><label className="font-body text-sm text-foreground mb-1 block">Trạng thái</label>
          <Select value={form.status} onValueChange={v => setForm(p => ({ ...p, status: v }))}>
            <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Hoạt động">Hoạt động</SelectItem>
              <SelectItem value="Vô hiệu hóa">Vô hiệu hóa</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-headline-lg text-foreground">Quản lý người dùng</h1>
          <p className="font-body text-sm text-muted-foreground">{users.length} người dùng</p>
        </div>
        <Button variant="hero" size="sm" onClick={() => { setForm(emptyUser); setCreateOpen(true); }}><Plus size={16} /> Tạo tài khoản</Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Tìm người dùng..." className="pl-10 rounded-xl bg-surface-lowest font-body border-none" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["Tất cả", ...roleList].map(role => (
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
            {filtered.map(user => (
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
                <TableCell className="font-body text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Clock size={10} /> {user.lastLogin}</span>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal size={14} /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => { setForm({ name: user.name, email: user.email, phone: user.phone, role: user.role, status: user.status, lastLogin: user.lastLogin, events: user.events }); setEditItem(user); }}>
                        <Edit2 size={12} className="mr-2" /> Chỉnh sửa
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toggleStatus(user.id)}>
                        {user.status === "Hoạt động" ? "Vô hiệu hóa" : "Kích hoạt lại"}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleDelete(user.id)} className="text-destructive">
                        <Trash2 size={12} className="mr-2" /> Xóa
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </motion.div>

      {/* Create Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle className="font-serif">Tạo tài khoản mới</DialogTitle></DialogHeader>
          <UserForm />
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Hủy</Button>
            <Button variant="hero" onClick={handleCreate}>Tạo</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editItem} onOpenChange={() => setEditItem(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle className="font-serif">Chỉnh sửa người dùng</DialogTitle></DialogHeader>
          <UserForm />
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditItem(null)}>Hủy</Button>
            <Button variant="hero" onClick={handleEdit}>Lưu</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUsers;
