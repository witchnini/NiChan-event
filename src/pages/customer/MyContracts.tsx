import { motion } from "framer-motion";
import { FileText, Download, Eye, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import SectionHeading from "@/components/SectionHeading";
import { useState } from "react";
import { toast } from "sonner";

const contracts = [
  { id: 1, event: "Tiệc cưới Minh & Hà", number: "HD-2026-001", date: "19/03/2026", value: "250,000,000đ", status: "Hiệu lực", version: "1.0",
    details: { parties: "NiChan Events & Nguyễn Thanh Hà", scope: "Tổ chức trọn gói tiệc cưới 300 khách tại GEM Center", payment: "Đặt cọc 30% → 40% trước 14 ngày → 30% sau sự kiện", terms: "Hủy trước 30 ngày: hoàn 50% cọc. Hủy trong 30 ngày: không hoàn." } },
  { id: 2, event: "Gala cuối năm 2025", number: "HD-2025-012", date: "15/11/2025", value: "450,000,000đ", status: "Thanh lý", version: "1.2",
    details: { parties: "NiChan Events & Lê Thị Hương", scope: "Tổ chức Gala Dinner 500 khách tại Sheraton Saigon", payment: "Đã thanh toán 100%", terms: "Hợp đồng đã thanh lý." } },
];

const MyContracts = () => {
  const [viewItem, setViewItem] = useState<typeof contracts[0] | null>(null);

  const handleDownload = (name: string) => {
    toast.success(`Đang tải hợp đồng ${name}...`);
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <section className="py-12 bg-surface-low">
        <div className="container mx-auto px-6">
          <SectionHeading label="Hợp đồng" title="Hợp đồng của tôi" subtitle="Xem và quản lý các hợp đồng dịch vụ." />
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-6 max-w-4xl space-y-6">
          {contracts.map((contract, i) => (
            <motion.div key={contract.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="bg-surface-lowest rounded-xl p-6 shadow-ambient"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-surface-low flex items-center justify-center shrink-0">
                    <FileText size={22} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-serif text-foreground font-semibold">{contract.event}</h3>
                    <p className="font-body text-sm text-muted-foreground mt-1">Số HĐ: {contract.number} • Phiên bản: {contract.version}</p>
                    <p className="font-body text-sm text-muted-foreground">Ngày ký: {contract.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-serif font-bold text-foreground">{contract.value}</p>
                    <span className={`inline-flex items-center gap-1 text-xs font-body font-semibold ${contract.status === "Hiệu lực" ? "text-secondary" : "text-muted-foreground"}`}>
                      <CheckCircle size={12} /> {contract.status}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => setViewItem(contract)}><Eye size={18} /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDownload(contract.number)}><Download size={18} /></Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contract Detail Dialog */}
      <Dialog open={!!viewItem} onOpenChange={() => setViewItem(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle className="font-serif">Hợp đồng {viewItem?.number}</DialogTitle></DialogHeader>
          {viewItem && (
            <div className="space-y-4 font-body text-sm">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-surface-low flex items-center justify-center"><FileText size={22} className="text-primary" /></div>
                <div>
                  <p className="font-semibold text-foreground text-base">{viewItem.event}</p>
                  <p className="text-muted-foreground">Phiên bản {viewItem.version} • {viewItem.date}</p>
                </div>
              </div>
              <div className="bg-surface-low rounded-xl p-4 space-y-3">
                <div><p className="text-muted-foreground font-semibold">Các bên</p><p className="text-foreground">{viewItem.details.parties}</p></div>
                <div><p className="text-muted-foreground font-semibold">Phạm vi</p><p className="text-foreground">{viewItem.details.scope}</p></div>
                <div><p className="text-muted-foreground font-semibold">Thanh toán</p><p className="text-foreground">{viewItem.details.payment}</p></div>
                <div><p className="text-muted-foreground font-semibold">Điều khoản</p><p className="text-foreground">{viewItem.details.terms}</p></div>
              </div>
              <div className="flex items-center justify-between">
                <p className="font-serif font-bold text-lg text-foreground">{viewItem.value}</p>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${viewItem.status === "Hiệu lực" ? "bg-secondary/10 text-secondary" : "bg-muted text-muted-foreground"}`}>{viewItem.status}</span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewItem(null)}>Đóng</Button>
            <Button variant="hero" onClick={() => { if (viewItem) handleDownload(viewItem.number); }}><Download size={14} className="mr-1" /> Tải PDF</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyContracts;
