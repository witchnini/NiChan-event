import { motion } from "framer-motion";
import { FileText, Download, Eye, Plus, Send, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const contracts = [
  { id: "HD-2026-001", event: "Tiệc cưới Minh & Hà", customer: "Nguyễn Thanh Hà", value: "250,000,000đ", date: "19/03/2026", status: "Hiệu lực", version: "1.0" },
  { id: "HD-2026-002", event: "Khai trương ABC Corp", customer: "Trần Văn Bình", value: "80,000,000đ", date: "23/03/2026", status: "Đã gửi khách", version: "1.0" },
  { id: "HD-2025-012", event: "Gala cuối năm 2025", customer: "Lê Thị Hương", value: "450,000,000đ", date: "15/11/2025", status: "Thanh lý", version: "1.2" },
  { id: "HD-2026-003", event: "Hội nghị CNTT 2026", customer: "Lê Hoàng Nam", value: "100,000,000đ", date: "—", status: "Nháp", version: "0.1" },
];

const statusColors: Record<string, string> = {
  "Hiệu lực": "bg-secondary/10 text-secondary",
  "Đã gửi khách": "bg-primary/10 text-primary",
  "Thanh lý": "bg-muted text-muted-foreground",
  "Nháp": "bg-surface-high text-muted-foreground",
  "Hủy": "bg-destructive/10 text-destructive",
};

const AdminContracts = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-headline-lg text-foreground">Quản lý hợp đồng</h1>
          <p className="font-body text-sm text-muted-foreground">{contracts.length} hợp đồng</p>
        </div>
        <Button variant="hero" size="sm"><Plus size={16} /> Tạo hợp đồng</Button>
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
            {contracts.map((c) => (
              <TableRow key={c.id} className="hover:bg-surface-low/50">
                <TableCell className="font-body text-sm font-semibold text-primary">{c.id}</TableCell>
                <TableCell className="font-body text-sm text-foreground">{c.event}</TableCell>
                <TableCell className="font-body text-sm text-foreground">{c.customer}</TableCell>
                <TableCell className="font-body text-sm font-semibold text-foreground">{c.value}</TableCell>
                <TableCell className="font-body text-sm text-foreground">{c.date}</TableCell>
                <TableCell className="font-body text-sm text-muted-foreground">v{c.version}</TableCell>
                <TableCell>
                  <span className={`px-3 py-1 rounded-full text-xs font-body font-semibold ${statusColors[c.status]}`}>{c.status}</span>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8"><Eye size={14} /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8"><Download size={14} /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8"><Send size={14} /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </motion.div>
    </div>
  );
};

export default AdminContracts;
