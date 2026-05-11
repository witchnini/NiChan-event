import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FileText, Download, Eye, Send, MoreHorizontal, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { apiClient } from "@/services/apiClient";
import { toast } from "sonner";

type Contract = {
  id: string;
  contractCode: string;
  status: string;
  totalValue: string | number;
  currentVersion: string;
  sentAt?: string | null;
  signedAt?: string | null;
  event?: { id: string; name: string; type: string } | null;
  customerUser?: { id: string; displayName: string } | null;
  versions?: { scopeText?: string; paymentTerms?: string; generalTerms?: string }[];
};

const statusColors: Record<string, string> = {
  active: "bg-secondary/10 text-secondary",
  sent: "bg-primary/10 text-primary",
  completed: "bg-muted text-muted-foreground",
  draft: "bg-surface-high text-muted-foreground",
  cancelled: "bg-destructive/10 text-destructive",
};

const money = (value: string | number) => Number(value || 0).toLocaleString("vi-VN") + "d";

const AdminContracts = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [viewItem, setViewItem] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);

  const loadContracts = async () => {
    setLoading(true);
    try {
      const data = await apiClient.get<Contract[]>("/admin/contracts", { pageSize: 100 });
      setContracts(data);
    } catch (error) {
      toast.error("Khong tai duoc danh sach hop dong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadContracts();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await apiClient.del(`/admin/contracts/${id}`);
      toast.success("Da xoa hop dong");
      await loadContracts();
    } catch (error) {
      toast.error("Xoa hop dong that bai");
    }
  };

  const handleSend = async (contract: Contract) => {
    try {
      await apiClient.patch(`/admin/contracts/${contract.id}/send`);
      toast.success(`Da gui hop dong ${contract.contractCode}`);
      await loadContracts();
    } catch (error) {
      toast.error("Gui hop dong that bai");
    }
  };

  const handleDownload = (contract: Contract) => {
    toast.success(`Dang tai hop dong ${contract.contractCode}...`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-headline-lg text-foreground">Quan ly hop dong</h1>
          <p className="font-body text-sm text-muted-foreground">{loading ? "Dang tai..." : `${contracts.length} hop dong`}</p>
        </div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-surface-lowest rounded-xl shadow-ambient overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-surface-low">
              <TableHead>So HD</TableHead>
              <TableHead>Su kien</TableHead>
              <TableHead>Khach hang</TableHead>
              <TableHead>Gia tri</TableHead>
              <TableHead>Ngay gui</TableHead>
              <TableHead>Phien ban</TableHead>
              <TableHead>Trang thai</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {contracts.map(contract => (
              <TableRow key={contract.id} className="hover:bg-surface-low/50">
                <TableCell className="font-body text-sm font-semibold text-primary">{contract.contractCode}</TableCell>
                <TableCell className="font-body text-sm text-foreground">{contract.event?.name ?? "-"}</TableCell>
                <TableCell className="font-body text-sm text-foreground">{contract.customerUser?.displayName ?? "-"}</TableCell>
                <TableCell className="font-body text-sm font-semibold text-foreground">{money(contract.totalValue)}</TableCell>
                <TableCell className="font-body text-sm text-foreground">{contract.sentAt ? new Date(contract.sentAt).toLocaleDateString("vi-VN") : "-"}</TableCell>
                <TableCell className="font-body text-sm text-muted-foreground">v{contract.currentVersion}</TableCell>
                <TableCell><span className={`px-3 py-1 rounded-full text-xs font-body font-semibold ${statusColors[contract.status] ?? "bg-muted text-muted-foreground"}`}>{contract.status}</span></TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setViewItem(contract)} title="Xem"><Eye size={14} /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDownload(contract)} title="Tai"><Download size={14} /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleSend(contract)} title="Gui"><Send size={14} /></Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal size={14} /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDelete(contract.id)} className="text-destructive"><Trash2 size={12} className="mr-2" /> Xoa</DropdownMenuItem>
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
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle className="font-serif">Hop dong {viewItem?.contractCode}</DialogTitle></DialogHeader>
          {viewItem && (
            <div className="space-y-3 font-body text-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-surface-low flex items-center justify-center"><FileText size={22} className="text-primary" /></div>
                <div><p className="font-semibold text-foreground">{viewItem.event?.name ?? "-"}</p><p className="text-muted-foreground">{viewItem.customerUser?.displayName ?? "-"}</p></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-muted-foreground">Gia tri</p><p className="font-semibold text-foreground">{money(viewItem.totalValue)}</p></div>
                <div><p className="text-muted-foreground">Phien ban</p><p className="text-foreground">v{viewItem.currentVersion}</p></div>
                <div><p className="text-muted-foreground">Trang thai</p><span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusColors[viewItem.status] ?? "bg-muted text-muted-foreground"}`}>{viewItem.status}</span></div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewItem(null)}>Dong</Button>
            <Button variant="outline" onClick={() => { if (viewItem) handleDownload(viewItem); }}><Download size={14} className="mr-1" /> Tai PDF</Button>
            <Button variant="hero" onClick={() => { if (viewItem) handleSend(viewItem); setViewItem(null); }}><Send size={14} className="mr-1" /> Gui khach</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminContracts;
