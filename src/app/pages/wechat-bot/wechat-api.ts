// ========================================
// 微信群采集模块 - 模拟 API
// ========================================

import type {
  WeChatBot, WeChatGroup, GroupMember, ChatMessage, ExtractedItem,
  ProjectContext, AlertRule, AlertRecord,
  MessageListParams, ExtractedItemParams, GroupListParams,
  ExtractedItemStatus, ExtractedItemType,
} from './types';
import {
  mockBots, mockGroups, mockGroupMembers, mockMessages, mockMessages2,
  mockExtractedItems, mockProjectContexts, mockAlertRules, mockAlertRecords,
} from './mock-data';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 合并所有消息
const allMessages = [...mockMessages, ...mockMessages2];

// 可变数据副本
let bots = [...mockBots];
let groups = [...mockGroups];
let messages = [...allMessages];
let extractedItems = [...mockExtractedItems];
let projectContexts = [...mockProjectContexts];
let alertRules = [...mockAlertRules];
let alertRecords = [...mockAlertRecords];

// ==================== 机器人 API ====================

export async function getBots(): Promise<WeChatBot[]> {
  await delay(300);
  return [...bots];
}

export async function getBot(id: string): Promise<WeChatBot | undefined> {
  await delay(200);
  return bots.find(b => b.id === id);
}

export async function updateBot(id: string, data: Partial<WeChatBot>): Promise<WeChatBot> {
  await delay(300);
  const idx = bots.findIndex(b => b.id === id);
  if (idx === -1) throw new Error('Bot not found');
  bots[idx] = { ...bots[idx], ...data, updateTime: new Date().toISOString() };
  return bots[idx];
}

// ==================== 群列表 API ====================

export async function getGroups(params?: GroupListParams): Promise<{ list: WeChatGroup[]; total: number }> {
  await delay(300);
  let result = [...groups];

  if (params?.keyword) {
    const kw = params.keyword.toLowerCase();
    result = result.filter(g => g.groupName.toLowerCase().includes(kw));
  }
  if (params?.botId) {
    result = result.filter(g => g.botId === params.botId);
  }
  if (params?.activityLevel) {
    result = result.filter(g => g.activityLevel === params.activityLevel);
  }
  if (params?.isArchived !== undefined) {
    result = result.filter(g => g.isArchived === params.isArchived);
  }

  const total = result.length;
  const page = params?.page || 1;
  const pageSize = params?.pageSize || 20;
  result = result.slice((page - 1) * pageSize, page * pageSize);

  return { list: result, total };
}

export async function getGroup(id: string): Promise<WeChatGroup | undefined> {
  await delay(200);
  return groups.find(g => g.id === id);
}

export async function getGroupByLeadId(leadId: string): Promise<WeChatGroup | undefined> {
  await delay(200);
  return groups.find(g => g.leadId === leadId);
}

export async function getGroupByProjectId(projectId: string): Promise<WeChatGroup | undefined> {
  await delay(200);
  return groups.find(g => g.projectId === projectId);
}

export async function updateGroup(id: string, data: Partial<WeChatGroup>): Promise<WeChatGroup> {
  await delay(300);
  const idx = groups.findIndex(g => g.id === id);
  if (idx === -1) throw new Error('Group not found');
  groups[idx] = { ...groups[idx], ...data, updateTime: new Date().toISOString() };
  return groups[idx];
}

// ==================== 群成员 API ====================

export async function getGroupMembers(groupId: string): Promise<GroupMember[]> {
  await delay(200);
  return mockGroupMembers.filter(m => m.groupId === groupId);
}

// ==================== 消息 API ====================

export async function getMessages(params: MessageListParams): Promise<{ list: ChatMessage[]; total: number }> {
  await delay(300);
  let result = messages.filter(m => m.groupId === params.groupId);

  if (params?.keyword) {
    const kw = params.keyword.toLowerCase();
    result = result.filter(m => m.content.toLowerCase().includes(kw));
  }
  if (params?.senderId) {
    result = result.filter(m => m.senderId === params.senderId);
  }
  if (params?.messageType) {
    result = result.filter(m => m.msgType === params.messageType);
  }

  // 按时间排序
  result.sort((a, b) => new Date(a.sendTime).getTime() - new Date(b.sendTime).getTime());

  const total = result.length;
  const page = params?.page || 1;
  const pageSize = params?.pageSize || 100;
  result = result.slice((page - 1) * pageSize, page * pageSize);

  return { list: result, total };
}

// ==================== 提取结果 API ====================

export async function getExtractedItems(params: ExtractedItemParams): Promise<{ list: ExtractedItem[]; total: number }> {
  await delay(300);
  let result = extractedItems.filter(i => i.groupId === params.groupId);

  if (params?.itemType) {
    result = result.filter(i => i.itemType === params.itemType);
  }
  if (params?.status) {
    result = result.filter(i => i.status === params.status);
  }

  const total = result.length;
  const page = params?.page || 1;
  const pageSize = params?.pageSize || 50;
  result = result.slice((page - 1) * pageSize, page * pageSize);

  return { list: result, total };
}

export async function getExtractedItemsByGroup(groupId: string): Promise<ExtractedItem[]> {
  await delay(200);
  return extractedItems.filter(i => i.groupId === groupId);
}

export async function updateExtractedItemStatus(id: string, status: ExtractedItemStatus): Promise<ExtractedItem> {
  await delay(300);
  const idx = extractedItems.findIndex(i => i.id === id);
  if (idx === -1) throw new Error('Item not found');
  extractedItems[idx] = { ...extractedItems[idx], status, updatedAt: new Date().toISOString() };
  return extractedItems[idx];
}

export async function updateExtractedItemType(id: string, itemType: ExtractedItemType): Promise<ExtractedItem> {
  await delay(300);
  const idx = extractedItems.findIndex(i => i.id === id);
  if (idx === -1) throw new Error('Item not found');
  extractedItems[idx] = { ...extractedItems[idx], itemType, updatedAt: new Date().toISOString() };
  return extractedItems[idx];
}

export async function batchUpdateExtractedItemStatus(ids: string[], status: ExtractedItemStatus): Promise<void> {
  await delay(300);
  ids.forEach(id => {
    const idx = extractedItems.findIndex(i => i.id === id);
    if (idx !== -1) {
      extractedItems[idx] = { ...extractedItems[idx], status, updatedAt: new Date().toISOString() };
    }
  });
}

// ==================== 项目上下文 API ====================

export async function getProjectContext(groupId: string): Promise<ProjectContext | undefined> {
  await delay(200);
  return projectContexts.find(c => c.groupId === groupId);
}

// ==================== 预警规则 API ====================

export async function getAlertRules(): Promise<AlertRule[]> {
  await delay(300);
  return [...alertRules];
}

export async function toggleAlertRule(id: string): Promise<AlertRule> {
  await delay(200);
  const idx = alertRules.findIndex(r => r.id === id);
  if (idx === -1) throw new Error('Rule not found');
  alertRules[idx] = { ...alertRules[idx], isEnabled: !alertRules[idx].isEnabled };
  return alertRules[idx];
}

// ==================== 预警记录 API ====================

export async function getAlertRecords(params?: { isRead?: boolean; groupId?: string }): Promise<AlertRecord[]> {
  await delay(300);
  let result = [...alertRecords];
  if (params?.isRead !== undefined) {
    result = result.filter(r => r.isRead === params.isRead);
  }
  if (params?.groupId) {
    result = result.filter(r => r.groupId === params.groupId);
  }
  return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function markAlertRead(id: string): Promise<AlertRecord> {
  await delay(200);
  const idx = alertRecords.findIndex(r => r.id === id);
  if (idx === -1) throw new Error('Alert not found');
  alertRecords[idx] = { ...alertRecords[idx], isRead: true };
  return alertRecords[idx];
}

export async function markAlertHandled(id: string, handledBy: string): Promise<AlertRecord> {
  await delay(200);
  const idx = alertRecords.findIndex(r => r.id === id);
  if (idx === -1) throw new Error('Alert not found');
  alertRecords[idx] = { ...alertRecords[idx], isHandled: true, handledBy, handledAt: new Date().toISOString() };
  return alertRecords[idx];
}
