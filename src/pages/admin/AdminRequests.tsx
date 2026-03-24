import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Eye, UserPlus, MoreHorizontal, Mail, Phone, X, Calendar, Users, DollarSign, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

type Request = {
  id: string; name: string; phone: string; email: string; event: string;
  date: string; guests: number; budget: string; status: string; created: string; manager: string; note: string;
};

const initialRequests: Request[] = [
  { id: "YC-001", name: "Nguyễn Thị Mai", phone: "0901234567", email: "mai@email.com", event: "Tiệc cưới", date: "2026-06-15", guests: 300, budget: "200-300tr", status: "Mới", created: "24/03/2026", manager: "", note: "" },
  { id: "YC-002", name: "Trần Văn Bình", phone: "0912345678", email: "binh@corp.vn", event: "Khai trương", date: "2026-05-10", guests: 150, budget: "100-200tr", status: "Đang xem", created: "23/03/2026", manager: "Lan Nguyễn", note: "Khách VIP" },
  { id: "YC-003", name: "Lê Hoàng Nam", phone: "0923456789", email: "nam@tech.io", event: "Hội nghị", date: "2026-07-20", guests: 200, budget: "50-100tr", status: "Đã báo giá", created: "22/03/2026", manager: "Đức Trần", note: "" },
  { id: "YC-004", name: "Phạm Thị Hoa", phone: "0934567890", email: "hoa@luxury.vn", event: "Gala Dinner", date: "2026-08-05", guests: 500, budget: "300-500tr", status: "Đã xác nhận", created: "20/03/2026", manager: "Lan Nguyễn", note: "Cần venue lớn" },
  { id: "YC-005", name: "Võ Minh Tuấn", phone: "0945678901", email: "tuan@startup.co", event: "Road Show", date: "2026-04-30", guests: 1000, budget: "100-200tr", status: "Từ chối", created: "18/03/2026", manager: "Đức Trần", note: "Ngân sách không phù hợp" },
];

const managers = ["Lan Nguyễn", "Đức Trần", "Hoa Phạm", "Minh Lê"];
const statuses = ["Mới", "Đang xem", "Đã báo giá", "Đã xác nhận", "Từ chối"];

const statusColors: Record<string, string> = {
  "Mới": "bg-primary/10 text-primary",
  "Đang xem": "bg-muted text-muted-foreground",
  "Đã báo giá": "bg-secondary/10 text-secondary",
  "Đã xác nhận": "bg-secondary/20 text-secondary",
  "Từ chối": "bg-destructive/10 text-destructive",
};

const AdminRequests = () => {
  const [requests, setRequests] = useState<Request[]>(initialRequests);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("Tất cả");
  const [viewItem, setViewItem] = useState<Request | null>(null);
  const [assignItem, setAssignItem] = useState<Request | null>(null);
  const [selectedManager, setSelectedManager] = useState("");

  const filtered = requests.filter((r) =>
    (filterStatus === "Tất cả" || r.status === filterStatus) &&
    (r.name.toLowerCase().includes(search.toLowerCase()) || r.event.toLowerCase().includes(search.toLowerCase()))
  );

  const handleAssign = () => {
    if (!assignItem || !selectedManager) return;
    setRequests(prev => prev.map(r => r.id === assignItem.id ? { ...r, manager: selectedManager, status: r.status === "Mới" ? "Đang xem" : r.status } : r));
    toast.success(`Đã phân công ${selectedManager} cho ${assignItem.id}`);
    setAssignItem(null);
    setSelectedManager("");
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
    toast.success(`Đã cập nhật trạng thái thành "${newStatus}"`);
  };

  const handleDelete = (id: string) => {
    setRequests(prev => prev.filter(r => r.id !== id));
    toast.success(`Đã xóa yêu cầu ${id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-headline-lg text-foreground">Quản lý yêu cầu</h1>
          <p className="font-body text-sm text-muted-foreground">{requests.length} yêu cầu tổng cộng</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Tìm theo tên, loại sự kiện..." className="pl-10 rounded-xl bg-surface-lowest font-body border-none" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["Tất cả", ...statuses].map((status) => (
            <button key={status} onClick={() => setFilterStatus(status)}
              className={`px-3 py-2 rounded-xl font-body text-sm transition-all ${filterStatus === status ? "gradient-primary text-primary-foreground" : "bg-surface-lowest text-muted-foreground hover:text-foreground"}`}
            >{status}</button>
          ))}
        </div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-surface-lowest rounded-xl shadow-ambient overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-surface-low">
              <TableHead className="font-body font-semibold">Mã</TableHead>
              <TableHead className="font-body font-semibold">Khách hàng</TableHead>
              <TableHead className="font-body font-semibold">Sự kiện</TableHead>
              <TableHead className="font-body font-semibold">Ngày tổ chức</TableHead>
              <TableHead className="font-body font-semibold">Ngân sách</TableHead>
              <TableHead className="font-body font-semibold">Phụ trách</TableHead>
              <TableHead className="font-body font-semibold">Trạng thái</TableHead>
              <TableHead className="font-body font-semibold"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((req) => (
              <TableRow key={req.id} className="hover:bg-surface-low/50">
                <TableCell className="font-body text-sm font-semibold text-primary">{req.id}</TableCell>
                <TableCell>
                  <div>
                    <p className="font-body text-sm font-semibold text-foreground">{req.name}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground"><Mail size={10} /> {req.email}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="font-body text-sm text-foreground">{req.event}</p>
                  <p className="font-body text-xs text-muted-foreground">{req.guests} khách</p>
                </TableCell>
                <TableCell className="font-body text-sm text-foreground">{req.date}</TableCell>
                <TableCell className="font-body text-sm font-semibold text-foreground">{req.budget}</TableCell>
                <TableCell className="font-body text-sm text-muted-foreground">{req.manager || "Chưa phân công"}</TableCell>
                <TableCell>
                  <span className={`px-3 py-1 rounded-full text-xs font-body font-semibold ${statusColors[req.status]}`}>{req.status}</span>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setViewItem(req)}><Eye size={14} /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setAssignItem(req); setSelectedManager(req.manager); }}><UserPlus size={14} /></Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal size={14} /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        {statuses.map(s => (
                          <DropdownMenuItem key={s} onClick={() => handleStatusChange(req.id, s)} className={req.status === s ? "font-semibold" : ""}>
                            Chuyển: {s}
                          </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDelete(req.id)} className="text-destructive">Xóa yêu cầu</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </motion.div>

      {/* View Detail Dialog */}
      <Dialog open={!!viewItem} onOpenChange={() => setViewItem(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle className="font-serif">Chi tiết yêu cầu {viewItem?.id}</DialogTitle></DialogHeader>
          {viewItem && (
            <div className="space-y-4 font-body text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1"><p className="text-muted-foreground">Khách hàng</p><p className="font-semibold text-foreground">{viewItem.name}</p></div>
                <div className="space-y-1"><p className="text-muted-foreground">Loại sự kiện</p><p className="font-semibold text-foreground">{viewItem.event}</p></div>
                <div className="space-y-1"><p className="text-muted-foreground flex items-center gap-1"><Mail size={12} /> Email</p><p className="text-foreground">{viewItem.email}</p></div>
                <div className="space-y-1"><p className="text-muted-foreground flex items-center gap-1"><Phone size={12} /> Điện thoại</p><p className="text-foreground">{viewItem.phone}</p></div>
                <div className="space-y-1"><p className="text-muted-foreground flex items-center gap-1"><Calendar size={12} /> Ngày tổ chức</p><p className="text-foreground">{viewItem.date}</p></div>
                <div className="space-y-1"><p className="text-muted-foreground flex items-center gap-1"><Users size={12} /> Số khách</p><p className="text-foreground">{viewItem.guests}</p></div>
                <div className="space-y-1"><p className="text-muted-foreground flex items-center gap-1"><DollarSign size={12} /> Ngân sách</p><p className="font-semibold text-foreground">{viewItem.budget}</p></div>
                <div className="space-y-1"><p className="text-muted-foreground">Phụ trách</p><p className="text-foreground">{viewItem.manager || "Chưa phân công"}</p></div>
              </div>
              <div className="space-y-1"><p className="text-muted-foreground">Trạng thái</p><span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[viewItem.status]}`}>{viewItem.status}</span></div>
              <div className="space-y-1"><p className="text-muted-foreground">Ngày tạo</p><p className="text-foreground">{viewItem.created}</p></div>
              {viewItem.note && <div className="space-y-1"><p className="text-muted-foreground">Ghi chú</p><p className="text-foreground">{viewItem.note}</p></div>}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewItem(null)}>Đóng</Button>
            <Button variant="hero" onClick={() => { setAssignItem(viewItem); setViewItem(null); }}>Phân công</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Manager Dialog */}
      <Dialog open={!!assignItem} onOpenChange={() => setAssignItem(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle className="font-serif">Phân công quản lý - {assignItem?.id}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <p className="font-body text-sm text-muted-foreground">Sự kiện: <span className="text-foreground font-semibold">{assignItem?.event}</span> - {assignItem?.name}</p>
            <div>
              <label className="font-body text-sm text-foreground mb-2 block">Event Manager</label>
              <Select value={selectedManager} onValueChange={setSelectedManager}>
                <SelectTrigger className="rounded-xl"><SelectValue placeholder="Chọn người phụ trách" /></SelectTrigger>
                <SelectContent>
                  {managers.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignItem(null)}>Hủy</Button>
            <Button variant="hero" onClick={handleAssign} disabled={!selectedManager}>Xác nhận</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminRequests;
