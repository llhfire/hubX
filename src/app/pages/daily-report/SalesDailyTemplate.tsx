// src/app/pages/daily-report/SalesDailyTemplate.tsx

import { useState, useEffect, useRef } from 'react';
import { Input, Card, Typography, Tag } from '@arco-design/web-react';
import { LeadTrackingItem, SalesReportContent } from './types';
import { getSalesDailyLeadsData } from './templateConfig';

const { Text } = Typography;

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
  const getLevelColor = (level: string) => {
    const colors: Record<string, string> = { S: 'red', A: 'orange', B: 'blue', C: 'green' };
    return colors[level] || 'default';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* 线索跟进情况 */}
      <div>
        <div style={{ fontWeight: 600, marginBottom: 8 }}>线索跟进情况</div>
        {leadTracking.length === 0 ? (
          <Card size="small" style={{ background: 'var(--color-fill-2)' }}>
            <Text type="secondary">今日暂无线索跟进记录</Text>
          </Card>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {leadTracking.map((item, index) => (
              <Card key={item.leadId} size="small">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <Tag color={getLevelColor(item.level)}>{item.level}</Tag>
                  <Text strong>{item.leadName}</Text>
                </div>
                <div style={{ marginBottom: 8 }}>
                  <Text type="secondary" style={{ fontSize: 12 }}>状态变更：</Text>
                  {item.statusChanges.length > 0 ? (
                    <span>{item.statusChanges.join(', ')}</span>
                  ) : (
                    <span style={{ color: 'var(--color-text-4)' }}>无</span>
                  )}
                </div>
                <div>
                  <Text type="secondary" style={{ fontSize: 12 }}>跟进记录：</Text>
                  <Input.TextArea
                    value={item.followRecords.join('\n')}
                    onChange={(value) => updateLeadItem(index, 'followRecords', value)}
                    placeholder="请输入跟进记录..."
                    autoSize={{ minRows: 2, maxRows: 4 }}
                    style={{ marginTop: 4 }}
                  />
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* 需协助事项 */}
      <div>
        <div style={{ fontWeight: 600, marginBottom: 8 }}>需协助事项</div>
        <Input.TextArea
          value={assistanceNeeded}
          onChange={(value) => setAssistanceNeeded(value)}
          placeholder="请输入需要协助的事项..."
          autoSize={{ minRows: 3, maxRows: 5 }}
        />
      </div>

      {/* 明日工作计划 */}
      <div>
        <div style={{ fontWeight: 600, marginBottom: 8 }}>
          明日工作计划 <span style={{ color: 'red' }}>*</span>
        </div>
        <Input.TextArea
          value={tomorrowPlan}
          onChange={(value) => setTomorrowPlan(value)}
          placeholder="请输入明日工作计划（必填）..."
          autoSize={{ minRows: 3, maxRows: 5 }}
        />
      </div>
    </div>
  );
}
