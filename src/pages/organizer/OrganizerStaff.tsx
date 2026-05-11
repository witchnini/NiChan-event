import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Phone, Mail, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/services/apiClient";
import { toast } from "sonner";

type Staff = {
  id: string;
  displayName: string;
  email: string;
  phone?: string | null;
  staffProfile?: { jobTitle?: string | null; employmentStatus?: string | null };
};

type Shift = {
  id: string;
  workDate: string;
  startTime: string;
  endTime: string;
  staffUser?: { displayName: string } | null;
  event?: { name: string } | null;
};

const OrganizerStaff = () => {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [tab, setTab] = useState<"list" | "schedule">("list");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [staffList, shiftList] = await Promise.all([
          apiClient.get<Staff[]>("/organizer/staff"),
          apiClient.get<Shift[]>("/organizer/staff/shifts"),
        ]);
        setStaff(staffList);
        setShifts(shiftList);
      } catch (error) {
        toast.error("Khong tai duoc du lieu nhan su");
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  const statusColor = (status?: string | null) => status === "active" ? "bg-secondary/10 text-secondary" : "bg-muted text-muted-foreground";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-headline-lg text-foreground">Quan ly nhan su</h1>
          <p className="font-body text-sm text-muted-foreground">{loading ? "Dang tai..." : "Du lieu nhan su doc tu backend"}</p>
        </div>
        <div className="flex p-1 rounded-xl bg-surface-low">
          <button onClick={() => setTab("list")} className={`px-4 py-2 rounded-lg font-body text-sm transition-all ${tab === "list" ? "bg-background shadow-ambient text-foreground font-semibold" : "text-muted-foreground"}`}>Danh sach</button>
          <button onClick={() => setTab("schedule")} className={`px-4 py-2 rounded-lg font-body text-sm transition-all ${tab === "schedule" ? "bg-background shadow-ambient text-foreground font-semibold" : "text-muted-foreground"}`}>Ca truc</button>
        </div>
      </div>

      {tab === "list" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {staff.map((person, i) => (
            <motion.div key={person.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-surface-lowest rounded-xl p-5 shadow-ambient hover:shadow-ambient-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center font-body font-bold text-secondary text-sm">{person.displayName?.[0] ?? "S"}</div>
                  <div>
                    <p className="font-body text-sm font-semibold text-foreground">{person.displayName}</p>
                    <p className="font-body text-xs text-muted-foreground">{person.staffProfile?.jobTitle ?? "-"}</p>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-body font-semibold ${statusColor(person.staffProfile?.employmentStatus)}`}>{person.staffProfile?.employmentStatus ?? "unknown"}</span>
              </div>
              <div className="space-y-2 text-xs font-body text-muted-foreground">
                <div className="flex items-center gap-2"><Phone size={12} /> {person.phone || "-"}</div>
                <div className="flex items-center gap-2"><Mail size={12} /> {person.email}</div>
                <div className="flex items-center gap-2"><Calendar size={12} /> Phan cong qua tung su kien</div>
              </div>
            </motion.div>
          ))}
          {staff.length === 0 && !loading && <p className="font-body text-sm text-muted-foreground">Chua co nhan su kha dung.</p>}
        </div>
      )}

      {tab === "schedule" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-surface-lowest rounded-xl p-6 shadow-ambient overflow-x-auto">
          <h3 className="font-serif text-headline-md text-foreground mb-6">Lich phan cong</h3>
          <div className="space-y-3">
            {shifts.map(shift => (
              <div key={shift.id} className="flex items-center justify-between bg-surface-low rounded-xl p-3">
                <div>
                  <p className="font-body text-sm text-foreground">{shift.staffUser?.displayName ?? "Nhan su"} - {shift.event?.name ?? "Khong gan su kien"}</p>
                  <p className="font-body text-xs text-muted-foreground">{new Date(shift.workDate).toLocaleDateString("vi-VN")}</p>
                </div>
                <Button variant="outline" size="sm" className="rounded-xl"><Clock size={14} /> {shift.startTime}-{shift.endTime}</Button>
              </div>
            ))}
            {shifts.length === 0 && <p className="font-body text-sm text-muted-foreground">Chua co ca truc nao.</p>}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default OrganizerStaff;
