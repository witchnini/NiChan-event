import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Plus, Phone, Mail, Calendar, MoreHorizontal, X, Edit2, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

type Staff = { id: number; name: string; role: string; phone: string; email: string; status: string; events: number; avatar: string; };

const roles = ["Event Manager", "Coordinator", "Designer", "Lễ tân", "Âm thanh & Ánh sáng", "MC"];

const initialStaff: Staff[] = [
  { id: 1, name: "Nguyễn Thị Lan", role: "Event Manager", phone: "0901234567", email: "lan@eternal.vn", status: "available", events: 12, avatar: "L" },
  { id: 2, name: "Trần Văn Đức", role: "Event Manager", phone: "0912345678", email: "duc@eternal.vn", status: "busy", events: 8, avatar: "Đ" },
  { id: 3, name: "Phạm Thị Hoa", role: "Coordinator", phone: "0923456789", email: "hoa@eternal.vn", status: "available", events: 15, avatar: "H" },
  { id: 4, name: "Lê Minh Tuấn", role: "Designer", phone: "0934567890", email: "tuan@eternal.vn", status: "busy", events: 10, avatar: "T" },
  { id: 5, name: "Võ Thu Hằng", role: "Lễ tân", phone: "0945678901", email: "hang@eternal.vn", status: "available", events: 20, avatar: "H" },
  { id: 6, name: "Đặng Quốc Bảo", role: "Âm thanh & Ánh sáng", phone: "0956789012", email: "bao@eternal.vn", status: "available", events: 18, avatar: "B" },
];

const schedule = [
  { date: "25/03", events: [{ name: "Tiệc cưới Minh & Hà", staff: ["Lan", "Hoa", "Tuấn"] }, { name: "Khai trương ABC", staff: ["Đức", "Hằng"] }] },
  { date: "26/03", events: [{ name: "Họp khách hàng - Gala", staff: ["Lan"] }] },
  { date: "27/03", events: [{ name: "Survey venue Q.7", staff: ["Đức", "Bảo"] }] },
];

const emptyStaff: Omit<Staff, "id" | "avatar"> = { name: "", role: "", phone: "", email: "", status: "available", events: 0 };

const AdminStaff = () => {
  const [staffList, setStaffList] = useState<Staff[]>(initialStaff);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"list" | "schedule">("list");
  const [createOpen, setCreateOpen] = useState(false);
  const [editItem, setEditItem] = useState<Staff | null>(null);
  const [viewItem, setViewItem] = useState<Staff | null>(null);
  const [form, setForm] = useState(emptyStaff);

  const openCreate = () => { setForm(emptyStaff); setCreateOpen(true); };
  const openEdit = (s: Staff) => { setForm({ name: s.name, role: s.role, phone: s.phone, email: s.email, status: s.status, events: s.events }); setEditItem(s); };

  const handleCreate = () => {
    if (!form.name || !form.role) { toast.error("Vui lòng nhập tên và vai trò"); return; }
    const newStaff: Staff = { ...form, id: Date.now(), avatar: form.name[0] };
    setStaffList(prev => [...prev, newStaff]);
    toast.success(`Đã thêm nhân viên ${form.name}`);
    setCreateOpen(false);
  };

  const handleEdit = () => {
    if (!editItem) return;
    setStaffList(prev => prev.map(s => s.id === editItem.id ? { ...s, ...form, avatar: form.name[0] } : s));
    toast.success("Đã cập nhật thông tin nhân viên");
    setEditItem(null);
  };

  const handleDelete = (id: number) => {
    setStaffList(prev => prev.filter(s => s.id !== id));
    toast.success("Đã xóa nhân viên");
  };

  const toggleStatus = (id: number) => {
    setStaffList(prev => prev.map(s => s.id === id ? { ...s, status: s.status === "available" ? "busy" : "available" } : s));
    toast.success("Đã cập nhật trạng thái");
  };

  const StaffForm = () => (
    <div className="space-y-4">
      <div><label className="font-body text-sm text-foreground mb-1 block">Họ và tên *</label>
        <Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Nguyễn Văn A" className="rounded-xl bg-surface-lowest font-body border-none" />
      </div>
      <div><label className="font-body text-sm text-foreground mb-1 block">Vai trò *</label>
        <Select value={form.role} onValueChange={v => setForm(p => ({ ...p, role: v }))}>
          <SelectTrigger className="rounded-xl"><SelectValue placeholder="Chọn vai trò" /></SelectTrigger>
          <SelectContent>{roles.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className="font-body text-sm text-foreground mb-1 block">Số điện thoại</label>
          <Input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="0901234567" className="rounded-xl bg-surface-lowest font-body border-none" />
        </div>
        <div><label className="font-body text-sm text-foreground mb-1 block">Email</label>
          <Input value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="email@eternal.vn" className="rounded-xl bg-surface-lowest font-body border-none" />
        </div>
      </div>
      <div><label className="font-body text-sm text-foreground mb-1 block">Trạng thái</label>
        <Select value={form.status} onValueChange={v => setForm(p => ({ ...p, status: v }))}>
          <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="available">Sẵn sàng</SelectItem>
            <SelectItem value="busy">Bận</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-headline-lg text-foreground">Quản lý nhân sự</h1>
          <p className="font-body text-sm text-muted-foreground">{staffList.length} nhân viên</p>
        </div>
        <div className="flex gap-3">
          <div className="flex gap-1 p-1 rounded-xl bg-surface-lowest">
            <button onClick={() => setTab("list")} className={`px-3 py-1.5 rounded-lg font-body text-sm ${tab === "list" ? "bg-background shadow-ambient" : "text-muted-foreground"}`}>Danh sách</button>
            <button onClick={() => setTab("schedule")} className={`px-3 py-1.5 rounded-lg font-body text-sm ${tab === "schedule" ? "bg-background shadow-ambient" : "text-muted-foreground"}`}>Lịch làm việc</button>
          </div>
          <Button variant="hero" size="sm" onClick={openCreate}><Plus size={16} /> Thêm nhân viên</Button>
        </div>
      </div>

      {tab === "list" && (
        <>
          <div className="relative max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Tìm nhân viên..." className="pl-10 rounded-xl bg-surface-lowest font-body border-none" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {staffList.filter(s => s.name.toLowerCase().includes(search.toLowerCase())).map((person, i) => (
              <motion.div key={person.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="bg-surface-lowest rounded-xl p-5 shadow-ambient hover:shadow-ambient-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-body font-bold text-sm">{person.avatar}</div>
                    <div>
                      <h3 className="font-body text-sm font-semibold text-foreground">{person.name}</h3>
                      <p className="font-body text-xs text-muted-foreground">{person.role}</p>
                    </div>
                  </div>
                  <button onClick={() => toggleStatus(person.id)}>
                    <span className={`w-2.5 h-2.5 rounded-full mt-1 block cursor-pointer ${person.status === "available" ? "bg-secondary" : "bg-primary"}`} title={person.status === "available" ? "Sẵn sàng" : "Bận"} />
                  </button>
                </div>
                <div className="space-y-2 text-xs font-body text-muted-foreground">
                  <p className="flex items-center gap-2"><Phone size={12} /> {person.phone}</p>
                  <p className="flex items-center gap-2"><Mail size={12} /> {person.email}</p>
                  <p className="flex items-center gap-2"><Calendar size={12} /> {person.events} sự kiện đã tham gia</p>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1 text-xs rounded-xl" onClick={() => setViewItem(person)}>Xem chi tiết</Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal size={14} /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEdit(person)}><Edit2 size={12} className="mr-2" /> Chỉnh sửa</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toggleStatus(person.id)}>{person.status === "available" ? "Đánh dấu Bận" : "Đánh dấu Sẵn sàng"}</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleDelete(person.id)} className="text-destructive"><Trash2 size={12} className="mr-2" /> Xóa</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {tab === "schedule" && (
        <div className="space-y-4">
          {schedule.map((day, i) => (
            <motion.div key={day.date} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="bg-surface-lowest rounded-xl p-5 shadow-ambient"
            >
              <h3 className="font-serif font-semibold text-foreground mb-4 flex items-center gap-2">
                <Calendar size={16} className="text-primary" /> {day.date}
              </h3>
              <div className="space-y-3">
                {day.events.map((event, j) => (
                  <div key={j} className="flex items-center justify-between bg-surface-low rounded-xl p-3">
                    <p className="font-body text-sm text-foreground">{event.name}</p>
                    <div className="flex -space-x-2">
                      {event.staff.map((s) => (
                        <div key={s} className="w-7 h-7 rounded-full bg-primary/10 border-2 border-surface-lowest flex items-center justify-center text-primary font-body font-bold text-[10px]">{s[0]}</div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* View Detail Dialog */}
      <Dialog open={!!viewItem} onOpenChange={() => setViewItem(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle className="font-serif">Thông tin nhân viên</DialogTitle></DialogHeader>
          {viewItem && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-body font-bold text-2xl">{viewItem.avatar}</div>
                <div>
                  <h3 className="font-body text-lg font-semibold text-foreground">{viewItem.name}</h3>
                  <p className="font-body text-sm text-muted-foreground">{viewItem.role}</p>
                  <span className={`inline-flex items-center gap-1 text-xs font-body font-semibold mt-1 ${viewItem.status === "available" ? "text-secondary" : "text-primary"}`}>
                    <span className={`w-2 h-2 rounded-full ${viewItem.status === "available" ? "bg-secondary" : "bg-primary"}`} />
                    {viewItem.status === "available" ? "Sẵn sàng" : "Bận"}
                  </span>
                </div>
              </div>
              <div className="space-y-2 text-sm font-body text-muted-foreground">
                <p className="flex items-center gap-2"><Phone size={14} /> {viewItem.phone}</p>
                <p className="flex items-center gap-2"><Mail size={14} /> {viewItem.email}</p>
                <p className="flex items-center gap-2"><Calendar size={14} /> {viewItem.events} sự kiện đã tham gia</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewItem(null)}>Đóng</Button>
            <Button variant="hero" onClick={() => { if (viewItem) { openEdit(viewItem); setViewItem(null); } }}>Chỉnh sửa</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle className="font-serif">Thêm nhân viên mới</DialogTitle></DialogHeader>
          <StaffForm />
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Hủy</Button>
            <Button variant="hero" onClick={handleCreate}>Thêm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editItem} onOpenChange={() => setEditItem(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle className="font-serif">Chỉnh sửa nhân viên</DialogTitle></DialogHeader>
          <StaffForm />
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditItem(null)}>Hủy</Button>
            <Button variant="hero" onClick={handleEdit}>Lưu</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminStaff;
