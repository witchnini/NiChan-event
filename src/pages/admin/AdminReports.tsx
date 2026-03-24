import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { Download, TrendingUp, Calendar, Users, Target } from "lucide-react";
import { Button } from "@/components/ui/button";

const conversionData = [
  { month: "T1", requests: 20, contracts: 12 }, { month: "T2", requests: 25, contracts: 18 },
  { month: "T3", requests: 30, contracts: 22 }, { month: "T4", requests: 28, contracts: 20 },
  { month: "T5", requests: 35, contracts: 28 }, { month: "T6", requests: 32, contracts: 24 },
];

const revenueByType = [
  { name: "Tiệc cưới", value: 520, color: "hsl(355 63% 42%)" },
  { name: "Khai trương", value: 280, color: "hsl(113 33% 31%)" },
  { name: "Gala Dinner", value: 350, color: "hsl(355 55% 53%)" },
  { name: "Hội nghị", value: 150, color: "hsl(38 35% 70%)" },
  { name: "Road Show", value: 40, color: "hsl(38 20% 86%)" },
];

const topEvents = [
  { name: "Gala cuối năm 2025", revenue: "450tr", type: "Gala Dinner", guests: 500 },
  { name: "Tiệc cưới Royal 2025", revenue: "380tr", type: "Tiệc cưới", guests: 400 },
  { name: "Tiệc cưới Minh & Hà", revenue: "250tr", type: "Tiệc cưới", guests: 300 },
  { name: "Khai trương XYZ Corp", revenue: "180tr", type: "Khai trương", guests: 200 },
  { name: "Hội nghị ASEAN 2025", revenue: "150tr", type: "Hội nghị", guests: 250 },
];

const staffPerformance = [
  { name: "Nguyễn Thị Lan", events: 12, revenue: "1.2 tỷ", rating: 4.9 },
  { name: "Trần Văn Đức", events: 8, revenue: "780tr", rating: 4.7 },
  { name: "Phạm Thị Hoa", events: 15, revenue: "650tr", rating: 4.8 },
];

const AdminReports = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-headline-lg text-foreground">Báo cáo & Thống kê</h1>
          <p className="font-body text-sm text-muted-foreground">Tổng quan hoạt động kinh doanh</p>
        </div>
        <Button variant="outline"><Download size={16} /> Xuất báo cáo</Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Tổng doanh thu năm", value: "3.76 tỷ", icon: TrendingUp, color: "text-secondary" },
          { label: "Tổng sự kiện", value: "47", icon: Calendar, color: "text-primary" },
          { label: "Khách hàng mới", value: "38", icon: Users, color: "text-secondary" },
          { label: "Tỷ lệ chuyển đổi", value: "72%", icon: Target, color: "text-primary" },
        ].map((kpi, i) => (
          <motion.div key={kpi.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="bg-surface-lowest rounded-xl p-5 shadow-ambient"
          >
            <kpi.icon size={20} className={kpi.color} />
            <p className="font-serif text-headline-lg text-foreground mt-3">{kpi.value}</p>
            <p className="font-body text-sm text-muted-foreground">{kpi.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conversion funnel */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-surface-lowest rounded-xl p-6 shadow-ambient"
        >
          <h3 className="font-serif text-headline-md text-foreground mb-6">Yêu cầu vs Hợp đồng</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={conversionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(38 20% 86%)" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(50 8% 42%)" }} />
              <YAxis tick={{ fontSize: 12, fill: "hsl(50 8% 42%)" }} />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "none" }} />
              <Bar dataKey="requests" fill="hsl(38 20% 86%)" radius={[6, 6, 0, 0]} name="Yêu cầu" />
              <Bar dataKey="contracts" fill="hsl(355 63% 42%)" radius={[6, 6, 0, 0]} name="Hợp đồng" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Revenue by type */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="bg-surface-lowest rounded-xl p-6 shadow-ambient"
        >
          <h3 className="font-serif text-headline-md text-foreground mb-6">Doanh thu theo loại (triệu)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={revenueByType} dataKey="value" cx="50%" cy="50%" outerRadius={80} innerRadius={50}>
                {revenueByType.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {revenueByType.map((t) => (
              <div key={t.name} className="flex items-center gap-2 text-xs font-body">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: t.color }} />
                <span className="text-foreground">{t.name}</span>
                <span className="text-muted-foreground ml-auto">{t.value}tr</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top events */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="bg-surface-lowest rounded-xl p-6 shadow-ambient"
        >
          <h3 className="font-serif text-headline-md text-foreground mb-6">Top sự kiện doanh thu cao nhất</h3>
          <div className="space-y-4">
            {topEvents.map((event, i) => (
              <div key={event.name} className="flex items-center gap-4">
                <span className="font-serif text-lg font-bold text-primary w-6">{i + 1}</span>
                <div className="flex-1">
                  <p className="font-body text-sm font-semibold text-foreground">{event.name}</p>
                  <p className="font-body text-xs text-muted-foreground">{event.type} • {event.guests} khách</p>
                </div>
                <span className="font-serif font-bold text-foreground">{event.revenue}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Staff performance */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="bg-surface-lowest rounded-xl p-6 shadow-ambient"
        >
          <h3 className="font-serif text-headline-md text-foreground mb-6">Hiệu suất nhân viên</h3>
          <div className="space-y-4">
            {staffPerformance.map((s) => (
              <div key={s.name} className="flex items-center justify-between bg-surface-low rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-body font-bold text-xs">{s.name[0]}</div>
                  <div>
                    <p className="font-body text-sm font-semibold text-foreground">{s.name}</p>
                    <p className="font-body text-xs text-muted-foreground">{s.events} sự kiện • ⭐ {s.rating}</p>
                  </div>
                </div>
                <span className="font-serif font-bold text-secondary">{s.revenue}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminReports;
