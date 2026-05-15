import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  Calendar,
  CheckCircle,
  ChevronRight,
  Clock,
  Edit2,
  ListChecks,
  Milestone,
  PlayCircle,
  Plus,
  Search,
  Trash2,
  UserPlus,
  UserRound,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { apiClient } from "@/services/apiClient";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

type Project = {
  id: string;
  name: string;
  type: string;
  status: string;
  eventDate?: string | null;
  guestCount?: number | null;
  locationText?: string | null;
  progressPercent: number;
  customerUser: {
    id: string;
    displayName: string;
    email?: string | null;
    phone?: string | null;
    avatarUrl?: string | null;
  };
  _count: {
    tasks: number;
    milestones: number;
    vendors?: number;
    staffAssignments?: number;
  };
};

type ProjectDetail = Project & {
  summary?: string | null;
  consultationRequest?: { requestCode: string; status: string; budgetRange?: string | null } | null;
  milestones: {
    id: string;
    title: string;
    description?: string | null;
    milestoneDate?: string | null;
    status: string;
    sortOrder: number;
  }[];
  activities: {
    id: string;
    message: string;
    iconName?: string | null;
    createdAt: string;
  }[];
  _count: Project["_count"] & {
    contracts: number;
    documents: number;
  };
};

type StaffOption = {
  id: string;
  displayName: string;
  email?: string | null;
  phone?: string | null;
  staffProfile?: { jobTitle?: string | null } | null;
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
    staffProfile?: { jobTitle?: string | null } | null;
  };
};

type ProjectStaffResponse = {
  event: { id: string; name: string };
  assignments: ProjectStaffAssignment[];
};

type KanbanTask = {
  id: string;
  title: string;
  description?: string | null;
  status: string;
  priority: "low" | "medium" | "high";
  dueAt?: string | null;
  assignee?: { id: string; displayName: string; avatarUrl?: string | null } | null;
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
    eventDate?: string | null;
    guestCount?: number | null;
    progressPercent: number;
    customerUser?: { id: string; displayName: string; avatarUrl?: string | null };
  };
  columns: KanbanColumn[];
};

const statuses = [
  { value: "all", label: "Tat ca" },
  { value: "planning", label: "Lap ke hoach" },
  { value: "quoted", label: "Da bao gia" },
  { value: "contracted", label: "Da xac nhan" },
  { value: "in_progress", label: "Dang trien khai" },
  { value: "completed", label: "Hoan thanh" },
];

const statusLabel = Object.fromEntries(statuses.map((status) => [status.value, status.label]));
const statusColors: Record<string, string> = {
  planning: "bg-primary/10 text-primary",
  quoted: "bg-secondary/10 text-secondary",
  contracted: "bg-secondary/20 text-secondary",
  in_progress: "bg-primary/15 text-primary",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-destructive/10 text-destructive",
};

const priorityColors: Record<string, string> = {
  high: "bg-destructive/10 text-destructive",
  medium: "bg-primary/10 text-primary",
  low: "bg-muted text-muted-foreground",
};

const allowedTaskMoves: Record<string, string[]> = {
  todo: ["in_progress"],
  in_progress: ["review", "todo"],
  review: ["done", "in_progress"],
  done: [],
};

const emptyForm = {
  title: "",
  description: "",
  assigneeUserId: "",
  dueAt: "",
  priority: "medium" as const,
};

const formatDate = (value?: string | null) =>
  value ? new Date(value).toLocaleDateString("vi-VN") : "Chua cap nhat";

const formatDateTime = (value?: string | null) =>
  value
    ? new Date(value).toLocaleString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "2-digit",
      })
    : "Chua cap nhat";

const toApiDateTime = (value: string) =>
  value ? new Date(`${value}T00:00:00`).toISOString() : undefined;

const isOverdue = (value?: string | null) =>
  !!value && new Date(value).getTime() < Date.now();

const OrganizerProjects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [staff, setStaff] = useState<StaffOption[]>([]);
  const [projectStaff, setProjectStaff] = useState<ProjectStaffAssignment[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [projectDetail, setProjectDetail] = useState<ProjectDetail | null>(null);
  const [kanban, setKanban] = useState<KanbanResponse | null>(null);
  const [view, setView] = useState<"overview" | "kanban" | "timeline" | "staff">("kanban");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [staffDialogOpen, setStaffDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<KanbanTask | null>(null);
  const [targetStatus, setTargetStatus] = useState("todo");
  const [form, setForm] = useState(emptyForm);
  const [staffForm, setStaffForm] = useState({ staffUserId: "", roleText: "" });
  const [loading, setLoading] = useState(true);
  const [contextLoading, setContextLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const assigneeOptions = useMemo(() => {
    const self = user
      ? [{ id: user.userId, displayName: `${user.displayName} (toi)`, email: user.email }]
      : [];
    const merged = [...self, ...staff];
    return merged.filter((item, index) => merged.findIndex((other) => other.id === item.id) === index);
  }, [staff, user]);

  const availableStaffForProject = useMemo(() => {
    const assignedIds = new Set(projectStaff.map((assignment) => assignment.staffUser.id));
    return staff.filter((person) => !assignedIds.has(person.id));
  }, [projectStaff, staff]);

  const filteredProjects = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return projects.filter((project) => {
      const matchesStatus = filterStatus === "all" || project.status === filterStatus;
      const matchesSearch =
        !keyword ||
        project.name.toLowerCase().includes(keyword) ||
        project.type.toLowerCase().includes(keyword) ||
        project.customerUser.displayName.toLowerCase().includes(keyword);
      return matchesStatus && matchesSearch;
    });
  }, [filterStatus, projects, search]);

  const allColumns = useMemo(() => kanban?.columns ?? [], [kanban]);
  const allTasks = useMemo(() => allColumns.flatMap((column) => column.tasks), [allColumns]);
  const overdueTasks = useMemo(
    () => allTasks.filter((task) => task.status !== "done" && isOverdue(task.dueAt)).length,
    [allTasks],
  );

  const stats = useMemo(() => {
    const active = projects.filter((project) => project.status !== "completed").length;
    const running = projects.filter((project) => project.status === "in_progress").length;
    const completed = projects.filter((project) => project.status === "completed").length;
    const avgProgress = projects.length
      ? Math.round(projects.reduce((sum, project) => sum + project.progressPercent, 0) / projects.length)
      : 0;
    return [
      { label: "Du an dang xu ly", value: String(active), icon: ListChecks, color: "text-primary" },
      { label: "Dang trien khai", value: String(running), icon: PlayCircle, color: "text-secondary" },
      { label: "Da hoan thanh", value: String(completed), icon: CheckCircle, color: "text-secondary" },
      { label: "Tien do TB", value: `${avgProgress}%`, icon: Activity, color: "text-primary" },
    ];
  }, [projects]);

  const loadProjectContext = async (projectId: string) => {
    if (!projectId) {
      setProjectDetail(null);
      setKanban(null);
      setProjectStaff([]);
      return;
    }

    setContextLoading(true);
    try {
      const [detailData, kanbanData, staffData] = await Promise.all([
        apiClient.get<ProjectDetail>(`/organizer/projects/${projectId}`),
        apiClient.get<KanbanResponse>(`/organizer/projects/${projectId}/kanban`),
        apiClient.get<ProjectStaffResponse>(`/organizer/staff/events/${projectId}`),
      ]);
      setProjectDetail(detailData);
      setKanban(kanbanData);
      setProjectStaff(staffData.assignments);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Khong tai duoc du an");
    } finally {
      setContextLoading(false);
    }
  };

  const loadProjects = async (preferredId?: string) => {
    const data = await apiClient.get<Project[]>("/organizer/projects");
    setProjects(data);
    const nextId = data.find((project) => project.id === (preferredId || selectedProjectId))?.id ?? data[0]?.id ?? "";
    setSelectedProjectId(nextId);
    return nextId;
  };

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const [projectData, staffData] = await Promise.all([
          apiClient.get<Project[]>("/organizer/projects"),
          apiClient.get<StaffOption[]>("/organizer/staff", { pageSize: 100 }),
        ]);
        if (cancelled) return;
        setProjects(projectData);
        setStaff(staffData);
        const firstId = projectData[0]?.id ?? "";
        setSelectedProjectId(firstId);
        if (firstId) await loadProjectContext(firstId);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Khong tai duoc du an");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!selectedProjectId || loading) return;
    void loadProjectContext(selectedProjectId);
  }, [selectedProjectId]); // eslint-disable-line react-hooks/exhaustive-deps

  const refresh = async () => {
    const currentId = await loadProjects(selectedProjectId);
    if (currentId) await loadProjectContext(currentId);
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
      assigneeUserId: task.assignee?.id ?? "",
      dueAt: task.dueAt ? new Date(task.dueAt).toISOString().slice(0, 10) : "",
      priority: task.priority,
    });
    setDialogOpen(true);
  };

  const saveTask = async () => {
    if (!selectedProjectId || !form.title.trim()) return;

    const payload = {
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      assigneeUserId: form.assigneeUserId || null,
      dueAt: toApiDateTime(form.dueAt),
      priority: form.priority,
    };

    try {
      if (editingTask) {
        await apiClient.put(`/organizer/tasks/${editingTask.id}`, payload);
        toast.success("Da cap nhat task");
      } else {
        await apiClient.post("/organizer/tasks", {
          ...payload,
          eventId: selectedProjectId,
          status: targetStatus,
          sortOrder: 0,
        });
        toast.success("Da them task moi");
      }

      setDialogOpen(false);
      await refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Khong the luu task");
    }
  };

  const moveTask = async (task: KanbanTask, toStatus: string) => {
    try {
      await apiClient.patch(`/organizer/tasks/${task.id}/status`, { status: toStatus });
      toast.success("Da chuyen task");
      await refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Khong the chuyen task");
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      await apiClient.del(`/organizer/tasks/${taskId}`);
      toast.success("Da xoa task");
      await refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Khong the xoa task");
    }
  };

  const changeProjectStatus = async (status: "in_progress" | "completed") => {
    if (!selectedProjectId) return;
    try {
      await apiClient.patch(`/organizer/projects/${selectedProjectId}/status`, { status });
      toast.success(status === "in_progress" ? "Da bat dau trien khai" : "Da danh dau hoan thanh");
      await refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Khong the cap nhat trang thai du an");
    }
  };

  const openAssignStaff = () => {
    setStaffForm({ staffUserId: availableStaffForProject[0]?.id ?? "", roleText: "" });
    setStaffDialogOpen(true);
  };

  const assignProjectStaff = async () => {
    if (!selectedProjectId || !staffForm.staffUserId || !staffForm.roleText.trim()) {
      toast.error("Vui long chon nhan su va nhap vai tro trong du an");
      return;
    }

    try {
      await apiClient.post(`/organizer/staff/events/${selectedProjectId}`, {
        staffUserId: staffForm.staffUserId,
        roleText: staffForm.roleText.trim(),
      });
      toast.success("Da them nhan su vao du an");
      setStaffDialogOpen(false);
      await refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Khong the them nhan su");
    }
  };

  const removeProjectStaff = async (assignmentId: string) => {
    try {
      await apiClient.del(`/organizer/staff/assignments/${assignmentId}`);
      toast.success("Da go nhan su khoi du an");
      await refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Khong the go nhan su");
    }
  };

  const renderProjectActions = () => {
    const status = kanban?.project.status;
    if (!status) return null;

    return (
      <div className="flex gap-2 flex-wrap">
        {["planning", "quoted", "contracted"].includes(status) && (
          <Button variant="hero" size="sm" onClick={() => changeProjectStatus("in_progress")}>
            <PlayCircle size={14} /> Bat dau trien khai
          </Button>
        )}
        {status === "in_progress" && (
          <Button variant="outline" size="sm" onClick={() => changeProjectStatus("completed")}>
            <CheckCircle size={14} /> Hoan thanh
          </Button>
        )}
      </div>
    );
  };

  if (loading) return <div className="font-body text-muted-foreground">Dang tai du an...</div>;
  if (error) return <div className="font-body text-destructive">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-headline-lg text-foreground">Quan ly du an</h1>
          <p className="font-body text-sm text-muted-foreground">
            {projects.length} du an duoc phan cong
          </p>
        </div>
        <div className="flex p-1 rounded-xl bg-surface-low self-start lg:self-auto">
          {[
            { value: "overview", label: "Tong quan" },
            { value: "kanban", label: "Kanban" },
            { value: "timeline", label: "Timeline" },
            { value: "staff", label: "Nhan su" },
          ].map((item) => (
            <button
              key={item.value}
              onClick={() => setView(item.value as "overview" | "kanban" | "timeline" | "staff")}
              className={`px-4 py-2 rounded-lg font-body text-sm transition-all ${
                view === item.value
                  ? "bg-background shadow-ambient text-foreground font-semibold"
                  : "text-muted-foreground"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-surface-lowest rounded-xl p-5 shadow-ambient">
            <stat.icon size={20} className={stat.color} />
            <p className="font-serif text-headline-lg text-foreground mt-3">{stat.value}</p>
            <p className="font-body text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[340px,1fr] gap-5">
        <div className="space-y-4">
          <div className="bg-surface-lowest rounded-xl p-4 shadow-ambient space-y-3">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Tim du an, khach hang..."
                className="pl-9 rounded-xl bg-surface-low font-body border-none"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {statuses.map((status) => (
                <button
                  key={status.value}
                  onClick={() => setFilterStatus(status.value)}
                  className={`px-3 py-1.5 rounded-lg font-body text-xs transition-all ${
                    filterStatus === status.value
                      ? "gradient-primary text-primary-foreground"
                      : "bg-surface-low text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {status.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filteredProjects.map((project) => (
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
                  <span>{project.progressPercent}%</span>
                </div>
                <Progress value={project.progressPercent} className="h-2 mt-2 bg-surface-high" />
              </button>
            ))}

            {filteredProjects.length === 0 && (
              <div className="bg-surface-lowest rounded-xl p-6 shadow-ambient text-sm font-body text-muted-foreground">
                Khong co du an phu hop.
              </div>
            )}
          </div>
        </div>

        <div className="space-y-5 min-w-0">
          {kanban?.project && (
            <div className="bg-surface-lowest rounded-xl p-5 shadow-ambient">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="font-serif text-headline-md text-foreground truncate">{kanban.project.name}</h2>
                  <div className="flex flex-wrap gap-3 mt-2 font-body text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><Calendar size={14} /> {formatDate(kanban.project.eventDate)}</span>
                    <span className="inline-flex items-center gap-1"><Users size={14} /> {kanban.project.guestCount ?? 0} khach</span>
                    <span className="inline-flex items-center gap-1"><UserRound size={14} /> {kanban.project.customerUser?.displayName ?? "-"}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-4">
                    <Progress value={kanban.project.progressPercent} className="h-2 max-w-sm bg-surface-high" />
                    <span className="font-body text-sm font-semibold text-foreground">{kanban.project.progressPercent}%</span>
                  </div>
                </div>
                <div className="flex flex-col items-start lg:items-end gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-body font-semibold ${statusColors[kanban.project.status] ?? "bg-muted text-muted-foreground"}`}>
                    {statusLabel[kanban.project.status] ?? kanban.project.status}
                  </span>
                  {renderProjectActions()}
                </div>
              </div>
            </div>
          )}

          {contextLoading && (
            <div className="font-body text-sm text-muted-foreground">Dang cap nhat du lieu...</div>
          )}

          {view === "overview" && projectDetail && (
            <div className="grid grid-cols-1 2xl:grid-cols-[1fr,360px] gap-5">
              <div className="bg-surface-lowest rounded-xl p-5 shadow-ambient">
                <h3 className="font-serif text-headline-md text-foreground mb-4">Thong tin du an</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-body text-sm">
                  <Info label="Khach hang" value={projectDetail.customerUser.displayName} />
                  <Info label="Lien he" value={projectDetail.customerUser.phone || projectDetail.customerUser.email || "-"} />
                  <Info label="Loai su kien" value={projectDetail.type} />
                  <Info label="Dia diem" value={projectDetail.locationText || "-"} />
                  <Info label="Ma yeu cau" value={projectDetail.consultationRequest?.requestCode || "-"} />
                  <Info label="Ngan sach du kien" value={projectDetail.consultationRequest?.budgetRange || "-"} />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
                  <Metric label="Task" value={projectDetail._count.tasks} />
                  <Metric label="Milestone" value={projectDetail.milestones.length} />
                  <Metric label="Nhan su" value={projectDetail._count.staffAssignments ?? 0} />
                  <Metric label="NCC" value={projectDetail._count.vendors ?? 0} />
                </div>
              </div>

              <div className="bg-surface-lowest rounded-xl p-5 shadow-ambient">
                <h3 className="font-serif text-headline-md text-foreground mb-4">Hoat dong gan day</h3>
                <div className="space-y-3">
                  {projectDetail.activities.map((activity) => (
                    <div key={activity.id} className="border-b border-border last:border-0 pb-3 last:pb-0">
                      <p className="font-body text-sm text-foreground">{activity.message}</p>
                      <p className="font-body text-xs text-muted-foreground mt-1">{formatDateTime(activity.createdAt)}</p>
                    </div>
                  ))}
                  {projectDetail.activities.length === 0 && (
                    <p className="font-body text-sm text-muted-foreground">Chua co hoat dong.</p>
                  )}
                </div>
              </div>

              <div className="2xl:col-span-2 bg-surface-lowest rounded-xl p-5 shadow-ambient">
                <h3 className="font-serif text-headline-md text-foreground mb-4">Milestone</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
                  {projectDetail.milestones.map((milestone) => (
                    <div key={milestone.id} className="rounded-lg border border-border p-4">
                      <div className="flex items-center justify-between gap-2">
                        <Milestone size={16} className="text-primary" />
                        <span className={`text-[11px] font-body font-semibold px-2 py-0.5 rounded-full ${statusColors[milestone.status] ?? "bg-muted text-muted-foreground"}`}>
                          {milestone.status}
                        </span>
                      </div>
                      <p className="font-body text-sm font-semibold text-foreground mt-3">{milestone.title}</p>
                      <p className="font-body text-xs text-muted-foreground mt-1">{formatDate(milestone.milestoneDate)}</p>
                    </div>
                  ))}
                  {projectDetail.milestones.length === 0 && (
                    <p className="font-body text-sm text-muted-foreground">Chua co milestone.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {view === "kanban" && (
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
                              <div className="flex flex-wrap gap-2 mt-2 text-xs font-body">
                                <span className={`px-2 py-0.5 rounded-full font-semibold ${priorityColors[task.priority]}`}>
                                  {task.priority}
                                </span>
                                <span className={isOverdue(task.dueAt) && task.status !== "done" ? "text-destructive" : "text-muted-foreground"}>
                                  <Calendar size={11} className="inline mr-1" /> {task.dueAt ? formatDate(task.dueAt) : "Chua co han"}
                                </span>
                              </div>
                              <div className="flex items-center gap-1 mt-2">
                                <div className="w-5 h-5 rounded-full bg-secondary/20 flex items-center justify-center">
                                  <Users size={10} className="text-secondary" />
                                </div>
                                <span className="font-body text-xs text-muted-foreground">
                                  {task.assignee?.displayName || "Chua phan cong"}
                                </span>
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

          {view === "staff" && (
            <div className="bg-surface-lowest rounded-xl p-5 shadow-ambient">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                <div>
                  <h3 className="font-serif text-headline-md text-foreground">Nhan su du an</h3>
                  <p className="font-body text-sm text-muted-foreground">
                    {projectStaff.length} nhan su dang duoc gan vao du an nay
                  </p>
                </div>
                <Button variant="hero" size="sm" onClick={openAssignStaff} disabled={availableStaffForProject.length === 0}>
                  <UserPlus size={14} /> Them nhan su
                </Button>
              </div>

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
                      <button
                        onClick={() => removeProjectStaff(assignment.id)}
                        className="text-muted-foreground hover:text-destructive"
                        title="Go nhan su"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="mt-3 space-y-1 font-body text-xs text-muted-foreground">
                      <p>Vai tro: <span className="text-foreground font-semibold">{assignment.roleText}</span></p>
                      <p>Trang thai: {assignment.status}</p>
                      <p>Lien he: {assignment.staffUser.phone || assignment.staffUser.email || "-"}</p>
                    </div>
                  </div>
                ))}
              </div>

              {projectStaff.length === 0 && (
                <div className="rounded-xl bg-surface-low p-6 font-body text-sm text-muted-foreground">
                  Chua co nhan su nao trong du an nay. Organizer co the them nhan su phu hop cho tung vai tro trien khai.
                </div>
              )}
            </div>
          )}

          {view === "timeline" && (
            <div className="bg-surface-lowest rounded-xl p-5 shadow-ambient">
              <div className="flex items-center justify-between gap-3 mb-5">
                <h3 className="font-serif text-headline-md text-foreground">Timeline cong viec</h3>
                {overdueTasks > 0 && (
                  <span className="font-body text-xs font-semibold text-destructive bg-destructive/10 rounded-full px-3 py-1">
                    {overdueTasks} task tre han
                  </span>
                )}
              </div>

              <div className="space-y-3">
                {[...allTasks]
                  .sort((a, b) => {
                    const left = a.dueAt ? new Date(a.dueAt).getTime() : Number.MAX_SAFE_INTEGER;
                    const right = b.dueAt ? new Date(b.dueAt).getTime() : Number.MAX_SAFE_INTEGER;
                    return left - right;
                  })
                  .map((task) => (
                    <div key={task.id} className="grid grid-cols-1 md:grid-cols-[150px,1fr,140px] gap-3 border-b border-border last:border-0 pb-3 last:pb-0">
                      <div className="font-body text-sm text-muted-foreground flex items-center gap-2">
                        <Clock size={14} /> {task.dueAt ? formatDate(task.dueAt) : "Chua co han"}
                      </div>
                      <div>
                        <p className="font-body text-sm font-semibold text-foreground">{task.title}</p>
                        <p className="font-body text-xs text-muted-foreground mt-1">
                          {task.assignee?.displayName || "Chua phan cong"} - {task.priority}
                        </p>
                      </div>
                      <span className={`self-start justify-self-start md:justify-self-end px-2 py-1 rounded-full text-xs font-body font-semibold ${statusColors[task.status] ?? "bg-muted text-muted-foreground"}`}>
                        {task.status}
                      </span>
                    </div>
                  ))}
                {allTasks.length === 0 && (
                  <p className="font-body text-sm text-muted-foreground">Chua co task trong du an nay.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif">{editingTask ? "Sua task" : "Them task moi"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="font-body text-sm text-foreground mb-1 block">Ten task</label>
              <Input
                value={form.title}
                onChange={(event) => setForm({ ...form, title: event.target.value })}
                placeholder="Nhap ten task..."
                className="rounded-xl border-none bg-surface-low"
              />
            </div>
            <div>
              <label className="font-body text-sm text-foreground mb-1 block">Mo ta</label>
              <Input
                value={form.description}
                onChange={(event) => setForm({ ...form, description: event.target.value })}
                placeholder="Mo ta ngan..."
                className="rounded-xl border-none bg-surface-low"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="font-body text-sm text-foreground mb-1 block">Deadline</label>
                <Input
                  type="date"
                  value={form.dueAt}
                  onChange={(event) => setForm({ ...form, dueAt: event.target.value })}
                  className="rounded-xl border-none bg-surface-low"
                />
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
              <div>
                <label className="font-body text-sm text-foreground mb-1 block">Phu trach</label>
                <select
                  value={form.assigneeUserId}
                  onChange={(event) => setForm({ ...form, assigneeUserId: event.target.value })}
                  className="w-full rounded-xl bg-surface-low p-2.5 font-body text-sm text-foreground border-none"
                >
                  <option value="">Chua phan cong</option>
                  {assigneeOptions.map((person) => (
                    <option key={person.id} value={person.id}>{person.displayName}</option>
                  ))}
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

      <Dialog open={staffDialogOpen} onOpenChange={setStaffDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif">Them nhan su du an</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="font-body text-sm text-foreground mb-1 block">Nhan su</label>
              <select
                value={staffForm.staffUserId}
                onChange={(event) => setStaffForm((current) => ({ ...current, staffUserId: event.target.value }))}
                className="w-full rounded-xl bg-surface-low p-2.5 font-body text-sm text-foreground border-none"
              >
                <option value="">Chon nhan su</option>
                {availableStaffForProject.map((person) => (
                  <option key={person.id} value={person.id}>
                    {person.displayName} - {person.staffProfile?.jobTitle || person.email || "Nhan su"}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-body text-sm text-foreground mb-1 block">Vai tro trong du an</label>
              <Input
                value={staffForm.roleText}
                onChange={(event) => setStaffForm((current) => ({ ...current, roleText: event.target.value }))}
                placeholder="VD: Dieu phoi sanh, le tan, am thanh..."
                className="rounded-xl border-none bg-surface-low"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStaffDialogOpen(false)}>Huy</Button>
            <Button variant="hero" onClick={assignProjectStaff}>Them</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const Info = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-lg bg-surface-low p-3">
    <p className="font-body text-xs text-muted-foreground">{label}</p>
    <p className="font-body text-sm font-semibold text-foreground mt-1 break-words">{value}</p>
  </div>
);

const Metric = ({ label, value }: { label: string; value: number }) => (
  <div className="rounded-lg bg-surface-low p-3">
    <p className="font-serif text-headline-md text-foreground">{value}</p>
    <p className="font-body text-xs text-muted-foreground">{label}</p>
  </div>
);

export default OrganizerProjects;
