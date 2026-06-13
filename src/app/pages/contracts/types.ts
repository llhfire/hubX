// 合同模块的核心类型定义。
//
// 数据模型采用 C 模型：合同是主体，版本（ContractVersion）只是用户行为
// 在关键节点产生的完整快照，不是独立可审批的对象；审批和"已审批"标记
// 都贴在合同对象本身上（approvalFlow / approvedVersionNo）。

export type ContractStatus =
  | 'draft' // 草稿
  | 'approving' // 审批中
  | 'pending_mail' // 待寄出（审批通过，等行政打印盖章邮寄）
  | 'pending_return' // 待回寄（已寄出，等客户签字盖章后回寄）
  | 'archived' // 已归档（扫描件入库）
  | 'voided'; // 已作废（终态）

export type ApprovalNodeStatus = 'pending' | 'approved' | 'rejected';

export type ApprovalStepName = '发起申请' | '商务审核' | '财务审核' | '法务审核';

export interface ApprovalNode {
  step: ApprovalStepName;
  approver: string;
  status: ApprovalNodeStatus;
  time: string;
  comment: string;
}

export interface PaymentPlanItem {
  period: number;
  expectedDate: string;
  amount: number;
  percentage: number;
}

export type PaymentMethod = '公对公' | '私对公' | '分期付款';

export type ExecutionStatus = '履行中' | '已完成' | '已终止';

// 合同的可编辑字段集合。编辑页直接读写 contract.current；
// 用户每次"保存为新版本/提交审批"时，会把 current 整体克隆进 versionHistory[]。
export interface ContractFormData {
  contractName: string;
  productCategory: string;
  signingEntity: string; // 我方（乙方）签约主体
  customerName: string;
  customerContact: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  customerTaxNo: string;
  bankName: string;
  bankAccount: string;
  contractContent: string;
  signDate: string;
  effectiveDate: string;
  endDate: string;
  paymentMethod: PaymentMethod;
  totalAmount: number;
  rebateAmount: number;
  paymentPlans: PaymentPlanItem[];
  templateId: string;
}

export interface ContractVersion {
  versionNo: string; // V1 / V2 / V3...
  formData: ContractFormData;
  renderedHtml: string; // 模板渲染后的 HTML 快照（可直接 dangerouslySetInnerHTML）
  label: string; // 自动："首次保存草稿" / "提交审批前自动保存" / "驳回后再次提交"；手动：用户填的说明
  createdAt: string;
  createdBy: string;
}

export interface ScanFile {
  id: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  blobUrl?: string; // URL.createObjectURL；mock 数据可不带（点击预览时显示"演示数据，无可用预览"）
  uploadedAt: string;
  uploadedBy: string;
}

// 一次"扫描归档"动作可以传一组文件（合同正文 + 客户盖章页 + 附件），
// 整组算作 archivedScans 数组里的一条记录。
export interface ScanArchiveEntry {
  id: string;
  files: ScanFile[];
  uploadedAt: string;
  uploadedBy: string;
  isPrimary: boolean; // 一份合同同时只有一条 isPrimary=true
  linkedVersionNo: string; // 对应的审批通过版本号
  note?: string;
}

export interface Contract {
  id: string;
  contractNo: string; // CT202606001
  status: ContractStatus;

  // 关联（身份字段，锁死）
  leadId?: string;
  quoteId?: string;

  // 当前编辑内容
  current: ContractFormData;

  // 版本快照历史（按 createdAt 升序，最新在末尾）
  versionHistory: ContractVersion[];

  // 审批（贴在合同上）
  approvalFlow: ApprovalNode[];
  approvedVersionNo?: string;
  approvedAt?: string;

  // 邮寄/扫描
  mailedAt?: string;
  archivedScans: ScanArchiveEntry[];

  // 元信息
  createdAt: string;
  createdBy: string;
  updatedAt: string;

  // 履行期字段（archived 之后由项目模块填充，本次只占位）
  receivedAmount?: number;
  receivableAmount?: number;
  executionStatus?: ExecutionStatus;
}

// 报价单结构（与 LeadDetail.tsx:191-231 quotationHistory 对齐）
// 这里定义的是 findLatestApprovedQuote 需要的最小字段子集。
export interface QuotationRecord {
  id: string;
  name?: string;
  status: string; // '已报价' | '未报价' | ...
  flowStatus: string; // '已审核' | '审核中' | ...
  amount?: string;
  period?: string;
  createTime?: string;
  entity?: string;
}

// 合同模板接口
export interface ContractTemplate {
  id: string;
  name: string;
  productCategories: string[]; // 用于按产品类别过滤模板
  description?: string;
  render: (formData: ContractFormData) => string;
}

// Wizard → ContractsContext.createFromWizard 的入参
export interface WizardInput {
  leadId?: string;
  quoteId?: string;
  formData: ContractFormData;
}
