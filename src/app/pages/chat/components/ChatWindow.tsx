// ============================================================
// HubX 内部通讯 — 聊天窗口组件
// ============================================================

import { useEffect, useRef } from 'react';
import { useChat } from '../ChatContext';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';

const CURRENT_USER_ID = 'emp-001';

interface ChatWindowProps {
  conversationId: string;
  onClose: () => void;
  onMinimize: () => void;
}

export function ChatWindow({ conversationId, onClose, onMinimize }: ChatWindowProps) {
  const { conversations, sendMessage, getMessages, simulateIncomingMessage } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const conversation = conversations.find(c => c.id === conversationId);
  const messages = getMessages(conversationId);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!conversation) return null;

  const handleSend = (content: string, pageLink?: { path: string; title: string }) => {
    sendMessage(conversationId, content, pageLink);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden">
      {/* 头部 */}
      <div className="flex items-center justify-between px-3 py-2 bg-white border-b border-gray-200">
        <div className="flex items-center gap-2">
          {/* 头像 */}
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-medium">
              {conversation.targetUserName.charAt(0)}
            </div>
            {/* 在线状态小绿点 */}
            {conversation.isOnline && (
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
            )}
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">{conversation.targetUserName}</div>
            <div className="text-[10px] text-gray-400">
              {conversation.isOnline ? '在线' : '离线'} · {conversation.targetUserDepartment}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* 模拟收消息按钮 */}
          <button
            onClick={() => simulateIncomingMessage(conversationId)}
            className="p-1 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded transition-colors"
            title="模拟收到消息"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          {/* 最小化按钮 */}
          <button
            onClick={onMinimize}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
            title="最小化"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          {/* 关闭按钮 */}
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
            title="关闭"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto p-3 bg-gray-50">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-sm">开始和{conversation.targetUserName}聊天吧</p>
          </div>
        ) : (
          <>
            {messages.map(msg => (
              <MessageBubble
                key={msg.id}
                message={msg}
                isSelf={msg.senderId === CURRENT_USER_ID}
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* 输入框 */}
      <ChatInput onSend={handleSend} />
    </div>
  );
}
