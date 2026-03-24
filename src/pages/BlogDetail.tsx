import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowLeft, Share2, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import portfolio1 from "@/assets/portfolio-1.jpg";
import eventGala from "@/assets/event-gala.jpg";
import eventConference from "@/assets/event-conference.jpg";
import heroImg from "@/assets/hero-wedding.jpg";

const posts: Record<string, { title: string; category: string; date: string; readTime: string; image: string; content: string[] }> = {
  "1": {
    title: "10 Xu Hướng Trang Trí Tiệc Cưới 2026",
    category: "Xu hướng", date: "15/03/2026", readTime: "5 phút", image: portfolio1,
    content: [
      "Năm 2026 mang đến làn gió mới cho ngành trang trí tiệc cưới với những xu hướng vừa hoài cổ vừa hiện đại. Từ phong cách botanical tối giản đến maximalist đầy màu sắc, mỗi đám cưới đều có cơ hội thể hiện cá tính riêng.",
      "1. Botanical Minimalism — Sử dụng lá xanh tự nhiên, hoa đồng nội với bảng màu trung tính. Ít nhưng tinh tế.",
      "2. Maximalist Color — Phá vỡ quy tắc với sự kết hợp táo bạo giữa hồng, cam, tím. Không sợ nổi bật!",
      "3. Vintage Garden — Phong cách vườn châu Âu thế kỷ 19 với bàn gỗ dài, nến cổ và hoa hồng leo.",
      "4. Sustainable Wedding — Vật liệu tái chế, hoa giấy handmade, không plastic. Xanh và đẹp.",
      "5. Dreamy Lighting — Đèn fairy light, nến treo, đèn lồng giấy tạo không gian cổ tích mê hoặc.",
      "6. Asian Fusion — Kết hợp văn hóa Á Đông với phong cách hiện đại: đèn lồng đỏ, hoa sen, vải lụa.",
      "7. Outdoor Elegance — Tiệc cưới ngoài trời với cổng hoa tự nhiên và thảm cỏ xanh mướt.",
      "8. Monochrome Magic — Chỉ một tông màu từ đậm đến nhạt, tạo hiệu ứng visual ấn tượng.",
      "9. Interactive Decor — Khách mời tham gia trang trí: viết lời chúc trên cây nguyện ước, ghép ảnh.",
      "10. Technology Integration — Màn hình LED, projection mapping, AR filter cho tiệc cưới thời đại số.",
    ],
  },
  "2": {
    title: "Bí Quyết Tổ Chức Gala Dinner Thành Công",
    category: "Kinh nghiệm", date: "10/03/2026", readTime: "8 phút", image: eventGala,
    content: [
      "Gala dinner không chỉ là một bữa tiệc — đó là cơ hội để doanh nghiệp ghi dấu ấn với đối tác, nhân viên và khách mời VIP. Dưới đây là những bí quyết từ 12 năm kinh nghiệm tổ chức.",
      "Xác định mục tiêu rõ ràng: Gala kỷ niệm, tri ân, hay networking? Mục tiêu quyết định concept.",
      "Chọn venue phù hợp: Khách sạn 5 sao cho sự sang trọng, rooftop cho sự trendy, warehouse cho sự phá cách.",
      "Chương trình là linh hồn: Kết hợp giữa nghệ thuật, giải trí và các phần chia sẻ ý nghĩa.",
      "Đừng quên chi tiết nhỏ: Welcome drink, name card, goodie bag — những thứ tưởng nhỏ nhưng tạo nên sự chuyên nghiệp.",
    ],
  },
};

const BlogDetail = () => {
  const { id } = useParams();
  const post = posts[id || "1"] || posts["1"];

  return (
    <div className="min-h-screen pt-24">
      {/* Hero */}
      <div className="relative h-[50vh] overflow-hidden">
        <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, hsl(var(--on-surface) / 0.8), hsl(var(--on-surface) / 0.2))' }} />
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-6 pb-12">
            <Link to="/blog" className="inline-flex items-center gap-2 text-primary-foreground/80 font-body text-sm mb-4 hover:text-primary-foreground transition-colors">
              <ArrowLeft size={16} /> Blog
            </Link>
            <span className="tracking-editorial text-label-md text-primary-foreground/80 font-body text-xs block mb-3">{post.category}</span>
            <h1 className="font-serif text-display-sm md:text-display-md text-primary-foreground max-w-3xl">{post.title}</h1>
            <div className="flex items-center gap-4 mt-4 text-primary-foreground/70 font-body text-sm">
              <span className="flex items-center gap-1"><Calendar size={14} /> {post.date}</span>
              <span className="flex items-center gap-1"><Clock size={14} /> {post.readTime}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            {post.content.map((para, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="font-body text-foreground leading-[1.8] text-lg mb-6"
              >
                {para}
              </motion.p>
            ))}

            <div className="mt-12 pt-8 flex items-center justify-between" style={{ borderTop: '1px solid hsl(var(--outline-variant) / 0.2)' }}>
              <Link to="/blog">
                <Button variant="ghost" className="font-body">← Quay lại Blog</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogDetail;
