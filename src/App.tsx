import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Index from "./pages/Index.tsx";
import Services from "./pages/Services.tsx";
import ServiceDetail from "./pages/ServiceDetail.tsx";
import Portfolio from "./pages/Portfolio.tsx";
import Blog from "./pages/Blog.tsx";
import BlogDetail from "./pages/BlogDetail.tsx";
import Contact from "./pages/Contact.tsx";
import About from "./pages/About.tsx";
import NotFound from "./pages/NotFound.tsx";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import CustomerDashboard from "./pages/customer/CustomerDashboard.tsx";
import MyEvents from "./pages/customer/MyEvents.tsx";
import EventTracking from "./pages/customer/EventTracking.tsx";
import MyContracts from "./pages/customer/MyContracts.tsx";
import AdminLayout from "./pages/admin/AdminLayout.tsx";
import AdminDashboard from "./pages/admin/AdminDashboard.tsx";
import AdminRequests from "./pages/admin/AdminRequests.tsx";
import AdminProjects from "./pages/admin/AdminProjects.tsx";
import AdminStaff from "./pages/admin/AdminStaff.tsx";
import AdminVendors from "./pages/admin/AdminVendors.tsx";
import AdminFinance from "./pages/admin/AdminFinance.tsx";
import AdminContracts from "./pages/admin/AdminContracts.tsx";
import AdminReports from "./pages/admin/AdminReports.tsx";
import AdminContent from "./pages/admin/AdminContent.tsx";
import AdminUsers from "./pages/admin/AdminUsers.tsx";

const queryClient = new QueryClient();

// Layout wrapper for public pages (with Navbar + Footer)
const PublicLayout = ({ children }: { children: React.ReactNode }) => (
  <>
    <Navbar />
    {children}
    <Footer />
  </>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Auth pages - no navbar/footer */}
          <Route path="/dang-nhap" element={<Login />} />
          <Route path="/dang-ky" element={<Register />} />

          {/* Admin panel - own layout */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="yeu-cau" element={<AdminRequests />} />
            <Route path="du-an" element={<AdminProjects />} />
            <Route path="nhan-su" element={<AdminStaff />} />
            <Route path="nha-cung-cap" element={<AdminVendors />} />
            <Route path="tai-chinh" element={<AdminFinance />} />
            <Route path="hop-dong" element={<AdminContracts />} />
            <Route path="bao-cao" element={<AdminReports />} />
            <Route path="noi-dung" element={<AdminContent />} />
            <Route path="nguoi-dung" element={<AdminUsers />} />
          </Route>

          {/* Public pages */}
          <Route path="/" element={<PublicLayout><Index /></PublicLayout>} />
          <Route path="/dich-vu" element={<PublicLayout><Services /></PublicLayout>} />
          <Route path="/dich-vu/:slug" element={<PublicLayout><ServiceDetail /></PublicLayout>} />
          <Route path="/portfolio" element={<PublicLayout><Portfolio /></PublicLayout>} />
          <Route path="/blog" element={<PublicLayout><Blog /></PublicLayout>} />
          <Route path="/blog/:id" element={<PublicLayout><BlogDetail /></PublicLayout>} />
          <Route path="/lien-he" element={<PublicLayout><Contact /></PublicLayout>} />
          <Route path="/gioi-thieu" element={<PublicLayout><About /></PublicLayout>} />

          {/* Customer dashboard */}
          <Route path="/dashboard" element={<PublicLayout><CustomerDashboard /></PublicLayout>} />
          <Route path="/dashboard/su-kien" element={<PublicLayout><MyEvents /></PublicLayout>} />
          <Route path="/dashboard/su-kien/:id" element={<PublicLayout><EventTracking /></PublicLayout>} />
          <Route path="/dashboard/hop-dong" element={<PublicLayout><MyContracts /></PublicLayout>} />

          <Route path="*" element={<PublicLayout><NotFound /></PublicLayout>} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
