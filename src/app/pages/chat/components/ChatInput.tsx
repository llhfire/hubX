// ============================================================
// HubX 内部通讯 — 聊天输入框组件
// ============================================================

import { useState, useRef, KeyboardEvent } from 'react';
import { useLocation } from 'react-router';
import { getPageTitle } from '../pageMap';

interface ChatInputProps {
  onSend: (content: string, pageLink?: { path: string; title: string }) => void;
}

export function ChatInput({ onSend }: ChatInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [pendingPageLink, setPendingPageLink] = useState<{ path: string; title: string } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const location = useLocation();

  // 分享当前页面
  const handleSharePage = () => {
    const path = location.pathname;
    const title = getPageTitle(path);
    setPendingPageLink({ path, title });
    inputRef.current?.focus();
  };

  // 发送消息
  const handleSend = () => {
    const trimmed = inputValue.trim();
    if (!trimmed && !pendingPageLink) return;

    onSend(trimmed || '分享了一个页面', pendingPageLink || undefined);
    setInputValue('');
    setPendingPageLink(null);
  };

  // 回车发送
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-gray-200 bg-white p-2">
      {/* 待发送的页面链接预览 */}
      {pendingPageLink && (
        <div className="mb-2 px-2 py-1.5 bg-blue-50 rounded text-xs text-blue-700 flex items-center justify-between">
          <div className="flex items-center gap-1 truncate">
            <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <span className="font-medium">{pendingPageLink.title}</span>
            <span className="opacity-70 truncate">{pendingPageLink.path}</span>
          </div>
          <button
            onClick={() => setPendingPageLink(null)}
            className="ml-2 text-blue-500 hover:text-blue-700 flex-shrink-0"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* 输入区域 */}
      <div className="flex items-center gap-2">
        {/* 分享当前页面按钮 */}
        <button
          onClick={handleSharePage}
          className="flex-shrink-0 p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded transition-colors"
          title="分享当前页面"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        </button>

        {/* 输入框 */}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="输入消息..."
          className="flex-1 px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />

        {/* 发送按钮 */}
        <button
          onClick={handleSend}
          disabled={!inputValue.trim() && !pendingPageLink}
          className="flex-shrink-0 p-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
    </div>
  );
}
