// 聊天消息列表组件（气泡样式）
import { useRef, useEffect } from 'react';
import { Badge } from '../../../components/ui/badge';
import { Image, File, Mic, Link as LinkIcon, Video } from 'lucide-react';
import { ChatMessage, messageTypeConfig, SenderIdentity } from '../types';

interface ChatMessageListProps {
  messages: ChatMessage[];
  highlightMessageId?: string;
  messagesRef?: React.MutableRefObject<Map<string, HTMLDivElement>>;
}

// 按日期分组
function groupByDate(messages: ChatMessage[]): Map<string, ChatMessage[]> {
  const groups = new Map<string, ChatMessage[]>();
  for (const msg of messages) {
    const date = new Date(msg.sendTime).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      weekday: 'short',
    });
    if (!groups.has(date)) groups.set(date, []);
    groups.get(date)!.push(msg);
  }
  return groups;
}

// 格式化时间
function formatTime(timeStr: string): string {
  return new Date(timeStr).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
}

// 身份标签颜色
const identityColors: Record<SenderIdentity, string> = {
  '客户': 'bg-orange-100 text-orange-700',
  '我方': 'bg-blue-100 text-blue-700',
  '未知': 'bg-gray-100 text-gray-600',
};

// 消息气泡
function MessageBubble({ msg, isHighlighted, innerRef }: { msg: ChatMessage; isHighlighted: boolean; innerRef?: (el: HTMLDivElement | null) => void }) {
  const isCustomer = msg.senderIdentity === '客户';

  return (
    <div
      ref={innerRef}
      className={`flex ${isCustomer ? 'justify-start' : 'justify-end'} mb-2 transition-all duration-300 ${
        isHighlighted ? 'scale-[1.02]' : ''
      }`}
    >
      <div className={`max-w-[75%] ${isCustomer ? 'mr-auto' : 'ml-auto'}`}>
        {/* 发送者信息 */}
        <div className={`flex items-center gap-1.5 mb-0.5 ${isCustomer ? '' : 'flex-row-reverse'}`}>
          <span className="text-xs font-medium text-foreground">{msg.senderNickname}</span>
          <Badge variant="outline" className={`text-[10px] py-0 h-4 ${identityColors[msg.senderIdentity]}`}>
            {msg.senderIdentity}
          </Badge>
          <span className="text-[10px] text-muted-foreground">{formatTime(msg.sendTime)}</span>
        </div>

        {/* 消息内容 */}
        <div
          className={`rounded-lg px-3 py-2 text-sm leading-relaxed ${
            isCustomer
              ? 'bg-white border border-gray-200 text-gray-800'
              : 'bg-blue-500 text-white'
          } ${isHighlighted ? 'ring-2 ring-yellow-400 ring-offset-1' : ''}`}
        >
          {/* 根据消息类型渲染 */}
          {msg.msgType === '文本' && <span>{msg.content}</span>}

          {msg.msgType === '图片' && (
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <Image className="h-3.5 w-3.5" />
                <span className="text-xs">[图片]</span>
              </div>
              {msg.content && <p className="text-xs opacity-80">{msg.content}</p>}
            </div>
          )}

          {msg.msgType === '文件' && (
            <div className="flex items-center gap-1.5">
              <File className="h-3.5 w-3.5" />
              <div>
                <span className="text-xs">{msg.mediaName || '[文件]'}</span>
                {msg.mediaSize && <span className="text-[10px] opacity-70 ml-1">({msg.mediaSize})</span>}
              </div>
            </div>
          )}

          {msg.msgType === '语音' && (
            <div className="flex items-center gap-1.5">
              <Mic className="h-3.5 w-3.5" />
              <span className="text-xs">[语音消息]</span>
            </div>
          )}

          {msg.msgType === '链接' && (
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <LinkIcon className="h-3.5 w-3.5" />
                <span className="text-xs underline">{msg.linkTitle || '[链接]'}</span>
              </div>
              {msg.content && <p className="text-xs opacity-80">{msg.content}</p>}
            </div>
          )}

          {msg.msgType === '视频' && (
            <div className="flex items-center gap-1.5">
              <Video className="h-3.5 w-3.5" />
              <div>
                <span className="text-xs">{msg.mediaName || '[视频]'}</span>
                {msg.mediaSize && <span className="text-[10px] opacity-70 ml-1">({msg.mediaSize})</span>}
              </div>
            </div>
          )}

          {/* 提取标记 */}
          {msg.isExtracted && (
            <Badge variant="outline" className="mt-1 text-[10px] py-0 h-4 bg-yellow-50 border-yellow-200 text-yellow-700">
              已提取
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}

export function ChatMessageList({ messages, highlightMessageId, messagesRef }: ChatMessageListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const grouped = groupByDate(messages);

  // 注册消息元素引用
  const setMsgRef = (id: string, el: HTMLDivElement | null) => {
    if (messagesRef && el) {
      messagesRef.current.set(id, el);
    }
  };

  return (
    <div ref={containerRef} className="space-y-4 p-4">
      {Array.from(grouped.entries()).map(([date, msgs]) => (
        <div key={date}>
          {/* 日期分隔 */}
          <div className="flex items-center justify-center mb-3">
            <div className="bg-gray-100 text-gray-500 text-[10px] px-3 py-0.5 rounded-full">
              {date}
            </div>
          </div>

          {/* 消息列表 */}
          {msgs.map((msg) => (
            <MessageBubble
              key={msg.id}
              msg={msg}
              isHighlighted={msg.id === highlightMessageId}
              innerRef={(el) => setMsgRef(msg.id, el)}
            />
          ))}
        </div>
      ))}

      {messages.length === 0 && (
        <div className="text-center text-muted-foreground text-sm py-8">
          暂无消息记录
        </div>
      )}
    </div>
  );
}
