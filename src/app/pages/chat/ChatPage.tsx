// ============================================================
// HubX 全屏聊天页面
// ============================================================

import { useNavigate } from 'react-router';
import { useChat } from './ChatContext';
import { ChatSidebar } from './components/ChatSidebar';
import { ChatMain } from './components/ChatMain';

export default function ChatPage() {
  const navigate = useNavigate();
  const { activeConversationId, conversations } = useChat();

  const handleBack = () => {
    navigate(-1);
  };

  const currentConversation = conversations.find(c => c.id === activeConversationId);

  return (
    <div className="fixed inset-0 z-[100] flex bg-white">
      {/* 左侧会话列表 */}
      <ChatSidebar onBack={handleBack} />

      {/* 右侧聊天窗口 */}
      <div className="flex-1 flex flex-col min-w-0">
        {currentConversation ? (
          <ChatMain conversation={currentConversation} />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="text-lg">选择一个会话开始聊天</p>
              <p className="text-sm mt-2">或点击左上角 + 创建新会话</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
