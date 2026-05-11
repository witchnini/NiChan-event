import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit2, Phone, MapPin, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiClient } from "@/services/apiClient";
import { toast } from "sonner";

type VendorCategory = { id: string; name: string };
type Vendor = {
  id: string;
  name: string;
  categoryId: string;
  category?: VendorCategory;
  phone?: string | null;
  contactName?: string | null;
  address: string;
  status: "active" | "paused" | "inactive";
};

const emptyForm = { name: "", categoryId: "", phone: "", contactName: "", address: "", status: "active" };
const statusLabel: Record<string, string> = { active: "Dang hop tac", paused: "Tam dung", inactive: "Ngung hop tac" };

const OrganizerVendors = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [categories, setCategories] = useState<VendorCategory[]>([]);
  const [filter, setFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<Vendor | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);

  const loadVendors = async () => {
    setLoading(true);
    try {
      const data = await apiClient.get<Vendor[]>("/organizer/vendors", {
        categoryId: filter === "all" ? undefined : filter,
        pageSize: 100,
      });
      setVendors(data);
    } catch (error) {
      toast.error("Khong tai duoc nha cung cap");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    apiClient.get<VendorCategory[]>("/organizer/vendor-categories")
      .then(data => {
        setCategories(data);
        setForm(prev => ({ ...prev, categoryId: prev.categoryId || data[0]?.id || "" }));
      })
      .catch(() => toast.error("Khong tai duoc danh muc nha cung cap"));
  }, []);

  useEffect(() => {
    void loadVendors();
  }, [filter]);

  const payload = () => ({
    name: form.name,
    categoryId: form.categoryId || categories[0]?.id,
    phone: form.phone || undefined,
    contactName: form.contactName || undefined,
    address: form.address,
    status: form.status,
  });

  const openAdd = () => { setEditItem(null); setForm({ ...emptyForm, categoryId: categories[0]?.id || "" }); setDialogOpen(true); };
  const openEdit = (vendor: Vendor) => {
    setEditItem(vendor);
    setForm({
      name: vendor.name,
      categoryId: vendor.categoryId,
      phone: vendor.phone ?? "",
      contactName: vendor.contactName ?? "",
      address: vendor.address,
      status: vendor.status,
    });
    setDialogOpen(true);
  };

  const save = async () => {
    if (!form.name.trim() || !form.categoryId || !form.address.trim()) return;
    try {
      if (editItem) {
        await apiClient.put(`/organizer/vendors/${editItem.id}`, payload());
      } else {
        await apiClient.post("/organizer/vendors", payload());
      }
      toast.success(editItem ? "Da cap nhat nha cung cap" : "Da them nha cung cap moi");
      setDialogOpen(false);
      await loadVendors();
    } catch (error) {
      toast.error("Luu nha cung cap that bai");
    }
  };

  const toggleStatus = async (vendor: Vendor) => {
    const next = vendor.status === "active" ? "paused" : "active";
    try {
      await apiClient.patch(`/organizer/vendors/${vendor.id}/status`, { status: next });
      toast.success("Da cap nhat trang thai");
      await loadVendors();
    } catch (error) {
      toast.error("Cap nhat trang thai that bai");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-headline-lg text-foreground">Quan ly nha cung cap</h1>
          <p className="font-body text-sm text-muted-foreground">{loading ? "Dang tai..." : `${vendors.length} nha cung cap`}</p>
        </div>
        <Button variant="hero" size="sm" onClick={openAdd}><Plus size={16} /> Them NCC</Button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {[{ id: "all", name: "Tat ca" }, ...categories].map(cat => (
          <button key={cat.id} onClick={() => setFilter(cat.id)}
            className={`px-4 py-2 rounded-xl font-body text-sm transition-all ${filter === cat.id ? "bg-secondary text-secondary-foreground font-semibold" : "bg-surface-lowest text-muted-foreground hover:text-foreground"}`}>
            {cat.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {vendors.map((vendor, i) => (
          <motion.div key={vendor.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-surface-lowest rounded-xl p-5 shadow-ambient hover:shadow-ambient-lg transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-body text-sm font-semibold text-foreground">{vendor.name}</h3>
                <span className="inline-flex items-center gap-1 font-body text-xs text-muted-foreground mt-1"><Tag size={10} />{vendor.category?.name ?? "-"}</span>
              </div>
              <button onClick={() => toggleStatus(vendor)} className={`px-2 py-0.5 rounded-full text-xs font-body font-semibold cursor-pointer ${vendor.status === "active" ? "bg-secondary/10 text-secondary" : "bg-muted text-muted-foreground"}`}>
                {statusLabel[vendor.status]}
              </button>
            </div>
            <div className="space-y-2 text-xs font-body text-muted-foreground mb-4">
              <div className="flex items-center gap-2"><Phone size={12} />{vendor.phone || "-"}</div>
              <div className="flex items-center gap-2"><MapPin size={12} />{vendor.address}</div>
            </div>
            <Button variant="ghost" size="sm" className="w-full" onClick={() => openEdit(vendor)}><Edit2 size={14} /> Chinh sua</Button>
          </motion.div>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle className="font-serif">{editItem ? "Sua NCC" : "Them NCC moi"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><label className="font-body text-sm mb-1 block">Ten NCC</label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="rounded-xl border-none bg-surface-low" /></div>
            <div><label className="font-body text-sm mb-1 block">Danh muc</label>
              <Select value={form.categoryId} onValueChange={v => setForm({ ...form, categoryId: v })}>
                <SelectTrigger className="rounded-xl"><SelectValue placeholder="Chon danh muc" /></SelectTrigger>
                <SelectContent>{categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="font-body text-sm mb-1 block">Lien he</label><Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="rounded-xl border-none bg-surface-low" /></div>
              <div><label className="font-body text-sm mb-1 block">Dia chi</label><Input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className="rounded-xl border-none bg-surface-low" /></div>
            </div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setDialogOpen(false)}>Huy</Button><Button variant="hero" onClick={save}>Luu</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrganizerVendors;
