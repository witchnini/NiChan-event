import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Plus, Star, Phone, Mail, MoreHorizontal, Building2, Edit2, Trash2, Eye, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

type Vendor = { id: number; name: string; category: string; phone: string; email: string; rating: number; events: number; status: string; address: string; };

const categories = ["Tất cả", "Venue", "Catering", "Décor", "Âm thanh & AS", "In ấn", "Nhiếp ảnh", "MC"];
const vendorCategories = categories.slice(1);

const initialVendors: Vendor[] = [
  { id: 1, name: "GEM Center", category: "Venue", phone: "028 1234 5678", email: "booking@gem.vn", rating: 4.8, events: 15, status: "Đang hợp tác", address: "Q.1, TP.HCM" },
  { id: 2, name: "Gala Catering", category: "Catering", phone: "028 2345 6789", email: "order@gala.vn", rating: 4.5, events: 22, status: "Đang hợp tác", address: "Q.3, TP.HCM" },
  { id: 3, name: "Floral Dreams", category: "Décor", phone: "090 3456 789", email: "hello@floral.vn", rating: 4.9, events: 30, status: "Đang hợp tác", address: "Q.7, TP.HCM" },
  { id: 4, name: "SoundTech Pro", category: "Âm thanh & AS", phone: "091 4567 890", email: "info@soundtech.vn", rating: 4.3, events: 18, status: "Tạm dừng", address: "Bình Thạnh" },
  { id: 5, name: "Moment Studio", category: "Nhiếp ảnh", phone: "092 5678 901", email: "book@moment.vn", rating: 4.7, events: 25, status: "Đang hợp tác", address: "Q.2, TP.HCM" },
  { id: 6, name: "MC Thanh Bình", category: "MC", phone: "093 6789 012", email: "mc.binh@gmail.com", rating: 4.6, events: 40, status: "Đang hợp tác", address: "Q.1, TP.HCM" },
];

const emptyVendor = { name: "", category: "", phone: "", email: "", rating: 5, events: 0, status: "Đang hợp tác", address: "" };

const AdminVendors = () => {
  const [vendors, setVendors] = useState(initialVendors);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("Tất cả");
  const [createOpen, setCreateOpen] = useState(false);
  const [editItem, setEditItem] = useState<Vendor | null>(null);
  const [viewItem, setViewItem] = useState<Vendor | null>(null);
  const [form, setForm] = useState(emptyVendor);

  const filtered = vendors.filter(v =>
    (filterCat === "Tất cả" || v.category === filterCat) &&
    v.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = () => {
    if (!form.name || !form.category) { toast.error("Vui lòng nhập tên và danh mục"); return; }
    setVendors(prev => [...prev, { ...form, id: Date.now() }]);
    toast.success(`Đã thêm nhà cung cấp ${form.name}`);
    setCreateOpen(false);
  };

  const handleEdit = () => {
    if (!editItem) return;
    setVendors(prev => prev.map(v => v.id === editItem.id ? { ...v, ...form } : v));
    toast.success("Đã cập nhật nhà cung cấp");
    setEditItem(null);
  };

  const handleDelete = (id: number) => {
    setVendors(prev => prev.filter(v => v.id !== id));
    toast.success("Đã xóa nhà cung cấp");
  };

  const VendorForm = () => (
    <div className="space-y-4">
      <div><label className="font-body text-sm text-foreground mb-1 block">Tên NCC *</label>
        <Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Tên nhà cung cấp" className="rounded-xl bg-surface-lowest font-body border-none" />
      </div>
      <div><label className="font-body text-sm text-foreground mb-1 block">Danh mục *</label>
        <Select value={form.category} onValueChange={v => setForm(p => ({ ...p, category: v }))}>
          <SelectTrigger className="rounded-xl"><SelectValue placeholder="Chọn danh mục" /></SelectTrigger>
          <SelectContent>{vendorCategories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className="font-body text-sm text-foreground mb-1 block">Điện thoại</label>
          <Input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className="rounded-xl bg-surface-lowest font-body border-none" />
        </div>
        <div><label className="font-body text-sm text-foreground mb-1 block">Email</label>
          <Input value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className="rounded-xl bg-surface-lowest font-body border-none" />
        </div>
      </div>
      <div><label className="font-body text-sm text-foreground mb-1 block">Địa chỉ</label>
        <Input value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} className="rounded-xl bg-surface-lowest font-body border-none" />
      </div>
      <div><label className="font-body text-sm text-foreground mb-1 block">Trạng thái</label>
        <Select value={form.status} onValueChange={v => setForm(p => ({ ...p, status: v }))}>
          <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Đang hợp tác">Đang hợp tác</SelectItem>
            <SelectItem value="Tạm dừng">Tạm dừng</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-headline-lg text-foreground">Quản lý nhà cung cấp</h1>
          <p className="font-body text-sm text-muted-foreground">{vendors.length} đối tác</p>
        </div>
        <Button variant="hero" size="sm" onClick={() => { setForm(emptyVendor); setCreateOpen(true); }}><Plus size={16} /> Thêm NCC</Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Tìm nhà cung cấp..." className="pl-10 rounded-xl bg-surface-lowest font-body border-none" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map(cat => (
            <button key={cat} onClick={() => setFilterCat(cat)}
              className={`px-3 py-2 rounded-xl font-body text-sm transition-all ${filterCat === cat ? "gradient-primary text-primary-foreground" : "bg-surface-lowest text-muted-foreground hover:text-foreground"}`}
            >{cat}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((vendor, i) => (
          <motion.div key={vendor.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-surface-lowest rounded-xl p-5 shadow-ambient hover:shadow-ambient-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-surface-low flex items-center justify-center"><Building2 size={18} className="text-primary" /></div>
                <div>
                  <h3 className="font-body text-sm font-semibold text-foreground">{vendor.name}</h3>
                  <p className="font-body text-xs text-primary">{vendor.category}</p>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-body font-semibold ${vendor.status === "Đang hợp tác" ? "bg-secondary/10 text-secondary" : "bg-muted text-muted-foreground"}`}>{vendor.status}</span>
            </div>
            <div className="flex items-center gap-1 mb-3">
              <Star size={14} className="text-primary fill-primary" />
              <span className="font-body text-sm font-semibold text-foreground">{vendor.rating}</span>
              <span className="font-body text-xs text-muted-foreground">• {vendor.events} sự kiện</span>
            </div>
            <div className="space-y-1.5 text-xs font-body text-muted-foreground">
              <p className="flex items-center gap-2"><Phone size={11} /> {vendor.phone}</p>
              <p className="flex items-center gap-2"><Mail size={11} /> {vendor.email}</p>
              <p className="flex items-center gap-2"><Building2 size={11} /> {vendor.address}</p>
            </div>
            <div className="flex gap-2 mt-4">
              <Button variant="outline" size="sm" className="flex-1 text-xs rounded-xl" onClick={() => setViewItem(vendor)}>Chi tiết</Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal size={14} /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => { setForm({ name: vendor.name, category: vendor.category, phone: vendor.phone, email: vendor.email, rating: vendor.rating, events: vendor.events, status: vendor.status, address: vendor.address }); setEditItem(vendor); }}><Edit2 size={12} className="mr-2" /> Chỉnh sửa</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleDelete(vendor.id)} className="text-destructive"><Trash2 size={12} className="mr-2" /> Xóa</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </motion.div>
        ))}
      </div>

      {/* View Dialog */}
      <Dialog open={!!viewItem} onOpenChange={() => setViewItem(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle className="font-serif">{viewItem?.name}</DialogTitle></DialogHeader>
          {viewItem && (
            <div className="space-y-4 font-body text-sm">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl bg-surface-low flex items-center justify-center"><Building2 size={24} className="text-primary" /></div>
                <div>
                  <p className="text-primary font-semibold">{viewItem.category}</p>
                  <span className={`text-xs font-semibold ${viewItem.status === "Đang hợp tác" ? "text-secondary" : "text-muted-foreground"}`}>{viewItem.status}</span>
                </div>
              </div>
              <div className="flex items-center gap-2"><Star size={16} className="text-primary fill-primary" /><span className="font-semibold">{viewItem.rating}</span><span className="text-muted-foreground">• {viewItem.events} sự kiện đã hợp tác</span></div>
              <div className="space-y-2 text-muted-foreground">
                <p className="flex items-center gap-2"><Phone size={14} /> {viewItem.phone}</p>
                <p className="flex items-center gap-2"><Mail size={14} /> {viewItem.email}</p>
                <p className="flex items-center gap-2"><MapPin size={14} /> {viewItem.address}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewItem(null)}>Đóng</Button>
            <Button variant="hero" onClick={() => { if (viewItem) { setForm({ name: viewItem.name, category: viewItem.category, phone: viewItem.phone, email: viewItem.email, rating: viewItem.rating, events: viewItem.events, status: viewItem.status, address: viewItem.address }); setEditItem(viewItem); setViewItem(null); } }}>Chỉnh sửa</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle className="font-serif">Thêm nhà cung cấp</DialogTitle></DialogHeader>
          <VendorForm />
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Hủy</Button>
            <Button variant="hero" onClick={handleCreate}>Thêm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editItem} onOpenChange={() => setEditItem(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle className="font-serif">Chỉnh sửa nhà cung cấp</DialogTitle></DialogHeader>
          <VendorForm />
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditItem(null)}>Hủy</Button>
            <Button variant="hero" onClick={handleEdit}>Lưu</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminVendors;
