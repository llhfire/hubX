// 运营成本费用管理模块 - Mock 数据

// ── 费用分类接口 ──────────────────────────────────────────────
export interface ExpenseCategory {
  id: string;
  parentId: string | null;
  name: string;
  code: string;
  level: number;
  sortOrder: number;
  isActive: boolean;
  children?: ExpenseCategory[];
}

// ── 费用记录接口 ──────────────────────────────────────────────
export interface ExpenseRecord {
  id: string;
  expenseNo: string;
  categoryId: string;
  categoryName: string;
  subCategoryId: string;
  subCategoryName: string;
  amount: number;
  expenseDate: string;
  description: string;
  sourceType: SourceType;
  sourceId?: string;
  projectId?: string;
  projectName?: string;
  departmentId?: string;
  departmentName?: string;
  createdBy: string;
  createdAt: string;
}

// ── 费用模板接口 ──────────────────────────────────────────────
export interface ExpenseTemplate {
  id: string;
  templateName: string;
  categoryId: string;
  categoryName: string;
  subCategoryId: string;
  subCategoryName: string;
  amount: number;
  cycleType: CycleType;
  startDate: string;
  endDate?: string;
  projectId?: string;
  projectName?: string;
  departmentId?: string;
  departmentName?: string;
  isActive: boolean;
  createdAt: string;
  amountHistory: TemplateAmountHistory[];
}

// ── 模板金额调整历史 ──────────────────────────────────────────
export interface TemplateAmountHistory {
  id: string;
  templateId: string;
  oldAmount: number;
  newAmount: number;
  effectiveDate: string;
  createdBy: string;
  createdAt: string;
}

// ── 费用调整记录 ──────────────────────────────────────────────
export interface ExpenseAdjustment {
  id: string;
  expenseId: string;
  adjustmentType: 'correct' | 'supplement';
  originalAmount: number;
  adjustedAmount: number;
  reason: string;
  adjustmentDate: string;
  createdBy: string;
  createdAt: string;
}

// ── 枚举定义 ──────────────────────────────────────────────────
export type SourceType = 'manual' | 'reimbursement' | 'salary' | 'contract';
export type CycleType = 'monthly' | 'quarterly' | 'yearly';
export type OwnerType = 'company' | 'project' | 'department';

// ── 显示映射 ──────────────────────────────────────────────────
export const sourceTypeMap: Record<SourceType, { label: string; color: string }> = {
  manual: { label: '手动录入', color: 'default' },
  reimbursement: { label: '报销归集', color: 'blue' },
  salary: { label: '工资归集', color: 'green' },
  contract: { label: '合同归集', color: 'purple' },
};

export const cycleTypeMap: Record<CycleType, { label: string }> = {
  monthly: { label: '月度' },
  quarterly: { label: '季度' },
  yearly: { label: '年度' },
};

export const ownerTypeMap: Record<OwnerType, { label: string }> = {
  company: { label: '公司整体' },
  project: { label: '项目' },
  department: { label: '部门' },
};

// ── 默认费用分类 ──────────────────────────────────────────────
export const defaultCategories: ExpenseCategory[] = [
  {
    id: 'cat-01', parentId: null, name: '人力成本', code: 'HC', level: 1, sortOrder: 1, isActive: true,
    children: [
      { id: 'cat-01-01', parentId: 'cat-01', name: '基本工资', code: 'HC-01', level: 2, sortOrder: 1, isActive: true },
      { id: 'cat-01-02', parentId: 'cat-01', name: '绩效工资', code: 'HC-02', level: 2, sortOrder: 2, isActive: true },
      { id: 'cat-01-03', parentId: 'cat-01', name: '社保公积金', code: 'HC-03', level: 2, sortOrder: 3, isActive: true },
      { id: 'cat-01-04', parentId: 'cat-01', name: '商业保险', code: 'HC-04', level: 2, sortOrder: 4, isActive: true },
      { id: 'cat-01-05', parentId: 'cat-01', name: '奖金提成', code: 'HC-05', level: 2, sortOrder: 5, isActive: true },
      { id: 'cat-01-06', parentId: 'cat-01', name: '年终奖', code: 'HC-06', level: 2, sortOrder: 6, isActive: true },
      { id: 'cat-01-07', parentId: 'cat-01', name: '餐补', code: 'HC-07', level: 2, sortOrder: 7, isActive: true },
      { id: 'cat-01-08', parentId: 'cat-01', name: '交通补贴', code: 'HC-08', level: 2, sortOrder: 8, isActive: true },
      { id: 'cat-01-09', parentId: 'cat-01', name: '通讯补贴', code: 'HC-09', level: 2, sortOrder: 9, isActive: true },
      { id: 'cat-01-10', parentId: 'cat-01', name: '住房补贴', code: 'HC-10', level: 2, sortOrder: 10, isActive: true },
      { id: 'cat-01-11', parentId: 'cat-01', name: '高温补贴', code: 'HC-11', level: 2, sortOrder: 11, isActive: true },
      { id: 'cat-01-12', parentId: 'cat-01', name: '加班费', code: 'HC-12', level: 2, sortOrder: 12, isActive: true },
      { id: 'cat-01-13', parentId: 'cat-01', name: '招聘费用', code: 'HC-13', level: 2, sortOrder: 13, isActive: true },
      { id: 'cat-01-14', parentId: 'cat-01', name: '培训费用', code: 'HC-14', level: 2, sortOrder: 14, isActive: true },
      { id: 'cat-01-15', parentId: 'cat-01', name: '差旅补贴', code: 'HC-15', level: 2, sortOrder: 15, isActive: true },
      { id: 'cat-01-16', parentId: 'cat-01', name: '离职补偿', code: 'HC-16', level: 2, sortOrder: 16, isActive: true },
    ],
  },
  {
    id: 'cat-02', parentId: null, name: '办公成本', code: 'OC', level: 1, sortOrder: 2, isActive: true,
    children: [
      { id: 'cat-02-01', parentId: 'cat-02', name: '办公室租金', code: 'OC-01', level: 2, sortOrder: 1, isActive: true },
      { id: 'cat-02-02', parentId: 'cat-02', name: '物业管理费', code: 'OC-02', level: 2, sortOrder: 2, isActive: true },
      { id: 'cat-02-03', parentId: 'cat-02', name: '水电费', code: 'OC-03', level: 2, sortOrder: 3, isActive: true },
      { id: 'cat-02-04', parentId: 'cat-02', name: '网络通讯费', code: 'OC-04', level: 2, sortOrder: 4, isActive: true },
      { id: 'cat-02-05', parentId: 'cat-02', name: '电话费', code: 'OC-05', level: 2, sortOrder: 5, isActive: true },
      { id: 'cat-02-06', parentId: 'cat-02', name: '办公用品', code: 'OC-06', level: 2, sortOrder: 6, isActive: true },
      { id: 'cat-02-07', parentId: 'cat-02', name: '办公家具', code: 'OC-07', level: 2, sortOrder: 7, isActive: true },
      { id: 'cat-02-08', parentId: 'cat-02', name: '设备折旧', code: 'OC-08', level: 2, sortOrder: 8, isActive: true },
      { id: 'cat-02-09', parentId: 'cat-02', name: '设备租赁', code: 'OC-09', level: 2, sortOrder: 9, isActive: true },
      { id: 'cat-02-10', parentId: 'cat-02', name: '服务器托管', code: 'OC-10', level: 2, sortOrder: 10, isActive: true },
      { id: 'cat-02-11', parentId: 'cat-02', name: '宿舍租金', code: 'OC-11', level: 2, sortOrder: 11, isActive: true },
      { id: 'cat-02-12', parentId: 'cat-02', name: '装修摊销', code: 'OC-12', level: 2, sortOrder: 12, isActive: true },
      { id: 'cat-02-13', parentId: 'cat-02', name: '保洁服务', code: 'OC-13', level: 2, sortOrder: 13, isActive: true },
      { id: 'cat-02-14', parentId: 'cat-02', name: '绿植租赁', code: 'OC-14', level: 2, sortOrder: 14, isActive: true },
    ],
  },
  {
    id: 'cat-03', parentId: null, name: '差旅成本', code: 'TC', level: 1, sortOrder: 3, isActive: true,
    children: [
      { id: 'cat-03-01', parentId: 'cat-03', name: '市内交通', code: 'TC-01', level: 2, sortOrder: 1, isActive: true },
      { id: 'cat-03-02', parentId: 'cat-03', name: '长途交通', code: 'TC-02', level: 2, sortOrder: 2, isActive: true },
      { id: 'cat-03-03', parentId: 'cat-03', name: '住宿费', code: 'TC-03', level: 2, sortOrder: 3, isActive: true },
      { id: 'cat-03-04', parentId: 'cat-03', name: '出差补贴', code: 'TC-04', level: 2, sortOrder: 4, isActive: true },
      { id: 'cat-03-05', parentId: 'cat-03', name: '餐饮费', code: 'TC-05', level: 2, sortOrder: 5, isActive: true },
      { id: 'cat-03-06', parentId: 'cat-03', name: '车辆租金', code: 'TC-06', level: 2, sortOrder: 6, isActive: true },
      { id: 'cat-03-07', parentId: 'cat-03', name: '油费', code: 'TC-07', level: 2, sortOrder: 7, isActive: true },
      { id: 'cat-03-08', parentId: 'cat-03', name: '电费', code: 'TC-08', level: 2, sortOrder: 8, isActive: true },
      { id: 'cat-03-09', parentId: 'cat-03', name: '过路费', code: 'TC-09', level: 2, sortOrder: 9, isActive: true },
      { id: 'cat-03-10', parentId: 'cat-03', name: '停车费', code: 'TC-10', level: 2, sortOrder: 10, isActive: true },
      { id: 'cat-03-11', parentId: 'cat-03', name: '车辆保养', code: 'TC-11', level: 2, sortOrder: 11, isActive: true },
      { id: 'cat-03-12', parentId: 'cat-03', name: '车辆保险', code: 'TC-12', level: 2, sortOrder: 12, isActive: true },
    ],
  },
  {
    id: 'cat-04', parentId: null, name: '福利成本', code: 'WC', level: 1, sortOrder: 4, isActive: true,
    children: [
      { id: 'cat-04-01', parentId: 'cat-04', name: '团建活动', code: 'WC-01', level: 2, sortOrder: 1, isActive: true },
      { id: 'cat-04-02', parentId: 'cat-04', name: '节日福利', code: 'WC-02', level: 2, sortOrder: 2, isActive: true },
      { id: 'cat-04-03', parentId: 'cat-04', name: '员工体检', code: 'WC-03', level: 2, sortOrder: 3, isActive: true },
      { id: 'cat-04-04', parentId: 'cat-04', name: '下午茶/零食', code: 'WC-04', level: 2, sortOrder: 4, isActive: true },
      { id: 'cat-04-05', parentId: 'cat-04', name: '文体活动', code: 'WC-05', level: 2, sortOrder: 5, isActive: true },
      { id: 'cat-04-06', parentId: 'cat-04', name: '生日福利', code: 'WC-06', level: 2, sortOrder: 6, isActive: true },
      { id: 'cat-04-07', parentId: 'cat-04', name: '婚丧礼金', code: 'WC-07', level: 2, sortOrder: 7, isActive: true },
      { id: 'cat-04-08', parentId: 'cat-04', name: '子女教育补贴', code: 'WC-08', level: 2, sortOrder: 8, isActive: true },
      { id: 'cat-04-09', parentId: 'cat-04', name: '健身补贴', code: 'WC-09', level: 2, sortOrder: 9, isActive: true },
      { id: 'cat-04-10', parentId: 'cat-04', name: '团建旅游', code: 'WC-10', level: 2, sortOrder: 10, isActive: true },
    ],
  },
  {
    id: 'cat-05', parentId: null, name: '商务成本', code: 'BC', level: 1, sortOrder: 5, isActive: true,
    children: [
      { id: 'cat-05-01', parentId: 'cat-05', name: '招待费', code: 'BC-01', level: 2, sortOrder: 1, isActive: true },
      { id: 'cat-05-02', parentId: 'cat-05', name: '礼品费', code: 'BC-02', level: 2, sortOrder: 2, isActive: true },
      { id: 'cat-05-03', parentId: 'cat-05', name: '佣金返点', code: 'BC-03', level: 2, sortOrder: 3, isActive: true },
      { id: 'cat-05-04', parentId: 'cat-05', name: '渠道费', code: 'BC-04', level: 2, sortOrder: 4, isActive: true },
      { id: 'cat-05-05', parentId: 'cat-05', name: '商务宴请', code: 'BC-05', level: 2, sortOrder: 5, isActive: true },
    ],
  },
  {
    id: 'cat-06', parentId: null, name: '市场成本', code: 'MC', level: 1, sortOrder: 6, isActive: true,
    children: [
      { id: 'cat-06-01', parentId: 'cat-06', name: '市场推广费', code: 'MC-01', level: 2, sortOrder: 1, isActive: true },
      { id: 'cat-06-02', parentId: 'cat-06', name: '展会费', code: 'MC-02', level: 2, sortOrder: 2, isActive: true },
      { id: 'cat-06-03', parentId: 'cat-06', name: '广告费', code: 'MC-03', level: 2, sortOrder: 3, isActive: true },
      { id: 'cat-06-04', parentId: 'cat-06', name: '品牌宣传', code: 'MC-04', level: 2, sortOrder: 4, isActive: true },
      { id: 'cat-06-05', parentId: 'cat-06', name: '活动赞助', code: 'MC-05', level: 2, sortOrder: 5, isActive: true },
      { id: 'cat-06-06', parentId: 'cat-06', name: '内容营销', code: 'MC-06', level: 2, sortOrder: 6, isActive: true },
      { id: 'cat-06-07', parentId: 'cat-06', name: '线上推广', code: 'MC-07', level: 2, sortOrder: 7, isActive: true },
      { id: 'cat-06-08', parentId: 'cat-06', name: '线下推广', code: 'MC-08', level: 2, sortOrder: 8, isActive: true },
    ],
  },
  {
    id: 'cat-07', parentId: null, name: '第三方服务费', code: 'TP', level: 1, sortOrder: 7, isActive: true,
    children: [
      { id: 'cat-07-01', parentId: 'cat-07', name: '云服务', code: 'TP-01', level: 2, sortOrder: 1, isActive: true },
      { id: 'cat-07-02', parentId: 'cat-07', name: '软件订阅', code: 'TP-02', level: 2, sortOrder: 2, isActive: true },
      { id: 'cat-07-03', parentId: 'cat-07', name: '域名/SSL', code: 'TP-03', level: 2, sortOrder: 3, isActive: true },
      { id: 'cat-07-04', parentId: 'cat-07', name: '短信服务', code: 'TP-04', level: 2, sortOrder: 4, isActive: true },
      { id: 'cat-07-05', parentId: 'cat-07', name: '法务费用', code: 'TP-05', level: 2, sortOrder: 5, isActive: true },
      { id: 'cat-07-06', parentId: 'cat-07', name: '审计费用', code: 'TP-06', level: 2, sortOrder: 6, isActive: true },
      { id: 'cat-07-07', parentId: 'cat-07', name: '保险费用', code: 'TP-07', level: 2, sortOrder: 7, isActive: true },
      { id: 'cat-07-08', parentId: 'cat-07', name: '外包服务', code: 'TP-08', level: 2, sortOrder: 8, isActive: true },
      { id: 'cat-07-09', parentId: 'cat-07', name: '咨询服务', code: 'TP-09', level: 2, sortOrder: 9, isActive: true },
      { id: 'cat-07-10', parentId: 'cat-07', name: '代理服务', code: 'TP-10', level: 2, sortOrder: 10, isActive: true },
    ],
  },
  {
    id: 'cat-08', parentId: null, name: '财务成本', code: 'FC', level: 1, sortOrder: 8, isActive: true,
    children: [
      { id: 'cat-08-01', parentId: 'cat-08', name: '坏账损失', code: 'FC-01', level: 2, sortOrder: 1, isActive: true },
      { id: 'cat-08-02', parentId: 'cat-08', name: '利息支出', code: 'FC-02', level: 2, sortOrder: 2, isActive: true },
      { id: 'cat-08-03', parentId: 'cat-08', name: '汇兑损失', code: 'FC-03', level: 2, sortOrder: 3, isActive: true },
      { id: 'cat-08-04', parentId: 'cat-08', name: '手续费', code: 'FC-04', level: 2, sortOrder: 4, isActive: true },
      { id: 'cat-08-05', parentId: 'cat-08', name: '资产减值', code: 'FC-05', level: 2, sortOrder: 5, isActive: true },
    ],
  },
  {
    id: 'cat-09', parentId: null, name: '税费', code: 'TX', level: 1, sortOrder: 9, isActive: true,
    children: [
      { id: 'cat-09-01', parentId: 'cat-09', name: '增值税', code: 'TX-01', level: 2, sortOrder: 1, isActive: true },
      { id: 'cat-09-02', parentId: 'cat-09', name: '所得税', code: 'TX-02', level: 2, sortOrder: 2, isActive: true },
      { id: 'cat-09-03', parentId: 'cat-09', name: '印花税', code: 'TX-03', level: 2, sortOrder: 3, isActive: true },
      { id: 'cat-09-04', parentId: 'cat-09', name: '城建税', code: 'TX-04', level: 2, sortOrder: 4, isActive: true },
      { id: 'cat-09-05', parentId: 'cat-09', name: '教育费附加', code: 'TX-05', level: 2, sortOrder: 5, isActive: true },
      { id: 'cat-09-06', parentId: 'cat-09', name: '其他税费', code: 'TX-06', level: 2, sortOrder: 6, isActive: true },
    ],
  },
  {
    id: 'cat-10', parentId: null, name: '其他', code: 'OT', level: 1, sortOrder: 10, isActive: true,
    children: [
      { id: 'cat-10-01', parentId: 'cat-10', name: '杂项费用', code: 'OT-01', level: 2, sortOrder: 1, isActive: true },
      { id: 'cat-10-02', parentId: 'cat-10', name: '临时支出', code: 'OT-02', level: 2, sortOrder: 2, isActive: true },
      { id: 'cat-10-03', parentId: 'cat-10', name: '捐赠赞助', code: 'OT-03', level: 2, sortOrder: 3, isActive: true },
      { id: 'cat-10-04', parentId: 'cat-10', name: '罚款支出', code: 'OT-04', level: 2, sortOrder: 4, isActive: true },
    ],
  },
];

// ── Mock 项目列表 ─────────────────────────────────────────────
export const projectOptions = [
  { id: 'proj-001', name: 'A公司CRM系统开发' },
  { id: 'proj-002', name: 'B公司小程序定制开发' },
  { id: 'proj-003', name: '内部OA优化' },
  { id: 'proj-004', name: 'C公司电商平台' },
];

// ── Mock 部门列表 ─────────────────────────────────────────────
export const departmentOptions = [
  { id: 'dept-001', name: '技术部' },
  { id: 'dept-002', name: '产品部' },
  { id: 'dept-003', name: '市场部' },
  { id: 'dept-004', name: '销售部' },
  { id: 'dept-005', name: '行政部' },
  { id: 'dept-006', name: '财务部' },
  { id: 'dept-007', name: '人力资源部' },
];

// ── Mock 费用记录 ─────────────────────────────────────────────
export const initialExpenseRecords: ExpenseRecord[] = [
  // 人力成本
  {
    id: 'exp-001', expenseNo: 'EXP-2026-07-001', categoryId: 'cat-01', categoryName: '人力成本',
    subCategoryId: 'cat-01-01', subCategoryName: '基本工资', amount: 150000,
    expenseDate: '2026-07-05', description: '7月份全员基本工资', sourceType: 'salary',
    departmentId: 'dept-007', departmentName: '人力资源部', createdBy: '财务部-陈会计', createdAt: '2026-07-05 10:00',
  },
  {
    id: 'exp-002', expenseNo: 'EXP-2026-07-002', categoryId: 'cat-01', categoryName: '人力成本',
    subCategoryId: 'cat-01-03', subCategoryName: '社保公积金', amount: 42000,
    expenseDate: '2026-07-10', description: '7月份社保公积金单位部分', sourceType: 'manual',
    departmentId: 'dept-007', departmentName: '人力资源部', createdBy: '财务部-陈会计', createdAt: '2026-07-10 14:00',
  },
  // 办公成本
  {
    id: 'exp-003', expenseNo: 'EXP-2026-07-003', categoryId: 'cat-02', categoryName: '办公成本',
    subCategoryId: 'cat-02-01', subCategoryName: '办公室租金', amount: 35000,
    expenseDate: '2026-07-01', description: '7月份办公室租金', sourceType: 'manual',
    createdBy: '行政部-王行政', createdAt: '2026-07-01 09:00',
  },
  {
    id: 'exp-004', expenseNo: 'EXP-2026-07-004', categoryId: 'cat-02', categoryName: '办公成本',
    subCategoryId: 'cat-02-03', subCategoryName: '水电费', amount: 3200,
    expenseDate: '2026-07-15', description: '7月份水电费账单', sourceType: 'manual',
    createdBy: '行政部-王行政', createdAt: '2026-07-15 11:00',
  },
  {
    id: 'exp-005', expenseNo: 'EXP-2026-07-005', categoryId: 'cat-02', categoryName: '办公成本',
    subCategoryId: 'cat-02-11', subCategoryName: '宿舍租金', amount: 8000,
    expenseDate: '2026-07-01', description: '7月份员工宿舍租金（4间）', sourceType: 'manual',
    createdBy: '行政部-王行政', createdAt: '2026-07-01 09:30',
  },
  // 差旅成本
  {
    id: 'exp-006', expenseNo: 'EXP-2026-07-006', categoryId: 'cat-03', categoryName: '差旅成本',
    subCategoryId: 'cat-03-01', subCategoryName: '市内交通', amount: 850,
    expenseDate: '2026-07-08', description: '张三出差打车费', sourceType: 'reimbursement',
    sourceId: 'reimb-001', projectId: 'proj-001', projectName: 'A公司CRM系统开发',
    createdBy: '张三', createdAt: '2026-07-08 16:00',
  },
  {
    id: 'exp-007', expenseNo: 'EXP-2026-07-007', categoryId: 'cat-03', categoryName: '差旅成本',
    subCategoryId: 'cat-03-03', subCategoryName: '住宿费', amount: 2400,
    expenseDate: '2026-07-08', description: '张三杭州出差酒店3晚', sourceType: 'reimbursement',
    sourceId: 'reimb-001', projectId: 'proj-001', projectName: 'A公司CRM系统开发',
    createdBy: '张三', createdAt: '2026-07-08 16:00',
  },
  {
    id: 'exp-008', expenseNo: 'EXP-2026-07-008', categoryId: 'cat-03', categoryName: '差旅成本',
    subCategoryId: 'cat-03-07', subCategoryName: '油费', amount: 600,
    expenseDate: '2026-07-12', description: '李四客户拜访油费', sourceType: 'reimbursement',
    sourceId: 'reimb-002', projectId: 'proj-002', projectName: 'B公司小程序定制开发',
    createdBy: '李四', createdAt: '2026-07-12 10:00',
  },
  {
    id: 'exp-009', expenseNo: 'EXP-2026-07-009', categoryId: 'cat-03', categoryName: '差旅成本',
    subCategoryId: 'cat-03-09', subCategoryName: '过路费', amount: 280,
    expenseDate: '2026-07-12', description: '李四客户拜访过路费', sourceType: 'reimbursement',
    sourceId: 'reimb-002', projectId: 'proj-002', projectName: 'B公司小程序定制开发',
    createdBy: '李四', createdAt: '2026-07-12 10:00',
  },
  // 福利成本
  {
    id: 'exp-010', expenseNo: 'EXP-2026-07-010', categoryId: 'cat-04', categoryName: '福利成本',
    subCategoryId: 'cat-04-01', subCategoryName: '团建活动', amount: 4500,
    expenseDate: '2026-07-20', description: '技术部7月团建聚餐', sourceType: 'reimbursement',
    sourceId: 'reimb-003', departmentId: 'dept-001', departmentName: '技术部',
    createdBy: '技术部-王经理', createdAt: '2026-07-20 18:00',
  },
  {
    id: 'exp-011', expenseNo: 'EXP-2026-07-011', categoryId: 'cat-04', categoryName: '福利成本',
    subCategoryId: 'cat-04-04', subCategoryName: '下午茶/零食', amount: 1200,
    expenseDate: '2026-07-25', description: '7月份下午茶费用', sourceType: 'manual',
    departmentId: 'dept-005', departmentName: '行政部',
    createdBy: '行政部-王行政', createdAt: '2026-07-25 15:00',
  },
  // 商务成本
  {
    id: 'exp-012', expenseNo: 'EXP-2026-07-012', categoryId: 'cat-05', categoryName: '商务成本',
    subCategoryId: 'cat-05-01', subCategoryName: '招待费', amount: 3200,
    expenseDate: '2026-07-18', description: 'A公司客户商务宴请', sourceType: 'reimbursement',
    sourceId: 'reimb-004', projectId: 'proj-001', projectName: 'A公司CRM系统开发',
    createdBy: '销售部-李经理', createdAt: '2026-07-18 20:00',
  },
  {
    id: 'exp-013', expenseNo: 'EXP-2026-07-013', categoryId: 'cat-05', categoryName: '商务成本',
    subCategoryId: 'cat-05-02', subCategoryName: '礼品费', amount: 1500,
    expenseDate: '2026-07-22', description: '客户关系维护礼品', sourceType: 'reimbursement',
    sourceId: 'reimb-005', createdBy: '销售部-李经理', createdAt: '2026-07-22 14:00',
  },
  // 市场成本
  {
    id: 'exp-014', expenseNo: 'EXP-2026-07-014', categoryId: 'cat-06', categoryName: '市场成本',
    subCategoryId: 'cat-06-03', subCategoryName: '广告费', amount: 8000,
    expenseDate: '2026-07-01', description: '百度搜索推广7月份', sourceType: 'manual',
    departmentId: 'dept-003', departmentName: '市场部',
    createdBy: '市场部-赵经理', createdAt: '2026-07-01 10:00',
  },
  {
    id: 'exp-015', expenseNo: 'EXP-2026-07-015', categoryId: 'cat-06', categoryName: '市场成本',
    subCategoryId: 'cat-06-03', subCategoryName: '广告费', amount: 5000,
    expenseDate: '2026-07-01', description: '小红书企业号推广7月份', sourceType: 'manual',
    departmentId: 'dept-003', departmentName: '市场部',
    createdBy: '市场部-赵经理', createdAt: '2026-07-01 10:00',
  },
  // 第三方服务费
  {
    id: 'exp-016', expenseNo: 'EXP-2026-07-016', categoryId: 'cat-07', categoryName: '第三方服务费',
    subCategoryId: 'cat-07-01', subCategoryName: '云服务', amount: 6800,
    expenseDate: '2026-07-01', description: '阿里云ECS+RDS 7月份', sourceType: 'contract',
    sourceId: 'contract-001', projectId: 'proj-001', projectName: 'A公司CRM系统开发',
    createdBy: '技术部-张工', createdAt: '2026-07-01 11:00',
  },
  {
    id: 'exp-017', expenseNo: 'EXP-2026-07-017', categoryId: 'cat-07', categoryName: '第三方服务费',
    subCategoryId: 'cat-07-02', subCategoryName: '软件订阅', amount: 2400,
    expenseDate: '2026-07-01', description: 'Figma团队版 7月份', sourceType: 'contract',
    sourceId: 'contract-002',
    createdBy: '产品部-刘经理', createdAt: '2026-07-01 11:30',
  },
  // 税费
  {
    id: 'exp-018', expenseNo: 'EXP-2026-07-018', categoryId: 'cat-09', categoryName: '税费',
    subCategoryId: 'cat-09-01', subCategoryName: '增值税', amount: 18500,
    expenseDate: '2026-07-15', description: '7月份增值税', sourceType: 'manual',
    createdBy: '财务部-陈会计', createdAt: '2026-07-15 16:00',
  },
  // 8月记录
  {
    id: 'exp-019', expenseNo: 'EXP-2026-08-001', categoryId: 'cat-01', categoryName: '人力成本',
    subCategoryId: 'cat-01-01', subCategoryName: '基本工资', amount: 152000,
    expenseDate: '2026-08-05', description: '8月份全员基本工资（新增1人）', sourceType: 'salary',
    departmentId: 'dept-007', departmentName: '人力资源部', createdBy: '财务部-陈会计', createdAt: '2026-08-05 10:00',
  },
  {
    id: 'exp-020', expenseNo: 'EXP-2026-08-002', categoryId: 'cat-02', categoryName: '办公成本',
    subCategoryId: 'cat-02-01', subCategoryName: '办公室租金', amount: 35000,
    expenseDate: '2026-08-01', description: '8月份办公室租金', sourceType: 'manual',
    createdBy: '行政部-王行政', createdAt: '2026-08-01 09:00',
  },
];

// ── Mock 费用模板 ─────────────────────────────────────────────
export const initialExpenseTemplates: ExpenseTemplate[] = [
  {
    id: 'tpl-001', templateName: '办公室月租', categoryId: 'cat-02', categoryName: '办公成本',
    subCategoryId: 'cat-02-01', subCategoryName: '办公室租金', amount: 35000,
    cycleType: 'monthly', startDate: '2026-01-01', isActive: true, createdAt: '2026-01-01 10:00',
    amountHistory: [
      { id: 'tah-001', templateId: 'tpl-001', oldAmount: 30000, newAmount: 35000, effectiveDate: '2026-04-01', createdBy: '财务部-陈会计', createdAt: '2026-04-01 10:00' },
    ],
  },
  {
    id: 'tpl-002', templateName: '员工宿舍月租', categoryId: 'cat-02', categoryName: '办公成本',
    subCategoryId: 'cat-02-11', subCategoryName: '宿舍租金', amount: 8000,
    cycleType: 'monthly', startDate: '2026-01-01', isActive: true, createdAt: '2026-01-01 10:00',
    amountHistory: [],
  },
  {
    id: 'tpl-003', templateName: '全员社保公积金', categoryId: 'cat-01', categoryName: '人力成本',
    subCategoryId: 'cat-01-03', subCategoryName: '社保公积金', amount: 42000,
    cycleType: 'monthly', startDate: '2026-01-01', isActive: true, createdAt: '2026-01-01 10:00',
    amountHistory: [],
  },
  {
    id: 'tpl-004', templateName: '阿里云服务月费', categoryId: 'cat-07', categoryName: '第三方服务费',
    subCategoryId: 'cat-07-01', subCategoryName: '云服务', amount: 6800,
    cycleType: 'monthly', startDate: '2026-03-01', isActive: true, createdAt: '2026-03-01 10:00',
    amountHistory: [
      { id: 'tah-002', templateId: 'tpl-004', oldAmount: 5200, newAmount: 6800, effectiveDate: '2026-06-01', createdBy: '技术部-张工', createdAt: '2026-06-01 10:00' },
    ],
  },
  {
    id: 'tpl-005', templateName: '百度推广月费', categoryId: 'cat-06', categoryName: '市场成本',
    subCategoryId: 'cat-06-03', subCategoryName: '广告费', amount: 8000,
    cycleType: 'monthly', startDate: '2026-01-01', isActive: true, createdAt: '2026-01-01 10:00',
    amountHistory: [],
  },
  {
    id: 'tpl-006', templateName: '物业管理费（季度）', categoryId: 'cat-02', categoryName: '办公成本',
    subCategoryId: 'cat-02-02', subCategoryName: '物业管理费', amount: 15000,
    cycleType: 'quarterly', startDate: '2026-01-01', isActive: true, createdAt: '2026-01-01 10:00',
    amountHistory: [],
  },
  {
    id: 'tpl-007', templateName: '年度保险费', categoryId: 'cat-07', categoryName: '第三方服务费',
    subCategoryId: 'cat-07-07', subCategoryName: '保险费用', amount: 36000,
    cycleType: 'yearly', startDate: '2026-01-01', endDate: '2026-12-31', isActive: true, createdAt: '2026-01-01 10:00',
    amountHistory: [],
  },
];

// ── 辅助函数 ──────────────────────────────────────────────────
/** 获取分类的一级分类名称 */
export function getTopCategoryName(categoryId: string): string {
  const cat = defaultCategories.find(c => c.id === categoryId);
  return cat?.name ?? '';
}

/** 获取二级分类选项 */
export function getSubCategories(categoryId: string): ExpenseCategory[] {
  const cat = defaultCategories.find(c => c.id === categoryId);
  return cat?.children ?? [];
}

/** 获取所有一级分类选项 */
export function getTopCategories(): ExpenseCategory[] {
  return defaultCategories.filter(c => c.level === 1);
}

/** 扁平化分类列表 */
export function flattenCategories(categories: ExpenseCategory[]): ExpenseCategory[] {
  const result: ExpenseCategory[] = [];
  for (const cat of categories) {
    result.push(cat);
    if (cat.children) {
      result.push(...cat.children);
    }
  }
  return result;
}
