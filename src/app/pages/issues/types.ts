// ============================================================
// 工作项模块 — 类型定义
// 三种独立模型：Requirement / Task / Defect
// 评论和操作历史共用表
// ============================================================

export type WorkItemType = 'requirement' | 'task' | 'defect';

// ── 需求 ────────────────────────────────────────────────────
export type RequirementStatus = '待处理' | '进行中' | '已完成' | '已搁置';

export interface Requirement {
  id: string;
  projectNo: string;       // 项目内编号，如 REQ-001
  title: string;
  description: string;     // 富文本 HTML
  type: 'requirement';
  status: RequirementStatus;
  priority: WorkItemPriority;
  projectId: string;
  contractId?: string;
  sopStepId?: string;
  assigneeId: string;
  creatorId: string;
  acceptanceCriteria?: string;
  createdAt: string;
  updatedAt: string;
}

// ── 任务 ────────────────────────────────────────────────────
export type TaskStatus = '待处理' | '进行中' | '已完成' | '已阻塞';

export interface ChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

export interface Task {
  id: string;
  projectNo: string;       // 如 TSK-001
  title: string;
  description: string;
  type: 'task';
  status: TaskStatus;
  priority: WorkItemPriority;
  projectId: string;
  requirementId?: string;  // 父需求（可选）
  contractId?: string;
  sopStepId?: string;
  assigneeId: string;
  creatorId: string;
  estimatedHours?: number;
  actualHours?: number;
  checklist: ChecklistItem[];
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

// ── 缺陷 ────────────────────────────────────────────────────
export type DefectStatus = '待处理' | '处理中' | '待验证' | '已关闭' | '已拒绝' | '已重开';
export type DefectSeverity = '致命' | '严重' | '一般' | '轻微';

export interface Defect {
  id: string;
  projectNo: string;       // 如 BUG-001
  title: string;
  description: string;
  type: 'defect';
  status: DefectStatus;
  severity: DefectSeverity;
  priority: WorkItemPriority;
  projectId: string;
  requirementId?: string;
  taskId?: string;
  contractId?: string;
  sopStepId?: string;
  assigneeId: string;      // 修复人
  creatorId: string;       // 发现人
  reproductionSteps?: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

// ── 联合类型 ────────────────────────────────────────────────
export type WorkItem = Requirement | Task | Defect;

export type WorkItemPriority = '高' | '中' | '低';

// ── 评论（共用表） ──────────────────────────────────────────
export interface Comment {
  id: string;
  workItemId: string;
  workItemType: WorkItemType;
  authorId: string;
  content: string;
  mentions: string[];      // 被 @的员工 ID 列表
  createdAt: string;
}

// ── 操作历史（共用表） ──────────────────────────────────────
export type ActivityAction = 'create' | 'status_change' | 'edit' | 'assign' | 'comment';

export interface ActivityLog {
  id: string;
  workItemId: string;
  workItemType: WorkItemType;
  actorId: string;
  action: ActivityAction;
  field?: string;
  oldValue?: string;
  newValue?: string;
  remark?: string;
  createdAt: string;
}

// ── 工作项之间的关联 ────────────────────────────────────────
export interface WorkItemLink {
  id: string;
  sourceId: string;        // 源工作项
  targetId: string;        // 目标工作项
  createdAt: string;
}

// ── 附件 ────────────────────────────────────────────────────
export interface WorkItemAttachment {
  id: string;
  name: string;
  size: string;
  url?: string;
  uploadedBy: string;
  uploadedAt: string;
}

// ── 筛选条件 ────────────────────────────────────────────────
export interface WorkItemFilter {
  keyword: string;
  status: string[];
  priority: string[];
  assigneeId: string[];
  creatorId: string[];
  dateRange?: [string, string];
}

// ── 工具类型：根据类型提取状态 ──────────────────────────────
export type WorkItemStatus = RequirementStatus | TaskStatus | DefectStatus;
