import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Download, Eye, Plus, Send, MoreHorizontal, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

type Contract = { id: string; event: string; customer: string; value: string; date: string; status: string; version: string; };

const statusList = ["Hiệu lực", "Đã gửi khách", "Thanh lý", "Nháp", "Hủy"];
const statusColors: Record<string, string> = {
  "Hiệu lực": "bg-secondary/10 text-secondary",
  "Đã gửi khách": "bg-primary/10 text-primary",
  "Thanh lý": "bg-muted text-muted-foreground",
  "Nháp": "bg-surface-high text-muted-foreground",
  "Hủy": "bg-destructive/10 text-destructive",
};

const initialContracts: Contract[] = [
  { id: "HD-2026-001", event: "Tiệc cưới Minh & Hà", customer: "Nguyễn Thanh Hà", value: "250,000,000đ", date: "19/03/2026", status: "Hiệu lực", version: "1.0" },
  { id: "HD-2026-002", event: "Khai trương ABC Corp", customer: "Trần Văn Bình", value: "80,000,000đ", date: "23/03/2026", status: "Đã gửi khách", version: "1.0" },
  { id: "HD-2025-012", event: "Gala cuối năm 2025", customer: "Lê Thị Hương", value: "450,000,000đ", date: "15/11/2025", status: "Thanh lý", version: "1.2" },
  { id: "HD-2026-003", event: "Hội nghị CNTT 2026", customer: "Lê Hoàng Nam", value: "100,000,000đ", date: "—", status: "Nháp", version: "0.1" },
];

const emptyContract = { id: "", event: "", customer: "", value: "", date: "", status: "Nháp", version: "1.0" };

const AdminContracts = () => {
  const [contracts, setContracts] = useState(initialContracts);
  const [viewItem, setViewItem] = useState<Contract | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editItem, setEditItem] = useState<Contract | null>(null);
  const [form, setForm] = useState(emptyContract);

  const handleCreate = () => {
    if (!form.event || !form.customer) { toast.error("Vui lòng nhập sự kiện và khách hàng"); return; }
    const newId = `HD-2026-${String(contracts.length + 1).padStart(3, "0")}`;
    setContracts(prev => [...prev, { ...form, id: newId }]);
    toast.success(`Đã tạo hợp đồng ${newId}`);
    setCreateOpen(false);
  };

  const handleEdit = () => {
    if (!editItem) return;
    setContracts(prev => prev.map(c => c.id === editItem.id ? { ...c, ...form } : c));
    toast.success("Đã cập nhật hợp đồng");
    setEditItem(null);
  };

  const handleDelete = (id: string) => {
    setContracts(prev => prev.filter(c => c.id !== id));
    toast.success(`Đã xóa hợp đồng ${id}`);
  };

  const handleSend = (c: Contract) => {
    setContracts(prev => prev.map(ct => ct.id === c.id ? { ...ct, status: "Đã gửi khách" } : ct));
    toast.success(`Đã gửi hợp đồng ${c.id} cho khách hàng`);
  };

  const handleDownload = (c: Contract) => {
    toast.success(`Đang tải hợp đồng ${c.id}...`);
  };

  const ContractForm = () => (
    <div className="space-y-4">
      <div><label className="font-body text-sm text-foreground mb-1 block">Sự kiện *</label>
        <Input value={form.event} onChange={e => setForm(p => ({ ...p, event: e.target.value }))} className="rounded-xl bg-surface-lowest font-body border-none" />
      </div>
      <div><label className="font-body text-sm text-foreground mb-1 block">Khách hàng *</label>
        <Input value={form.customer} onChange={e => setForm(p => ({ ...p, customer: e.target.value }))} className="rounded-xl bg-surface-lowest font-body border-none" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className="font-body text-sm text-foreground mb-1 block">Giá trị</label>
          <Input value={form.value} onChange={e => setForm(p => ({ ...p, value: e.target.value }))} placeholder="100,000,000đ" className="rounded-xl bg-surface-lowest font-body border-none" />
        </div>
        <div><label className="font-body text-sm text-foreground mb-1 block">Ngày ký</label>
          <Input value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} placeholder="dd/mm/yyyy" className="rounded-xl bg-surface-lowest font-body border-none" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className="font-body text-sm text-foreground mb-1 block">Trạng thái</label>
          <Select value={form.status} onValueChange={v => setForm(p => ({ ...p, status: v }))}>
            <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
            <SelectContent>{statusList.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div><label className="font-body text-sm text-foreground mb-1 block">Phiên bản</label>
          <Input value={form.version} onChange={e => setForm(p => ({ ...p, version: e.target.value }))} className="rounded-xl bg-surface-lowest font-body border-none" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-headline-lg text-foreground">Quản lý hợp đồng</h1>
          <p className="font-body text-sm text-muted-foreground">{contracts.length} hợp đồng</p>
        </div>
        <Button variant="hero" size="sm" onClick={() => { setForm(emptyContract); setCreateOpen(true); }}><Plus size={16} /> Tạo hợp đồng</Button>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-surface-lowest rounded-xl shadow-ambient overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-surface-low">
              <TableHead className="font-body font-semibold">Số HĐ</TableHead>
              <TableHead className="font-body font-semibold">Sự kiện</TableHead>
              <TableHead className="font-body font-semibold">Khách hàng</TableHead>
              <TableHead className="font-body font-semibold">Giá trị</TableHead>
              <TableHead className="font-body font-semibold">Ngày ký</TableHead>
              <TableHead className="font-body font-semibold">Phiên bản</TableHead>
              <TableHead className="font-body font-semibold">Trạng thái</TableHead>
              <TableHead className="font-body font-semibold"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contracts.map(c => (
              <TableRow key={c.id} className="hover:bg-surface-low/50">
                <TableCell className="font-body text-sm font-semibold text-primary">{c.id}</TableCell>
                <TableCell className="font-body text-sm text-foreground">{c.event}</TableCell>
                <TableCell className="font-body text-sm text-foreground">{c.customer}</TableCell>
                <TableCell className="font-body text-sm font-semibold text-foreground">{c.value}</TableCell>
                <TableCell className="font-body text-sm text-foreground">{c.date}</TableCell>
                <TableCell className="font-body text-sm text-muted-foreground">v{c.version}</TableCell>
                <TableCell><span className={`px-3 py-1 rounded-full text-xs font-body font-semibold ${statusColors[c.status]}`}>{c.status}</span></TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setViewItem(c)} title="Xem"><Eye size={14} /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDownload(c)} title="Tải"><Download size={14} /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleSend(c)} title="Gửi"><Send size={14} /></Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal size={14} /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => { setForm({ id: c.id, event: c.event, customer: c.customer, value: c.value, date: c.date, status: c.status, version: c.version }); setEditItem(c); }}><Edit2 size={12} className="mr-2" /> Chỉnh sửa</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDelete(c.id)} className="text-destructive"><Trash2 size={12} className="mr-2" /> Xóa</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </motion.div>

      {/* View Dialog */}
      <Dialog open={!!viewItem} onOpenChange={() => setViewItem(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle className="font-serif">Hợp đồng {viewItem?.id}</DialogTitle></DialogHeader>
          {viewItem && (
            <div className="space-y-3 font-body text-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-surface-low flex items-center justify-center"><FileText size={22} className="text-primary" /></div>
                <div>
                  <p className="font-semibold text-foreground">{viewItem.event}</p>
                  <p className="text-muted-foreground">{viewItem.customer}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-muted-foreground">Giá trị</p><p className="font-semibold text-foreground">{viewItem.value}</p></div>
                <div><p className="text-muted-foreground">Ngày ký</p><p className="text-foreground">{viewItem.date}</p></div>
                <div><p className="text-muted-foreground">Phiên bản</p><p className="text-foreground">v{viewItem.version}</p></div>
                <div><p className="text-muted-foreground">Trạng thái</p><span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusColors[viewItem.status]}`}>{viewItem.status}</span></div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewItem(null)}>Đóng</Button>
            <Button variant="outline" onClick={() => { if (viewItem) handleDownload(viewItem); }}><Download size={14} className="mr-1" /> Tải PDF</Button>
            <Button variant="hero" onClick={() => { if (viewItem) handleSend(viewItem); setViewItem(null); }}><Send size={14} className="mr-1" /> Gửi khách</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle className="font-serif">Tạo hợp đồng mới</DialogTitle></DialogHeader>
          <ContractForm />
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Hủy</Button>
            <Button variant="hero" onClick={handleCreate}>Tạo</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editItem} onOpenChange={() => setEditItem(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle className="font-serif">Chỉnh sửa hợp đồng</DialogTitle></DialogHeader>
          <ContractForm />
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditItem(null)}>Hủy</Button>
            <Button variant="hero" onClick={handleEdit}>Lưu</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminContracts;
