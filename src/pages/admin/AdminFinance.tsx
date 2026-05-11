import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { DollarSign, TrendingUp, TrendingDown, AlertCircle } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { apiClient } from "@/services/apiClient";
import { toast } from "sonner";

type ProjectFinance = {
  id: string;
  name: string;
  type: string;
  status: string;
  budgetEstimated: number;
  budgetActual: number;
  totalCollected: number;
};

type MonthlyPL = { month: string; revenue: number; expenses: number; profit: number };
type Expense = { id: string; category: string; actualAmount: string | number; estimatedAmount: string | number };

const moneyShort = (value: number) => {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)} ty`;
  if (value >= 1_000_000) return `${Math.round(value / 1_000_000)}tr`;
  return `${Math.round(value).toLocaleString("vi-VN")}d`;
};

const AdminFinance = () => {
  const [projectFinance, setProjectFinance] = useState<ProjectFinance[]>([]);
  const [monthlyPL, setMonthlyPL] = useState<MonthlyPL[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [projects, pl, expenseItems] = await Promise.all([
          apiClient.get<ProjectFinance[]>("/admin/finance/project-summary"),
          apiClient.get<MonthlyPL[]>("/admin/finance/monthly-pl"),
          apiClient.get<Expense[]>("/admin/finance/expenses"),
        ]);
        setProjectFinance(projects);
        setMonthlyPL(pl.map(item => ({ ...item, expenses: item.expenses ?? 0 })));
        setExpenses(expenseItems);
      } catch (error) {
        toast.error("Khong tai duoc du lieu tai chinh");
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  const totals = useMemo(() => {
    const revenue = projectFinance.reduce((sum, p) => sum + Number(p.totalCollected || 0), 0);
    const expense = projectFinance.reduce((sum, p) => sum + Number(p.budgetActual || 0), 0);
    const receivable = projectFinance.reduce((sum, p) => sum + Math.max(Number(p.budgetEstimated || 0) - Number(p.totalCollected || 0), 0), 0);
    return { revenue, expense, profit: revenue - expense, receivable };
  }, [projectFinance]);

  const expenseBreakdown = useMemo(() => {
    const total = expenses.reduce((sum, exp) => sum + Number(exp.actualAmount || 0), 0);
    return expenses.map(exp => {
      const amount = Number(exp.actualAmount || 0);
      return { category: exp.category, amount, percent: total ? Math.round((amount / total) * 100) : 0 };
    });
  }, [expenses]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-headline-lg text-foreground">Quan ly tai chinh</h1>
        <p className="font-body text-sm text-muted-foreground">{loading ? "Dang tai du lieu tu backend..." : "Du lieu lay tu PostgreSQL qua API"}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Tong doanh thu", value: moneyShort(totals.revenue), icon: DollarSign, up: true },
          { label: "Tong chi phi", value: moneyShort(totals.expense), icon: TrendingDown, up: false },
          { label: "Loi nhuan rong", value: moneyShort(totals.profit), icon: TrendingUp, up: totals.profit >= 0 },
          { label: "Cong no phai thu", value: moneyShort(totals.receivable), icon: AlertCircle, up: false },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-surface-lowest rounded-xl p-5 shadow-ambient">
            <stat.icon size={20} className={stat.up ? "text-secondary" : "text-primary"} />
            <p className="font-serif text-headline-lg text-foreground mt-3">{stat.value}</p>
            <p className="font-body text-sm text-muted-foreground mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-surface-lowest rounded-xl p-6 shadow-ambient">
          <h3 className="font-serif text-headline-md text-foreground mb-6">Doanh thu vs Chi phi</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyPL}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(38 20% 86%)" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(50 8% 42%)" }} />
              <YAxis tick={{ fontSize: 12, fill: "hsl(50 8% 42%)" }} />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="hsl(113 33% 31%)" strokeWidth={2} name="Doanh thu" />
              <Line type="monotone" dataKey="expenses" stroke="hsl(355 63% 42%)" strokeWidth={2} name="Chi phi" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-surface-lowest rounded-xl p-6 shadow-ambient">
          <h3 className="font-serif text-headline-md text-foreground mb-6">Co cau chi phi</h3>
          <div className="space-y-4">
            {expenseBreakdown.length === 0 && <p className="font-body text-sm text-muted-foreground">Chua co chi phi committed/paid.</p>}
            {expenseBreakdown.map((exp) => (
              <div key={exp.category}>
                <div className="flex items-center justify-between mb-1.5 font-body text-sm">
                  <span className="text-foreground">{exp.category}</span>
                  <span className="text-muted-foreground">{moneyShort(exp.amount)} ({exp.percent}%)</span>
                </div>
                <div className="w-full h-2 bg-surface-high rounded-full">
                  <div className="h-2 rounded-full gradient-primary transition-all" style={{ width: `${exp.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-surface-lowest rounded-xl p-6 shadow-ambient">
        <h3 className="font-serif text-headline-md text-foreground mb-6">Tai chinh theo du an</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-body">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 text-muted-foreground font-semibold">Du an</th>
                <th className="text-right py-3 text-muted-foreground font-semibold">Du toan</th>
                <th className="text-right py-3 text-muted-foreground font-semibold">Da chi</th>
                <th className="text-right py-3 text-muted-foreground font-semibold">Thu duoc</th>
                <th className="text-right py-3 text-muted-foreground font-semibold">Loi nhuan</th>
                <th className="text-right py-3 text-muted-foreground font-semibold">Trang thai</th>
              </tr>
            </thead>
            <tbody>
              {projectFinance.map((p) => {
                const profit = Number(p.totalCollected || 0) - Number(p.budgetActual || 0);
                return (
                  <tr key={p.id} className="border-b border-border last:border-0 hover:bg-surface-low/50">
                    <td className="py-3 font-semibold text-foreground">{p.name}</td>
                    <td className="py-3 text-right text-foreground">{moneyShort(Number(p.budgetEstimated || 0))}</td>
                    <td className="py-3 text-right text-foreground">{moneyShort(Number(p.budgetActual || 0))}</td>
                    <td className="py-3 text-right text-secondary font-semibold">{moneyShort(Number(p.totalCollected || 0))}</td>
                    <td className={`py-3 text-right font-semibold ${profit >= 0 ? "text-secondary" : "text-destructive"}`}>{moneyShort(profit)}</td>
                    <td className="py-3 text-right"><span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">{p.status}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminFinance;
