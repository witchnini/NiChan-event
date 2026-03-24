import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight, Tag } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import portfolio1 from "@/assets/portfolio-1.jpg";
import portfolio2 from "@/assets/portfolio-2.jpg";
import eventGala from "@/assets/event-gala.jpg";
import heroImg from "@/assets/hero-wedding.jpg";
import eventConference from "@/assets/event-conference.jpg";
import portfolio3 from "@/assets/portfolio-3.jpg";

const blogPosts = [
  { id: 1, title: "10 Xu Hướng Trang Trí Tiệc Cưới 2026", category: "Xu hướng", date: "15/03/2026", readTime: "5 phút", image: portfolio1, excerpt: "Khám phá những xu hướng trang trí tiệc cưới mới nhất năm 2026, từ phong cách minimalist đến maximalist botanical." },
  { id: 2, title: "Bí Quyết Tổ Chức Gala Dinner Thành Công", category: "Kinh nghiệm", date: "10/03/2026", readTime: "8 phút", image: eventGala, excerpt: "Những kinh nghiệm quý báu từ 12 năm tổ chức hàng trăm gala dinner cho các doanh nghiệp lớn." },
  { id: 3, title: "Cách Chọn Địa Điểm Tổ Chức Sự Kiện Hoàn Hảo", category: "Hướng dẫn", date: "05/03/2026", readTime: "6 phút", image: eventConference, excerpt: "Từ khách sạn 5 sao đến bãi biển, hướng dẫn chọn venue phù hợp với từng loại sự kiện." },
  { id: 4, title: "Destination Wedding: Đám Cưới Trong Mơ", category: "Xu hướng", date: "28/02/2026", readTime: "7 phút", image: heroImg, excerpt: "Tất tần tật về destination wedding — từ chuẩn bị, chi phí đến những địa điểm đẹp nhất Việt Nam." },
  { id: 5, title: "Budget Planning: Cách Lên Ngân Sách Sự Kiện", category: "Hướng dẫn", date: "20/02/2026", readTime: "10 phút", image: portfolio2, excerpt: "Hướng dẫn chi tiết cách phân bổ ngân sách cho từng hạng mục trong sự kiện." },
  { id: 6, title: "Sự Kiện Xanh: Xu Hướng Bền Vững", category: "Xu hướng", date: "15/02/2026", readTime: "5 phút", image: portfolio3, excerpt: "Tổ chức sự kiện thân thiện với môi trường — giảm rác thải, sử dụng vật liệu tái chế." },
];

const Blog = () => {
  const featured = blogPosts[0];
  const rest = blogPosts.slice(1);

  return (
    <div className="min-h-screen pt-24">
      <section className="py-16 bg-surface-low">
        <div className="container mx-auto px-6">
          <SectionHeading
            label="Blog & Tin tức"
            title="Câu chuyện & cảm hứng"
            subtitle="Chia sẻ kinh nghiệm, xu hướng và những câu chuyện đằng sau mỗi sự kiện."
          />
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-6">
          {/* Featured */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
            <Link to={`/blog/${featured.id}`} className="group block">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-surface-lowest rounded-xl overflow-hidden shadow-ambient-lg">
                <div className="aspect-[16/10] lg:aspect-auto overflow-hidden">
                  <img src={featured.image} alt={featured.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <span className="tracking-editorial text-label-md text-primary font-body text-xs mb-4 block">{featured.category}</span>
                  <h2 className="font-serif text-headline-lg md:text-display-sm text-foreground mb-4 group-hover:text-primary transition-colors">{featured.title}</h2>
                  <p className="font-body text-muted-foreground leading-relaxed mb-6">{featured.excerpt}</p>
                  <div className="flex items-center gap-4 text-muted-foreground font-body text-sm">
                    <span className="flex items-center gap-1"><Calendar size={14} /> {featured.date}</span>
                    <span className="flex items-center gap-1"><Clock size={14} /> {featured.readTime}</span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rest.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link to={`/blog/${post.id}`} className="group block">
                  <div className="bg-surface-lowest rounded-xl overflow-hidden shadow-ambient hover:shadow-ambient-lg transition-all duration-500">
                    <div className="aspect-[16/10] overflow-hidden">
                      <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="tracking-editorial text-label-md text-primary font-body text-xs">{post.category}</span>
                        <span className="text-muted-foreground font-body text-xs flex items-center gap-1"><Clock size={12} /> {post.readTime}</span>
                      </div>
                      <h3 className="font-serif text-lg text-foreground mb-2 group-hover:text-primary transition-colors">{post.title}</h3>
                      <p className="font-body text-muted-foreground text-sm line-clamp-2 leading-relaxed">{post.excerpt}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;
