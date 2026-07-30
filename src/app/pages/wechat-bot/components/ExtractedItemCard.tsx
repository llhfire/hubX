// 单条 AI 提取结果卡片
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Textarea } from '../../../components/ui/textarea';
import { FileText, CheckSquare, Bug, Clock, FileText as SummaryIcon, Check, X, Edit3, Trash2, MessageSquare } from 'lucide-react';
import { ExtractedItem, ExtractedItemType, ExtractedItemStatus, extractedItemTypeConfig, extractedItemStatusConfig } from '../types';
import { useState } from 'react';

interface ExtractedItemCardProps {
  item: ExtractedItem;
  onStatusChange: (id: string, status: ExtractedItemStatus) => void;
  onTypeChange: (id: string, type: ExtractedItemType) => void;
  onScrollToSource: (messageId: string) => void;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
}

const typeIcons: Record<ExtractedItemType, typeof FileText> = {
  '需求': FileText,
  '任务': CheckSquare,
  '缺陷': Bug,
  '待办': Clock,
  '摘要': SummaryIcon,
};

export function ExtractedItemCard({
  item,
  onStatusChange,
  onTypeChange,
  onScrollToSource,
  isSelected,
  onToggleSelect,
}: ExtractedItemCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editNote, setEditNote] = useState(item.reviewNote || '');

  const config = extractedItemTypeConfig[item.itemType];
  const statusConfig = extractedItemStatusConfig[item.status];
  const Icon = typeIcons[item.itemType];

  const confidenceColor = item.confidence >= 0.9 ? 'text-green-600' : item.confidence >= 0.8 ? 'text-blue-600' : 'text-orange-600';

  const handleConfirm = () => {
    onStatusChange(item.id, '已确认');
  };

  const handleDiscard = () => {
    onStatusChange(item.id, '已丢弃');
  };

  const handleSourceClick = () => {
    if (item.sourceMessageIds.length > 0) {
      onScrollToSource(item.sourceMessageIds[0]);
    }
  };

  return (
    <Card className={`transition-all ${isSelected ? 'ring-2 ring-blue-500' : ''} ${item.status === '已丢弃' ? 'opacity-50' : ''}`}>
      <CardContent className="p-3 space-y-2">
        {/* 头部：类型 + 置信度 + 状态 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onToggleSelect(item.id)}
              className="h-3.5 w-3.5 rounded border-gray-300"
            />
            <Badge variant="outline" className={`${config.color === 'blue' ? 'bg-blue-50 border-blue-200 text-blue-700' : config.color === 'green' ? 'bg-green-50 border-green-200 text-green-700' : config.color === 'red' ? 'bg-red-50 border-red-200 text-red-700' : config.color === 'orange' ? 'bg-orange-50 border-orange-200 text-orange-700' : 'bg-purple-50 border-purple-200 text-purple-700'} text-xs`}>
              <Icon className="h-3 w-3 mr-1" />
              {item.itemType}
            </Badge>
            <span className={`text-xs font-medium ${confidenceColor}`}>
              置信度: {(item.confidence * 100).toFixed(0)}%
            </span>
          </div>
          <Badge
            variant="outline"
            className={`text-xs ${statusConfig.color === 'yellow' ? 'bg-yellow-50 border-yellow-200 text-yellow-700' : statusConfig.color === 'blue' ? 'bg-blue-50 border-blue-200 text-blue-700' : statusConfig.color === 'green' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-gray-50 border-gray-200 text-gray-700'}`}
          >
            {statusConfig.label}
          </Badge>
        </div>

        {/* 标题 */}
        <h4 className="text-sm font-medium leading-snug">{item.title}</h4>

        {/* 描述 */}
        <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>

        {/* 来源 */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-5 px-1.5 text-xs text-muted-foreground hover:text-foreground"
            onClick={handleSourceClick}
          >
            <MessageSquare className="h-3 w-3 mr-1" />
            来源: {item.sourceSummary}
          </Button>
        </div>

        {/* 编辑区域 */}
        {isEditing && (
          <div className="space-y-2 pt-1">
            <Select value={item.itemType} onValueChange={(v) => onTypeChange(item.id, v as ExtractedItemType)}>
              <SelectTrigger className="h-7 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="需求">需求</SelectItem>
                <SelectItem value="任务">任务</SelectItem>
                <SelectItem value="缺陷">缺陷</SelectItem>
                <SelectItem value="待办">待办</SelectItem>
                <SelectItem value="摘要">摘要</SelectItem>
              </SelectContent>
            </Select>
            <Textarea
              value={editNote}
              onChange={(e) => setEditNote(e.target.value)}
              placeholder="审核备注..."
              className="text-xs min-h-[60px]"
            />
          </div>
        )}

        {/* 操作按钮 */}
        {(item.status === '待审核' || item.status === '已确认') && (
          <div className="flex items-center gap-1.5 pt-1">
            <Button size="sm" className="h-7 text-xs" onClick={handleConfirm}>
              <Check className="h-3 w-3 mr-1" />
              确认入库
            </Button>
            <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => setIsEditing(!isEditing)}>
              <Edit3 className="h-3 w-3 mr-1" />
              {isEditing ? '收起' : '修改'}
            </Button>
            <Button size="sm" variant="ghost" className="h-7 text-xs text-red-600 hover:text-red-700 hover:bg-red-50" onClick={handleDiscard}>
              <Trash2 className="h-3 w-3 mr-1" />
              丢弃
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
