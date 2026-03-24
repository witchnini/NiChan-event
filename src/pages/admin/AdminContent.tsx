import { useState } from "react";
import { motion } from "framer-motion";
import { Globe, FileText, Image, Star, Plus, Edit2, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

type PortfolioItem = { id: number; title: string; category: string; status: string; views: number; };
type BlogPost = { id: number; title: string; category: string; status: string; date: string; views: number; };
type Review = { id: number; customer: string; event: string; rating: number; comment: string; status: string; };

const AdminContent = () => {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([
    { id: 1, title: "Tiệc cưới Hoa Anh Đào", category: "Wedding", status: "Hiển thị", views: 1250 },
    { id: 2, title: "Anniversary Gala Night", category: "Gala", status: "Hiển thị", views: 890 },
    { id: 3, title: "Festival Road Show 2025", category: "Road Show", status: "Ẩn", views: 560 },
  ]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([
    { id: 1, title: "10 xu hướng tổ chức sự kiện 2026", category: "Xu hướng", status: "Đã đăng", date: "20/03/2026", views: 2340 },
    { id: 2, title: "Cách chọn venue hoàn hảo cho đám cưới", category: "Hướng dẫn", status: "Đã đăng", date: "15/03/2026", views: 1560 },
    { id: 3, title: "Checklist tổ chức khai trương", category: "Hướng dẫn", status: "Nháp", date: "—", views: 0 },
    { id: 4, title: "Gala dinner: từ A đến Z", category: "Chia sẻ", status: "Lên lịch", date: "01/04/2026", views: 0 },
  ]);
  const [reviews, setReviews] = useState<Review[]>([
    { id: 1, customer: "Nguyễn Thanh Hà", event: "Tiệc cưới", rating: 5, comment: "Tuyệt vời! Mọi thứ hoàn hảo.", status: "Đã duyệt" },
    { id: 2, customer: "Trần Minh Đức", event: "Khai trương", rating: 5, comment: "Chuyên nghiệp, vượt mong đợi.", status: "Đã duyệt" },
    { id: 3, customer: "Phạm Văn Long", event: "Hội nghị", rating: 4, comment: "Tốt, nhưng cần cải thiện catering.", status: "Chờ duyệt" },
  ]);

  // Portfolio dialogs
  const [portfolioDialog, setPortfolioDialog] = useState<"create" | "edit" | null>(null);
  const [portfolioForm, setPortfolioForm] = useState({ title: "", category: "Wedding", status: "Hiển thị" });
  const [editPortfolioId, setEditPortfolioId] = useState<number | null>(null);

  // Blog dialogs
  const [blogDialog, setBlogDialog] = useState<"create" | "edit" | null>(null);
  const [blogForm, setBlogForm] = useState({ title: "", category: "Xu hướng", status: "Nháp", date: "" });
  const [editBlogId, setEditBlogId] = useState<number | null>(null);

  // Services
  const [servicesList, setServicesList] = useState(["Tiệc cưới", "Gala Dinner", "Khai trương", "Hội nghị", "Road Show", "Kỷ niệm", "Online Event"]);
  const [serviceDialog, setServiceDialog] = useState(false);
  const [serviceForm, setServiceForm] = useState("");

  // Portfolio handlers
  const handleCreatePortfolio = () => {
    if (!portfolioForm.title) { toast.error("Vui lòng nhập tiêu đề"); return; }
    setPortfolioItems(prev => [...prev, { ...portfolioForm, id: Date.now(), views: 0 }]);
    toast.success("Đã thêm case study");
    setPortfolioDialog(null);
  };
  const handleEditPortfolio = () => {
    setPortfolioItems(prev => prev.map(p => p.id === editPortfolioId ? { ...p, ...portfolioForm } : p));
    toast.success("Đã cập nhật case study");
    setPortfolioDialog(null);
  };
  const handleDeletePortfolio = (id: number) => {
    setPortfolioItems(prev => prev.filter(p => p.id !== id));
    toast.success("Đã xóa case study");
  };
  const togglePortfolioStatus = (id: number) => {
    setPortfolioItems(prev => prev.map(p => p.id === id ? { ...p, status: p.status === "Hiển thị" ? "Ẩn" : "Hiển thị" } : p));
    toast.success("Đã cập nhật trạng thái");
  };

  // Blog handlers
  const handleCreateBlog = () => {
    if (!blogForm.title) { toast.error("Vui lòng nhập tiêu đề"); return; }
    setBlogPosts(prev => [...prev, { ...blogForm, id: Date.now(), views: 0, date: blogForm.status === "Đã đăng" ? new Date().toLocaleDateString("vi-VN") : blogForm.date || "—" }]);
    toast.success("Đã thêm bài viết");
    setBlogDialog(null);
  };
  const handleEditBlog = () => {
    setBlogPosts(prev => prev.map(p => p.id === editBlogId ? { ...p, ...blogForm } : p));
    toast.success("Đã cập nhật bài viết");
    setBlogDialog(null);
  };
  const handleDeleteBlog = (id: number) => {
    setBlogPosts(prev => prev.filter(p => p.id !== id));
    toast.success("Đã xóa bài viết");
  };

  // Review handlers
  const handleApproveReview = (id: number) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, status: "Đã duyệt" } : r));
    toast.success("Đã duyệt đánh giá");
  };
  const handleDeleteReview = (id: number) => {
    setReviews(prev => prev.filter(r => r.id !== id));
    toast.success("Đã xóa đánh giá");
  };

  // Service handlers
  const handleAddService = () => {
    if (!serviceForm) { toast.error("Vui lòng nhập tên dịch vụ"); return; }
    setServicesList(prev => [...prev, serviceForm]);
    toast.success("Đã thêm dịch vụ");
    setServiceDialog(false);
    setServiceForm("");
  };
  const handleDeleteService = (name: string) => {
    setServicesList(prev => prev.filter(s => s !== name));
    toast.success("Đã xóa dịch vụ");
  };

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-headline-lg text-foreground">Quản lý nội dung</h1>

      <Tabs defaultValue="portfolio" className="space-y-6">
        <TabsList className="bg-surface-lowest rounded-xl p-1">
          <TabsTrigger value="portfolio" className="rounded-lg font-body data-[state=active]:gradient-primary data-[state=active]:text-primary-foreground">Portfolio</TabsTrigger>
          <TabsTrigger value="blog" className="rounded-lg font-body data-[state=active]:gradient-primary data-[state=active]:text-primary-foreground">Blog</TabsTrigger>
          <TabsTrigger value="reviews" className="rounded-lg font-body data-[state=active]:gradient-primary data-[state=active]:text-primary-foreground">Đánh giá</TabsTrigger>
          <TabsTrigger value="services" className="rounded-lg font-body data-[state=active]:gradient-primary data-[state=active]:text-primary-foreground">Dịch vụ</TabsTrigger>
        </TabsList>

        {/* Portfolio */}
        <TabsContent value="portfolio" className="space-y-4">
          <div className="flex justify-end">
            <Button variant="hero" size="sm" onClick={() => { setPortfolioForm({ title: "", category: "Wedding", status: "Hiển thị" }); setPortfolioDialog("create"); }}><Plus size={16} /> Thêm case study</Button>
          </div>
          {portfolioItems.map((item, i) => (
            <motion.div key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
              className="flex items-center justify-between bg-surface-lowest rounded-xl p-5 shadow-ambient"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-surface-low flex items-center justify-center"><Image size={20} className="text-primary" /></div>
                <div>
                  <h3 className="font-body text-sm font-semibold text-foreground">{item.title}</h3>
                  <p className="font-body text-xs text-muted-foreground">{item.category} • {item.views} lượt xem</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => togglePortfolioStatus(item.id)}>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-body font-semibold cursor-pointer ${item.status === "Hiển thị" ? "bg-secondary/10 text-secondary" : "bg-muted text-muted-foreground"}`}>{item.status}</span>
                </button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setPortfolioForm({ title: item.title, category: item.category, status: item.status }); setEditPortfolioId(item.id); setPortfolioDialog("edit"); }}><Edit2 size={14} /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDeletePortfolio(item.id)}><Trash2 size={14} /></Button>
              </div>
            </motion.div>
          ))}
        </TabsContent>

        {/* Blog */}
        <TabsContent value="blog" className="space-y-4">
          <div className="flex justify-end">
            <Button variant="hero" size="sm" onClick={() => { setBlogForm({ title: "", category: "Xu hướng", status: "Nháp", date: "" }); setBlogDialog("create"); }}><Plus size={16} /> Viết bài mới</Button>
          </div>
          {blogPosts.map((post, i) => (
            <motion.div key={post.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
              className="flex items-center justify-between bg-surface-lowest rounded-xl p-5 shadow-ambient"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-surface-low flex items-center justify-center"><FileText size={20} className="text-primary" /></div>
                <div>
                  <h3 className="font-body text-sm font-semibold text-foreground">{post.title}</h3>
                  <p className="font-body text-xs text-muted-foreground">{post.category} • {post.date} • {post.views} lượt xem</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2 py-0.5 rounded-full text-xs font-body font-semibold ${post.status === "Đã đăng" ? "bg-secondary/10 text-secondary" : post.status === "Lên lịch" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>{post.status}</span>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setBlogForm({ title: post.title, category: post.category, status: post.status, date: post.date }); setEditBlogId(post.id); setBlogDialog("edit"); }}><Edit2 size={14} /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDeleteBlog(post.id)}><Trash2 size={14} /></Button>
              </div>
            </motion.div>
          ))}
        </TabsContent>

        {/* Reviews */}
        <TabsContent value="reviews" className="space-y-4">
          {reviews.map((review, i) => (
            <motion.div key={review.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
              className="bg-surface-lowest rounded-xl p-5 shadow-ambient"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-body text-sm font-semibold text-foreground">{review.customer}</h3>
                    <span className="font-body text-xs text-muted-foreground">• {review.event}</span>
                  </div>
                  <div className="flex gap-0.5 mb-2">
                    {Array.from({ length: review.rating }).map((_, j) => <Star key={j} size={12} className="text-primary fill-primary" />)}
                  </div>
                  <p className="font-body text-sm text-muted-foreground italic">"{review.comment}"</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-body font-semibold ${review.status === "Đã duyệt" ? "bg-secondary/10 text-secondary" : "bg-primary/10 text-primary"}`}>{review.status}</span>
                  {review.status === "Chờ duyệt" && <Button variant="hero" size="sm" onClick={() => handleApproveReview(review.id)}>Duyệt</Button>}
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDeleteReview(review.id)}><Trash2 size={14} /></Button>
                </div>
              </div>
            </motion.div>
          ))}
        </TabsContent>

        {/* Services */}
        <TabsContent value="services" className="space-y-4">
          <div className="flex justify-end">
            <Button variant="hero" size="sm" onClick={() => setServiceDialog(true)}><Plus size={16} /> Thêm dịch vụ</Button>
          </div>
          {servicesList.map((service, i) => (
            <motion.div key={service} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
              className="flex items-center justify-between bg-surface-lowest rounded-xl p-5 shadow-ambient"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-surface-low flex items-center justify-center"><Globe size={18} className="text-primary" /></div>
                <p className="font-body text-sm font-semibold text-foreground">{service}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toast.info(`Xem trước dịch vụ: ${service}`)}><Eye size={14} /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDeleteService(service)}><Trash2 size={14} /></Button>
              </div>
            </motion.div>
          ))}
        </TabsContent>
      </Tabs>

      {/* Portfolio Dialog */}
      <Dialog open={!!portfolioDialog} onOpenChange={() => setPortfolioDialog(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle className="font-serif">{portfolioDialog === "create" ? "Thêm case study" : "Chỉnh sửa case study"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><label className="font-body text-sm text-foreground mb-1 block">Tiêu đề *</label>
              <Input value={portfolioForm.title} onChange={e => setPortfolioForm(p => ({ ...p, title: e.target.value }))} className="rounded-xl bg-surface-lowest font-body border-none" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="font-body text-sm text-foreground mb-1 block">Danh mục</label>
                <Select value={portfolioForm.category} onValueChange={v => setPortfolioForm(p => ({ ...p, category: v }))}>
                  <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Wedding", "Gala", "Road Show", "Conference", "Opening"].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div><label className="font-body text-sm text-foreground mb-1 block">Trạng thái</label>
                <Select value={portfolioForm.status} onValueChange={v => setPortfolioForm(p => ({ ...p, status: v }))}>
                  <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Hiển thị">Hiển thị</SelectItem>
                    <SelectItem value="Ẩn">Ẩn</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPortfolioDialog(null)}>Hủy</Button>
            <Button variant="hero" onClick={portfolioDialog === "create" ? handleCreatePortfolio : handleEditPortfolio}>{portfolioDialog === "create" ? "Thêm" : "Lưu"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Blog Dialog */}
      <Dialog open={!!blogDialog} onOpenChange={() => setBlogDialog(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle className="font-serif">{blogDialog === "create" ? "Viết bài mới" : "Chỉnh sửa bài viết"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><label className="font-body text-sm text-foreground mb-1 block">Tiêu đề *</label>
              <Input value={blogForm.title} onChange={e => setBlogForm(p => ({ ...p, title: e.target.value }))} className="rounded-xl bg-surface-lowest font-body border-none" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="font-body text-sm text-foreground mb-1 block">Danh mục</label>
                <Select value={blogForm.category} onValueChange={v => setBlogForm(p => ({ ...p, category: v }))}>
                  <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Xu hướng", "Hướng dẫn", "Chia sẻ", "Tin tức"].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div><label className="font-body text-sm text-foreground mb-1 block">Trạng thái</label>
                <Select value={blogForm.status} onValueChange={v => setBlogForm(p => ({ ...p, status: v }))}>
                  <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Nháp">Nháp</SelectItem>
                    <SelectItem value="Đã đăng">Đã đăng</SelectItem>
                    <SelectItem value="Lên lịch">Lên lịch</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBlogDialog(null)}>Hủy</Button>
            <Button variant="hero" onClick={blogDialog === "create" ? handleCreateBlog : handleEditBlog}>{blogDialog === "create" ? "Tạo" : "Lưu"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Service Dialog */}
      <Dialog open={serviceDialog} onOpenChange={setServiceDialog}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader><DialogTitle className="font-serif">Thêm dịch vụ</DialogTitle></DialogHeader>
          <div><label className="font-body text-sm text-foreground mb-1 block">Tên dịch vụ *</label>
            <Input value={serviceForm} onChange={e => setServiceForm(e.target.value)} placeholder="Nhập tên dịch vụ" className="rounded-xl bg-surface-lowest font-body border-none" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setServiceDialog(false)}>Hủy</Button>
            <Button variant="hero" onClick={handleAddService}>Thêm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminContent;
