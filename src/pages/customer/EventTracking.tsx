import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, Circle, Clock, MessageSquare, FileText, CreditCard, ArrowLeft, Send, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { apiClient } from "@/services/apiClient";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

type EventDetail = {
  id: string;
  name: string;
  type: string;
  eventDate?: string | null;
  locationText?: string | null;
  status: string;
  progressPercent?: number | null;
  budgetEstimated?: string | number | null;
  organizerUser?: { displayName: string } | null;
};

type Milestone = { id: string; title: string; dueDate?: string | null; status: string; description?: string | null };
type Message = { id: string; senderUserId: string; sender?: { displayName: string } | null; messageText: string; sentAt: string };
type DocumentItem = { id: string; name?: string; fileName?: string; fileType?: string; createdAt: string; status?: string; event?: { id: string; name: string } };
type Transaction = { id: string; description: string; amount: string | number; transactionDate: string; paymentMethod?: string | null; status: string; event?: { id: string } };

const EventTracking = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [activeTab, setActiveTab] = useState<"timeline" | "chat" | "documents" | "payment">("timeline");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const [eventDetail, eventMilestones, chatMessages, docs, txs] = await Promise.all([
        apiClient.get<EventDetail>(`/customer/events/${id}`),
        apiClient.get<Milestone[]>(`/customer/events/${id}/milestones`),
        apiClient.get<Message[]>(`/customer/events/${id}/chat-messages`),
        apiClient.get<DocumentItem[]>("/customer/documents"),
        apiClient.get<Transaction[]>("/customer/transactions"),
      ]);
      setEvent(eventDetail);
      setMilestones(eventMilestones);
      setMessages(chatMessages);
      setDocuments(docs.filter(doc => !doc.event || doc.event.id === id));
      setTransactions(txs.filter(tx => !tx.event || tx.event.id === id));
    } catch (error) {
      toast.error("Khong tai duoc chi tiet su kien");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [id]);

  const totals = useMemo(() => {
    const paid = transactions.filter(tx => tx.status === "completed").reduce((sum, tx) => sum + Number(tx.amount || 0), 0);
    const total = Number(event?.budgetEstimated || 0);
    return { total, paid, remaining: Math.max(total - paid, 0) };
  }, [event, transactions]);

  const handleSendMessage = async () => {
    if (!id || !newMessage.trim()) return;
    try {
      await apiClient.post(`/customer/events/${id}/chat-messages`, { message: newMessage });
      setNewMessage("");
      await load();
    } catch (error) {
      toast.error("Gui tin nhan that bai");
    }
  };

  const handleDownload = (name: string) => {
    toast.success(`Dang tai "${name}"...`);
  };

  const money = (value: number) => value.toLocaleString("vi-VN") + "d";

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Link to="/dashboard/su-kien" className="flex items-center gap-2 text-muted-foreground font-body text-sm mb-4 hover:text-primary transition-colors">
            <ArrowLeft size={16} /> Quay lai danh sach
          </Link>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="font-serif text-display-sm text-foreground">{event?.name ?? (loading ? "Dang tai..." : "Khong tim thay su kien")}</h1>
              <p className="font-body text-muted-foreground mt-1">{event?.type ?? "-"} - {event?.eventDate ? new Date(event.eventDate).toLocaleDateString("vi-VN") : "-"} - {event?.locationText || "-"}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-4 py-2 rounded-full bg-secondary/10 text-secondary font-body text-sm font-semibold">{event?.status ?? "-"}</span>
              <span className="font-serif text-headline-md text-primary font-bold">{event?.progressPercent ?? 0}%</span>
            </div>
          </div>
          <Progress value={event?.progressPercent ?? 0} className="h-2 mt-4" />
        </motion.div>

        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {[
            { key: "timeline" as const, label: "Timeline", icon: Clock },
            { key: "chat" as const, label: "Trao doi", icon: MessageSquare },
            { key: "documents" as const, label: "Tai lieu", icon: FileText },
            { key: "payment" as const, label: "Thanh toan", icon: CreditCard },
          ].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-body text-sm whitespace-nowrap transition-all ${activeTab === tab.key ? "gradient-primary text-primary-foreground" : "bg-surface-lowest text-muted-foreground hover:text-foreground"}`}>
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
                  <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${milestone.status === "done" || milestone.status === "completed" ? "bg-secondary text-secondary-foreground" : milestone.status === "current" ? "gradient-primary text-primary-foreground animate-pulse" : "bg-surface-high text-muted-foreground"}`}>
                    {milestone.status === "done" || milestone.status === "completed" ? <CheckCircle size={18} /> : milestone.status === "current" ? <Clock size={18} /> : <Circle size={18} />}
                  </div>
                  <div className="bg-surface-lowest rounded-xl p-5 shadow-ambient flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-serif text-foreground font-semibold">{milestone.title}</h3>
                      <span className="font-body text-xs text-muted-foreground">{milestone.dueDate ? new Date(milestone.dueDate).toLocaleDateString("vi-VN") : "-"}</span>
                    </div>
                    <p className="font-body text-sm text-muted-foreground">{milestone.description || milestone.status}</p>
                  </div>
                </motion.div>
              ))}
              {milestones.length === 0 && <p className="font-body text-sm text-muted-foreground">Chua co milestone cho su kien nay.</p>}
            </div>
          </motion.div>
        )}

        {activeTab === "chat" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl">
            <div className="bg-surface-lowest rounded-xl shadow-ambient overflow-hidden">
              <div className="p-4 bg-surface-low">
                <h3 className="font-serif text-foreground font-semibold">Trao doi voi Event Manager</h3>
                <p className="font-body text-sm text-muted-foreground">{event?.organizerUser?.displayName ?? "Chua phan cong"}</p>
              </div>
              <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
                {messages.map(msg => {
                  const isMine = msg.senderUserId === user?.userId;
                  return (
                    <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[80%] rounded-xl p-4 ${isMine ? "gradient-primary text-primary-foreground" : "bg-surface-low"}`}>
                        {!isMine && <p className="font-body text-xs text-primary font-semibold mb-1">{msg.sender?.displayName ?? "Manager"}</p>}
                        <p className="font-body text-sm">{msg.messageText}</p>
                        <p className={`font-body text-xs mt-2 ${isMine ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{new Date(msg.sentAt).toLocaleString("vi-VN")}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
              <div className="p-4 bg-surface-low flex gap-3">
                <Input value={newMessage} onChange={e => setNewMessage(e.target.value)} onKeyDown={e => { if (e.key === "Enter") void handleSendMessage(); }} placeholder="Nhap tin nhan..." className="flex-1 rounded-xl bg-surface-lowest font-body border-none" />
                <Button variant="hero" size="icon" onClick={handleSendMessage} disabled={!newMessage.trim()}><Send size={18} /></Button>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "documents" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl space-y-4">
            {documents.map(doc => {
              const name = doc.name || doc.fileName || "Tai lieu";
              return (
                <div key={doc.id} className="flex items-center justify-between bg-surface-lowest rounded-xl p-5 shadow-ambient">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-surface-low flex items-center justify-center"><FileText size={18} className="text-primary" /></div>
                    <div>
                      <p className="font-body text-sm font-semibold text-foreground">{name}</p>
                      <p className="font-body text-xs text-muted-foreground">{doc.fileType || "FILE"} - {new Date(doc.createdAt).toLocaleDateString("vi-VN")}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDownload(name)}><Download size={14} /></Button>
                </div>
              );
            })}
            {documents.length === 0 && <p className="font-body text-sm text-muted-foreground">Chua co tai lieu cho su kien nay.</p>}
          </motion.div>
        )}

        {activeTab === "payment" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-surface-lowest rounded-xl p-5 shadow-ambient text-center"><p className="font-body text-sm text-muted-foreground">Tong gia tri</p><p className="font-serif text-headline-lg text-foreground mt-1">{money(totals.total)}</p></div>
              <div className="bg-surface-lowest rounded-xl p-5 shadow-ambient text-center"><p className="font-body text-sm text-muted-foreground">Da thanh toan</p><p className="font-serif text-headline-lg text-secondary mt-1">{money(totals.paid)}</p></div>
              <div className="bg-surface-lowest rounded-xl p-5 shadow-ambient text-center"><p className="font-body text-sm text-muted-foreground">Con lai</p><p className="font-serif text-headline-lg text-primary mt-1">{money(totals.remaining)}</p></div>
            </div>
            <div className="space-y-4">
              <h3 className="font-serif text-headline-md text-foreground">Lich su giao dich</h3>
              {transactions.map(tx => (
                <div key={tx.id} className="flex items-center justify-between bg-surface-lowest rounded-xl p-5 shadow-ambient">
                  <div><p className="font-body text-sm font-semibold text-foreground">{tx.description}</p><p className="font-body text-xs text-muted-foreground">{new Date(tx.transactionDate).toLocaleDateString("vi-VN")} - {tx.paymentMethod || "-"}</p></div>
                  <div className="text-right"><p className="font-serif font-semibold text-foreground">{money(Number(tx.amount || 0))}</p><span className={`text-xs font-body font-semibold ${tx.status === "completed" ? "text-secondary" : "text-muted-foreground"}`}>{tx.status}</span></div>
                </div>
              ))}
              {transactions.length === 0 && <p className="font-body text-sm text-muted-foreground">Chua co giao dich cho su kien nay.</p>}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default EventTracking;
