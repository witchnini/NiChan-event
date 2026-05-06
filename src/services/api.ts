// ============================================================
// REAL API SERVICE — NiChan Event
// Kết nối tới backend thật qua apiClient (có JWT auth)
// ============================================================

import { apiClient } from "./apiClient";
import * as mock from "./mockData";

// ─── Helpers ─────────────────────────────────────────────────

/** Trả mock data tạm cho các chart/UI-only functions chưa có endpoint */
const delay = (ms: number = 300) => new Promise((resolve) => setTimeout(resolve, ms));

// ─── PUBLIC ──────────────────────────────────────────────────

export const getPublicServices = async () =>
  apiClient.get<typeof mock.mockPublicServices>("/public/services?featured=true");

export const getStats = async () => {
  // Static marketing numbers — không cần DB
  await delay(100);
  return [...mock.mockStats];
};

export const getTestimonials = async () =>
  apiClient.get<typeof mock.mockTestimonials>("/public/testimonials");

export const getPortfolioItems = async () =>
  apiClient.get<typeof mock.mockPortfolioItems>("/public/portfolio");

export const getServiceCategories = async () =>
  apiClient.get<typeof mock.mockServiceCategories>("/public/service-categories");

export const getAllServices = async () =>
  apiClient.get<typeof mock.mockAllServices>("/public/services");

// ─── CUSTOMER ────────────────────────────────────────────────

export const getCustomerEvents = async () =>
  apiClient.get<typeof mock.mockCustomerEvents>("/customer/events");

export const getRecentActivities = async () => {
  const dashboard = await apiClient.get<{ recentActivities: typeof mock.mockRecentActivities }>(
    "/customer/dashboard",
  );
  return dashboard.recentActivities;
};

export const getContracts = async () =>
  apiClient.get<typeof mock.mockContracts>("/customer/contracts");

export const getReviews = async () =>
  apiClient.get<typeof mock.mockReviews>("/customer/reviews");

export const getReviewCriteria = async () =>
  apiClient.get<typeof mock.mockReviewCriteria>("/public/review-criteria");

export const getMilestones = async (eventId?: string) => {
  if (!eventId) return [];
  return apiClient.get<typeof mock.mockMilestones>(`/customer/events/${eventId}/milestones`);
};

export const getChatMessages = async (eventId?: string) => {
  if (!eventId) return [];
  return apiClient.get<typeof mock.mockChatMessages>(
    `/customer/events/${eventId}/chat-messages`,
  );
};

export const getDocuments = async () =>
  apiClient.get<typeof mock.mockDocuments>("/customer/documents");

export const getTransactions = async () =>
  apiClient.get<typeof mock.mockTransactions>("/customer/transactions");

// ─── ORGANIZER ───────────────────────────────────────────────

export const getKanbanColumns = async (projectId?: string) => {
  if (!projectId) return JSON.parse(JSON.stringify(mock.mockKanbanColumns));
  return apiClient.get<typeof mock.mockKanbanColumns>(
    `/organizer/projects/${projectId}/kanban`,
  );
};

export const getGanttData = async () => {
  // UI-only — không có backend endpoint
  await delay();
  return [...mock.mockGanttData];
};

export const getOrgProjectProgress = async () =>
  apiClient.get<typeof mock.mockOrgProjectProgress>("/organizer/reports/project-progress");

export const getTasksByStatus = async () => {
  // Derive từ dashboard
  await delay();
  return [...mock.mockTasksByStatus];
};

export const getWeeklyWorkload = async () => {
  // UI-only chart
  await delay();
  return [...mock.mockWeeklyWorkload];
};

export const getUpcomingTasks = async () => {
  const dashboard = await apiClient.get<{ upcomingTasks: typeof mock.mockUpcomingTasks }>(
    "/organizer/dashboard",
  );
  return dashboard.upcomingTasks ?? [];
};

export const getOrgStaff = async () =>
  apiClient.get<typeof mock.mockOrgStaff>("/organizer/staff");

export const getShifts = async () =>
  apiClient.get<typeof mock.mockShifts>("/organizer/staff/shifts");

export const getVendors = async () =>
  apiClient.get<typeof mock.mockVendors>("/organizer/vendors");

export const getVendorCategories = async () =>
  apiClient.get<typeof mock.mockVendorCategories>("/organizer/vendor-categories");

export const getProjectBudgets = async (projectId?: string) => {
  if (!projectId) return JSON.parse(JSON.stringify(mock.mockProjectBudgets));
  return apiClient.get<typeof mock.mockProjectBudgets>(
    `/organizer/budgets/${projectId}`,
  );
};

export const getBudgetComparison = async () =>
  apiClient.get<typeof mock.mockBudgetComparison>("/organizer/reports/budget-overview");

export const getCompletedEvents = async () =>
  apiClient.get<typeof mock.mockCompletedEvents>("/organizer/projects");

export const getTaskCompletionData = async () =>
  apiClient.get<typeof mock.mockTaskCompletionData>("/organizer/reports/task-completion");

export const getTeamKPIs = async () => {
  // UI-only chart — không có backend endpoint
  await delay();
  return [...mock.mockTeamKPIs];
};

export const getOrganizerNotifications = async () =>
  apiClient.get<typeof mock.mockOrganizerNotifications>("/organizer/notifications");

// ─── ADMIN ───────────────────────────────────────────────────

export const getAdminNotifications = async () =>
  apiClient.get<typeof mock.mockAdminNotifications>("/admin/notifications");

export const getMonthlyRevenue = async () =>
  apiClient.get<typeof mock.mockMonthlyRevenue>("/admin/finance/monthly-pl");

export const getEventTypes = async () => {
  // Static enum — không cần DB
  await delay(100);
  return [...mock.mockEventTypes];
};

export const getAdminRecentRequests = async () =>
  apiClient.get<typeof mock.mockAdminRecentRequests>("/admin/requests", { pageSize: 5 });

export const getAdminUpcomingEvents = async () => {
  const dashboard = await apiClient.get<{
    upcomingEvents: typeof mock.mockAdminUpcomingEvents;
  }>("/admin/dashboard");
  return dashboard.upcomingEvents ?? [];
};

export const getAdminRequests = async () =>
  apiClient.get<typeof mock.mockAdminRequests>("/admin/requests");

export const getAdminManagers = async () =>
  apiClient.get<typeof mock.mockAdminManagers>("/admin/users", { role: "organizer" });

export const getAdminUsers = async () =>
  apiClient.get<typeof mock.mockAdminUsers>("/admin/users");

export const getAdminContracts = async () =>
  apiClient.get<typeof mock.mockAdminContracts>("/admin/contracts");

export const getProjectFinance = async () =>
  apiClient.get<typeof mock.mockProjectFinance>("/admin/finance/project-summary");

export const getMonthlyPL = async () =>
  apiClient.get<typeof mock.mockMonthlyPL>("/admin/finance/monthly-pl");

export const getExpenses = async () =>
  apiClient.get<typeof mock.mockExpenses>("/admin/finance/expenses");

export const getContentPortfolio = async () =>
  apiClient.get<typeof mock.mockContentPortfolio>("/admin/content/portfolio");

export const getContentBlogPosts = async () =>
  apiClient.get<typeof mock.mockContentBlogPosts>("/admin/content/blog-posts");

export const getContentReviews = async () =>
  apiClient.get<typeof mock.mockContentReviews>("/admin/content/reviews");

export const getConversionData = async () =>
  apiClient.get<typeof mock.mockConversionData>("/admin/reports/conversion");

export const getRevenueByType = async () =>
  apiClient.get<typeof mock.mockRevenueByType>("/admin/reports/revenue-by-type");

export const getTopEvents = async () =>
  apiClient.get<typeof mock.mockTopEvents>("/admin/reports/top-events");

export const getStaffPerformance = async () => {
  // UI-only chart — không có backend endpoint
  await delay();
  return [...mock.mockStaffPerformance];
};
