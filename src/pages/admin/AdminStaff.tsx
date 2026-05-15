import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Plus,
  Phone,
  Mail,
  Calendar,
  MoreHorizontal,
  Edit2,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ApiException, apiClient } from "@/services/apiClient";
import { toast } from "sonner";

type Staff = {
  id: string;
  displayName: string;
  email: string;
  phone?: string | null;
  status: string;
  staffProfile?: {
    jobTitle?: string | null;
    employmentStatus?: string | null;
    fullName?: string | null;
    address?: string | null;
  };
  shifts?: {
    id: string;
    workDate: string;
    startTime: string;
    endTime: string;
    event?: { name: string } | null;
  }[];
};

type ScheduleItem = {
  id: string;
  workDate: string;
  startTime: string;
  endTime: string;
  staffUser: { displayName: string };
  event?: { name: string } | null;
};

const roles = [
  "Event Manager",
  "Điều phối viên",
  "Thiết kế",
  "Lễ tân",
  "Âm thanh & ánh sáng",
  "MC",
];
const emptyStaff = {
  name: "",
  jobTitle: "",
  phone: "",
  email: "",
  status: "active",
};

const staffStatusLabel = (status?: string | null) =>
  status === "inactive" ? "Tạm nghỉ" : "Sẵn sàng";

const getApiErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof ApiException) {
    return error.details?.[0]?.message || error.message || fallback;
  }
  return error instanceof Error ? error.message : fallback;
};

const isValidPhone = (value: string) => !value || /^0[3-9]\d{8}$/.test(value);

const AdminStaff = () => {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"list" | "schedule">("list");
  const [createOpen, setCreateOpen] = useState(false);
  const [editItem, setEditItem] = useState<Staff | null>(null);
  const [viewItem, setViewItem] = useState<Staff | null>(null);
  const [form, setForm] = useState(emptyStaff);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadStaff = async () => {
    setLoading(true);
    try {
      const data = await apiClient.get<Staff[]>("/admin/staff", {
        search,
        pageSize: 100,
      });
      setStaffList(data);
    } catch (error) {
      toast.error("Không tải được danh sách nhân sự");
    } finally {
      setLoading(false);
    }
  };

  const loadSchedule = async () => {
    try {
      const data = await apiClient.get<ScheduleItem[]>("/admin/staff/schedule");
      setSchedule(data);
    } catch (error) {
      toast.error("Không tải được lịch làm việc");
    }
  };

  useEffect(() => {
    void loadStaff();
  }, [search]);

  useEffect(() => {
    apiClient
      .get<ScheduleItem[]>("/admin/staff/schedule")
      .then(setSchedule)
      .catch(() => toast.error("Không tải được lịch làm việc"));
  }, []);

  const openCreate = () => {
    setForm(emptyStaff);
    setCreateOpen(true);
  };
  const openEdit = (staff: Staff) => {
    setForm({
      name: staff.displayName,
      jobTitle: staff.staffProfile?.jobTitle ?? "",
      phone: staff.phone ?? "",
      email: staff.email,
      status: staff.staffProfile?.employmentStatus ?? "active",
    });
    setEditItem(staff);
  };

  const handleCreate = async () => {
    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();
    const jobTitle = form.jobTitle.trim();
    const phone = form.phone.trim();

    if (!name || !email || !jobTitle) {
      toast.error("Vui lòng nhập tên, email và vai trò");
      return;
    }
    if (!isValidPhone(phone)) {
      toast.error(
        "Số điện thoại phải đúng định dạng Việt Nam, ví dụ 0901234567",
      );
      return;
    }

    try {
      setSaving(true);
      await apiClient.post("/admin/staff", {
        name,
        email,
        phone: phone || undefined,
        jobTitle,
        employmentStatus: form.status,
      });
      toast.success(`Đã thêm nhân viên ${name}`);
      setCreateOpen(false);
      setForm(emptyStaff);
      await loadStaff();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Thêm nhân viên thất bại"));
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async () => {
    if (!editItem) return;
    const name = form.name.trim();
    const phone = form.phone.trim();
    if (!name || !form.jobTitle.trim()) {
      toast.error("Vui lòng nhập tên và vai trò");
      return;
    }
    if (!isValidPhone(phone)) {
      toast.error(
        "Số điện thoại phải đúng định dạng Việt Nam, ví dụ 0901234567",
      );
      return;
    }

    try {
      setSaving(true);
      await apiClient.put(`/admin/staff/${editItem.id}`, {
        name,
        phone: phone || undefined,
        jobTitle: form.jobTitle.trim(),
        employmentStatus: form.status,
      });
      toast.success("Đã cập nhật thông tin nhân viên");
      setEditItem(null);
      await loadStaff();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Cập nhật nhân viên thất bại"));
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteStaff = async (staff: Staff) => {
    const confirmed = window.confirm(
      `Xóa nhân sự ${staff.displayName}? Nhân sự này sẽ được gỡ khỏi các dự án, ca trực và task đang phụ trách.`,
    );
    if (!confirmed) return;

    try {
      setSaving(true);
      await apiClient.del(`/admin/staff/${staff.id}`);
      toast.success(`Đã xóa nhân sự ${staff.displayName}`);
      if (editItem?.id === staff.id) setEditItem(null);
      if (viewItem?.id === staff.id) setViewItem(null);
      await Promise.all([loadStaff(), loadSchedule()]);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Xóa nhân sự thất bại"));
    } finally {
      setSaving(false);
    }
  };

  const renderStaffForm = (mode: "create" | "edit") => {
    const roleOptions =
      form.jobTitle && !roles.includes(form.jobTitle)
        ? [form.jobTitle, ...roles]
        : roles;

    return (
      <div className="space-y-4">
        <div>
          <label className="font-body text-sm text-foreground mb-2 block">
            Họ và tên *
          </label>
          <Input
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            placeholder="Nguyễn Văn A"
            className="h-10 rounded-full bg-surface-lowest px-4 font-body border-none"
          />
        </div>

        <div>
          <label className="font-body text-sm text-foreground mb-2 block">
            Vai trò *
          </label>
          <Select
            value={form.jobTitle}
            onValueChange={(v) => setForm((p) => ({ ...p, jobTitle: v }))}
          >
            <SelectTrigger className="h-10 rounded-full bg-surface-lowest px-4 font-body">
              <SelectValue placeholder="Chọn vai trò" />
            </SelectTrigger>
            <SelectContent>
              {roleOptions.map((role) => (
                <SelectItem key={role} value={role}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="font-body text-sm text-foreground mb-2 block">
              Số điện thoại
            </label>
            <Input
              value={form.phone}
              onChange={(e) =>
                setForm((p) => ({ ...p, phone: e.target.value }))
              }
              placeholder="0901234567"
              className="h-10 rounded-full bg-surface-lowest px-4 font-body border-none"
            />
          </div>
          <div>
            <label className="font-body text-sm text-foreground mb-2 block">
              Email *
            </label>
            <Input
              type="email"
              value={form.email}
              disabled={mode === "edit"}
              onChange={(e) =>
                setForm((p) => ({ ...p, email: e.target.value }))
              }
              placeholder="email@eternal.vn"
              className="h-10 rounded-full bg-surface-lowest px-4 font-body border-none"
            />
          </div>
        </div>

        <div>
          <label className="font-body text-sm text-foreground mb-2 block">
            Trạng thái
          </label>
          <Select
            value={form.status}
            onValueChange={(v) => setForm((p) => ({ ...p, status: v }))}
          >
            <SelectTrigger className="h-10 rounded-full bg-surface-lowest px-4 font-body">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Sẵn sàng</SelectItem>
              <SelectItem value="inactive">Tạm nghỉ</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-headline-lg text-foreground">
            Quản lý nhân sự
          </h1>
          <p className="font-body text-sm text-muted-foreground">
            {loading ? "Đang tải..." : `${staffList.length} nhân viên`}
          </p>
        </div>
        <div className="flex gap-3">
          <div className="flex gap-1 p-1 rounded-xl bg-surface-lowest">
            <button
              onClick={() => setTab("list")}
              className={`px-3 py-1.5 rounded-lg font-body text-sm ${tab === "list" ? "bg-background shadow-ambient" : "text-muted-foreground"}`}
            >
              Danh sách
            </button>
            <button
              onClick={() => setTab("schedule")}
              className={`px-3 py-1.5 rounded-lg font-body text-sm ${tab === "schedule" ? "bg-background shadow-ambient" : "text-muted-foreground"}`}
            >
              Lịch làm việc
            </button>
          </div>
          <Button variant="hero" size="sm" onClick={openCreate}>
            <Plus size={16} /> Thêm nhân viên
          </Button>
        </div>
      </div>

      {tab === "list" && (
        <>
          <div className="relative max-w-md">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm nhân viên..."
              className="pl-10 rounded-xl bg-surface-lowest font-body border-none"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {staffList.map((person, i) => (
              <motion.div
                key={person.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-surface-lowest rounded-xl p-5 shadow-ambient hover:shadow-ambient-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-body font-bold text-sm">
                      {person.displayName?.[0] ?? "S"}
                    </div>
                    <div>
                      <h3 className="font-body text-sm font-semibold text-foreground">
                        {person.displayName}
                      </h3>
                      <p className="font-body text-xs text-muted-foreground">
                        {person.staffProfile?.jobTitle ?? "-"}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`w-2.5 h-2.5 rounded-full mt-1 block ${person.status === "active" ? "bg-secondary" : "bg-primary"}`}
                  />
                </div>
                <div className="space-y-2 text-xs font-body text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <Phone size={12} /> {person.phone || "-"}
                  </p>
                  <p className="flex items-center gap-2">
                    <Mail size={12} /> {person.email}
                  </p>
                  <p>Trạng thái: {staffStatusLabel(person.status)}</p>
                  <p className="flex items-center gap-2">
                    <Calendar size={12} /> {person.shifts?.length ?? 0} ca gần
                    đây
                  </p>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs rounded-xl"
                    onClick={() => setViewItem(person)}
                  >
                    Xem chi tiết
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="h-8 w-8 rounded-xl"
                    onClick={() => handleDeleteStaff(person)}
                    disabled={saving}
                    title="Xóa nhân sự"
                  >
                    <Trash2 size={14} />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal size={14} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEdit(person)}>
                        <Edit2 size={12} className="mr-2" /> Chỉnh sửa
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {tab === "schedule" && (
        <div className="space-y-4">
          {schedule.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="bg-surface-lowest rounded-xl p-5 shadow-ambient"
            >
              <h3 className="font-serif font-semibold text-foreground mb-2 flex items-center gap-2">
                <Calendar size={16} className="text-primary" />{" "}
                {new Date(item.workDate).toLocaleDateString("vi-VN")}
              </h3>
              <p className="font-body text-sm text-foreground">
                {item.startTime} - {item.endTime}: {item.staffUser.displayName}
              </p>
              <p className="font-body text-xs text-muted-foreground">
                {item.event?.name ?? "Không gắn sự kiện"}
              </p>
            </motion.div>
          ))}
        </div>
      )}

      <Dialog open={!!viewItem} onOpenChange={() => setViewItem(null)}>
        <DialogContent className="sm:max-w-[450px] rounded-2xl border-foreground/30 bg-background p-6">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">
              Thông tin nhân viên
            </DialogTitle>
            <DialogDescription className="sr-only">
              Thông tin chi tiết của nhân viên.
            </DialogDescription>
          </DialogHeader>
          {viewItem && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-body font-bold text-2xl">
                  {viewItem.displayName?.[0] ?? "S"}
                </div>
                <div>
                  <h3 className="font-body text-lg font-semibold text-foreground">
                    {viewItem.displayName}
                  </h3>
                  <p className="font-body text-sm text-muted-foreground">
                    {viewItem.staffProfile?.jobTitle ?? "-"}
                  </p>
                </div>
              </div>
              <div className="space-y-2 text-sm font-body text-muted-foreground">
                <p className="flex items-center gap-2">
                  <Phone size={14} /> {viewItem.phone || "-"}
                </p>
                <p className="flex items-center gap-2">
                  <Mail size={14} /> {viewItem.email}
                </p>
                <p>Trạng thái: {staffStatusLabel(viewItem.status)}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewItem(null)}>
              Đóng
            </Button>
            {viewItem && (
              <Button
                variant="destructive"
                onClick={() => handleDeleteStaff(viewItem)}
                disabled={saving}
              >
                <Trash2 size={14} /> Xóa
              </Button>
            )}
            <Button
              variant="hero"
              onClick={() => {
                if (viewItem) {
                  openEdit(viewItem);
                  setViewItem(null);
                }
              }}
            >
              <Edit2 size={14} /> Chỉnh sửa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-[450px] rounded-2xl border-foreground/30 bg-background p-6">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">
              Thêm nhân viên mới
            </DialogTitle>
            <DialogDescription className="sr-only">
              Biểu mẫu thêm nhân viên mới.
            </DialogDescription>
          </DialogHeader>
          {renderStaffForm("create")}
          <DialogFooter className="pt-1">
            <Button
              variant="outline"
              className="rounded-lg"
              onClick={() => setCreateOpen(false)}
              disabled={saving}
            >
              Hủy
            </Button>
            <Button
              variant="hero"
              className="rounded-full px-5"
              onClick={handleCreate}
              disabled={saving}
            >
              {saving ? "Đang thêm..." : "Thêm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editItem} onOpenChange={() => setEditItem(null)}>
        <DialogContent className="sm:max-w-[450px] rounded-2xl border-foreground/30 bg-background p-6">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">
              Chỉnh sửa nhân viên
            </DialogTitle>
            <DialogDescription className="sr-only">
              Biểu mẫu chỉnh sửa thông tin nhân viên.
            </DialogDescription>
          </DialogHeader>
          {renderStaffForm("edit")}
          <DialogFooter className="pt-1">
            <Button
              variant="outline"
              className="rounded-lg"
              onClick={() => setEditItem(null)}
              disabled={saving}
            >
              Hủy
            </Button>
            <Button
              variant="hero"
              className="rounded-full px-5"
              onClick={handleEdit}
              disabled={saving}
            >
              {saving ? "Đang lưu..." : "Lưu"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminStaff;
