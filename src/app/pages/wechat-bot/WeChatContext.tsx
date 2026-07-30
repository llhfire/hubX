// ========================================
// 微信群采集模块 - Context Provider
// ========================================

import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from 'react';
import type {
  WeChatBot, WeChatGroup, ChatMessage, ExtractedItem,
  ProjectContext, AlertRule, AlertRecord,
  ExtractedItemStatus, ExtractedItemType,
} from './types';
import * as api from './wechat-api';

interface WeChatContextValue {
  // 数据
  bots: WeChatBot[];
  groups: WeChatGroup[];
  alertRules: AlertRule[];
  alertRecords: AlertRecord[];

  // 加载状态
  isLoadingBots: boolean;
  isLoadingGroups: boolean;

  // 机器人操作
  fetchBots: () => Promise<void>;
  updateBot: (id: string, data: Partial<WeChatBot>) => Promise<void>;

  // 群操作
  fetchGroups: () => Promise<void>;
  getGroupByLeadId: (leadId: string) => WeChatGroup | undefined;
  getGroupByProjectId: (projectId: string) => WeChatGroup | undefined;

  // 消息操作
  getMessages: (groupId: string) => Promise<ChatMessage[]>;

  // 提取结果操作
  getExtractedItems: (groupId: string) => Promise<ExtractedItem[]>;
  updateExtractedItemStatus: (id: string, status: ExtractedItemStatus) => Promise<void>;
  updateExtractedItemType: (id: string, type: ExtractedItemType) => Promise<void>;
  batchUpdateStatus: (ids: string[], status: ExtractedItemStatus) => Promise<void>;

  // 项目上下文
  getProjectContext: (groupId: string) => Promise<ProjectContext | undefined>;

  // 预警规则
  fetchAlertRules: () => Promise<void>;
  toggleAlertRule: (id: string) => Promise<void>;

  // 预警记录
  fetchAlertRecords: () => Promise<void>;
  markAlertRead: (id: string) => Promise<void>;
  markAlertHandled: (id: string, handledBy: string) => Promise<void>;
  unreadAlertCount: number;
}

const WeChatContext = createContext<WeChatContextValue | null>(null);

export function WeChatProvider({ children }: { children: ReactNode }) {
  const [bots, setBots] = useState<WeChatBot[]>([]);
  const [groups, setGroups] = useState<WeChatGroup[]>([]);
  const [alertRules, setAlertRules] = useState<AlertRule[]>([]);
  const [alertRecords, setAlertRecords] = useState<AlertRecord[]>([]);
  const [isLoadingBots, setIsLoadingBots] = useState(false);
  const [isLoadingGroups, setIsLoadingGroups] = useState(false);

  // 机器人
  const fetchBots = useCallback(async () => {
    setIsLoadingBots(true);
    try {
      const data = await api.getBots();
      setBots(data);
    } finally {
      setIsLoadingBots(false);
    }
  }, []);

  const updateBot = useCallback(async (id: string, data: Partial<WeChatBot>) => {
    const updated = await api.updateBot(id, data);
    setBots(prev => prev.map(b => b.id === id ? updated : b));
  }, []);

  // 群
  const fetchGroups = useCallback(async () => {
    setIsLoadingGroups(true);
    try {
      const { list } = await api.getGroups();
      setGroups(list);
    } finally {
      setIsLoadingGroups(false);
    }
  }, []);

  const getGroupByLeadId = useCallback((leadId: string) => {
    return groups.find(g => g.leadId === leadId);
  }, [groups]);

  const getGroupByProjectId = useCallback((projectId: string) => {
    return groups.find(g => g.projectId === projectId);
  }, [groups]);

  // 消息
  const getMessages = useCallback(async (groupId: string) => {
    const { list } = await api.getMessages({ groupId, pageSize: 200 });
    return list;
  }, []);

  // 提取结果
  const getExtractedItems = useCallback(async (groupId: string) => {
    return api.getExtractedItemsByGroup(groupId);
  }, []);

  const updateExtractedItemStatus = useCallback(async (id: string, status: ExtractedItemStatus) => {
    await api.updateExtractedItemStatus(id, status);
  }, []);

  const updateExtractedItemType = useCallback(async (id: string, type: ExtractedItemType) => {
    await api.updateExtractedItemType(id, type);
  }, []);

  const batchUpdateStatus = useCallback(async (ids: string[], status: ExtractedItemStatus) => {
    await api.batchUpdateExtractedItemStatus(ids, status);
  }, []);

  // 项目上下文
  const getProjectContext = useCallback(async (groupId: string) => {
    return api.getProjectContext(groupId);
  }, []);

  // 预警规则
  const fetchAlertRules = useCallback(async () => {
    const data = await api.getAlertRules();
    setAlertRules(data);
  }, []);

  const toggleAlertRule = useCallback(async (id: string) => {
    const updated = await api.toggleAlertRule(id);
    setAlertRules(prev => prev.map(r => r.id === id ? updated : r));
  }, []);

  // 预警记录
  const fetchAlertRecords = useCallback(async () => {
    const data = await api.getAlertRecords();
    setAlertRecords(data);
  }, []);

  const markAlertRead = useCallback(async (id: string) => {
    const updated = await api.markAlertRead(id);
    setAlertRecords(prev => prev.map(r => r.id === id ? updated : r));
  }, []);

  const markAlertHandled = useCallback(async (id: string, handledBy: string) => {
    const updated = await api.markAlertHandled(id, handledBy);
    setAlertRecords(prev => prev.map(r => r.id === id ? updated : r));
  }, []);

  const unreadAlertCount = useMemo(() => alertRecords.filter(r => !r.isRead).length, [alertRecords]);

  const value = useMemo<WeChatContextValue>(() => ({
    bots, groups, alertRules, alertRecords,
    isLoadingBots, isLoadingGroups,
    fetchBots, updateBot,
    fetchGroups, getGroupByLeadId, getGroupByProjectId,
    getMessages, getExtractedItems,
    updateExtractedItemStatus, updateExtractedItemType, batchUpdateStatus,
    getProjectContext,
    fetchAlertRules, toggleAlertRule,
    fetchAlertRecords, markAlertRead, markAlertHandled,
    unreadAlertCount,
  }), [
    bots, groups, alertRules, alertRecords,
    isLoadingBots, isLoadingGroups,
    fetchBots, updateBot,
    fetchGroups, getGroupByLeadId, getGroupByProjectId,
    getMessages, getExtractedItems,
    updateExtractedItemStatus, updateExtractedItemType, batchUpdateStatus,
    getProjectContext,
    fetchAlertRules, toggleAlertRule,
    fetchAlertRecords, markAlertRead, markAlertHandled,
    unreadAlertCount,
  ]);

  return (
    <WeChatContext.Provider value={value}>
      {children}
    </WeChatContext.Provider>
  );
}

export function useWeChat() {
  const ctx = useContext(WeChatContext);
  if (!ctx) throw new Error('useWeChat must be used within WeChatProvider');
  return ctx;
}
