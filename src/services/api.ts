// ============================================================
// MOCK API SERVICE — NiChan Event
// Khi có backend thật, chỉ cần đổi thân hàm thành fetch()/axios
// ============================================================

import * as mock from "./mockData";

const delay = (ms: number = 300) => new Promise((resolve) => setTimeout(resolve, ms));

// ─── PUBLIC ──────────────────────────────────────────────────
export const getPublicServices = async () => { await delay(); return [...mock.mockPublicServices]; };
export const getStats = async () => { await delay(); return [...mock.mockStats]; };
export const getTestimonials = async () => { await delay(); return [...mock.mockTestimonials]; };
export const getPortfolioItems = async () => { await delay(); return [...mock.mockPortfolioItems]; };
export const getServiceCategories = async () => { await delay(); return [...mock.mockServiceCategories]; };
export const getAllServices = async () => { await delay(); return [...mock.mockAllServices]; };

// ─── CUSTOMER ────────────────────────────────────────────────
export const getCustomerEvents = async () => { await delay(); return [...mock.mockCustomerEvents]; };
export const getRecentActivities = async () => { await delay(); return [...mock.mockRecentActivities]; };
export const getContracts = async () => { await delay(); return [...mock.mockContracts]; };
export const getReviews = async () => { await delay(); return [...mock.mockReviews]; };
export const getReviewCriteria = async () => { await delay(); return [...mock.mockReviewCriteria]; };
export const getMilestones = async () => { await delay(); return [...mock.mockMilestones]; };
export const getChatMessages = async () => { await delay(); return [...mock.mockChatMessages]; };
export const getDocuments = async () => { await delay(); return [...mock.mockDocuments]; };
export const getTransactions = async () => { await delay(); return [...mock.mockTransactions]; };

// ─── ORGANIZER ───────────────────────────────────────────────
export const getKanbanColumns = async () => { await delay(); return JSON.parse(JSON.stringify(mock.mockKanbanColumns)); };
export const getGanttData = async () => { await delay(); return [...mock.mockGanttData]; };
export const getOrgProjectProgress = async () => { await delay(); return [...mock.mockOrgProjectProgress]; };
export const getTasksByStatus = async () => { await delay(); return [...mock.mockTasksByStatus]; };
export const getWeeklyWorkload = async () => { await delay(); return [...mock.mockWeeklyWorkload]; };
export const getUpcomingTasks = async () => { await delay(); return [...mock.mockUpcomingTasks]; };
export const getOrgStaff = async () => { await delay(); return [...mock.mockOrgStaff]; };
export const getShifts = async () => { await delay(); return JSON.parse(JSON.stringify(mock.mockShifts)); };
export const getVendors = async () => { await delay(); return [...mock.mockVendors]; };
export const getVendorCategories = async () => { await delay(); return [...mock.mockVendorCategories]; };
export const getProjectBudgets = async () => { await delay(); return JSON.parse(JSON.stringify(mock.mockProjectBudgets)); };
export const getBudgetComparison = async () => { await delay(); return [...mock.mockBudgetComparison]; };
export const getCompletedEvents = async () => { await delay(); return [...mock.mockCompletedEvents]; };
export const getTaskCompletionData = async () => { await delay(); return [...mock.mockTaskCompletionData]; };
export const getTeamKPIs = async () => { await delay(); return [...mock.mockTeamKPIs]; };
export const getOrganizerNotifications = async () => { await delay(); return [...mock.mockOrganizerNotifications]; };

// ─── ADMIN ───────────────────────────────────────────────────
export const getAdminNotifications = async () => { await delay(); return [...mock.mockAdminNotifications]; };
export const getMonthlyRevenue = async () => { await delay(); return [...mock.mockMonthlyRevenue]; };
export const getEventTypes = async () => { await delay(); return [...mock.mockEventTypes]; };
export const getAdminRecentRequests = async () => { await delay(); return [...mock.mockAdminRecentRequests]; };
export const getAdminUpcomingEvents = async () => { await delay(); return [...mock.mockAdminUpcomingEvents]; };
export const getAdminRequests = async () => { await delay(); return [...mock.mockAdminRequests]; };
export const getAdminManagers = async () => { await delay(); return [...mock.mockAdminManagers]; };
export const getAdminUsers = async () => { await delay(); return [...mock.mockAdminUsers]; };
export const getAdminContracts = async () => { await delay(); return [...mock.mockAdminContracts]; };
export const getProjectFinance = async () => { await delay(); return [...mock.mockProjectFinance]; };
export const getMonthlyPL = async () => { await delay(); return [...mock.mockMonthlyPL]; };
export const getExpenses = async () => { await delay(); return [...mock.mockExpenses]; };
export const getContentPortfolio = async () => { await delay(); return [...mock.mockContentPortfolio]; };
export const getContentBlogPosts = async () => { await delay(); return [...mock.mockContentBlogPosts]; };
export const getContentReviews = async () => { await delay(); return [...mock.mockContentReviews]; };
export const getConversionData = async () => { await delay(); return [...mock.mockConversionData]; };
export const getRevenueByType = async () => { await delay(); return [...mock.mockRevenueByType]; };
export const getTopEvents = async () => { await delay(); return [...mock.mockTopEvents]; };
export const getStaffPerformance = async () => { await delay(); return [...mock.mockStaffPerformance]; };
