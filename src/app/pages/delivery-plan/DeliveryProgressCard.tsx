// src/app/pages/delivery-plan/DeliveryProgressCard.tsx

import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import type { DeliveryPlan } from './types';
import { PHASE_COLORS, PHASE_COLORS_LIGHT, SOP_PHASES } from './constants';
import { calcOverallCompletion, calcPhaseCompletion } from './utils';
import { initialDeliveryPlans } from './mockData';

interface DeliveryProgressCardProps {
  projectId: string;
  onClick: () => void;
}

/** 空状态：全灰环 + 0% */
function buildEmptyPieData() {
  return SOP_PHASES.map((p) => ({
    name: p.phaseName,
    value: 1,
    fill: PHASE_COLORS_LIGHT[p.phaseNo],
  }));
}

/** 有计划时：每个板块生成 completed + remaining 两段 */
function buildProgressPieData(plan: DeliveryPlan) {
  return plan.phases.flatMap((phase) => {
    const phaseSteps = plan.steps.filter((s) => s.phaseId === phase.id);
    const completion = calcPhaseCompletion(phaseSteps);
    return [
      {
        name: `${phase.phaseName}完成`,
        value: Math.max(completion, 0.001),
        fill: PHASE_COLORS[phase.phaseNo],
      },
      {
        name: `${phase.phaseName}剩余`,
        value: Math.max(1 - completion, 0.001),
        fill: PHASE_COLORS_LIGHT[phase.phaseNo],
      },
    ];
  });
}

export function DeliveryProgressCard({ projectId, onClick }: DeliveryProgressCardProps) {
  const plan = initialDeliveryPlans[projectId];

  const { pieData, completionPct } = useMemo(() => {
    if (!plan) {
      return { pieData: buildEmptyPieData(), completionPct: 0 };
    }
    return {
      pieData: buildProgressPieData(plan),
      completionPct: Math.round(calcOverallCompletion(plan.phases, plan.steps) * 100),
    };
  }, [plan]);

  return (
    <Card className="cursor-pointer transition-colors hover:bg-muted/50" onClick={onClick}>
      <CardHeader>
        <CardTitle>交付进度</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative flex w-full justify-center">
          <ResponsiveContainer width="100%" height={100}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                cx="50%"
                cy="50%"
                innerRadius={32}
                outerRadius={48}
                startAngle={90}
                endAngle={-270}
                stroke="none"
                animationBegin={0}
                animationDuration={600}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* 中心百分比 */}
          <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
            <div className="text-lg font-bold leading-snug text-foreground">
              {completionPct}%
            </div>
          </div>
        </div>

        {/* 图例 */}
        <div className="mt-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
          {SOP_PHASES.map((p) => (
            <div key={p.phaseNo} className="flex items-center gap-1">
              <span
                className="inline-block h-2 w-2 shrink-0 rounded-full"
                style={{ background: plan ? PHASE_COLORS[p.phaseNo] : 'var(--color-text-4)' }}
              />
              <span className="whitespace-nowrap text-[11px] text-muted-foreground">
                {p.phaseName}
              </span>
            </div>
          ))}
        </div>

        {/* 空状态提示 */}
        {!plan && (
          <div className="mt-2 text-center">
            <span className="text-xs text-muted-foreground">
              点击生成交付计划
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
