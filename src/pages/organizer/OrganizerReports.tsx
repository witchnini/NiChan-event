import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Download, CheckCircle, Calendar, Wallet } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiClient } from "@/services/apiClient";

type ProjectProgressItem = {
  id: string;
  name: string;
  status: string;
  eventDate?: string | null;
  progressPercent: number;
  taskTotal: number;
  taskDone: number;
  taskPercent: number;
};

type TaskCompletionItem = {
  status: string;
  _count: { status: number };
};

type BudgetOverviewItem = {
  id: string;
  name: string;
  estimated: number;
  actual: number;
  variance: number;
};

const formatDate = (value?: string | null) =>
  value ? new Date(value).toLocaleDateString("vi-VN") : "Chưa cập nhật";

const formatMoney = (value: number) => `${Math.round(value / 1_000_000)}tr`;

const OrganizerReports = () => {
  const [projects, setProjects] = useState<ProjectProgressItem[]>([]);
  const [taskCompletion, setTaskCompletion] = useState<TaskCompletionItem[]>([]);
  const [budgets, setBudgets] = useState<BudgetOverviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const [projectData, completionData, budgetData] = await Promise.all([
          apiClient.get<ProjectProgressItem[]>("/organizer/reports/project-progress"),
          apiClient.get<TaskCompletionItem[]>("/organizer/reports/task-completion"),
          apiClient.get<BudgetOverviewItem[]>("/organizer/reports/budget-overview"),
        ]);

        if (cancelled) return;
        setProjects(projectData);
        setTaskCompletion(completionData);
        setBudgets(budgetData);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Không thể tải báo cáo");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const taskChartData = useMemo(
    () => taskCompletion.map((item) => ({ status: item.status, count: item._count.status })),
    [taskCompletion],
  );

  const handleExportCSV = () => {
    const csv = "Du an,Tien do,Task hoan thanh,Tong task\n" + projects.map((item) => `${item.name},${item.progressPercent},${item.taskDone},${item.taskTotal}`).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `bao-cao-task-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Đã xuất CSV thành công");
  };

  if (loading) return <div className="font-body text-muted-foreground">Đang tải báo cáo...</div>;
  if (error) return <div className="font-body text-destructive">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-headline-lg text-foreground">Báo cáo & Tổng kết</h1>
          <p className="font-body text-sm text-muted-foreground">Dữ liệu báo cáo lấy trực tiếp từ backend</p>
        </div>
        <Button variant="outline" onClick={handleExportCSV}><Download size={16} /> Xuất CSV</Button>
      </div>

      <div>
        <h2 className="font-serif text-headline-md text-foreground mb-4">Tiến độ dự án hiện tại</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {projects.map((project) => (
            <motion.div key={project.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="bg-surface-lowest rounded-xl p-6 shadow-ambient">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-serif text-headline-md text-foreground">{project.name}</h3>
                  <p className="font-body text-sm text-muted-foreground mt-1">{project.status} • {formatDate(project.eventDate)}</p>
                </div>
                <span className="font-serif font-bold text-foreground">{project.progressPercent}%</span>
              </div>
              <div className="grid grid-cols-3 gap-3 mt-5">
                <div className="bg-surface-low rounded-xl p-3 text-center">
                  <p className="font-body text-xs text-muted-foreground">Task hoàn thành</p>
                  <p className="font-serif font-bold text-foreground">{project.taskDone}</p>
                </div>
                <div className="bg-surface-low rounded-xl p-3 text-center">
                  <p className="font-body text-xs text-muted-foreground">Tổng task</p>
                  <p className="font-serif font-bold text-foreground">{project.taskTotal}</p>
                </div>
                <div className="bg-surface-low rounded-xl p-3 text-center">
                  <p className="font-body text-xs text-muted-foreground">Tỉ lệ xong</p>
                  <p className="font-serif font-bold text-secondary">{project.taskPercent}%</p>
                </div>
              </div>
            </motion.div>
          ))}
          {projects.length === 0 && <p className="font-body text-sm text-muted-foreground">Chưa có dự án để báo cáo.</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-surface-lowest rounded-xl p-6 shadow-ambient">
          <h3 className="font-serif text-headline-md text-foreground mb-6">Phân bố trạng thái task</h3>
          {taskChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={taskChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(38 20% 86%)" />
                <XAxis dataKey="status" tick={{ fontSize: 12, fill: "hsl(50 8% 42%)" }} />
                <YAxis tick={{ fontSize: 12, fill: "hsl(50 8% 42%)" }} />
                <Tooltip contentStyle={{ borderRadius: "12px", border: "none" }} />
                <Bar dataKey="count" fill="hsl(113 33% 31%)" radius={[6, 6, 0, 0]} name="Task" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="font-body text-sm text-muted-foreground">Chưa có dữ liệu task completion.</p>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-surface-lowest rounded-xl p-6 shadow-ambient">
          <h3 className="font-serif text-headline-md text-foreground mb-6">Tổng quan ngân sách</h3>
          <div className="space-y-4">
            {budgets.map((budget) => (
              <div key={budget.id} className="flex items-center justify-between bg-surface-low rounded-xl p-4">
                <div>
                  <p className="font-body text-sm font-semibold text-foreground">{budget.name}</p>
                  <p className="font-body text-xs text-muted-foreground flex items-center gap-1 mt-1"><Calendar size={12} /> estimated vs actual</p>
                </div>
                <div className="text-right">
                  <p className="font-body text-xs text-muted-foreground flex items-center justify-end gap-1"><Wallet size={12} /> {formatMoney(budget.estimated)} / {formatMoney(budget.actual)}</p>
                  <p className={`font-serif font-bold ${budget.variance >= 0 ? "text-secondary" : "text-destructive"}`}>{formatMoney(budget.variance)}</p>
                </div>
              </div>
            ))}
            {budgets.length === 0 && <p className="font-body text-sm text-muted-foreground">Chưa có dữ liệu ngân sách.</p>}
          </div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-surface-lowest rounded-xl p-6 shadow-ambient">
        <h3 className="font-serif text-headline-md text-foreground mb-4">Ghi chú</h3>
        <div className="space-y-2 text-sm font-body text-muted-foreground">
          <p className="flex items-center gap-2"><CheckCircle size={14} className="text-secondary" /> Phần team KPI chi tiết chưa có endpoint backend riêng nên đã bỏ dữ liệu giả.</p>
          <p className="flex items-center gap-2"><CheckCircle size={14} className="text-secondary" /> Báo cáo hiện chỉ hiển thị những gì backend đang trả thật.</p>
        </div>
      </motion.div>
    </div>
  );
};

export default OrganizerReports;
