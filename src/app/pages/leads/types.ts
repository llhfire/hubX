// ========================================
// 线索管理模块 - 类型定义
// ========================================

// ==================== 枚举类型 ====================

// 线索类型
export type LeadType = '已认领' | '公海' | '高企名单';

// 线索状态（阶段）
export type LeadStage =
  | '待分配'
  | '待跟进'
  | '初步建联'
  | '联系不上'
  | '需求沟通中'
  | '方案报价'
  | '出demo中'
  | '协商议价'
  | '已签单'
  | '已终止';

// 意向等级
export type IntentLevel = '意向高' | '意向中' | '意向低' | '无意向';

// 客户类型
export type CustomerType = 'A类' | 'B类' | 'C类';

// 线索来源
export type LeadSource = '百度' | '小红书' | '抖音' | '威客' | '高企名单' | '其他';

// 跟进方式
export type FollowMethod = '电话沟通' | '微信沟通' | '上门拜访' | '其他';

// ==================== 核心实体 ====================

// 线索
export interface Lead {
  id: string;
  leadNo: string;           // 线索编号
  // 基础信息
  name: string;             // 线索名称
  contactName: string;      // 客户称呼
  phone: string;            // 联系电话
  wechat: string;           // 微信
  source: LeadSource;       // 线索来源
  customerType?: CustomerType; // 客户类型
  intentLevel?: IntentLevel;   // 意向等级
  budget?: string;          // 客户预算
  // 业务信息
  leadType: LeadType;       // 线索类型
  stage: LeadStage;         // 线索状态
  entity: string;           // 对接主体
  preSaleGroupName?: string; // 售前群名称
  wkeyId?: string;          // 威客ID
  keyword?: string;         // 推广关键词
  intentTags?: string[];    // 意向标签
  remark?: string;          // 客户信息备注
  // 归属信息
  ownerId: string;          // 归属人ID
  ownerName: string;        // 归属人姓名
  creatorId: string;        // 创建人ID
  creatorName: string;      // 创建人姓名
  // 历史归属
  historyOwners?: HistoryOwner[];
  // 关联信息
  projectId?: string;       // 关联项目ID
  contractId?: string;      // 关联合同ID
  // 附件
  attachments?: Attachment[];
  // 时间戳
  createTime: string;
  updateTime: string;
  lastFollowTime?: string;  // 最后跟进时间
  nextFollowTime?: string;  // 下次跟进时间
}

// 历史归属人
export interface HistoryOwner {
  ownerId: string;
  ownerName: string;
  transferTime: string;
  reason?: string;
}

// 附件
export interface Attachment {
  id: string;
  name: string;
  size: string;
  url?: string;
}

// 跟进记录
export interface FollowRecord {
  id: string;
  leadId: string;
  leadNo: string;
  leadName: string;
  // 跟进信息
  method: FollowMethod;     // 跟进方式
  stage: LeadStage;         // 客户状态
  intentLevel?: IntentLevel; // 意向等级
  content: string;          // 跟进详情
  duration?: number;        // 消耗时间（分钟）
  // 跟进人
  followerId: string;
  followerName: string;
  // 下次跟进
  nextFollowTime?: string;
  // 附件
  attachments?: Attachment[];
  // 时间戳
  createTime: string;
  // 关联线索信息（用于列表展示）
  leadInfo?: {
    preSaleGroupName?: string;
    contactName?: string;
    phone?: string;
    wechat?: string;
  };
}

// ==================== 查询参数 ====================

// 线索列表查询参数
export interface LeadListParams {
  keyword?: string;         // 模糊搜索
  ownerId?: string;         // 归属人
  leadType?: LeadType;      // 线索类型
  stage?: LeadStage;        // 线索状态
  source?: LeadSource;      // 线索来源
  customerType?: CustomerType; // 客户类型
  intentLevel?: IntentLevel;   // 意向等级
  page?: number;
  pageSize?: number;
}

// 跟进记录查询参数
export interface FollowRecordListParams {
  leadId?: string;
  leadNo?: string;
  followerId?: string;
  filterType?: 'all' | 'today_pending' | 'today_done' | 'overdue';
  page?: number;
  pageSize?: number;
}

// ==================== 状态配置 ====================

// 线索状态配置
export const leadStageConfig: Record<LeadStage, { color: string; label: string }> = {
  '待分配': { color: 'gray', label: '待分配' },
  '待跟进': { color: 'blue', label: '待跟进' },
  '初步建联': { color: 'cyan', label: '初步建联' },
  '联系不上': { color: 'orange', label: '联系不上' },
  '需求沟通中': { color: 'purple', label: '需求沟通中' },
  '方案报价': { color: 'green', label: '方案报价' },
  '出demo中': { color: 'lime', label: '出demo中' },
  '协商议价': { color: 'yellow', label: '协商议价' },
  '已签单': { color: 'success', label: '已签单' },
  '已终止': { color: 'default', label: '已终止' },
};

// 意向等级配置
export const intentLevelConfig: Record<IntentLevel, { color: string; label: string }> = {
  '意向高': { color: 'red', label: '意向高' },
  '意向中': { color: 'orange', label: '意向中' },
  '意向低': { color: 'blue', label: '意向低' },
  '无意向': { color: 'default', label: '无意向' },
};

// 客户类型配置
export const customerTypeConfig: Record<CustomerType, { color: string; label: string }> = {
  'A类': { color: 'red', label: 'A类' },
  'B类': { color: 'orange', label: 'B类' },
  'C类': { color: 'green', label: 'C类' },
};

// 线索类型配置
export const leadTypeConfig: Record<LeadType, { color: string; label: string }> = {
  '已认领': { color: 'green', label: '已认领' },
  '公海': { color: 'gray', label: '公海' },
  '高企名单': { color: 'blue', label: '高企名单' },
};
