import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Wallet, TrendingUp, TrendingDown, AlertCircle, Plus, Edit2, Trash2 } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { apiClient } from "@/services/apiClient";
import { toast } from "sonner";

type Project = { id: string; name: string };
type BudgetItem = { id: string; category: string; estimatedAmount: string | number; actualAmount: string | number; note?: string | null; status: string };
type ProjectBudget = { project: Project; budget: { id: string; name: string }; items: BudgetItem[]; estimatedTotal: number; actualTotal: number };

const emptyForm = { category: "", estimated: "", actual: "", note: "" };
const toMillion = (value: string | number) => Number(value || 0) / 1_000_000;
const fromMillion = (value: string) => Number(value || 0) * 1_000_000;

const OrganizerBudget = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProjectId, setActiveProjectId] = useState("");
  const [current, setCurrent] = useState<ProjectBudget | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<BudgetItem | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await apiClient.get<Project[]>("/organizer/projects");
        setProjects(data);
        setActiveProjectId(data[0]?.id ?? "");
      } catch (error) {
        toast.error("Khong tai duoc danh sach du an");
      }
    };
    void loadProjects();
  }, []);

  const loadBudget = async (projectId: string) => {
    if (!projectId) {
      setCurrent(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await apiClient.get<ProjectBudget>(`/organizer/budgets/${projectId}`);
      setCurrent(data);
    } catch (error) {
      toast.error("Khong tai duoc ngan sach du an");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadBudget(activeProjectId);
  }, [activeProjectId]);

  const totalEstimated = current?.estimatedTotal ?? 0;
  const totalActual = current?.actualTotal ?? 0;
  const remaining = totalEstimated - totalActual;
  const percent = totalEstimated ? Math.round((totalActual / totalEstimated) * 100) : 0;

  const comparisonData = useMemo(() => (current?.items ?? []).map(item => ({
    category: item.category,
    estimated: toMillion(item.estimatedAmount),
    actual: toMillion(item.actualAmount),
  })), [current]);

  const openAdd = () => { setEditItem(null); setForm({ category: "", estimated: "", actual: "0", note: "" }); setDialogOpen(true); };
  const openEdit = (item: BudgetItem) => {
    setEditItem(item);
    setForm({
      category: item.category,
      estimated: String(toMillion(item.estimatedAmount)),
      actual: String(toMillion(item.actualAmount)),
      note: item.note ?? "",
    });
    setDialogOpen(true);
  };

  const save = async () => {
    if (!current || !form.category.trim()) return;
    const payload = {
      projectBudgetId: current.budget.id,
      category: form.category,
      estimatedAmount: fromMillion(form.estimated),
      actualAmount: fromMillion(form.actual),
      status: "planned",
      note: form.note || undefined,
    };
    try {
      if (editItem) {
        await apiClient.put(`/organizer/budget-items/${editItem.id}`, payload);
      } else {
        await apiClient.post("/organizer/budget-items", payload);
      }
      toast.success(editItem ? "Da cap nhat muc chi phi" : "Da them muc chi phi");
      setDialogOpen(false);
      await loadBudget(activeProjectId);
    } catch (error) {
      toast.error("Luu muc chi phi that bai");
    }
  };

  const deleteItem = async (id: string) => {
    try {
      await apiClient.del(`/organizer/budget-items/${id}`);
      toast.success("Da xoa muc chi phi");
      await loadBudget(activeProjectId);
    } catch (error) {
      toast.error("Xoa muc chi phi that bai");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-headline-lg text-foreground">Quan ly ngan sach</h1>
          <p className="font-body text-sm text-muted-foreground">{loading ? "Dang tai du lieu..." : "Du lieu lay tu API /organizer/budgets"}</p>
        </div>
        <Button variant="hero" size="sm" onClick={openAdd} disabled={!current}><Plus size={16} /> Them hang muc</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Tong du toan", value: `${Math.round(toMillion(totalEstimated))}tr`, icon: Wallet, color: "text-primary" },
          { label: "Da chi thuc te", value: `${Math.round(toMillion(totalActual))}tr`, icon: TrendingDown, color: totalActual > totalEstimated * 0.8 ? "text-destructive" : "text-secondary" },
          { label: "Con lai", value: `${Math.round(toMillion(remaining))}tr`, icon: TrendingUp, color: "text-secondary" },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-surface-lowest rounded-xl p-5 shadow-ambient">
            <stat.icon size={20} className={stat.color} />
            <p className="font-serif text-headline-lg text-foreground mt-3">{stat.value}</p>
            <p className="font-body text-sm text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="flex gap-2 flex-wrap">
        {projects.map((project) => (
          <button key={project.id} onClick={() => setActiveProjectId(project.id)}
            className={`px-4 py-2 rounded-xl font-body text-sm transition-all ${activeProjectId === project.id ? "bg-secondary text-secondary-foreground font-semibold" : "bg-surface-lowest text-muted-foreground hover:text-foreground"}`}>
            {project.name}
          </button>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-surface-lowest rounded-xl p-6 shadow-ambient">
        {!current ? (
          <p className="font-body text-sm text-muted-foreground">Chua co du an de hien thi ngan sach.</p>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-headline-md text-foreground">{current.project.name}</h3>
              <span className={`font-serif font-bold text-lg ${percent > 80 ? "text-destructive" : "text-secondary"}`}>{percent}% da chi</span>
            </div>
            <Progress value={percent} className="h-3 mb-6" />

            <div className="overflow-x-auto">
              <table className="w-full text-sm font-body">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 text-muted-foreground font-semibold">Hang muc</th>
                    <th className="text-right py-3 text-muted-foreground font-semibold">Du toan (tr)</th>
                    <th className="text-right py-3 text-muted-foreground font-semibold">Thuc te (tr)</th>
                    <th className="text-right py-3 text-muted-foreground font-semibold">Chenh lech</th>
                    <th className="text-left py-3 text-muted-foreground font-semibold pl-4">Ghi chu</th>
                    <th className="text-right py-3 text-muted-foreground font-semibold">Thao tac</th>
                  </tr>
                </thead>
                <tbody>
                  {current.items.map(item => {
                    const estimated = toMillion(item.estimatedAmount);
                    const actual = toMillion(item.actualAmount);
                    const diff = actual - estimated;
                    return (
                      <tr key={item.id} className="border-b border-border last:border-0 hover:bg-surface-low/50">
                        <td className="py-3 font-semibold text-foreground">{item.category}</td>
                        <td className="py-3 text-right text-foreground">{Math.round(estimated)}</td>
                        <td className="py-3 text-right text-foreground">{Math.round(actual)}{actual > estimated && <AlertCircle size={12} className="inline ml-1 text-destructive" />}</td>
                        <td className={`py-3 text-right font-semibold ${diff > 0 ? "text-destructive" : diff < 0 ? "text-secondary" : "text-muted-foreground"}`}>{diff > 0 ? `+${Math.round(diff)}` : diff === 0 ? "-" : Math.round(diff)}</td>
                        <td className="py-3 pl-4 text-muted-foreground">{item.note || "-"}</td>
                        <td className="py-3 text-right">
                          <div className="flex justify-end gap-1">
                            <button onClick={() => openEdit(item)} className="p-1 text-muted-foreground hover:text-foreground"><Edit2 size={14} /></button>
                            <button onClick={() => deleteItem(item.id)} className="p-1 text-muted-foreground hover:text-destructive"><Trash2 size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-surface-lowest rounded-xl p-6 shadow-ambient">
        <h3 className="font-serif text-headline-md text-foreground mb-6">Du toan vs Thuc te (trieu VND)</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={comparisonData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(38 20% 86%)" />
            <XAxis dataKey="category" tick={{ fontSize: 11, fill: "hsl(50 8% 42%)" }} />
            <YAxis tick={{ fontSize: 12, fill: "hsl(50 8% 42%)" }} />
            <Tooltip />
            <Bar dataKey="estimated" fill="hsl(38 20% 86%)" radius={[6, 6, 0, 0]} name="Du toan" />
            <Bar dataKey="actual" fill="hsl(355 63% 42%)" radius={[6, 6, 0, 0]} name="Thuc te" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle className="font-serif">{editItem ? "Sua hang muc" : "Them hang muc"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><label className="font-body text-sm mb-1 block">Ten hang muc</label><Input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="rounded-xl border-none bg-surface-low" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="font-body text-sm mb-1 block">Du toan (trieu)</label><Input type="number" value={form.estimated} onChange={e => setForm({ ...form, estimated: e.target.value })} className="rounded-xl border-none bg-surface-low" /></div>
              <div><label className="font-body text-sm mb-1 block">Thuc te (trieu)</label><Input type="number" value={form.actual} onChange={e => setForm({ ...form, actual: e.target.value })} className="rounded-xl border-none bg-surface-low" /></div>
            </div>
            <div><label className="font-body text-sm mb-1 block">Ghi chu</label><Input value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} className="rounded-xl border-none bg-surface-low" /></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setDialogOpen(false)}>Huy</Button><Button variant="hero" onClick={save}>Luu</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrganizerBudget;
