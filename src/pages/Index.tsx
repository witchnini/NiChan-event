import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Star, Calendar, Users, Award, ChevronRight } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import heroImg from "@/assets/hero-wedding.jpg";
import eventGala from "@/assets/event-gala.jpg";
import eventOpening from "@/assets/event-opening.jpg";
import eventConference from "@/assets/event-conference.jpg";
import portfolio1 from "@/assets/portfolio-1.jpg";
import portfolio2 from "@/assets/portfolio-2.jpg";
import portfolio3 from "@/assets/portfolio-3.jpg";

const services = [
  { title: "Tiệc Cưới", desc: "Ngày trọng đại, kỷ niệm vĩnh cửu", image: heroImg, slug: "tiec-cuoi" },
  { title: "Gala Dinner", desc: "Đêm tiệc sang trọng & ấn tượng", image: eventGala, slug: "gala-dinner" },
  { title: "Khai Trương", desc: "Khởi đầu rực rỡ cho doanh nghiệp", image: eventOpening, slug: "khai-truong" },
  { title: "Hội Nghị", desc: "Chuyên nghiệp, đẳng cấp quốc tế", image: eventConference, slug: "hoi-nghi" },
];

const stats = [
  { number: "500+", label: "Sự kiện thành công" },
  { number: "12+", label: "Năm kinh nghiệm" },
  { number: "98%", label: "Khách hàng hài lòng" },
  { number: "50+", label: "Đối tác tin cậy" },
];

const testimonials = [
  { name: "Nguyễn Thanh Hà", role: "CEO, Công ty ABC", text: "NiChan Events đã biến đám cưới của tôi thành một giấc mơ cổ tích. Mọi chi tiết đều hoàn hảo!", rating: 5 },
  { name: "Trần Minh Đức", role: "Giám đốc Marketing, XYZ Corp", text: "Sự kiện khai trương được tổ chức chuyên nghiệp, vượt ngoài mong đợi. Chắc chắn sẽ hợp tác lâu dài!", rating: 5 },
  { name: "Lê Thị Hương", role: "Phó TGĐ, Tập đoàn DEF", text: "Gala dinner cuối năm quá ấn tượng! Đội ngũ sáng tạo, tận tâm và luôn lắng nghe khách hàng.", rating: 5 },
];

const portfolioItems = [
  { title: "Tiệc Cưới Hoa Anh Đào", category: "Wedding", guests: 300, image: portfolio1 },
  { title: "Anniversary Gala Night", category: "Gala", guests: 500, image: portfolio2 },
  { title: "Festival Road Show 2025", category: "Road Show", guests: 2000, image: portfolio3 },
];

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImg} alt="NiChan Events" className="w-full h-full object-cover" width={1920} height={1080} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, hsl(var(--surface) / 0.85), hsl(var(--surface) / 0.4))' }} />
        </div>

        <div className="container mx-auto px-6 relative z-10 pt-24">
          <div className="max-w-3xl">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="tracking-editorial text-label-md text-primary font-body font-semibold mb-6 block"
            >
              ✿ NiChan Events
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="font-serif text-display-lg md:text-[4.5rem] leading-[1.05] text-foreground mb-8"
            >
              Biến mọi khoảnh khắc thành{" "}
              <span className="text-primary italic">kỷ niệm vĩnh cửu</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="font-body text-lg text-muted-foreground leading-relaxed mb-10 max-w-xl"
            >
              Chúng tôi tạo nên những sự kiện đẹp như tranh vẽ — từ tiệc cưới lãng mạn đến gala dinner sang trọng, mỗi sự kiện là một câu chuyện riêng.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-wrap gap-4"
            >
              <Link to="/lien-he">
                <Button variant="hero" size="lg" className="text-base px-8 py-6">
                  Bắt đầu câu chuyện của bạn <ArrowRight size={18} />
                </Button>
              </Link>
              <Link to="/portfolio">
                <Button variant="tertiary" size="lg" className="text-base px-8 py-6">
                  Xem Portfolio
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Floating floral element */}
        <motion.div
          animate={{ y: [-10, 10, -10] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 right-20 text-6xl opacity-20 hidden lg:block"
        >
          🌸
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-surface-low">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <span className="font-serif text-display-sm md:text-display-md text-primary font-bold block">{stat.number}</span>
                <span className="font-body text-muted-foreground text-sm mt-2 block">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <SectionHeading
            label="Dịch vụ của chúng tôi"
            title="Mỗi sự kiện, một tuyệt tác"
            subtitle="Từ lễ cưới thơ mộng đến hội nghị đẳng cấp, chúng tôi mang đến trải nghiệm không thể quên."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, i) => (
              <motion.div
                key={service.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <Link to={`/dich-vu/${service.slug}`} className="group block">
                  <div className="relative overflow-hidden rounded-xl shadow-ambient">
                    <div className="aspect-[16/10] overflow-hidden">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <div className="absolute inset-0 flex flex-col justify-end p-8" style={{ background: 'linear-gradient(to top, hsl(var(--on-surface) / 0.7), transparent)' }}>
                      <h3 className="font-serif text-headline-lg text-primary-foreground mb-1">{service.title}</h3>
                      <p className="font-body text-primary-foreground/80 text-sm">{service.desc}</p>
                      <span className="mt-3 inline-flex items-center gap-1 text-primary-foreground/90 font-body text-sm group-hover:gap-2 transition-all">
                        Khám phá <ChevronRight size={14} />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Preview */}
      <section className="py-24 bg-surface-low">
        <div className="container mx-auto px-6">
          <SectionHeading
            label="Portfolio"
            title="Câu chuyện qua từng sự kiện"
            subtitle="Những khoảnh khắc đẹp nhất mà chúng tôi đã tạo nên cùng khách hàng."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {portfolioItems.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="group"
              >
                <div className="bg-surface-lowest rounded-xl overflow-hidden shadow-ambient hover:shadow-ambient-lg transition-shadow duration-500">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-6">
                    <span className="tracking-editorial text-label-md text-primary font-body text-xs">{item.category}</span>
                    <h3 className="font-serif text-headline-md text-foreground mt-2 mb-2">{item.title}</h3>
                    <div className="flex items-center gap-4 text-muted-foreground font-body text-sm">
                      <span className="flex items-center gap-1"><Users size={14} /> {item.guests} khách</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/portfolio">
              <Button variant="tertiary" size="lg">
                Xem tất cả dự án <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <SectionHeading
            label="Khách hàng nói gì"
            title="Lời tri ân từ trái tim"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="bg-surface-lowest rounded-xl p-8 shadow-ambient"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={16} className="text-primary fill-primary" />
                  ))}
                </div>
                <p className="font-body text-foreground leading-relaxed mb-6 italic">"{t.text}"</p>
                <div>
                  <p className="font-serif font-semibold text-foreground">{t.name}</p>
                  <p className="font-body text-sm text-muted-foreground">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-surface-low">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-5xl mb-6 block">✿</span>
            <h2 className="font-serif text-display-sm md:text-display-md text-foreground mb-6">
              Sẵn sàng tạo nên<br /><span className="text-primary italic">câu chuyện của riêng bạn?</span>
            </h2>
            <p className="font-body text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
              Hãy để chúng tôi lắng nghe ý tưởng của bạn và biến nó thành hiện thực.
            </p>
            <Link to="/lien-he">
              <Button variant="hero" size="lg" className="text-base px-10 py-6">
                Gửi yêu cầu báo giá <ArrowRight size={18} />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;
