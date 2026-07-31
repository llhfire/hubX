// ============================================================
// HubX 内部通讯 — 类型定义
// ============================================================

// ---------- 消息类型 ----------
export type MessageType = 'text' | 'image' | 'video' | 'file' | 'link' | 'page-snapshot';

// ---------- 文件信息 ----------
export interface FileInfo {
  name: string;
  size: number;
  type: string;
  url: string;
}

// ---------- 消息 ----------
export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  /** 消息类型 */
  type: MessageType;
  /** 文字内容 */
  content: string;
  /** 文件信息（图片/视频/文件） */
  fileInfo?: FileInfo;
  /** 页面快照信息 */
  pageSnapshot?: {
    path: string;
    title: string;
    description?: string;
  };
  timestamp: number;
}

// ---------- 会话 ----------
export interface Conversation {
  id: string;
  /** 一对一对话的对方员工 ID */
  targetUserId: string;
  targetUserName: string;
  targetUserAvatar?: string;
  targetUserDepartment?: string;
  targetUserEmail?: string;
  /** 在线状态 */
  isOnline?: boolean;
  lastMessage?: string;
  lastMessageType?: MessageType;
  lastMessageTime?: number;
  unreadCount: number;
}

// ---------- 聊天上下文状态 ----------
export interface ChatContextValue {
  /** 所有会话 */
  conversations: Conversation[];
  /** 当前激活的会话 ID */
  activeConversationId: string | null;
  /** 已最小化的会话 ID 集合 */
  minimizedConversations: Set<string>;
  /** 是否打开员工列表 */
  isEmployeeListOpen: boolean;
  /** 是否打开 Dock */
  isDockVisible: boolean;

  /** 打开与某个员工的会话 */
  openConversation: (employeeId: string) => void;
  /** 关闭会话（从 Dock 移除） */
  closeConversation: (conversationId: string) => void;
  /** 切换激活的会话 */
  setActiveConversation: (id: string | null) => void;
  /** 最小化会话 */
  minimizeConversation: (id: string) => void;
  /** 恢复会话 */
  restoreConversation: (id: string) => void;
  /** 发送消息 */
  sendMessage: (
    conversationId: string,
    content: string,
    type?: MessageType,
    fileInfo?: FileInfo,
    pageSnapshot?: { path: string; title: string; description?: string }
  ) => void;
  /** 获取某个会话的消息列表 */
  getMessages: (conversationId: string) => ChatMessage[];
  /** 模拟收到消息（用于演示） */
  simulateIncomingMessage: (conversationId: string) => void;
  /** 切换员工列表显示 */
  toggleEmployeeList: () => void;
  /** 关闭员工列表 */
  closeEmployeeList: () => void;
}
