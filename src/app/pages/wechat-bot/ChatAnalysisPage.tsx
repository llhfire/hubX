// ========================================
// 群聊智能分析详情页
// 左侧：聊天还原  右侧：AI 提取结果 + 项目上下文
// ========================================

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { ScrollArea } from '../../components/ui/scroll-area';
import { Separator } from '../../components/ui/separator';
import { ArrowLeft, Search, Filter, MessageSquare, Users, Loader2, RefreshCw, Clock, Image, File, Mic, Link as LinkIcon, Video } from 'lucide-react';
import { ChatMessageList, ExtractedItemList, ProjectContextSummary, SatisfactionSignal, ActivityIndicator, AlertRuleList } from './components';
import type { ChatMessage, ExtractedItem, ProjectContext, ExtractedItemStatus, ExtractedItemType, GroupMember } from './types';
import { useWeChat } from './WeChatContext';
import { getGroupMembers } from './wechat-api';

export default function ChatAnalysisPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { groups, fetchGroups, getGroupByLeadId, getGroupByProjectId, getMessages, getExtractedItems, updateExtractedItemStatus, updateExtractedItemType, batchUpdateStatus, getProjectContext, alertRules, toggleAlertRule } = useWeChat();

  // 判断来源：线索还是项目
  const fromLead = location.pathname.startsWith('/leads/');

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [items, setItems] = useState<ExtractedItem[]>([]);
  const [context, setContext] = useState<ProjectContext | undefined>();
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [highlightMsgId, setHighlightMsgId] = useState<string | undefined>();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterSender, setFilterSender] = useState<string>('all');
  const [filterMsgType, setFilterMsgType] = useState<string>('all');
  const [activeRightTab, setActiveRightTab] = useState('extracted');

  const messagesRef = useRef<Map<string, HTMLDivElement>>(new Map());

  // 获取群信息（根据来源判断用 leadId 还是 projectId 查找）
  const group = id ? (fromLead ? getGroupByLeadId(id) : getGroupByProjectId(id)) : undefined;

  // 初始化：加载群列表
  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  // 加载数据
  useEffect(() => {
    if (!group) return;
    setIsLoading(true);
    Promise.all([
      getMessages(group.id),
      getExtractedItems(group.id),
      getProjectContext(group.id),
      getGroupMembers(group.id),
    ]).then(([msgs, extItems, ctx, mems]) => {
      setMessages(msgs);
      setItems(extItems);
      setContext(ctx);
      setMembers(mems);
      setIsLoading(false);
    });
  }, [group, groups, getMessages, getExtractedItems, getProjectContext]);

  // 滚动到指定消息
  const scrollToMessage = useCallback((msgId: string) => {
    setHighlightMsgId(msgId);
    const el = messagesRef.current.get(msgId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => setHighlightMsgId(undefined), 3000);
    }
  }, []);

  // 筛选消息
  const filteredMessages = messages.filter(m => {
    if (searchKeyword && !m.content.toLowerCase().includes(searchKeyword.toLowerCase())) return false;
    if (filterSender !== 'all' && m.senderId !== filterSender) return false;
    if (filterMsgType !== 'all' && m.msgType !== filterMsgType) return false;
    return true;
  });

  // 消息类型统计
  const msgTypeCounts = messages.reduce((acc, m) => {
    acc[m.msgType] = (acc[m.msgType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // 审核操作
  const handleStatusChange = useCallback(async (itemId: string, status: ExtractedItemStatus) => {
    await updateExtractedItemStatus(itemId, status);
    setItems(prev => prev.map(i => i.id === itemId ? { ...i, status } : i));
  }, [updateExtractedItemStatus]);

  const handleTypeChange = useCallback(async (itemId: string, type: ExtractedItemType) => {
    await updateExtractedItemType(itemId, type);
    setItems(prev => prev.map(i => i.id === itemId ? { ...i, itemType: type } : i));
  }, [updateExtractedItemType]);

  if (!group) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-lg font-semibold mb-2">未找到群聊信息</h2>
          <p className="text-muted-foreground mb-4">该线索尚未关联微信群</p>
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" /> 返回
          </Button>
        </div>
      </div>
    );
  }

  // 满意度信号（从项目上下文推导）
  const satisfactionSignals = context ? [
    ...(context.customerStatus.includes('积极') ? [{ type: 'positive' as const, text: '客户沟通积极' }] : []),
    ...(context.customerStatus.includes('满意') ? [{ type: 'positive' as const, text: '客户表示满意' }] : []),
    ...(context.riskItems.length > 0 ? [{ type: 'negative' as const, text: `${context.riskItems.length} 个风险项` }] : []),
    ...(group.activityLevel === '沉默' ? [{ type: 'negative' as const, text: '群活跃度低' }] : []),
    ...(group.activityLevel === '高' ? [{ type: 'positive' as const, text: '群聊活跃' }] : []),
  ] : [];

  return (
    <div className="flex flex-col h-[calc(100vh-80px)]">
      {/* 顶部导航 - 单行紧凑 */}
      <div className="flex items-center justify-between px-4 py-2 border-b bg-white shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 shrink-0" onClick={() => {
            if (fromLead && id) {
              navigate(`/leads/${id}`);
            } else if (id) {
              navigate(`/projects/${id}`);
            } else {
              navigate(-1);
            }
          }}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-sm font-semibold truncate shrink-0">{group.groupName}</h1>
          <Badge variant="outline" className="text-[10px] py-0 h-4 bg-green-50 border-green-200 text-green-700 shrink-0">微信群</Badge>
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground min-w-0 flex-wrap">
            <Users className="h-3 w-3 shrink-0" />
            <span className="shrink-0">{group.memberCount}人</span>
            <ActivityIndicator level={group.activityLevel} showLabel={false} size="sm" />
            <span className="shrink-0">{group.activityLevel}</span>
            <span className="shrink-0">今日 {group.todayMsgCount} 条</span>
            <span className="shrink-0">· 上次采集 {group.lastSyncTime ? new Date(group.lastSyncTime).toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }) : '-'}</span>
            <span className="shrink-0">· 下次采集 {group.nextSyncTime ? new Date(group.nextSyncTime).toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }) : '-'}</span>
          </div>
        </div>
      </div>

      {/* 主内容区：左右分栏 */}
      <div className="flex flex-col lg:flex-row flex-1 min-h-0">
        {/* 左侧：聊天还原 */}
        <div className="flex-1 flex flex-col lg:border-r min-w-0">
          {/* 搜索和筛选栏 - 单行紧凑 */}
          <div className="flex items-center gap-2 px-3 py-1.5 border-b bg-gray-50/50 shrink-0">
            <div className="relative flex-1 max-w-[180px]">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
              <Input
                placeholder="搜索..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="pl-6 h-6 text-[11px]"
              />
            </div>
            <Select value={filterSender} onValueChange={setFilterSender}>
              <SelectTrigger className="w-24 h-6 text-[11px]">
                <SelectValue placeholder="发送者" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部</SelectItem>
                {members.map(m => (
                  <SelectItem key={m.id} value={m.id}>{m.wechatNickname}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Separator orientation="vertical" className="h-4" />
            {[
              { key: 'all', label: '全部' },
              { key: '文本', label: '文本' },
              { key: '图片', label: '图片' },
              { key: '文件', label: '文件' },
              { key: '语音', label: '语音' },
              { key: '链接', label: '链接' },
              { key: '视频', label: '视频' },
            ].map(({ key, label }) => (
              <Button
                key={key}
                variant={filterMsgType === key ? 'default' : 'ghost'}
                size="sm"
                className={`h-5 text-[10px] px-1.5 ${filterMsgType === key ? '' : ''}`}
                onClick={() => setFilterMsgType(key)}
              >
                {label}
                {key !== 'all' && msgTypeCounts[key] ? (
                  <span className="ml-0.5 text-[9px] opacity-70">({msgTypeCounts[key]})</span>
                ) : null}
              </Button>
            ))}
          </div>

          {/* 消息列表 */}
          <ScrollArea className="flex-1 min-h-0">
            {isLoading ? (
              <div className="flex items-center justify-center h-40">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <ChatMessageList
                messages={filteredMessages}
                highlightMessageId={highlightMsgId}
                messagesRef={messagesRef}
              />
            )}
          </ScrollArea>
        </div>

        {/* 右侧：提取结果 + 上下文 */}
        <div className="w-full lg:w-[420px] flex flex-col min-w-0 shrink-0">
          <Tabs value={activeRightTab} onValueChange={setActiveRightTab} className="flex-1 flex flex-col min-h-0">
            <div className="px-4 pt-2 border-b bg-gray-50/50 shrink-0">
              <TabsList className="h-8">
                <TabsTrigger value="extracted" className="text-xs h-6">
                  提取结果
                  <Badge variant="secondary" className="ml-1 text-[10px] py-0 h-4">{items.length}</Badge>
                </TabsTrigger>
                <TabsTrigger value="context" className="text-xs h-6">项目摘要</TabsTrigger>
                <TabsTrigger value="signals" className="text-xs h-6">满意度</TabsTrigger>
                <TabsTrigger value="rules" className="text-xs h-6">规则</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="extracted" className="flex-1 min-h-0 m-0">
              <ScrollArea className="h-full">
                <div className="p-4">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-40">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    <ExtractedItemList
                      items={items}
                      onStatusChange={handleStatusChange}
                      onTypeChange={handleTypeChange}
                      onScrollToSource={scrollToMessage}
                    />
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="context" className="flex-1 min-h-0 m-0">
              <ScrollArea className="h-full">
                <div className="p-4">
                  {context ? (
                    <ProjectContextSummary context={context} />
                  ) : (
                    <div className="text-center text-muted-foreground text-sm py-8">
                      暂无项目上下文
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="signals" className="flex-1 min-h-0 m-0">
              <ScrollArea className="h-full">
                <div className="p-4 space-y-4">
                  <SatisfactionSignal
                    signals={satisfactionSignals}
                    summary={context?.customerStatus}
                  />
                  {/* 活跃度详情 */}
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="text-xs font-medium mb-2">活跃度详情</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>今日消息: <strong>{group.todayMsgCount}</strong></div>
                      <div>成员数: <strong>{group.memberCount}</strong></div>
                      <div>活跃等级: <strong>{group.activityLevel}</strong></div>
                      <div>最后消息: <strong>{group.lastMessageTime ? new Date(group.lastMessageTime).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }) : '-'}</strong></div>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="rules" className="flex-1 min-h-0 m-0">
              <ScrollArea className="h-full">
                <div className="p-4">
                  <AlertRuleList rules={alertRules} onToggleRule={toggleAlertRule} />
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
