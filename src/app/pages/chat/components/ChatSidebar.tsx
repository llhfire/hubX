// ============================================================
// HubX 全屏聊天 — 左侧会话列表
// ============================================================

import { useState } from 'react';
import { useChat } from '../ChatContext';
import { EmployeeList } from './EmployeeList';
import type { Conversation } from '../types';

interface ChatSidebarProps {
  onBack: () => void;
}

export function ChatSidebar({ onBack }: ChatSidebarProps) {
  const {
    conversations,
    activeConversationId,
    setActiveConversationId,
    isEmployeeListOpen,
    toggleEmployeeList,
    closeEmployeeList,
  } = useChat();

  const [searchQuery, setSearchQuery] = useState('');

  // 按最后消息时间排序
  const sortedConversations = [...conversations].sort((a, b) => {
    const timeA = a.lastMessageTime || 0;
    const timeB = b.lastMessageTime || 0;
    return timeB - timeA;
  });

  // 搜索过滤
  const filteredConversations = sortedConversations.filter(conv =>
    conv.targetUserName.includes(searchQuery) ||
    conv.targetUserDepartment?.includes(searchQuery) ||
    conv.lastMessage?.includes(searchQuery)
  );

  // 格式化时间
  const formatTime = (timestamp?: number) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return '昨天';
    } else if (days < 7) {
      return ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][date.getDay()];
    } else {
      return `${date.getMonth() + 1}/${date.getDate()}`;
    }
  };

  // 获取消息类型图标
  const getMessageTypeIcon = (type?: string) => {
    switch (type) {
      case 'image': return '📷';
      case 'video': return '🎬';
      case 'file': return '📎';
      case 'page-snapshot': return '🔗';
      default: return '';
    }
  };

  const handleSelectConversation = (conv: Conversation) => {
    setActiveConversationId(conv.id);
  };

  return (
    <div className="w-80 border-r border-gray-200 flex flex-col bg-gray-50 h-full">
      {/* 顶部导航 */}
      <div className="h-14 px-4 flex items-center justify-between border-b border-gray-200 bg-white">
        <button
          onClick={onBack}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          title="返回"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="text-sm font-medium text-gray-700">聊天</span>
        <button
          onClick={toggleEmployeeList}
          className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
          title="新建会话"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {/* 搜索框 */}
      <div className="px-3 py-2">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索"
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          />
        </div>
      </div>

      {/* 内容区域 */}
      <div className="flex-1 overflow-hidden">
        {isEmployeeListOpen ? (
          <EmployeeList onClose={closeEmployeeList} isFullScreen={true} />
        ) : (
          <div className="h-full overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="text-sm">暂无会话</p>
              </div>
            ) : (
              filteredConversations.map(conv => (
                <button
                  key={conv.id}
                  onClick={() => handleSelectConversation(conv)}
                  className={`w-full flex items-center gap-3 px-3 py-3 hover:bg-gray-100 transition-colors text-left ${
                    activeConversationId === conv.id ? 'bg-blue-50' : ''
                  }`}
                >
                  {/* 头像 */}
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-medium">
                      {conv.targetUserName.charAt(0)}
                    </div>
                    {conv.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                    )}
                  </div>

                  {/* 信息 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900 truncate">{conv.targetUserName}</span>
                      <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                        {formatTime(conv.lastMessageTime)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-0.5">
                      <span className="text-xs text-gray-500 truncate">
                        {conv.lastMessage && (
                          <span className="mr-1">{getMessageTypeIcon(conv.lastMessageType)}</span>
                        )}
                        {conv.lastMessage || conv.targetUserDepartment}
                      </span>
                      {conv.unreadCount > 0 && (
                        <span className="flex-shrink-0 ml-2 min-w-[18px] h-[18px] px-1 bg-red-500 rounded-full flex items-center justify-center">
                          <span className="text-[10px] text-white font-medium">
                            {conv.unreadCount > 99 ? '99+' : conv.unreadCount}
                          </span>
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
