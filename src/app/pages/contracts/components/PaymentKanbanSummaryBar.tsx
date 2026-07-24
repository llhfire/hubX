import { Card, CardContent } from '../../../components/ui/card';
import type { KanbanSummary } from '../paymentUtils';

const SUMMARY_ITEMS: { key: keyof KanbanSummary; label: string; format: (v: number) => string; color: string }[] = [
  { key: 'totalContracts', label: '总合同数', format: (v) => `${v}`, color: '#3b82f6' },
  { key: 'totalReceivable', label: '总应收金额', format: (v) => `¥${(v / 10000).toFixed(1)}万`, color: '#6366f1' },
  { key: 'monthlyCollected', label: '本月已回款', format: (v) => `¥${(v / 10000).toFixed(1)}万`, color: '#10b981' },
  { key: 'overdueAmount', label: '逾期金额', format: (v) => `¥${(v / 10000).toFixed(1)}万`, color: '#ef4444' },
  { key: 'blockedCount', label: '卡点合同数', format: (v) => `${v} 个`, color: '#dc2626' },
  { key: 'blockedAmount', label: '卡点总金额', format: (v) => `¥${(v / 10000).toFixed(1)}万`, color: '#b91c1c' },
  { key: 'upcomingMonthEstimate', label: '预计本月回款', format: (v) => `¥${(v / 10000).toFixed(1)}万`, color: '#f59e0b' },
];

interface Props {
  summary: KanbanSummary;
}

export function PaymentKanbanSummaryBar({ summary }: Props) {
  return (
    <div className="grid grid-cols-7 gap-3 mb-4">
      {SUMMARY_ITEMS.map((item) => (
        <Card
          key={item.key}
          className="border-l-[3px]"
          style={{ borderLeftColor: item.color }}
        >
          <CardContent className="pt-4 pb-3">
            <div className="text-xs text-muted-foreground mb-1">{item.label}</div>
            <div className="text-lg font-bold" style={{ color: item.color }}>
              {item.format(summary[item.key] as number)}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
