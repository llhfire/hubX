export type ProjectPriority = '高' | '中' | '低';
export type ProjectStatus = '未开始' | '进行中' | '已完成' | '验收中' | '搁置' | '延迟' | '催款中';
export type BusinessLine = '外包' | '自研' | '自运营';

export interface ProjectAttachment {
  id: string;
  name: string;
  size: string;
}

export interface Project {
  id: string;
  projectNo: string;
  name: string;
  latestProgress: string;
  priority: ProjectPriority;
  entity: string;
  status: ProjectStatus;
  businessLine: BusinessLine;
  salesUsers: string[];
  owner: string;
  assistants: string[];
  productUsers: string[];
  uiUsers: string[];
  frontendUsers: string[];
  backendUsers: string[];
  opsUsers: string[];
  testUsers: string[];
  legalUsers: string[];
  progress: number;
  startDate: string;
  expectedEndDate: string;
  remark: string;
  attachments: ProjectAttachment[];
  contractId?: string;
  createdAt: string;
}

export interface ProjectFollowUp {
  id: string;
  projectId: string;
  status: ProjectStatus;
  progress: number;
  content: string;
  attachments: ProjectAttachment[];
  operator: string;
  createdAt: string;
}

export interface ProjectLeadRelation {
  id: string;
  projectId: string;
  leadNo: string;
  leadName: string;
  owner: string;
  preSaleGroupName: string;
  customerCategory: string;
  source: string;
  customerName: string;
  phone: string;
  wechat: string;
  leadCreatedAt: string;
}

export interface ProjectDailyReport {
  id: string;
  projectId: string;
  date: string;
  projectName: string;
  personName: string;
  position: string;
  hours: number;
  workContent: string;
  riskFeedback: string;
}

export interface ProjectDocument {
  id: string;
  projectId: string;
  title: string;
  onlineUrl: string;
  owner: string;
  uploadedFileName: string;
  description: string;
  createdAt: string;
}

export interface ProjectMemberHours {
  key: string;
  personName: string;
  position: string;
  hours: number;
}

export const projectPriorities: ProjectPriority[] = ['高', '中', '低'];
export const projectStatuses: ProjectStatus[] = ['未开始', '进行中', '已完成', '验收中', '搁置', '延迟', '催款中'];
export const businessLines: BusinessLine[] = ['外包', '自研', '自运营'];

export const companyEntities = ['中科软艺', '软艺信息', '巴蜀文攻'];
export const employees = ['张三', '李四', '王五', '赵六', '孙七', '周八', '钱九'];
export const roleEmployees = {
  sales: ['张三', '李四', '钱九'],
  product: ['李四', '孙七'],
  ui: ['孙七', '周八'],
  frontend: ['王五', '钱九'],
  backend: ['赵六', '周八'],
  ops: ['周八', '王五'],
  test: ['钱九', '赵六'],
  legal: ['张三'],
};

export const initialProjects: Project[] = [
  {
    id: '1',
    projectNo: 'PRJ202605001',
    name: 'A公司CRM系统开发',
    latestProgress: '完成项目管理底座需求梳理，进入原型确认阶段。',
    priority: '高',
    entity: '中科软艺',
    status: '进行中',
    businessLine: '外包',
    salesUsers: ['张三'],
    owner: '李四',
    assistants: ['王五'],
    productUsers: ['李四'],
    uiUsers: ['孙七'],
    frontendUsers: ['王五'],
    backendUsers: ['赵六'],
    opsUsers: ['周八'],
    testUsers: ['钱九'],
    legalUsers: ['张三'],
    progress: 65,
    startDate: '2026-05-01',
    expectedEndDate: '2026-06-30',
    remark: '客户重点关注销售跟进、客户管理和项目成本统计。',
    attachments: [{ id: 'att-1', name: '项目需求初稿.pdf', size: '1.2MB' }],
    contractId: '4',
    createdAt: '2026-05-01 09:30',
  },
  {
    id: '2',
    projectNo: 'PRJ202605002',
    name: 'B公司小程序定制开发',
    latestProgress: '客户已确认首页和订单流程，等待 UI 终稿。',
    priority: '中',
    entity: '软艺信息',
    status: '验收中',
    businessLine: '外包',
    salesUsers: ['李四'],
    owner: '王五',
    assistants: ['赵六'],
    productUsers: ['孙七'],
    uiUsers: ['周八'],
    frontendUsers: ['王五'],
    backendUsers: ['赵六'],
    opsUsers: ['王五'],
    testUsers: ['钱九'],
    legalUsers: [],
    progress: 90,
    startDate: '2026-04-10',
    expectedEndDate: '2026-05-20',
    remark: '验收阶段重点跟进客户反馈。',
    attachments: [],
    contractId: '2',
    createdAt: '2026-04-10 10:00',
  },
  {
    id: '3',
    projectNo: 'PRJ202605003',
    name: '内部OA流程优化',
    latestProgress: '已完成流程字段盘点，等待排期。',
    priority: '低',
    entity: '中科软艺',
    status: '未开始',
    businessLine: '自研',
    salesUsers: [],
    owner: '赵六',
    assistants: ['孙七'],
    productUsers: ['李四'],
    uiUsers: [],
    frontendUsers: ['钱九'],
    backendUsers: ['周八'],
    opsUsers: [],
    testUsers: [],
    legalUsers: [],
    progress: 0,
    startDate: '2026-06-01',
    expectedEndDate: '2026-07-15',
    remark: '内部项目，成本核算阶段再接入人工成本。',
    attachments: [],
    contractId: '3',
    createdAt: '2026-05-08 15:20',
  },
];

export const availableLeads: ProjectLeadRelation[] = [
  {
    id: 'lead-1',
    projectId: '',
    leadNo: 'LD202605001',
    leadName: 'A公司CRM系统开发需求',
    owner: '张三',
    preSaleGroupName: 'A公司售前沟通群',
    customerCategory: '企业客户',
    source: '百度推广',
    customerName: '刘经理',
    phone: '13800138000',
    wechat: 'liujingli-a',
    leadCreatedAt: '2026-04-28 10:30',
  },
  {
    id: 'lead-2',
    projectId: '',
    leadNo: 'LD202605002',
    leadName: 'B公司小程序开发咨询',
    owner: '李四',
    preSaleGroupName: 'B公司项目群',
    customerCategory: '中小企业',
    source: '小红书',
    customerName: '陈总',
    phone: '13900139000',
    wechat: 'chen-b',
    leadCreatedAt: '2026-04-09 14:20',
  },
  {
    id: 'lead-3',
    projectId: '',
    leadNo: 'LD202605003',
    leadName: '内部流程系统升级',
    owner: '钱九',
    preSaleGroupName: '内部需求群',
    customerCategory: '内部需求',
    source: '内部转化',
    customerName: '行政部',
    phone: '027-88888888',
    wechat: 'oa-admin',
    leadCreatedAt: '2026-05-06 09:10',
  },
];

export const initialLeadRelations: ProjectLeadRelation[] = [
  { ...availableLeads[0], id: 'relation-1', projectId: '1' },
  { ...availableLeads[1], id: 'relation-2', projectId: '2' },
];

export const initialDailyReports: ProjectDailyReport[] = [
  {
    id: 'daily-1',
    projectId: '1',
    date: '2026-05-08',
    projectName: 'A公司CRM系统开发',
    personName: '李四',
    position: '产品经理',
    hours: 6,
    workContent: '整理项目管理底座字段和详情页结构。',
    riskFeedback: '客户希望后续能看到成本汇总，需要提前预留入口。',
  },
  {
    id: 'daily-2',
    projectId: '1',
    date: '2026-05-08',
    projectName: 'A公司CRM系统开发',
    personName: '王五',
    position: '前端开发工程师',
    hours: 7.5,
    workContent: '评估现有项目页面和日报页面联动方式。',
    riskFeedback: '无',
  },
  {
    id: 'daily-3',
    projectId: '1',
    date: '2026-05-09',
    projectName: 'A公司CRM系统开发',
    personName: '赵六',
    position: '后端开发工程师',
    hours: 5,
    workContent: '梳理后续项目成本接口字段。',
    riskFeedback: '人工成本设置需要财务权限控制。',
  },
  {
    id: 'daily-4',
    projectId: '2',
    date: '2026-05-08',
    projectName: 'B公司小程序定制开发',
    personName: '王五',
    position: '前端开发工程师',
    hours: 4,
    workContent: '修复验收反馈中的订单页面样式问题。',
    riskFeedback: '客户新增两个展示字段。',
  },
];

export const initialFollowUps: ProjectFollowUp[] = [
  {
    id: 'follow-1',
    projectId: '1',
    status: '进行中',
    progress: 65,
    content: '完成项目管理底座需求梳理，进入原型确认阶段。',
    attachments: [{ id: 'follow-att-1', name: '会议纪要.pdf', size: '860KB' }],
    operator: '李四',
    createdAt: '2026-05-09 10:20',
  },
  {
    id: 'follow-2',
    projectId: '1',
    status: '进行中',
    progress: 45,
    content: '客户确认先做项目管理底座，成本核算拆到后续阶段。',
    attachments: [],
    operator: '张三',
    createdAt: '2026-05-08 16:40',
  },
  {
    id: 'follow-3',
    projectId: '2',
    status: '验收中',
    progress: 90,
    content: '客户反馈首页样式需要微调。',
    attachments: [],
    operator: '王五',
    createdAt: '2026-05-08 11:15',
  },
];

export const initialDocuments: ProjectDocument[] = [
  {
    id: 'doc-1',
    projectId: '1',
    title: '项目需求说明书',
    onlineUrl: 'https://example.com/project-a-requirements',
    owner: '李四',
    uploadedFileName: '',
    description: '记录项目范围、模块拆解和客户确认事项。',
    createdAt: '2026-05-08 18:00',
  },
  {
    id: 'doc-2',
    projectId: '1',
    title: '原型确认截图',
    onlineUrl: '',
    owner: '孙七',
    uploadedFileName: '项目原型截图.zip',
    description: '客户确认过的页面截图。',
    createdAt: '2026-05-09 09:40',
  },
];

export function createProjectNo(index: number) {
  return `PRJ202605${String(index + 1).padStart(3, '0')}`;
}

export function calculateProjectHours(projectId: string, reports: ProjectDailyReport[]) {
  return reports
    .filter((report) => report.projectId === projectId)
    .reduce((sum, report) => sum + report.hours, 0);
}

export function buildProjectMemberHours(projectId: string, reports: ProjectDailyReport[]): ProjectMemberHours[] {
  const map = new Map<string, ProjectMemberHours>();

  reports
    .filter((report) => report.projectId === projectId)
    .forEach((report) => {
      const current = map.get(report.personName) ?? {
        key: report.personName,
        personName: report.personName,
        position: report.position,
        hours: 0,
      };
      current.hours += report.hours;
      map.set(report.personName, current);
    });

  return Array.from(map.values());
}

export function summarizeProgress(content: string) {
  const trimmed = content.trim();
  return trimmed.length > 36 ? `${trimmed.slice(0, 36)}...` : trimmed;
}
