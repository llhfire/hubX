import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { dashboardLeads, getOverdueSaWarnings } from '../mentalModel.mock';
import { computeGrade, type SabcGrade } from '../types';

const gradeMeta: Record<SabcGrade, { label: string; desc: string; color: string; bg: string }> = {
  S: { label: 'S', desc: '战略客户 · 重点关注', color: 'hsl(48, 96%, 48%)', bg: 'hsl(48 96% 48% / 0.10)' },
  A: { label: 'A', desc: '核心客户 · 高效转化', color: 'hsl(221, 83%, 53%)', bg: 'hsl(221 83% 53% / 0.10)' },
  B: { label: 'B', desc: '成长客户 · 持续维护', color: 'hsl(142, 76%, 36%)', bg: 'hsl(142 76% 36% / 0.10)' },
  C: { label: 'C', desc: '待培育 · 周期触达', color: 'hsl(220, 14%, 55%)', bg: 'hsl(220 14% 55% / 0.10)' },
};

/**
 * SABC 线索分级看板 + 流失预警（区块 ②）。
 *
 * 对象 = 线索（CLIENT.md「SABC 分级」边界已落档）。由 computeGrade 二维矩阵算出
 * S/A/B/C 分布：S5/A16/B35/C102 = 158。
 * 底部「S/A 级超期未触达 3 条」流失预警，与右下角智能进度提醒共用
 * 同一组 getOverdueSaWarnings 数据，不重复建模。
 */
export function SabcGradingCard() {
  const gradeCounts = useMemo(() => {
    const counts: Record<SabcGrade, number> = { S: 0, A: 0, B: 0, C: 0 };
    for (const lead of dashboardLeads) {
      counts[computeGrade(lead.intentLevel, lead.budgetEstimated)] += 1;
    }
    return counts;
  }, []);

  const warnings = useMemo(() => getOverdueSaWarnings(), []);
  const maxCount = Math.max(...(Object.values(gradeCounts) as number[]));

  return (
    <Card className="h-full flex-1 w-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">SABC 线索分级</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        {/* 4 格分级条 + 占据比条 */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          {(['S', 'A', 'B', 'C'] as SabcGrade[]).map((grade) => {
            const meta = gradeMeta[grade];
            const count = gradeCounts[grade];
            return (
              <div
                key={grade}
                className="rounded-lg p-3 border"
                style={{ background: meta.bg, borderColor: `${meta.color}22` }}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span
                    className="inline-flex items-center justify-center w-[22px] h-[22px] rounded-full text-white text-xs font-bold"
                    style={{ background: meta.color }}
                  >
                    {meta.label}
                  </span>
                  <span className="text-[11px] text-muted-foreground">{meta.desc}</span>
                </div>
                <div className="text-[22px] font-bold text-foreground leading-tight">
                  {count}
                  <span className="text-xs text-muted-foreground font-normal ml-1">户</span>
                </div>
                {/* 占据比条（相对 max 渲染，可视化金字塔分布） */}
                <div className="mt-2 h-1 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${maxCount > 0 ? (count / maxCount) * 100 : 0}%`,
                      background: meta.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* S/A 级高价值流失预警 */}
        <div className="p-3 rounded-lg border bg-red-50 border-red-200">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500" />
            <span className="text-xs font-semibold text-red-700">
              S/A 级高价值流失预警 · 当前 {warnings.length} 个沉淀
            </span>
          </div>
          {warnings.length === 0 ? (
            <div className="text-xs text-muted-foreground">暂无超期未触达的 S/A 级线索</div>
          ) : (
            <ul className="m-0 pl-[18px] flex flex-col gap-1">
              {warnings.map((w) => (
                <li key={w.id} className="text-xs text-foreground list-disc">
                  <span className="font-semibold">{w.entity}</span>
                  <span className="text-muted-foreground ml-1.5">· {w.suggestion}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
