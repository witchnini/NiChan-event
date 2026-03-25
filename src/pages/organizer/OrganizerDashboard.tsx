import { motion } from "framer-motion";
import { FolderKanban, Users, Building2, Wallet, Clock, CheckCircle, AlertTriangle, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Progress } from "@/components/ui/progress";

const projectProgress = [
  { name: "Tiệc cưới Minh & Hà", progress: 65, status: "Đang chạy", deadline: "15/05/2026", budget: "250tr", spent: "120tr" },
  { name: "Khai trương ABC Corp", progress: 30, status: "Đang chạy", deadline: "20/04/2026", budget: "80tr", spent: "25tr" },
  { name: "Hội nghị CNTT 2026", progress: 10, status: "Mới nhận", deadline: "10/07/2026", budget: "100tr", spent: "15tr" },
];

const tasksByStatus = [
  { name: "Hoàn thành", value: 24, color: "hsl(113 33% 31%)" },
  { name: "Đang làm", value: 12, color: "hsl(355 63% 42%)" },
  { name: "Chờ xử lý", value: 8, color: "hsl(38 35% 70%)" },
  { name: "Quá hạn", value: 3, color: "hsl(355 55% 53%)" },
];

const weeklyWorkload = [
  { day: "T2", tasks: 5 }, { day: "T3", tasks: 8 }, { day: "T4", tasks: 6 },
  { day: "T5", tasks: 9 }, { day: "T6", tasks: 7 }, { day: "T7", tasks: 3 }, { day: "CN", tasks: 1 },
];

const upcomingTasks = [
  { task: "Xác nhận menu với nhà cung cấp", project: "Tiệc cưới Minh & Hà", due: "Hôm nay", urgent: true },
  { task: "Gửi layout sân khấu cho khách", project: "Tiệc cưới Minh & Hà", due: "Ngày mai", urgent: false },
  { task: "Đặt venue cho khai trương", project: "Khai trương ABC Corp", due: "27/03", urgent: false },
  { task: "Họp kickoff dự án CNTT", project: "Hội nghị CNTT 2026", due: "28/03", urgent: false },
  { task: "Duyệt báo giá décor", project: "Tiệc cưới Minh & Hà", due: "29/03", urgent: false },
];

const OrganizerDashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-headline-lg text-foreground">Dashboard Ban tổ chức</h1>
        <p className="font-body text-sm text-muted-foreground mt-1">Tổng quan hoạt động tổ chức sự kiện</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Dự án đang chạy", value: "3", icon: FolderKanban, color: "text-primary" },
          { label: "Nhân sự hoạt động", value: "12", icon: Users, color: "text-secondary" },
          { label: "Nhà cung cấp", value: "8", icon: Building2, color: "text-primary" },
          { label: "Tổng ngân sách", value: "430tr", icon: Wallet, color: "text-secondary" },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="bg-surface-lowest rounded-xl p-5 shadow-ambient">
            <stat.icon size={20} className={stat.color} />
            <p className="font-serif text-headline-lg text-foreground mt-3">{stat.value}</p>
            <p className="font-body text-sm text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project Progress */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-surface-lowest rounded-xl p-6 shadow-ambient">
          <h3 className="font-serif text-headline-md text-foreground mb-6">Tiến độ dự án</h3>
          <div className="space-y-5">
            {projectProgress.map((p) => (
              <div key={p.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-body text-sm font-semibold text-foreground">{p.name}</p>
                    <p className="font-body text-xs text-muted-foreground">Deadline: {p.deadline} • {p.spent}/{p.budget}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-body font-semibold ${p.status === "Đang chạy" ? "bg-primary/10 text-primary" : "bg-secondary/10 text-secondary"}`}>{p.status}</span>
                    <span className="font-serif font-bold text-foreground text-sm">{p.progress}%</span>
                  </div>
                </div>
                <Progress value={p.progress} className="h-2" />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Task Distribution */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="bg-surface-lowest rounded-xl p-6 shadow-ambient">
          <h3 className="font-serif text-headline-md text-foreground mb-4">Phân bổ task</h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart><Pie data={tasksByStatus} dataKey="value" cx="50%" cy="50%" outerRadius={65} innerRadius={40}>{tasksByStatus.map((e, i) => <Cell key={i} fill={e.color} />)}</Pie><Tooltip /></PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-3">
            {tasksByStatus.map(t => (
              <div key={t.name} className="flex items-center gap-2 text-xs font-body">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: t.color }} />
                <span className="text-foreground">{t.name}</span>
                <span className="text-muted-foreground ml-auto">{t.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Workload */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="bg-surface-lowest rounded-xl p-6 shadow-ambient">
          <h3 className="font-serif text-headline-md text-foreground mb-6">Khối lượng công việc tuần này</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyWorkload}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(38 20% 86%)" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: "hsl(50 8% 42%)" }} />
              <YAxis tick={{ fontSize: 12, fill: "hsl(50 8% 42%)" }} />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "none" }} />
              <Bar dataKey="tasks" fill="hsl(113 33% 31%)" radius={[6, 6, 0, 0]} name="Tasks" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Upcoming Tasks */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="bg-surface-lowest rounded-xl p-6 shadow-ambient">
          <h3 className="font-serif text-headline-md text-foreground mb-6">Công việc sắp tới</h3>
          <div className="space-y-3">
            {upcomingTasks.map((t, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-surface-low">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${t.urgent ? "bg-destructive/10" : "bg-surface-high"}`}>
                  {t.urgent ? <AlertTriangle size={14} className="text-destructive" /> : <Clock size={14} className="text-muted-foreground" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-body text-sm font-semibold text-foreground truncate">{t.task}</p>
                  <p className="font-body text-xs text-muted-foreground">{t.project}</p>
                </div>
                <span className={`font-body text-xs font-semibold shrink-0 ${t.urgent ? "text-destructive" : "text-muted-foreground"}`}>{t.due}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrganizerDashboard;
