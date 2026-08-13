import { createBrowserRouter } from "react-router";
import { MainLayout } from "./components/MainLayout";
import Dashboard from "./pages/dashboard/Dashboard";
import { PublicLeads } from "./pages/PublicLeads";
import { MyLeads } from "./pages/MyLeads";
import { TrashLeads } from "./pages/TrashLeads";
import { ClosedLeads } from "./pages/ClosedLeads";
// DEPRECATED: Legacy LeadDetail (Arco Design) no longer used in routes; kept for reference only.
// import { LeadDetail } from "./pages/LeadDetail";
import { Customers } from "./pages/Customers";
import { CustomerDetail } from "./pages/CustomerDetail";
import { Contracts } from "./pages/Contracts";
import { ContractDetail } from "./pages/ContractDetail";
import { ContractWizard } from "./pages/contracts/ContractWizard";
import { ContractEditor } from "./pages/contracts/ContractEditor";
import { ContractDocumentPreview } from "./pages/contracts/ContractDocumentPreview";
import { Projects } from "./pages/Projects";
import { ProjectDetail } from "./pages/ProjectDetail";
import { Reports } from "./pages/Reports";
import { Organization } from "./pages/Organization";
import { UserPermission } from "./pages/UserPermission";
import { CompanyEntity } from "./pages/CompanyEntity";
import { Dictionary } from "./pages/Dictionary";
import { SystemLog } from "./pages/SystemLog";
import { SystemConfig } from "./pages/SystemConfig";
import { DailyReportList } from "./pages/DailyReportList";
import { DailyReportView } from "./pages/DailyReportView";
import { QuotationList } from "./pages/QuotationList";
import { BusinessTripList } from "./pages/BusinessTripList";
// DEPRECATED: Legacy ReimbursementList superseded by travel/reimbursement/ReimbursementList. Do not modify.
// import { ReimbursementList as OldReimbursementList } from "./pages/ReimbursementList";
import { PaymentInvoiceList } from "./pages/PaymentInvoiceList";
import { ContractRecordList } from "./pages/ContractRecordList";
import { ProjectLogView } from "./pages/ProjectLogView";
import { WorkflowTemplateList } from "./pages/WorkflowTemplateList";
import { BusinessMappingList } from "./pages/BusinessMappingList";
import { ExpenseCategoryManager } from "./pages/ExpenseCategoryManager";
import { FinancialDashboard } from "./pages/FinancialDashboard";
import { LeadCostDashboard } from "./pages/lead-cost/LeadCostDashboard";
import { LeadCostDaily } from "./pages/lead-cost/LeadCostDaily";
import { LeadCostRecharge } from "./pages/lead-cost/LeadCostRecharge";
import { LeadCostAnalysis } from "./pages/lead-cost/LeadCostAnalysis";
import { SalaryPage } from "./pages/contract-cost/SalaryPage";
import { ContractCostDetail } from "./pages/contract-cost/ContractCostDetail";
import { ProjectCostAccounting } from "./pages/contract-cost/ProjectCostAccounting";
import DeliveryPlanPage from "./pages/delivery-plan/DeliveryPlanPage";
import PaymentKanban from "./pages/contracts/PaymentKanban";
import { PaymentKanbanV2 } from "./pages/contracts/PaymentKanbanV2";
import { ContractKanban } from "./pages/contracts/ContractKanban";
import { PaymentForecast } from "./pages/contracts/forecast/PaymentForecast";
import { AttendanceManagement } from "./pages/employee";
import { PerformanceManagement } from "./pages/employee";
import { LevelRateSettings } from "./pages/employee";
import { BossDashboard as HrDashboard } from "./pages/hr/dashboard/BossDashboard";
import { OrganizationPage } from "./pages/hr/organization/OrganizationPage";
import { EmployeeList as EmployeeListPage } from "./pages/hr/employees/EmployeeList";
import { EmployeeDetail as EmployeeDetailPage } from "./pages/hr/employees/EmployeeDetail";
import { RecruitmentList as RecruitmentListPage } from "./pages/hr/recruitment/RecruitmentList";
import { RecruitmentDetail as RecruitmentDetailPage } from "./pages/hr/recruitment/RecruitmentDetail";
import { CandidateList as CandidateListPage } from "./pages/hr/recruitment/CandidateList";
import { CandidateDetail as CandidateDetailPage } from "./pages/hr/recruitment/CandidateDetail";
import { TalentPool as TalentPoolPage } from "./pages/hr/recruitment/TalentPool";
import { InterviewSchedule as InterviewSchedulePage } from "./pages/hr/recruitment/InterviewSchedule";
import { OfferManagement as OfferManagementPage } from "./pages/hr/recruitment/OfferManagement";
import { SalaryApproval as SalaryApprovalPage } from "./pages/hr/recruitment/SalaryApproval";
import { OnboardingList as OnboardingListPage } from "./pages/hr/onboarding/OnboardingList";
import { OnboardingDetail as OnboardingDetailPage } from "./pages/hr/onboarding/OnboardingDetail";
import { TrialTrack as TrialTrackPage } from "./pages/hr/onboarding/TrialTrack";
import { ProbationManage as ProbationManagePage } from "./pages/hr/onboarding/ProbationManage";
import { AttendanceSummary as AttendanceSummaryPage } from "./pages/hr/attendance/AttendanceSummary";
import { AttendanceExceptions as AttendanceExceptionsPage } from "./pages/hr/attendance/AttendanceExceptions";
import { PerformanceList as PerformanceListPage } from "./pages/hr/performance/PerformanceList";
import { PerformanceDetail as PerformanceDetailPage } from "./pages/hr/performance/PerformanceDetail";
import { KPITemplates as KPITemplatesPage } from "./pages/hr/performance/KPITemplates";
import { PayrollList as PayrollListPage } from "./pages/hr/payroll/PayrollList";
import { PayrollDetail as PayrollDetailPage } from "./pages/hr/payroll/PayrollDetail";
import { PayrollEngine as PayrollEnginePage } from "./pages/hr/payroll/PayrollEngine";
import { DispatchList as DispatchListPage } from "./pages/hr/dispatch/DispatchList";
import { DispatchDetail as DispatchDetailPage } from "./pages/hr/dispatch/DispatchDetail";
import { ResignationList as ResignationListPage } from "./pages/hr/resignation/ResignationList";
import { ResignationDetail as ResignationDetailPage } from "./pages/hr/resignation/ResignationDetail";
import { PersonalWorkbench } from "./pages/workbench/PersonalWorkbench";
import { LeadGovernance } from "./pages/leads/LeadGovernance";
import { AssetManagement } from "./pages/assets/AssetManagement";
import { MaintenanceManagement } from "./pages/maintenance/MaintenanceManagement";
import { SupplierManagement } from "./pages/suppliers/SupplierManagement";
import { KnowledgeBase } from "./pages/knowledge/KnowledgeBase";
import { MeetingManagement } from "./pages/meetings/MeetingManagement";
import { FullChainROI } from "./pages/roi/FullChainROI";
import { AIDriven } from "./pages/ai/AIDriven";
import { WorkItemsPage } from "./pages/issues/WorkItemsPage";
import { ProjectDailyReportsPage } from "./pages/project-daily-reports/ProjectDailyReportsPage";
import DeliverablesListPage from "./pages/deliverables/DeliverablesListPage";
import ComponentShowcase from "./pages/components/ComponentShowcase";
import LeadDetailExample from "./pages/components/LeadDetailExample";
import ProjectDetailExample from "./pages/components/ProjectDetailExample";
import { TripList } from "./pages/travel/trip/TripList";
import FinancialDelivery from "./pages/financial-delivery";
import FinancialCost from "./pages/financial-cost";
import { TripForm } from "./pages/travel/trip/TripForm";
import { TripDetail } from "./pages/travel/trip/TripDetail";
import { ReimbursementList } from "./pages/travel/reimbursement/ReimbursementList";
import { LoanList } from "./pages/travel/loan/LoanList";
import { DormitoryManagement } from "./pages/travel/dormitory/DormitoryManagement";
import { PunchClock } from "./pages/travel/punch/PunchClock";
import { StandardList } from "./pages/travel/standard/StandardList";
import { TravelDashboard } from "./pages/travel/dashboard/TravelDashboard";
import { LeadList as NewLeadList } from "./pages/leads/LeadList";
import { FollowRecordList } from "./pages/leads/FollowRecordList";
import { LeadDetail as NewLeadDetail } from "./pages/leads/LeadDetail";
import { ChatAnalysisPage, WeChatBotManagement, WeChatGroupList } from "./pages/wechat-bot";
import ChatPage from "./pages/chat/ChatPage";
import { JobWorkConfigPage } from "./pages/daily-report/JobWorkConfigPage";
import { FeedbackManagement } from "./pages/FeedbackManagement";
import { WeComIntegration } from "./pages/integrations/WeComIntegration";
import { NotificationSettings } from "./pages/integrations/NotificationSettings";
import { MessageCenter } from "./pages/integrations/MessageCenter";
import { ApprovalCenter } from "./pages/approvals/ApprovalCenter";
import { TodoCenter } from "./pages/todos/TodoCenter";
import { ProjectCostPage } from "./pages/project-management/ProjectCostPage";
import { HrExpenseManagement } from "./pages/hr/HrExpenseManagement";
import { ProjectInvoicePage } from "./pages/finance/ProjectInvoicePage";

export const router = createBrowserRouter([
  {
    path: "/chat",
    Component: ChatPage,
  },
  {
    path: "/",
    Component: MainLayout,
    children: [
      { index: true, Component: Dashboard },
      { path: "workbench", Component: PersonalWorkbench },
      { path: "todos", Component: TodoCenter },
      { path: "leads/public", Component: PublicLeads },
      { path: "leads/my", Component: MyLeads },
      { path: "leads/closed", Component: ClosedLeads },
      { path: "leads/trash", Component: TrashLeads },
      { path: "leads/governance", Component: LeadGovernance },
      { path: "lead-cost/dashboard", Component: LeadCostDashboard },
      { path: "lead-cost/daily", Component: LeadCostDaily },
      { path: "lead-cost/recharge", Component: LeadCostRecharge },
      { path: "lead-cost/analysis", Component: LeadCostAnalysis },
      { path: "customers", Component: Customers },
      { path: "customers/:id", Component: CustomerDetail },
      { path: "contracts", Component: Contracts },
      { path: "contracts/kanban", Component: ContractKanban },
      { path: "contracts/new", Component: ContractWizard },
      { path: "contracts/:id/edit", Component: ContractEditor },
      { path: "contracts/:id/preview", Component: ContractDocumentPreview },
      { path: "contracts/payments", Component: PaymentKanban },
      { path: "contracts/payments-v2", Component: PaymentKanbanV2 },
      { path: "contracts/forecast", Component: PaymentForecast },
      { path: "contracts/:id", Component: ContractDetail },
      { path: "projects", Component: Projects },
      { path: "projects/:id", Component: ProjectDetail },
      { path: "projects/:id/delivery", Component: DeliveryPlanPage },
      { path: "projects/:id/issues", Component: WorkItemsPage },
      { path: "projects/:id/dailyreports", Component: ProjectDailyReportsPage },
      { path: "projects/:id/chat-analysis", Component: ChatAnalysisPage },
      { path: "project-cost-accounting", Component: ProjectCostPage },
      { path: "deliverables", Component: DeliverablesListPage },
      { path: "components", Component: ComponentShowcase },
      { path: "components/lead-detail", Component: LeadDetailExample },
      { path: "components/project-detail", Component: ProjectDetailExample },
      { path: "issues", Component: WorkItemsPage },
      { path: "dailyreport/list", Component: DailyReportList },
      { path: "dailyreport/view", Component: DailyReportView },
      { path: "dailyreport/projectlog", Component: ProjectLogView },
      { path: "dailyreport/job-work-config", Component: JobWorkConfigPage },
      { path: "quotation", Component: QuotationList },
      { path: "approvals", Component: ApprovalCenter },
      { path: "approvals/templates", Component: WorkflowTemplateList },
      { path: "approvals/business", Component: BusinessMappingList },
      { path: "businesstrip", Component: BusinessTripList },
      { path: "reimbursement", Component: ReimbursementList },
      { path: "paymentinvoice", Component: PaymentInvoiceList },
      { path: "contractrecord", Component: ContractRecordList },
      { path: "reports", Component: Reports },
      { path: "assets", Component: AssetManagement },
      { path: "maintenance", Component: MaintenanceManagement },
      { path: "suppliers", Component: SupplierManagement },
      { path: "knowledge", Component: KnowledgeBase },
      { path: "meetings", Component: MeetingManagement },
      { path: "roi", Component: FullChainROI },
      { path: "ai", Component: AIDriven },
      { path: "travel/trips", Component: TripList },
      { path: "travel/trips/new", Component: TripForm },
      { path: "travel/trips/:id", Component: TripDetail },
      { path: "travel/reimbursements", Component: ReimbursementList },
      { path: "travel/loans", Component: LoanList },
      { path: "travel/dormitory", Component: DormitoryManagement },
      { path: "travel/punch", Component: PunchClock },
      { path: "travel/standards", Component: StandardList },
      { path: "travel/dashboard", Component: TravelDashboard },
      { path: "leads/all", Component: NewLeadList },
      { path: "leads/assigned", Component: NewLeadList },
      { path: "leads/public-pool", Component: NewLeadList },
      { path: "leads/follow-records", Component: FollowRecordList },
      { path: "leads/high-tech", Component: NewLeadList },
      { path: "leads/:id", Component: NewLeadDetail },
      { path: "leads/:id/chat-analysis", Component: ChatAnalysisPage },
      { path: "leads/wechat-groups", Component: WeChatGroupList },
      { path: "settings/wechat-bot", Component: WeChatBotManagement },
      { path: "hr/dashboard", Component: HrDashboard },
      { path: "hr/organization", Component: OrganizationPage },
      { path: "hr/employees", Component: EmployeeListPage },
      { path: "hr/employees/:id", Component: EmployeeDetailPage },
      { path: "hr/recruitment", Component: RecruitmentListPage },
      { path: "hr/recruitment/:id", Component: RecruitmentDetailPage },
      { path: "hr/candidates", Component: CandidateListPage },
      { path: "hr/candidates/:id", Component: CandidateDetailPage },
      { path: "hr/talent-pool", Component: TalentPoolPage },
      { path: "hr/interviews", Component: InterviewSchedulePage },
      { path: "hr/offers", Component: OfferManagementPage },
      { path: "hr/salary-approval", Component: SalaryApprovalPage },
      { path: "hr/onboarding", Component: OnboardingListPage },
      { path: "hr/onboarding/:id", Component: OnboardingDetailPage },
      { path: "hr/trial", Component: TrialTrackPage },
      { path: "hr/probation", Component: ProbationManagePage },
      { path: "hr/attendance", Component: AttendanceSummaryPage },
      { path: "hr/attendance/exceptions", Component: AttendanceExceptionsPage },
      { path: "hr/performance", Component: PerformanceListPage },
      { path: "hr/performance/:id", Component: PerformanceDetailPage },
      { path: "hr/performance/templates", Component: KPITemplatesPage },
      { path: "hr/payroll", Component: PayrollListPage },
      { path: "hr/payroll/:id", Component: PayrollDetailPage },
      { path: "hr/payroll/engine", Component: PayrollEnginePage },
      { path: "hr/dispatch", Component: DispatchListPage },
      { path: "hr/dispatch/:id", Component: DispatchDetailPage },
      { path: "hr/resignation", Component: ResignationListPage },
      { path: "hr/resignation/:id", Component: ResignationDetailPage },
      { path: "employees", Component: EmployeeList },
      { path: "employees/attendance", Component: AttendanceManagement },
      { path: "employees/performance", Component: PerformanceManagement },
      { path: "employees/level-rates", Component: LevelRateSettings },
      { path: "employees/:id", Component: EmployeeDetail },
      { path: "hr/expenses", Component: HrExpenseManagement },
      { path: "system/organization", Component: Organization },
      { path: "system/permission", Component: UserPermission },
      { path: "system/company", Component: CompanyEntity },
      { path: "system/dictionary", Component: Dictionary },
      { path: "system/log", Component: SystemLog },
      { path: "system/config", Component: SystemConfig },
      { path: "system/workflow", Component: WorkflowTemplateList },
      { path: "system/bizapproval", Component: BusinessMappingList },
      { path: "system/expensecategory", Component: ExpenseCategoryManager },
      { path: "system/feedback", Component: FeedbackManagement },
      { path: "system/wecom", Component: WeComIntegration },
      { path: "system/message-settings", Component: NotificationSettings },
      { path: "system/message-center", Component: MessageCenter },
      { path: "finance/dashboard", Component: FinancialDashboard },
      { path: "finance/project-cost", Component: ProjectCostAccounting },
      { path: "finance/salary", Component: SalaryPage },
      { path: "finance/project-invoices", Component: ProjectInvoicePage },
      { path: "finance/contract-cost/:contractId", Component: ContractCostDetail },
      { path: "financial-delivery/*", Component: FinancialDelivery },
      { path: "financial-cost/*", Component: FinancialCost },
    ],
  },
]);
