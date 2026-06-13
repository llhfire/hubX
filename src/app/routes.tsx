import { createBrowserRouter } from "react-router";
import { MainLayout } from "./components/MainLayout";
import { Dashboard } from "./pages/Dashboard";
import { PublicLeads } from "./pages/PublicLeads";
import { MyLeads } from "./pages/MyLeads";
import { TrashLeads } from "./pages/TrashLeads";
import { LeadDetail } from "./pages/LeadDetail";
import { Customers } from "./pages/Customers";
import { CustomerDetail } from "./pages/CustomerDetail";
import { Contracts } from "./pages/Contracts";
import { ContractDetail } from "./pages/ContractDetail";
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
import { ReimbursementList } from "./pages/ReimbursementList";
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
import DeliveryPlanPage from "./pages/delivery-plan/DeliveryPlanPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    children: [
      { index: true, Component: Dashboard },
      { path: "leads/public", Component: PublicLeads },
      { path: "leads/my", Component: MyLeads },
      { path: "leads/trash", Component: TrashLeads },
      { path: "leads/:id", Component: LeadDetail },
      { path: "lead-cost/dashboard", Component: LeadCostDashboard },
      { path: "lead-cost/daily", Component: LeadCostDaily },
      { path: "lead-cost/recharge", Component: LeadCostRecharge },
      { path: "lead-cost/analysis", Component: LeadCostAnalysis },
      { path: "customers", Component: Customers },
      { path: "customers/:id", Component: CustomerDetail },
      { path: "contracts", Component: Contracts },
      { path: "contracts/:id", Component: ContractDetail },
      { path: "projects", Component: Projects },
      { path: "projects/:id", Component: ProjectDetail },
      { path: "projects/:id/delivery", Component: DeliveryPlanPage },
      { path: "dailyreport/list", Component: DailyReportList },
      { path: "dailyreport/view", Component: DailyReportView },
      { path: "dailyreport/projectlog", Component: ProjectLogView },
      { path: "quotation", Component: QuotationList },
      { path: "businesstrip", Component: BusinessTripList },
      { path: "reimbursement", Component: ReimbursementList },
      { path: "paymentinvoice", Component: PaymentInvoiceList },
      { path: "contractrecord", Component: ContractRecordList },
      { path: "reports", Component: Reports },
      { path: "system/organization", Component: Organization },
      { path: "system/permission", Component: UserPermission },
      { path: "system/company", Component: CompanyEntity },
      { path: "system/dictionary", Component: Dictionary },
      { path: "system/log", Component: SystemLog },
      { path: "system/config", Component: SystemConfig },
      { path: "system/workflow", Component: WorkflowTemplateList },
      { path: "system/bizapproval", Component: BusinessMappingList },
      { path: "system/expensecategory", Component: ExpenseCategoryManager },
      { path: "finance/dashboard", Component: FinancialDashboard },
      { path: "finance/salary", Component: SalaryPage },
      { path: "finance/contract-cost/:contractId", Component: ContractCostDetail },
    ],
  },
]);
