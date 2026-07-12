import { Card, Select } from '@arco-design/web-react';
import { useMemo } from 'react';
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
    <Card
      title={
        <div className="flex items-center justify-between" style={{ width: '100%' }}>
          <span style={{ fontSize: 14, fontWeight: 500, color: 'hsl(220, 15%, 25%)' }}>
            销售人员线索分类分析
          </span>
          <Select
            defaultValue="team"
            style={{ width: 140 }}
            size="small"
            // TODO：未来接入团队管理模块——切换时按所选销售员过滤 dashboardLeads
            onChange={() => {
              // 占位不真切换
            }}
          >
            <Select.Option value="team">全团队</Select.Option>
            <Select.Option value="me">我（张经理）</Select.Option>
          </Select>
        </div>
      }
      style={{
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-xs)',
        border: '1px solid hsl(220, 12%, 88%)',
        marginBottom: 16,
        display: 'flex',
        flexDirection: 'column',
      }}
      bodyStyle={{ padding: '16px 20px 20px', flex: 1 }}
    >
      {/* 线索意向分布 + 预算区间分布 */}
      <div className="grid grid-cols-2 gap-4" style={{ marginBottom: 16 }}>
        {/* 左：线索意向分布 */}
        <div>
          <div style={{ fontSize: 13, fontWeight: 500, color: 'hsl(220, 12%, 30%)', marginBottom: 10 }}>
            线索意向分布（共 {totalLeads} 条）
          </div>
          {(Object.keys(intentCounts) as IntentLevel[]).map((level) => {
            const meta = intentMeta[level];
            const count = intentCounts[level];
            return (
              <div key={level} style={{ marginBottom: 8 }}>
                <div className="flex items-center justify-between" style={{ marginBottom: 4 }}>
                  <span style={{ fontSize: 12, color: 'hsl(220, 8%, 55%)' }}>{meta.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'hsl(220, 12%, 30%)' }}>
                    {count}个
                  </span>
                </div>
                <div
                  style={{
                    height: 6,
                    borderRadius: 3,
                    background: 'hsl(220, 14%, 90%)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${(count / maxIntent) * 100}%`,
                      background: meta.color,
                      borderRadius: 3,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* 右：预算区间分布 */}
        <div>
          <div style={{ fontSize: 13, fontWeight: 500, color: 'hsl(220, 12%, 30%)', marginBottom: 10 }}>
            预算区间分布
          </div>
          {BUDGET_TIERS.map((tier, i) => {
            const count = budgetCounts[i];
            return (
              <div key={tier.tier} style={{ marginBottom: 8 }}>
                <div className="flex items-center justify-between" style={{ marginBottom: 4 }}>
                  <span style={{ fontSize: 12, color: 'hsl(220, 8%, 55%)' }}>{tier.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'hsl(220, 12%, 30%)' }}>
                    {count}个
                  </span>
                </div>
                <div
                  style={{
                    height: 6,
                    borderRadius: 3,
                    background: 'hsl(220, 14%, 90%)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${(count / maxBudget) * 100}%`,
                      background: brandColors.blue,
                      borderRadius: 3,
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
        <div
          style={{
            padding: '14px 16px',
            background: 'hsl(221 83% 53% / 0.06)',
            border: `1px solid hsl(221 83% 53% / 0.22)`,
            borderRadius: 'var(--radius-md)',
          }}
        >
          <div style={{ fontSize: 12, color: 'hsl(220, 8%, 55%)', marginBottom: 6 }}>
            Budget Outlook（线索总预算）
          </div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: brandColors.blue,
              lineHeight: 1.1,
            }}
          >
            ¥{(totalBudget / 1_000_000).toFixed(2)}万
          </div>
          <div style={{ fontSize: 11, color: 'hsl(220, 8%, 55%)', marginTop: 4 }}>
            活跃跟进中 ¥{(activeBudget / 1_000_000).toFixed(2)}万
          </div>
        </div>

        <div
          style={{
            padding: '14px 16px',
            background: 'hsl(142 76% 36% / 0.06)',
            border: `1px solid hsl(142 76% 36% / 0.22)`,
            borderRadius: 'var(--radius-md)',
          }}
        >
          <div style={{ fontSize: 12, color: 'hsl(220, 8%, 55%)', marginBottom: 6 }}>
            线索成长性（高意向转化率）
          </div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: brandColors.green,
              lineHeight: 1.1,
            }}
          >
            {conversion}%
            <span style={{ fontSize: 12, color: brandColors.green, fontWeight: 600, marginLeft: 6 }}>
              +2.4% 环比
            </span>
          </div>
          <div style={{ fontSize: 11, color: brandColors.green, marginTop: 4 }}>
            推进效率非常优秀
          </div>
        </div>
      </div>
    </Card>
  );
}
