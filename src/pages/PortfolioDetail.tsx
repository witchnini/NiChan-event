import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, MapPin, Calendar, ArrowLeft, CheckCircle2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import portfolio1 from "@/assets/portfolio-1.jpg";
import portfolio2 from "@/assets/portfolio-2.jpg";
import portfolio3 from "@/assets/portfolio-3.jpg";
import heroImg from "@/assets/hero-wedding.jpg";
import eventGala from "@/assets/event-gala.jpg";
import eventOpening from "@/assets/event-opening.jpg";

const projects = [
  {
    slug: "tiec-cuoi-hoa-anh-dao",
    title: "Tiệc Cưới Hoa Anh Đào",
    category: "Wedding",
    guests: 300,
    location: "Đà Lạt",
    date: "03/2026",
    image: portfolio1,
    desc: "Tiệc cưới ngoài trời thơ mộng giữa vườn hoa anh đào, concept Nhật Bản.",
    fullDesc: "Một đám cưới outdoor đậm chất Nhật Bản giữa vườn hoa anh đào Đà Lạt. Với concept \"Sakura Dream\", chúng tôi đã biến khu vườn thành một không gian cổ tích với hàng nghìn cánh hoa anh đào trang trí, đèn lồng truyền thống và sân khấu gỗ tự nhiên. 300 khách mời đã được trải nghiệm ẩm thực fusion Việt-Nhật và chương trình nghệ thuật đặc sắc.",
    services: ["Thiết kế concept & decor", "Âm thanh ánh sáng", "Ẩm thực fusion", "MC song ngữ", "Nhiếp ảnh & Quay phim", "Quản lý sự kiện"],
    client: "Anh Minh & Chị Hà",
    rating: 5,
    testimonial: "Đám cưới trong mơ của chúng tôi đã thành hiện thực nhờ đội ngũ tuyệt vời. Mọi chi tiết đều hoàn hảo!",
    gallery: [portfolio1, portfolio2, portfolio3],
  },
  {
    slug: "anniversary-gala-night",
    title: "Anniversary Gala Night",
    category: "Gala",
    guests: 500,
    location: "TP.HCM",
    date: "12/2025",
    image: portfolio2,
    desc: "Đêm gala kỷ niệm 20 năm thành lập với 500 khách mời VIP.",
    fullDesc: "Đêm gala kỷ niệm 20 năm thành lập tập đoàn với quy mô 500 khách mời VIP tại khách sạn 5 sao. Sân khấu LED panorama 180 độ, hệ thống âm thanh Dolby Atmos và chương trình biểu diễn của các nghệ sĩ hàng đầu Việt Nam đã tạo nên một đêm đáng nhớ.",
    services: ["Sân khấu LED panorama", "Âm thanh Dolby Atmos", "Nghệ sĩ biểu diễn", "Tiệc buffet cao cấp", "Photo booth", "Quản lý sự kiện"],
    client: "Tập đoàn ABC",
    rating: 5,
    testimonial: "Chuyên nghiệp từ khâu lên ý tưởng đến thực hiện. Đêm gala đã vượt xa mong đợi của chúng tôi!",
    gallery: [portfolio2, eventGala, portfolio1],
  },
  {
    slug: "festival-road-show",
    title: "Festival Road Show",
    category: "Road Show",
    guests: 2000,
    location: "Toàn quốc",
    date: "08/2025",
    image: portfolio3,
    desc: "Road show xuyên Việt 5 thành phố, thu hút hơn 2000 người tham gia.",
    fullDesc: "Chuỗi road show xuyên Việt qua 5 thành phố lớn: Hà Nội, Đà Nẵng, Nha Trang, TP.HCM và Cần Thơ. Mỗi điểm dừng là một lễ hội âm nhạc mini với sân khấu di động, booth trải nghiệm sản phẩm và các hoạt động tương tác thu hút hơn 2000 người tham gia.",
    services: ["Sân khấu di động", "Booth trải nghiệm", "Logistics 5 thành phố", "Truyền thông & PR", "Nhân sự hiện trường", "Báo cáo & đánh giá"],
    client: "Thương hiệu XYZ",
    rating: 5,
    testimonial: "Quy mô lớn nhưng vẫn đảm bảo chất lượng đồng đều ở mọi thành phố. Rất ấn tượng!",
    gallery: [portfolio3, eventOpening, heroImg],
  },
  {
    slug: "le-cuoi-ben-bien",
    title: "Lễ Cưới Bên Biển",
    category: "Wedding",
    guests: 150,
    location: "Phú Quốc",
    date: "02/2026",
    image: heroImg,
    desc: "Destination wedding lãng mạn bên bờ biển hoàng hôn Phú Quốc.",
    fullDesc: "Destination wedding lãng mạn trên bãi biển hoàng hôn Phú Quốc. Concept \"Sunset Romance\" với tông màu pastel, hoa tươi nhập khẩu và bàn tiệc dài trên cát trắng. 150 khách mời đã cùng chứng kiến khoảnh khắc thiêng liêng dưới ánh hoàng hôn tuyệt đẹp.",
    services: ["Destination wedding planning", "Trang trí bãi biển", "Hoa tươi nhập khẩu", "Tiệc BBQ bên biển", "Live band acoustic", "Drone filming"],
    client: "Anh Khoa & Chị Linh",
    rating: 5,
    testimonial: "Không thể tin được đám cưới bên biển lại có thể hoàn hảo đến vậy. Cảm ơn đội ngũ rất nhiều!",
    gallery: [heroImg, portfolio1, portfolio2],
  },
  {
    slug: "gala-year-end-party",
    title: "Gala Year End Party",
    category: "Gala",
    guests: 800,
    location: "Hà Nội",
    date: "01/2026",
    image: eventGala,
    desc: "Tiệc cuối năm hoành tráng với sân khấu LED 360 độ.",
    fullDesc: "Tiệc cuối năm quy mô 800 khách tại Trung tâm Hội nghị Quốc gia. Điểm nhấn là sân khấu LED 360 độ đầu tiên tại Việt Nam, kết hợp hologram và laser show. Chương trình bao gồm trao giải, dinner show và after party với DJ quốc tế.",
    services: ["Sân khấu LED 360°", "Hologram & laser show", "DJ quốc tế", "Dinner show", "Trao giải thưởng", "After party"],
    client: "Công ty DEF",
    rating: 5,
    testimonial: "Sân khấu LED 360 độ thực sự là điểm nhấn. Nhân viên ai cũng phấn khích!",
    gallery: [eventGala, portfolio2, portfolio3],
  },
  {
    slug: "grand-opening-mall",
    title: "Grand Opening Mall",
    category: "Khai trương",
    guests: 1000,
    location: "TP.HCM",
    date: "06/2025",
    image: eventOpening,
    desc: "Lễ khai trương trung tâm thương mại với nghệ sĩ hàng đầu.",
    fullDesc: "Lễ khai trương trung tâm thương mại lớn nhất khu vực phía Nam với sự tham gia của 1000 khách mời và hàng nghìn người dân. Chương trình gồm lễ cắt băng khánh thành, biểu diễn nghệ thuật của top artists, mini concert và các hoạt động khuyến mãi đặc biệt.",
    services: ["Lễ cắt băng khánh thành", "Mini concert", "Booth activation", "Truyền thông & báo chí", "An ninh sự kiện", "Quản lý đám đông"],
    client: "Tập đoàn GHI",
    rating: 5,
    testimonial: "Sự kiện khai trương thành công ngoài mong đợi. Lượng khách đổ về rất đông!",
    gallery: [eventOpening, eventGala, heroImg],
  },
];

const PortfolioDetail = () => {
  const { slug } = useParams();
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-serif text-headline-lg text-foreground mb-4">Không tìm thấy dự án</h1>
          <Link to="/portfolio">
            <Button variant="hero">Quay lại Portfolio</Button>
          </Link>
        </div>
      </div>
    );
  }

  const otherProjects = projects.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <div className="min-h-screen pt-24">
      {/* Hero */}
      <section className="relative h-[60vh] overflow-hidden">
        <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
          <div className="container mx-auto">
            <Link to="/portfolio" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 font-body text-sm transition-colors">
              <ArrowLeft size={16} /> Quay lại Portfolio
            </Link>
            <span className="block px-3 py-1 rounded-lg bg-white/20 backdrop-blur-sm font-body text-xs font-semibold text-white w-fit mb-3">{project.category}</span>
            <h1 className="font-serif text-3xl md:text-5xl text-white mb-4">{project.title}</h1>
            <div className="flex flex-wrap items-center gap-6 text-white/80 text-sm font-body">
              <span className="flex items-center gap-2"><Users size={16} /> {project.guests} khách</span>
              <span className="flex items-center gap-2"><MapPin size={16} /> {project.location}</span>
              <span className="flex items-center gap-2"><Calendar size={16} /> {project.date}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main */}
            <div className="lg:col-span-2 space-y-10">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h2 className="font-serif text-headline-lg text-foreground mb-4">Về dự án</h2>
                <p className="font-body text-muted-foreground leading-relaxed">{project.fullDesc}</p>
              </motion.div>

              {/* Gallery */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <h2 className="font-serif text-headline-lg text-foreground mb-6">Hình ảnh sự kiện</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {project.gallery.map((img, i) => (
                    <div key={i} className="aspect-[4/3] rounded-xl overflow-hidden">
                      <img src={img} alt={`${project.title} - ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Testimonial */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-surface-low rounded-2xl p-8">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: project.rating }).map((_, i) => (
                    <Star key={i} size={18} className="fill-primary text-primary" />
                  ))}
                </div>
                <p className="font-body text-foreground italic leading-relaxed mb-4">"{project.testimonial}"</p>
                <p className="font-body text-muted-foreground text-sm font-semibold">— {project.client}</p>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-surface-low rounded-2xl p-6">
                <h3 className="font-serif text-headline-md text-foreground mb-4">Thông tin dự án</h3>
                <div className="space-y-4 font-body text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Khách hàng</span><span className="text-foreground font-medium">{project.client}</span></div>
                  <div className="border-t border-border" />
                  <div className="flex justify-between"><span className="text-muted-foreground">Loại sự kiện</span><span className="text-foreground font-medium">{project.category}</span></div>
                  <div className="border-t border-border" />
                  <div className="flex justify-between"><span className="text-muted-foreground">Số khách</span><span className="text-foreground font-medium">{project.guests}</span></div>
                  <div className="border-t border-border" />
                  <div className="flex justify-between"><span className="text-muted-foreground">Địa điểm</span><span className="text-foreground font-medium">{project.location}</span></div>
                  <div className="border-t border-border" />
                  <div className="flex justify-between"><span className="text-muted-foreground">Thời gian</span><span className="text-foreground font-medium">{project.date}</span></div>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="bg-surface-low rounded-2xl p-6">
                <h3 className="font-serif text-headline-md text-foreground mb-4">Dịch vụ cung cấp</h3>
                <ul className="space-y-3">
                  {project.services.map((s, i) => (
                    <li key={i} className="flex items-center gap-3 font-body text-sm text-foreground">
                      <CheckCircle2 size={16} className="text-primary shrink-0" /> {s}
                    </li>
                  ))}
                </ul>
              </motion.div>

              <Link to="/lien-he">
                <Button variant="hero" className="w-full">Liên hệ tư vấn</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Related */}
      <section className="py-16 bg-surface-low">
        <div className="container mx-auto px-6">
          <h2 className="font-serif text-headline-lg text-foreground text-center mb-10">Dự án khác</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {otherProjects.map((p) => (
              <Link key={p.slug} to={`/portfolio/${p.slug}`} className="group">
                <div className="bg-surface-lowest rounded-xl overflow-hidden shadow-ambient hover:shadow-ambient-lg transition-all duration-500">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img src={p.image} alt={p.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  <div className="p-5">
                    <span className="font-body text-xs text-primary font-semibold">{p.category}</span>
                    <h3 className="font-serif text-headline-sm text-foreground mt-1">{p.title}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PortfolioDetail;
