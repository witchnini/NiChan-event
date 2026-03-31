import { Link } from "react-router-dom";
import { Heart, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-surface-low py-20">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-6">
              <span className="font-serif text-headline-md text-primary font-bold">NiChan</span>
              <span className="font-serif text-headline-md text-foreground font-light"> Events</span>
            </Link>
            <p className="text-muted-foreground font-body leading-relaxed">
              Biến mọi khoảnh khắc thành kỷ niệm vĩnh cửu. Chúng tôi tạo nên những sự kiện đẹp như tranh vẽ.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-6 text-foreground">Khám phá</h4>
            <ul className="space-y-3">
              {[
                { label: "Dịch vụ", path: "/dich-vu" },
                { label: "Portfolio", path: "/portfolio" },
                { label: "Blog", path: "/blog" },
                { label: "Giới thiệu", path: "/gioi-thieu" },
              ].map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-muted-foreground hover:text-primary transition-colors font-body text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-6 text-foreground">Dịch vụ</h4>
            <ul className="space-y-3">
              {["Tiệc cưới", "Khai trương", "Hội nghị", "Gala Dinner", "Road Show"].map((s) => (
                <li key={s}>
                  <span className="text-muted-foreground font-body text-sm">{s}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-6 text-foreground">Liên hệ</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-primary mt-0.5 shrink-0" />
                <span className="text-muted-foreground font-body text-sm">Đông Phương- Đông Hưng- Thái Bình</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-primary shrink-0" />
                <span className="text-muted-foreground font-body text-sm">0123 456 789</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-primary shrink-0" />
                <span className="text-muted-foreground font-body text-sm">hello@nichanevents.vn</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 text-center" style={{ borderTop: '1px solid hsl(var(--outline-variant) / 0.2)' }}>
          <p className="text-muted-foreground font-body text-sm flex items-center justify-center gap-1">
            Made with <Heart size={14} className="text-primary fill-primary" /> by NiChan Events © 2026
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
