import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { FUNNEL_STAGES } from '../types';

const brandColors = {
  unreached: 'hsl(220, 14%, 60%)',
  contacted: 'hsl(221, 83%, 53%)',
  following: 'hsl(221, 83%, 53%)',
  closing: 'hsl(30, 90%, 44%)',
  lost: 'hsl(0, 78%, 50%)',
};

/**
 * 线索推进漏斗（区块 ③）。
 *
 * 展示数据来自 FUNNEL_STAGES 独立展示值（与 dashboardLeads 的 leadStage 聚合
 * 不强约束 1:1——详见 ADR-0003 与 CONTEXT.md「线索推进漏斗」边界+plan 验证清单）。
 *
 * 形态：横向递减条形（未触达 88 → 初步 67 → 跟进中 32 → 促成阶段 12）+
 * 「已流失 102」末尾单列并列（已流失数 > 未触达数，经典倒三角会破形）。
 */
export function LeadStageFunnel() {
  const mainStages = useMemo(
    () => FUNNEL_STAGES.filter((s) => s.stage !== 'lost'),
    [],
  );
  const lostStage = useMemo(
    () => FUNNEL_STAGES.find((s) => s.stage === 'lost')!,
    [],
  );
  const maxCount = Math.max(...mainStages.map((s) => s.count));

  return (
    <Card className="h-full flex-1 w-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <CardTitle className="text-sm font-medium">跟进过程漏斗</CardTitle>
          <Badge variant="secondary" className="text-[11px] font-medium bg-blue-100 text-blue-600">
            Stage Monitoring Active
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        {/* 横向漏斗主体：4 段递减条形 */}
        <div className="flex flex-col gap-2 mb-4">
          {mainStages.map((stage) => {
            const widthPercent = maxCount > 0 ? (stage.count / maxCount) * 100 : 0;
            const isHighlighted = !!stage.highlight;
            return (
              <div key={stage.stage} className="flex items-center gap-3">
                <span className="w-16 text-xs text-muted-foreground flex-shrink-0 text-right">
                  {stage.label}
                </span>
                <div className="flex-1 h-7 rounded overflow-hidden">
                  <div
                    className="h-full flex items-center pl-2.5 rounded text-white text-xs font-semibold transition-all duration-300"
                    style={{
                      width: `${widthPercent}%`,
                      minWidth: 32,
                      background: isHighlighted
                        ? brandColors[stage.stage as keyof typeof brandColors]
                        : `${brandColors[stage.stage as keyof typeof brandColors]}CC`,
                    }}
                  >
                    {stage.count}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 已流失单列并列（参考图样：独立成一行，与漏斗主体脱离） */}
        <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <span className="text-xs font-medium text-red-700">
            {lostStage.label}
          </span>
          <span className="text-xl font-bold text-red-500">
            {lostStage.count}
          </span>
          <span className="text-xs text-muted-foreground">已入垃圾线索池累计</span>
        </div>
      </CardContent>
    </Card>
  );
}
