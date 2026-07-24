import { useMemo, useState } from 'react';
import {
  Pencil,
  Link,
  MoreHorizontal,
  Copy,
  Maximize2,
  Star,
  ThumbsUp,
  X,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '../../../components/ui/avatar';
import { Button } from '../../../components/ui/button';
import { Separator } from '../../../components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '../../../components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../components/ui/tabs';
import { Badge } from '../../../components/ui/badge';
import type { Defect, Requirement, Task, WorkItemActions, WorkItemType } from '../types';
import {
  STATUS_OPTIONS,
  TYPE_LABEL_MAP,
  TYPE_BADGE_COLOR,
} from '../constants';
import { getEmployeeName } from '../mockData';
import { CommentSection } from './CommentSection';

// ── 优先级配置 ────────────────────────────────────────────────
const PRIORITY_PILL: Record<string, { bg: string; color: string }> = {
  '高': { bg: '#fff1f0', color: '#f53f3f' },
  '中': { bg: '#e8f5e9', color: '#00b42a' },
  '低': { bg: '#f5f5f5', color: '#86909c' },
};

// ── 状态配置 ──────────────────────────────────────────────────
const STATUS_PILL: Record<string, { bg: string; color: string }> = {
  '待处理': { bg: '#fff7e6', color: '#ff7d00' },
  '进行中': { bg: '#e6f7ff', color: '#165dff' },
  '已完成': { bg: '#f6ffed', color: '#00b42a' },
  '已搁置': { bg: '#f5f5f5', color: '#86909c' },
  '已阻塞': { bg: '#fff1f0', color: '#f53f3f' },
  '处理中': { bg: '#fff7e6', color: '#ff7d00' },
  '待验证': { bg: '#f9f0ff', color: '#722ed1' },
  '已关闭': { bg: '#f6ffed', color: '#00b42a' },
  '已拒绝': { bg: '#f5f5f5', color: '#86909c' },
  '已重开': { bg: '#fff1f0', color: '#f53f3f' },
};

interface WorkItemDetailDrawerProps {
  workItemId: string;
  workItemType: WorkItemType;
  workItems: WorkItemActions;
  onClose: () => void;
}

export function WorkItemDetailDrawer({
  workItemId,
  workItemType,
  workItems,
  onClose,
}: WorkItemDetailDrawerProps) {
  const [activeTab, setActiveTab] = useState('detail');

  const item = useMemo(() => {
    if (workItemType === 'requirement') {
      return workItems.requirements.find((r: Requirement) => r.id === workItemId);
    } else if (workItemType === 'task') {
      return workItems.tasks.find((t: Task) => t.id === workItemId);
    } else {
      return workItems.defects.find((d: Defect) => d.id === workItemId);
    }
  }, [workItemId, workItemType, workItems.requirements, workItems.tasks, workItems.defects]);

  if (!item) return null;

  const comments = workItems.getComments(workItemId);
  const activityLogs = workItems.getActivityLogs(workItemId);
  const links = workItems.getLinks(workItemId);
  const statusOptions = STATUS_OPTIONS[workItemType];

  const handleStatusChange = (newStatus: string) => {
    if (workItemType === 'requirement') {
      workItems.updateRequirementStatus(workItemId, newStatus as Requirement['status'], '1');
    } else if (workItemType === 'task') {
      workItems.updateTaskStatus(workItemId, newStatus as Task['status'], '1');
    } else {
      workItems.updateDefectStatus(workItemId, newStatus as Defect['status'], '1');
    }
  };

  const statusPill = STATUS_PILL[item.status] || STATUS_PILL['待处理'];
  const priorityPill = PRIORITY_PILL[item.priority] || PRIORITY_PILL['中'];

  return (
    <Sheet open={true} onOpenChange={(open) => { if (!open) onClose(); }}>
      <SheetContent
        side="right"
        className="w-[900px] max-w-[900px] sm:max-w-[900px] p-0 gap-0 [&>button]:hidden"
      >
        {/* 自定义头部 */}
        <div className="flex items-center justify-between border-b border-[#e5e6eb] bg-[#fafafa] px-4 py-3">
          <div className="flex items-center gap-3">
            <Select value={item.status} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-[100px] h-8 border-none bg-transparent text-xs shadow-none focus:ring-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="min-w-[120px]">
                {statusOptions.map(s => (
                  <SelectItem key={s} value={s}>
                    <span
                      className="rounded-[10px] px-2 py-0.5 text-xs"
                      style={{
                        background: STATUS_PILL[s]?.bg || '#f5f5f5',
                        color: STATUS_PILL[s]?.color || '#86909c',
                      }}
                    >
                      {s}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-xs text-[#86909c]">ID: {item.projectNo}</span>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Maximize2 className="size-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <ThumbsUp className="size-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Link className="size-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="size-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Copy className="size-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onClose}>
              <X className="size-4" />
            </Button>
          </div>
        </div>

        {/* 标题区域 */}
        <div className="flex items-center gap-2 px-4 py-3">
          <span
            className="inline-flex items-center justify-center rounded px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white"
            style={{ background: TYPE_BADGE_COLOR[workItemType] }}
          >
            {TYPE_LABEL_MAP[workItemType].slice(0, 2)}
          </span>
          <span className="text-base font-semibold">{item.title}</span>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-[#86909c]">
              <Copy className="size-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-[#86909c]">
              <Star className="size-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-[#86909c]">
              <Link className="size-4" />
            </Button>
          </div>
        </div>

        {/* Tab 导航 */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="px-4">
          <TabsList className="bg-transparent p-0 h-auto gap-0">
            <TabsTrigger value="detail" className="text-xs">详细信息</TabsTrigger>
            <TabsTrigger value="sub" className="text-xs">子需求 ({0})</TabsTrigger>
            <TabsTrigger value="bugs" className="text-xs">缺陷 ({0})</TabsTrigger>
            <TabsTrigger value="history" className="text-xs">变更历史 ({activityLogs.length})</TabsTrigger>
            <TabsTrigger value="more" className="text-xs">更多</TabsTrigger>
          </TabsList>

          {/* 主内容区域 */}
          <div className="flex flex-1 overflow-hidden min-h-0">
            {/* 左侧内容区 */}
            <div className="flex-1 overflow-y-auto p-4 border-r border-[#e5e6eb] pb-20">
              {/* 编辑按钮 */}
              <div className="flex justify-end mb-3">
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" className="text-xs">
                    <Pencil className="size-4" />
                    编辑
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Maximize2 className="size-4" />
                  </Button>
                </div>
              </div>

              {/* 描述内容 */}
              <div
                className="rich-text-content leading-[1.8] text-[#1d2129]"
                dangerouslySetInnerHTML={{ __html: item.description }}
              />

              {/* 验收标准（需求） */}
              {workItemType === 'requirement' && (item as Requirement).acceptanceCriteria && (
                <div className="mt-6">
                  <h6 className="text-sm font-semibold mb-2">验收标准</h6>
                  <p className="whitespace-pre-wrap text-[#4e5969] text-sm">
                    {(item as Requirement).acceptanceCriteria}
                  </p>
                </div>
              )}

              {/* 复现步骤（缺陷） */}
              {workItemType === 'defect' && (item as Defect).reproductionSteps && (
                <div className="mt-6">
                  <h6 className="text-sm font-semibold mb-2">复现步骤</h6>
                  <p className="whitespace-pre-wrap text-[#4e5969] text-sm">
                    {(item as Defect).reproductionSteps}
                  </p>
                </div>
              )}

              {/* 检查清单（任务） */}
              {workItemType === 'task' && (item as Task).checklist.length > 0 && (
                <div className="mt-6">
                  <h6 className="text-sm font-semibold mb-2">检查清单</h6>
                  <div className="flex flex-col gap-1 w-full">
                    {(item as Task).checklist.map((c) => (
                      <label
                        key={c.id}
                        className="flex items-center gap-2 cursor-pointer py-1"
                      >
                        <input
                          type="checkbox"
                          checked={c.done}
                          onChange={() => {
                            const updated = (item as Task).checklist.map((x) =>
                              x.id === c.id ? { ...x, done: !x.done } : x
                            );
                            workItems.updateTask(workItemId, { checklist: updated }, '1');
                          }}
                          className="w-4 h-4"
                        />
                        <span
                          className="text-sm"
                          style={{
                            textDecoration: c.done ? 'line-through' : 'none',
                            color: c.done ? '#86909c' : '#1d2129',
                          }}
                        >
                          {c.text}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* 关联 */}
              {(item.contractId || links.length > 0) && (
                <div className="mt-6">
                  <h6 className="text-sm font-semibold mb-2">关联</h6>
                  <div className="flex flex-col gap-1 w-full">
                    {item.contractId && (
                      <span className="text-sm text-muted-foreground">关联合同：{item.contractId}</span>
                    )}
                    {links.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {links.map((l) => {
                          const linkedId = l.sourceId === workItemId ? l.targetId : l.sourceId;
                          const linkedItem = workItems.allWorkItems.find(w => w.id === linkedId);
                          return (
                            <Badge key={l.id} variant="secondary" className="rounded">
                              {linkedItem?.projectNo || linkedId}
                            </Badge>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 评论列表 */}
              <div className="mt-6">
                <h6 className="text-sm font-semibold mb-2">评论 ({comments.length})</h6>
                <CommentSection
                  workItemId={workItemId}
                  workItemType={workItemType}
                  comments={comments}
                  workItems={workItems}
                  listOnly
                />
              </div>
            </div>

            {/* 右侧信息面板 */}
            <div className="w-[280px] shrink-0 overflow-y-auto p-4 bg-[#fafafa]">
              <h6 className="text-sm font-semibold mb-3 text-[#86909c]">基础信息</h6>

              <div className="flex flex-col gap-3 w-full">
                {/* 状态 */}
                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-[#86909c]">状态</span>
                  <span
                    className="rounded-[10px] px-2.5 py-0.5 text-xs font-medium"
                    style={{ background: statusPill.bg, color: statusPill.color }}
                  >
                    {item.status}
                  </span>
                </div>

                {/* 父需求（任务和缺陷） */}
                {(workItemType === 'task' || workItemType === 'defect') && (
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-[#86909c]">父需求</span>
                    <span className="text-[13px]">
                      {(workItemType === 'task' ? (item as Task).requirementId : (item as Defect).requirementId) || '-'}
                    </span>
                  </div>
                )}

                {/* 创建模板 */}
                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-[#86909c]">创建模板</span>
                  <span className="text-[13px]">工作项模板</span>
                </div>

                {/* 分类 */}
                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-[#86909c]">分类</span>
                  <span className="text-[13px]">未分类</span>
                </div>

                {/* 优先级 */}
                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-[#86909c]">优先级</span>
                  <span
                    className="rounded-[10px] px-2.5 py-0.5 text-xs font-medium"
                    style={{ background: priorityPill.bg, color: priorityPill.color }}
                  >
                    {item.priority}
                  </span>
                </div>

                {/* 严重程度（缺陷） */}
                {workItemType === 'defect' && (
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-[#86909c]">严重程度</span>
                    <span className="text-[13px]">{(item as Defect).severity}</span>
                  </div>
                )}

                {/* 处理人 */}
                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-[#86909c]">处理人</span>
                  <div className="flex items-center gap-1">
                    <Avatar className="size-[18px]">
                      <AvatarFallback className="bg-[#165dff] text-white text-[10px]">
                        {getEmployeeName(item.assigneeId)[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-[13px]">{getEmployeeName(item.assigneeId)}</span>
                  </div>
                </div>

                {/* 预计开始 */}
                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-[#86909c]">预计开始</span>
                  <span className="text-[13px]">{item.createdAt?.split(' ')[0] || '-'}</span>
                </div>

                {/* 预计结束 */}
                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-[#86909c]">预计结束</span>
                  <span className="text-[13px]">{(item as Task).dueDate || '-'}</span>
                </div>

                {/* 创建人 */}
                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-[#86909c]">创建人</span>
                  <div className="flex items-center gap-1">
                    <Avatar className="size-[18px]">
                      <AvatarFallback className="bg-[#00b42a] text-white text-[10px]">
                        {getEmployeeName(item.creatorId)[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-[13px]">{getEmployeeName(item.creatorId)}</span>
                  </div>
                </div>

                {/* 创建时间 */}
                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-[#86909c]">创建时间</span>
                  <span className="text-[13px]">{item.createdAt}</span>
                </div>

                {/* 完成时间 */}
                {item.status === '已完成' || item.status === '已关闭' ? (
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-[#86909c]">完成时间</span>
                    <span className="text-[13px]">{item.updatedAt}</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-[#86909c]">完成时间</span>
                    <span className="text-[13px] text-[#c9cdd4]">-</span>
                  </div>
                )}

                {/* 工时（任务） */}
                {workItemType === 'task' && (
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-[#86909c]">工时</span>
                    <span className="text-[13px]">
                      {(item as Task).actualHours || 0}/{(item as Task).estimatedHours || 0}h
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Tabs>

        {/* 底部评论输入框 - 固定在底部 */}
        <div className="border-t border-[#e5e6eb] bg-white sticky bottom-0 z-10 px-4 py-3">
          <CommentSection
            workItemId={workItemId}
            workItemType={workItemType}
            comments={comments}
            workItems={workItems}
            inputOnly
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
