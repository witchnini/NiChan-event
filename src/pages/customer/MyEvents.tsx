import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, MapPin, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import SectionHeading from "@/components/SectionHeading";

const events = [
  { id: 1, name: "Tiệc cưới Minh & Hà", type: "Tiệc cưới", date: "2026-05-15", location: "GEM Center, Q.1, TP.HCM", guests: 300, status: "Đang chuẩn bị", progress: 65, budget: "250,000,000đ" },
  { id: 2, name: "Khai trương Chi nhánh 3", type: "Khai trương", date: "2026-04-20", location: "Quận 7, TP.HCM", guests: 150, status: "Đã báo giá", progress: 25, budget: "80,000,000đ" },
  { id: 3, name: "Gala cuối năm 2025", type: "Gala Dinner", date: "2025-12-20", location: "Sheraton Saigon", guests: 500, status: "Hoàn thành", progress: 100, budget: "450,000,000đ" },
];

const statusFilters = ["Tất cả", "Đang chuẩn bị", "Đã báo giá", "Hoàn thành"];

const MyEvents = () => {
  const [activeFilter, setActiveFilter] = useState("Tất cả");

  const filtered = activeFilter === "Tất cả" ? events : events.filter(e => e.status === activeFilter);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <section className="py-12 bg-surface-low">
        <div className="container mx-auto px-6">
          <SectionHeading label="Sự kiện của tôi" title="Danh sách sự kiện" subtitle="Theo dõi và quản lý tất cả sự kiện của bạn." />
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="flex gap-3 mb-8 flex-wrap">
            {statusFilters.map(tab => (
              <button key={tab} onClick={() => setActiveFilter(tab)}
                className={`px-4 py-2 rounded-xl font-body text-sm transition-all ${activeFilter === tab ? "gradient-primary text-primary-foreground" : "bg-surface-lowest text-muted-foreground hover:text-foreground"}`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="space-y-6">
            {filtered.length === 0 && (
              <div className="text-center py-16">
                <p className="font-body text-muted-foreground">Không có sự kiện nào trong danh mục này.</p>
              </div>
            )}
            {filtered.map((event, i) => (
              <motion.div key={event.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <Link to={`/dashboard/su-kien/${event.id}`} className="block bg-surface-lowest rounded-xl p-6 shadow-ambient hover:shadow-ambient-lg transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-serif text-headline-md text-foreground">{event.name}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-body font-semibold ${
                          event.status === "Hoàn thành" ? "bg-secondary/10 text-secondary" :
                          event.status === "Đang chuẩn bị" ? "bg-primary/10 text-primary" :
                          "bg-muted text-muted-foreground"
                        }`}>{event.status}</span>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm font-body text-muted-foreground">
                        <span className="flex items-center gap-1"><Calendar size={14} /> {event.date}</span>
                        <span className="flex items-center gap-1"><MapPin size={14} /> {event.location}</span>
                        <span className="flex items-center gap-1"><Users size={14} /> {event.guests} khách</span>
                      </div>
                    </div>
                    <div className="w-full md:w-48 space-y-2">
                      <div className="flex items-center justify-between text-sm font-body">
                        <span className="text-muted-foreground">Tiến độ</span>
                        <span className="text-foreground font-semibold">{event.progress}%</span>
                      </div>
                      <Progress value={event.progress} className="h-2" />
                      <p className="text-sm font-body text-muted-foreground">Budget: {event.budget}</p>
                    </div>
                    <ArrowRight size={20} className="text-muted-foreground hidden md:block" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default MyEvents;
