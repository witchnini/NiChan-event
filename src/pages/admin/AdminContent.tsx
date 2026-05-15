import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Globe, FileText, Image, Star, Trash2, Eye, Check,
  Loader2, LayoutGrid, BookOpen, MessageSquare, Settings2,
  TrendingUp, Calendar, Tag, CheckCircle2, EyeOff, AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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

const portfolioStatusMap: Record<string, { label: string; color: string }> = {
  published: { label: "Đã đăng",   color: "bg-emerald-500/10 text-emerald-600 border border-emerald-200" },
  draft:     { label: "Bản nháp",  color: "bg-amber-500/10 text-amber-600 border border-amber-200" },
  hidden:    { label: "Ẩn",        color: "bg-muted text-muted-foreground border border-border" },
};

const blogStatusMap: Record<string, { label: string; color: string }> = {
  published: { label: "Đã đăng",    color: "bg-emerald-500/10 text-emerald-600 border border-emerald-200" },
  draft:     { label: "Bản nháp",   color: "bg-amber-500/10 text-amber-600 border border-amber-200" },
  archived:  { label: "Lưu trữ",   color: "bg-muted text-muted-foreground border border-border" },
};

const reviewStatusMap: Record<string, { label: string; color: string }> = {
  pending:  { label: "Chờ duyệt",  color: "bg-amber-500/10 text-amber-600 border border-amber-200" },
  approved: { label: "Đã duyệt",   color: "bg-emerald-500/10 text-emerald-600 border border-emerald-200" },
  hidden:   { label: "Đã ẩn",      color: "bg-muted text-muted-foreground border border-border" },
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

const AdminContent = () => {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [portfolio, blog, reviewData] = await Promise.all([
        apiClient.get<PortfolioItem[]>("/admin/content/portfolio", { pageSize: 100 }),
        apiClient.get<BlogPost[]>("/admin/content/blog-posts", { pageSize: 100 }),
        apiClient.get<Review[]>("/admin/content/reviews", { pageSize: 100 }),
      ]);
      setPortfolioItems(portfolio);
      setBlogPosts(blog);
      setReviews(reviewData);
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

  const pendingReviews = reviews.filter(r => r.status === "pending").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-headline-lg text-foreground">Quản lý nội dung</h1>
        <p className="font-body text-sm text-muted-foreground mt-1">
          {loading ? "Đang tải dữ liệu..." : `Portfolio, bài viết và đánh giá từ khách hàng`}
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
          </TabsTrigger>
        </TabsList>

        {/* Tab Portfolio */}
        <TabsContent value="portfolio" className="space-y-3">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 size={20} className="animate-spin text-muted-foreground" />
            </div>
          )}
          {!loading && portfolioItems.length === 0 && (
            <EmptyState icon={Image} message="Chưa có case study nào trong portfolio." />
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
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 size={20} className="animate-spin text-muted-foreground" />
            </div>
          )}
          {!loading && blogPosts.length === 0 && (
            <EmptyState icon={FileText} message="Chưa có bài viết nào được tạo." />
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
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center font-bold text-amber-600 text-sm flex-shrink-0">
                      {(review.customerUser?.displayName ?? "K").charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      {/* Tên & sao */}
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
                      {/* Sự kiện & trạng thái */}
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        {review.event?.name && (
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Globe size={10} /> {review.event.name}
                          </span>
                        )}
                        <StatusChip label={statusInfo.label} color={statusInfo.color} />
                      </div>
                      {/* Nội dung */}
                      <blockquote className="font-body text-sm text-foreground mt-3 leading-relaxed italic border-l-2 border-amber-200 pl-3">
                        "{review.comment}"
                      </blockquote>
                    </div>
                  </div>
                  {/* Nút hành động */}
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
        <TabsContent value="services">
          <div className="bg-surface-lowest rounded-xl p-8 shadow-ambient flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <AlertCircle size={28} className="text-muted-foreground" />
            </div>
            <h3 className="font-body font-semibold text-foreground mb-2">Tính năng đang phát triển</h3>
            <p className="font-body text-sm text-muted-foreground max-w-sm leading-relaxed">
              Quản lý dịch vụ qua Admin chưa được tích hợp vào backend. Hiện tại dịch vụ có thể được xem thông qua trang công khai.
            </p>
            <div className="mt-4 px-4 py-2 rounded-xl bg-muted/50 border border-border">
              <p className="font-body text-xs text-muted-foreground font-mono">GET /public/services</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminContent;
