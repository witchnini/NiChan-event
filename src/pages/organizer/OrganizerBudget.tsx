import { useState } from "react";
import { motion } from "framer-motion";
import { Wallet, TrendingUp, TrendingDown, AlertCircle, Plus, Edit2, Trash2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

type BudgetItem = { id: number; category: string; estimated: number; actual: number; note: string };

const initialBudgets: { project: string; items: BudgetItem[] }[] = [
  {
    project: "Tiệc cưới Minh & Hà",
    items: [
      { id: 1, category: "Venue (GEM Center)", estimated: 80, actual: 80, note: "Đã đặt cọc" },
      { id: 2, category: "Catering (300 khách)", estimated: 60, actual: 45, note: "Đang chốt menu" },
      { id: 3, category: "Décor & Hoa", estimated: 40, actual: 25, note: "Đã duyệt concept" },
      { id: 4, category: "Âm thanh & Ánh sáng", estimated: 25, actual: 0, note: "Chưa đặt" },
      { id: 5, category: "MC & Nghệ sĩ", estimated: 20, actual: 10, note: "Đã ký MC" },
      { id: 6, category: "Chụp ảnh & Quay phim", estimated: 15, actual: 0, note: "Đang chọn" },
      { id: 7, category: "Khác (in ấn, quà...)", estimated: 10, actual: 5, note: "" },
    ],
  },
  {
    project: "Khai trương ABC Corp",
    items: [
      { id: 8, category: "Venue", estimated: 25, actual: 25, note: "Đã xác nhận" },
      { id: 9, category: "Catering", estimated: 15, actual: 0, note: "Chờ duyệt" },
      { id: 10, category: "Décor", estimated: 20, actual: 10, note: "Đang thi công" },
      { id: 11, category: "Âm thanh", estimated: 10, actual: 0, note: "" },
      { id: 12, category: "Khác", estimated: 10, actual: 0, note: "" },
    ],
  },
];

const comparisonData = [
  { category: "Venue", estimated: 105, actual: 105 },
  { category: "Catering", estimated: 75, actual: 45 },
  { category: "Décor", estimated: 60, actual: 35 },
  { category: "Âm thanh", estimated: 35, actual: 0 },
  { category: "Nhân sự", estimated: 20, actual: 10 },
  { category: "Khác", estimated: 20, actual: 5 },
];

const OrganizerBudget = () => {
  const [budgets, setBudgets] = useState(initialBudgets);
  const [activeProject, setActiveProject] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<BudgetItem | null>(null);
  const [form, setForm] = useState({ category: "", estimated: "", actual: "", note: "" });

  const current = budgets[activeProject];
  const totalEstimated = current.items.reduce((s, i) => s + i.estimated, 0);
  const totalActual = current.items.reduce((s, i) => s + i.actual, 0);
  const remaining = totalEstimated - totalActual;
  const percent = Math.round((totalActual / totalEstimated) * 100);

  const openAdd = () => { setEditItem(null); setForm({ category: "", estimated: "", actual: "0", note: "" }); setDialogOpen(true); };
  const openEdit = (item: BudgetItem) => { setEditItem(item); setForm({ category: item.category, estimated: String(item.estimated), actual: String(item.actual), note: item.note }); setDialogOpen(true); };

  const save = () => {
    if (!form.category.trim()) return;
    setBudgets(prev => prev.map((b, idx) => {
      if (idx !== activeProject) return b;
      if (editItem) {
        return { ...b, items: b.items.map(i => i.id === editItem.id ? { ...i, category: form.category, estimated: Number(form.estimated), actual: Number(form.actual), note: form.note } : i) };
      }
      return { ...b, items: [...b.items, { id: Date.now(), category: form.category, estimated: Number(form.estimated), actual: Number(form.actual), note: form.note }] };
    }));
    setDialogOpen(false);
    toast.success(editItem ? "Đã cập nhật mục chi phí" : "Đã thêm mục chi phí");
  };

  const deleteItem = (id: number) => {
    setBudgets(prev => prev.map((b, idx) => idx === activeProject ? { ...b, items: b.items.filter(i => i.id !== id) } : b));
    toast.success("Đã xóa mục chi phí");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="font-serif text-headline-lg text-foreground">Quản lý ngân sách</h1>
        <Button variant="hero" size="sm" onClick={openAdd}><Plus size={16} /> Thêm hạng mục</Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Tổng dự toán", value: `${totalEstimated}tr`, icon: Wallet, color: "text-primary" },
          { label: "Đã chi thực tế", value: `${totalActual}tr`, icon: TrendingDown, color: totalActual > totalEstimated * 0.8 ? "text-destructive" : "text-secondary" },
          { label: "Còn lại", value: `${remaining}tr`, icon: TrendingUp, color: "text-secondary" },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="bg-surface-lowest rounded-xl p-5 shadow-ambient">
            <stat.icon size={20} className={stat.color} />
            <p className="font-serif text-headline-lg text-foreground mt-3">{stat.value}</p>
            <p className="font-body text-sm text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Project Tabs */}
      <div className="flex gap-2 flex-wrap">
        {budgets.map((b, i) => (
          <button key={i} onClick={() => setActiveProject(i)}
            className={`px-4 py-2 rounded-xl font-body text-sm transition-all ${activeProject === i ? "bg-secondary text-secondary-foreground font-semibold" : "bg-surface-lowest text-muted-foreground hover:text-foreground"}`}>
            {b.project}
          </button>
        ))}
      </div>

      {/* Budget Progress */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-surface-lowest rounded-xl p-6 shadow-ambient">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif text-headline-md text-foreground">{current.project}</h3>
          <span className={`font-serif font-bold text-lg ${percent > 80 ? "text-destructive" : "text-secondary"}`}>{percent}% đã chi</span>
        </div>
        <Progress value={percent} className="h-3 mb-6" />

        <div className="overflow-x-auto">
          <table className="w-full text-sm font-body">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 text-muted-foreground font-semibold">Hạng mục</th>
                <th className="text-right py-3 text-muted-foreground font-semibold">Dự toán (tr)</th>
                <th className="text-right py-3 text-muted-foreground font-semibold">Thực tế (tr)</th>
                <th className="text-right py-3 text-muted-foreground font-semibold">Chênh lệch</th>
                <th className="text-left py-3 text-muted-foreground font-semibold pl-4">Ghi chú</th>
                <th className="text-right py-3 text-muted-foreground font-semibold">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {current.items.map(item => {
                const diff = item.actual - item.estimated;
                return (
                  <tr key={item.id} className="border-b border-border last:border-0 hover:bg-surface-low/50">
                    <td className="py-3 font-semibold text-foreground">{item.category}</td>
                    <td className="py-3 text-right text-foreground">{item.estimated}</td>
                    <td className="py-3 text-right text-foreground">
                      {item.actual}
                      {item.actual > item.estimated && <AlertCircle size={12} className="inline ml-1 text-destructive" />}
                    </td>
                    <td className={`py-3 text-right font-semibold ${diff > 0 ? "text-destructive" : diff < 0 ? "text-secondary" : "text-muted-foreground"}`}>
                      {diff > 0 ? `+${diff}` : diff === 0 ? "—" : diff}
                    </td>
                    <td className="py-3 pl-4 text-muted-foreground">{item.note || "—"}</td>
                    <td className="py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => openEdit(item)} className="p-1 text-muted-foreground hover:text-foreground"><Edit2 size={14} /></button>
                        <button onClick={() => deleteItem(item.id)} className="p-1 text-muted-foreground hover:text-destructive"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              <tr className="bg-surface-low font-semibold">
                <td className="py-3 text-foreground">TỔNG CỘNG</td>
                <td className="py-3 text-right text-foreground">{totalEstimated}</td>
                <td className="py-3 text-right text-foreground">{totalActual}</td>
                <td className={`py-3 text-right ${totalActual - totalEstimated > 0 ? "text-destructive" : "text-secondary"}`}>
                  {totalActual - totalEstimated > 0 ? `+${totalActual - totalEstimated}` : totalActual - totalEstimated}
                </td>
                <td colSpan={2} />
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Comparison Chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="bg-surface-lowest rounded-xl p-6 shadow-ambient">
        <h3 className="font-serif text-headline-md text-foreground mb-6">Dự toán vs Thực tế (triệu VNĐ)</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={comparisonData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(38 20% 86%)" />
            <XAxis dataKey="category" tick={{ fontSize: 11, fill: "hsl(50 8% 42%)" }} />
            <YAxis tick={{ fontSize: 12, fill: "hsl(50 8% 42%)" }} />
            <Tooltip contentStyle={{ borderRadius: "12px", border: "none" }} />
            <Bar dataKey="estimated" fill="hsl(38 20% 86%)" radius={[6, 6, 0, 0]} name="Dự toán" />
            <Bar dataKey="actual" fill="hsl(355 63% 42%)" radius={[6, 6, 0, 0]} name="Thực tế" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle className="font-serif">{editItem ? "Sửa hạng mục" : "Thêm hạng mục"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><label className="font-body text-sm mb-1 block">Tên hạng mục</label><Input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="rounded-xl border-none bg-surface-low" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="font-body text-sm mb-1 block">Dự toán (triệu)</label><Input type="number" value={form.estimated} onChange={e => setForm({ ...form, estimated: e.target.value })} className="rounded-xl border-none bg-surface-low" /></div>
              <div><label className="font-body text-sm mb-1 block">Thực tế (triệu)</label><Input type="number" value={form.actual} onChange={e => setForm({ ...form, actual: e.target.value })} className="rounded-xl border-none bg-surface-low" /></div>
            </div>
            <div><label className="font-body text-sm mb-1 block">Ghi chú</label><Input value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} className="rounded-xl border-none bg-surface-low" /></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setDialogOpen(false)}>Hủy</Button><Button variant="hero" onClick={save}>Lưu</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrganizerBudget;
