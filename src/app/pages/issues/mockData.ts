import {
  Comment,
  Defect,
  Requirement,
  Task,
  WorkItemLink,
  ChecklistItem,
} from './types';

// ============================================================
// 辅助函数
// ============================================================

function generateId(): string {
  return Math.random().toString(36).substring(2, 10);
}

function generateProjectNo(items: { projectNo: string }[], prefix: string): string {
  const nums = items
    .map(i => parseInt(i.projectNo.replace(prefix, ''), 10))
    .filter(n => !isNaN(n));
  const next = nums.length > 0 ? Math.max(...nums) + 1 : 1;
  return `${prefix}${String(next).padStart(3, '0')}`;
}

function daysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().split('T')[0];
}

function daysLater(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

// ============================================================
// 初始需求数据
// ============================================================

export const initialRequirements: Requirement[] = [
  {
    id: 'req-1',
    projectNo: 'REQ-001',
    title: '实现客户管理模块',
    description: '<p>客户管理模块需要支持客户信息的增删改查、客户分级（SABC）、客户跟进记录等功能。</p><p><strong>业务背景：</strong>销售团队需要一个统一的客户信息管理平台。</p>',
    type: 'requirement',
    status: '进行中',
    priority: '高',
    projectId: '1',
    contractId: '4',
    assigneeId: '10',
    creatorId: '1',
    acceptanceCriteria: '1. 客户列表支持分页和搜索\n2. 客户详情页展示关联线索和合同\n3. 支持客户分级标签',
    createdAt: '2026-05-02 10:00',
    updatedAt: '2026-07-15 14:30',
  },
  {
    id: 'req-2',
    projectNo: 'REQ-002',
    title: '项目成本核算功能',
    description: '<p>根据员工工时和职级时薪计算项目人力成本，结合报销计算总成本。</p>',
    type: 'requirement',
    status: '待处理',
    priority: '中',
    projectId: '1',
    contractId: '4',
    assigneeId: '12',
    creatorId: '1',
    acceptanceCriteria: '1. 自动汇总日报工时\n2. 按职级时薪计算人力成本\n3. 生成成本报表',
    createdAt: '2026-05-10 09:00',
    updatedAt: '2026-05-10 09:00',
  },
  {
    id: 'req-3',
    projectNo: 'REQ-001',
    title: '小程序首页与商品列表',
    description: '<p>B公司小程序首页开发和商品列表页面开发。</p>',
    type: 'requirement',
    status: '已完成',
    priority: '高',
    projectId: '2',
    assigneeId: '3',
    creatorId: '5',
    createdAt: '2026-04-15 10:00',
    updatedAt: '2026-07-01 16:00',
  },
  {
    id: 'req-4',
    projectNo: 'REQ-003',
    title: '数据报表与可视化看板',
    description: '<p>为管理层提供销售漏斗、项目进度、成本利润的可视化看板。</p>',
    type: 'requirement',
    status: '已搁置',
    priority: '低',
    projectId: '1',
    assigneeId: '2',
    creatorId: '1',
    createdAt: '2026-06-01 11:00',
    updatedAt: '2026-07-10 09:00',
  },
];

// ============================================================
// 初始任务数据
// ============================================================

export const initialTasks: Task[] = [
  {
    id: 'tsk-1',
    projectNo: 'TSK-001',
    title: '客户列表页面开发',
    description: '<p>使用 Arco Design Table 组件实现客户列表，支持搜索、筛选、分页。</p>',
    type: 'task',
    status: '已完成',
    priority: '高',
    projectId: '1',
    requirementId: 'req-1',
    assigneeId: '3',
    creatorId: '1',
    estimatedHours: 16,
    actualHours: 14,
    checklist: [
      { id: 'cl-1', text: '列表页面布局', done: true },
      { id: 'cl-2', text: '搜索筛选功能', done: true },
      { id: 'cl-3', text: '分页功能', done: true },
    ],
    dueDate: '2026-07-20',
    createdAt: '2026-05-03 09:00',
    updatedAt: '2026-07-18 17:00',
  },
  {
    id: 'tsk-2',
    projectNo: 'TSK-002',
    title: '客户详情页开发',
    description: '<p>客户详情页展示基础信息、关联线索、关联合同、跟进记录等 Tab。</p>',
    type: 'task',
    status: '进行中',
    priority: '高',
    projectId: '1',
    requirementId: 'req-1',
    assigneeId: '14',
    creatorId: '1',
    estimatedHours: 20,
    actualHours: 8,
    checklist: [
      { id: 'cl-4', text: '基础信息 Tab', done: true },
      { id: 'cl-5', text: '关联线索 Tab', done: false },
      { id: 'cl-6', text: '跟进记录 Timeline', done: false },
    ],
    dueDate: '2026-07-25',
    createdAt: '2026-07-01 10:00',
    updatedAt: '2026-07-20 11:00',
  },
  {
    id: 'tsk-3',
    projectNo: 'TSK-003',
    title: '后端客户管理 API 开发',
    description: '<p>开发客户管理的 RESTful API，包括列表查询、详情查询、新增、编辑、删除。</p>',
    type: 'task',
    status: '进行中',
    priority: '高',
    projectId: '1',
    requirementId: 'req-1',
    assigneeId: '2',
    creatorId: '1',
    estimatedHours: 24,
    actualHours: 12,
    checklist: [
      { id: 'cl-7', text: '列表查询 API', done: true },
      { id: 'cl-8', text: '详情查询 API', done: true },
      { id: 'cl-9', text: '新增/编辑 API', done: false },
      { id: 'cl-10', text: '删除 API', done: false },
    ],
    dueDate: '2026-07-28',
    createdAt: '2026-07-02 09:00',
    updatedAt: '2026-07-21 15:00',
  },
  {
    id: 'tsk-4',
    projectNo: 'TSK-004',
    title: '成本核算接口设计',
    description: '<p>设计成本核算的数据模型和接口。</p>',
    type: 'task',
    status: '待处理',
    priority: '中',
    projectId: '1',
    requirementId: 'req-2',
    assigneeId: '4',
    creatorId: '1',
    estimatedHours: 8,
    actualHours: 0,
    checklist: [],
    dueDate: '2026-08-05',
    createdAt: '2026-07-10 14:00',
    updatedAt: '2026-07-10 14:00',
  },
  {
    id: 'tsk-5',
    projectNo: 'TSK-001',
    title: '小程序首页 UI 实现',
    description: '<p>根据设计稿实现小程序首页。</p>',
    type: 'task',
    status: '已完成',
    priority: '高',
    projectId: '2',
    requirementId: 'req-3',
    assigneeId: '3',
    creatorId: '5',
    estimatedHours: 12,
    actualHours: 10,
    checklist: [
      { id: 'cl-11', text: '轮播图组件', done: true },
      { id: 'cl-12', text: '导航菜单', done: true },
      { id: 'cl-13', text: '商品推荐区域', done: true },
    ],
    dueDate: '2026-06-15',
    createdAt: '2026-04-20 10:00',
    updatedAt: '2026-06-10 17:00',
  },
  {
    id: 'tsk-6',
    projectNo: 'TSK-005',
    title: '联调测试客户模块',
    description: '<p>前后端联调客户管理模块，进行功能测试。</p>',
    type: 'task',
    status: '已阻塞',
    priority: '中',
    projectId: '1',
    requirementId: 'req-1',
    assigneeId: '1',
    creatorId: '1',
    estimatedHours: 8,
    actualHours: 2,
    checklist: [
      { id: 'cl-14', text: '列表接口联调', done: true },
      { id: 'cl-15', text: '详情接口联调', done: false },
    ],
    dueDate: '2026-07-30',
    createdAt: '2026-07-15 09:00',
    updatedAt: '2026-07-22 10:00',
  },
];

// ============================================================
// 初始缺陷数据
// ============================================================

export const initialDefects: Defect[] = [
  {
    id: 'bug-1',
    projectNo: 'BUG-001',
    title: '客户列表分页不正确',
    description: '<p>当筛选条件变化时，分页总数没有重置，导致第二页显示空数据。</p>',
    type: 'defect',
    status: '已关闭',
    severity: '一般',
    priority: '中',
    projectId: '1',
    requirementId: 'req-1',
    taskId: 'tsk-1',
    assigneeId: '3',
    creatorId: '1',
    reproductionSteps: '1. 进入客户列表\n2. 设置筛选条件\n3. 翻到第 2 页\n4. 清除筛选条件\n5. 第 2 页显示空数据',
    dueDate: '2026-07-22',
    createdAt: '2026-07-16 10:00',
    updatedAt: '2026-07-19 14:00',
  },
  {
    id: 'bug-2',
    projectNo: 'BUG-002',
    title: '客户详情页加载缓慢',
    description: '<p>客户详情页打开时，关联数据全部同时加载，导致页面卡顿 3-5 秒。</p>',
    type: 'defect',
    status: '处理中',
    severity: '严重',
    priority: '高',
    projectId: '1',
    requirementId: 'req-1',
    taskId: 'tsk-2',
    assigneeId: '14',
    creatorId: '1',
    reproductionSteps: '1. 进入客户列表\n2. 点击任意客户进入详情页\n3. 观察加载时间',
    dueDate: '2026-07-25',
    createdAt: '2026-07-18 15:00',
    updatedAt: '2026-07-21 09:00',
  },
  {
    id: 'bug-3',
    projectNo: 'BUG-001',
    title: '小程序首页图片加载失败',
    description: '<p>部分机型首页轮播图无法显示，控制台报 404。</p>',
    type: 'defect',
    status: '待验证',
    severity: '一般',
    priority: '中',
    projectId: '2',
    requirementId: 'req-3',
    taskId: 'tsk-5',
    assigneeId: '3',
    creatorId: '5',
    reproductionSteps: '1. 在 iPhone SE 上打开小程序\n2. 进入首页\n3. 轮播图区域空白',
    dueDate: '2026-07-23',
    createdAt: '2026-07-12 11:00',
    updatedAt: '2026-07-20 16:00',
  },
  {
    id: 'bug-4',
    projectNo: 'BUG-003',
    title: '客户删除后关联线索未清理',
    description: '<p>删除客户后，关联的线索仍然显示已删除的客户名称，且无法点击。</p>',
    type: 'defect',
    status: '待处理',
    severity: '严重',
    priority: '高',
    projectId: '1',
    requirementId: 'req-1',
    assigneeId: '2',
    creatorId: '10',
    reproductionSteps: '1. 选择一个有关联线索的客户\n2. 删除该客户\n3. 进入关联线索列表\n4. 线索显示异常',
    dueDate: '2026-07-28',
    createdAt: '2026-07-21 14:00',
    updatedAt: '2026-07-21 14:00',
  },
];

// ============================================================
// 初始评论数据
// ============================================================

export const initialComments: Comment[] = [
  {
    id: 'cmt-1',
    workItemId: 'req-1',
    workItemType: 'requirement',
    authorId: '10',
    content: '需求已确认，我这边开始做产品设计。@王五 前端页面预计什么时候能出初版？',
    mentions: ['3'],
    createdAt: '2026-05-03 10:30',
  },
  {
    id: 'cmt-2',
    workItemId: 'req-1',
    workItemType: 'requirement',
    authorId: '3',
    content: '预计本周五可以出初版，我先做列表页面。',
    mentions: [],
    createdAt: '2026-05-03 11:00',
  },
  {
    id: 'cmt-3',
    workItemId: 'tsk-2',
    workItemType: 'task',
    authorId: '14',
    content: '基础信息 Tab 已完成，正在做关联线索 Tab。@李四 接口数据格式确认一下？',
    mentions: ['1'],
    createdAt: '2026-07-18 16:00',
  },
  {
    id: 'cmt-4',
    workItemId: 'bug-2',
    workItemType: 'defect',
    authorId: '14',
    content: '已定位问题，是同时请求了 5 个接口。我改成懒加载方式，明天提交修复。',
    mentions: [],
    createdAt: '2026-07-21 10:00',
  },
  {
    id: 'cmt-5',
    workItemId: 'bug-1',
    workItemType: 'defect',
    authorId: '3',
    content: '已修复，分页会在筛选变化时重置到第一页。',
    mentions: [],
    createdAt: '2026-07-19 11:00',
  },
];

// ============================================================
// 初始操作历史
// ============================================================

export const initialActivityLogs = [
  { id: 'log-1', workItemId: 'req-1', workItemType: 'requirement' as const, actorId: '1', action: 'create' as const, createdAt: '2026-05-02 10:00' },
  { id: 'log-2', workItemId: 'req-1', workItemType: 'requirement' as const, actorId: '1', action: 'status_change' as const, field: 'status', oldValue: '待处理', newValue: '进行中', createdAt: '2026-05-03 09:00' },
  { id: 'log-3', workItemId: 'tsk-1', workItemType: 'task' as const, actorId: '1', action: 'create' as const, createdAt: '2026-05-03 09:00' },
  { id: 'log-4', workItemId: 'tsk-1', workItemType: 'task' as const, actorId: '3', action: 'status_change' as const, field: 'status', oldValue: '进行中', newValue: '已完成', createdAt: '2026-07-18 17:00' },
  { id: 'log-5', workItemId: 'bug-1', workItemType: 'defect' as const, actorId: '1', action: 'create' as const, createdAt: '2026-07-16 10:00' },
  { id: 'log-6', workItemId: 'bug-1', workItemType: 'defect' as const, actorId: '3', action: 'status_change' as const, field: 'status', oldValue: '处理中', newValue: '待验证', createdAt: '2026-07-19 11:00' },
  { id: 'log-7', workItemId: 'bug-1', workItemType: 'defect' as const, actorId: '1', action: 'status_change' as const, field: 'status', oldValue: '待验证', newValue: '已关闭', createdAt: '2026-07-19 14:00' },
  { id: 'log-8', workItemId: 'tsk-6', workItemType: 'task' as const, actorId: '1', action: 'status_change' as const, field: 'status', oldValue: '进行中', newValue: '已阻塞', remark: '后端接口未就绪', createdAt: '2026-07-22 10:00' },
];

// ============================================================
// 初始关联
// ============================================================

export const initialWorkItemLinks: WorkItemLink[] = [
  { id: 'link-1', sourceId: 'bug-1', targetId: 'tsk-1', createdAt: '2026-07-16 10:00' },
  { id: 'link-2', sourceId: 'bug-2', targetId: 'tsk-2', createdAt: '2026-07-18 15:00' },
];

// ============================================================
// 状态管理 Hook
// ============================================================

export interface WorkItemStore {
  requirements: Requirement[];
  tasks: Task[];
  defects: Defect[];
  comments: Comment[];
  activityLogs: typeof initialActivityLogs;
  links: WorkItemLink[];
}

export function createInitialStore(): WorkItemStore {
  return {
    requirements: [...initialRequirements],
    tasks: [...initialTasks],
    defects: [...initialDefects],
    comments: [...initialComments],
    activityLogs: [...initialActivityLogs],
    links: [...initialWorkItemLinks],
  };
}

// ── 工具函数 ────────────────────────────────────────────────

export function getEmployeeName(id: string): string {
  const map: Record<string, string> = {
    '1': '张三', '2': '李四', '3': '王五', '4': '赵六', '5': '钱七',
    '6': '孙八', '7': '周九', '8': '吴十', '9': '陈明', '10': '林小红',
    '11': '张伟', '12': '赵玲', '13': '刘洋', '14': '黄丽', '15': '徐强', '16': '杨帆',
  };
  return map[id] || '未知';
}

export function getProjectName(id: string): string {
  const map: Record<string, string> = {
    '1': 'A公司CRM系统开发',
    '2': 'B公司小程序定制开发',
  };
  return map[id] || '未知项目';
}

export { daysAgo, daysLater, generateId, generateProjectNo };
