// ============================================================
// HubX 全屏聊天 — 消息输入框 + 工具栏
// ============================================================

import { useState, useRef, KeyboardEvent, ChangeEvent } from 'react';
import { useLocation } from 'react-router';
import { getPageTitle } from '../pageMap';
import type { MessageType, FileInfo } from '../types';

interface MessageInputProps {
  onSend: (
    content: string,
    type?: MessageType,
    fileInfo?: FileInfo,
    pageSnapshot?: { path: string; title: string; description?: string }
  ) => void;
}

export function MessageInput({ onSend }: MessageInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [pendingPageSnapshot, setPendingPageSnapshot] = useState<{
    path: string;
    title: string;
  } | null>(null);
  const [showEmojiPanel, setShowEmojiPanel] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const location = useLocation();

  // 常用表情
  const emojis = [
    '😀', '😂', '🤣', '😊', '😍', '🥰', '😘', '😎',
    '🤔', '😅', '😢', '😭', '😤', '🤯', '👍', '👎',
    '❤️', '🔥', '✨', '🎉', '👏', '🙏', '💪', '🤝',
    '✅', '❌', '⚠️', '💡', '📌', '📎', '🔗', '📝',
  ];

  // 分享当前页面
  const handleSharePage = () => {
    const path = location.pathname;
    const title = getPageTitle(path);
    setPendingPageSnapshot({ path, title });
    inputRef.current?.focus();
  };

  // 处理文件选择
  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>, type: MessageType) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 创建预览 URL
    const url = URL.createObjectURL(file);

    const fileInfo: FileInfo = {
      name: file.name,
      size: file.size,
      type: file.type,
      url,
    };

    onSend('', type, fileInfo);
    e.target.value = '';
  };

  // 发送消息
  const handleSend = () => {
    const trimmed = inputValue.trim();
    if (!trimmed && !pendingPageSnapshot) return;

    if (pendingPageSnapshot) {
      onSend(trimmed || '分享了一个页面', 'page-snapshot', undefined, pendingPageSnapshot);
    } else {
      // 检测是否是链接
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      if (urlRegex.test(trimmed)) {
        onSend(trimmed, 'link');
      } else {
        onSend(trimmed, 'text');
      }
    }

    setInputValue('');
    setPendingPageSnapshot(null);
  };

  // 回车发送
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // 发送表情
  const handleEmojiClick = (emoji: string) => {
    setInputValue(prev => prev + emoji);
    setShowEmojiPanel(false);
    inputRef.current?.focus();
  };

  // 格式化文件大小
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="border-t border-gray-200 bg-white">
      {/* 工具栏 */}
      <div className="flex items-center gap-1 px-4 py-2 border-b border-gray-100">
        {/* 表情 */}
        <div className="relative">
          <button
            onClick={() => setShowEmojiPanel(!showEmojiPanel)}
            className="p-2 text-gray-500 hover:text-yellow-500 hover:bg-yellow-50 rounded-lg transition-colors"
            title="表情"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>

          {/* 表情面板 */}
          {showEmojiPanel && (
            <div className="absolute bottom-full left-0 mb-2 p-3 bg-white rounded-lg shadow-lg border border-gray-200 w-72">
              <div className="grid grid-cols-8 gap-1">
                {emojis.map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => handleEmojiClick(emoji)}
                    className="w-8 h-8 flex items-center justify-center text-xl hover:bg-gray-100 rounded transition-colors"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 图片 */}
        <button
          onClick={() => imageInputRef.current?.click()}
          className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
          title="图片"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFileSelect(e, 'image')}
        />

        {/* 视频 */}
        <button
          onClick={() => videoInputRef.current?.click()}
          className="p-2 text-gray-500 hover:text-purple-500 hover:bg-purple-50 rounded-lg transition-colors"
          title="视频"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </button>
        <input
          ref={videoInputRef}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={(e) => handleFileSelect(e, 'video')}
        />

        {/* 文件 */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-2 text-gray-500 hover:text-green-500 hover:bg-green-50 rounded-lg transition-colors"
          title="文件"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          </svg>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={(e) => handleFileSelect(e, 'file')}
        />

        {/* 分隔线 */}
        <div className="w-px h-5 bg-gray-200 mx-1" />

        {/* 分享当前页面 */}
        <button
          onClick={handleSharePage}
          className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
          title="分享当前页面"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        </button>
      </div>

      {/* 待发送的页面快照预览 */}
      {pendingPageSnapshot && (
        <div className="px-4 py-2 bg-blue-50 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-blue-700">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <span className="font-medium">{pendingPageSnapshot.title}</span>
            <span className="text-blue-500">{pendingPageSnapshot.path}</span>
          </div>
          <button
            onClick={() => setPendingPageSnapshot(null)}
            className="p-1 text-blue-500 hover:text-blue-700 rounded"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* 输入区域 */}
      <div className="px-4 py-3">
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入消息..."
            rows={1}
            className="flex-1 px-4 py-2 text-sm border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[40px] max-h-[120px]"
            style={{ height: 'auto' }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = Math.min(target.scrollHeight, 120) + 'px';
            }}
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() && !pendingPageSnapshot}
            className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            发送
          </button>
        </div>
      </div>
    </div>
  );
}
