// ============================================================
// HubX 统一跟进记录 — 类型定义
// ============================================================

// ---------- 实体类型 ----------
export type EntityType = 'lead' | 'project';

// ---------- 跟进方式 ----------
export type FollowMethod = '电话沟通' | '微信沟通' | '上门拜访' | '其他';

// ---------- 跟进类型 ----------
export type FollowType =
  | '普通跟进'      // 日常沟通记录
  | '报价'          // 发送报价单（仅线索）
  | '合同签订'      // 合同签署（仅线索）
  | '催款'          // 催促回款（线索+项目）
  | '开票通知'      // 通知财务开票（仅线索）
  | '出差'          // 发起出差申请（仅线索）
  | '报销'          // 发起报销申请（仅线索）
  | '需求变更'      // 需求变更确认（仅项目）
  | '原型确认'      // 原型评审通过（仅项目）
  | 'UI确认'        // UI 设计完成（仅项目）
  | '验收确认'      // 项目验收（仅项目）
  | '终验确认'      // 项目终验（仅项目）
  | '项目通知';     // 重大风险/违约（仅项目）

// ---------- 线索阶段 ----------
export type LeadStage =
  | '待分配' | '待跟进' | '初步建联' | '联系不上'
  | '需求沟通中' | '方案报价' | '出demo中' | '协商议价'
  | '已签单' | '已终止';

// ---------- 意向等级 ----------
export type IntentLevel = '意向高' | '意向中' | '意向低' | '无意向';

// ---------- 客户状态 ----------
export type CustomerStatus =
  | '有预算' | '需汇报领导' | '竞品对比中' | '价格敏感'
  | '决策周期长' | '已流失' | '其他';

// ---------- 项目阶段 ----------
export type ProjectStatus =
  | '未确认' | '未开始' | '进行中' | '已完成'
  | '验收中' | '搁置' | '延迟' | '催款中';

// ---------- 确认书类型 ----------
export type ConfirmDocumentType =
  | '需求变更确认书'
  | '原型确认书'
  | 'UI确认书'
  | '验收确认书'
  | '终验确认书'
  | '项目通知书';

// ---------- 附件 ----------
export interface Attachment {
  id: string;
  name: string;
  size: number;
  url: string;
  type: string;
}

// ---------- 跟进记录 ----------
export interface FollowRecord {
  id: string;
  entityType: EntityType;
  entityId: string;
  entityNo: string;
  entityName: string;

  // 跟进信息
  type: FollowType;
  method: FollowMethod;
  content: string;
  duration?: number; // 分钟

  // 操作人
  operatorId: string;
  operatorName: string;

  // 跟进计划
  nextFollowTime?: string;

  // 附件
  attachments: Attachment[];

  // 时间戳
  createdAt: string;
  updatedAt?: string;

  // 线索专属字段
  leadStage?: LeadStage;
  intentLevel?: IntentLevel;
  customerStatus?: CustomerStatus;

  // 项目专属字段
  projectStatus?: ProjectStatus;
  progress?: number; // 0-100

  // 关联单据
  relatedQuotationId?: string; // 关联报价单
  relatedContractId?: string; // 关联合同
  relatedConfirmDocId?: string; // 关联确认书
}

// ---------- 确认书 ----------
export interface ConfirmDocument {
  id: string;
  projectId: string;
  projectNo: string;
  projectName: string;
  type: ConfirmDocumentType;
  signingEntity: string; // 签约主体
  content: string; // 确认书内容
  attachments: Attachment[];
  status: '草稿' | '已归档';
  archivedToContractId?: string; // 归档到的合同 ID
  createdAt: string;
  updatedAt?: string;
}

// ---------- 跟进记录查询参数 ----------
export interface FollowRecordQuery {
  entityType?: EntityType;
  entityId?: string;
  entityNo?: string;
  type?: FollowType;
  operatorId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
}

// ---------- 跟进记录统计 ----------
export interface FollowRecordStats {
  total: number;
  todayPending: number;
  todayDone: number;
  overdue: number;
  byType: Record<FollowType, number>;
}

// ---------- 跟进类型配置 ----------
export const followTypeConfig: Record<FollowType, {
  label: string;
  color: string;
  icon: string;
  availableFor: EntityType[];
}> = {
  '普通跟进': { label: '普通跟进', color: 'blue', icon: 'MessageSquare', availableFor: ['lead', 'project'] },
  '报价': { label: '报价', color: 'purple', icon: 'FileText', availableFor: ['lead'] },
  '合同签订': { label: '合同签订', color: 'green', icon: 'CheckCircle', availableFor: ['lead'] },
  '催款': { label: '催款', color: 'orange', icon: 'DollarSign', availableFor: ['lead', 'project'] },
  '开票通知': { label: '开票通知', color: 'cyan', icon: 'CreditCard', availableFor: ['lead'] },
  '出差': { label: '出差', color: 'indigo', icon: 'Plane', availableFor: ['lead'] },
  '报销': { label: '报销', color: 'pink', icon: 'Receipt', availableFor: ['lead'] },
  '需求变更': { label: '需求变更', color: 'yellow', icon: 'RefreshCw', availableFor: ['project'] },
  '原型确认': { label: '原型确认', color: 'teal', icon: 'Layout', availableFor: ['project'] },
  'UI确认': { label: 'UI确认', color: 'violet', icon: 'Palette', availableFor: ['project'] },
  '验收确认': { label: '验收确认', color: 'emerald', icon: 'Award', availableFor: ['project'] },
  '终验确认': { label: '终验确认', color: 'lime', icon: 'Star', availableFor: ['project'] },
  '项目通知': { label: '项目通知', color: 'red', icon: 'AlertTriangle', availableFor: ['project'] },
};

// ---------- 跟进方式配置 ----------
export const followMethodConfig: Record<FollowMethod, { label: string; color: string }> = {
  '电话沟通': { label: '电话沟通', color: 'blue' },
  '微信沟通': { label: '微信沟通', color: 'green' },
  '上门拜访': { label: '上门拜访', color: 'purple' },
  '其他': { label: '其他', color: 'gray' },
};

// ---------- 线索阶段配置 ----------
export const leadStageConfig: Record<LeadStage, { label: string; color: string; order: number }> = {
  '待分配': { label: '待分配', color: 'gray', order: 1 },
  '待跟进': { label: '待跟进', color: 'blue', order: 2 },
  '初步建联': { label: '初步建联', color: 'cyan', order: 3 },
  '联系不上': { label: '联系不上', color: 'orange', order: 4 },
  '需求沟通中': { label: '需求沟通中', color: 'purple', order: 5 },
  '方案报价': { label: '方案报价', color: 'indigo', order: 6 },
  '出demo中': { label: '出demo中', color: 'teal', order: 7 },
  '协商议价': { label: '协商议价', color: 'yellow', order: 8 },
  '已签单': { label: '已签单', color: 'green', order: 9 },
  '已终止': { label: '已终止', color: 'red', order: 10 },
};

// ---------- 项目阶段配置 ----------
export const projectStatusConfig: Record<ProjectStatus, { label: string; color: string }> = {
  '未确认': { label: '未确认', color: 'gray' },
  '未开始': { label: '未开始', color: 'blue' },
  '进行中': { label: '进行中', color: 'cyan' },
  '已完成': { label: '已完成', color: 'green' },
  '验收中': { label: '验收中', color: 'purple' },
  '搁置': { label: '搁置', color: 'orange' },
  '延迟': { label: '延迟', color: 'red' },
  '催款中': { label: '催款中', color: 'yellow' },
};

// ---------- 确认书类型配置 ----------
export const confirmDocTypeConfig: Record<ConfirmDocumentType, {
  label: string;
  triggerStage: string;
  required: boolean;
}> = {
  '需求变更确认书': { label: '需求变更确认书', triggerStage: '需求变更时', required: false },
  '原型确认书': { label: '原型确认书', triggerStage: '原型评审通过时', required: true },
  'UI确认书': { label: 'UI确认书', triggerStage: 'UI设计完成时', required: true },
  '验收确认书': { label: '验收确认书', triggerStage: '验收阶段', required: true },
  '终验确认书': { label: '终验确认书', triggerStage: '终验阶段', required: false },
  '项目通知书': { label: '项目通知书', triggerStage: '重大风险/违约时', required: false },
};
