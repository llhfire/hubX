// ============================================================
// HubX 统一跟进记录 — 简洁列表组件
// 无卡片、无圆点、无时间轴
// ============================================================

import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import {
  MessageSquare, FileText, CheckCircle, DollarSign, CreditCard,
  Plane, Receipt, RefreshCw, Layout, Palette, Award, Star,
  AlertTriangle, Clock, User, Edit2, Trash2
} from 'lucide-react';
import type { FollowRecord, FollowType, EntityType } from './types';
import { followTypeConfig, followMethodConfig } from './types';

interface FollowTimelineProps {
  records: FollowRecord[];
  entityType: EntityType;
  onEdit?: (record: FollowRecord) => void;
  onDelete?: (recordId: string) => void;
  showEntityInfo?: boolean;
}

// 图标映射
const iconMap: Record<string, React.ReactNode> = {
  MessageSquare: <MessageSquare className="h-4 w-4" />,
  FileText: <FileText className="h-4 w-4" />,
  CheckCircle: <CheckCircle className="h-4 w-4" />,
  DollarSign: <DollarSign className="h-4 w-4" />,
  CreditCard: <CreditCard className="h-4 w-4" />,
  Plane: <Plane className="h-4 w-4" />,
  Receipt: <Receipt className="h-4 w-4" />,
  RefreshCw: <RefreshCw className="h-4 w-4" />,
  Layout: <Layout className="h-4 w-4" />,
  Palette: <Palette className="h-4 w-4" />,
  Award: <Award className="h-4 w-4" />,
  Star: <Star className="h-4 w-4" />,
  AlertTriangle: <AlertTriangle className="h-4 w-4" />,
};

// 颜色映射
const colorMap: Record<string, string> = {
  blue: 'bg-blue-100 text-blue-700',
  purple: 'bg-purple-100 text-purple-700',
  green: 'bg-green-100 text-green-700',
  orange: 'bg-orange-100 text-orange-700',
  cyan: 'bg-cyan-100 text-cyan-700',
  indigo: 'bg-indigo-100 text-indigo-700',
  pink: 'bg-pink-100 text-pink-700',
  yellow: 'bg-yellow-100 text-yellow-700',
  teal: 'bg-teal-100 text-teal-700',
  violet: 'bg-violet-100 text-violet-700',
  emerald: 'bg-emerald-100 text-emerald-700',
  lime: 'bg-lime-100 text-lime-700',
  red: 'bg-red-100 text-red-700',
  gray: 'bg-gray-100 text-gray-700',
};

// 格式化时间
function formatTime(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) {
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  } else if (days === 1) {
    return '昨天 ' + date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  } else if (days < 7) {
    return ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][date.getDay()] +
      ' ' + date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  } else {
    return date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' }) +
      ' ' + date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  }
}

// 格式化下次跟进时间（只显示日期时间，不计算超时）
function formatNextFollowTime(nextFollowTime: string): string {
  const date = new Date(nextFollowTime);
  return date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' }) +
    ' ' + date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
}

export function FollowTimeline({
  records,
  entityType,
  onEdit,
  onDelete,
  showEntityInfo = false
}: FollowTimelineProps) {
  // 按时间倒序排列
  const sortedRecords = [...records].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  if (sortedRecords.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
        <p className="text-sm">暂无跟进记录</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sortedRecords.map((record) => {
        const typeConfig = followTypeConfig[record.type];
        const methodConfig = followMethodConfig[record.method];

        return (
          <div key={record.id} className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
            {/* 头部：类型 + 方式 + 时间 */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={`text-[10px] ${colorMap[typeConfig.color] || colorMap.gray}`}
                >
                  {iconMap[typeConfig.icon]}
                  <span className="ml-1">{typeConfig.label}</span>
                </Badge>
                {methodConfig && (
                  <Badge variant="secondary" className="text-[10px]">
                    {methodConfig.label}
                  </Badge>
                )}
              </div>
              <span className="text-[10px] text-gray-400">
                {formatTime(record.createdAt)}
              </span>
            </div>

            {/* 实体信息（列表页显示） */}
            {showEntityInfo && (
              <div className="text-xs text-gray-500 mb-2">
                {entityType === 'lead' ? '线索' : '项目'}：{record.entityNo} - {record.entityName}
              </div>
            )}

            {/* 跟进内容 */}
            <p className="text-sm text-gray-700 mb-2 whitespace-pre-wrap">
              {record.content}
            </p>

            {/* 线索专属信息 */}
            {entityType === 'lead' && (
              <div className="flex flex-wrap gap-2 mb-2">
                {record.leadStage && (
                  <Badge variant="outline" className="text-[10px]">
                    阶段：{record.leadStage}
                  </Badge>
                )}
                {record.intentLevel && (
                  <Badge variant="outline" className="text-[10px]">
                    意向：{record.intentLevel}
                  </Badge>
                )}
                {record.customerStatus && (
                  <Badge variant="outline" className="text-[10px]">
                    客户状态：{record.customerStatus}
                  </Badge>
                )}
                {record.duration && (
                  <Badge variant="outline" className="text-[10px]">
                    <Clock className="h-3 w-3 mr-1" />
                    {record.duration}分钟
                  </Badge>
                )}
              </div>
            )}

            {/* 项目专属信息 */}
            {entityType === 'project' && (
              <div className="flex flex-wrap gap-2 mb-2">
                {record.projectStatus && (
                  <Badge variant="outline" className="text-[10px]">
                    阶段：{record.projectStatus}
                  </Badge>
                )}
                {record.progress !== undefined && (
                  <Badge variant="outline" className="text-[10px]">
                    进度：{record.progress}%
                  </Badge>
                )}
              </div>
            )}

            {/* 下次跟进时间 */}
            {record.nextFollowTime && (
              <div className="text-xs px-2 py-1 rounded inline-block mb-2 bg-blue-50 text-blue-600">
                <Clock className="h-3 w-3 inline mr-1" />
                下次跟进：{formatNextFollowTime(record.nextFollowTime)}
              </div>
            )}

            {/* 附件 */}
            {record.attachments.length > 0 && (
              <div className="mb-2">
                <div className="flex flex-wrap gap-1">
                  {record.attachments.map(att => (
                    <a
                      key={att.id}
                      href={att.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <FileText className="h-3 w-3" />
                      {att.name}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* 底部：操作人 + 操作按钮 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <User className="h-3 w-3" />
                {record.operatorName}
              </div>
              <div className="flex items-center gap-1">
                {onEdit && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs"
                    onClick={() => onEdit(record)}
                  >
                    <Edit2 className="h-3 w-3 mr-1" />
                    编辑
                  </Button>
                )}
                {onDelete && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs text-red-500 hover:text-red-700"
                    onClick={() => onDelete(record.id)}
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    删除
                  </Button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
