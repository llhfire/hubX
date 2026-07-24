// ========================================
// 线索管理模块 - 模拟 API 接口
// ========================================

import type {
  Lead,
  FollowRecord,
  LeadListParams,
  FollowRecordListParams,
} from './types';

import {
  mockLeads,
  mockFollowRecords,
} from './mock-data';

// 模拟延迟
const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));

// ==================== 线索管理 API ====================

// 获取线索列表
export async function getLeadList(params?: LeadListParams): Promise<{ list: Lead[]; total: number }> {
  await delay();
  let filtered = [...mockLeads];

  if (params?.keyword) {
    const keyword = params.keyword.toLowerCase();
    filtered = filtered.filter(
      l =>
        l.name.toLowerCase().includes(keyword) ||
        l.phone.includes(keyword) ||
        l.wechat.toLowerCase().includes(keyword) ||
        l.contactName.toLowerCase().includes(keyword)
    );
  }
  if (params?.ownerId) {
    filtered = filtered.filter(l => l.ownerId === params.ownerId);
  }
  if (params?.leadType) {
    filtered = filtered.filter(l => l.leadType === params.leadType);
  }
  if (params?.stage) {
    filtered = filtered.filter(l => l.stage === params.stage);
  }
  if (params?.source) {
    filtered = filtered.filter(l => l.source === params.source);
  }
  if (params?.customerType) {
    filtered = filtered.filter(l => l.customerType === params.customerType);
  }
  if (params?.intentLevel) {
    filtered = filtered.filter(l => l.intentLevel === params.intentLevel);
  }

  const total = filtered.length;
  const page = params?.page || 1;
  const pageSize = params?.pageSize || 15;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const list = filtered.slice(start, end);

  return { list, total };
}

// 获取线索详情
export async function getLeadDetail(id: string): Promise<Lead | null> {
  await delay();
  return mockLeads.find(l => l.id === id) || null;
}

// 创建线索
export async function createLead(data: Partial<Lead>): Promise<Lead> {
  await delay(500);
  const newLead: Lead = {
    id: `lead-${Date.now()}`,
    leadNo: String(6000 + mockLeads.length),
    name: data.name || '',
    contactName: data.contactName || '',
    phone: data.phone || '',
    wechat: data.wechat || '',
    source: data.source || '其他',
    leadType: data.leadType || '公海',
    stage: data.stage || '待分配',
    entity: data.entity || '中科软通',
    ownerId: data.ownerId || '',
    ownerName: data.ownerName || '',
    creatorId: data.creatorId || 'emp-001',
    creatorName: data.creatorName || '当前用户',
    createTime: new Date().toISOString(),
    updateTime: new Date().toISOString(),
    customerType: data.customerType,
    intentLevel: data.intentLevel,
    budget: data.budget,
    preSaleGroupName: data.preSaleGroupName,
    remark: data.remark,
    keyword: data.keyword,
    wkeyId: data.wkeyId,
    intentTags: data.intentTags,
    attachments: data.attachments,
    historyOwners: data.historyOwners,
    projectId: data.projectId,
    contractId: data.contractId,
    lastFollowTime: data.lastFollowTime,
    nextFollowTime: data.nextFollowTime,
  };
  mockLeads.push(newLead);
  return newLead;
}

// 更新线索
export async function updateLead(id: string, data: Partial<Lead>): Promise<Lead> {
  await delay(500);
  const lead = mockLeads.find(l => l.id === id);
  if (!lead) throw new Error('线索不存在');
  return { ...lead, ...data, updateTime: new Date().toISOString() };
}

// 删除线索
export async function deleteLead(id: string): Promise<void> {
  await delay(500);
}

// 认领线索（公海 → 已认领）
export async function claimLead(id: string, userId: string, userName: string): Promise<Lead> {
  await delay(500);
  const index = mockLeads.findIndex(l => l.id === id);
  if (index === -1) throw new Error('线索不存在');
  const lead = mockLeads[index];
  const updated = {
    ...lead,
    leadType: '已认领' as const,
    stage: '待跟进' as const,
    ownerId: userId,
    ownerName: userName,
    updateTime: new Date().toISOString(),
  };
  mockLeads[index] = updated;
  return updated;
}

// 转移线索
export async function transferLead(id: string, newOwnerId: string, newOwnerName: string, reason?: string): Promise<Lead> {
  await delay(500);
  const index = mockLeads.findIndex(l => l.id === id);
  if (index === -1) throw new Error('线索不存在');
  const lead = mockLeads[index];
  const historyOwners = [...(lead.historyOwners || [])];
  historyOwners.push({
    ownerId: lead.ownerId,
    ownerName: lead.ownerName,
    transferTime: new Date().toISOString(),
    reason,
  });
  const updated = {
    ...lead,
    ownerId: newOwnerId,
    ownerName: newOwnerName,
    historyOwners,
    updateTime: new Date().toISOString(),
  };
  mockLeads[index] = updated;
  return updated;
}

// 扔回公海
export async function releaseToPublic(id: string): Promise<Lead> {
  await delay(500);
  const index = mockLeads.findIndex(l => l.id === id);
  if (index === -1) throw new Error('线索不存在');
  const lead = mockLeads[index];
  const updated = {
    ...lead,
    leadType: '公海' as const,
    stage: '待分配' as const,
    updateTime: new Date().toISOString(),
  };
  mockLeads[index] = updated;
  return updated;
}

// 标记为垃圾
export async function markAsTrash(id: string): Promise<Lead> {
  await delay(500);
  const index = mockLeads.findIndex(l => l.id === id);
  if (index === -1) throw new Error('线索不存在');
  const lead = mockLeads[index];
  const updated = {
    ...lead,
    leadType: '公海' as const,
    stage: '已终止' as const,
    updateTime: new Date().toISOString(),
  };
  mockLeads[index] = updated;
  return updated;
}

// ==================== 跟进记录 API ====================

// 获取跟进记录列表
export async function getFollowRecordList(params?: FollowRecordListParams): Promise<{ list: FollowRecord[]; total: number }> {
  await delay();
  let filtered = [...mockFollowRecords];

  if (params?.leadId) {
    filtered = filtered.filter(r => r.leadId === params.leadId);
  }
  if (params?.leadNo) {
    filtered = filtered.filter(r => r.leadNo === params.leadNo);
  }
  if (params?.followerId) {
    filtered = filtered.filter(r => r.followerId === params.followerId);
  }
  if (params?.filterType === 'today_pending') {
    // 今日待跟进：下次跟进时间是今天且未完成
    const today = new Date().toISOString().slice(0, 10);
    filtered = filtered.filter(r => r.nextFollowTime?.startsWith(today));
  }
  if (params?.filterType === 'today_done') {
    // 今日已跟进：创建时间是今天
    const today = new Date().toISOString().slice(0, 10);
    filtered = filtered.filter(r => r.createTime.startsWith(today));
  }
  if (params?.filterType === 'overdue') {
    // 超期未跟进：下次跟进时间已过
    const now = new Date();
    filtered = filtered.filter(r => {
      if (!r.nextFollowTime) return false;
      return new Date(r.nextFollowTime) < now;
    });
  }

  return { list: filtered, total: filtered.length };
}

// 创建跟进记录
export async function createFollowRecord(data: Partial<FollowRecord>): Promise<FollowRecord> {
  await delay(500);
  const newRecord: FollowRecord = {
    id: `follow-${Date.now()}`,
    leadId: data.leadId || '',
    leadNo: data.leadNo || '',
    leadName: data.leadName || '',
    method: data.method || '微信沟通',
    stage: data.stage || '初步建联',
    content: data.content || '',
    followerId: data.followerId || 'emp-001',
    followerName: data.followerName || '当前用户',
    nextFollowTime: data.nextFollowTime,
    createTime: new Date().toISOString(),
    ...data,
  };
  return newRecord;
}

// 更新跟进记录
export async function updateFollowRecord(id: string, data: Partial<FollowRecord>): Promise<FollowRecord> {
  await delay(500);
  return { id, ...data } as FollowRecord;
}

// 删除跟进记录
export async function deleteFollowRecord(id: string): Promise<void> {
  await delay(500);
}

// ==================== 统计 API ====================

// 获取线索统计
export async function getLeadStats(): Promise<{
  total: number;
  assigned: number;
  public: number;
  highTech: number;
  todayPending: number;
  overdue: number;
}> {
  await delay();
  return {
    total: mockLeads.length,
    assigned: mockLeads.filter(l => l.leadType === '已认领').length,
    public: mockLeads.filter(l => l.leadType === '公海').length,
    highTech: mockLeads.filter(l => l.leadType === '高企名单').length,
    todayPending: 5,
    overdue: 3,
  };
}
