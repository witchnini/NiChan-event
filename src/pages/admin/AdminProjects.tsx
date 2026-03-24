import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Calendar, Users, AlertCircle, GripVertical, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

type Task = {
  id: string;
  title: string;
  priority: "Khẩn cấp" | "Cao" | "Trung bình" | "Thấp";
  assignee: string;
  dueDate: string;
  event: string;
};

const initialColumns: Record<string, { title: string; color: string; tasks: Task[] }> = {
  todo: {
    title: "Cần làm",
    color: "bg-muted",
    tasks: [
      { id: "t1", title: "Xác nhận venue GEM Center", priority: "Khẩn cấp", assignee: "Lan Nguyễn", dueDate: "25/03", event: "Tiệc cưới" },
      { id: "t2", title: "Gửi menu cho khách duyệt", priority: "Cao", assignee: "Đức Trần", dueDate: "27/03", event: "Tiệc cưới" },
      { id: "t3", title: "Liên hệ ban nhạc", priority: "Trung bình", assignee: "Hoa Phạm", dueDate: "30/03", event: "Gala Dinner" },
    ],
  },
  inProgress: {
    title: "Đang thực hiện",
    color: "bg-primary/10",
    tasks: [
      { id: "t4", title: "Thiết kế layout sân khấu", priority: "Cao", assignee: "Minh Lê", dueDate: "26/03", event: "Tiệc cưới" },
      { id: "t5", title: "Đặt hoa trang trí", priority: "Trung bình", assignee: "Lan Nguyễn", dueDate: "01/04", event: "Khai trương" },
    ],
  },
  done: {
    title: "Hoàn thành",
    color: "bg-secondary/10",
    tasks: [
      { id: "t6", title: "Ký hợp đồng khách hàng", priority: "Cao", assignee: "Đức Trần", dueDate: "19/03", event: "Tiệc cưới" },
      { id: "t7", title: "Thu đặt cọc 30%", priority: "Khẩn cấp", assignee: "Lan Nguyễn", dueDate: "20/03", event: "Tiệc cưới" },
    ],
  },
};

const priorityColors: Record<string, string> = {
  "Khẩn cấp": "bg-destructive/10 text-destructive",
  "Cao": "bg-primary/10 text-primary",
  "Trung bình": "bg-muted text-muted-foreground",
  "Thấp": "bg-surface-high text-muted-foreground",
};

const AdminProjects = () => {
  const [columns] = useState(initialColumns);
  const [view, setView] = useState<"kanban" | "list">("kanban");

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
          <Button variant="hero" size="sm">
            <Plus size={16} /> Tạo task
          </Button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(columns).map(([key, column], colIndex) => (
          <motion.div key={key} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: colIndex * 0.1 }}>
            <div className={`rounded-xl p-4 ${column.color}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif font-semibold text-foreground flex items-center gap-2">
                  {column.title}
                  <span className="text-xs font-body bg-surface-lowest px-2 py-0.5 rounded-full text-muted-foreground">{column.tasks.length}</span>
                </h3>
                <Plus size={16} className="text-muted-foreground cursor-pointer hover:text-foreground" />
              </div>

              <div className="space-y-3">
                {column.tasks.map((task, i) => (
                  <motion.div key={task.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: colIndex * 0.1 + i * 0.05 }}
                    className="bg-surface-lowest rounded-xl p-4 shadow-ambient hover:shadow-ambient-lg transition-shadow cursor-pointer group"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-body font-semibold ${priorityColors[task.priority]}`}>{task.priority}</span>
                      <MoreHorizontal size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
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
    </div>
  );
};

export default AdminProjects;
