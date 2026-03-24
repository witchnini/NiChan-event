import { useState } from "react";
import { motion } from "framer-motion";
import { Globe, FileText, Image, Star, Plus, Edit2, Trash2, Eye, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const portfolioItems = [
  { id: 1, title: "Tiệc cưới Hoa Anh Đào", category: "Wedding", status: "Hiển thị", views: 1250 },
  { id: 2, title: "Anniversary Gala Night", category: "Gala", status: "Hiển thị", views: 890 },
  { id: 3, title: "Festival Road Show 2025", category: "Road Show", status: "Ẩn", views: 560 },
];

const blogPosts = [
  { id: 1, title: "10 xu hướng tổ chức sự kiện 2026", category: "Xu hướng", status: "Đã đăng", date: "20/03/2026", views: 2340 },
  { id: 2, title: "Cách chọn venue hoàn hảo cho đám cưới", category: "Hướng dẫn", status: "Đã đăng", date: "15/03/2026", views: 1560 },
  { id: 3, title: "Checklist tổ chức khai trương", category: "Hướng dẫn", status: "Nháp", date: "—", views: 0 },
  { id: 4, title: "Gala dinner: từ A đến Z", category: "Chia sẻ", status: "Lên lịch", date: "01/04/2026", views: 0 },
];

const reviews = [
  { id: 1, customer: "Nguyễn Thanh Hà", event: "Tiệc cưới", rating: 5, comment: "Tuyệt vời! Mọi thứ hoàn hảo.", status: "Đã duyệt" },
  { id: 2, customer: "Trần Minh Đức", event: "Khai trương", rating: 5, comment: "Chuyên nghiệp, vượt mong đợi.", status: "Đã duyệt" },
  { id: 3, customer: "Phạm Văn Long", event: "Hội nghị", rating: 4, comment: "Tốt, nhưng cần cải thiện catering.", status: "Chờ duyệt" },
];

const AdminContent = () => {
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
            <Button variant="hero" size="sm"><Plus size={16} /> Thêm case study</Button>
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
                <span className={`px-2 py-0.5 rounded-full text-xs font-body font-semibold ${item.status === "Hiển thị" ? "bg-secondary/10 text-secondary" : "bg-muted text-muted-foreground"}`}>{item.status}</span>
                <Button variant="ghost" size="icon" className="h-8 w-8"><Edit2 size={14} /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8"><Trash2 size={14} /></Button>
              </div>
            </motion.div>
          ))}
        </TabsContent>

        {/* Blog */}
        <TabsContent value="blog" className="space-y-4">
          <div className="flex justify-end">
            <Button variant="hero" size="sm"><Plus size={16} /> Viết bài mới</Button>
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
                <span className={`px-2 py-0.5 rounded-full text-xs font-body font-semibold ${
                  post.status === "Đã đăng" ? "bg-secondary/10 text-secondary" :
                  post.status === "Lên lịch" ? "bg-primary/10 text-primary" :
                  "bg-muted text-muted-foreground"
                }`}>{post.status}</span>
                <Button variant="ghost" size="icon" className="h-8 w-8"><Edit2 size={14} /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8"><Eye size={14} /></Button>
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
                  {review.status === "Chờ duyệt" && <Button variant="hero" size="sm">Duyệt</Button>}
                </div>
              </div>
            </motion.div>
          ))}
        </TabsContent>

        {/* Services */}
        <TabsContent value="services" className="space-y-4">
          <div className="flex justify-end">
            <Button variant="hero" size="sm"><Plus size={16} /> Thêm dịch vụ</Button>
          </div>
          {["Tiệc cưới", "Gala Dinner", "Khai trương", "Hội nghị", "Road Show", "Kỷ niệm", "Online Event"].map((service, i) => (
            <motion.div key={service} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
              className="flex items-center justify-between bg-surface-lowest rounded-xl p-5 shadow-ambient"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-surface-low flex items-center justify-center"><Globe size={18} className="text-primary" /></div>
                <p className="font-body text-sm font-semibold text-foreground">{service}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8"><Edit2 size={14} /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8"><Eye size={14} /></Button>
              </div>
            </motion.div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminContent;
