import { motion } from "framer-motion";
import { KanbanSquare, ShieldAlert } from "lucide-react";

const AdminProjects = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-headline-lg text-foreground">Quan ly du an</h1>
        <p className="font-body text-sm text-muted-foreground mt-1">
          Man admin project khong con hien mock Kanban. Backend hien chi co module project/task cho organizer.
        </p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-surface-lowest rounded-xl p-8 shadow-ambient">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <KanbanSquare size={26} />
          </div>
          <div>
            <h2 className="font-serif text-headline-md text-foreground">Chua co API admin project rieng</h2>
            <p className="font-body text-sm text-muted-foreground max-w-xl mt-2">
              De tranh hien du lieu gia, trang nay dang o trang thai trong. Neu can bang Kanban cap admin,
              backend can them endpoint nhu /api/admin/projects va /api/admin/projects/:id/kanban.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-xl bg-surface-low px-4 py-2 font-body text-sm text-muted-foreground">
            <ShieldAlert size={16} /> Da go mock task/assignee/event khoi giao dien nay
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminProjects;
