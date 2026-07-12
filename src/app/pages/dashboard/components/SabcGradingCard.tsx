import { Card, Empty } from '@arco-design/web-react';
import { useMemo } from 'react';
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
    <Card
      title={
        <span style={{ fontSize: 14, fontWeight: 500, color: 'hsl(220, 15%, 25%)' }}>
          SABC 线索分级
        </span>
      }
      style={{
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-xs)',
        border: '1px solid hsl(220, 12%, 88%)',
        height: '100%',
        flex: 1,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
      bodyStyle={{ padding: '16px 20px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}
    >
      {/* 4 格分级条 + 占据比条 */}
      <div className="grid grid-cols-4 gap-3" style={{ marginBottom: 16 }}>
        {(['S', 'A', 'B', 'C'] as SabcGrade[]).map((grade) => {
          const meta = gradeMeta[grade];
          const count = gradeCounts[grade];
          return (
            <div
              key={grade}
              style={{
                background: meta.bg,
                borderRadius: 'var(--radius-md)',
                padding: '12px 12px',
                border: `1px solid ${meta.color}22`,
              }}
            >
              <div className="flex items-center gap-2" style={{ marginBottom: 6 }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    background: meta.color,
                    color: '#fff',
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  {meta.label}
                </span>
                <span style={{ fontSize: 11, color: 'hsl(220, 8%, 55%)' }}>{meta.desc}</span>
              </div>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: 'hsl(220, 20%, 10%)',
                  lineHeight: 1.1,
                }}
              >
                {count}
                <span style={{ fontSize: 12, color: 'hsl(220, 8%, 55%)', fontWeight: 400, marginLeft: 4 }}>
                  户
                </span>
              </div>
              {/* 占据比条（相对 max 渲染，可视化金字塔分布） */}
              <div
                style={{
                  marginTop: 8,
                  height: 4,
                  borderRadius: 2,
                  background: 'hsl(220, 14%, 90%)',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${maxCount > 0 ? (count / maxCount) * 100 : 0}%`,
                    background: meta.color,
                    borderRadius: 2,
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* S/A 级高价值流失预警 */}
      <div
        style={{
          padding: '10px 14px',
          background: 'hsl(0 78% 50% / 0.06)',
          border: `1px solid hsl(0 78% 50% / 0.22)`,
          borderRadius: 'var(--radius-md)',
        }}
      >
        <div className="flex items-center gap-2" style={{ marginBottom: 6 }}>
          <span
            style={{
              display: 'inline-block',
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: 'hsl(0, 78%, 50%)',
            }}
          />
          <span style={{ fontSize: 12, fontWeight: 600, color: 'hsl(0, 60%, 40%)' }}>
            S/A 级高价值流失预警 · 当前 {warnings.length} 个沉淀
          </span>
        </div>
        {warnings.length === 0 ? (
          <Empty description="暂无超期未触达的 S/A 级线索" />
        ) : (
          <ul style={{ margin: 0, paddingLeft: 18 }} className="flex flex-col gap-1">
            {warnings.map((w) => (
              <li
                key={w.id}
                style={{ fontSize: 12, color: 'hsl(220, 12%, 30%)', listStyle: 'disc' }}
              >
                <span style={{ fontWeight: 600 }}>{w.entity}</span>
                <span style={{ color: 'hsl(220, 8%, 55%)', marginLeft: 6 }}>· {w.suggestion}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Card>
  );
}
