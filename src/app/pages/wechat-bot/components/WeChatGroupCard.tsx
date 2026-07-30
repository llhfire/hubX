// 群聊智能分析卡片（嵌入线索/项目详情页）
import { useNavigate } from 'react-router';
import { Card, CardContent } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { MessageSquare, FileText, CheckSquare, Bug, Clock, ArrowRight, Users, RefreshCw } from 'lucide-react';
import { ActivityIndicator } from './ActivityIndicator';
import { WeChatGroup, ExtractedItem, ActivityLevel } from '../types';

interface WeChatGroupCardProps {
  group: WeChatGroup;
  extractedItems: ExtractedItem[];
  /** 详情页路由前缀，如 /leads 或 /projects */
  basePath: string;
  /** 关联实体ID（线索ID或项目ID） */
  entityId: string;
}

function formatTime(timeStr?: string): string {
  if (!timeStr) return '-';
  return new Date(timeStr).toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export function WeChatGroupCard({ group, extractedItems, basePath, entityId }: WeChatGroupCardProps) {
  const navigate = useNavigate();

  // 统计各类型提取条目数量
  const stats = extractedItems.reduce(
    (acc, item) => {
      if (item.status === '待审核' || item.status === '已确认') {
        acc[item.itemType] = (acc[item.itemType] || 0) + 1;
      }
      return acc;
    },
    {} as Record<string, number>
  );

  const totalPending = Object.values(stats).reduce((a, b) => a + b, 0);

  const handleClick = () => {
    navigate(`${basePath}/${entityId}/chat-analysis`);
  };

  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={handleClick}
    >
      <CardContent className="py-3 px-4">
        {/* 第一行：标题（微信群标识） + 活跃度 */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 min-w-0">
            <MessageSquare className="h-4 w-4 text-green-600 shrink-0" />
            <Badge variant="outline" className="text-[10px] py-0 h-4 bg-green-50 border-green-200 text-green-700 shrink-0">
              微信群
            </Badge>
            <span className="text-sm font-medium truncate">{group.groupName}</span>
            <Badge variant="outline" className="text-xs shrink-0">
              <Users className="h-3 w-3 mr-1" />
              {group.memberCount}人
            </Badge>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <ActivityIndicator level={group.activityLevel} showLabel={false} size="sm" />
            <span className="text-xs text-muted-foreground">{group.activityLevel}</span>
          </div>
        </div>

        {/* 第二行：消息统计 + 提取统计 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>今日 <strong className="text-foreground">{group.todayMsgCount}</strong> 条消息</span>
            {totalPending > 0 && (
              <span className="text-orange-600 font-medium">{totalPending} 条待审核</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {stats['需求'] && (
              <Badge variant="secondary" className="text-xs py-0">
                <FileText className="h-3 w-3 mr-1 text-blue-500" />
                需求 {stats['需求']}
              </Badge>
            )}
            {stats['任务'] && (
              <Badge variant="secondary" className="text-xs py-0">
                <CheckSquare className="h-3 w-3 mr-1 text-green-500" />
                任务 {stats['任务']}
              </Badge>
            )}
            {stats['缺陷'] && (
              <Badge variant="secondary" className="text-xs py-0">
                <Bug className="h-3 w-3 mr-1 text-red-500" />
                缺陷 {stats['缺陷']}
              </Badge>
            )}
            {stats['待办'] && (
              <Badge variant="secondary" className="text-xs py-0">
                <Clock className="h-3 w-3 mr-1 text-orange-500" />
                待办 {stats['待办']}
              </Badge>
            )}
          </div>
        </div>

        {/* 第三行：采集时间信息 */}
        <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-gray-100">
          <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <RefreshCw className="h-3 w-3" />
              上次采集: {formatTime(group.lastSyncTime)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              下次采集: {formatTime(group.nextSyncTime)}
            </span>
          </div>
          <Button variant="ghost" size="sm" className="h-5 text-[10px] text-blue-600 hover:text-blue-700 p-0">
            查看详情 <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
