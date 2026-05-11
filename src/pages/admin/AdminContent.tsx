import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Globe, FileText, Image, Star, Trash2, Eye, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { apiClient } from "@/services/apiClient";
import { toast } from "sonner";

type PortfolioItem = { id: string; title: string; category: string; status: string; viewCount?: number };
type BlogPost = { id: string; title: string; category: string; status: string; publishedAt?: string | null; viewCount?: number };
type Review = { id: string; ratingOverall: number; comment: string; status: string; customerUser?: { displayName: string }; event?: { name: string } };

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
    } catch (error) {
      toast.error("Khong tai duoc noi dung");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const deletePortfolio = async (id: string) => {
    await apiClient.del(`/admin/content/portfolio/${id}`);
    toast.success("Da xoa case study");
    await load();
  };

  const deleteBlog = async (id: string) => {
    await apiClient.del(`/admin/content/blog-posts/${id}`);
    toast.success("Da xoa bai viet");
    await load();
  };

  const approveReview = async (id: string) => {
    await apiClient.patch(`/admin/content/reviews/${id}/approve`);
    toast.success("Da duyet danh gia");
    await load();
  };

  const hideReview = async (id: string) => {
    await apiClient.patch(`/admin/content/reviews/${id}/hide`);
    toast.success("Da an danh gia");
    await load();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-headline-lg text-foreground">Quan ly noi dung</h1>
        <p className="font-body text-sm text-muted-foreground">{loading ? "Dang tai..." : "Portfolio, blog va review doc tu backend"}</p>
      </div>

      <Tabs defaultValue="portfolio" className="space-y-6">
        <TabsList className="bg-surface-lowest">
          <TabsTrigger value="portfolio"><Image size={14} className="mr-1" /> Portfolio</TabsTrigger>
          <TabsTrigger value="blog"><FileText size={14} className="mr-1" /> Blog</TabsTrigger>
          <TabsTrigger value="reviews"><Star size={14} className="mr-1" /> Reviews</TabsTrigger>
          <TabsTrigger value="services"><Globe size={14} className="mr-1" /> Services</TabsTrigger>
        </TabsList>

        <TabsContent value="portfolio" className="space-y-4">
          {portfolioItems.map((item, i) => (
            <motion.div key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="flex items-center justify-between bg-surface-lowest rounded-xl p-4 shadow-ambient">
              <div>
                <h3 className="font-body font-semibold text-foreground">{item.title}</h3>
                <p className="font-body text-sm text-muted-foreground">{item.category} - {item.status} - {item.viewCount ?? 0} views</p>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon"><Eye size={16} /></Button>
                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deletePortfolio(item.id)}><Trash2 size={16} /></Button>
              </div>
            </motion.div>
          ))}
          {portfolioItems.length === 0 && <p className="font-body text-sm text-muted-foreground">Chua co portfolio.</p>}
        </TabsContent>

        <TabsContent value="blog" className="space-y-4">
          {blogPosts.map((post, i) => (
            <motion.div key={post.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="flex items-center justify-between bg-surface-lowest rounded-xl p-4 shadow-ambient">
              <div>
                <h3 className="font-body font-semibold text-foreground">{post.title}</h3>
                <p className="font-body text-sm text-muted-foreground">{post.category} - {post.status} - {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("vi-VN") : "-"}</p>
              </div>
              <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteBlog(post.id)}><Trash2 size={16} /></Button>
            </motion.div>
          ))}
          {blogPosts.length === 0 && <p className="font-body text-sm text-muted-foreground">Chua co bai viet.</p>}
        </TabsContent>

        <TabsContent value="reviews" className="space-y-4">
          {reviews.map((review, i) => (
            <motion.div key={review.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="bg-surface-lowest rounded-xl p-4 shadow-ambient">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-body font-semibold text-foreground">{review.customerUser?.displayName ?? "Khach hang"}</h3>
                    <div className="flex">{Array.from({ length: 5 }, (_, idx) => <Star key={idx} size={12} className={idx < review.ratingOverall ? "text-amber-500 fill-amber-500" : "text-muted-foreground"} />)}</div>
                  </div>
                  <p className="font-body text-sm text-muted-foreground">{review.event?.name ?? "-"} - {review.status}</p>
                  <p className="font-body text-sm text-foreground mt-2">"{review.comment}"</p>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => approveReview(review.id)}><Check size={16} /></Button>
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => hideReview(review.id)}><Trash2 size={16} /></Button>
                </div>
              </div>
            </motion.div>
          ))}
          {reviews.length === 0 && <p className="font-body text-sm text-muted-foreground">Chua co review.</p>}
        </TabsContent>

        <TabsContent value="services">
          <div className="bg-surface-lowest rounded-xl p-6 shadow-ambient">
            <p className="font-body text-sm text-muted-foreground">
              Backend hien co API public service, nhung chua co CRUD admin service trong module admin content. Phan nay khong hien danh sach mock nua.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminContent;
