// AI 提取结果列表组件
import { useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Check, Trash2, Filter } from 'lucide-react';
import { ExtractedItemCard } from './ExtractedItemCard';
import { ExtractedItem, ExtractedItemType, ExtractedItemStatus, extractedItemTypeConfig } from '../types';

interface ExtractedItemListProps {
  items: ExtractedItem[];
  onStatusChange: (id: string, status: ExtractedItemStatus) => void;
  onTypeChange: (id: string, type: ExtractedItemType) => void;
  onScrollToSource: (messageId: string) => void;
}

export function ExtractedItemList({
  items,
  onStatusChange,
  onTypeChange,
  onScrollToSource,
}: ExtractedItemListProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<string>('all');

  // 筛选
  const filteredItems = activeTab === 'all'
    ? items
    : items.filter(item => item.itemType === activeTab);

  // 按置信度排序（高置信度在前）
  const sortedItems = [...filteredItems].sort((a, b) => b.confidence - a.confidence);

  // 统计
  const pendingCount = items.filter(i => i.status === '待审核').length;
  const confirmedCount = items.filter(i => i.status === '已确认').length;

  // 全选/取消全选
  const toggleSelectAll = () => {
    if (selectedIds.size === sortedItems.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(sortedItems.map(i => i.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  // 批量操作
  const handleBatchConfirm = () => {
    selectedIds.forEach(id => onStatusChange(id, '已确认'));
    setSelectedIds(new Set());
  };

  const handleBatchDiscard = () => {
    selectedIds.forEach(id => onStatusChange(id, '已丢弃'));
    setSelectedIds(new Set());
  };

  // 类型统计
  const typeCounts = items.reduce((acc, item) => {
    acc[item.itemType] = (acc[item.itemType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-3">
      {/* 标题栏 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold">Agent 提取结果</h3>
          {pendingCount > 0 && (
            <Badge variant="outline" className="bg-yellow-50 border-yellow-200 text-yellow-700 text-xs">
              {pendingCount} 待审核
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          {selectedIds.size > 0 && (
            <>
              <Button size="sm" variant="outline" className="h-7 text-xs" onClick={handleBatchConfirm}>
                <Check className="h-3 w-3 mr-1" />
                批量确认 ({selectedIds.size})
              </Button>
              <Button size="sm" variant="ghost" className="h-7 text-xs text-red-600" onClick={handleBatchDiscard}>
                <Trash2 className="h-3 w-3 mr-1" />
                批量丢弃
              </Button>
            </>
          )}
          <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={toggleSelectAll}>
            {selectedIds.size === sortedItems.length ? '取消全选' : '全选'}
          </Button>
        </div>
      </div>

      {/* 类型筛选 Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="h-8">
          <TabsTrigger value="all" className="text-xs h-6 px-2">
            全部
            <Badge variant="secondary" className="ml-1 text-[10px] py-0 h-4">{items.length}</Badge>
          </TabsTrigger>
          {Object.entries(typeCounts).map(([type, count]) => (
            <TabsTrigger key={type} value={type} className="text-xs h-6 px-2">
              {type}
              <Badge variant="secondary" className="ml-1 text-[10px] py-0 h-4">{count}</Badge>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* 提取结果列表 */}
      <div className="space-y-2">
        {sortedItems.map(item => (
          <ExtractedItemCard
            key={item.id}
            item={item}
            onStatusChange={onStatusChange}
            onTypeChange={onTypeChange}
            onScrollToSource={onScrollToSource}
            isSelected={selectedIds.has(item.id)}
            onToggleSelect={toggleSelect}
          />
        ))}

        {sortedItems.length === 0 && (
          <div className="text-center text-muted-foreground text-sm py-8">
            暂无提取结果
          </div>
        )}
      </div>
    </div>
  );
}
