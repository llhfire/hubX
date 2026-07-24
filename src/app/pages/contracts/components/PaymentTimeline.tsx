import { CheckCircle, AlertCircle, Clock } from 'lucide-react';
import type { Contract } from '../types';
import { getReceivedAmount } from '../paymentUtils';
import { BLOCKER_TYPE_LABELS } from '../types';

interface Props {
  contract: Contract;
}

export function PaymentTimeline({ contract }: Props) {
  const received = getReceivedAmount(contract);
  const plans = contract.current.paymentPlans ?? [];
  const blockers = contract.paymentBlockers ?? [];

  let accumulatedPlan = 0;

  return (
    <div className="relative pl-6 space-y-0">
      {/* 签约节点 */}
      <TimelineEntry
        icon={<CheckCircle className="size-4 text-blue-500" />}
        label={contract.current.signDate}
      >
        签约 &middot; &yen;{(contract.current.totalAmount / 10000).toFixed(1)}万
      </TimelineEntry>

      {/* 付款节点 */}
      {plans.map((plan) => {
        accumulatedPlan += plan.amount;
        const planCols = (contract.collectionRecords ?? []).filter((col) => {
          const colDate = new Date(col.date);
          const planDate = new Date(plan.expectedDate);
          return colDate <= planDate;
        });
        const planReceived = planCols.reduce((s, c) => s + c.amount, 0);
        const isPaid = planReceived >= plan.amount;
        const isOverdue = !isPaid && new Date() > new Date(new Date(plan.expectedDate).getTime() + 7 * 86400000);
        const relatedBlockers = blockers.filter(b => !b.resolvedAt);

        return (
          <TimelineEntry
            key={plan.period}
            icon={
              isPaid ? (
                <CheckCircle className="size-4 text-emerald-500" />
              ) : isOverdue ? (
                <AlertCircle className="size-4 text-red-500" />
              ) : (
                <Clock className="size-4 text-amber-500" />
              )
            }
            label={plan.expectedDate}
          >
            {plan.period === 1 ? '一期' : plan.period === 2 ? '二期' : plan.period === 3 ? '三期' : `${plan.period}期`}
            付款 &yen;{(plan.amount / 10000).toFixed(1)}万（{plan.percentage}%）
            {isPaid && planCols.length > 0 && (
              <div className="text-emerald-500 text-[11px]">
                实际到账 &yen;{(planReceived / 10000).toFixed(0)}万
              </div>
            )}
            {isOverdue && (
              <div className="text-red-500 text-[11px]">
                逾期 {Math.floor((Date.now() - new Date(plan.expectedDate).getTime()) / 86400000)} 天
              </div>
            )}
            {relatedBlockers.map(b => (
              <div key={b.id} className="text-red-600 text-[10px] mt-0.5">
                {BLOCKER_TYPE_LABELS[b.type]}：{b.title}
              </div>
            ))}
          </TimelineEntry>
        );
      })}
    </div>
  );
}

function TimelineEntry({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="relative pb-6 last:pb-0">
      {/* 连接线 */}
      <div className="absolute left-[7px] top-5 h-full w-0.5 bg-border" />
      {/* 图标 */}
      <div className="absolute left-0 top-0">{icon}</div>
      {/* 内容 */}
      <div className="ml-2">
        <div className="text-xs text-muted-foreground mb-0.5">{label}</div>
        <div className="text-sm">{children}</div>
      </div>
    </div>
  );
}
