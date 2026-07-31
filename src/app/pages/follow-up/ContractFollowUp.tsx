// ============================================================
// HubX 合同跟进 — 从线索和项目跟进中抽取关键节点
// 简洁列表风格，与 FollowTimeline 一致
// ============================================================

import { useMemo } from 'react';
import { Badge } from '../../components/ui/badge';
import {
  FileText, CheckCircle, CreditCard, AlertTriangle,
  Star, Award, Layout, Palette, User
} from 'lucide-react';
import type { FollowRecord } from './types';

interface ContractFollowUpProps {
  leadFollowUps?: FollowRecord[];
  projectFollowUps?: FollowRecord[];
  contractInfo?: {
    id: string;
    name: string;
    signingDate?: string;
    totalAmount?: number;
  };
}

type ContractMilestoneType =
  | 'contract_signed'
  | 'payment_received'
  | 'requirement_change'
  | 'ui_confirm'
  | 'prototype_confirm'
  | 'acceptance_confirm'
  | 'final_acceptance'
  | 'project_notice'
  | 'dunning'
  | 'other';

const milestoneConfig: Record<ContractMilestoneType, {
  label: string;
  color: string;
  icon: React.ReactNode;
  source: 'lead' | 'project' | 'both';
}> = {
  contract_signed: { label: '合同签订', color: 'green', icon: <CheckCircle className="h-4 w-4" />, source: 'lead' },
  payment_received: { label: '收款确认', color: 'blue', icon: <CreditCard className="h-4 w-4" />, source: 'lead' },
  requirement_change: { label: '需求变更', color: 'orange', icon: <FileText className="h-4 w-4" />, source: 'project' },
  ui_confirm: { label: 'UI确认', color: 'cyan', icon: <Palette className="h-4 w-4" />, source: 'project' },
  prototype_confirm: { label: '原型确认', color: 'teal', icon: <Layout className="h-4 w-4" />, source: 'project' },
  acceptance_confirm: { label: '验收确认', color: 'purple', icon: <Award className="h-4 w-4" />, source: 'project' },
  final_acceptance: { label: '终验确认', color: 'emerald', icon: <Star className="h-4 w-4" />, source: 'project' },
  project_notice: { label: '项目通知', color: 'red', icon: <AlertTriangle className="h-4 w-4" />, source: 'project' },
  dunning: { label: '催款记录', color: 'red', icon: <CreditCard className="h-4 w-4" />, source: 'both' },
  other: { label: '其他', color: 'gray', icon: <FileText className="h-4 w-4" />, source: 'both' },
};

const colorMap: Record<string, string> = {
  blue: 'bg-blue-100 text-blue-700',
  green: 'bg-green-100 text-green-700',
  orange: 'bg-orange-100 text-orange-700',
  cyan: 'bg-cyan-100 text-cyan-700',
  teal: 'bg-teal-100 text-teal-700',
  purple: 'bg-purple-100 text-purple-700',
  emerald: 'bg-emerald-100 text-emerald-700',
  red: 'bg-red-100 text-red-700',
  gray: 'bg-gray-100 text-gray-700',
};

function extractMilestones(
  leadFollowUps: FollowRecord[],
  projectFollowUps: FollowRecord[]
): Array<{
  id: string;
  type: ContractMilestoneType;
  title: string;
  content: string;
  date: string;
  author: string;
  source: 'lead' | 'project';
}> {
  const milestones: Array<{
    id: string;
    type: ContractMilestoneType;
    title: string;
    content: string;
    date: string;
    author: string;
    source: 'lead' | 'project';
  }> = [];

  leadFollowUps.forEach(record => {
    if (record.type === '合同签订') {
      milestones.push({ id: record.id, type: 'contract_signed', title: '合同签订', content: record.content, date: record.createdAt, author: record.operatorName, source: 'lead' });
    } else if (record.type === '催款') {
      milestones.push({ id: record.id, type: 'dunning', title: '催款记录', content: record.content, date: record.createdAt, author: record.operatorName, source: 'lead' });
    }
  });

  projectFollowUps.forEach(record => {
    if (record.type === '需求变更') {
      milestones.push({ id: record.id, type: 'requirement_change', title: '需求变更', content: record.content, date: record.createdAt, author: record.operatorName, source: 'project' });
    } else if (record.type === 'UI确认') {
      milestones.push({ id: record.id, type: 'ui_confirm', title: 'UI确认', content: record.content, date: record.createdAt, author: record.operatorName, source: 'project' });
    } else if (record.type === '原型确认') {
      milestones.push({ id: record.id, type: 'prototype_confirm', title: '原型确认', content: record.content, date: record.createdAt, author: record.operatorName, source: 'project' });
    } else if (record.type === '验收确认') {
      milestones.push({ id: record.id, type: 'acceptance_confirm', title: '验收确认', content: record.content, date: record.createdAt, author: record.operatorName, source: 'project' });
    } else if (record.type === '终验确认') {
      milestones.push({ id: record.id, type: 'final_acceptance', title: '终验确认', content: record.content, date: record.createdAt, author: record.operatorName, source: 'project' });
    } else if (record.type === '项目通知') {
      milestones.push({ id: record.id, type: 'project_notice', title: '项目通知', content: record.content, date: record.createdAt, author: record.operatorName, source: 'project' });
    } else if (record.type === '催款') {
      milestones.push({ id: record.id, type: 'dunning', title: '催款记录', content: record.content, date: record.createdAt, author: record.operatorName, source: 'project' });
    }
  });

  return milestones.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
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

export function ContractFollowUp({
  leadFollowUps = [],
  projectFollowUps = [],
  contractInfo,
}: ContractFollowUpProps) {
  const milestones = useMemo(
    () => extractMilestones(leadFollowUps, projectFollowUps),
    [leadFollowUps, projectFollowUps]
  );

  if (milestones.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
        <p className="text-sm">暂无关键节点记录</p>
        <p className="text-xs mt-1">跟进记录中的关键节点将自动同步到这里</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {milestones.map((milestone) => {
        const config = milestoneConfig[milestone.type];

        return (
          <div key={milestone.id} className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
            {/* 头部：类型 + 来源 + 时间 */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={`text-[10px] ${colorMap[config.color] || colorMap.gray}`}
                >
                  {config.icon}
                  <span className="ml-1">{config.label}</span>
                </Badge>
                <Badge
                  variant="secondary"
                  className={`text-[10px] ${
                    milestone.source === 'lead'
                      ? 'bg-green-50 text-green-600'
                      : 'bg-blue-50 text-blue-600'
                  }`}
                >
                  {milestone.source === 'lead' ? '线索跟进' : '项目跟进'}
                </Badge>
              </div>
              <span className="text-[10px] text-gray-400">
                {formatTime(milestone.date)}
              </span>
            </div>

            {/* 内容 */}
            <p className="text-sm text-gray-700 mb-2 whitespace-pre-wrap">
              {milestone.content}
            </p>

            {/* 底部：操作人 */}
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <User className="h-3 w-3" />
              {milestone.author}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ContractFollowUp;
