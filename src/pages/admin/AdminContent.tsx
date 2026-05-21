import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Globe, FileText, Image, Star, Trash2, Eye, Plus,
  Loader2, LayoutGrid, BookOpen, MessageSquare, Settings2,
  TrendingUp, Calendar, Tag, CheckCircle2, EyeOff, Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { apiClient } from "@/services/apiClient";
import { toast } from "sonner";

type PortfolioItem = {
  id: string;
  title: string;
  category: string;
  status: string;
  viewCount?: number;
};
type BlogPost = {
  id: string;
  title: string;
  category: string;
  status: string;
  publishedAt?: string | null;
  viewCount?: number;
};
type Review = {
  id: string;
  ratingOverall: number;
  comment: string;
  status: string;
  customerUser?: { displayName: string };
  event?: { name: string };
};
type ServiceItem = {
  id: string;
  title: string;
  shortDescription?: string;
  priceFrom?: number | string | null;
  isActive?: boolean;
  category?: { name: string };
};

const portfolioStatusMap: Record<string, { label: string; color: string }> = {
  published: { label: "Đã đăng",  color: "bg-emerald-500/10 text-emerald-600 border border-emerald-200" },
  draft:     { label: "Bản nháp", color: "bg-amber-500/10 text-amber-600 border border-amber-200" },
  hidden:    { label: "Ẩn",       color: "bg-muted text-muted-foreground border border-border" },
};

const blogStatusMap: Record<string, { label: string; color: string }> = {
  published: { label: "Đã đăng",  color: "bg-emerald-500/10 text-emerald-600 border border-emerald-200" },
  draft:     { label: "Bản nháp", color: "bg-amber-500/10 text-amber-600 border border-amber-200" },
  archived:  { label: "Lưu trữ", color: "bg-muted text-muted-foreground border border-border" },
};

const reviewStatusMap: Record<string, { label: string; color: string }> = {
  pending:  { label: "Chờ duyệt", color: "bg-amber-500/10 text-amber-600 border border-amber-200" },
  approved: { label: "Đã duyệt",  color: "bg-emerald-500/10 text-emerald-600 border border-emerald-200" },
  hidden:   { label: "Đã ẩn",     color: "bg-muted text-muted-foreground border border-border" },
};

const StatusChip = ({ label, color }: { label: string; color: string }) => (
  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-body font-semibold ${color}`}>
    {label}
  </span>
);

const EmptyState = ({ icon: Icon, message }: { icon: React.ElementType; message: string }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
      <Icon size={24} className="text-muted-foreground" />
    </div>
    <p className="font-body text-sm text-muted-foreground">{message}</p>
  </div>
);

// ----- Form types -----
type PortfolioForm = {
  title: string;
  slug: string;
  category: string;
  coverImageUrl: string;
  guestCount: string;
  status: "draft" | "published" | "hidden";
};
const emptyPortfolio: PortfolioForm = {
  title: "", slug: "", category: "", coverImageUrl: "", guestCount: "", status: "draft",
};

type BlogForm = {
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  coverImageUrl: string;
  status: "draft" | "published" | "archived";
};
const emptyBlog: BlogForm = {
  title: "", slug: "", category: "", excerpt: "", content: "", coverImageUrl: "", status: "draft",
};

type ServiceForm = {
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  priceFrom: string;
  priceTo: string;
  coverImageUrl: string;
  categorySlug: string;
  isActive: boolean;
};
const emptyService: ServiceForm = {
  title: "", slug: "", shortDescription: "", description: "",
  priceFrom: "", priceTo: "", coverImageUrl: "", categorySlug: "", isActive: true,
};

const slugify = (s: string) =>
  s.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim().replace(/\s+/g, "-");

const AdminContent = () => {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [loading, setLoading] = useState(true);

  // Dialog state
  const [portfolioOpen, setPortfolioOpen] = useState(false);
  const [blogOpen, setBlogOpen] = useState(false);
  const [serviceOpen, setServiceOpen] = useState(false);
  const [portfolioForm, setPortfolioForm] = useState<PortfolioForm>(emptyPortfolio);
  const [blogForm, setBlogForm] = useState<BlogForm>(emptyBlog);
  const [serviceForm, setServiceForm] = useState<ServiceForm>(emptyService);
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [portfolio, blog, reviewData, serviceList, cats] = await Promise.all([
        apiClient.get<PortfolioItem[]>("/admin/content/portfolio", { pageSize: 100 }),
        apiClient.get<BlogPost[]>("/admin/content/blog-posts", { pageSize: 100 }),
        apiClient.get<Review[]>("/admin/content/reviews", { pageSize: 100 }),
        apiClient.get<ServiceItem[]>("/public/services").catch(() => []),
        apiClient.get<{ id: string; name: string; slug: string }[]>("/admin/content/service-categories").catch(() => []),
      ]);
      setPortfolioItems(portfolio);
      setBlogPosts(blog);
      setReviews(reviewData);
      setServices(serviceList);
      setCategories(cats);
    } catch {
      toast.error("Không thể tải nội dung, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const deletePortfolio = async (id: string) => {
    await apiClient.del(`/admin/content/portfolio/${id}`);
    toast.success("Đã xoá case study thành công");
    await load();
  };

  const deleteBlog = async (id: string) => {
    await apiClient.del(`/admin/content/blog-posts/${id}`);
    toast.success("Đã xoá bài viết thành công");
    await load();
  };

  const deleteService = async (id: string) => {
    try {
      await apiClient.del(`/admin/content/services/${id}`);
      toast.success("Đã xoá dịch vụ");
      await load();
    } catch {
      toast.error("Không thể xoá dịch vụ");
    }
  };

  const approveReview = async (id: string) => {
    await apiClient.patch(`/admin/content/reviews/${id}/approve`);
    toast.success("Đã duyệt đánh giá");
    await load();
  };

  const hideReview = async (id: string) => {
    await apiClient.patch(`/admin/content/reviews/${id}/hide`);
    toast.success("Đã ẩn đánh giá");
    await load();
  };

  // ----- Submit handlers -----
  const submitPortfolio = async () => {
    if (!portfolioForm.title.trim()) return toast.error("Vui lòng nhập tiêu đề");
    setSubmitting(true);
    try {
      await apiClient.post("/admin/content/portfolio", {
        title: portfolioForm.title.trim(),
        slug: portfolioForm.slug.trim() || slugify(portfolioForm.title),
        category: portfolioForm.category.trim(),
        coverImageUrl: portfolioForm.coverImageUrl.trim() || null,
        guestCount: portfolioForm.guestCount ? Number(portfolioForm.guestCount) : null,
        status: portfolioForm.status,
      });
      toast.success("Đã đăng case study mới");
      setPortfolioOpen(false);
      setPortfolioForm(emptyPortfolio);
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Đăng bài thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  const submitBlog = async () => {
    if (!blogForm.title.trim()) return toast.error("Vui lòng nhập tiêu đề");
    if (!blogForm.content.trim()) return toast.error("Vui lòng nhập nội dung bài viết");
    setSubmitting(true);
    try {
      await apiClient.post("/admin/content/blog-posts", {
        title: blogForm.title.trim(),
        slug: blogForm.slug.trim() || slugify(blogForm.title),
        category: blogForm.category.trim(),
        excerpt: blogForm.excerpt.trim() || null,
        content: blogForm.content,
        coverImageUrl: blogForm.coverImageUrl.trim() || null,
        status: blogForm.status,
      });
      toast.success("Đã đăng bài viết mới");
      setBlogOpen(false);
      setBlogForm(emptyBlog);
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Đăng bài thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  const submitService = async () => {
    if (!serviceForm.title.trim()) return toast.error("Vui lòng nhập tên dịch vụ");
    setSubmitting(true);
    try {
      await apiClient.post("/admin/content/services", {
        title: serviceForm.title.trim(),
        slug: serviceForm.slug.trim() || slugify(serviceForm.title),
        shortDescription: serviceForm.shortDescription.trim(),
        description: serviceForm.description,
        priceFrom: serviceForm.priceFrom ? Number(serviceForm.priceFrom) : null,
        priceTo: serviceForm.priceTo ? Number(serviceForm.priceTo) : null,
        coverImageUrl: serviceForm.coverImageUrl.trim() || null,
        categorySlug: serviceForm.categorySlug || null,
        isActive: serviceForm.isActive,
      });
      toast.success("Đã đăng dịch vụ mới");
      setServiceOpen(false);
      setServiceForm(emptyService);
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Đăng dịch vụ thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  const pendingReviews = reviews.filter(r => r.status === "pending").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-headline-lg text-foreground">Quản lý nội dung</h1>
        <p className="font-body text-sm text-muted-foreground mt-1">
          {loading ? "Đang tải dữ liệu..." : `Đăng và quản lý Dịch vụ, Portfolio, Bài viết và Đánh giá`}
        </p>
      </div>

      <Tabs defaultValue="portfolio" className="space-y-6">
        <TabsList className="bg-surface-lowest p-1 rounded-xl">
          <TabsTrigger value="portfolio" className="flex items-center gap-2 rounded-lg font-body text-sm">
            <LayoutGrid size={14} /> Portfolio
            <span className="ml-1 px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground text-xs">{portfolioItems.length}</span>
          </TabsTrigger>
          <TabsTrigger value="blog" className="flex items-center gap-2 rounded-lg font-body text-sm">
            <BookOpen size={14} /> Bài viết
            <span className="ml-1 px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground text-xs">{blogPosts.length}</span>
          </TabsTrigger>
          <TabsTrigger value="reviews" className="flex items-center gap-2 rounded-lg font-body text-sm">
            <MessageSquare size={14} /> Đánh giá
            {pendingReviews > 0 && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full bg-amber-500 text-white text-xs">{pendingReviews}</span>
            )}
          </TabsTrigger>
          <TabsTrigger value="services" className="flex items-center gap-2 rounded-lg font-body text-sm">
            <Settings2 size={14} /> Dịch vụ
            <span className="ml-1 px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground text-xs">{services.length}</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab Portfolio */}
        <TabsContent value="portfolio" className="space-y-3">
          <div className="flex justify-end">
            <Button onClick={() => setPortfolioOpen(true)} className="gap-2">
              <Plus size={16} /> Đăng case study mới
            </Button>
          </div>
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 size={20} className="animate-spin text-muted-foreground" />
            </div>
          )}
          {!loading && portfolioItems.length === 0 && (
            <EmptyState icon={Image} message="Chưa có case study nào. Hãy đăng case study đầu tiên." />
          )}
          {portfolioItems.map((item, i) => {
            const statusInfo = portfolioStatusMap[item.status] ?? { label: item.status, color: "bg-muted text-muted-foreground border border-border" };
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-center justify-between bg-surface-lowest rounded-xl p-4 shadow-ambient hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center flex-shrink-0">
                    <Image size={16} className="text-primary/60" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-body font-semibold text-foreground truncate">{item.title}</h3>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Tag size={10} /> {item.category}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <TrendingUp size={10} /> {item.viewCount ?? 0} lượt xem
                      </span>
                      <StatusChip label={statusInfo.label} color={statusInfo.color} />
                    </div>
                  </div>
                </div>
                <div className="flex gap-1 flex-shrink-0 ml-3">
                  <Button variant="ghost" size="icon" className="h-8 w-8" title="Xem chi tiết">
                    <Eye size={14} />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" title="Xoá" onClick={() => deletePortfolio(item.id)}>
                    <Trash2 size={14} />
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </TabsContent>

        {/* Tab Blog */}
        <TabsContent value="blog" className="space-y-3">
          <div className="flex justify-end">
            <Button onClick={() => setBlogOpen(true)} className="gap-2">
              <Plus size={16} /> Đăng bài viết mới
            </Button>
          </div>
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 size={20} className="animate-spin text-muted-foreground" />
            </div>
          )}
          {!loading && blogPosts.length === 0 && (
            <EmptyState icon={FileText} message="Chưa có bài viết nào. Hãy viết bài đầu tiên." />
          )}
          {blogPosts.map((post, i) => {
            const statusInfo = blogStatusMap[post.status] ?? { label: post.status, color: "bg-muted text-muted-foreground border border-border" };
            return (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-center justify-between bg-surface-lowest rounded-xl p-4 shadow-ambient hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-secondary/5 flex items-center justify-center flex-shrink-0">
                    <FileText size={16} className="text-secondary/60" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-body font-semibold text-foreground truncate">{post.title}</h3>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Tag size={10} /> {post.category}
                      </span>
                      {post.publishedAt && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar size={10} /> {new Date(post.publishedAt).toLocaleDateString("vi-VN")}
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <TrendingUp size={10} /> {post.viewCount ?? 0} lượt xem
                      </span>
                      <StatusChip label={statusInfo.label} color={statusInfo.color} />
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive flex-shrink-0 ml-3" title="Xoá" onClick={() => deleteBlog(post.id)}>
                  <Trash2 size={14} />
                </Button>
              </motion.div>
            );
          })}
        </TabsContent>

        {/* Tab Đánh giá */}
        <TabsContent value="reviews" className="space-y-3">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 size={20} className="animate-spin text-muted-foreground" />
            </div>
          )}
          {!loading && reviews.length === 0 && (
            <EmptyState icon={Star} message="Chưa có đánh giá nào từ khách hàng." />
          )}
          {reviews.map((review, i) => {
            const statusInfo = reviewStatusMap[review.status] ?? { label: review.status, color: "bg-muted text-muted-foreground border border-border" };
            return (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="bg-surface-lowest rounded-xl p-5 shadow-ambient hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center font-bold text-amber-600 text-sm flex-shrink-0">
                      {(review.customerUser?.displayName ?? "K").charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-body font-semibold text-foreground">
                          {review.customerUser?.displayName ?? "Khách hàng"}
                        </h3>
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }, (_, idx) => (
                            <Star
                              key={idx}
                              size={13}
                              className={idx < review.ratingOverall ? "text-amber-500 fill-amber-500" : "text-muted-foreground/30"}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground font-body">({review.ratingOverall}/5)</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        {review.event?.name && (
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Globe size={10} /> {review.event.name}
                          </span>
                        )}
                        <StatusChip label={statusInfo.label} color={statusInfo.color} />
                      </div>
                      <blockquote className="font-body text-sm text-foreground mt-3 leading-relaxed italic border-l-2 border-amber-200 pl-3">
                        "{review.comment}"
                      </blockquote>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 flex-shrink-0">
                    {review.status !== "approved" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                        title="Duyệt đánh giá"
                        onClick={() => approveReview(review.id)}
                      >
                        <CheckCircle2 size={15} />
                      </Button>
                    )}
                    {review.status !== "hidden" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        title="Ẩn đánh giá"
                        onClick={() => hideReview(review.id)}
                      >
                        <EyeOff size={15} />
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </TabsContent>

        {/* Tab Dịch vụ */}
        <TabsContent value="services" className="space-y-3">
          <div className="flex justify-end">
            <Button onClick={() => setServiceOpen(true)} className="gap-2">
              <Plus size={16} /> Đăng dịch vụ mới
            </Button>
          </div>
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 size={20} className="animate-spin text-muted-foreground" />
            </div>
          )}
          {!loading && services.length === 0 && (
            <EmptyState icon={Sparkles} message="Chưa có dịch vụ nào. Hãy đăng dịch vụ đầu tiên." />
          )}
          {services.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="flex items-center justify-between bg-surface-lowest rounded-xl p-4 shadow-ambient hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Sparkles size={16} className="text-accent-foreground/60" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-body font-semibold text-foreground truncate">{s.title}</h3>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    {s.category?.name && (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Tag size={10} /> {s.category.name}
                      </span>
                    )}
                    {s.priceFrom != null && (
                      <span className="text-xs text-muted-foreground">
                        Từ {Number(s.priceFrom).toLocaleString("vi-VN")}đ
                      </span>
                    )}
                    <StatusChip
                      label={s.isActive ? "Đang bán" : "Tạm ẩn"}
                      color={s.isActive
                        ? "bg-emerald-500/10 text-emerald-600 border border-emerald-200"
                        : "bg-muted text-muted-foreground border border-border"}
                    />
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive flex-shrink-0 ml-3" title="Xoá" onClick={() => deleteService(s.id)}>
                <Trash2 size={14} />
              </Button>
            </motion.div>
          ))}
        </TabsContent>
      </Tabs>

      {/* ===== Dialog: Đăng Portfolio ===== */}
      <Dialog open={portfolioOpen} onOpenChange={setPortfolioOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="font-serif">Đăng case study mới</DialogTitle>
            <DialogDescription>Tạo một case study mới hiển thị trên trang Portfolio.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Tiêu đề *</Label>
              <Input value={portfolioForm.title} onChange={e => setPortfolioForm(f => ({ ...f, title: e.target.value }))} placeholder="VD: Tiệc cưới Minh & Lan" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Slug (URL)</Label>
                <Input value={portfolioForm.slug} onChange={e => setPortfolioForm(f => ({ ...f, slug: e.target.value }))} placeholder="tu-dong-tao" />
              </div>
              <div className="space-y-1.5">
                <Label>Danh mục</Label>
                <Input value={portfolioForm.category} onChange={e => setPortfolioForm(f => ({ ...f, category: e.target.value }))} placeholder="Tiệc cưới" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Ảnh bìa (URL)</Label>
                <Input value={portfolioForm.coverImageUrl} onChange={e => setPortfolioForm(f => ({ ...f, coverImageUrl: e.target.value }))} placeholder="https://..." />
              </div>
              <div className="space-y-1.5">
                <Label>Số khách</Label>
                <Input type="number" value={portfolioForm.guestCount} onChange={e => setPortfolioForm(f => ({ ...f, guestCount: e.target.value }))} placeholder="300" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Trạng thái</Label>
              <Select value={portfolioForm.status} onValueChange={(v) => setPortfolioForm(f => ({ ...f, status: v as PortfolioForm["status"] }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Bản nháp</SelectItem>
                  <SelectItem value="published">Đăng công khai</SelectItem>
                  <SelectItem value="hidden">Ẩn</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setPortfolioOpen(false)}>Huỷ</Button>
            <Button onClick={submitPortfolio} disabled={submitting}>
              {submitting && <Loader2 size={14} className="animate-spin mr-2" />}
              Đăng case study
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ===== Dialog: Đăng Bài viết ===== */}
      <Dialog open={blogOpen} onOpenChange={setBlogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-serif">Đăng bài viết mới</DialogTitle>
            <DialogDescription>Viết một bài blog mới hiển thị trên trang Blog.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
            <div className="space-y-1.5">
              <Label>Tiêu đề *</Label>
              <Input value={blogForm.title} onChange={e => setBlogForm(f => ({ ...f, title: e.target.value }))} placeholder="VD: 5 xu hướng tiệc cưới 2026" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Slug (URL)</Label>
                <Input value={blogForm.slug} onChange={e => setBlogForm(f => ({ ...f, slug: e.target.value }))} placeholder="tu-dong-tao" />
              </div>
              <div className="space-y-1.5">
                <Label>Danh mục</Label>
                <Input value={blogForm.category} onChange={e => setBlogForm(f => ({ ...f, category: e.target.value }))} placeholder="Cẩm nang" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Ảnh bìa (URL)</Label>
              <Input value={blogForm.coverImageUrl} onChange={e => setBlogForm(f => ({ ...f, coverImageUrl: e.target.value }))} placeholder="https://..." />
            </div>
            <div className="space-y-1.5">
              <Label>Tóm tắt</Label>
              <Textarea rows={2} value={blogForm.excerpt} onChange={e => setBlogForm(f => ({ ...f, excerpt: e.target.value }))} placeholder="Đoạn mô tả ngắn hiển thị ở danh sách bài viết..." />
            </div>
            <div className="space-y-1.5">
              <Label>Nội dung *</Label>
              <Textarea rows={8} value={blogForm.content} onChange={e => setBlogForm(f => ({ ...f, content: e.target.value }))} placeholder="Nội dung bài viết (hỗ trợ Markdown)..." />
            </div>
            <div className="space-y-1.5">
              <Label>Trạng thái</Label>
              <Select value={blogForm.status} onValueChange={(v) => setBlogForm(f => ({ ...f, status: v as BlogForm["status"] }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Bản nháp</SelectItem>
                  <SelectItem value="published">Đăng công khai</SelectItem>
                  <SelectItem value="archived">Lưu trữ</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setBlogOpen(false)}>Huỷ</Button>
            <Button onClick={submitBlog} disabled={submitting}>
              {submitting && <Loader2 size={14} className="animate-spin mr-2" />}
              Đăng bài viết
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ===== Dialog: Đăng Dịch vụ ===== */}
      <Dialog open={serviceOpen} onOpenChange={setServiceOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-serif">Đăng dịch vụ mới</DialogTitle>
            <DialogDescription>Thêm một dịch vụ mới hiển thị trên trang Dịch vụ.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
            <div className="space-y-1.5">
              <Label>Tên dịch vụ *</Label>
              <Input value={serviceForm.title} onChange={e => setServiceForm(f => ({ ...f, title: e.target.value }))} placeholder="VD: Gói tiệc cưới trọn gói 300 khách" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Slug (URL)</Label>
                <Input value={serviceForm.slug} onChange={e => setServiceForm(f => ({ ...f, slug: e.target.value }))} placeholder="tu-dong-tao" />
              </div>
              <div className="space-y-1.5">
                <Label>Danh mục</Label>
                {categories.length > 0 ? (
                  <Select value={serviceForm.categorySlug} onValueChange={v => setServiceForm(f => ({ ...f, categorySlug: v }))}>
                    <SelectTrigger><SelectValue placeholder="Chọn danh mục" /></SelectTrigger>
                    <SelectContent>
                      {categories.map(c => (
                        <SelectItem key={c.id} value={c.slug}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input value={serviceForm.categorySlug} onChange={e => setServiceForm(f => ({ ...f, categorySlug: e.target.value }))} placeholder="tiec-cuoi" />
                )}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Mô tả ngắn</Label>
              <Textarea rows={2} value={serviceForm.shortDescription} onChange={e => setServiceForm(f => ({ ...f, shortDescription: e.target.value }))} placeholder="Mô tả ngắn gọn hiển thị ở danh sách dịch vụ..." />
            </div>
            <div className="space-y-1.5">
              <Label>Mô tả chi tiết</Label>
              <Textarea rows={5} value={serviceForm.description} onChange={e => setServiceForm(f => ({ ...f, description: e.target.value }))} placeholder="Thông tin chi tiết về dịch vụ..." />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Giá từ (VNĐ)</Label>
                <Input type="number" value={serviceForm.priceFrom} onChange={e => setServiceForm(f => ({ ...f, priceFrom: e.target.value }))} placeholder="50000000" />
              </div>
              <div className="space-y-1.5">
                <Label>Giá đến (VNĐ)</Label>
                <Input type="number" value={serviceForm.priceTo} onChange={e => setServiceForm(f => ({ ...f, priceTo: e.target.value }))} placeholder="150000000" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Ảnh bìa (URL)</Label>
              <Input value={serviceForm.coverImageUrl} onChange={e => setServiceForm(f => ({ ...f, coverImageUrl: e.target.value }))} placeholder="https://..." />
            </div>
            <div className="flex items-center gap-2">
              <input
                id="svc-active"
                type="checkbox"
                checked={serviceForm.isActive}
                onChange={e => setServiceForm(f => ({ ...f, isActive: e.target.checked }))}
                className="h-4 w-4 rounded border-border"
              />
              <Label htmlFor="svc-active" className="cursor-pointer">Hiển thị công khai ngay</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setServiceOpen(false)}>Huỷ</Button>
            <Button onClick={submitService} disabled={submitting}>
              {submitting && <Loader2 size={14} className="animate-spin mr-2" />}
              Đăng dịch vụ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminContent;
