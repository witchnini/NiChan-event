import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, FileText, CreditCard, MessageSquare, Clock, CheckCircle, AlertCircle, ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const myEvents = [
  { id: 1, name: "Tiệc cưới Minh & Hà", type: "Tiệc cưới", date: "2026-05-15", status: "Đang chuẩn bị", progress: 65, manager: "Nguyễn Thị Lan" },
  { id: 2, name: "Khai trương Chi nhánh 3", type: "Khai trương", date: "2026-04-20", status: "Đã báo giá", progress: 25, manager: "Trần Văn Đức" },
];

const recentActivities = [
  { text: "Báo giá cho 'Khai trương Chi nhánh 3' đã được gửi", time: "2 giờ trước", icon: FileText },
  { text: "Task 'Đặt venue' đã hoàn thành cho tiệc cưới", time: "1 ngày trước", icon: CheckCircle },
  { text: "Thanh toán đặt cọc 30% đã xác nhận", time: "3 ngày trước", icon: CreditCard },
  { text: "Tin nhắn mới từ Event Manager Lan", time: "5 ngày trước", icon: MessageSquare },
];

const CustomerDashboard = () => {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-6">
        {/* Welcome */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <h1 className="font-serif text-display-sm text-foreground mb-2">Xin chào, <span className="text-primary">Nguyễn Thanh Hà</span></h1>
          <p className="font-body text-muted-foreground">Quản lý sự kiện và theo dõi tiến độ của bạn.</p>
        </motion.div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Sự kiện", value: "2", icon: Calendar, color: "text-primary" },
            { label: "Đang chuẩn bị", value: "1", icon: Clock, color: "text-secondary" },
            { label: "Hợp đồng", value: "1", icon: FileText, color: "text-primary" },
            { label: "Thanh toán", value: "45tr", icon: CreditCard, color: "text-secondary" },
          ].map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-surface-lowest rounded-xl p-5 shadow-ambient">
              <stat.icon size={20} className={stat.color} />
              <p className="font-serif text-headline-lg text-foreground mt-3">{stat.value}</p>
              <p className="font-body text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* My Events */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-headline-md text-foreground">Sự kiện của tôi</h2>
              <Link to="/dashboard/su-kien">
                <Button variant="tertiary" size="sm">Xem tất cả</Button>
              </Link>
            </div>

            {myEvents.map((event, i) => (
              <motion.div key={event.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.1 }}>
                <Link to={`/dashboard/su-kien/${event.id}`} className="block bg-surface-lowest rounded-xl p-6 shadow-ambient hover:shadow-ambient-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-serif text-headline-md text-foreground">{event.name}</h3>
                      <p className="font-body text-sm text-muted-foreground mt-1">{event.type} • {event.date}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-body font-semibold ${
                      event.status === "Đang chuẩn bị" ? "bg-secondary/10 text-secondary" : "bg-primary/10 text-primary"
                    }`}>
                      {event.status}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm font-body">
                      <span className="text-muted-foreground">Tiến độ</span>
                      <span className="text-foreground font-semibold">{event.progress}%</span>
                    </div>
                    <Progress value={event.progress} className="h-2" />
                  </div>
                  <p className="font-body text-sm text-muted-foreground mt-3">Event Manager: {event.manager}</p>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Recent Activity */}
          <div>
            <h2 className="font-serif text-headline-md text-foreground mb-6">Hoạt động gần đây</h2>
            <div className="bg-surface-lowest rounded-xl p-6 shadow-ambient space-y-5">
              {recentActivities.map((activity, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-surface-low flex items-center justify-center shrink-0">
                    <activity.icon size={14} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-body text-sm text-foreground">{activity.text}</p>
                    <p className="font-body text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick actions */}
            <div className="mt-6 space-y-3">
              <Link to="/lien-he">
                <Button variant="hero" className="w-full">
                  Gửi yêu cầu mới <ArrowRight size={16} />
                </Button>
              </Link>
              <Link to="/dashboard/hop-dong">
                <Button variant="outline" className="w-full">
                  Xem hợp đồng
                </Button>
              </Link>
              <Link to="/dashboard/danh-gia">
                <Button variant="outline" className="w-full">
                  <Star size={16} /> Đánh giá sự kiện
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
