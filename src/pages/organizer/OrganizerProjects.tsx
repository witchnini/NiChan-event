import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, Calendar, Users, ChevronRight, PlayCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { apiClient } from "@/services/apiClient";

type Project = {
  id: string;
  name: string;
  type: string;
  status: string;
  eventDate?: string | null;
  guestCount?: number | null;
  progressPercent: number;
  customerUser: { displayName: string };
};

type KanbanTask = {
  id: string;
  title: string;
  description?: string | null;
  status: string;
  priority: "low" | "medium" | "high";
  dueAt?: string | null;
  assignee?: { displayName: string } | null;
};

type KanbanColumn = {
  id: string;
  title: string;
  tasks: KanbanTask[];
};

type KanbanResponse = {
  project: { id: string; name: string; status: string; progressPercent: number };
  columns: KanbanColumn[];
};

const emptyForm = { title: "", description: "", assigneeUserId: "", dueAt: "", priority: "medium" as const };

const OrganizerProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [kanban, setKanban] = useState<KanbanResponse | null>(null);
  const [view, setView] = useState<"kanban" | "gantt">("kanban");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<KanbanTask | null>(null);
  const [targetStatus, setTargetStatus] = useState("todo");
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProjects = async () => {
    const data = await apiClient.get<Project[]>("/organizer/projects");
    setProjects(data);
    if (!selectedProjectId && data.length > 0) setSelectedProjectId(data[0].id);
    return data;
  };

  const loadKanban = async (projectId: string) => {
    const data = await apiClient.get<KanbanResponse>(`/organizer/projects/${projectId}/kanban`);
    setKanban(data);
  };

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const projectData = await apiClient.get<Project[]>("/organizer/projects");
        if (cancelled) return;
        setProjects(projectData);
        if (projectData.length > 0) {
          const firstId = projectData[0].id;
          setSelectedProjectId(firstId);
          const kanbanData = await apiClient.get<KanbanResponse>(`/organizer/projects/${firstId}/kanban`);
          if (!cancelled) setKanban(kanbanData);
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Không thể tải dự án");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!selectedProjectId) return;
    let cancelled = false;
    const load = async () => {
      try {
        const data = await apiClient.get<KanbanResponse>(`/organizer/projects/${selectedProjectId}/kanban`);
        if (!cancelled) setKanban(data);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Không thể tải kanban");
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [selectedProjectId]);

  const allColumns = useMemo(() => kanban?.columns || [], [kanban]);

  const openAdd = (columnId: string) => {
    setTargetStatus(columnId);
    setEditingTask(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (task: KanbanTask, columnId: string) => {
    setTargetStatus(columnId);
    setEditingTask(task);
    setForm({
      title: task.title,
      description: task.description || "",
      assigneeUserId: "",
      dueAt: task.dueAt ? new Date(task.dueAt).toISOString().slice(0, 10) : "",
      priority: task.priority,
    });
    setDialogOpen(true);
  };

  const refreshCurrentProject = async () => {
    if (!selectedProjectId) return;
    await loadKanban(selectedProjectId);
  };

  const saveTask = async () => {
    try {
      if (!selectedProjectId || !form.title.trim()) return;

      if (editingTask) {
        await apiClient.put(`/organizer/tasks/${editingTask.id}`, {
          title: form.title,
          description: form.description || undefined,
          dueAt: form.dueAt || undefined,
          priority: form.priority,
        });
        toast.success("Đã cập nhật task");
      } else {
        await apiClient.post("/organizer/tasks", {
          eventId: selectedProjectId,
          title: form.title,
          description: form.description || undefined,
          status: targetStatus,
          priority: form.priority,
          dueAt: form.dueAt || undefined,
          sortOrder: 0,
        });
        toast.success("Đã thêm task mới");
      }

      setDialogOpen(false);
      await refreshCurrentProject();
      await loadProjects();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Không thể lưu task");
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      await apiClient.del(`/organizer/tasks/${taskId}`);
      toast.success("Đã xóa task");
      await refreshCurrentProject();
      await loadProjects();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Không thể xóa task");
    }
  };

  const moveTask = async (taskId: string, toCol: string) => {
    try {
      await apiClient.patch(`/organizer/tasks/${taskId}/status`, { status: toCol });
      toast.success("Đã chuyển task");
      await refreshCurrentProject();
      await loadProjects();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Không thể chuyển task");
    }
  };

  const changeProjectStatus = async (status: "in_progress" | "completed") => {
    if (!selectedProjectId) return;
    try {
      await apiClient.patch(`/organizer/projects/${selectedProjectId}/status`, { status });
      toast.success(status === "in_progress" ? "Da duyet trien khai su kien" : "Da danh dau su kien hoan thanh");
      await loadProjects();
      await loadKanban(selectedProjectId);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Khong the cap nhat trang thai du an");
    }
  };

  const priorityColor = (priority: string) =>
    priority === "high" ? "bg-destructive/10 text-destructive" : priority === "medium" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground";

  if (loading) return <div className="font-body text-muted-foreground">Đang tải dự án...</div>;
  if (error) return <div className="font-body text-destructive">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-headline-lg text-foreground">Quản lý dự án</h1>
          <p className="font-body text-sm text-muted-foreground">Kanban board dùng API thật</p>
        </div>
        <div className="flex gap-2">
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="rounded-xl bg-surface-low px-4 py-2 text-sm font-body text-foreground"
          >
            {projects.map((project) => (
              <option key={project.id} value={project.id}>{project.name}</option>
            ))}
          </select>
          <div className="flex p-1 rounded-xl bg-surface-low">
            <button onClick={() => setView("kanban")} className={`px-4 py-2 rounded-lg font-body text-sm transition-all ${view === "kanban" ? "bg-background shadow-ambient text-foreground font-semibold" : "text-muted-foreground"}`}>Kanban</button>
            <button onClick={() => setView("gantt")} className={`px-4 py-2 rounded-lg font-body text-sm transition-all ${view === "gantt" ? "bg-background shadow-ambient text-foreground font-semibold" : "text-muted-foreground"}`}>Gantt</button>
          </div>
        </div>
      </div>

      {kanban?.project && (
        <div className="bg-surface-lowest rounded-xl p-5 shadow-ambient">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h2 className="font-serif text-headline-md text-foreground">{kanban.project.name}</h2>
          <p className="font-body text-sm text-muted-foreground mt-1">Trạng thái: {kanban.project.status} • Tiến độ: {kanban.project.progressPercent}%</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              {["planning", "quoted", "contracted"].includes(kanban.project.status) && (
                <Button variant="hero" size="sm" onClick={() => changeProjectStatus("in_progress")}>
                  <PlayCircle size={14} /> Duyet trien khai
                </Button>
              )}
              {kanban.project.status === "in_progress" && (
                <Button variant="outline" size="sm" onClick={() => changeProjectStatus("completed")}>
                  <CheckCircle size={14} /> Hoan thanh
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {view === "kanban" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {allColumns.map((column) => (
            <div key={column.id} className="bg-surface-low rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="font-serif font-semibold text-foreground text-sm">{column.title}</h3>
                  <span className="font-body text-xs text-muted-foreground bg-surface-high rounded-full px-2 py-0.5">{column.tasks.length}</span>
                </div>
                <button onClick={() => openAdd(column.id)} className="text-muted-foreground hover:text-foreground"><Plus size={16} /></button>
              </div>
              <div className="space-y-3 min-h-[100px]">
                <AnimatePresence>
                  {column.tasks.map((task) => (
                    <motion.div key={task.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                      className="bg-surface-lowest rounded-xl p-4 shadow-ambient group hover:shadow-ambient-lg transition-shadow">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-body text-sm font-semibold text-foreground">{task.title}</p>
                          <div className="flex items-center gap-2 mt-2 flex-wrap">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-body font-semibold ${priorityColor(task.priority)}`}>{task.priority}</span>
                            <span className="font-body text-xs text-muted-foreground flex items-center gap-1"><Calendar size={10} />{task.dueAt ? new Date(task.dueAt).toLocaleDateString("vi-VN") : "Chưa có hạn"}</span>
                          </div>
                          <div className="flex items-center gap-1 mt-2">
                            <div className="w-5 h-5 rounded-full bg-secondary/20 flex items-center justify-center"><Users size={10} className="text-secondary" /></div>
                            <span className="font-body text-xs text-muted-foreground">{task.assignee?.displayName || "Chưa phân công"}</span>
                          </div>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openEdit(task, column.id)} className="text-muted-foreground hover:text-foreground"><Edit2 size={12} /></button>
                          <button onClick={() => deleteTask(task.id)} className="text-muted-foreground hover:text-destructive"><Trash2 size={12} /></button>
                        </div>
                      </div>
                      <div className="flex gap-1 mt-3 pt-2 border-t border-border opacity-0 group-hover:opacity-100 transition-opacity flex-wrap">
                        {allColumns.filter((item) => item.id !== column.id).map((item) => (
                          <button key={item.id} onClick={() => moveTask(task.id, item.id)}
                            className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-body text-muted-foreground hover:bg-surface-low transition-colors">
                            <ChevronRight size={10} />{item.title}
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
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-surface-lowest rounded-xl p-6 shadow-ambient">
          <h3 className="font-serif text-headline-md text-foreground mb-4">Gantt Chart</h3>
          <p className="font-body text-sm text-muted-foreground">Backend hiện chưa có endpoint Gantt riêng, nên phần timeline giả đã được gỡ ở bước này.</p>
        </motion.div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle className="font-serif">{editingTask ? "Sửa task" : "Thêm task mới"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><label className="font-body text-sm text-foreground mb-1 block">Tên task</label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Nhập tên task..." className="rounded-xl border-none bg-surface-low" /></div>
            <div><label className="font-body text-sm text-foreground mb-1 block">Mô tả</label><Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Mô tả..." className="rounded-xl border-none bg-surface-low" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="font-body text-sm text-foreground mb-1 block">Deadline</label><Input type="date" value={form.dueAt} onChange={(e) => setForm({ ...form, dueAt: e.target.value })} className="rounded-xl border-none bg-surface-low" /></div>
              <div>
                <label className="font-body text-sm text-foreground mb-1 block">Ưu tiên</label>
                <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as "low" | "medium" | "high" })} className="w-full rounded-xl bg-surface-low p-2.5 font-body text-sm text-foreground border-none">
                  <option value="high">Cao</option><option value="medium">Trung bình</option><option value="low">Thấp</option>
                </select>
              </div>
            </div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setDialogOpen(false)}>Hủy</Button><Button variant="hero" onClick={saveTask}>{editingTask ? "Cập nhật" : "Thêm"}</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrganizerProjects;
