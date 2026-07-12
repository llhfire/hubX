import { Card } from '@arco-design/web-react';
import { efficiencyMetrics, efficiencySuggestion } from '../efficiency.mock';

const brandColors = {
  blue: 'hsl(221, 83%, 53%)',
  green: 'hsl(142, 76%, 36%)',
  amber: 'hsl(30, 90%, 44%)',
  red: 'hsl(0, 78%, 50%)',
};

/**
 * 效率健康度看板（区块 ④）。
 *
 * 4 个诊断指标：平均跟进间隔 / 平均阶段推进周期 / 平均成单周期 / 整体流失率。
 * 底部智能建议 = 单段静态字符串 + TODO 规则引擎（详见 plan §2 区块 ④）。
 */
export function EfficiencyBoard() {
  return (
    <Card
      title={
        <span style={{ fontSize: 14, fontWeight: 500, color: 'hsl(220, 15%, 25%)' }}>
          效率健康度
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
      {/* 4 个指标卡 */}
      <div className="grid grid-cols-4 gap-3" style={{ marginBottom: 16 }}>
        {efficiencyMetrics.map((metric, i) => {
          const dotColors = [brandColors.blue, brandColors.green, brandColors.amber, brandColors.red];
          return (
            <div
              key={metric.key}
              style={{
                background: 'hsl(220, 14%, 96%)',
                borderRadius: 'var(--radius-md)',
                padding: '12px 14px',
              }}
            >
              <div className="flex items-center gap-2" style={{ marginBottom: 8 }}>
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: dotColors[i % dotColors.length],
                  }}
                />
                <span style={{ fontSize: 12, color: 'hsl(220, 8%, 55%)' }}>{metric.label}</span>
              </div>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: 'hsl(220, 20%, 10%)',
                  lineHeight: 1.1,
                }}
              >
                {metric.value}
              </div>
              {metric.delta ? (
                <div style={{ fontSize: 11, color: 'hsl(0, 78%, 50%)', marginTop: 4 }}>
                  {metric.delta} 环比
                </div>
              ) : (
                <div style={{ fontSize: 11, color: 'hsl(220, 8%, 55%)', marginTop: 4 }}>
                  — 基准期
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 智能建议 */}
      <div
        style={{
          padding: '10px 14px',
          background: 'hsl(221 83% 53% / 0.06)',
          border: `1px solid hsl(221 83% 53% / 0.22)`,
          borderRadius: 'var(--radius-md)',
        }}
      >
        <div className="flex items-center gap-2" style={{ marginBottom: 4 }}>
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: 'hsl(221, 83%, 53%)',
            }}
          >
            💡 系统智能建议
          </span>
          {/* TODO：未来接入规则引擎根据漏斗数据动态生成建议 */}
        </div>
        <p style={{ fontSize: 12, color: 'hsl(220, 12%, 30%)', margin: 0, lineHeight: 1.6 }}>
          {efficiencySuggestion}
        </p>
      </div>
    </Card>
  );
}
