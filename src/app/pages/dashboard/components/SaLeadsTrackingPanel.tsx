import { Card, Tag } from '@arco-design/web-react';
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
    <Card
      title={
        <span style={{ fontSize: 14, fontWeight: 500, color: 'hsl(220, 15%, 25%)' }}>
          S/A 级线索深度追踪
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
      <div className="flex flex-col gap-3">
        {trackedSaLeads.map((lead) => {
          const intent = intentTone[lead.intentLevel];
          const entityToShow = lead.entity ?? lead.name;
          return (
            <div
              key={lead.id}
              style={{
                padding: '12px 14px',
                border: '1px solid hsl(220, 12%, 88%)',
                borderRadius: 'var(--radius-md)',
                background: 'hsl(220, 14%, 98%)',
              }}
            >
              {/* 标题行：客户主体名 + 进展阶段 */}
              <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: 'hsl(220, 20%, 10%)' }}>
                  {entityToShow}
                </span>
                <Tag color="arcoblue" size="small">
                  {stageLabel(lead.leadStage)}
                </Tag>
              </div>

              {/* 跟进人 / 跟进频次 / 意向度 */}
              <div
                className="flex items-center gap-3"
                style={{ fontSize: 12, color: 'hsl(220, 8%, 55%)', marginBottom: 6 }}
              >
                <span>跟进人「{lead.owner}」</span>
                <span>·</span>
                <span>
                  频次 {lead.followFreqPerWeek}次/周 / {lead.trackedDays}天
                </span>
                <span>·</span>
                <span style={{ color: intent.color, fontWeight: 600 }}>
                  意向{intent.text}
                </span>
              </div>

              {/* 方案状态 / 客户预算 */}
              <div
                style={{
                  fontSize: 12,
                  color: 'hsl(220, 12%, 30%)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  marginBottom: 6,
                }}
              >
                <span
                  style={{
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'hsl(221 83% 53% / 0.10)',
                    color: brandColors.blue,
                    fontWeight: 600,
                  }}
                >
                  已推方案 {lead.proposalVersions}版
                </span>
                <span style={{ color: 'hsl(220, 8%, 55%)' }}>
                  预算 ¥{(lead.budgetEstimated / 10000).toFixed(0)}万
                </span>
              </div>

              {/* 最新进展 */}
              <p
                style={{
                  fontSize: 12,
                  color: 'hsl(220, 12%, 30%)',
                  margin: 0,
                  lineHeight: 1.5,
                  fontStyle: 'italic',
                }}
              >
                "{lead.latestProgress}"
              </p>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
