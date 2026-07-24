import { Badge } from '../../../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { trackedSaLeads } from '../mentalModel.mock';
import { LEAD_STAGE_LABELS } from '../types';

const brandColors = {
  blue: 'hsl(221, 83%, 53%)',
  amber: 'hsl(30, 90%, 44%)',
};

const intentTone: Record<string, { text: string; color: string }> = {
  high: { text: '极高', color: brandColors.blue },
  mid: { text: '中等', color: brandColors.amber },
  low: { text: '偏低', color: 'hsl(220, 14%, 55%)' },
  none: { text: '无', color: 'hsl(220, 14%, 55%)' },
};

/**
 * S/A 级线索深度追踪栏（区块 ③ 右栏）。
 *
 * 追踪对象 = 线索，展示名取线索 entity 字段作为客户主体名；
 * 客户主体本身不分 S/A 级（CONTEXT.md 边界已落档）。
 */
export function SaLeadsTrackingPanel() {
  const stageLabel = (stage: string) =>
    LEAD_STAGE_LABELS.find((s) => s.stage === stage)?.label ?? stage;

  return (
    <Card className="h-full flex-1 w-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">S/A 级线索深度追踪</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="flex flex-col gap-3">
          {trackedSaLeads.map((lead) => {
            const intent = intentTone[lead.intentLevel];
            const entityToShow = lead.entity ?? lead.name;
            return (
              <div
                key={lead.id}
                className="p-3 border border-border rounded-lg bg-muted/30"
              >
                {/* 标题行：客户主体名 + 进展阶段 */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-foreground">
                    {entityToShow}
                  </span>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-600">
                    {stageLabel(lead.leadStage)}
                  </Badge>
                </div>

                {/* 跟进人 / 跟进频次 / 意向度 */}
                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-1.5">
                  <span>跟进人「{lead.owner}」</span>
                  <span>·</span>
                  <span>
                    频次 {lead.followFreqPerWeek}次/周 / {lead.trackedDays}天
                  </span>
                  <span>·</span>
                  <span className="font-semibold" style={{ color: intent.color }}>
                    意向{intent.text}
                  </span>
                </div>

                {/* 方案状态 / 客户预算 */}
                <div className="flex items-center gap-1.5 text-xs mb-1.5">
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-600 font-semibold">
                    已推方案 {lead.proposalVersions}版
                  </span>
                  <span className="text-muted-foreground">
                    预算 ¥{(lead.budgetEstimated / 10000).toFixed(0)}万
                  </span>
                </div>

                {/* 最新进展 */}
                <p className="text-xs text-foreground m-0 leading-relaxed italic">
                  "{lead.latestProgress}"
                </p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
