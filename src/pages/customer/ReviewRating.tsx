import { useState } from "react";
import { motion } from "framer-motion";
import { Star, Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import SectionHeading from "@/components/SectionHeading";

type Review = {
  id: number; event: string; date: string; rating: number; comment: string; submitted: boolean;
};

const initialReviews: Review[] = [
  { id: 1, event: "Gala cuối năm 2025", date: "20/12/2025", rating: 5, comment: "Tổ chức rất chuyên nghiệp, khách mời hài lòng! Sân khấu đẹp, âm thanh tốt, menu ngon.", submitted: true },
  { id: 2, event: "Tiệc cưới Minh & Hà", date: "15/05/2026", rating: 0, comment: "", submitted: false },
];

const criteria = [
  { key: "venue", label: "Địa điểm & Không gian" },
  { key: "service", label: "Dịch vụ & Thái độ nhân viên" },
  { key: "food", label: "Ẩm thực & Tiệc" },
  { key: "decor", label: "Trang trí & Décor" },
  { key: "overall", label: "Hài lòng tổng thể" },
];

const ReviewRating = () => {
  const [reviews, setReviews] = useState(initialReviews);
  const [activeReview, setActiveReview] = useState<number | null>(null);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [comment, setComment] = useState("");
  const [hoveredStar, setHoveredStar] = useState<Record<string, number>>({});

  const startReview = (id: number) => {
    setActiveReview(id);
    setRatings({});
    setComment("");
  };

  const submitReview = () => {
    if (Object.keys(ratings).length < criteria.length) {
      toast.error("Vui lòng đánh giá tất cả tiêu chí");
      return;
    }
    const avgRating = Math.round(Object.values(ratings).reduce((s, v) => s + v, 0) / criteria.length * 10) / 10;
    setReviews(prev => prev.map(r => r.id === activeReview ? { ...r, rating: avgRating, comment, submitted: true } : r));
    setActiveReview(null);
    toast.success("Đã gửi đánh giá thành công! Cảm ơn bạn 🌸");
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <section className="py-12 bg-surface-low">
        <div className="container mx-auto px-6">
          <SectionHeading label="Đánh giá" title="Đánh giá & Review" subtitle="Chia sẻ trải nghiệm của bạn để chúng tôi phục vụ tốt hơn." />
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-6 max-w-3xl space-y-6">
          {reviews.map((review, i) => (
            <motion.div key={review.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="bg-surface-lowest rounded-xl p-6 shadow-ambient">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <h3 className="font-serif text-headline-md text-foreground">{review.event}</h3>
                  <p className="font-body text-sm text-muted-foreground mt-1">Ngày sự kiện: {review.date}</p>
                </div>
                {review.submitted ? (
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }, (_, idx) => (
                        <Star key={idx} size={18} className={idx < Math.round(review.rating) ? "text-amber-500 fill-amber-500" : "text-muted-foreground"} />
                      ))}
                    </div>
                    <span className="font-serif font-bold text-foreground">{review.rating}</span>
                    <CheckCircle size={16} className="text-secondary" />
                  </div>
                ) : (
                  <Button variant="hero" size="sm" onClick={() => startReview(review.id)}>
                    <Star size={14} /> Đánh giá ngay
                  </Button>
                )}
              </div>

              {review.submitted && review.comment && (
                <div className="bg-surface-low rounded-xl p-4">
                  <p className="font-body text-sm italic text-foreground">"{review.comment}"</p>
                </div>
              )}

              {/* Review Form */}
              {activeReview === review.id && !review.submitted && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-6 space-y-5">
                  <div className="space-y-4">
                    {criteria.map(c => (
                      <div key={c.key} className="flex items-center justify-between bg-surface-low rounded-xl p-4">
                        <span className="font-body text-sm text-foreground">{c.label}</span>
                        <div className="flex gap-1">
                          {Array.from({ length: 5 }, (_, idx) => (
                            <button key={idx}
                              onMouseEnter={() => setHoveredStar(prev => ({ ...prev, [c.key]: idx + 1 }))}
                              onMouseLeave={() => setHoveredStar(prev => ({ ...prev, [c.key]: 0 }))}
                              onClick={() => setRatings(prev => ({ ...prev, [c.key]: idx + 1 }))}>
                              <Star size={22}
                                className={`transition-colors ${
                                  idx < (hoveredStar[c.key] || ratings[c.key] || 0)
                                    ? "text-amber-500 fill-amber-500"
                                    : "text-muted-foreground"
                                }`} />
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="font-body text-sm text-foreground mb-2 block">Nhận xét của bạn</label>
                    <textarea
                      value={comment}
                      onChange={e => setComment(e.target.value)}
                      placeholder="Chia sẻ trải nghiệm của bạn về sự kiện..."
                      rows={4}
                      className="w-full rounded-xl bg-surface-low p-4 font-body text-sm text-foreground border-none resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setActiveReview(null)} className="flex-1">Hủy</Button>
                    <Button variant="hero" onClick={submitReview} className="flex-1"><Send size={14} /> Gửi đánh giá</Button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ReviewRating;
