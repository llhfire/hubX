// ============================================================
// HubX 内部通讯 — 聊天状态管理
// ============================================================

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import type { ChatMessage, Conversation, ChatContextValue, MessageType, FileInfo } from './types';

// ---------- 常量 ----------
const STORAGE_KEY_MESSAGES = 'hubx_chat_messages';
const STORAGE_KEY_CONVERSATIONS = 'hubx_chat_conversations';
const CURRENT_USER_ID = 'emp-001';

// ---------- 工具函数 ----------
function genId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage(key: string, data: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // ignore
  }
}

// 根据消息类型获取最后消息的显示文本
function getLastMessageDisplay(msg: ChatMessage): string {
  switch (msg.type) {
    case 'image':
      return '[图片]';
    case 'video':
      return '[视频]';
    case 'file':
      return `[文件] ${msg.fileInfo?.name || ''}`;
    case 'link':
      return msg.content;
    case 'page-snapshot':
      return `[页面] ${msg.pageSnapshot?.title || ''}`;
    default:
      return msg.content;
  }
}

// ---------- Context ----------
const ChatContext = createContext<ChatContextValue | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>(() =>
    loadFromStorage(STORAGE_KEY_CONVERSATIONS, [])
  );
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(() =>
    loadFromStorage(STORAGE_KEY_MESSAGES, {})
  );
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [minimizedConversations, setMinimizedConversations] = useState<Set<string>>(new Set());
  const [isEmployeeListOpen, setIsEmployeeListOpen] = useState(false);
  const [isDockVisible] = useState(true);

  // 持久化
  useEffect(() => {
    saveToStorage(STORAGE_KEY_CONVERSATIONS, conversations);
  }, [conversations]);

  useEffect(() => {
    saveToStorage(STORAGE_KEY_MESSAGES, messages);
  }, [messages]);

  // 打开与某个员工的会话
  const openConversation = useCallback((employeeId: string) => {
    // 先检查是否已存在会话
    const existing = conversations.find(c => c.targetUserId === employeeId);
    if (existing) {
      // 已存在，激活它
      setActiveConversationId(existing.id);
      setIsEmployeeListOpen(false);
      return;
    }

    // 创建新会话
    const employeeData: Record<string, { name: string; department: string; email: string }> = {
      'emp-001': { name: '张三', department: '技术部', email: 'zhangsan@hubx.cn' },
      'emp-002': { name: '李四', department: '销售部', email: 'lisi@hubx.cn' },
      'emp-003': { name: '王五', department: '产品部', email: 'wangwu@hubx.cn' },
      'emp-004': { name: '赵六', department: '设计部', email: 'zhaoliu@hubx.cn' },
      'emp-005': { name: '钱七', department: '人事部', email: 'qianqi@hubx.cn' },
      'emp-006': { name: '孙八', department: '财务部', email: 'sunba@hubx.cn' },
      'emp-007': { name: '周九', department: '技术部', email: 'zhoujiu@hubx.cn' },
      'emp-008': { name: '吴十', department: '运营部', email: 'wushi@hubx.cn' },
    };

    const empInfo = employeeData[employeeId] || { name: '未知员工', department: '未知部门', email: '' };
    const isOnline = Math.random() > 0.3;
    const newConv: Conversation = {
      id: `conv_${Date.now()}`,
      targetUserId: employeeId,
      targetUserName: empInfo.name,
      targetUserDepartment: empInfo.department,
      targetUserEmail: empInfo.email,
      isOnline,
      unreadCount: 0,
    };

    setConversations(prev => [...prev, newConv]);
    setActiveConversationId(newConv.id);
    setIsEmployeeListOpen(false);
  }, [conversations]);

  // 关闭会话
  const closeConversation = useCallback((conversationId: string) => {
    setConversations(prev => prev.filter(c => c.id !== conversationId));
    setMessages(prev => {
      const next = { ...prev };
      delete next[conversationId];
      return next;
    });
    if (activeConversationId === conversationId) {
      setActiveConversationId(null);
    }
    setMinimizedConversations(prev => {
      const next = new Set(prev);
      next.delete(conversationId);
      return next;
    });
  }, [activeConversationId]);

  // 最小化会话
  const minimizeConversation = useCallback((conversationId: string) => {
    setMinimizedConversations(prev => {
      const next = new Set(prev);
      next.add(conversationId);
      return next;
    });
  }, []);

  // 恢复会话
  const restoreConversation = useCallback((conversationId: string) => {
    setMinimizedConversations(prev => {
      const next = new Set(prev);
      next.delete(conversationId);
      return next;
    });
    setActiveConversationId(conversationId);
  }, []);

  // 发送消息
  const sendMessage = useCallback((
    conversationId: string,
    content: string,
    type: MessageType = 'text',
    fileInfo?: FileInfo,
    pageSnapshot?: { path: string; title: string; description?: string }
  ) => {
    const newMsg: ChatMessage = {
      id: genId(),
      conversationId,
      senderId: CURRENT_USER_ID,
      senderName: '张三',
      type,
      content,
      fileInfo,
      pageSnapshot,
      timestamp: Date.now(),
    };

    setMessages(prev => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), newMsg],
    }));

    // 更新会话最后消息
    const lastMessageDisplay = getLastMessageDisplay(newMsg);
    setConversations(prev =>
      prev.map(c =>
        c.id === conversationId
          ? { ...c, lastMessage: lastMessageDisplay, lastMessageType: type, lastMessageTime: Date.now() }
          : c
      )
    );
  }, []);

  // 获取会话消息
  const getMessages = useCallback(
    (conversationId: string) => messages[conversationId] || [],
    [messages]
  );

  // 模拟收到消息
  const simulateIncomingMessage = useCallback((conversationId: string) => {
    const conv = conversations.find(c => c.id === conversationId);
    if (!conv) return;

    const randomMessages = [
      '收到，我看看',
      '好的，马上处理',
      '这个需求我了解一下',
      '没问题，稍等',
      '好的，我这边确认一下',
      '明白了，我来跟进',
      '可以的，没问题',
      '收到，稍后回复你',
    ];

    const content = randomMessages[Math.floor(Math.random() * randomMessages.length)];

    const newMsg: ChatMessage = {
      id: genId(),
      conversationId,
      senderId: conv.targetUserId,
      senderName: conv.targetUserName,
      type: 'text',
      content,
      timestamp: Date.now(),
    };

    setMessages(prev => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), newMsg],
    }));

    const lastMessageDisplay = getLastMessageDisplay(newMsg);

    // 如果会话不是当前激活的，增加未读数
    if (activeConversationId !== conversationId) {
      setConversations(prev =>
        prev.map(c =>
          c.id === conversationId
            ? { ...c, unreadCount: c.unreadCount + 1, lastMessage: lastMessageDisplay, lastMessageTime: Date.now() }
            : c
        )
      );
    } else {
      setConversations(prev =>
        prev.map(c =>
          c.id === conversationId
            ? { ...c, lastMessage: lastMessageDisplay, lastMessageTime: Date.now() }
            : c
        )
      );
    }
  }, [conversations, activeConversationId]);

  // 切换员工列表
  const toggleEmployeeList = useCallback(() => {
    setIsEmployeeListOpen(prev => !prev);
  }, []);

  // 关闭员工列表
  const closeEmployeeList = useCallback(() => {
    setIsEmployeeListOpen(false);
  }, []);

  return (
    <ChatContext.Provider
      value={{
        conversations,
        activeConversationId,
        minimizedConversations,
        isEmployeeListOpen,
        isDockVisible,
        openConversation,
        closeConversation,
        setActiveConversationId,
        minimizeConversation,
        restoreConversation,
        sendMessage,
        getMessages,
        simulateIncomingMessage,
        toggleEmployeeList,
        closeEmployeeList,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used within ChatProvider');
  return ctx;
}
