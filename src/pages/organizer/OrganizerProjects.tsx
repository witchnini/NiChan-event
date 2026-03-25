import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, GripVertical, Edit2, Trash2, Calendar, Users, X, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

type Task = { id: number; title: string; assignee: string; due: string; priority: "high" | "medium" | "low" };
type Column = { id: string; title: string; color: string; tasks: Task[] };

const initialColumns: Column[] = [
  { id: "todo", title: "Chờ xử lý", color: "bg-muted", tasks: [
    { id: 1, title: "Liên hệ venue backup", assignee: "Trần Đức", due: "28/03", priority: "medium" },
    { id: 2, title: "Lên menu cho tiệc cưới", assignee: "Phạm Hoa", due: "30/03", priority: "high" },
    { id: 3, title: "Thiết kế thiệp mời", assignee: "Lê Mai", due: "02/04", priority: "low" },
  ]},
  { id: "progress", title: "Đang thực hiện", color: "bg-primary", tasks: [
    { id: 4, title: "Xác nhận GEM Center", assignee: "Nguyễn Lan", due: "25/03", priority: "high" },
    { id: 5, title: "Đặt hoa trang trí", assignee: "Phạm Hoa", due: "27/03", priority: "medium" },
  ]},
  { id: "review", title: "Chờ duyệt", color: "bg-accent", tasks: [
    { id: 6, title: "Layout sân khấu v2", assignee: "Trần Đức", due: "26/03", priority: "high" },
  ]},
  { id: "done", title: "Hoàn thành", color: "bg-secondary", tasks: [
    { id: 7, title: "Ký hợp đồng khách hàng", assignee: "Nguyễn Lan", due: "19/03", priority: "high" },
    { id: 8, title: "Thu đặt cọc 30%", assignee: "Nguyễn Lan", due: "19/03", priority: "high" },
  ]},
];

// Gantt-like timeline data
const ganttData = [
  { task: "Lên kế hoạch", start: 0, duration: 15, project: "Tiệc cưới Minh & Hà", color: "bg-primary" },
  { task: "Đặt venue & NCC", start: 10, duration: 20, project: "Tiệc cưới Minh & Hà", color: "bg-primary/70" },
  { task: "Thiết kế & Décor", start: 20, duration: 25, project: "Tiệc cưới Minh & Hà", color: "bg-secondary" },
  { task: "Tổng duyệt", start: 42, duration: 5, project: "Tiệc cưới Minh & Hà", color: "bg-accent" },
  { task: "Ngày sự kiện", start: 48, duration: 2, project: "Tiệc cưới Minh & Hà", color: "bg-destructive" },
  { task: "Lên kế hoạch", start: 0, duration: 10, project: "Khai trương ABC", color: "bg-secondary" },
  { task: "Setup & Thi công", start: 8, duration: 15, project: "Khai trương ABC", color: "bg-secondary/70" },
  { task: "Event day", start: 22, duration: 2, project: "Khai trương ABC", color: "bg-destructive" },
];

const OrganizerProjects = () => {
  const [columns, setColumns] = useState(initialColumns);
  const [view, setView] = useState<"kanban" | "gantt">("kanban");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [targetCol, setTargetCol] = useState("todo");
  const [form, setForm] = useState({ title: "", assignee: "", due: "", priority: "medium" as Task["priority"] });

  const openAdd = (colId: string) => { setTargetCol(colId); setEditTask(null); setForm({ title: "", assignee: "", due: "", priority: "medium" }); setDialogOpen(true); };
  const openEdit = (task: Task, colId: string) => { setTargetCol(colId); setEditTask(task); setForm({ title: task.title, assignee: task.assignee, due: task.due, priority: task.priority }); setDialogOpen(true); };

  const saveTask = () => {
    if (!form.title.trim()) return;
    setColumns(prev => prev.map(col => {
      if (col.id !== targetCol) return col;
      if (editTask) return { ...col, tasks: col.tasks.map(t => t.id === editTask.id ? { ...t, ...form } : t) };
      return { ...col, tasks: [...col.tasks, { id: Date.now(), ...form }] };
    }));
    setDialogOpen(false);
    toast.success(editTask ? "Đã cập nhật task" : "Đã thêm task mới");
  };

  const deleteTask = (colId: string, taskId: number) => {
    setColumns(prev => prev.map(col => col.id === colId ? { ...col, tasks: col.tasks.filter(t => t.id !== taskId) } : col));
    toast.success("Đã xóa task");
  };

  const moveTask = (fromCol: string, taskId: number, toCol: string) => {
    let movedTask: Task | undefined;
    setColumns(prev => {
      const updated = prev.map(col => {
        if (col.id === fromCol) {
          movedTask = col.tasks.find(t => t.id === taskId);
          return { ...col, tasks: col.tasks.filter(t => t.id !== taskId) };
        }
        return col;
      });
      if (!movedTask) return prev;
      return updated.map(col => col.id === toCol ? { ...col, tasks: [...col.tasks, movedTask!] } : col);
    });
    toast.success("Đã chuyển task");
  };

  const priorityColor = (p: string) => p === "high" ? "bg-destructive/10 text-destructive" : p === "medium" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-headline-lg text-foreground">Quản lý dự án</h1>
          <p className="font-body text-sm text-muted-foreground">Kanban board & Gantt chart</p>
        </div>
        <div className="flex gap-2">
          <div className="flex p-1 rounded-xl bg-surface-low">
            <button onClick={() => setView("kanban")} className={`px-4 py-2 rounded-lg font-body text-sm transition-all ${view === "kanban" ? "bg-background shadow-ambient text-foreground font-semibold" : "text-muted-foreground"}`}>Kanban</button>
            <button onClick={() => setView("gantt")} className={`px-4 py-2 rounded-lg font-body text-sm transition-all ${view === "gantt" ? "bg-background shadow-ambient text-foreground font-semibold" : "text-muted-foreground"}`}>Gantt</button>
          </div>
        </div>
      </div>

      {view === "kanban" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {columns.map(col => (
            <div key={col.id} className="bg-surface-low rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${col.color}`} />
                  <h3 className="font-serif font-semibold text-foreground text-sm">{col.title}</h3>
                  <span className="font-body text-xs text-muted-foreground bg-surface-high rounded-full px-2 py-0.5">{col.tasks.length}</span>
                </div>
                <button onClick={() => openAdd(col.id)} className="text-muted-foreground hover:text-foreground"><Plus size={16} /></button>
              </div>
              <div className="space-y-3 min-h-[100px]">
                <AnimatePresence>
                  {col.tasks.map(task => (
                    <motion.div key={task.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                      className="bg-surface-lowest rounded-xl p-4 shadow-ambient group cursor-pointer hover:shadow-ambient-lg transition-shadow">
                      <div className="flex items-start justify-between gap-2">
                        <GripVertical size={14} className="text-muted-foreground mt-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="flex-1 min-w-0">
                          <p className="font-body text-sm font-semibold text-foreground">{task.title}</p>
                          <div className="flex items-center gap-2 mt-2 flex-wrap">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-body font-semibold ${priorityColor(task.priority)}`}>{task.priority === "high" ? "Cao" : task.priority === "medium" ? "TB" : "Thấp"}</span>
                            <span className="font-body text-xs text-muted-foreground flex items-center gap-1"><Calendar size={10} />{task.due}</span>
                          </div>
                          <div className="flex items-center gap-1 mt-2">
                            <div className="w-5 h-5 rounded-full bg-secondary/20 flex items-center justify-center"><Users size={10} className="text-secondary" /></div>
                            <span className="font-body text-xs text-muted-foreground">{task.assignee}</span>
                          </div>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openEdit(task, col.id)} className="text-muted-foreground hover:text-foreground"><Edit2 size={12} /></button>
                          <button onClick={() => deleteTask(col.id, task.id)} className="text-muted-foreground hover:text-destructive"><Trash2 size={12} /></button>
                        </div>
                      </div>
                      {/* Move buttons */}
                      <div className="flex gap-1 mt-3 pt-2 border-t border-border opacity-0 group-hover:opacity-100 transition-opacity">
                        {columns.filter(c => c.id !== col.id).map(c => (
                          <button key={c.id} onClick={() => moveTask(col.id, task.id, c.id)}
                            className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-body text-muted-foreground hover:bg-surface-low transition-colors">
                            <ChevronRight size={10} />{c.title}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      )}

      {view === "gantt" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-surface-lowest rounded-xl p-6 shadow-ambient overflow-x-auto">
          <h3 className="font-serif text-headline-md text-foreground mb-6">Gantt Chart - Timeline dự án</h3>
          <div className="min-w-[700px]">
            {/* Header */}
            <div className="flex items-center border-b border-border pb-2 mb-4">
              <div className="w-48 shrink-0 font-body text-xs text-muted-foreground font-semibold">Task</div>
              <div className="flex-1 flex">
                {Array.from({ length: 10 }, (_, i) => (
                  <div key={i} className="flex-1 text-center font-body text-xs text-muted-foreground">Tuần {i + 1}</div>
                ))}
              </div>
            </div>
            {/* Rows */}
            {ganttData.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                className="flex items-center h-10 group hover:bg-surface-low/50 rounded-lg">
                <div className="w-48 shrink-0 pr-4">
                  <p className="font-body text-xs font-semibold text-foreground truncate">{item.task}</p>
                  <p className="font-body text-[10px] text-muted-foreground truncate">{item.project}</p>
                </div>
                <div className="flex-1 relative h-6">
                  <div className={`absolute top-1 h-4 rounded-full ${item.color} opacity-80 group-hover:opacity-100 transition-opacity`}
                    style={{ left: `${(item.start / 50) * 100}%`, width: `${(item.duration / 50) * 100}%` }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle className="font-serif">{editTask ? "Sửa task" : "Thêm task mới"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><label className="font-body text-sm text-foreground mb-1 block">Tên task</label><Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Nhập tên task..." className="rounded-xl border-none bg-surface-low" /></div>
            <div><label className="font-body text-sm text-foreground mb-1 block">Người thực hiện</label><Input value={form.assignee} onChange={e => setForm({ ...form, assignee: e.target.value })} placeholder="Tên nhân viên..." className="rounded-xl border-none bg-surface-low" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="font-body text-sm text-foreground mb-1 block">Deadline</label><Input value={form.due} onChange={e => setForm({ ...form, due: e.target.value })} placeholder="dd/mm" className="rounded-xl border-none bg-surface-low" /></div>
              <div>
                <label className="font-body text-sm text-foreground mb-1 block">Ưu tiên</label>
                <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value as Task["priority"] })} className="w-full rounded-xl bg-surface-low p-2.5 font-body text-sm text-foreground border-none">
                  <option value="high">Cao</option><option value="medium">Trung bình</option><option value="low">Thấp</option>
                </select>
              </div>
            </div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setDialogOpen(false)}>Hủy</Button><Button variant="hero" onClick={saveTask}>{editTask ? "Cập nhật" : "Thêm"}</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrganizerProjects;
