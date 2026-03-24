import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Calendar, Users, AlertCircle, MoreHorizontal, X, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

type Task = {
  id: string; title: string; description: string;
  priority: "Khẩn cấp" | "Cao" | "Trung bình" | "Thấp";
  assignee: string; dueDate: string; event: string;
};

type ColumnKey = "todo" | "inProgress" | "done";

const columnMeta: Record<ColumnKey, { title: string; color: string }> = {
  todo: { title: "Cần làm", color: "bg-muted" },
  inProgress: { title: "Đang thực hiện", color: "bg-primary/10" },
  done: { title: "Hoàn thành", color: "bg-secondary/10" },
};

const initialTasks: Record<ColumnKey, Task[]> = {
  todo: [
    { id: "t1", title: "Xác nhận venue GEM Center", description: "Liên hệ GEM Center xác nhận ngày và thanh toán đặt cọc.", priority: "Khẩn cấp", assignee: "Lan Nguyễn", dueDate: "25/03", event: "Tiệc cưới" },
    { id: "t2", title: "Gửi menu cho khách duyệt", description: "Gửi 3 options menu cho khách Hà duyệt.", priority: "Cao", assignee: "Đức Trần", dueDate: "27/03", event: "Tiệc cưới" },
    { id: "t3", title: "Liên hệ ban nhạc", description: "Liên hệ ban nhạc acoustic cho Gala Dinner.", priority: "Trung bình", assignee: "Hoa Phạm", dueDate: "30/03", event: "Gala Dinner" },
  ],
  inProgress: [
    { id: "t4", title: "Thiết kế layout sân khấu", description: "Thiết kế 2 options layout sân khấu.", priority: "Cao", assignee: "Minh Lê", dueDate: "26/03", event: "Tiệc cưới" },
    { id: "t5", title: "Đặt hoa trang trí", description: "Đặt hoa với Floral Dreams.", priority: "Trung bình", assignee: "Lan Nguyễn", dueDate: "01/04", event: "Khai trương" },
  ],
  done: [
    { id: "t6", title: "Ký hợp đồng khách hàng", description: "Ký hợp đồng với khách Hà.", priority: "Cao", assignee: "Đức Trần", dueDate: "19/03", event: "Tiệc cưới" },
    { id: "t7", title: "Thu đặt cọc 30%", description: "Thu 75tr đặt cọc.", priority: "Khẩn cấp", assignee: "Lan Nguyễn", dueDate: "20/03", event: "Tiệc cưới" },
  ],
};

const priorities: Task["priority"][] = ["Khẩn cấp", "Cao", "Trung bình", "Thấp"];
const assignees = ["Lan Nguyễn", "Đức Trần", "Hoa Phạm", "Minh Lê"];
const events = ["Tiệc cưới", "Gala Dinner", "Khai trương", "Hội nghị"];

const priorityColors: Record<string, string> = {
  "Khẩn cấp": "bg-destructive/10 text-destructive",
  "Cao": "bg-primary/10 text-primary",
  "Trung bình": "bg-muted text-muted-foreground",
  "Thấp": "bg-surface-high text-muted-foreground",
};

const emptyTask = { id: "", title: "", description: "", priority: "Trung bình" as Task["priority"], assignee: "", dueDate: "", event: "" };

const AdminProjects = () => {
  const [columns, setColumns] = useState(initialTasks);
  const [view, setView] = useState<"kanban" | "list">("kanban");
  const [createOpen, setCreateOpen] = useState(false);
  const [createColumn, setCreateColumn] = useState<ColumnKey>("todo");
  const [editTask, setEditTask] = useState<{ task: Task; column: ColumnKey } | null>(null);
  const [viewTask, setViewTask] = useState<{ task: Task; column: ColumnKey } | null>(null);
  const [formData, setFormData] = useState<Task>(emptyTask);

  const openCreate = (col: ColumnKey) => {
    setCreateColumn(col);
    setFormData({ ...emptyTask, id: `t${Date.now()}` });
    setCreateOpen(true);
  };

  const handleCreate = () => {
    if (!formData.title) { toast.error("Vui lòng nhập tiêu đề task"); return; }
    setColumns(prev => ({ ...prev, [createColumn]: [...prev[createColumn], formData] }));
    toast.success("Đã tạo task mới");
    setCreateOpen(false);
  };

  const handleEdit = () => {
    if (!editTask || !formData.title) return;
    setColumns(prev => ({ ...prev, [editTask.column]: prev[editTask.column].map(t => t.id === formData.id ? formData : t) }));
    toast.success("Đã cập nhật task");
    setEditTask(null);
  };

  const handleDelete = (taskId: string, col: ColumnKey) => {
    setColumns(prev => ({ ...prev, [col]: prev[col].filter(t => t.id !== taskId) }));
    toast.success("Đã xóa task");
  };

  const handleMove = (taskId: string, fromCol: ColumnKey, toCol: ColumnKey) => {
    const task = columns[fromCol].find(t => t.id === taskId);
    if (!task) return;
    setColumns(prev => ({
      ...prev,
      [fromCol]: prev[fromCol].filter(t => t.id !== taskId),
      [toCol]: [...prev[toCol], task],
    }));
    toast.success(`Đã chuyển task sang "${columnMeta[toCol].title}"`);
  };

  const TaskForm = () => (
    <div className="space-y-4">
      <div><label className="font-body text-sm text-foreground mb-1 block">Tiêu đề *</label>
        <Input value={formData.title} onChange={e => setFormData(p => ({ ...p, title: e.target.value }))} placeholder="Nhập tiêu đề task" className="rounded-xl bg-surface-lowest font-body border-none" />
      </div>
      <div><label className="font-body text-sm text-foreground mb-1 block">Mô tả</label>
        <Textarea value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} placeholder="Mô tả chi tiết" className="rounded-xl bg-surface-lowest font-body border-none" rows={3} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className="font-body text-sm text-foreground mb-1 block">Độ ưu tiên</label>
          <Select value={formData.priority} onValueChange={v => setFormData(p => ({ ...p, priority: v as Task["priority"] }))}>
            <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
            <SelectContent>{priorities.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div><label className="font-body text-sm text-foreground mb-1 block">Người phụ trách</label>
          <Select value={formData.assignee} onValueChange={v => setFormData(p => ({ ...p, assignee: v }))}>
            <SelectTrigger className="rounded-xl"><SelectValue placeholder="Chọn" /></SelectTrigger>
            <SelectContent>{assignees.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div><label className="font-body text-sm text-foreground mb-1 block">Ngày hết hạn</label>
          <Input value={formData.dueDate} onChange={e => setFormData(p => ({ ...p, dueDate: e.target.value }))} placeholder="dd/mm" className="rounded-xl bg-surface-lowest font-body border-none" />
        </div>
        <div><label className="font-body text-sm text-foreground mb-1 block">Sự kiện</label>
          <Select value={formData.event} onValueChange={v => setFormData(p => ({ ...p, event: v }))}>
            <SelectTrigger className="rounded-xl"><SelectValue placeholder="Chọn" /></SelectTrigger>
            <SelectContent>{events.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  const allTasks = (Object.keys(columns) as ColumnKey[]).flatMap(col => columns[col].map(t => ({ ...t, _col: col })));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-headline-lg text-foreground">Quản lý dự án</h1>
          <p className="font-body text-sm text-muted-foreground">Kanban board quản lý task sự kiện</p>
        </div>
        <div className="flex gap-3">
          <div className="flex gap-1 p-1 rounded-xl bg-surface-lowest">
            <button onClick={() => setView("kanban")} className={`px-3 py-1.5 rounded-lg font-body text-sm ${view === "kanban" ? "bg-background shadow-ambient" : "text-muted-foreground"}`}>Kanban</button>
            <button onClick={() => setView("list")} className={`px-3 py-1.5 rounded-lg font-body text-sm ${view === "list" ? "bg-background shadow-ambient" : "text-muted-foreground"}`}>Danh sách</button>
          </div>
          <Button variant="hero" size="sm" onClick={() => openCreate("todo")}><Plus size={16} /> Tạo task</Button>
        </div>
      </div>

      {view === "kanban" ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(Object.keys(columns) as ColumnKey[]).map((key, colIndex) => (
            <motion.div key={key} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: colIndex * 0.1 }}>
              <div className={`rounded-xl p-4 ${columnMeta[key].color}`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif font-semibold text-foreground flex items-center gap-2">
                    {columnMeta[key].title}
                    <span className="text-xs font-body bg-surface-lowest px-2 py-0.5 rounded-full text-muted-foreground">{columns[key].length}</span>
                  </h3>
                  <Plus size={16} className="text-muted-foreground cursor-pointer hover:text-foreground" onClick={() => openCreate(key)} />
                </div>
                <div className="space-y-3">
                  {columns[key].map((task, i) => (
                    <motion.div key={task.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: colIndex * 0.1 + i * 0.05 }}
                      className="bg-surface-lowest rounded-xl p-4 shadow-ambient hover:shadow-ambient-lg transition-shadow cursor-pointer group"
                      onClick={() => setViewTask({ task, column: key })}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-body font-semibold ${priorityColors[task.priority]}`}>{task.priority}</span>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}>
                            <button className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"><MoreHorizontal size={14} /></button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44">
                            <DropdownMenuItem onClick={e => { e.stopPropagation(); setEditTask({ task, column: key }); setFormData(task); }}>Chỉnh sửa</DropdownMenuItem>
                            {(Object.keys(columns) as ColumnKey[]).filter(c => c !== key).map(c => (
                              <DropdownMenuItem key={c} onClick={e => { e.stopPropagation(); handleMove(task.id, key, c); }}>→ {columnMeta[c].title}</DropdownMenuItem>
                            ))}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={e => { e.stopPropagation(); handleDelete(task.id, key); }} className="text-destructive">Xóa</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <h4 className="font-body text-sm font-semibold text-foreground mb-2">{task.title}</h4>
                      <p className="font-body text-xs text-primary mb-3">{task.event}</p>
                      <div className="flex items-center justify-between text-xs font-body text-muted-foreground">
                        <span className="flex items-center gap-1"><Users size={10} /> {task.assignee}</span>
                        <span className="flex items-center gap-1">
                          <Calendar size={10} /> {task.dueDate}
                          {task.priority === "Khẩn cấp" && <AlertCircle size={10} className="text-destructive" />}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-surface-lowest rounded-xl shadow-ambient overflow-hidden">
          <table className="w-full text-sm font-body">
            <thead>
              <tr className="bg-surface-low border-b border-border">
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Task</th>
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Sự kiện</th>
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Người phụ trách</th>
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Hạn</th>
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Ưu tiên</th>
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {allTasks.map(task => (
                <tr key={task.id} className="border-b border-border hover:bg-surface-low/50 cursor-pointer" onClick={() => setViewTask({ task, column: task._col })}>
                  <td className="py-3 px-4 font-semibold text-foreground">{task.title}</td>
                  <td className="py-3 px-4 text-primary">{task.event}</td>
                  <td className="py-3 px-4 text-muted-foreground">{task.assignee}</td>
                  <td className="py-3 px-4 text-muted-foreground">{task.dueDate}</td>
                  <td className="py-3 px-4"><span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${priorityColors[task.priority]}`}>{task.priority}</span></td>
                  <td className="py-3 px-4"><span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${columnMeta[task._col].color} text-foreground`}>{columnMeta[task._col].title}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}

      {/* View Task Dialog */}
      <Dialog open={!!viewTask} onOpenChange={() => setViewTask(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle className="font-serif">{viewTask?.task.title}</DialogTitle></DialogHeader>
          {viewTask && (
            <div className="space-y-3 font-body text-sm">
              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${priorityColors[viewTask.task.priority]}`}>{viewTask.task.priority}</span>
              {viewTask.task.description && <p className="text-muted-foreground">{viewTask.task.description}</p>}
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-muted-foreground">Sự kiện</p><p className="font-semibold text-primary">{viewTask.task.event}</p></div>
                <div><p className="text-muted-foreground">Người phụ trách</p><p className="font-semibold text-foreground">{viewTask.task.assignee}</p></div>
                <div><p className="text-muted-foreground">Hạn hoàn thành</p><p className="text-foreground">{viewTask.task.dueDate}</p></div>
                <div><p className="text-muted-foreground">Trạng thái</p><p className="text-foreground">{columnMeta[viewTask.column].title}</p></div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewTask(null)}>Đóng</Button>
            <Button variant="hero" onClick={() => { if (viewTask) { setEditTask(viewTask); setFormData(viewTask.task); setViewTask(null); } }}>Chỉnh sửa</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Task Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle className="font-serif">Tạo task mới - {columnMeta[createColumn].title}</DialogTitle></DialogHeader>
          <TaskForm />
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Hủy</Button>
            <Button variant="hero" onClick={handleCreate}>Tạo task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Task Dialog */}
      <Dialog open={!!editTask} onOpenChange={() => setEditTask(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle className="font-serif">Chỉnh sửa task</DialogTitle></DialogHeader>
          <TaskForm />
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditTask(null)}>Hủy</Button>
            <Button variant="hero" onClick={handleEdit}>Lưu</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProjects;
