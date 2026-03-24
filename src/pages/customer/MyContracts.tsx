import { motion } from "framer-motion";
import { FileText, Download, Eye, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionHeading from "@/components/SectionHeading";

const contracts = [
  { id: 1, event: "Tiệc cưới Minh & Hà", number: "HD-2026-001", date: "19/03/2026", value: "250,000,000đ", status: "Hiệu lực", version: "1.0" },
  { id: 2, event: "Gala cuối năm 2025", number: "HD-2025-012", date: "15/11/2025", value: "450,000,000đ", status: "Thanh lý", version: "1.2" },
];

const MyContracts = () => {
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
                    <p className="font-body text-sm text-muted-foreground mt-1">
                      Số HĐ: {contract.number} • Phiên bản: {contract.version}
                    </p>
                    <p className="font-body text-sm text-muted-foreground">Ngày ký: {contract.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-serif font-bold text-foreground">{contract.value}</p>
                    <span className={`inline-flex items-center gap-1 text-xs font-body font-semibold ${
                      contract.status === "Hiệu lực" ? "text-secondary" : "text-muted-foreground"
                    }`}>
                      <CheckCircle size={12} /> {contract.status}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon"><Eye size={18} /></Button>
                    <Button variant="ghost" size="icon"><Download size={18} /></Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default MyContracts;
