import { useState } from "react";
import { motion } from "framer-motion";
import { Download, FileText, CheckCircle, Clock, AlertTriangle, Star, Users, Camera } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const completedEvents = [
  {
    id: 1, name: "Gala cuối năm 2025", date: "20/12/2025", type: "Gala Dinner", guests: 500,
    budget: 450, actual: 430, rating: 4.9, feedback: "Tổ chức rất chuyên nghiệp, khách mời hài lòng!",
    highlights: ["Sân khấu LED 12m ấn tượng", "Menu 8 món được khen ngợi", "Show nhạc live chất lượng"],
    issues: ["Bãi đỗ xe thiếu chỗ cho 20 khách"],
    photos: 245,
  },
  {
    id: 2, name: "Tiệc cưới Royal 2025", date: "15/11/2025", type: "Tiệc cưới", guests: 400,
    budget: 380, actual: 375, rating: 4.8, feedback: "Đẹp xuất sắc, cô dâu chú rể rất hạnh phúc!",
    highlights: ["Décor hoa tươi lãng mạn", "Bánh cưới 5 tầng", "Pháo hoa kết thúc chương trình"],
    issues: [],
    photos: 380,
  },
];

const taskCompletionData = [
  { month: "T10", onTime: 18, late: 2 }, { month: "T11", onTime: 22, late: 3 },
  { month: "T12", onTime: 28, late: 1 }, { month: "T1", onTime: 15, late: 4 },
  { month: "T2", onTime: 20, late: 2 }, { month: "T3", onTime: 12, late: 1 },
];

const teamKPIs = [
  { name: "Nguyễn Thị Lan", events: 12, onTimeRate: 95, satisfaction: 4.9 },
  { name: "Trần Văn Đức", events: 8, onTimeRate: 88, satisfaction: 4.7 },
  { name: "Phạm Thị Hoa", events: 15, onTimeRate: 92, satisfaction: 4.8 },
  { name: "Lê Minh Tâm", events: 6, onTimeRate: 97, satisfaction: 4.6 },
];

const OrganizerReports = () => {
  const [activeEvent, setActiveEvent] = useState(0);

  const handleExportPDF = (name: string) => {
    toast.success(`Đang xuất báo cáo tổng kết "${name}" dạng PDF...`);
  };

  const handleExportCSV = () => {
    const csv = "Tháng,Đúng hạn,Trễ hạn\n" + taskCompletionData.map(d => `${d.month},${d.onTime},${d.late}`).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `bao-cao-task-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Đã xuất CSV thành công");
  };

  const event = completedEvents[activeEvent];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-headline-lg text-foreground">Báo cáo & Tổng kết</h1>
          <p className="font-body text-sm text-muted-foreground">Tổng kết sự kiện & hiệu suất đội ngũ</p>
        </div>
        <Button variant="outline" onClick={handleExportCSV}><Download size={16} /> Xuất CSV</Button>
      </div>

      {/* Event Summary Cards */}
      <div>
        <h2 className="font-serif text-headline-md text-foreground mb-4">Tổng kết sự kiện đã hoàn thành</h2>
        <div className="flex gap-3 mb-4">
          {completedEvents.map((e, i) => (
            <button key={e.id} onClick={() => setActiveEvent(i)}
              className={`px-4 py-2 rounded-xl font-body text-sm transition-all ${activeEvent === i ? "bg-secondary text-secondary-foreground font-semibold" : "bg-surface-lowest text-muted-foreground"}`}>
              {e.name}
            </button>
          ))}
        </div>

        <motion.div key={event.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-surface-lowest rounded-xl p-6 shadow-ambient">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 space-y-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-serif text-headline-md text-foreground">{event.name}</h3>
                  <p className="font-body text-sm text-muted-foreground mt-1">{event.type} • {event.date} • {event.guests} khách</p>
                </div>
                <Button variant="hero" size="sm" onClick={() => handleExportPDF(event.name)}><FileText size={14} /> Xuất PDF</Button>
              </div>

              {/* KPIs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-surface-low rounded-xl p-3 text-center">
                  <p className="font-body text-xs text-muted-foreground">Ngân sách</p>
                  <p className="font-serif font-bold text-foreground">{event.budget}tr</p>
                </div>
                <div className="bg-surface-low rounded-xl p-3 text-center">
                  <p className="font-body text-xs text-muted-foreground">Thực chi</p>
                  <p className="font-serif font-bold text-secondary">{event.actual}tr</p>
                </div>
                <div className="bg-surface-low rounded-xl p-3 text-center">
                  <p className="font-body text-xs text-muted-foreground">Đánh giá</p>
                  <p className="font-serif font-bold text-foreground flex items-center justify-center gap-1"><Star size={14} className="text-amber-500" />{event.rating}</p>
                </div>
                <div className="bg-surface-low rounded-xl p-3 text-center">
                  <p className="font-body text-xs text-muted-foreground">Ảnh/Video</p>
                  <p className="font-serif font-bold text-foreground flex items-center justify-center gap-1"><Camera size={14} />{event.photos}</p>
                </div>
              </div>

              {/* Feedback */}
              <div className="bg-surface-low rounded-xl p-4">
                <p className="font-body text-sm italic text-foreground">"{event.feedback}"</p>
                <p className="font-body text-xs text-muted-foreground mt-2">— Khách hàng</p>
              </div>

              {/* Highlights & Issues */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-body text-sm font-semibold text-foreground mb-2 flex items-center gap-2"><CheckCircle size={14} className="text-secondary" /> Điểm nổi bật</h4>
                  <ul className="space-y-1.5">
                    {event.highlights.map((h, i) => (
                      <li key={i} className="font-body text-sm text-muted-foreground flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 shrink-0" />{h}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-body text-sm font-semibold text-foreground mb-2 flex items-center gap-2"><AlertTriangle size={14} className="text-primary" /> Vấn đề cần cải thiện</h4>
                  {event.issues.length > 0 ? (
                    <ul className="space-y-1.5">
                      {event.issues.map((issue, i) => (
                        <li key={i} className="font-body text-sm text-muted-foreground flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />{issue}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="font-body text-sm text-muted-foreground">Không có vấn đề lớn</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Completion Rate */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-surface-lowest rounded-xl p-6 shadow-ambient">
          <h3 className="font-serif text-headline-md text-foreground mb-6">Tỷ lệ hoàn thành task</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={taskCompletionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(38 20% 86%)" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(50 8% 42%)" }} />
              <YAxis tick={{ fontSize: 12, fill: "hsl(50 8% 42%)" }} />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "none" }} />
              <Bar dataKey="onTime" fill="hsl(113 33% 31%)" radius={[6, 6, 0, 0]} name="Đúng hạn" stackId="a" />
              <Bar dataKey="late" fill="hsl(355 63% 42%)" radius={[6, 6, 0, 0]} name="Trễ hạn" stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Team KPIs */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="bg-surface-lowest rounded-xl p-6 shadow-ambient">
          <h3 className="font-serif text-headline-md text-foreground mb-6">KPI đội ngũ</h3>
          <div className="space-y-4">
            {teamKPIs.map(member => (
              <div key={member.name} className="flex items-center justify-between bg-surface-low rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center font-body font-bold text-secondary text-xs">{member.name[0]}</div>
                  <div>
                    <p className="font-body text-sm font-semibold text-foreground">{member.name}</p>
                    <p className="font-body text-xs text-muted-foreground">{member.events} sự kiện • ⭐ {member.satisfaction}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-serif font-bold ${member.onTimeRate >= 90 ? "text-secondary" : "text-primary"}`}>{member.onTimeRate}%</p>
                  <p className="font-body text-xs text-muted-foreground">đúng hạn</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrganizerReports;
