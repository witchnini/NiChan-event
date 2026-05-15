import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  CheckCircle,
  ChevronRight,
  Edit2,
  Plus,
  Search,
  Trash2,
  Users,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { apiClient } from "@/services/apiClient";
import { toast } from "sonner";

type Project = {
  id: string;
  name: string;
  type: string;
  status: string;
  eventDate?: string | null;
  guestCount?: number | null;
  progressPercent: number;
  customerUser: { id: string; displayName: string; email?: string | null };
  organizerUser?: { id: string; displayName: string; email?: string | null } | null;
  consultationRequest?: { requestCode: string; status: string } | null;
  _count: { tasks: number; milestones: number; vendors?: number; staffAssignments?: number };
};

type Manager = { id: string; displayName: string; email: string };

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
  project: {
    id: string;
    name: string;
    status: string;
    progressPercent: number;
    customerUser?: { displayName: string };
    organizerUser?: { displayName: string } | null;
  };
  columns: KanbanColumn[];
};

type ProjectStaffAssignment = {
  id: string;
  roleText: string;
  status: string;
  assignedAt: string;
  staffUser: {
    id: string;
    displayName: string;
    email?: string | null;
    phone?: string | null;
    avatarUrl?: string | null;
    staffProfile?: { jobTitle?: string | null; employmentStatus?: string | null } | null;
  };
};

type ProjectDetail = {
  id: string;
  staffAssignments?: ProjectStaffAssignment[];
};

const statuses = [
  { value: "all", label: "Tat ca" },
  { value: "planning", label: "Lap ke hoach" },
  { value: "quoted", label: "Da bao gia" },
  { value: "contracted", label: "Da xac nhan" },
  { value: "in_progress", label: "Dang trien khai" },
  { value: "completed", label: "Hoan thanh" },
  { value: "cancelled", label: "Da huy" },
];

const statusLabel = Object.fromEntries(statuses.map((status) => [status.value, status.label]));
const statusColors: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  planning: "bg-primary/10 text-primary",
  quoted: "bg-secondary/10 text-secondary",
  contracted: "bg-secondary/20 text-secondary",
  in_progress: "bg-primary/15 text-primary",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-destructive/10 text-destructive",
};

const allowedTaskMoves: Record<string, string[]> = {
  todo: ["in_progress"],
  in_progress: ["review", "todo"],
  review: ["done", "in_progress"],
  done: [],
};

const emptyForm = { title: "", description: "", dueAt: "", priority: "medium" as const };

const formatDate = (value?: string | null) =>
  value ? new Date(value).toLocaleDateString("vi-VN") : "Chua cap nhat";

const toApiDateTime = (value: string) =>
  value ? new Date(`${value}T00:00:00`).toISOString() : undefined;

const AdminProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [managers, setManagers] = useState<Manager[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [kanban, setKanban] = useState<KanbanResponse | null>(null);
  const [projectStaff, setProjectStaff] = useState<ProjectStaffAssignment[]>([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<KanbanTask | null>(null);
  const [targetStatus, setTargetStatus] = useState("todo");
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);

  const selectedProject = useMemo(
    () => projects.find((project) => project.id === selectedProjectId) ?? null,
    [projects, selectedProjectId],
  );

  const loadProjectContext = async (projectId: string) => {
    const [kanbanData, detailData] = await Promise.all([
      apiClient.get<KanbanResponse>(`/admin/projects/${projectId}/kanban`),
      apiClient.get<ProjectDetail>(`/admin/projects/${projectId}`),
    ]);
    setKanban(kanbanData);
    setProjectStaff(detailData.staffAssignments ?? []);
  };

  const loadProjects = async () => {
    setLoading(true);
    try {
      const data = await apiClient.get<Project[]>("/admin/projects", {
        search,
        status: filterStatus === "all" ? undefined : filterStatus,
        pageSize: 100,
      });
      setProjects(data);
      const nextSelected = data.find((project) => project.id === selectedProjectId)?.id ?? data[0]?.id ?? "";
      setSelectedProjectId(nextSelected);
      if (nextSelected) await loadProjectContext(nextSelected);
      else {
        setKanban(null);
        setProjectStaff([]);
      }
    } catch (error) {
      toast.error("Khong tai duoc danh sach du an");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    apiClient.get<Manager[]>("/admin/users", { role: "organizer", status: "active", pageSize: 100 })
      .then(setManagers)
      .catch(() => toast.error("Khong tai duoc danh sach organizer"));
  }, []);

  useEffect(() => {
    void loadProjects();
  }, [search, filterStatus]);

  useEffect(() => {
    if (!selectedProjectId) return;
    void loadProjectContext(selectedProjectId);
  }, [selectedProjectId]);

  const refresh = async () => {
    await loadProjects();
    if (selectedProjectId) await loadProjectContext(selectedProjectId);
  };

  const updateProjectStatus = async (projectId: string, status: string) => {
    try {
      await apiClient.patch(`/admin/projects/${projectId}/status`, { status });
      toast.success("Da cap nhat trang thai du an");
      await refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Cap nhat trang thai that bai");
    }
  };

  const updateProjectOrganizer = async (projectId: string, organizerUserId: string) => {
    try {
      await apiClient.patch(`/admin/projects/${projectId}/organizer`, {
        organizerUserId: organizerUserId === "__none" ? null : organizerUserId,
      });
      toast.success("Da cap nhat organizer");
      await refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Cap nhat organizer that bai");
    }
  };

  const openAdd = (columnId: string) => {
    setTargetStatus(columnId);
    setEditingTask(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (task: KanbanTask) => {
    setTargetStatus(task.status);
    setEditingTask(task);
    setForm({
      title: task.title,
      description: task.description || "",
      dueAt: task.dueAt ? new Date(task.dueAt).toISOString().slice(0, 10) : "",
      priority: task.priority,
    });
    setDialogOpen(true);
  };

  const saveTask = async () => {
    if (!selectedProjectId || !form.title.trim()) return;

    try {
      if (editingTask) {
        await apiClient.put(`/admin/projects/tasks/${editingTask.id}`, {
          title: form.title.trim(),
          description: form.description || undefined,
          dueAt: toApiDateTime(form.dueAt),
          priority: form.priority,
        });
        toast.success("Da cap nhat task");
      } else {
        await apiClient.post("/admin/projects/tasks", {
          eventId: selectedProjectId,
          title: form.title.trim(),
          description: form.description || undefined,
          status: targetStatus,
          priority: form.priority,
          dueAt: toApiDateTime(form.dueAt),
          sortOrder: 0,
        });
        toast.success("Da them task");
      }
      setDialogOpen(false);
      await refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Khong the luu task");
    }
  };

  const moveTask = async (task: KanbanTask, toStatus: string) => {
    try {
      await apiClient.patch(`/admin/projects/tasks/${task.id}/status`, { status: toStatus });
      toast.success("Da chuyen task");
      await refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Khong the chuyen task");
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      await apiClient.del(`/admin/projects/tasks/${taskId}`);
      toast.success("Da xoa task");
      await refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Khong the xoa task");
    }
  };

  const allColumns = kanban?.columns ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-headline-lg text-foreground">Quan ly du an</h1>
          <p className="font-body text-sm text-muted-foreground">
            {loading ? "Dang tai..." : `${projects.length} du an`}
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Tim theo ten du an, khach hang, ma yeu cau..."
            className="pl-10 rounded-xl bg-surface-lowest font-body border-none"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {statuses.map((status) => (
            <button
              key={status.value}
              onClick={() => setFilterStatus(status.value)}
              className={`px-3 py-2 rounded-xl font-body text-sm transition-all ${
                filterStatus === status.value
                  ? "gradient-primary text-primary-foreground"
                  : "bg-surface-lowest text-muted-foreground hover:text-foreground"
              }`}
            >
              {status.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[360px,1fr] gap-5">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
          {projects.map((project) => (
            <button
              key={project.id}
              onClick={() => setSelectedProjectId(project.id)}
              className={`w-full text-left bg-surface-lowest rounded-xl p-4 shadow-ambient transition-all ${
                selectedProjectId === project.id ? "ring-2 ring-primary" : "hover:bg-surface-low"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-body text-sm font-semibold text-foreground truncate">{project.name}</p>
                  <p className="font-body text-xs text-muted-foreground truncate">
                    {project.customerUser.displayName} - {formatDate(project.eventDate)}
                  </p>
                </div>
                <span className={`shrink-0 px-2 py-1 rounded-full text-[11px] font-body font-semibold ${statusColors[project.status] ?? "bg-muted text-muted-foreground"}`}>
                  {statusLabel[project.status] ?? project.status}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs font-body text-muted-foreground">
                <span>{project._count.tasks} task</span>
                <span>{project._count.staffAssignments ?? 0} nhan su</span>
                <span>{project.progressPercent}%</span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-surface-high overflow-hidden">
                <div className="h-full gradient-primary" style={{ width: `${project.progressPercent}%` }} />
              </div>
            </button>
          ))}

          {!loading && projects.length === 0 && (
            <div className="bg-surface-lowest rounded-xl p-6 shadow-ambient text-sm font-body text-muted-foreground">
              Chua co du an phu hop.
            </div>
          )}
        </motion.div>

        <div className="space-y-5 min-w-0">
          {selectedProject && kanban?.project && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-surface-lowest rounded-xl p-5 shadow-ambient">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                <div>
                  <h2 className="font-serif text-headline-md text-foreground">{selectedProject.name}</h2>
                  <div className="flex flex-wrap gap-3 mt-2 font-body text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><Calendar size={14} /> {formatDate(selectedProject.eventDate)}</span>
                    <span className="inline-flex items-center gap-1"><Users size={14} /> {selectedProject.guestCount ?? 0} khach</span>
                    <span>{selectedProject.type}</span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <select
                    value={selectedProject.organizerUser?.id ?? "__none"}
                    onChange={(event) => updateProjectOrganizer(selectedProject.id, event.target.value)}
                    className="rounded-xl bg-surface-low px-3 py-2 font-body text-sm text-foreground"
                  >
                    <option value="__none">Chua phan cong</option>
                    {managers.map((manager) => (
                      <option key={manager.id} value={manager.id}>{manager.displayName}</option>
                    ))}
                  </select>
                  <select
                    value={selectedProject.status}
                    onChange={(event) => updateProjectStatus(selectedProject.id, event.target.value)}
                    className="rounded-xl bg-surface-low px-3 py-2 font-body text-sm text-foreground"
                  >
                    {statuses.filter((status) => status.value !== "all").map((status) => (
                      <option key={status.value} value={status.value}>{status.label}</option>
                    ))}
                  </select>
                  {selectedProject.status !== "completed" && selectedProject.status !== "cancelled" && (
                    <Button variant="outline" size="sm" onClick={() => updateProjectStatus(selectedProject.id, "cancelled")}>
                      <XCircle size={14} /> Huy
                    </Button>
                  )}
                  {selectedProject.status === "in_progress" && (
                    <Button variant="hero" size="sm" onClick={() => updateProjectStatus(selectedProject.id, "completed")}>
                      <CheckCircle size={14} /> Hoan thanh
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {selectedProject && (
            <div className="bg-surface-lowest rounded-xl p-5 shadow-ambient">
              <div className="flex items-center justify-between gap-3 mb-4">
                <div>
                  <h3 className="font-serif text-headline-md text-foreground">Nhan su du an</h3>
                  <p className="font-body text-sm text-muted-foreground">
                    Organizer cap nhat {projectStaff.length} nhan su cho du an nay
                  </p>
                </div>
                <Users size={18} className="text-primary" />
              </div>

              {projectStaff.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                  {projectStaff.map((assignment) => (
                    <div key={assignment.id} className="rounded-xl border border-border p-4 bg-background">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-body text-sm font-semibold text-foreground truncate">
                            {assignment.staffUser.displayName}
                          </p>
                          <p className="font-body text-xs text-muted-foreground truncate">
                            {assignment.staffUser.staffProfile?.jobTitle || assignment.staffUser.email || "-"}
                          </p>
                        </div>
                        <span className="rounded-full bg-secondary/10 px-2 py-0.5 text-[11px] font-body font-semibold text-secondary">
                          {assignment.status}
                        </span>
                      </div>
                      <div className="mt-3 space-y-1 font-body text-xs text-muted-foreground">
                        <p>Vai tro: <span className="text-foreground font-semibold">{assignment.roleText}</span></p>
                        <p>Lien he: {assignment.staffUser.phone || assignment.staffUser.email || "-"}</p>
                        <p>Cap nhat: {new Date(assignment.assignedAt).toLocaleString("vi-VN")}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl bg-surface-low p-5 font-body text-sm text-muted-foreground">
                  Chua co nhan su du an. Khi organizer them nhan su, danh sach se hien tai day cho admin theo doi.
                </div>
              )}
            </div>
          )}

          {kanban && (
            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-4">
              {allColumns.map((column) => (
                <div key={column.id} className="bg-surface-low rounded-xl p-4 min-w-0">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif font-semibold text-foreground text-sm">{column.title}</h3>
                      <span className="font-body text-xs text-muted-foreground bg-surface-high rounded-full px-2 py-0.5">
                        {column.tasks.length}
                      </span>
                    </div>
                    <button onClick={() => openAdd(column.id)} className="text-muted-foreground hover:text-foreground" title="Them task">
                      <Plus size={16} />
                    </button>
                  </div>

                  <div className="space-y-3 min-h-[120px]">
                    <AnimatePresence>
                      {column.tasks.map((task) => (
                        <motion.div
                          key={task.id}
                          layout
                          initial={{ opacity: 0, scale: 0.96 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.96 }}
                          className="bg-surface-lowest rounded-xl p-4 shadow-ambient group"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="font-body text-sm font-semibold text-foreground break-words">{task.title}</p>
                              <div className="flex flex-wrap gap-2 mt-2 text-xs font-body text-muted-foreground">
                                <span>{task.priority}</span>
                                <span>{task.dueAt ? formatDate(task.dueAt) : "Chua co han"}</span>
                                <span>{task.assignee?.displayName || "Chua phan cong"}</span>
                              </div>
                            </div>
                            <div className="flex gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                              <button onClick={() => openEdit(task)} className="text-muted-foreground hover:text-foreground" title="Sua">
                                <Edit2 size={13} />
                              </button>
                              <button onClick={() => deleteTask(task.id)} className="text-muted-foreground hover:text-destructive" title="Xoa">
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>

                          <div className="flex gap-1 mt-3 pt-2 border-t border-border flex-wrap">
                            {(allowedTaskMoves[task.status] ?? []).map((nextStatus) => {
                              const target = allColumns.find((item) => item.id === nextStatus);
                              if (!target) return null;
                              return (
                                <button
                                  key={nextStatus}
                                  onClick={() => moveTask(task, nextStatus)}
                                  className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-body text-muted-foreground hover:bg-surface-low"
                                >
                                  <ChevronRight size={10} /> {target.title}
                                </button>
                              );
                            })}
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif">{editingTask ? "Sua task" : "Them task"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="font-body text-sm text-foreground mb-1 block">Ten task</label>
              <Input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} className="rounded-xl border-none bg-surface-low" />
            </div>
            <div>
              <label className="font-body text-sm text-foreground mb-1 block">Mo ta</label>
              <Input value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className="rounded-xl border-none bg-surface-low" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-body text-sm text-foreground mb-1 block">Deadline</label>
                <Input type="date" value={form.dueAt} onChange={(event) => setForm({ ...form, dueAt: event.target.value })} className="rounded-xl border-none bg-surface-low" />
              </div>
              <div>
                <label className="font-body text-sm text-foreground mb-1 block">Uu tien</label>
                <select
                  value={form.priority}
                  onChange={(event) => setForm({ ...form, priority: event.target.value as "low" | "medium" | "high" })}
                  className="w-full rounded-xl bg-surface-low p-2.5 font-body text-sm text-foreground border-none"
                >
                  <option value="high">Cao</option>
                  <option value="medium">Trung binh</option>
                  <option value="low">Thap</option>
                </select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Huy</Button>
            <Button variant="hero" onClick={saveTask}>{editingTask ? "Cap nhat" : "Them"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProjects;
