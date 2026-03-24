import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Eye, UserPlus, MoreHorizontal, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const requests = [
  { id: "YC-001", name: "Nguyễn Thị Mai", phone: "0901234567", email: "mai@email.com", event: "Tiệc cưới", date: "2026-06-15", guests: 300, budget: "200-300tr", status: "Mới", created: "24/03/2026", manager: "" },
  { id: "YC-002", name: "Trần Văn Bình", phone: "0912345678", email: "binh@corp.vn", event: "Khai trương", date: "2026-05-10", guests: 150, budget: "100-200tr", status: "Đang xem", created: "23/03/2026", manager: "Lan Nguyễn" },
  { id: "YC-003", name: "Lê Hoàng Nam", phone: "0923456789", email: "nam@tech.io", event: "Hội nghị", date: "2026-07-20", guests: 200, budget: "50-100tr", status: "Đã báo giá", created: "22/03/2026", manager: "Đức Trần" },
  { id: "YC-004", name: "Phạm Thị Hoa", phone: "0934567890", email: "hoa@luxury.vn", event: "Gala Dinner", date: "2026-08-05", guests: 500, budget: "300-500tr", status: "Đã xác nhận", created: "20/03/2026", manager: "Lan Nguyễn" },
  { id: "YC-005", name: "Võ Minh Tuấn", phone: "0945678901", email: "tuan@startup.co", event: "Road Show", date: "2026-04-30", guests: 1000, budget: "100-200tr", status: "Từ chối", created: "18/03/2026", manager: "Đức Trần" },
];

const statusColors: Record<string, string> = {
  "Mới": "bg-primary/10 text-primary",
  "Đang xem": "bg-muted text-muted-foreground",
  "Đã báo giá": "bg-secondary/10 text-secondary",
  "Đã xác nhận": "bg-secondary/20 text-secondary",
  "Từ chối": "bg-destructive/10 text-destructive",
};

const AdminRequests = () => {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("Tất cả");

  const filtered = requests.filter((r) =>
    (filterStatus === "Tất cả" || r.status === filterStatus) &&
    (r.name.toLowerCase().includes(search.toLowerCase()) || r.event.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-headline-lg text-foreground">Quản lý yêu cầu</h1>
          <p className="font-body text-sm text-muted-foreground">{requests.length} yêu cầu tổng cộng</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Tìm theo tên, loại sự kiện..." className="pl-10 rounded-xl bg-surface-lowest font-body border-none" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["Tất cả", "Mới", "Đang xem", "Đã báo giá", "Đã xác nhận", "Từ chối"].map((status) => (
            <button key={status} onClick={() => setFilterStatus(status)}
              className={`px-3 py-2 rounded-xl font-body text-sm transition-all ${
                filterStatus === status ? "gradient-primary text-primary-foreground" : "bg-surface-lowest text-muted-foreground hover:text-foreground"
              }`}
            >{status}</button>
          ))}
        </div>
      </div>

      {/* Table */}
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
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Mail size={10} /> {req.email}
                    </div>
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
                    <Button variant="ghost" size="icon" className="h-8 w-8"><Eye size={14} /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8"><UserPlus size={14} /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal size={14} /></Button>
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

export default AdminRequests;
