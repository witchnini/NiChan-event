import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit2, Star, Phone, MapPin, Tag, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

type Vendor = {
  id: number; name: string; category: string; contact: string; address: string;
  rating: number; projects: number; status: "Đang hợp tác" | "Tạm ngưng";
};

const initialVendors: Vendor[] = [
  { id: 1, name: "ABC Catering", category: "Catering", contact: "0901111222", address: "Q.1, TP.HCM", rating: 4.8, projects: 15, status: "Đang hợp tác" },
  { id: 2, name: "GEM Center", category: "Venue", contact: "0902222333", address: "Q.1, TP.HCM", rating: 4.9, projects: 8, status: "Đang hợp tác" },
  { id: 3, name: "Flora Dream", category: "Décor & Hoa", contact: "0903333444", address: "Q.3, TP.HCM", rating: 4.7, projects: 20, status: "Đang hợp tác" },
  { id: 4, name: "SoundPro VN", category: "Âm thanh & AS", contact: "0904444555", address: "Q.7, TP.HCM", rating: 4.5, projects: 12, status: "Đang hợp tác" },
  { id: 5, name: "PhotoArt Studio", category: "Chụp ảnh & Quay phim", contact: "0905555666", address: "Bình Thạnh, TP.HCM", rating: 4.6, projects: 18, status: "Đang hợp tác" },
  { id: 6, name: "Print Express", category: "In ấn", contact: "0906666777", address: "Q.10, TP.HCM", rating: 4.2, projects: 5, status: "Tạm ngưng" },
];

const categories = ["Tất cả", "Venue", "Catering", "Décor & Hoa", "Âm thanh & AS", "Chụp ảnh & Quay phim", "In ấn"];

const OrganizerVendors = () => {
  const [vendors, setVendors] = useState(initialVendors);
  const [filter, setFilter] = useState("Tất cả");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<Vendor | null>(null);
  const [form, setForm] = useState({ name: "", category: "Venue", contact: "", address: "" });

  const filtered = filter === "Tất cả" ? vendors : vendors.filter(v => v.category === filter);

  const openAdd = () => { setEditItem(null); setForm({ name: "", category: "Venue", contact: "", address: "" }); setDialogOpen(true); };
  const openEdit = (v: Vendor) => { setEditItem(v); setForm({ name: v.name, category: v.category, contact: v.contact, address: v.address }); setDialogOpen(true); };

  const save = () => {
    if (!form.name.trim()) return;
    if (editItem) {
      setVendors(prev => prev.map(v => v.id === editItem.id ? { ...v, ...form } : v));
      toast.success("Đã cập nhật nhà cung cấp");
    } else {
      setVendors(prev => [...prev, { id: Date.now(), ...form, rating: 0, projects: 0, status: "Đang hợp tác" }]);
      toast.success("Đã thêm nhà cung cấp mới");
    }
    setDialogOpen(false);
  };

  const toggleStatus = (id: number) => {
    setVendors(prev => prev.map(v => v.id === id ? { ...v, status: v.status === "Đang hợp tác" ? "Tạm ngưng" : "Đang hợp tác" } : v));
    toast.success("Đã cập nhật trạng thái");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="font-serif text-headline-lg text-foreground">Quản lý nhà cung cấp</h1>
        <Button variant="hero" size="sm" onClick={openAdd}><Plus size={16} /> Thêm NCC</Button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {categories.map(cat => (
          <button key={cat} onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-xl font-body text-sm transition-all ${filter === cat ? "bg-secondary text-secondary-foreground font-semibold" : "bg-surface-lowest text-muted-foreground hover:text-foreground"}`}>
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((v, i) => (
          <motion.div key={v.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-surface-lowest rounded-xl p-5 shadow-ambient hover:shadow-ambient-lg transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-body text-sm font-semibold text-foreground">{v.name}</h3>
                <span className="inline-flex items-center gap-1 font-body text-xs text-muted-foreground mt-1"><Tag size={10} />{v.category}</span>
              </div>
              <button onClick={() => toggleStatus(v.id)}
                className={`px-2 py-0.5 rounded-full text-xs font-body font-semibold cursor-pointer ${v.status === "Đang hợp tác" ? "bg-secondary/10 text-secondary" : "bg-muted text-muted-foreground"}`}>
                {v.status}
              </button>
            </div>
            <div className="space-y-2 text-xs font-body text-muted-foreground mb-4">
              <div className="flex items-center gap-2"><Phone size={12} />{v.contact}</div>
              <div className="flex items-center gap-2"><MapPin size={12} />{v.address}</div>
              <div className="flex items-center gap-2"><Star size={12} className="text-amber-500" />{v.rating} • {v.projects} dự án</div>
            </div>
            <Button variant="ghost" size="sm" className="w-full" onClick={() => openEdit(v)}><Edit2 size={14} /> Chỉnh sửa</Button>
          </motion.div>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle className="font-serif">{editItem ? "Sửa NCC" : "Thêm NCC mới"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><label className="font-body text-sm mb-1 block">Tên NCC</label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="rounded-xl border-none bg-surface-low" /></div>
            <div>
              <label className="font-body text-sm mb-1 block">Danh mục</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full rounded-xl bg-surface-low p-2.5 font-body text-sm text-foreground border-none">
                {categories.filter(c => c !== "Tất cả").map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="font-body text-sm mb-1 block">Liên hệ</label><Input value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} className="rounded-xl border-none bg-surface-low" /></div>
              <div><label className="font-body text-sm mb-1 block">Địa chỉ</label><Input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className="rounded-xl border-none bg-surface-low" /></div>
            </div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setDialogOpen(false)}>Hủy</Button><Button variant="hero" onClick={save}>Lưu</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrganizerVendors;
