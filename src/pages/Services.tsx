import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Filter, Users, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SectionHeading from "@/components/SectionHeading";
import heroImg from "@/assets/hero-wedding.jpg";
import eventGala from "@/assets/event-gala.jpg";
import eventOpening from "@/assets/event-opening.jpg";
import eventConference from "@/assets/event-conference.jpg";
import portfolio1 from "@/assets/portfolio-1.jpg";
import portfolio2 from "@/assets/portfolio-2.jpg";
import portfolio3 from "@/assets/portfolio-3.jpg";

const categories = ["Tất cả", "Tiệc cưới", "Khai trương", "Gala Dinner", "Hội nghị", "Road Show", "Kỷ niệm", "Online Event"];

const allServices = [
  { id: 1, title: "Tiệc Cưới Truyền Thống", category: "Tiệc cưới", price: "150 - 300 triệu", guests: "100-300", location: "TP.HCM", image: heroImg, desc: "Tiệc cưới mang phong cách truyền thống Việt Nam kết hợp hiện đại, trang trọng và ấm cúng." },
  { id: 2, title: "Gala Dinner Doanh Nghiệp", category: "Gala Dinner", price: "200 - 500 triệu", guests: "200-500", location: "TP.HCM", image: eventGala, desc: "Đêm tiệc sang trọng với chương trình giải trí đặc sắc, phù hợp cho tiệc cuối năm." },
  { id: 3, title: "Lễ Khai Trương", category: "Khai trương", price: "50 - 150 triệu", guests: "50-200", location: "Hà Nội", image: eventOpening, desc: "Tổ chức lễ khai trương chuyên nghiệp, tạo ấn tượng mạnh mẽ cho ngày đầu tiên." },
  { id: 4, title: "Hội Nghị Quốc Tế", category: "Hội nghị", price: "300 - 800 triệu", guests: "100-1000", location: "Đà Nẵng", image: eventConference, desc: "Hội nghị đẳng cấp quốc tế với hệ thống âm thanh, ánh sáng hiện đại nhất." },
  { id: 5, title: "Tiệc Cưới Outdoor", category: "Tiệc cưới", price: "200 - 400 triệu", guests: "100-200", location: "Đà Lạt", image: portfolio1, desc: "Tiệc cưới ngoài trời lãng mạn với hoa tươi và ánh nến lung linh." },
  { id: 6, title: "Tiệc Kỷ Niệm Thành Lập", category: "Kỷ niệm", price: "100 - 300 triệu", guests: "100-500", location: "TP.HCM", image: portfolio2, desc: "Kỷ niệm ngày thành lập doanh nghiệp với chương trình ý nghĩa và ấn tượng." },
  { id: 7, title: "Road Show Activation", category: "Road Show", price: "100 - 250 triệu", guests: "500-2000", location: "Toàn quốc", image: portfolio3, desc: "Sự kiện roadshow quảng bá thương hiệu sôi động, thu hút khách hàng tiềm năng." },
  { id: 8, title: "Hội Thảo Chuyên Đề", category: "Hội nghị", price: "80 - 200 triệu", guests: "50-300", location: "TP.HCM", image: eventConference, desc: "Hội thảo chuyên sâu với hệ thống streaming trực tuyến tích hợp." },
];

const Services = () => {
  const [activeCategory, setActiveCategory] = useState("Tất cả");
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = allServices.filter((s) => {
    const matchCat = activeCategory === "Tất cả" || s.category === activeCategory;
    const matchSearch = s.title.toLowerCase().includes(searchTerm.toLowerCase()) || s.desc.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen pt-24">
      {/* Header */}
      <section className="py-16 bg-surface-low">
        <div className="container mx-auto px-6">
          <SectionHeading
            label="Khám phá dịch vụ"
            title="Dịch vụ tổ chức sự kiện"
            subtitle="Tìm kiếm gói dịch vụ phù hợp cho sự kiện của bạn từ tiệc cưới đến hội nghị quốc tế."
          />

          {/* Search */}
          <div className="max-w-2xl mx-auto relative">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm dịch vụ, loại sự kiện..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 py-6 text-base rounded-xl bg-surface-lowest shadow-ambient font-body"
              style={{ border: 'none' }}
            />
          </div>
        </div>
      </section>

      {/* Filters & Listing */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          {/* Category pills */}
          <div className="flex flex-wrap gap-3 mb-12 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-xl font-body text-sm transition-all duration-300 ${
                  activeCategory === cat
                    ? "gradient-primary text-primary-foreground shadow-ambient"
                    : "bg-surface-low text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((service, i) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                layout
              >
                <Link to={`/dich-vu/${service.id}`} className="group block">
                  <div className="bg-surface-lowest rounded-xl overflow-hidden shadow-ambient hover:shadow-ambient-lg transition-all duration-500">
                    <div className="aspect-[16/10] overflow-hidden">
                      <img src={service.image} alt={service.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                    </div>
                    <div className="p-6">
                      <span className="tracking-editorial text-label-md text-primary font-body text-xs">{service.category}</span>
                      <h3 className="font-serif text-headline-md text-foreground mt-2 mb-2">{service.title}</h3>
                      <p className="font-body text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2">{service.desc}</p>
                      <div className="flex items-center justify-between">
                        <span className="font-body text-primary font-semibold text-sm">{service.price}</span>
                        <div className="flex items-center gap-3 text-muted-foreground text-xs font-body">
                          <span className="flex items-center gap-1"><Users size={12} /> {service.guests}</span>
                          <span className="flex items-center gap-1"><MapPin size={12} /> {service.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="font-body text-muted-foreground text-lg">Không tìm thấy dịch vụ phù hợp. Hãy thử từ khóa khác!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Services;
