// ============================================================
// HubX 底部 Dock 栏组件
// 类似 macOS Dock，悬浮在页面底部
// ============================================================

import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useChat } from '../pages/chat/ChatContext';
import { ChatWindow, EmployeeList } from '../pages/chat/components';

export function BottomDock() {
  const navigate = useNavigate();
  const {
    conversations,
    activeConversationId,
    minimizedConversations,
    isEmployeeListOpen,
    setActiveConversationId,
    closeConversation,
    minimizeConversation,
    restoreConversation,
    toggleEmployeeList,
    closeEmployeeList,
  } = useChat();

  const dockRef = useRef<HTMLDivElement>(null);

  // 进入全屏聊天
  const handleFullScreen = () => {
    navigate('/chat');
  };

  // 点击外部关闭员工列表
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dockRef.current && !dockRef.current.contains(e.target as Node)) {
        closeEmployeeList();
      }
    };

    if (isEmployeeListOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isEmployeeListOpen, closeEmployeeList]);

  // 切换聊天窗口的最小化状态
  const toggleMinimize = (conversationId: string) => {
    if (minimizedConversations.has(conversationId)) {
      restoreConversation(conversationId);
    } else {
      minimizeConversation(conversationId);
    }
  };

  // 激活聊天窗口
  const activateChat = (conversationId: string) => {
    // 如果点击的是已激活的窗口，则最小化它
    if (activeConversationId === conversationId && !minimizedConversations.has(conversationId)) {
      minimizeConversation(conversationId);
      return;
    }

    // 先把当前活跃的窗口最小化，再激活新窗口
    if (activeConversationId && !minimizedConversations.has(activeConversationId)) {
      minimizeConversation(activeConversationId);
    }
    restoreConversation(conversationId);
  };

  // 获取当前激活且未最小化的聊天窗口
  const activeWindows = conversations.filter(
    c => c.id === activeConversationId && !minimizedConversations.has(c.id)
  );

  return (
    <>
      {/* 聊天窗口区域 - Dock 上方 */}
      {activeWindows.length > 0 && (
        <div className="fixed bottom-20 right-4 z-50">
          {activeWindows.map(conv => (
            <div
              key={conv.id}
              className="w-[350px] h-[500px] mb-2"
            >
              <ChatWindow
                conversationId={conv.id}
                onClose={() => closeConversation(conv.id)}
                onMinimize={() => toggleMinimize(conv.id)}
              />
            </div>
          ))}
        </div>
      )}

      {/* 底部 Dock 栏 - 始终显示 */}
      <div
        ref={dockRef}
        className="fixed bottom-0 right-4 z-50 mb-3"
      >
        {/* 员工列表弹出层 */}
        {isEmployeeListOpen && (
          <div className="absolute bottom-full right-0 mb-2">
            <EmployeeList onClose={closeEmployeeList} />
          </div>
        )}

        {/* Dock 主体 */}
        <div className="flex items-end gap-1 px-3 py-2 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200/50">
          {/* 全屏聊天按钮 - 仅在员工列表打开时显示 */}
          {isEmployeeListOpen && (
            <>
              <button
                onClick={handleFullScreen}
                className="flex flex-col items-center justify-center w-14 h-14 rounded-xl bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition-all"
                title="全屏聊天"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
                <span className="text-[10px] mt-0.5 font-medium">全屏</span>
              </button>
              {/* 分隔线 */}
              <div className="w-px h-10 bg-gray-200 mx-1" />
            </>
          )}

          {/* 企聊按钮 */}
          <button
            onClick={toggleEmployeeList}
            className={`flex flex-col items-center justify-center w-14 h-14 rounded-xl transition-all ${
              isEmployeeListOpen
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600'
            }`}
            title="企业聊天"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <span className="text-[10px] mt-0.5 font-medium">企聊</span>
          </button>

          {/* 分隔线 */}
          {conversations.length > 0 && (
            <div className="w-px h-10 bg-gray-200 mx-1" />
          )}

          {/* 已打开的聊天会话头像 */}
          {conversations.map(conv => (
            <button
              key={conv.id}
              onClick={() => activateChat(conv.id)}
              className={`flex flex-col items-center justify-center w-14 h-14 rounded-xl transition-all relative ${
                activeConversationId === conv.id && !minimizedConversations.has(conv.id)
                  ? 'bg-blue-100'
                  : 'hover:bg-gray-100'
              }`}
              title={conv.targetUserName}
            >
              {/* 头像 */}
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-medium">
                  {conv.targetUserName.charAt(0)}
                </div>
                {/* 在线状态小绿点 */}
                {conv.isOnline && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
                )}
              </div>
              {/* 名字 */}
              <span className="text-[10px] text-gray-600 mt-0.5 truncate max-w-[50px]">
                {conv.targetUserName}
              </span>
              {/* 未读消息小红点 */}
              {conv.unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-[10px] text-white font-medium">{conv.unreadCount > 99 ? '99+' : conv.unreadCount}</span>
                </div>
              )}
              {/* 关闭按钮 */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  closeConversation(conv.id);
                }}
                className="absolute -top-1 -left-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-opacity"
              >
                <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
