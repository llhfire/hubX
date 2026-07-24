import { Card, CardContent } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Progress } from '../../../components/ui/progress';
import { User } from 'lucide-react';
import type { Contract, PaymentStatus } from '../types';
import { computePaymentStatus, getReceivedAmount, getLatestDunning } from '../paymentUtils';
import { BLOCKER_TYPE_LABELS } from '../types';

const STATUS_COLORS: Record<PaymentStatus, string> = {
  normal: '#3b82f6',
  upcoming: '#f59e0b',
  overdue: '#ef4444',
  blocked: '#dc2626',
  settled: '#10b981',
};

interface Props {
  contract: Contract;
  onClick: (contract: Contract) => void;
}

export function PaymentKanbanCard({ contract, onClick }: Props) {
  const status = computePaymentStatus(contract);
  const total = contract.current.totalAmount;
  const received = getReceivedAmount(contract);
  const pct = total > 0 ? Math.round((received / total) * 100) : 0;
  const latestDunning = getLatestDunning(contract.dunningRecords ?? []);
  const activeBlockers = (contract.paymentBlockers ?? []).filter(b => !b.resolvedAt);

  const pendingPlan = contract.current.paymentPlans?.find((_plan, i) => {
    let acc = 0;
    for (let j = 0; j <= i; j++) acc += (contract.current.paymentPlans?.[j]?.amount ?? 0);
    return received < acc;
  });

  return (
    <Card
      className="mb-3 cursor-pointer hover:shadow-md transition-shadow border-l-[3px]"
      style={{ borderLeftColor: STATUS_COLORS[status] }}
      onClick={() => onClick(contract)}
    >
      <CardContent className="pt-4 pb-3 space-y-2">
        <div className="font-semibold text-[13px]">
          {contract.contractNo}
        </div>
        <div className="text-xs text-muted-foreground">
          {contract.current.customerName}
        </div>

        <div>
          <Progress value={pct} className="h-1.5" />
          <div className="flex justify-between text-[11px] mt-0.5">
            <span style={{ color: STATUS_COLORS[status] }} className="font-semibold">
              &yen;{(received / 10000).toFixed(1)}万 / &yen;{(total / 10000).toFixed(1)}万
            </span>
            <span className="text-muted-foreground">{pct}%</span>
          </div>
        </div>

        {pendingPlan && status !== 'settled' && (
          <div className="text-[11px] text-muted-foreground">
            下期：&yen;{(pendingPlan.amount / 10000).toFixed(1)}万  {pendingPlan.expectedDate}
          </div>
        )}

        {activeBlockers.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {activeBlockers.map(b => (
              <Badge key={b.id} variant="destructive" className="text-[10px]">
                {BLOCKER_TYPE_LABELS[b.type]}
              </Badge>
            ))}
          </div>
        )}

        {latestDunning && (
          <div className="text-[10px] text-muted-foreground">
            上次催款：{latestDunning.date}  {latestDunning.method}
          </div>
        )}

        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
          <User className="size-3" />
          {contract.createdBy}
        </div>
      </CardContent>
    </Card>
  );
}
