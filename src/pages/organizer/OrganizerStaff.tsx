import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit2, Calendar, Phone, Mail, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

type Staff = {
  id: number; name: string; role: string; phone: string; email: string;
  status: "Đang làm" | "Nghỉ" | "Đang bận"; avatar: string;
  currentProject: string; shift: string;
};

const initialStaff: Staff[] = [
  { id: 1, name: "Nguyễn Thị Lan", role: "Event Manager", phone: "0901234567", email: "lan@eternal.vn", status: "Đang làm", avatar: "L", currentProject: "Tiệc cưới Minh & Hà", shift: "08:00 - 17:00" },
  { id: 2, name: "Trần Văn Đức", role: "Stage Designer", phone: "0912345678", email: "duc@eternal.vn", status: "Đang làm", avatar: "Đ", currentProject: "Khai trương ABC", shift: "08:00 - 17:00" },
  { id: 3, name: "Phạm Thị Hoa", role: "Floral Designer", phone: "0923456789", email: "hoa@eternal.vn", status: "Đang bận", avatar: "H", currentProject: "Tiệc cưới Minh & Hà", shift: "09:00 - 18:00" },
  { id: 4, name: "Lê Minh Tâm", role: "Sound Engineer", phone: "0934567890", email: "tam@eternal.vn", status: "Đang làm", avatar: "T", currentProject: "Hội nghị CNTT", shift: "07:00 - 16:00" },
  { id: 5, name: "Hoàng Thị Mai", role: "MC / Host", phone: "0945678901", email: "mai@eternal.vn", status: "Nghỉ", avatar: "M", currentProject: "—", shift: "—" },
  { id: 6, name: "Võ Quốc Bảo", role: "Logistics", phone: "0956789012", email: "bao@eternal.vn", status: "Đang làm", avatar: "B", currentProject: "Khai trương ABC", shift: "06:00 - 15:00" },
];

const shifts = [
  { day: "T2", slots: [{ name: "Lan", time: "08-17" }, { name: "Đức", time: "08-17" }, { name: "Hoa", time: "09-18" }] },
  { day: "T3", slots: [{ name: "Lan", time: "08-17" }, { name: "Tâm", time: "07-16" }, { name: "Bảo", time: "06-15" }] },
  { day: "T4", slots: [{ name: "Đức", time: "08-17" }, { name: "Hoa", time: "09-18" }, { name: "Tâm", time: "07-16" }] },
  { day: "T5", slots: [{ name: "Lan", time: "08-17" }, { name: "Đức", time: "08-17" }, { name: "Bảo", time: "06-15" }] },
  { day: "T6", slots: [{ name: "Lan", time: "08-17" }, { name: "Hoa", time: "09-18" }, { name: "Tâm", time: "07-16" }, { name: "Bảo", time: "06-15" }] },
];

const OrganizerStaff = () => {
  const [staff, setStaff] = useState(initialStaff);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<Staff | null>(null);
  const [form, setForm] = useState({ name: "", role: "", phone: "", email: "", shift: "08:00 - 17:00" });
  const [tab, setTab] = useState<"list" | "schedule">("list");

  const openAdd = () => { setEditItem(null); setForm({ name: "", role: "", phone: "", email: "", shift: "08:00 - 17:00" }); setDialogOpen(true); };
  const openEdit = (s: Staff) => { setEditItem(s); setForm({ name: s.name, role: s.role, phone: s.phone, email: s.email, shift: s.shift }); setDialogOpen(true); };

  const save = () => {
    if (!form.name.trim()) return;
    if (editItem) {
      setStaff(prev => prev.map(s => s.id === editItem.id ? { ...s, ...form } : s));
      toast.success("Đã cập nhật nhân sự");
    } else {
      setStaff(prev => [...prev, { id: Date.now(), ...form, status: "Đang làm", avatar: form.name[0], currentProject: "—" }]);
      toast.success("Đã thêm nhân sự mới");
    }
    setDialogOpen(false);
  };

  const toggleStatus = (id: number) => {
    setStaff(prev => prev.map(s => {
      if (s.id !== id) return s;
      const next = s.status === "Đang làm" ? "Nghỉ" : "Đang làm";
      return { ...s, status: next };
    }));
    toast.success("Đã cập nhật trạng thái");
  };

  const statusColor = (s: string) => s === "Đang làm" ? "bg-secondary/10 text-secondary" : s === "Đang bận" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="font-serif text-headline-lg text-foreground">Quản lý nhân sự</h1>
        <div className="flex gap-2">
          <div className="flex p-1 rounded-xl bg-surface-low">
            <button onClick={() => setTab("list")} className={`px-4 py-2 rounded-lg font-body text-sm transition-all ${tab === "list" ? "bg-background shadow-ambient text-foreground font-semibold" : "text-muted-foreground"}`}>Danh sách</button>
            <button onClick={() => setTab("schedule")} className={`px-4 py-2 rounded-lg font-body text-sm transition-all ${tab === "schedule" ? "bg-background shadow-ambient text-foreground font-semibold" : "text-muted-foreground"}`}>Ca trực</button>
          </div>
          <Button variant="hero" size="sm" onClick={openAdd}><Plus size={16} /> Thêm</Button>
        </div>
      </div>

      {tab === "list" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {staff.map((s, i) => (
            <motion.div key={s.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-surface-lowest rounded-xl p-5 shadow-ambient hover:shadow-ambient-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center font-body font-bold text-secondary text-sm">{s.avatar}</div>
                  <div>
                    <p className="font-body text-sm font-semibold text-foreground">{s.name}</p>
                    <p className="font-body text-xs text-muted-foreground">{s.role}</p>
                  </div>
                </div>
                <button onClick={() => toggleStatus(s.id)} className={`px-2 py-0.5 rounded-full text-xs font-body font-semibold cursor-pointer ${statusColor(s.status)}`}>{s.status}</button>
              </div>
              <div className="space-y-2 text-xs font-body text-muted-foreground">
                <div className="flex items-center gap-2"><Phone size={12} /> {s.phone}</div>
                <div className="flex items-center gap-2"><Mail size={12} /> {s.email}</div>
                <div className="flex items-center gap-2"><Calendar size={12} /> {s.currentProject}</div>
                <div className="flex items-center gap-2"><Clock size={12} /> Ca: {s.shift}</div>
              </div>
              <div className="mt-4 pt-3 border-t border-border">
                <Button variant="ghost" size="sm" className="w-full" onClick={() => openEdit(s)}><Edit2 size={14} /> Chỉnh sửa</Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {tab === "schedule" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-surface-lowest rounded-xl p-6 shadow-ambient overflow-x-auto">
          <h3 className="font-serif text-headline-md text-foreground mb-6">Lịch phân công tuần này</h3>
          <div className="min-w-[600px]">
            <div className="grid grid-cols-6 gap-3">
              <div className="font-body text-xs text-muted-foreground font-semibold py-2">Nhân viên</div>
              {shifts.map(s => <div key={s.day} className="font-body text-xs text-muted-foreground font-semibold py-2 text-center">{s.day}</div>)}
            </div>
            {["Lan", "Đức", "Hoa", "Tâm", "Bảo"].map(name => (
              <div key={name} className="grid grid-cols-6 gap-3 border-t border-border">
                <div className="py-3 font-body text-sm font-semibold text-foreground">{name}</div>
                {shifts.map(day => {
                  const slot = day.slots.find(sl => sl.name === name);
                  return (
                    <div key={day.day} className="py-3 text-center">
                      {slot ? (
                        <span className="px-2 py-1 rounded-lg bg-secondary/10 text-secondary font-body text-xs font-semibold">{slot.time}</span>
                      ) : (
                        <span className="font-body text-xs text-muted-foreground">—</span>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle className="font-serif">{editItem ? "Sửa nhân sự" : "Thêm nhân sự"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><label className="font-body text-sm mb-1 block">Họ tên</label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="rounded-xl border-none bg-surface-low" /></div>
            <div><label className="font-body text-sm mb-1 block">Vai trò</label><Input value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="rounded-xl border-none bg-surface-low" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="font-body text-sm mb-1 block">SĐT</label><Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="rounded-xl border-none bg-surface-low" /></div>
              <div><label className="font-body text-sm mb-1 block">Ca trực</label><Input value={form.shift} onChange={e => setForm({ ...form, shift: e.target.value })} className="rounded-xl border-none bg-surface-low" /></div>
            </div>
            <div><label className="font-body text-sm mb-1 block">Email</label><Input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="rounded-xl border-none bg-surface-low" /></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setDialogOpen(false)}>Hủy</Button><Button variant="hero" onClick={save}>Lưu</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrganizerStaff;
