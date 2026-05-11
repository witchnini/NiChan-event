import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Eye, UserPlus, MoreHorizontal, Mail, Phone, Calendar, Users, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { apiClient } from "@/services/apiClient";
import { toast } from "sonner";

type RequestItem = {
  id: string;
  requestCode: string;
  customerName: string;
  phone: string;
  email: string;
  eventType: string;
  eventDate?: string | null;
  guestCount?: number | null;
  budgetRange?: string | null;
  locationText?: string | null;
  status: string;
  createdAt: string;
  note?: string | null;
  assignedManagerId?: string | null;
  assignedManager?: { id: string; displayName: string } | null;
};

type Manager = { id: string; displayName: string; email: string };

const statuses = [
  { value: "new", label: "Moi" },
  { value: "reviewing", label: "Dang xem" },
  { value: "quoted", label: "Da bao gia" },
  { value: "confirmed", label: "Da xac nhan" },
  { value: "rejected", label: "Tu choi" },
];

const statusLabel = Object.fromEntries(statuses.map(s => [s.value, s.label]));
const statusColors: Record<string, string> = {
  new: "bg-primary/10 text-primary",
  reviewing: "bg-muted text-muted-foreground",
  quoted: "bg-secondary/10 text-secondary",
  confirmed: "bg-secondary/20 text-secondary",
  rejected: "bg-destructive/10 text-destructive",
};

const AdminRequests = () => {
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [managers, setManagers] = useState<Manager[]>([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [viewItem, setViewItem] = useState<RequestItem | null>(null);
  const [assignItem, setAssignItem] = useState<RequestItem | null>(null);
  const [selectedManager, setSelectedManager] = useState("");
  const [loading, setLoading] = useState(true);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const data = await apiClient.get<RequestItem[]>("/admin/requests", {
        search,
        status: filterStatus === "all" ? undefined : filterStatus,
        pageSize: 100,
      });
      setRequests(data);
    } catch (error) {
      toast.error("Khong tai duoc danh sach yeu cau");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadRequests();
  }, [search, filterStatus]);

  useEffect(() => {
    apiClient.get<Manager[]>("/admin/users", { role: "organizer", pageSize: 100 })
      .then(data => setManagers(data))
      .catch(() => toast.error("Khong tai duoc danh sach quan ly"));
  }, []);

  const handleAssign = async () => {
    if (!assignItem || !selectedManager) return;
    try {
      await apiClient.patch(`/admin/requests/${assignItem.id}/assign-manager`, { managerUserId: selectedManager });
      toast.success("Da phan cong quan ly");
      setAssignItem(null);
      setSelectedManager("");
      await loadRequests();
    } catch (error) {
      toast.error("Phan cong that bai");
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await apiClient.patch(`/admin/requests/${id}/status`, { status: newStatus });
      toast.success("Da cap nhat trang thai");
      await loadRequests();
    } catch (error) {
      toast.error("Cap nhat trang thai that bai");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiClient.del(`/admin/requests/${id}`);
      toast.success("Da xoa yeu cau");
      await loadRequests();
    } catch (error) {
      toast.error("Xoa yeu cau that bai");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-headline-lg text-foreground">Quan ly yeu cau</h1>
          <p className="font-body text-sm text-muted-foreground">{loading ? "Dang tai..." : `${requests.length} yeu cau`}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Tim theo ten, email, ma yeu cau..." className="pl-10 rounded-xl bg-surface-lowest font-body border-none" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {[{ value: "all", label: "Tat ca" }, ...statuses].map((status) => (
            <button key={status.value} onClick={() => setFilterStatus(status.value)}
              className={`px-3 py-2 rounded-xl font-body text-sm transition-all ${filterStatus === status.value ? "gradient-primary text-primary-foreground" : "bg-surface-lowest text-muted-foreground hover:text-foreground"}`}
            >{status.label}</button>
          ))}
        </div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-surface-lowest rounded-xl shadow-ambient overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-surface-low">
              <TableHead>Ma</TableHead>
              <TableHead>Khach hang</TableHead>
              <TableHead>Su kien</TableHead>
              <TableHead>Ngay to chuc</TableHead>
              <TableHead>Ngan sach</TableHead>
              <TableHead>Phu trach</TableHead>
              <TableHead>Trang thai</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((req) => (
              <TableRow key={req.id} className="hover:bg-surface-low/50">
                <TableCell className="font-body text-sm font-semibold text-primary">{req.requestCode}</TableCell>
                <TableCell>
                  <p className="font-body text-sm font-semibold text-foreground">{req.customerName}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground"><Mail size={10} /> {req.email}</div>
                </TableCell>
                <TableCell>
                  <p className="font-body text-sm text-foreground">{req.eventType}</p>
                  <p className="font-body text-xs text-muted-foreground">{req.guestCount ?? 0} khach</p>
                </TableCell>
                <TableCell className="font-body text-sm text-foreground">{req.eventDate ? new Date(req.eventDate).toLocaleDateString("vi-VN") : "-"}</TableCell>
                <TableCell className="font-body text-sm font-semibold text-foreground">{req.budgetRange || "-"}</TableCell>
                <TableCell className="font-body text-sm text-muted-foreground">{req.assignedManager?.displayName || "Chua phan cong"}</TableCell>
                <TableCell>
                  <span className={`px-3 py-1 rounded-full text-xs font-body font-semibold ${statusColors[req.status] ?? "bg-muted text-muted-foreground"}`}>{statusLabel[req.status] ?? req.status}</span>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setViewItem(req)}><Eye size={14} /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setAssignItem(req); setSelectedManager(req.assignedManagerId ?? ""); }}><UserPlus size={14} /></Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal size={14} /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        {statuses.map(s => (
                          <DropdownMenuItem key={s.value} onClick={() => handleStatusChange(req.id, s.value)} className={req.status === s.value ? "font-semibold" : ""}>
                            Chuyen: {s.label}
                          </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDelete(req.id)} className="text-destructive">Xoa yeu cau</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </motion.div>

      <Dialog open={!!viewItem} onOpenChange={() => setViewItem(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle className="font-serif">Chi tiet yeu cau {viewItem?.requestCode}</DialogTitle></DialogHeader>
          {viewItem && (
            <div className="space-y-4 font-body text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-muted-foreground">Khach hang</p><p className="font-semibold text-foreground">{viewItem.customerName}</p></div>
                <div><p className="text-muted-foreground">Loai su kien</p><p className="font-semibold text-foreground">{viewItem.eventType}</p></div>
                <div><p className="text-muted-foreground flex items-center gap-1"><Mail size={12} /> Email</p><p>{viewItem.email}</p></div>
                <div><p className="text-muted-foreground flex items-center gap-1"><Phone size={12} /> Dien thoai</p><p>{viewItem.phone}</p></div>
                <div><p className="text-muted-foreground flex items-center gap-1"><Calendar size={12} /> Ngay to chuc</p><p>{viewItem.eventDate ? new Date(viewItem.eventDate).toLocaleDateString("vi-VN") : "-"}</p></div>
                <div><p className="text-muted-foreground flex items-center gap-1"><Users size={12} /> So khach</p><p>{viewItem.guestCount ?? 0}</p></div>
                <div><p className="text-muted-foreground flex items-center gap-1"><DollarSign size={12} /> Ngan sach</p><p className="font-semibold">{viewItem.budgetRange || "-"}</p></div>
                <div><p className="text-muted-foreground">Phu trach</p><p>{viewItem.assignedManager?.displayName || "Chua phan cong"}</p></div>
              </div>
              {viewItem.note && <div><p className="text-muted-foreground">Ghi chu</p><p>{viewItem.note}</p></div>}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewItem(null)}>Dong</Button>
            <Button variant="hero" onClick={() => { setAssignItem(viewItem); setViewItem(null); }}>Phan cong</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!assignItem} onOpenChange={() => setAssignItem(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle className="font-serif">Phan cong quan ly - {assignItem?.requestCode}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <p className="font-body text-sm text-muted-foreground">Su kien: <span className="text-foreground font-semibold">{assignItem?.eventType}</span> - {assignItem?.customerName}</p>
            <Select value={selectedManager} onValueChange={setSelectedManager}>
              <SelectTrigger className="rounded-xl"><SelectValue placeholder="Chon nguoi phu trach" /></SelectTrigger>
              <SelectContent>
                {managers.map(m => <SelectItem key={m.id} value={m.id}>{m.displayName}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignItem(null)}>Huy</Button>
            <Button variant="hero" onClick={handleAssign} disabled={!selectedManager}>Xac nhan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminRequests;
