import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, MapPin, Users, Clock, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionHeading from "@/components/SectionHeading";
import heroImg from "@/assets/hero-wedding.jpg";
import eventGala from "@/assets/event-gala.jpg";
import eventOpening from "@/assets/event-opening.jpg";
import eventConference from "@/assets/event-conference.jpg";

const serviceData: Record<string, { title: string; desc: string; image: string; price: string; includes: string[]; process: string[] }> = {
  "tiec-cuoi": {
    title: "Tiệc Cưới",
    desc: "Ngày trọng đại nhất đời người xứng đáng được tổ chức một cách hoàn hảo. Chúng tôi mang đến trải nghiệm cưới trong mơ — từ concept sáng tạo, decor tinh tế đến chương trình lễ cưới cảm động, mỗi chi tiết đều được chăm chút tỉ mỉ.",
    image: heroImg,
    price: "150 - 400 triệu",
    includes: ["Thiết kế concept & mood board", "Trang trí hoa tươi & backdrop", "Âm thanh, ánh sáng chuyên nghiệp", "MC & ban nhạc", "Quản lý timeline lễ cưới", "Quay phim & chụp ảnh", "Thiệp cưới & welcome board", "Điều phối nhân sự ngày cưới"],
    process: ["Tư vấn & lên concept", "Khảo sát địa điểm", "Thiết kế & báo giá chi tiết", "Ký hợp đồng & đặt cọc", "Chuẩn bị & rehearsal", "Ngày diễn ra sự kiện", "Tổng kết & bàn giao"],
  },
  "gala-dinner": {
    title: "Gala Dinner",
    desc: "Đêm tiệc sang trọng và ấn tượng cho doanh nghiệp. Từ tiệc cuối năm đến lễ trao giải, chúng tôi tạo nên không gian hoành tráng với chương trình giải trí đặc sắc.",
    image: eventGala,
    price: "200 - 500 triệu",
    includes: ["Concept & theme design", "Stage design & LED wall", "Hệ thống âm thanh, ánh sáng", "Chương trình nghệ thuật", "MC song ngữ", "Dinner setup & menu design", "Lucky draw system", "Photo booth & backdrop"],
    process: ["Brief & creative proposal", "Concept presentation", "Production planning", "Technical setup", "Rehearsal", "Event night", "Post-event report"],
  },
  "khai-truong": {
    title: "Lễ Khai Trương",
    desc: "Khởi đầu rực rỡ cho doanh nghiệp của bạn với lễ khai trương ấn tượng, chuyên nghiệp, thu hút truyền thông và khách hàng.",
    image: eventOpening,
    price: "50 - 150 triệu",
    includes: ["Thiết kế concept khai trương", "Backdrop & bảng hiệu", "Kéo băng khánh thành", "Âm thanh & MC", "Tiệc finger food", "Quà tặng khách mời", "Quay phim & livestream", "PR & truyền thông"],
    process: ["Khảo sát & brief", "Lên kế hoạch chi tiết", "Thiết kế & sản xuất", "Setup hiện trường", "Lễ khai trương", "Bàn giao & báo cáo"],
  },
  "hoi-nghi": {
    title: "Hội Nghị & Hội Thảo",
    desc: "Tổ chức hội nghị chuyên nghiệp đẳng cấp quốc tế với hệ thống công nghệ hiện đại, phiên dịch đa ngôn ngữ và quản lý khách mời chặt chẽ.",
    image: eventConference,
    price: "300 - 800 triệu",
    includes: ["Thiết kế hội trường & stage", "Hệ thống AV chuyên nghiệp", "Phiên dịch cabin", "Registration system", "Tài liệu hội nghị", "F&B management", "Livestream & recording", "Quản lý VIP"],
    process: ["Briefing & proposal", "Venue selection", "Technical planning", "Speaker coordination", "Logistics & setup", "Event days", "Post-event analytics"],
  },
};

const ServiceDetail = () => {
  const { slug } = useParams();
  const service = serviceData[slug || ""] || serviceData["tiec-cuoi"];

  return (
    <div className="min-h-screen pt-24">
      {/* Hero */}
      <section className="relative h-[60vh] overflow-hidden">
        <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 flex items-end" style={{ background: 'linear-gradient(to top, hsl(var(--on-surface) / 0.8), transparent)' }}>
          <div className="container mx-auto px-6 pb-12">
            <Link to="/dich-vu" className="inline-flex items-center gap-2 text-primary-foreground/80 font-body text-sm mb-4 hover:text-primary-foreground transition-colors">
              <ArrowLeft size={16} /> Quay lại dịch vụ
            </Link>
            <h1 className="font-serif text-display-md md:text-display-lg text-primary-foreground">{service.title}</h1>
            <p className="font-body text-primary-foreground/80 text-lg mt-2 max-w-2xl">{service.desc}</p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* Main */}
            <div className="lg:col-span-2">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h2 className="font-serif text-headline-lg text-foreground mb-8">Dịch vụ bao gồm</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {service.includes.map((item) => (
                    <div key={item} className="flex items-start gap-3 p-4 bg-surface-lowest rounded-xl shadow-ambient">
                      <CheckCircle size={20} className="text-secondary shrink-0 mt-0.5" />
                      <span className="font-body text-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-16">
                <h2 className="font-serif text-headline-lg text-foreground mb-8">Quy trình làm việc</h2>
                <div className="space-y-6">
                  {service.process.map((step, i) => (
                    <div key={step} className="flex items-center gap-6">
                      <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-serif font-bold shrink-0">
                        {i + 1}
                      </div>
                      <div className="flex-1 p-4 bg-surface-low rounded-xl">
                        <span className="font-body text-foreground">{step}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div>
              <div className="bg-surface-lowest rounded-xl p-8 shadow-ambient-lg sticky top-28">
                <span className="tracking-editorial text-label-md text-primary font-body text-xs block mb-4">Giá tham khảo</span>
                <p className="font-serif text-headline-lg text-foreground mb-6">{service.price}</p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 text-muted-foreground font-body text-sm">
                    <Clock size={16} className="text-primary" /> Thời gian chuẩn bị: 2-4 tuần
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground font-body text-sm">
                    <Users size={16} className="text-primary" /> Đội ngũ 10-20 nhân sự
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground font-body text-sm">
                    <MapPin size={16} className="text-primary" /> Toàn quốc
                  </div>
                </div>

                <Link to="/lien-he" className="block">
                  <Button variant="hero" size="lg" className="w-full">
                    Yêu cầu báo giá <ArrowRight size={16} />
                  </Button>
                </Link>

                <p className="font-body text-muted-foreground text-xs text-center mt-4">
                  Miễn phí tư vấn • Phản hồi trong 24h
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServiceDetail;
