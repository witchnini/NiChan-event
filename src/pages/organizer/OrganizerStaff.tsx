import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, Edit2, Mail, Phone, Plus, Search, Trash2, UserPlus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiClient } from "@/services/apiClient";
import { toast } from "sonner";

const staffRoles = ["Event Manager", "Điều phối viên", "Thiết kế", "Lễ tân", "Âm thanh & ánh sáng", "MC"];
const isValidPhone = (value: string) => !value || /^0[3-9]\d{8}$/.test(value);
const emptyCreateForm = { name: "", email: "", phone: "", jobTitle: "", employmentStatus: "active" };

type Project = {
  id: string;
  name: string;
  type: string;
  status: string;
  eventDate?: string | null;
  guestCount?: number | null;
  customerUser: { displayName: string; email?: string | null; phone?: string | null };
  _count: { staffAssignments?: number; tasks?: number };
};

type Staff = {
  id: string;
  displayName: string;
  email: string;
  phone?: string | null;
  staffProfile?: { jobTitle?: string | null; employmentStatus?: string | null };
};

type ProjectStaffAssignment = {
  id: string;
  roleText: string;
  status: "invited" | "confirmed" | "declined";
  assignedAt: string;
  staffUser: {
    id: string;
    displayName: string;
    email?: string | null;
    phone?: string | null;
    staffProfile?: { jobTitle?: string | null } | null;
  };
};

type ProjectStaffResponse = {
  event: { id: string; name: string };
  assignments: ProjectStaffAssignment[];
};

type Shift = {
  id: string;
  workDate: string;
  startTime: string;
  endTime: string;
  staffUser?: { displayName: string } | null;
  event?: { name: string } | null;
};

const emptyForm = { staffUserId: "", roleText: "", status: "invited" as const };

const assignmentStatusLabels: Record<ProjectStaffAssignment["status"], string> = {
  invited: "Đã mời",
  confirmed: "Đã xác nhận",
  declined: "Từ chối",
};

const assignmentStatusColors: Record<ProjectStaffAssignment["status"], string> = {
  invited: "bg-primary/10 text-primary",
  confirmed: "bg-secondary/10 text-secondary",
  declined: "bg-destructive/10 text-destructive",
};

const formatDate = (value?: string | null) =>
  value ? new Date(value).toLocaleDateString("vi-VN") : "Chưa cập nhật";

const OrganizerStaff = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [assignments, setAssignments] = useState<ProjectStaffAssignment[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"project" | "schedule">("project");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<ProjectStaffAssignment | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [contextLoading, setContextLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [createForm, setCreateForm] = useState(emptyCreateForm);
  const [createSaving, setCreateSaving] = useState(false);

  const selectedProject = useMemo(
    () => projects.find((project) => project.id === selectedProjectId) ?? null,
    [projects, selectedProjectId],
  );

  const filteredProjects = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return projects;
    return projects.filter((project) =>
      [project.name, project.type, project.customerUser.displayName]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(keyword)),
    );
  }, [projects, search]);

  const availableStaff = useMemo(() => {
    const assignedIds = new Set(assignments.map((assignment) => assignment.staffUser.id));
    return staff.filter((person) => !assignedIds.has(person.id));
  }, [assignments, staff]);

  const staffOptionsForDialog = useMemo(() => {
    if (!editingAssignment) return availableStaff;
    const currentStaff = staff.find((person) => person.id === editingAssignment.staffUser.id);
    return currentStaff ? [currentStaff, ...availableStaff] : availableStaff;
  }, [availableStaff, editingAssignment, staff]);

  const loadProjectAssignments = async (projectId: string) => {
    if (!projectId) {
      setAssignments([]);
      return;
    }

    setContextLoading(true);
    try {
      const data = await apiClient.get<ProjectStaffResponse>(`/organizer/staff/events/${projectId}`);
      setAssignments(data.assignments);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không tải được nhân sự dự án");
    } finally {
      setContextLoading(false);
    }
  };

  const loadProjects = async (preferredId?: string) => {
    const projectData = await apiClient.get<Project[]>("/organizer/projects");
    setProjects(projectData);
    const nextId = projectData.find((project) => project.id === (preferredId || selectedProjectId))?.id ?? projectData[0]?.id ?? "";
    setSelectedProjectId(nextId);
    if (!nextId) setAssignments([]);
    return nextId;
  };

  const refreshProjectContext = async () => {
    const nextId = await loadProjects(selectedProjectId);
    if (nextId) await loadProjectAssignments(nextId);
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [projectData, staffData, shiftData] = await Promise.all([
          apiClient.get<Project[]>("/organizer/projects"),
          apiClient.get<Staff[]>("/organizer/staff", { pageSize: 100 }),
          apiClient.get<Shift[]>("/organizer/staff/shifts"),
        ]);
        setProjects(projectData);
        setStaff(staffData);
        setShifts(shiftData);
        const firstId = projectData[0]?.id ?? "";
        setSelectedProjectId(firstId);
        if (firstId) await loadProjectAssignments(firstId);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Không tải được dữ liệu nhân sự");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  useEffect(() => {
    if (!selectedProjectId || loading) return;
    void loadProjectAssignments(selectedProjectId);
  }, [selectedProjectId]); // eslint-disable-line react-hooks/exhaustive-deps

  const openAdd = () => {
    setEditingAssignment(null);
    setForm({
      ...emptyForm,
      staffUserId: availableStaff[0]?.id ?? "",
    });
    setDialogOpen(true);
  };

  const openEdit = (assignment: ProjectStaffAssignment) => {
    setEditingAssignment(assignment);
    setForm({
      staffUserId: assignment.staffUser.id,
      roleText: assignment.roleText,
      status: assignment.status,
    });
    setDialogOpen(true);
  };

  const saveAssignment = async () => {
    if (!selectedProjectId) return;
    if (!form.staffUserId || !form.roleText.trim()) {
      toast.error("Vui lòng chọn nhân sự và nhập vai trò trong dự án");
      return;
    }

    setSaving(true);
    try {
      if (editingAssignment) {
        await apiClient.patch(`/organizer/staff/assignments/${editingAssignment.id}`, {
          roleText: form.roleText.trim(),
          status: form.status,
        });
        toast.success("Đã cập nhật nhân sự dự án");
      } else {
        await apiClient.post(`/organizer/staff/events/${selectedProjectId}`, {
          staffUserId: form.staffUserId,
          roleText: form.roleText.trim(),
        });
        toast.success("Đã thêm nhân sự vào dự án");
      }

      setDialogOpen(false);
      await refreshProjectContext();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không thể lưu nhân sự dự án");
    } finally {
      setSaving(false);
    }
  };

  const deleteAssignment = async (assignmentId: string) => {
    try {
      await apiClient.del(`/organizer/staff/assignments/${assignmentId}`);
      toast.success("Đã gỡ nhân sự khỏi dự án");
      await refreshProjectContext();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không thể gỡ nhân sự");
    }
  };

  const handleCreateStaff = async () => {
    const { name, email, phone, jobTitle } = createForm;
    if (!name.trim() || !email.trim() || !jobTitle) {
      toast.error("Vui lòng nhập đầy đủ họ tên, email và vai trò");
      return;
    }
    if (phone && !isValidPhone(phone)) {
      toast.error("Số điện thoại không hợp lệ (VD: 0912345678)");
      return;
    }

    setCreateSaving(true);
    try {
      await apiClient.post("/organizer/staff", {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        jobTitle,
        employmentStatus: createForm.employmentStatus,
      });
      toast.success("Đã tạo nhân sự mới");
      setCreateDialogOpen(false);
      setCreateForm(emptyCreateForm);
      const staffData = await apiClient.get<Staff[]>("/organizer/staff", { pageSize: 100 });
      setStaff(staffData);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không thể tạo nhân sự");
    } finally {
      setCreateSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-headline-lg text-foreground">Quản lý nhân sự dự án</h1>
          <p className="font-body text-sm text-muted-foreground">
            {loading ? "Đang tải..." : "Thêm, sửa, xóa nhân sự theo từng dự án được phân công"}
          </p>
        </div>
        <div className="flex p-1 rounded-xl bg-surface-low">
          <button onClick={() => setTab("project")} className={`px-4 py-2 rounded-lg font-body text-sm transition-all ${tab === "project" ? "bg-background shadow-ambient text-foreground font-semibold" : "text-muted-foreground"}`}>Theo dự án</button>
          <button onClick={() => setTab("schedule")} className={`px-4 py-2 rounded-lg font-body text-sm transition-all ${tab === "schedule" ? "bg-background shadow-ambient text-foreground font-semibold" : "text-muted-foreground"}`}>Ca trực</button>
        </div>
      </div>

      {tab === "project" && (
        <div className="grid grid-cols-1 xl:grid-cols-[340px,1fr] gap-5">
          <div className="space-y-4">
            <div className="bg-surface-lowest rounded-xl p-4 shadow-ambient">
              <div className="relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Tìm dự án..."
                  className="pl-9 rounded-xl bg-surface-low font-body border-none"
                />
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
                    <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-body font-semibold text-primary">
                      {project._count.staffAssignments ?? 0} NS
                    </span>
                  </div>
                  <div className="mt-3 flex items-center gap-2 font-body text-xs text-muted-foreground">
                    <Calendar size={12} /> {project.type} · {project.guestCount ?? 0} khách
                  </div>
                </button>
              ))}

              {filteredProjects.length === 0 && !loading && (
                <div className="bg-surface-lowest rounded-xl p-6 shadow-ambient text-sm font-body text-muted-foreground">
                  Chưa có dự án được phân công.
                </div>
              )}
            </div>
          </div>

          <div className="bg-surface-lowest rounded-xl p-5 shadow-ambient min-w-0">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-5">
              <div className="min-w-0">
                <h2 className="font-serif text-headline-md text-foreground truncate">
                  {selectedProject?.name ?? "Chưa chọn dự án"}
                </h2>
                <div className="flex flex-wrap gap-3 mt-2 font-body text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><Users size={14} /> {assignments.length} nhân sự</span>
                  <span className="inline-flex items-center gap-1"><Calendar size={14} /> {formatDate(selectedProject?.eventDate)}</span>
                  <span>{selectedProject?.customerUser.displayName ?? "-"}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setCreateDialogOpen(true)}>
                  <Plus size={14} /> Tạo nhân sự mới
                </Button>
                <Button variant="hero" size="sm" onClick={openAdd} disabled={!selectedProjectId || availableStaff.length === 0}>
                  <UserPlus size={14} /> Thêm nhân sự
                </Button>
              </div>
            </div>

            {contextLoading && (
              <p className="font-body text-sm text-muted-foreground mb-3">Đang cập nhật nhân sự dự án...</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">
              {assignments.map((assignment, index) => (
                <motion.div
                  key={assignment.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="rounded-xl border border-border bg-background p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center font-body font-bold text-secondary text-sm">
                        {assignment.staffUser.displayName?.[0] ?? "S"}
                      </div>
                      <div className="min-w-0">
                        <p className="font-body text-sm font-semibold text-foreground truncate">{assignment.staffUser.displayName}</p>
                        <p className="font-body text-xs text-muted-foreground truncate">
                          {assignment.staffUser.staffProfile?.jobTitle || assignment.staffUser.email || "-"}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(assignment)} className="text-muted-foreground hover:text-foreground" title="Sửa">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => deleteAssignment(assignment.id)} className="text-muted-foreground hover:text-destructive" title="Xóa">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2 font-body text-xs text-muted-foreground">
                    <p>Vai trò: <span className="font-semibold text-foreground">{assignment.roleText}</span></p>
                    <span className={`inline-flex rounded-full px-2 py-0.5 font-semibold ${assignmentStatusColors[assignment.status]}`}>
                      {assignmentStatusLabels[assignment.status]}
                    </span>
                    <div className="flex items-center gap-2"><Phone size={12} /> {assignment.staffUser.phone || "-"}</div>
                    <div className="flex items-center gap-2"><Mail size={12} /> {assignment.staffUser.email || "-"}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            {assignments.length === 0 && !contextLoading && (
              <div className="rounded-xl bg-surface-low p-6 font-body text-sm text-muted-foreground">
                Chưa có nhân sự trong dự án này. Bấm “Thêm nhân sự” để phân công nhân sự phù hợp.
              </div>
            )}
          </div>
        </div>
      )}

      {tab === "schedule" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-surface-lowest rounded-xl p-6 shadow-ambient overflow-x-auto">
          <h3 className="font-serif text-headline-md text-foreground mb-6">Lịch phân công</h3>
          <div className="space-y-3">
            {shifts.map((shift) => (
              <div key={shift.id} className="flex items-center justify-between bg-surface-low rounded-xl p-3">
                <div>
                  <p className="font-body text-sm text-foreground">{shift.staffUser?.displayName ?? "Nhân sự"} - {shift.event?.name ?? "Không gắn sự kiện"}</p>
                  <p className="font-body text-xs text-muted-foreground">{new Date(shift.workDate).toLocaleDateString("vi-VN")}</p>
                </div>
                <Button variant="outline" size="sm" className="rounded-xl"><Clock size={14} /> {shift.startTime}-{shift.endTime}</Button>
              </div>
            ))}
            {shifts.length === 0 && <p className="font-body text-sm text-muted-foreground">Chưa có ca trực nào.</p>}
          </div>
        </motion.div>
      )}

      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-[450px] rounded-2xl border-foreground/30 bg-background p-6">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">Tạo nhân sự mới</DialogTitle>
            <DialogDescription className="sr-only">Biểu mẫu tạo tài khoản nhân sự mới trong hệ thống.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="font-body text-sm text-foreground mb-1 block">Họ và tên</label>
              <Input
                value={createForm.name}
                onChange={(e) => setCreateForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Nguyễn Văn A"
                className="rounded-xl border-none bg-surface-low"
              />
            </div>
            <div>
              <label className="font-body text-sm text-foreground mb-1 block">Vai trò</label>
              <Select value={createForm.jobTitle} onValueChange={(v) => setCreateForm((f) => ({ ...f, jobTitle: v }))}>
                <SelectTrigger className="rounded-xl border-none bg-surface-low">
                  <SelectValue placeholder="Chọn vai trò" />
                </SelectTrigger>
                <SelectContent>
                  {staffRoles.map((role) => (
                    <SelectItem key={role} value={role}>{role}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="font-body text-sm text-foreground mb-1 block">Số điện thoại</label>
              <Input
                value={createForm.phone}
                onChange={(e) => setCreateForm((f) => ({ ...f, phone: e.target.value }))}
                placeholder="0912345678"
                className="rounded-xl border-none bg-surface-low"
              />
            </div>
            <div>
              <label className="font-body text-sm text-foreground mb-1 block">Email</label>
              <Input
                type="email"
                value={createForm.email}
                onChange={(e) => setCreateForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="email@example.com"
                className="rounded-xl border-none bg-surface-low"
              />
            </div>
            <div>
              <label className="font-body text-sm text-foreground mb-1 block">Trạng thái</label>
              <Select value={createForm.employmentStatus} onValueChange={(v) => setCreateForm((f) => ({ ...f, employmentStatus: v }))}>
                <SelectTrigger className="rounded-xl border-none bg-surface-low">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Đang làm việc</SelectItem>
                  <SelectItem value="inactive">Nghỉ việc</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="pt-1">
            <Button variant="outline" className="rounded-lg" onClick={() => setCreateDialogOpen(false)} disabled={createSaving}>Hủy</Button>
            <Button variant="hero" className="rounded-full px-5" onClick={handleCreateStaff} disabled={createSaving}>
              {createSaving ? "Đang tạo..." : "Tạo"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif">{editingAssignment ? "Sửa nhân sự dự án" : "Thêm nhân sự dự án"}</DialogTitle>
            <DialogDescription className="sr-only">
              Biểu mẫu thêm hoặc chỉnh sửa nhân sự trong dự án đang chọn.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="font-body text-sm text-foreground mb-1 block">Nhân sự</label>
              <select
                value={form.staffUserId}
                disabled={!!editingAssignment}
                onChange={(event) => setForm((current) => ({ ...current, staffUserId: event.target.value }))}
                className="w-full rounded-xl bg-surface-low p-2.5 font-body text-sm text-foreground border-none disabled:opacity-60"
              >
                <option value="">Chọn nhân sự</option>
                {staffOptionsForDialog.map((person) => (
                  <option key={person.id} value={person.id}>
                    {person.displayName} - {person.staffProfile?.jobTitle || person.email}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-body text-sm text-foreground mb-1 block">Vai trò trong dự án</label>
              <Input
                value={form.roleText}
                onChange={(event) => setForm((current) => ({ ...current, roleText: event.target.value }))}
                placeholder="VD: Điều phối sảnh, lễ tân, âm thanh..."
                className="rounded-xl border-none bg-surface-low"
              />
            </div>

            {editingAssignment && (
              <div>
                <label className="font-body text-sm text-foreground mb-1 block">Trạng thái</label>
                <select
                  value={form.status}
                  onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as ProjectStaffAssignment["status"] }))}
                  className="w-full rounded-xl bg-surface-low p-2.5 font-body text-sm text-foreground border-none"
                >
                  <option value="invited">Đã mời</option>
                  <option value="confirmed">Đã xác nhận</option>
                  <option value="declined">Từ chối</option>
                </select>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>Hủy</Button>
            <Button variant="hero" onClick={saveAssignment} disabled={saving}>
              {saving ? "Đang lưu..." : editingAssignment ? "Lưu" : "Thêm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrganizerStaff;
