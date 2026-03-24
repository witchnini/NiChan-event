import { motion } from "framer-motion";
import { TrendingUp, Calendar, Users, DollarSign, FileText, Clock, AlertCircle, ArrowUpRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const monthlyRevenue = [
  { month: "T1", revenue: 120 }, { month: "T2", revenue: 180 }, { month: "T3", revenue: 250 },
  { month: "T4", revenue: 200 }, { month: "T5", revenue: 310 }, { month: "T6", revenue: 280 },
  { month: "T7", revenue: 350 }, { month: "T8", revenue: 290 }, { month: "T9", revenue: 420 },
  { month: "T10", revenue: 380 }, { month: "T11", revenue: 460 }, { month: "T12", revenue: 520 },
];

const eventTypes = [
  { name: "Tiệc cưới", value: 35, color: "hsl(355 63% 42%)" },
  { name: "Khai trương", value: 25, color: "hsl(113 33% 31%)" },
  { name: "Gala Dinner", value: 20, color: "hsl(355 55% 53%)" },
  { name: "Hội nghị", value: 15, color: "hsl(38 35% 70%)" },
  { name: "Khác", value: 5, color: "hsl(38 20% 86%)" },
];

const recentRequests = [
  { name: "Nguyễn Thị Mai", event: "Tiệc cưới", budget: "200-300tr", time: "30 phút trước", status: "Mới" },
  { name: "Trần Văn Bình", event: "Khai trương", budget: "100-200tr", time: "2 giờ trước", status: "Đang xem" },
  { name: "Lê Hoàng Nam", event: "Hội nghị", budget: "50-100tr", time: "5 giờ trước", status: "Đã báo giá" },
  { name: "Phạm Thị Hoa", event: "Gala Dinner", budget: "300-500tr", time: "1 ngày trước", status: "Đã xác nhận" },
];

const upcomingEvents = [
  { name: "Tiệc cưới Minh & Hà", date: "15/05/2026", progress: 65, daysLeft: 52 },
  { name: "Khai trương ABC Corp", date: "20/04/2026", progress: 40, daysLeft: 27 },
  { name: "Hội nghị CNTT 2026", date: "10/06/2026", progress: 15, daysLeft: 78 },
];

const AdminDashboard = () => {
  const stats = [
    { label: "Doanh thu tháng", value: "520tr", change: "+12%", icon: DollarSign, color: "text-primary" },
    { label: "Sự kiện đang chạy", value: "8", change: "+2", icon: Calendar, color: "text-secondary" },
    { label: "Yêu cầu mới", value: "12", change: "+5", icon: FileText, color: "text-primary" },
    { label: "Khách hàng", value: "156", change: "+8", icon: Users, color: "text-secondary" },
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="bg-surface-lowest rounded-xl p-5 shadow-ambient"
          >
            <div className="flex items-center justify-between mb-3">
              <stat.icon size={20} className={stat.color} />
              <span className="flex items-center gap-1 text-xs font-body font-semibold text-secondary">
                <TrendingUp size={12} /> {stat.change}
              </span>
            </div>
            <p className="font-serif text-headline-lg text-foreground">{stat.value}</p>
            <p className="font-body text-sm text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-2 bg-surface-lowest rounded-xl p-6 shadow-ambient">
          <h3 className="font-serif text-headline-md text-foreground mb-6">Doanh thu theo tháng (triệu VNĐ)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(38 20% 86%)" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(50 8% 42%)" }} />
              <YAxis tick={{ fontSize: 12, fill: "hsl(50 8% 42%)" }} />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 8px 40px rgba(0,0,0,0.04)" }} />
              <Bar dataKey="revenue" fill="hsl(355 63% 42%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Event Types Pie */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-surface-lowest rounded-xl p-6 shadow-ambient">
          <h3 className="font-serif text-headline-md text-foreground mb-6">Loại sự kiện</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={eventTypes} dataKey="value" cx="50%" cy="50%" outerRadius={80} innerRadius={50}>
                {eventTypes.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-4">
            {eventTypes.map((type) => (
              <div key={type.name} className="flex items-center justify-between text-sm font-body">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ background: type.color }} />
                  <span className="text-foreground">{type.name}</span>
                </div>
                <span className="text-muted-foreground">{type.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Requests */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-surface-lowest rounded-xl p-6 shadow-ambient">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-serif text-headline-md text-foreground">Yêu cầu gần đây</h3>
            <a href="/admin/yeu-cau" className="text-primary font-body text-sm hover:underline flex items-center gap-1">Xem tất cả <ArrowUpRight size={14} /></a>
          </div>
          <div className="space-y-4">
            {recentRequests.map((req, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                <div>
                  <p className="font-body text-sm font-semibold text-foreground">{req.name}</p>
                  <p className="font-body text-xs text-muted-foreground">{req.event} • {req.budget} • {req.time}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-body font-semibold ${
                  req.status === "Mới" ? "bg-primary/10 text-primary" :
                  req.status === "Đã xác nhận" ? "bg-secondary/10 text-secondary" :
                  "bg-muted text-muted-foreground"
                }`}>{req.status}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Upcoming Events */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-surface-lowest rounded-xl p-6 shadow-ambient">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-serif text-headline-md text-foreground">Sự kiện sắp tới</h3>
            <a href="/admin/du-an" className="text-primary font-body text-sm hover:underline flex items-center gap-1">Xem tất cả <ArrowUpRight size={14} /></a>
          </div>
          <div className="space-y-4">
            {upcomingEvents.map((event, i) => (
              <div key={i} className="bg-surface-low rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-body text-sm font-semibold text-foreground">{event.name}</p>
                  <div className="flex items-center gap-1 text-xs font-body">
                    {event.daysLeft <= 30 && <AlertCircle size={12} className="text-primary" />}
                    <span className={event.daysLeft <= 30 ? "text-primary font-semibold" : "text-muted-foreground"}>
                      {event.daysLeft} ngày
                    </span>
                  </div>
                </div>
                <p className="font-body text-xs text-muted-foreground mb-2"><Clock size={12} className="inline mr-1" />{event.date}</p>
                <div className="w-full bg-surface-high rounded-full h-2">
                  <div className="h-2 rounded-full gradient-primary transition-all" style={{ width: `${event.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
