import { motion } from "framer-motion";
import { DollarSign, TrendingUp, TrendingDown, AlertCircle, ArrowUpRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

const projectFinance = [
  { project: "Tiệc cưới Minh & Hà", budget: 250, spent: 120, revenue: 250, profit: 130, status: "Đang chạy" },
  { project: "Khai trương ABC Corp", budget: 80, spent: 25, revenue: 80, profit: 55, status: "Đang chạy" },
  { project: "Gala cuối năm 2025", budget: 450, spent: 380, revenue: 450, profit: 70, status: "Hoàn thành" },
  { project: "Hội nghị CNTT 2026", budget: 100, spent: 15, revenue: 100, profit: 85, status: "Đang chạy" },
];

const monthlyPL = [
  { month: "T1", revenue: 120, expense: 85 }, { month: "T2", revenue: 180, expense: 130 },
  { month: "T3", revenue: 250, expense: 170 }, { month: "T4", revenue: 200, expense: 150 },
  { month: "T5", revenue: 310, expense: 210 }, { month: "T6", revenue: 280, expense: 200 },
];

const expenses = [
  { category: "Venue", amount: "45,000,000đ", percent: 30 },
  { category: "Catering", amount: "30,000,000đ", percent: 20 },
  { category: "Décor", amount: "22,500,000đ", percent: 15 },
  { category: "Âm thanh & AS", amount: "15,000,000đ", percent: 10 },
  { category: "Nhân sự", amount: "15,000,000đ", percent: 10 },
  { category: "Khác", amount: "22,500,000đ", percent: 15 },
];

const AdminFinance = () => {
  return (
    <div className="space-y-6">
      <h1 className="font-serif text-headline-lg text-foreground">Quản lý tài chính</h1>

      {/* Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Tổng doanh thu", value: "1.34 tỷ", change: "+15%", up: true, icon: DollarSign },
          { label: "Tổng chi phí", value: "945tr", change: "+8%", up: false, icon: TrendingDown },
          { label: "Lợi nhuận ròng", value: "395tr", change: "+28%", up: true, icon: TrendingUp },
          { label: "Công nợ phải thu", value: "275tr", change: "", up: false, icon: AlertCircle },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="bg-surface-lowest rounded-xl p-5 shadow-ambient"
          >
            <stat.icon size={20} className={stat.up ? "text-secondary" : "text-primary"} />
            <p className="font-serif text-headline-lg text-foreground mt-3">{stat.value}</p>
            <div className="flex items-center justify-between mt-1">
              <p className="font-body text-sm text-muted-foreground">{stat.label}</p>
              {stat.change && <span className={`text-xs font-body font-semibold ${stat.up ? "text-secondary" : "text-primary"}`}>{stat.change}</span>}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue vs Expense chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-surface-lowest rounded-xl p-6 shadow-ambient"
        >
          <h3 className="font-serif text-headline-md text-foreground mb-6">Doanh thu vs Chi phí (triệu)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyPL}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(38 20% 86%)" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(50 8% 42%)" }} />
              <YAxis tick={{ fontSize: 12, fill: "hsl(50 8% 42%)" }} />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 8px 40px rgba(0,0,0,0.04)" }} />
              <Line type="monotone" dataKey="revenue" stroke="hsl(113 33% 31%)" strokeWidth={2} dot={{ fill: "hsl(113 33% 31%)" }} name="Doanh thu" />
              <Line type="monotone" dataKey="expense" stroke="hsl(355 63% 42%)" strokeWidth={2} dot={{ fill: "hsl(355 63% 42%)" }} name="Chi phí" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Expense Breakdown */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="bg-surface-lowest rounded-xl p-6 shadow-ambient"
        >
          <h3 className="font-serif text-headline-md text-foreground mb-6">Cơ cấu chi phí</h3>
          <div className="space-y-4">
            {expenses.map((exp) => (
              <div key={exp.category}>
                <div className="flex items-center justify-between mb-1.5 font-body text-sm">
                  <span className="text-foreground">{exp.category}</span>
                  <span className="text-muted-foreground">{exp.amount} ({exp.percent}%)</span>
                </div>
                <div className="w-full h-2 bg-surface-high rounded-full">
                  <div className="h-2 rounded-full gradient-primary transition-all" style={{ width: `${exp.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Project Finance Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="bg-surface-lowest rounded-xl p-6 shadow-ambient"
      >
        <h3 className="font-serif text-headline-md text-foreground mb-6">Tài chính theo dự án (triệu VNĐ)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-body">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 text-muted-foreground font-semibold">Dự án</th>
                <th className="text-right py-3 text-muted-foreground font-semibold">Dự toán</th>
                <th className="text-right py-3 text-muted-foreground font-semibold">Đã chi</th>
                <th className="text-right py-3 text-muted-foreground font-semibold">Doanh thu</th>
                <th className="text-right py-3 text-muted-foreground font-semibold">Lợi nhuận</th>
                <th className="text-right py-3 text-muted-foreground font-semibold">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {projectFinance.map((p) => (
                <tr key={p.project} className="border-b border-border last:border-0 hover:bg-surface-low/50">
                  <td className="py-3 font-semibold text-foreground">{p.project}</td>
                  <td className="py-3 text-right text-foreground">{p.budget}tr</td>
                  <td className="py-3 text-right text-foreground">
                    {p.spent}tr
                    {p.spent / p.budget > 0.8 && <AlertCircle size={12} className="inline ml-1 text-destructive" />}
                  </td>
                  <td className="py-3 text-right text-secondary font-semibold">{p.revenue}tr</td>
                  <td className="py-3 text-right text-secondary font-semibold">{p.profit}tr</td>
                  <td className="py-3 text-right">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${p.status === "Hoàn thành" ? "bg-secondary/10 text-secondary" : "bg-primary/10 text-primary"}`}>{p.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminFinance;
