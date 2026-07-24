'use client';

import { useMemo, useState } from 'react';
import { Avatar, AvatarFallback } from '../../../components/ui/avatar';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Checkbox } from '../../../components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu';
import { Input } from '../../../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/ui/table';
import {
  Plus,
  Search,
  MoreHorizontal,
  Eye,
  Settings,
  Filter,
  Layers,
} from 'lucide-react';
import type { WorkItem, WorkItemActions, WorkItemFilter, WorkItemType } from '../types';
import {
  STATUS_COLOR_MAP,
  PRIORITY_COLOR_MAP,
  SEVERITY_COLOR_MAP,
  TYPE_LABEL_MAP,
  STATUS_OPTIONS,
  SPACING,
} from '../constants';
import { getEmployeeName } from '../mockData';
import { WorkItemDetailDrawer } from './WorkItemDetailDrawer';
import { WorkItemFormModal } from './WorkItemFormModal';

// ── 类型徽章颜色 ──────────────────────────────────────────────
const TYPE_BADGE_COLOR: Record<WorkItemType, string> = {
  requirement: 'bg-blue-500',
  task: 'bg-green-500',
  defect: 'bg-red-500',
};

// ── 优先级配置（药丸样式） ────────────────────────────────────
const PRIORITY_PILL: Record<string, { bg: string; color: string }> = {
  '高': { bg: 'bg-red-50', color: 'text-red-600' },
  '中': { bg: 'bg-green-50', color: 'text-green-600' },
  '低': { bg: 'bg-gray-100', color: 'text-gray-500' },
};

// ── 状态配置（药丸样式） ──────────────────────────────────────
const STATUS_PILL: Record<string, { bg: string; color: string }> = {
  '待处理': { bg: 'bg-orange-50', color: 'text-orange-600' },
  '进行中': { bg: 'bg-blue-50', color: 'text-blue-600' },
  '已完成': { bg: 'bg-green-50', color: 'text-green-600' },
  '已搁置': { bg: 'bg-gray-100', color: 'text-gray-500' },
  '已阻塞': { bg: 'bg-red-50', color: 'text-red-600' },
  '处理中': { bg: 'bg-orange-50', color: 'text-orange-600' },
  '待验证': { bg: 'bg-purple-50', color: 'text-purple-600' },
  '已关闭': { bg: 'bg-green-50', color: 'text-green-600' },
  '已拒绝': { bg: 'bg-gray-100', color: 'text-gray-500' },
  '已重开': { bg: 'bg-red-50', color: 'text-red-600' },
};

// ── 筛选器配置类型 ────────────────────────────────────────────
export interface FilterConfig {
  statusOptions: string[];
  extraFilters?: Array<{
    key: string;
    placeholder: string;
    options: string[];
  }>;
}

// ── 组件 Props ────────────────────────────────────────────────
interface WorkItemListProps<T extends WorkItem> {
  type: WorkItemType;
  items: T[];
  workItems: WorkItemActions;
  projectId: string;
  filterConfig: FilterConfig;
  createLabel: string;
}

export function WorkItemList<T extends WorkItem>({
  type,
  items,
  workItems,
  projectId,
  filterConfig,
  createLabel,
}: WorkItemListProps<T>) {
  const [filter, setFilter] = useState<WorkItemFilter>(() => ({
    keyword: '',
    status: [],
    priority: [],
    assigneeId: [],
    creatorId: [],
    ...Object.fromEntries(
      (filterConfig.extraFilters || []).map(ef => [ef.key, []])
    ),
  }));
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [formVisible, setFormVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

  const filtered = useMemo(
    () => workItems.filterItems(items, filter),
    [items, filter, workItems]
  );

  return (
    <div>
      {/* 工具栏 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Button onClick={() => setFormVisible(true)}>
            <Plus className="h-4 w-4 mr-2" />
            {createLabel}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <MoreHorizontal className="h-4 w-4 mr-2" />
                更多操作
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>批量编辑</DropdownMenuItem>
              <DropdownMenuItem>导出</DropdownMenuItem>
              <DropdownMenuItem>导入</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            视图：所有
          </Button>
          <Button variant="ghost" size="sm">
            <Layers className="h-4 w-4 mr-2" />
            分组：无分组
          </Button>
          <Button variant="ghost" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            过滤
          </Button>
          <span className="text-sm text-muted-foreground">共 {filtered.length} 个</span>
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            设置
          </Button>
        </div>
      </div>

      {/* 搜索和筛选栏 */}
      <div className="flex items-center gap-2 mb-4 p-3 bg-muted/50 rounded-lg">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索标题或描述..."
            value={filter.keyword}
            onChange={(e) => setFilter(prev => ({ ...prev, keyword: e.target.value }))}
            className="pl-9"
          />
        </div>
        <Select
          value={filter.status[0] || ''}
          onValueChange={(v) => setFilter(prev => ({ ...prev, status: v ? [v] : [] }))}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="状态" />
          </SelectTrigger>
          <SelectContent>
            {filterConfig.statusOptions.map(s => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={filter.priority[0] || ''}
          onValueChange={(v) => setFilter(prev => ({ ...prev, priority: v ? [v] : [] }))}
        >
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="优先级" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="高">高</SelectItem>
            <SelectItem value="中">中</SelectItem>
            <SelectItem value="低">低</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 表格 */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <Checkbox
                  checked={selectedRowKeys.length === filtered.length}
                  onCheckedChange={(checked) => {
                    setSelectedRowKeys(checked ? filtered.map(i => i.id) : []);
                  }}
                />
              </TableHead>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>
                <div className="flex items-center gap-2">
                  标题
                  <span className="text-muted-foreground text-xs">({filtered.length})</span>
                </div>
              </TableHead>
              <TableHead className="w-[80px]">优先级</TableHead>
              <TableHead className="w-[100px]">状态</TableHead>
              <TableHead className="w-[120px]">处理人</TableHead>
              {type === 'task' && <TableHead className="w-[110px]">预计开始</TableHead>}
              {type === 'task' && <TableHead className="w-[110px]">预计结束</TableHead>}
              {type === 'defect' && <TableHead className="w-[100px]">严重程度</TableHead>}
              {type === 'defect' && <TableHead className="w-[110px]">预计开始</TableHead>}
              {type === 'defect' && <TableHead className="w-[110px]">预计结束</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="h-24 text-center text-muted-foreground">
                  暂无数据
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((item) => {
                const statusPill = STATUS_PILL[item.status] || STATUS_PILL['待处理'];
                const priorityPill = PRIORITY_PILL[item.priority] || PRIORITY_PILL['中'];
                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedRowKeys.includes(item.id)}
                        onCheckedChange={(checked) => {
                          setSelectedRowKeys(prev =>
                            checked ? [...prev, item.id] : prev.filter(id => id !== item.id)
                          );
                        }}
                      />
                    </TableCell>
                    <TableCell className="text-blue-500 text-sm">{item.projectNo}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold text-white ${TYPE_BADGE_COLOR[type]}`}>
                          {TYPE_LABEL_MAP[type].slice(0, 2)}
                        </span>
                        <button
                          onClick={() => setSelectedId(item.id)}
                          className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                        >
                          {item.title}
                        </button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${priorityPill.bg} ${priorityPill.color}`}>
                        {item.priority}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${statusPill.bg} ${statusPill.color}`}>
                        {item.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-5 w-5">
                          <AvatarFallback className="bg-primary text-primary-foreground text-[10px]">
                            {getEmployeeName(item.assigneeId)[0]}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{getEmployeeName(item.assigneeId)}</span>
                      </div>
                    </TableCell>
                    {type === 'task' && (
                      <>
                        <TableCell className="text-sm text-muted-foreground">
                          {item.createdAt?.split(' ')[0] || '-'}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {(item as any).dueDate || '-'}
                        </TableCell>
                      </>
                    )}
                    {type === 'defect' && (
                      <>
                        <TableCell>
                          <span className="text-sm">{(item as any).severity}</span>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {item.createdAt?.split(' ')[0] || '-'}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {(item as any).dueDate || '-'}
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* 详情弹窗 */}
      {selectedId && (
        <WorkItemDetailDrawer
          workItemId={selectedId}
          workItemType={type}
          workItems={workItems}
          onClose={() => setSelectedId(null)}
        />
      )}

      {/* 创建表单 */}
      {formVisible && (
        <WorkItemFormModal
          type={type}
          projectId={projectId}
          workItems={workItems}
          onClose={() => setFormVisible(false)}
        />
      )}
    </div>
  );
}
