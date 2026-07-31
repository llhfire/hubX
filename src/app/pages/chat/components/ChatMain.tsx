// ============================================================
// HubX 全屏聊天 — 右侧聊天窗口
// ============================================================

import { useEffect, useRef } from 'react';
import { useChat } from '../ChatContext';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';
import type { Conversation } from '../types';

const CURRENT_USER_ID = 'emp-001';

interface ChatMainProps {
  conversation: Conversation;
}

export function ChatMain({ conversation }: ChatMainProps) {
  const { getMessages, sendMessage, simulateIncomingMessage } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messages = getMessages(conversation.id);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (
    content: string,
    type?: 'text' | 'image' | 'video' | 'file' | 'link' | 'page-snapshot',
    fileInfo?: { name: string; size: number; type: string; url: string },
    pageSnapshot?: { path: string; title: string; description?: string }
  ) => {
    sendMessage(conversation.id, content, type, fileInfo, pageSnapshot);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* 顶部联系人信息 */}
      <div className="h-14 px-6 flex items-center justify-between bg-white border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-medium">
              {conversation.targetUserName.charAt(0)}
            </div>
            {conversation.isOnline && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-medium text-gray-900">{conversation.targetUserName}</span>
              <span className="text-sm text-gray-400">·</span>
              <span className="text-sm text-gray-500">{conversation.targetUserDepartment}</span>
            </div>
            {conversation.targetUserEmail && (
              <div className="text-xs text-gray-400">{conversation.targetUserEmail}</div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* 模拟收消息按钮 */}
          <button
            onClick={() => simulateIncomingMessage(conversation.id)}
            className="p-2 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded-lg transition-colors"
            title="模拟收到消息"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <div className="text-4xl mb-4">👋</div>
            <p className="text-sm">和{conversation.targetUserName}打个招呼吧</p>
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
      <MessageInput onSend={handleSend} />
    </div>
  );
}
