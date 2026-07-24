import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';
import { dashboardLeads } from '../mentalModel.mock';
import { BUDGET_TIERS, type IntentLevel } from '../types';

const brandColors = {
  blue: 'hsl(221, 83%, 53%)',
  green: 'hsl(142, 76%, 36%)',
  amber: 'hsl(30, 90%, 44%)',
  red: 'hsl(0, 78%, 50%)',
  gray: 'hsl(220, 14%, 55%)',
};

const intentMeta: Record<IntentLevel, { label: string; color: string }> = {
  high: { label: '高意向', color: brandColors.blue },
  mid: { label: '中意向', color: brandColors.amber },
  low: { label: '低意向', color: brandColors.gray },
  none: { label: '无意向', color: 'hsl(220 14% / 70%)' },
};

/**
 * 销售人员线索分类分析（区块 ④）。
 *
 * 数据全部从 dashboardLeads 单事实源派生，总数 = 158 与区块②对齐。
 * 销售人员选择器仅"全团队 / 我（张经理）"两选项，占位不真切换
 * （详见 plan §4 + 访谈问题 9 决策）。
 */
export function SalesLeadAnalysisPanel() {
  const totalLeads = dashboardLeads.length;

  // 聚合：线索意向分布（dashboardLeads 的 intentLevel 分桶）
  const intentCounts = useMemo(() => {
    const counts: Record<IntentLevel, number> = { high: 0, mid: 0, low: 0, none: 0 };
    for (const lead of dashboardLeads) {
      counts[lead.intentLevel] += 1;
    }
    return counts;
  }, []);

  // 聚合：预算区间分布（5 档）
  const budgetCounts = useMemo(() => {
    const counts = BUDGET_TIERS.map(() => 0);
    for (const lead of dashboardLeads) {
      const idx = BUDGET_TIERS.findIndex(
        (t) => lead.budgetEstimated >= t.min && lead.budgetEstimated < t.max,
      );
      if (idx >= 0) counts[idx] += 1;
    }
    return counts;
  }, []);
  const maxBudget = Math.max(...budgetCounts, 1);

  // 聚合：Budget Outlook（总预算 / 活跃跟进中 = 已入流失池过滤）
  const { totalBudget, activeBudget } = useMemo(() => {
    let total = 0;
    let active = 0;
    for (const lead of dashboardLeads) {
      total += lead.budgetEstimated;
      if (lead.leadStage !== 'lost') {
        active += lead.budgetEstimated;
      }
    }
    return { totalBudget: total, activeBudget: active };
  }, []);

  // 聚合：线索成长性（高意向转化率 = 高意向线索 / 全部线索）
  const conversion = useMemo(() => {
    const high = dashboardLeads.filter((l) => l.intentLevel === 'high').length;
    return totalLeads > 0 ? ((high / totalLeads) * 100).toFixed(1) : '0.0';
  }, [totalLeads]);

  const maxIntent = Math.max(...Object.values(intentCounts), 1);

  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex items-center justify-between w-full">
          <CardTitle className="text-sm font-medium">销售人员线索分类分析</CardTitle>
          <Select defaultValue="team">
            <SelectTrigger className="w-[140px] h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="team">全团队</SelectItem>
              <SelectItem value="me">我（张经理）</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {/* 线索意向分布 + 预算区间分布 */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* 左：线索意向分布 */}
          <div>
            <div className="text-[13px] font-medium text-foreground mb-2.5">
              线索意向分布（共 {totalLeads} 条）
            </div>
            {(Object.keys(intentCounts) as IntentLevel[]).map((level) => {
              const meta = intentMeta[level];
              const count = intentCounts[level];
              return (
                <div key={level} className="mb-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground">{meta.label}</span>
                    <span className="text-xs font-semibold text-foreground">
                      {count}个
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(count / maxIntent) * 100}%`,
                        background: meta.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* 右：预算区间分布 */}
          <div>
            <div className="text-[13px] font-medium text-foreground mb-2.5">
              预算区间分布
            </div>
            {BUDGET_TIERS.map((tier, i) => {
              const count = budgetCounts[i];
              return (
                <div key={tier.tier} className="mb-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground">{tier.label}</span>
                    <span className="text-xs font-semibold text-foreground">
                      {count}个
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-blue-500"
                      style={{
                        width: `${(count / maxBudget) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Budget Outlook 大卡 + 线索成长性 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="text-xs text-muted-foreground mb-1.5">
              Budget Outlook（线索总预算）
            </div>
            <div className="text-[22px] font-bold text-blue-600 leading-tight">
              ¥{(totalBudget / 1_000_000).toFixed(2)}万
            </div>
            <div className="text-[11px] text-muted-foreground mt-1">
              活跃跟进中 ¥{(activeBudget / 1_000_000).toFixed(2)}万
            </div>
          </div>

          <div className="p-3.5 bg-green-50 border border-green-200 rounded-lg">
            <div className="text-xs text-muted-foreground mb-1.5">
              线索成长性（高意向转化率）
            </div>
            <div className="text-[22px] font-bold text-green-600 leading-tight">
              {conversion}%
              <span className="text-xs font-semibold text-green-600 ml-1.5">
                +2.4% 环比
              </span>
            </div>
            <div className="text-[11px] text-green-600 mt-1">
              推进效率非常优秀
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
