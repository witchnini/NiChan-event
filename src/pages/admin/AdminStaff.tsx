import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Plus, Phone, Mail, Calendar, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const staff = [
  { id: 1, name: "Nguyễn Thị Lan", role: "Event Manager", phone: "0901234567", email: "lan@eternal.vn", status: "available", events: 12, avatar: "L" },
  { id: 2, name: "Trần Văn Đức", role: "Event Manager", phone: "0912345678", email: "duc@eternal.vn", status: "busy", events: 8, avatar: "Đ" },
  { id: 3, name: "Phạm Thị Hoa", role: "Coordinator", phone: "0923456789", email: "hoa@eternal.vn", status: "available", events: 15, avatar: "H" },
  { id: 4, name: "Lê Minh Tuấn", role: "Designer", phone: "0934567890", email: "tuan@eternal.vn", status: "busy", events: 10, avatar: "T" },
  { id: 5, name: "Võ Thu Hằng", role: "Lễ tân", phone: "0945678901", email: "hang@eternal.vn", status: "available", events: 20, avatar: "H" },
  { id: 6, name: "Đặng Quốc Bảo", role: "Âm thanh & Ánh sáng", phone: "0956789012", email: "bao@eternal.vn", status: "available", events: 18, avatar: "B" },
];

const schedule = [
  { date: "25/03", events: [{ name: "Tiệc cưới Minh & Hà", staff: ["Lan", "Hoa", "Tuấn"] }, { name: "Khai trương ABC", staff: ["Đức", "Hằng"] }] },
  { date: "26/03", events: [{ name: "Họp khách hàng - Gala", staff: ["Lan"] }] },
  { date: "27/03", events: [{ name: "Survey venue Q.7", staff: ["Đức", "Bảo"] }] },
];

const AdminStaff = () => {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"list" | "schedule">("list");

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-headline-lg text-foreground">Quản lý nhân sự</h1>
          <p className="font-body text-sm text-muted-foreground">{staff.length} nhân viên</p>
        </div>
        <div className="flex gap-3">
          <div className="flex gap-1 p-1 rounded-xl bg-surface-lowest">
            <button onClick={() => setTab("list")} className={`px-3 py-1.5 rounded-lg font-body text-sm ${tab === "list" ? "bg-background shadow-ambient" : "text-muted-foreground"}`}>Danh sách</button>
            <button onClick={() => setTab("schedule")} className={`px-3 py-1.5 rounded-lg font-body text-sm ${tab === "schedule" ? "bg-background shadow-ambient" : "text-muted-foreground"}`}>Lịch làm việc</button>
          </div>
          <Button variant="hero" size="sm"><Plus size={16} /> Thêm nhân viên</Button>
        </div>
      </div>

      {tab === "list" && (
        <>
          <div className="relative max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Tìm nhân viên..." className="pl-10 rounded-xl bg-surface-lowest font-body border-none" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {staff.filter((s) => s.name.toLowerCase().includes(search.toLowerCase())).map((person, i) => (
              <motion.div key={person.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="bg-surface-lowest rounded-xl p-5 shadow-ambient hover:shadow-ambient-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-body font-bold text-sm">
                      {person.avatar}
                    </div>
                    <div>
                      <h3 className="font-body text-sm font-semibold text-foreground">{person.name}</h3>
                      <p className="font-body text-xs text-muted-foreground">{person.role}</p>
                    </div>
                  </div>
                  <span className={`w-2.5 h-2.5 rounded-full mt-1 ${person.status === "available" ? "bg-secondary" : "bg-primary"}`} />
                </div>
                <div className="space-y-2 text-xs font-body text-muted-foreground">
                  <p className="flex items-center gap-2"><Phone size={12} /> {person.phone}</p>
                  <p className="flex items-center gap-2"><Mail size={12} /> {person.email}</p>
                  <p className="flex items-center gap-2"><Calendar size={12} /> {person.events} sự kiện đã tham gia</p>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1 text-xs rounded-xl">Xem chi tiết</Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal size={14} /></Button>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {tab === "schedule" && (
        <div className="space-y-4">
          {schedule.map((day, i) => (
            <motion.div key={day.date} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="bg-surface-lowest rounded-xl p-5 shadow-ambient"
            >
              <h3 className="font-serif font-semibold text-foreground mb-4 flex items-center gap-2">
                <Calendar size={16} className="text-primary" /> {day.date}
              </h3>
              <div className="space-y-3">
                {day.events.map((event, j) => (
                  <div key={j} className="flex items-center justify-between bg-surface-low rounded-xl p-3">
                    <p className="font-body text-sm text-foreground">{event.name}</p>
                    <div className="flex -space-x-2">
                      {event.staff.map((s) => (
                        <div key={s} className="w-7 h-7 rounded-full bg-primary/10 border-2 border-surface-lowest flex items-center justify-center text-primary font-body font-bold text-[10px]">{s[0]}</div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminStaff;
