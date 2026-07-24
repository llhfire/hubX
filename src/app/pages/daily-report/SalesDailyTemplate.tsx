// src/app/pages/daily-report/SalesDailyTemplate.tsx

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Textarea } from '../../components/ui/textarea';
import { LeadTrackingItem, SalesReportContent } from './types';
import { getSalesDailyLeadsData } from './templateConfig';

interface Props {
  userId: string;
  date: Date;
  initialContent?: SalesReportContent;
  onChange: (content: SalesReportContent) => void;
}

function getSalesTemplateState(
  userId: string,
  date: Date,
  initialContent?: SalesReportContent,
) {
  if (initialContent) {
    return {
      leadTracking: initialContent['lead-tracking'] || [],
      assistanceNeeded: initialContent['assistance-needed'] || '',
      tomorrowPlan: initialContent['tomorrow-plan'] || '',
    };
  }

  return {
    leadTracking: getSalesDailyLeadsData(userId, date),
    assistanceNeeded: '',
    tomorrowPlan: '',
  };
}

export function SalesDailyTemplate({ userId, date, initialContent, onChange }: Props) {
  const initialState = getSalesTemplateState(userId, date, initialContent);
  const [leadTracking, setLeadTracking] = useState<LeadTrackingItem[]>(initialState.leadTracking);
  const [assistanceNeeded, setAssistanceNeeded] = useState(initialState.assistanceNeeded);
  const [tomorrowPlan, setTomorrowPlan] = useState(initialState.tomorrowPlan);

  // 同步外部初始内容/新会话数据
  useEffect(() => {
    const nextState = getSalesTemplateState(userId, date, initialContent);
    setLeadTracking(nextState.leadTracking);
    setAssistanceNeeded(nextState.assistanceNeeded);
    setTomorrowPlan(nextState.tomorrowPlan);
  }, [userId, date, initialContent]);

  // 更新内容 - 使用 debounce 避免频繁触发
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }

    updateTimeoutRef.current = setTimeout(() => {
      onChange({
        'lead-tracking': leadTracking,
        'assistance-needed': assistanceNeeded,
        'tomorrow-plan': tomorrowPlan,
      });
    }, 100);

    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, [leadTracking, assistanceNeeded, tomorrowPlan, onChange]);

  // 更新线索项
  const updateLeadItem = (index: number, field: 'statusChanges' | 'followRecords', value: string) => {
    const newLeads = [...leadTracking];
    if (field === 'statusChanges') {
      newLeads[index] = { ...newLeads[index], statusChanges: [value] };
    } else {
      newLeads[index] = { ...newLeads[index], followRecords: [value] };
    }
    setLeadTracking(newLeads);
  };

  // 级别颜色映射
  const getLevelVariant = (level: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      S: 'destructive',
      A: 'default',
      B: 'secondary',
      C: 'outline',
    };
    return variants[level] || 'outline';
  };

  return (
    <div className="flex flex-col gap-4">
      {/* 线索跟进情况 */}
      <div>
        <p className="font-semibold mb-2">线索跟进情况</p>
        {leadTracking.length === 0 ? (
          <Card className="bg-muted">
            <CardContent className="p-3">
              <span className="text-muted-foreground text-sm">今日暂无线索跟进记录</span>
            </CardContent>
          </Card>
        ) : (
          <div className="flex flex-col gap-3">
            {leadTracking.map((item, index) => (
              <Card key={item.leadId}>
                <CardContent className="p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={getLevelVariant(item.level)}>{item.level}</Badge>
                    <span className="font-semibold text-sm">{item.leadName}</span>
                  </div>
                  <div className="mb-2">
                    <span className="text-muted-foreground text-xs">状态变更：</span>
                    {item.statusChanges.length > 0 ? (
                      <span className="text-sm">{item.statusChanges.join(', ')}</span>
                    ) : (
                      <span className="text-muted-foreground text-sm">无</span>
                    )}
                  </div>
                  <div>
                    <span className="text-muted-foreground text-xs">跟进记录：</span>
                    <Textarea
                      value={item.followRecords.join('\n')}
                      onChange={(e) => updateLeadItem(index, 'followRecords', e.target.value)}
                      placeholder="请输入跟进记录..."
                      rows={2}
                      className="mt-1"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* 需协助事项 */}
      <div>
        <p className="font-semibold mb-2">需协助事项</p>
        <Textarea
          value={assistanceNeeded}
          onChange={(e) => setAssistanceNeeded(e.target.value)}
          placeholder="请输入需要协助的事项..."
          rows={3}
        />
      </div>

      {/* 明日工作计划 */}
      <div>
        <p className="font-semibold mb-2">
          明日工作计划 <span className="text-red-500">*</span>
        </p>
        <Textarea
          value={tomorrowPlan}
          onChange={(e) => setTomorrowPlan(e.target.value)}
          placeholder="请输入明日工作计划（必填）..."
          rows={3}
        />
      </div>
    </div>
  );
}
