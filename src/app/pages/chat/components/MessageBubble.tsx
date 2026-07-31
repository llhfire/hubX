// ============================================================
// HubX 内部通讯 — 消息气泡组件
// ============================================================

import { useState } from 'react';
import { useNavigate } from 'react-router';
import type { ChatMessage } from '../types';

interface MessageBubbleProps {
  message: ChatMessage;
  isSelf: boolean;
}

export function MessageBubble({ message, isSelf }: MessageBubbleProps) {
  const navigate = useNavigate();
  const [showImagePreview, setShowImagePreview] = useState(false);

  const time = new Date(message.timestamp).toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleLinkClick = (path: string) => {
    navigate(path);
  };

  // 格式化文件大小
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // 获取文件类型图标
  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return '📄';
    if (type.includes('word') || type.includes('doc')) return '📝';
    if (type.includes('excel') || type.includes('sheet')) return '📊';
    if (type.includes('powerpoint') || type.includes('presentation')) return '📑';
    if (type.includes('zip') || type.includes('rar')) return '📦';
    return '📎';
  };

  // 渲染消息内容
  const renderContent = () => {
    switch (message.type) {
      case 'image':
        return (
          <div className="relative">
            <img
              src={message.fileInfo?.url}
              alt="图片"
              className="max-w-[300px] max-h-[300px] rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => setShowImagePreview(true)}
            />
            {/* 图片预览模态框 */}
            {showImagePreview && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
                onClick={() => setShowImagePreview(false)}
              >
                <img
                  src={message.fileInfo?.url}
                  alt="图片预览"
                  className="max-w-[90vw] max-h-[90vh] object-contain"
                />
                <button
                  className="absolute top-4 right-4 p-2 text-white bg-black/50 rounded-full hover:bg-black/70"
                  onClick={() => setShowImagePreview(false)}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        );

      case 'video':
        return (
          <div className="relative">
            <video
              src={message.fileInfo?.url}
              className="max-w-[300px] max-h-[200px] rounded-lg"
              controls
              preload="metadata"
            />
          </div>
        );

      case 'file':
        return (
          <div
            className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:opacity-80 transition-opacity min-w-[200px] ${
              isSelf
                ? 'bg-blue-600 border-blue-400 text-white'
                : 'bg-white border-gray-200 text-gray-700'
            }`}
            onClick={() => {
              if (message.fileInfo?.url) {
                window.open(message.fileInfo.url, '_blank');
              }
            }}
          >
            <span className="text-2xl">{getFileIcon(message.fileInfo?.type || '')}</span>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{message.fileInfo?.name}</div>
              <div className={`text-xs ${isSelf ? 'text-blue-200' : 'text-gray-400'}`}>
                {formatFileSize(message.fileInfo?.size || 0)}
              </div>
            </div>
          </div>
        );

      case 'link':
        return (
          <div
            className={`px-3 py-2 rounded-lg text-sm cursor-pointer hover:opacity-80 transition-opacity ${
              isSelf
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-200 text-blue-600'
            }`}
          >
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <span className="break-all">{message.content}</span>
            </div>
          </div>
        );

      case 'page-snapshot':
        return (
          <button
            onClick={() => handleLinkClick(message.pageSnapshot!.path)}
            className={`px-3 py-2 rounded-lg text-sm border cursor-pointer hover:opacity-80 transition-opacity text-left ${
              isSelf
                ? 'bg-blue-600 border-blue-400 text-white'
                : 'bg-white border-gray-200 text-gray-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <div>
                <div className="font-medium">{message.pageSnapshot?.title}</div>
                <div className={`text-xs ${isSelf ? 'text-blue-200' : 'text-gray-400'}`}>
                  {message.pageSnapshot?.path}
                </div>
              </div>
            </div>
          </button>
        );

      default:
        return (
          <div
            className={`px-3 py-2 rounded-lg text-sm whitespace-pre-wrap ${
              isSelf
                ? 'bg-blue-500 text-white rounded-br-none'
                : 'bg-gray-100 text-gray-900 rounded-bl-none'
            }`}
          >
            {message.content}
          </div>
        );
    }
  };

  return (
    <div className={`flex ${isSelf ? 'justify-end' : 'justify-start'} mb-4`}>
      {/* 对方头像 */}
      {!isSelf && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-medium mr-2 flex-shrink-0 mt-1">
          {message.senderName.charAt(0)}
        </div>
      )}

      <div className={`flex flex-col ${isSelf ? 'items-end' : 'items-start'} max-w-[70%]`}>
        {/* 消息内容 */}
        {renderContent()}

        {/* 时间戳 */}
        <span className="text-[10px] text-gray-400 mt-1 px-1">{time}</span>
      </div>

      {/* 自己头像 */}
      {isSelf && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-xs font-medium ml-2 flex-shrink-0 mt-1">
          我
        </div>
      )}
    </div>
  );
}
