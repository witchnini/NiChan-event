import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Plus, Phone, Mail, Calendar, MoreHorizontal, Edit2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { apiClient } from "@/services/apiClient";
import { toast } from "sonner";

type Staff = {
  id: string;
  displayName: string;
  email: string;
  phone?: string | null;
  status: string;
  staffProfile?: { jobTitle?: string | null; employmentStatus?: string | null; fullName?: string | null };
  shifts?: { id: string; workDate: string; startTime: string; endTime: string; event?: { name: string } | null }[];
};

type ScheduleItem = {
  id: string;
  workDate: string;
  startTime: string;
  endTime: string;
  staffUser: { displayName: string };
  event?: { name: string } | null;
};

const roles = ["Event Manager", "Coordinator", "Designer", "Le tan", "Am thanh & Anh sang", "MC"];
const emptyStaff = { name: "", jobTitle: "", phone: "", email: "", status: "active", password: "" };

const AdminStaff = () => {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"list" | "schedule">("list");
  const [createOpen, setCreateOpen] = useState(false);
  const [editItem, setEditItem] = useState<Staff | null>(null);
  const [viewItem, setViewItem] = useState<Staff | null>(null);
  const [form, setForm] = useState(emptyStaff);
  const [loading, setLoading] = useState(true);

  const loadStaff = async () => {
    setLoading(true);
    try {
      const data = await apiClient.get<Staff[]>("/admin/staff", { search, pageSize: 100 });
      setStaffList(data);
    } catch (error) {
      toast.error("Khong tai duoc danh sach nhan su");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadStaff();
  }, [search]);

  useEffect(() => {
    apiClient.get<ScheduleItem[]>("/admin/staff/schedule")
      .then(setSchedule)
      .catch(() => toast.error("Khong tai duoc lich lam viec"));
  }, []);

  const openCreate = () => { setForm(emptyStaff); setCreateOpen(true); };
  const openEdit = (staff: Staff) => {
    setForm({
      name: staff.displayName,
      jobTitle: staff.staffProfile?.jobTitle ?? "",
      phone: staff.phone ?? "",
      email: staff.email,
      status: staff.staffProfile?.employmentStatus ?? "active",
      password: "",
    });
    setEditItem(staff);
  };

  const handleCreate = async () => {
    if (!form.name || !form.email || !form.jobTitle) {
      toast.error("Vui long nhap ten, email va vai tro");
      return;
    }
    try {
      await apiClient.post("/admin/staff", {
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
        jobTitle: form.jobTitle,
        employmentStatus: form.status,
        password: form.password || undefined,
      });
      toast.success(`Da them nhan vien ${form.name}`);
      setCreateOpen(false);
      await loadStaff();
    } catch (error) {
      toast.error("Them nhan vien that bai");
    }
  };

  const handleEdit = async () => {
    if (!editItem) return;
    try {
      await apiClient.put(`/admin/staff/${editItem.id}`, {
        name: form.name,
        phone: form.phone || undefined,
        jobTitle: form.jobTitle,
        employmentStatus: form.status,
      });
      toast.success("Da cap nhat thong tin nhan vien");
      setEditItem(null);
      await loadStaff();
    } catch (error) {
      toast.error("Cap nhat nhan vien that bai");
    }
  };

  const StaffForm = ({ mode }: { mode: "create" | "edit" }) => (
    <div className="space-y-4">
      <div><label className="font-body text-sm text-foreground mb-1 block">Ho va ten *</label><Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="rounded-xl bg-surface-lowest font-body border-none" /></div>
      <div><label className="font-body text-sm text-foreground mb-1 block">Vai tro *</label>
        <Select value={form.jobTitle} onValueChange={v => setForm(p => ({ ...p, jobTitle: v }))}>
          <SelectTrigger className="rounded-xl"><SelectValue placeholder="Chon vai tro" /></SelectTrigger>
          <SelectContent>{roles.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className="font-body text-sm text-foreground mb-1 block">Dien thoai</label><Input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className="rounded-xl bg-surface-lowest font-body border-none" /></div>
        <div><label className="font-body text-sm text-foreground mb-1 block">Email</label><Input value={form.email} disabled={mode === "edit"} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className="rounded-xl bg-surface-lowest font-body border-none" /></div>
      </div>
      {mode === "create" && <div><label className="font-body text-sm text-foreground mb-1 block">Mat khau tam</label><Input type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} className="rounded-xl bg-surface-lowest font-body border-none" /></div>}
      <div><label className="font-body text-sm text-foreground mb-1 block">Trang thai</label>
        <Select value={form.status} onValueChange={v => setForm(p => ({ ...p, status: v }))}>
          <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Dang lam</SelectItem>
            <SelectItem value="inactive">Nghi</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-headline-lg text-foreground">Quan ly nhan su</h1>
          <p className="font-body text-sm text-muted-foreground">{loading ? "Dang tai..." : `${staffList.length} nhan vien`}</p>
        </div>
        <div className="flex gap-3">
          <div className="flex gap-1 p-1 rounded-xl bg-surface-lowest">
            <button onClick={() => setTab("list")} className={`px-3 py-1.5 rounded-lg font-body text-sm ${tab === "list" ? "bg-background shadow-ambient" : "text-muted-foreground"}`}>Danh sach</button>
            <button onClick={() => setTab("schedule")} className={`px-3 py-1.5 rounded-lg font-body text-sm ${tab === "schedule" ? "bg-background shadow-ambient" : "text-muted-foreground"}`}>Lich lam viec</button>
          </div>
          <Button variant="hero" size="sm" onClick={openCreate}><Plus size={16} /> Them nhan vien</Button>
        </div>
      </div>

      {tab === "list" && (
        <>
          <div className="relative max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Tim nhan vien..." className="pl-10 rounded-xl bg-surface-lowest font-body border-none" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {staffList.map((person, i) => (
              <motion.div key={person.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-surface-lowest rounded-xl p-5 shadow-ambient hover:shadow-ambient-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-body font-bold text-sm">{person.displayName?.[0] ?? "S"}</div>
                    <div>
                      <h3 className="font-body text-sm font-semibold text-foreground">{person.displayName}</h3>
                      <p className="font-body text-xs text-muted-foreground">{person.staffProfile?.jobTitle ?? "-"}</p>
                    </div>
                  </div>
                  <span className={`w-2.5 h-2.5 rounded-full mt-1 block ${person.staffProfile?.employmentStatus === "active" ? "bg-secondary" : "bg-primary"}`} />
                </div>
                <div className="space-y-2 text-xs font-body text-muted-foreground">
                  <p className="flex items-center gap-2"><Phone size={12} /> {person.phone || "-"}</p>
                  <p className="flex items-center gap-2"><Mail size={12} /> {person.email}</p>
                  <p className="flex items-center gap-2"><Calendar size={12} /> {person.shifts?.length ?? 0} ca gan day</p>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1 text-xs rounded-xl" onClick={() => setViewItem(person)}>Xem chi tiet</Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal size={14} /></Button></DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEdit(person)}><Edit2 size={12} className="mr-2" /> Chinh sua</DropdownMenuItem>
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
          {schedule.map((item, i) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="bg-surface-lowest rounded-xl p-5 shadow-ambient">
              <h3 className="font-serif font-semibold text-foreground mb-2 flex items-center gap-2"><Calendar size={16} className="text-primary" /> {new Date(item.workDate).toLocaleDateString("vi-VN")}</h3>
              <p className="font-body text-sm text-foreground">{item.startTime} - {item.endTime}: {item.staffUser.displayName}</p>
              <p className="font-body text-xs text-muted-foreground">{item.event?.name ?? "Khong gan su kien"}</p>
            </motion.div>
          ))}
        </div>
      )}

      <Dialog open={!!viewItem} onOpenChange={() => setViewItem(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle className="font-serif">Thong tin nhan vien</DialogTitle></DialogHeader>
          {viewItem && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-body font-bold text-2xl">{viewItem.displayName?.[0] ?? "S"}</div>
                <div>
                  <h3 className="font-body text-lg font-semibold text-foreground">{viewItem.displayName}</h3>
                  <p className="font-body text-sm text-muted-foreground">{viewItem.staffProfile?.jobTitle ?? "-"}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm font-body text-muted-foreground">
                <p className="flex items-center gap-2"><Phone size={14} /> {viewItem.phone || "-"}</p>
                <p className="flex items-center gap-2"><Mail size={14} /> {viewItem.email}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewItem(null)}>Dong</Button>
            <Button variant="hero" onClick={() => { if (viewItem) { openEdit(viewItem); setViewItem(null); } }}><Eye size={14} /> Chinh sua</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle className="font-serif">Them nhan vien moi</DialogTitle></DialogHeader>
          <StaffForm mode="create" />
          <DialogFooter><Button variant="outline" onClick={() => setCreateOpen(false)}>Huy</Button><Button variant="hero" onClick={handleCreate}>Them</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editItem} onOpenChange={() => setEditItem(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle className="font-serif">Chinh sua nhan vien</DialogTitle></DialogHeader>
          <StaffForm mode="edit" />
          <DialogFooter><Button variant="outline" onClick={() => setEditItem(null)}>Huy</Button><Button variant="hero" onClick={handleEdit}>Luu</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminStaff;
