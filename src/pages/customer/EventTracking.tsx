import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, Circle, Clock, MessageSquare, FileText, CreditCard, ArrowLeft, Send, Upload, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { toast } from "sonner";

const milestones = [
  { id: 1, title: "Xác nhận yêu cầu", date: "15/03/2026", status: "done", desc: "Yêu cầu đã được tiếp nhận và xác nhận" },
  { id: 2, title: "Báo giá & Thống nhất", date: "17/03/2026", status: "done", desc: "Báo giá đã được gửi và xác nhận bởi khách hàng" },
  { id: 3, title: "Ký hợp đồng & Đặt cọc", date: "19/03/2026", status: "done", desc: "Hợp đồng đã ký, đặt cọc 30% đã thanh toán" },
  { id: 4, title: "Lên kế hoạch chi tiết", date: "22/03/2026", status: "current", desc: "Đang lập kế hoạch chi tiết cho sự kiện" },
  { id: 5, title: "Đặt venue & Nhà cung cấp", date: "01/04/2026", status: "pending", desc: "Liên hệ và xác nhận venue, catering, décor" },
  { id: 6, title: "Tổng duyệt", date: "12/05/2026", status: "pending", desc: "Tổng duyệt toàn bộ chương trình" },
  { id: 7, title: "Ngày sự kiện", date: "15/05/2026", status: "pending", desc: "Ngày diễn ra sự kiện chính thức" },
];

type Message = { id: number; sender: string; role: string; text: string; time: string; isManager: boolean; };

const initialMessages: Message[] = [
  { id: 1, sender: "Nguyễn Thị Lan", role: "Event Manager", text: "Chào chị Hà, em đã gửi 3 options cho venue, chị xem giúp em nhé!", time: "10:30 AM", isManager: true },
  { id: 2, sender: "Bạn", role: "", text: "Em ơi, chị thích option 2 - GEM Center nhé. Nhưng cần hỏi thêm về sức chứa.", time: "11:15 AM", isManager: false },
  { id: 3, sender: "Nguyễn Thị Lan", role: "Event Manager", text: "Dạ, GEM Center chứa tối đa 350 khách, phù hợp với yêu cầu 300 khách của chị ạ. Em sẽ liên hệ đặt ngay.", time: "11:45 AM", isManager: true },
];

const documents = [
  { name: "Hợp đồng tổ chức sự kiện v1.0", type: "PDF", date: "19/03/2026", status: "Đã ký" },
  { name: "Báo giá chi tiết", type: "PDF", date: "17/03/2026", status: "Đã xác nhận" },
  { name: "Layout sân khấu - Option 2", type: "PNG", date: "22/03/2026", status: "Chờ duyệt" },
  { name: "Menu tiệc cưới", type: "PDF", date: "22/03/2026", status: "Chờ duyệt" },
];

const EventTracking = () => {
  const { id } = useParams();
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [activeTab, setActiveTab] = useState<"timeline" | "chat" | "documents" | "payment">("timeline");

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
    setMessages(prev => [...prev, {
      id: Date.now(),
      sender: "Bạn",
      role: "",
      text: newMessage,
      time: timeStr,
      isManager: false,
    }]);
    setNewMessage("");

    // Simulate manager reply
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now(),
        sender: "Nguyễn Thị Lan",
        role: "Event Manager",
        text: "Dạ em đã nhận được tin nhắn của chị. Em sẽ kiểm tra và phản hồi sớm nhất ạ! 🌸",
        time: `${now.getHours().toString().padStart(2, "0")}:${(now.getMinutes() + 1).toString().padStart(2, "0")}`,
        isManager: true,
      }]);
    }, 2000);
  };

  const handleUpload = () => {
    toast.success("Đã tải lên tài liệu thành công (mock)");
  };

  const handleDownload = (name: string) => {
    toast.success(`Đang tải "${name}"...`);
  };

  const handleApproveDoc = (name: string) => {
    toast.success(`Đã duyệt tài liệu "${name}"`);
  };

  const handlePayment = () => {
    toast.success("Đã chuyển đến trang thanh toán (mock). Thanh toán thành công!");
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Link to="/dashboard/su-kien" className="flex items-center gap-2 text-muted-foreground font-body text-sm mb-4 hover:text-primary transition-colors">
            <ArrowLeft size={16} /> Quay lại danh sách
          </Link>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="font-serif text-display-sm text-foreground">Tiệc cưới Minh & Hà</h1>
              <p className="font-body text-muted-foreground mt-1">Tiệc cưới • 15/05/2026 • GEM Center, Q.1, TP.HCM</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-4 py-2 rounded-full bg-secondary/10 text-secondary font-body text-sm font-semibold">Đang chuẩn bị</span>
              <span className="font-serif text-headline-md text-primary font-bold">65%</span>
            </div>
          </div>
          <Progress value={65} className="h-2 mt-4" />
        </motion.div>

        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {[
            { key: "timeline" as const, label: "Timeline", icon: Clock },
            { key: "chat" as const, label: "Trao đổi", icon: MessageSquare },
            { key: "documents" as const, label: "Tài liệu", icon: FileText },
            { key: "payment" as const, label: "Thanh toán", icon: CreditCard },
          ].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-body text-sm whitespace-nowrap transition-all ${activeTab === tab.key ? "gradient-primary text-primary-foreground" : "bg-surface-lowest text-muted-foreground hover:text-foreground"}`}
            >
              <tab.icon size={16} /> {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "timeline" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl">
            <div className="relative">
              <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-border" />
              {milestones.map((milestone, i) => (
                <motion.div key={milestone.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="relative flex items-start gap-6 mb-8">
                  <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${milestone.status === "done" ? "bg-secondary text-secondary-foreground" : milestone.status === "current" ? "gradient-primary text-primary-foreground animate-pulse" : "bg-surface-high text-muted-foreground"}`}>
                    {milestone.status === "done" ? <CheckCircle size={18} /> : milestone.status === "current" ? <Clock size={18} /> : <Circle size={18} />}
                  </div>
                  <div className={`bg-surface-lowest rounded-xl p-5 shadow-ambient flex-1 ${milestone.status === "current" ? "ring-2 ring-primary/20" : ""}`}>
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-serif text-foreground font-semibold">{milestone.title}</h3>
                      <span className="font-body text-xs text-muted-foreground">{milestone.date}</span>
                    </div>
                    <p className="font-body text-sm text-muted-foreground">{milestone.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === "chat" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl">
            <div className="bg-surface-lowest rounded-xl shadow-ambient overflow-hidden">
              <div className="p-4 bg-surface-low">
                <h3 className="font-serif text-foreground font-semibold">Trao đổi với Event Manager</h3>
                <p className="font-body text-sm text-muted-foreground">Nguyễn Thị Lan - Event Manager</p>
              </div>
              <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
                {messages.map(msg => (
                  <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex ${msg.isManager ? "justify-start" : "justify-end"}`}>
                    <div className={`max-w-[80%] rounded-xl p-4 ${msg.isManager ? "bg-surface-low" : "gradient-primary text-primary-foreground"}`}>
                      {msg.isManager && <p className="font-body text-xs text-primary font-semibold mb-1">{msg.sender}</p>}
                      <p className="font-body text-sm">{msg.text}</p>
                      <p className={`font-body text-xs mt-2 ${msg.isManager ? "text-muted-foreground" : "text-primary-foreground/70"}`}>{msg.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="p-4 bg-surface-low flex gap-3">
                <Input
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") handleSendMessage(); }}
                  placeholder="Nhập tin nhắn..."
                  className="flex-1 rounded-xl bg-surface-lowest font-body border-none"
                />
                <Button variant="ghost" size="icon" onClick={handleUpload}><Upload size={18} /></Button>
                <Button variant="hero" size="icon" onClick={handleSendMessage} disabled={!newMessage.trim()}><Send size={18} /></Button>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "documents" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl space-y-4">
            {documents.map((doc, i) => (
              <div key={i} className="flex items-center justify-between bg-surface-lowest rounded-xl p-5 shadow-ambient">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-surface-low flex items-center justify-center">
                    <FileText size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-body text-sm font-semibold text-foreground">{doc.name}</p>
                    <p className="font-body text-xs text-muted-foreground">{doc.type} • {doc.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-body font-semibold ${
                    doc.status === "Đã ký" || doc.status === "Đã xác nhận" ? "bg-secondary/10 text-secondary" : "bg-primary/10 text-primary"
                  }`}>{doc.status}</span>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDownload(doc.name)}><Download size={14} /></Button>
                  {doc.status === "Chờ duyệt" && (
                    <Button variant="hero" size="sm" onClick={() => handleApproveDoc(doc.name)}>Duyệt</Button>
                  )}
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full rounded-xl" onClick={handleUpload}>
              <Upload size={16} className="mr-2" /> Upload tài liệu bổ sung
            </Button>
          </motion.div>
        )}

        {activeTab === "payment" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-surface-lowest rounded-xl p-5 shadow-ambient text-center">
                <p className="font-body text-sm text-muted-foreground">Tổng giá trị</p>
                <p className="font-serif text-headline-lg text-foreground mt-1">250,000,000đ</p>
              </div>
              <div className="bg-surface-lowest rounded-xl p-5 shadow-ambient text-center">
                <p className="font-body text-sm text-muted-foreground">Đã thanh toán</p>
                <p className="font-serif text-headline-lg text-secondary mt-1">75,000,000đ</p>
              </div>
              <div className="bg-surface-lowest rounded-xl p-5 shadow-ambient text-center">
                <p className="font-body text-sm text-muted-foreground">Còn lại</p>
                <p className="font-serif text-headline-lg text-primary mt-1">175,000,000đ</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-serif text-headline-md text-foreground">Lịch sử giao dịch</h3>
              {[
                { desc: "Đặt cọc 30%", amount: "75,000,000đ", date: "19/03/2026", method: "VNPay", status: "Thành công" },
                { desc: "Thanh toán đợt 2 (40%)", amount: "100,000,000đ", date: "01/05/2026", method: "—", status: "Chưa thanh toán" },
                { desc: "Thanh toán cuối (30%)", amount: "75,000,000đ", date: "20/05/2026", method: "—", status: "Chưa thanh toán" },
              ].map((tx, i) => (
                <div key={i} className="flex items-center justify-between bg-surface-lowest rounded-xl p-5 shadow-ambient">
                  <div>
                    <p className="font-body text-sm font-semibold text-foreground">{tx.desc}</p>
                    <p className="font-body text-xs text-muted-foreground">{tx.date} • {tx.method}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-serif font-semibold text-foreground">{tx.amount}</p>
                    <span className={`text-xs font-body font-semibold ${tx.status === "Thành công" ? "text-secondary" : "text-muted-foreground"}`}>{tx.status}</span>
                  </div>
                </div>
              ))}
            </div>

            <Button variant="hero" className="w-full" onClick={handlePayment}>
              Thanh toán đợt tiếp theo <CreditCard size={16} />
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default EventTracking;
