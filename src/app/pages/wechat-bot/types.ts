// ========================================
// 微信群采集与 AI 分析模块 - 类型定义
// ========================================

// ==================== 枚举类型 ====================

// 机器人状态
export type BotStatus = '在线' | '离线' | '异常';

// 消息类型
export type MessageType = '文本' | '图片' | '文件' | '语音' | '链接' | '视频';

// 消息发送者身份
export type SenderIdentity = '客户' | '我方' | '未知';

// 提取条目类型
export type ExtractedItemType = '需求' | '任务' | '缺陷' | '待办' | '摘要';

// 提取条目状态
export type ExtractedItemStatus = '待审核' | '已确认' | '已入库' | '已丢弃';

// 预警规则类型
export type AlertRuleType = '客户沉默' | '负面情绪' | '活跃度下降' | '关键信息缺失' | '变更未确认';

// 预警规则来源
export type AlertRuleSource = '预置' | 'AI学习' | '人工';

// 预警级别
export type AlertLevel = '低' | '中' | '高';

// 群活跃度等级
export type ActivityLevel = '高' | '中' | '低' | '沉默';

// ==================== 核心实体 ====================

// 机器人账号
export interface WeChatBot {
  id: string;
  wechatId: string;           // 微信号
  nickname: string;           // 微信昵称
  avatar?: string;            // 头像URL
  status: BotStatus;          // 状态
  cloudComputer: string;      // 云端电脑标识
  groupCount: number;         // 已加入群数
  lastSyncTime?: string;      // 最后同步时间
  remark?: string;            // 备注
  createTime: string;
  updateTime: string;
}

// 微信群
export interface WeChatGroup {
  id: string;
  groupName: string;          // 群名称
  groupAvatar?: string;       // 群头像
  botId: string;              // 关联机器人ID
  botNickname: string;        // 机器人昵称
  leadId?: string;            // 关联线索ID
  leadName?: string;          // 关联线索名称
  projectId?: string;         // 关联项目ID
  projectName?: string;       // 关联项目名称
  memberCount: number;        // 成员数
  todayMsgCount: number;      // 今日消息数
  activityLevel: ActivityLevel; // 活跃度
  lastMessageTime?: string;   // 最后消息时间
  botJoinedAt: string;        // 机器人加入时间
  lastSyncTime?: string;      // 最后采集时间
  nextSyncTime?: string;      // 下次采集时间
  isArchived: boolean;        // 是否已归档
  createTime: string;
  updateTime: string;
}

// 群成员
export interface GroupMember {
  id: string;
  groupId: string;
  wechatNickname: string;     // 微信昵称
  wechatId: string;           // 微信ID
  identity: SenderIdentity;   // 身份
  systemUserId?: string;      // 关联系统用户ID
  systemUserName?: string;    // 关联系统用户姓名
  isCustomer: boolean;        // 是否客户
  isConfirmed: boolean;       // 身份是否已确认
}

// 聊天消息
export interface ChatMessage {
  id: string;
  groupId: string;            // 所属群ID
  msgType: MessageType;       // 消息类型
  content: string;            // 文本内容
  mediaUrl?: string;          // 媒体文件URL
  mediaName?: string;         // 媒体文件名
  mediaSize?: string;         // 媒体文件大小
  linkUrl?: string;           // 链接URL
  linkTitle?: string;         // 链接标题
  senderId: string;           // 发送者ID（GroupMember.id）
  senderNickname: string;     // 发送者昵称
  senderIdentity: SenderIdentity; // 发送者身份
  sendTime: string;           // 发送时间
  isExtracted: boolean;       // 是否被AI提取
  extractedItemId?: string;   // 关联的提取条目ID
}

// 项目上下文
export interface ProjectContext {
  id: string;
  groupId: string;
  requirementChanges: ContextEntry[];  // 需求变更记录
  knownIssues: ContextEntry[];         // 已知问题
  keyDecisions: ContextEntry[];        // 关键决策
  todoItems: ContextEntry[];           // 待办事项
  customerStatus: string;              // 客户状态描述
  riskItems: string[];                 // 风险项
  lastUpdatedAt: string;               // 最后更新时间
}

// 上下文条目
export interface ContextEntry {
  id: string;
  date: string;               // 日期
  content: string;            // 内容
  status: '待确认' | '已确认'; // 状态
  sourceMessageId?: string;   // 来源消息ID
}

// AI 提取条目
export interface ExtractedItem {
  id: string;
  groupId: string;            // 所属群ID
  itemType: ExtractedItemType; // 条目类型
  title: string;              // 标题
  description: string;        // 描述
  confidence: number;         // 置信度 (0-1)
  status: ExtractedItemStatus; // 状态
  sourceMessageIds: string[]; // 来源消息ID列表
  sourceSummary: string;      // 来源摘要（如 "07-21 09:32 张三(客户)"）
  assignedTo?: string;        // 指派人（产品经理）
  assignedToName?: string;    // 指派人姓名
  linkedWorkItemId?: string;  // 关联的工作项ID
  linkedWorkItemType?: string; // 关联的工作项类型
  reviewNote?: string;        // 审核备注
  createdAt: string;
  updatedAt: string;
}

// 预警规则
export interface AlertRule {
  id: string;
  name: string;               // 规则名称
  ruleType: AlertRuleType;    // 规则类型
  description: string;        // 规则描述
  condition: string;          // 触发条件（JSON字符串）
  alertLevel: AlertLevel;     // 预警级别
  notifyRoles: string[];      // 通知角色
  notifyUsers: string[];      // 通知用户ID
  source: AlertRuleSource;    // 来源
  isEnabled: boolean;         // 是否启用
  triggerCount: number;       // 触发次数
  lastTriggeredAt?: string;   // 最后触发时间
  createdAt: string;
  updatedAt: string;
}

// 预警记录
export interface AlertRecord {
  id: string;
  ruleId: string;             // 规则ID
  ruleName: string;           // 规则名称
  ruleType: AlertRuleType;    // 规则类型
  alertLevel: AlertLevel;     // 预警级别
  groupId: string;            // 触发群ID
  groupName: string;          // 群名称
  leadId?: string;            // 关联线索ID
  leadName?: string;          // 线索名称
  message: string;            // 预警消息
  isRead: boolean;            // 是否已读
  isHandled: boolean;         // 是否已处理
  handledBy?: string;         // 处理人
  handledAt?: string;         // 处理时间
  createdAt: string;
}

// ==================== 查询参数 ====================

// 消息查询参数
export interface MessageListParams {
  groupId: string;
  keyword?: string;           // 关键词搜索
  senderId?: string;          // 按发送者筛选
  messageType?: MessageType;  // 按消息类型筛选
  dateFrom?: string;          // 开始日期
  dateTo?: string;            // 结束日期
  page?: number;
  pageSize?: number;
}

// 提取条目查询参数
export interface ExtractedItemParams {
  groupId: string;
  itemType?: ExtractedItemType;
  status?: ExtractedItemStatus;
  page?: number;
  pageSize?: number;
}

// 群列表查询参数
export interface GroupListParams {
  keyword?: string;
  botId?: string;
  activityLevel?: ActivityLevel;
  isArchived?: boolean;
  page?: number;
  pageSize?: number;
}

// ==================== 状态配置 ====================

// 机器人状态配置
export const botStatusConfig: Record<BotStatus, { color: string; label: string }> = {
  '在线': { color: 'green', label: '在线' },
  '离线': { color: 'gray', label: '离线' },
  '异常': { color: 'red', label: '异常' },
};

// 消息类型配置
export const messageTypeConfig: Record<MessageType, { icon: string; label: string }> = {
  '文本': { icon: 'MessageSquare', label: '文本' },
  '图片': { icon: 'Image', label: '图片' },
  '文件': { icon: 'File', label: '文件' },
  '语音': { icon: 'Mic', label: '语音' },
  '链接': { icon: 'Link', label: '链接' },
  '视频': { icon: 'Video', label: '视频' },
};

// 提取条目类型配置
export const extractedItemTypeConfig: Record<ExtractedItemType, { color: string; icon: string; label: string }> = {
  '需求': { color: 'blue', icon: 'FileText', label: '需求' },
  '任务': { color: 'green', icon: 'CheckSquare', label: '任务' },
  '缺陷': { color: 'red', icon: 'Bug', label: '缺陷' },
  '待办': { color: 'orange', icon: 'Clock', label: '待办' },
  '摘要': { color: 'purple', icon: 'FileText', label: '摘要' },
};

// 提取条目状态配置
export const extractedItemStatusConfig: Record<ExtractedItemStatus, { color: string; label: string }> = {
  '待审核': { color: 'yellow', label: '待审核' },
  '已确认': { color: 'blue', label: '已确认' },
  '已入库': { color: 'green', label: '已入库' },
  '已丢弃': { color: 'gray', label: '已丢弃' },
};

// 预警规则类型配置
export const alertRuleTypeConfig: Record<AlertRuleType, { color: string; icon: string; label: string }> = {
  '客户沉默': { color: 'orange', icon: 'Clock', label: '客户沉默' },
  '负面情绪': { color: 'red', icon: 'AlertTriangle', label: '负面情绪' },
  '活跃度下降': { color: 'yellow', icon: 'TrendingDown', label: '活跃度下降' },
  '关键信息缺失': { color: 'blue', icon: 'Info', label: '关键信息缺失' },
  '变更未确认': { color: 'purple', icon: 'RefreshCw', label: '变更未确认' },
};

// 预警级别配置
export const alertLevelConfig: Record<AlertLevel, { color: string; label: string }> = {
  '低': { color: 'blue', label: '低' },
  '中': { color: 'orange', label: '中' },
  '高': { color: 'red', label: '高' },
};

// 活跃度配置
export const activityLevelConfig: Record<ActivityLevel, { color: string; label: string; percentage: number }> = {
  '高': { color: 'green', label: '高', percentage: 90 },
  '中': { color: 'blue', label: '中', percentage: 60 },
  '低': { color: 'orange', label: '低', percentage: 30 },
  '沉默': { color: 'red', label: '沉默', percentage: 10 },
};
