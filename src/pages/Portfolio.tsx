import { useState } from "react";
import { motion } from "framer-motion";
import { Users, MapPin, Calendar } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import portfolio1 from "@/assets/portfolio-1.jpg";
import portfolio2 from "@/assets/portfolio-2.jpg";
import portfolio3 from "@/assets/portfolio-3.jpg";
import heroImg from "@/assets/hero-wedding.jpg";
import eventGala from "@/assets/event-gala.jpg";
import eventOpening from "@/assets/event-opening.jpg";

const categories = ["Tất cả", "Wedding", "Gala", "Khai trương", "Hội nghị", "Road Show"];

const projects = [
  { title: "Tiệc Cưới Hoa Anh Đào", category: "Wedding", guests: 300, location: "Đà Lạt", date: "03/2026", image: portfolio1, desc: "Tiệc cưới ngoài trời thơ mộng giữa vườn hoa anh đào, concept Nhật Bản." },
  { title: "Anniversary Gala Night", category: "Gala", guests: 500, location: "TP.HCM", date: "12/2025", image: portfolio2, desc: "Đêm gala kỷ niệm 20 năm thành lập với 500 khách mời VIP." },
  { title: "Festival Road Show", category: "Road Show", guests: 2000, location: "Toàn quốc", date: "08/2025", image: portfolio3, desc: "Road show xuyên Việt 5 thành phố, thu hút hơn 2000 người tham gia." },
  { title: "Lễ Cưới Bên Biển", category: "Wedding", guests: 150, location: "Phú Quốc", date: "02/2026", image: heroImg, desc: "Destination wedding lãng mạn bên bờ biển hoàng hôn Phú Quốc." },
  { title: "Gala Year End Party", category: "Gala", guests: 800, location: "Hà Nội", date: "01/2026", image: eventGala, desc: "Tiệc cuối năm hoành tráng với sân khấu LED 360 độ." },
  { title: "Grand Opening Mall", category: "Khai trương", guests: 1000, location: "TP.HCM", date: "06/2025", image: eventOpening, desc: "Lễ khai trương trung tâm thương mại với nghệ sĩ hàng đầu." },
];

const Portfolio = () => {
  const [active, setActive] = useState("Tất cả");
  const filtered = active === "Tất cả" ? projects : projects.filter((p) => p.category === active);

  return (
    <div className="min-h-screen pt-24">
      <section className="py-16 bg-surface-low">
        <div className="container mx-auto px-6">
          <SectionHeading
            label="Portfolio"
            title="Hành trình sáng tạo"
            subtitle="Mỗi sự kiện là một tác phẩm nghệ thuật, mỗi kỷ niệm là một câu chuyện đáng trân trọng."
          />
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap gap-3 mb-12 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`px-5 py-2.5 rounded-xl font-body text-sm transition-all duration-300 ${
                  active === cat ? "gradient-primary text-primary-foreground shadow-ambient" : "bg-surface-low text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((project, i) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                layout
                className="group"
              >
                <div className="bg-surface-lowest rounded-xl overflow-hidden shadow-ambient hover:shadow-ambient-lg transition-all duration-500">
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <img src={project.image} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-lg glass font-body text-xs font-semibold text-foreground">{project.category}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-serif text-headline-md text-foreground mb-2">{project.title}</h3>
                    <p className="font-body text-muted-foreground text-sm leading-relaxed mb-4">{project.desc}</p>
                    <div className="flex flex-wrap items-center gap-4 text-muted-foreground text-xs font-body">
                      <span className="flex items-center gap-1"><Users size={12} /> {project.guests} khách</span>
                      <span className="flex items-center gap-1"><MapPin size={12} /> {project.location}</span>
                      <span className="flex items-center gap-1"><Calendar size={12} /> {project.date}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Portfolio;
