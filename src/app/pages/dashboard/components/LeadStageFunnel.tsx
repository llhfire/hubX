import { Card } from '@arco-design/web-react';
import { useMemo } from 'react';
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
    <Card
      title={
        <div className="flex items-center gap-2">
          <span style={{ fontSize: 14, fontWeight: 500, color: 'hsl(220, 15%, 25%)' }}>
            跟进过程漏斗
          </span>
          <span
            style={{
              fontSize: 11,
              fontWeight: 500,
              color: 'hsl(221, 83%, 53%)',
              padding: '2px 8px',
              borderRadius: 'var(--radius-sm)',
              background: 'hsl(221 83% 53% / 0.10)',
            }}
          >
            Stage Monitoring Active
          </span>
        </div>
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
      {/* 横向漏斗主体：4 段递减条形 */}
      <div className="flex flex-col gap-2" style={{ marginBottom: 16 }}>
        {mainStages.map((stage) => {
          const widthPercent = maxCount > 0 ? (stage.count / maxCount) * 100 : 0;
          const isHighlighted = !!stage.highlight;
          return (
            <div key={stage.stage} className="flex items-center gap-3">
              <span
                style={{
                  width: 64,
                  fontSize: 12,
                  color: 'hsl(220, 8%, 55%)',
                  flexShrink: 0,
                  textAlign: 'right',
                }}
              >
                {stage.label}
              </span>
              <div style={{ flex: 1, height: 28, borderRadius: 4, overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${widthPercent}%`,
                    minWidth: 32,
                    height: '100%',
                    background: isHighlighted
                      ? brandColors[stage.stage]
                      : `${brandColors[stage.stage]}CC`,
                    display: 'flex',
                    alignItems: 'center',
                    paddingLeft: 10,
                    borderRadius: 4,
                    color: '#fff',
                    fontSize: 12,
                    fontWeight: 600,
                    transition: 'width 0.3s ease',
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
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '10px 14px',
          background: 'hsl(0 78% 50% / 0.06)',
          border: `1px solid hsl(0 78% 50% / 0.22)`,
          borderRadius: 'var(--radius-md)',
        }}
      >
        <span
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: 'hsl(0, 60%, 40%)',
          }}
        >
          {lostStage.label}
        </span>
        <span
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: 'hsl(0, 78%, 50%)',
          }}
        >
          {lostStage.count}
        </span>
        <span style={{ fontSize: 12, color: 'hsl(220, 8%, 55%)' }}>已入垃圾线索池累计</span>
      </div>
    </Card>
  );
}
